import { useState, useRef, useCallback, useEffect, type RefObject } from 'react';
import { realtimeCamApi } from '../api/realtime-cam.api';
import { useFrameCapture } from './useFrameCapture';
import type { DetectionEvent, CamStatus, RealtimePerson } from '../types/realtime-cam.types';

// 🔧 Hằng số cấu hình (dễ điều chỉnh)
const FRAME_SKIP_INTERVAL = 5; // gửi đi phân tích mỗi 5 frame (~1.5s nếu capture 30fps + interval 300ms)
const DEFAULT_CAPTURE_INTERVAL_MS = 300;
const RETRY_DELAY_MS = 120;

export const useRealtimeAnalysis = (
    videoRef: RefObject<HTMLVideoElement>,
    camStatus: CamStatus,
    setCamStatus: (status: CamStatus) => void,
    options: { intervalMs?: number; onAlerts?: (alerts: DetectionEvent[]) => void } = {}
) => {
    const { intervalMs = DEFAULT_CAPTURE_INTERVAL_MS, onAlerts } = options;
    const { captureFrame } = useFrameCapture();

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [people, setPeople] = useState<RealtimePerson[]>([]);
    const [latencyMs, setLatencyMs] = useState(0);

    const wsRef = useRef<WebSocket | null>(null);
    const sendTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const awaitingResponseRef = useRef(false);
    const manualStopRef = useRef(false);
    const frameCounterRef = useRef(0);

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
                scheduleNextFrame(RETRY_DELAY_MS);
                return;
            }

            const frame = captureFrame(videoRef.current);
            if (!frame) {
                scheduleNextFrame(RETRY_DELAY_MS);
                return;
            }

            // ✅ Frame skip: chỉ gửi mỗi 5 frame (giảm tải AI)
            frameCounterRef.current++;
            if (frameCounterRef.current % FRAME_SKIP_INTERVAL !== 0) {
                scheduleNextFrame(intervalMs);
                return;
            }

            console.log(`📤 [WS] Sending frame #${frameCounterRef.current} (skip ratio ${FRAME_SKIP_INTERVAL}:1)`);
            awaitingResponseRef.current = true;

            try {
                ws.send(JSON.stringify({ image: frame, timestamp: Date.now() }));
            } catch (err) {
                console.error("❌ [WS] Send error:", err);
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
        frameCounterRef.current = 0;
        setPeople([]);
        setLatencyMs(0);

        const wsUrl = realtimeCamApi.getWebSocketUrl();
        console.log("🔗 [WS] Connecting to:", wsUrl);

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            if (wsRef.current !== ws) return;
            console.log("✅ [WS] Connected successfully!");
            setIsAnalyzing(true);
            setCamStatus('analyzing');
            scheduleNextFrame(0);
        };

        ws.onmessage = (event) => {
            if (wsRef.current !== ws) return;
            awaitingResponseRef.current = false;

            try {
                const data = realtimeCamApi.normalizeResponse(JSON.parse(event.data));
                setPeople(data.people);
                setLatencyMs(data.latency_ms);

                if (data.alerts.length > 0) {
                    onAlerts?.(data.alerts);
                }
            } catch (err) {
                console.error("❌ [WS] Error parsing data:", err);
                setPeople([]);
                setLatencyMs(0);
            }

            scheduleNextFrame(intervalMs);
        };

        ws.onclose = () => {
            console.log("🔴 [WS] Connection closed");
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
            console.error("⚠️ [WS] Network error:", err);
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
        frameCounterRef.current = 0;
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