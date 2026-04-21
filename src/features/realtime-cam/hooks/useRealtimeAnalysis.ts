import { useState, useRef, useCallback, useEffect, type RefObject } from 'react';
import { realtimeCamApi } from '../api/realtime-cam.api';
import { useFrameCapture } from './useFrameCapture';
import type { DetectionEvent, CamStatus, RealtimePerson } from '../types/realtime-cam.types';

// ... (Giữ nguyên function useRealtimeAnalysisLegacy nếu sếp vẫn cần lưu trữ) ...

export const useRealtimeAnalysis = (
    videoRef: RefObject<HTMLVideoElement>,
    camStatus: CamStatus,
    setCamStatus: (status: CamStatus) => void,
    options: { intervalMs?: number; onAlerts?: (alerts: DetectionEvent[]) => void } = {}
) => {
    const { intervalMs = 300, onAlerts } = options;
    const { captureFrame } = useFrameCapture();

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [people, setPeople] = useState<RealtimePerson[]>([]);
    const [latencyMs, setLatencyMs] = useState(0);

    const wsRef = useRef<WebSocket | null>(null);
    const sendTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const awaitingResponseRef = useRef(false);
    const manualStopRef = useRef(false);

    const clearLoop = useCallback(() => {
        if (sendTimeoutRef.current) {
            clearTimeout(sendTimeoutRef.current);
            sendTimeoutRef.current = null;
        }
        awaitingResponseRef.current = false;
    }, []);

    const scheduleNextFrame = useCallback((delayMs = intervalMs) => {
        if (sendTimeoutRef.current) {
            clearTimeout(sendTimeoutRef.current);
        }

        sendTimeoutRef.current = setTimeout(() => {
            sendTimeoutRef.current = null;

            const ws = wsRef.current;
            if (!ws || ws.readyState !== WebSocket.OPEN || awaitingResponseRef.current || manualStopRef.current) {
                return;
            }

            if (!videoRef.current) {
                scheduleNextFrame(120);
                return;
            }

            const frame = captureFrame(videoRef.current);
            if (!frame) {
                scheduleNextFrame(120);
                return;
            }

            awaitingResponseRef.current = true;

            try {
                ws.send(JSON.stringify({ image: frame, timestamp: Date.now() }));
            } catch {
                awaitingResponseRef.current = false;
                ws.close();
            }
        }, delayMs);
    }, [captureFrame, intervalMs, videoRef]);

    const startAnalysis = useCallback(() => {
        if (!['active', 'disconnected'].includes(camStatus) || wsRef.current) {
            return;
        }

        manualStopRef.current = false;
        setPeople([]);
        setLatencyMs(0);

        // 🔥 FIX QUAN TRỌNG: Lấy URL và khử trùng (Sanitize) ngay tại đây
        let rawUrl = realtimeCamApi.getWebSocketUrl();
        // Xóa khoảng trắng thừa 2 đầu
        let safeUrl = rawUrl.trim(); 
        // Khắc phục lỗi double scheme nếu API_BASE_URL bị lỗi " https://"
        safeUrl = safeUrl.replace('ws:// https://', 'wss://').replace('ws:// http://', 'ws://');

        // 🚀 ĐỂ TEST LOCAL BƯỚC 1, SẾP HÃY BỎ COMMENT DÒNG DƯỚI ĐÂY:
        safeUrl = "ws://127.0.0.1:8000/api/v1/realtime/ws/realtime";

        console.log("🔗 [WS] Đang thử kết nối tới URL SẠCH:", safeUrl);

        const ws = new WebSocket(safeUrl);

        ws.onopen = () => {
            if (wsRef.current !== ws) return;

            console.log("✅ [WS] CONNECTED SUCCESS!");
            setIsAnalyzing(true);
            setCamStatus('analyzing');
            scheduleNextFrame(0);
        };

        ws.onmessage = (event) => {
            if (wsRef.current !== ws) return;

            awaitingResponseRef.current = false; // Mở khóa cho frame tiếp theo

            try {
                const data = realtimeCamApi.normalizeResponse(JSON.parse(event.data));
                setPeople(data.people);
                setLatencyMs(data.latency_ms);

                if (data.alerts.length > 0) {
                    onAlerts?.(data.alerts);
                }
            } catch (err) {
                console.error("❌ [WS] Lỗi parse data:", err);
                setPeople([]);
                setLatencyMs(0);
            }

            scheduleNextFrame(intervalMs);
        };

        ws.onclose = () => {
            console.log("🔴 [WS] CLOSED");
            clearLoop();
            if (wsRef.current === ws) {
                wsRef.current = null;
            }

            setIsAnalyzing(false);
            setPeople([]);
            setLatencyMs(0);

            if (manualStopRef.current) {
                manualStopRef.current = false;
                return;
            }

            setCamStatus('disconnected');
        };

        ws.onerror = (err) => {
            console.error("⚠️ [WS] LỖI MẠNG (Check lại URL hoặc Vercel chặn WS):", err);
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
            }
        };

        wsRef.current = ws;
    }, [camStatus, clearLoop, intervalMs, onAlerts, scheduleNextFrame, setCamStatus]);

    const stopAnalysis = useCallback(() => {
        manualStopRef.current = true;
        clearLoop();

        const ws = wsRef.current;
        wsRef.current = null;

        if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
            ws.close();
        }

        setIsAnalyzing(false);
        setPeople([]);
        setLatencyMs(0);
        setCamStatus('active');
    }, [clearLoop, setCamStatus]);

    useEffect(() => {
        if (camStatus === 'idle' || camStatus === 'error') {
            setPeople([]);
            setLatencyMs(0);
        }
    }, [camStatus]);

    useEffect(() => {
        return () => {
            manualStopRef.current = true;
            clearLoop();

            const ws = wsRef.current;
            wsRef.current = null;

            if (ws) {
                ws.onopen = null;
                ws.onmessage = null;
                ws.onerror = null;
                ws.onclose = null;
                ws.close();
            }
        };
    }, [clearLoop]);

    return { isAnalyzing, people, latencyMs, startAnalysis, stopAnalysis };
};