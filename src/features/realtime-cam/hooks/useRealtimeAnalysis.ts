import { useState, useRef, useCallback, useEffect, type RefObject } from 'react';
import { realtimeCamApi } from '../api/realtime-cam.api';
import { useFrameCapture } from './useFrameCapture';
import type { DetectionEvent, CamStatus, RealtimePerson } from '../types/realtime-cam.types';

const FRAME_SKIP_INTERVAL = 5;
const DEFAULT_CAPTURE_INTERVAL_MS = 300;
const RETRY_DELAY_MS = 120;

export const useRealtimeAnalysis = (
    videoRef: RefObject<HTMLVideoElement>,
    camStatus: CamStatus,
    setCamStatus: (status: CamStatus) => void,
    options: { intervalMs?: number; onAlerts?: (alerts: DetectionEvent[]) => void } = {},
) => {
    const { intervalMs = DEFAULT_CAPTURE_INTERVAL_MS, onAlerts } = options;
    const { captureFrame } = useFrameCapture();

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [peopleCount, setPeopleCount] = useState(0);
    const [latencyMs, setLatencyMs] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);

    const peopleRef = useRef<RealtimePerson[]>([]);
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

            frameCounterRef.current += 1;
            if (frameCounterRef.current % FRAME_SKIP_INTERVAL !== 0) {
                scheduleNextFrame(intervalMs);
                return;
            }

            awaitingResponseRef.current = true;
            try {
                ws.send(JSON.stringify({ image: frame, timestamp: Date.now() }));
            } catch (err) {
                console.error('[WS] Send error:', err);
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
        peopleRef.current = [];
        setPeopleCount(0);
        setLatencyMs(0);
        setSessionId(null);

        const ws = new WebSocket(realtimeCamApi.getWebSocketUrl());

        ws.onopen = () => {
            if (wsRef.current !== ws) {
                return;
            }
            setIsAnalyzing(true);
            setIsConnected(true);
            setCamStatus('analyzing');
            scheduleNextFrame(0);
        };

        ws.onmessage = (event) => {
            if (wsRef.current !== ws) {
                return;
            }
            awaitingResponseRef.current = false;

            try {
                const data = realtimeCamApi.normalizeResponse(JSON.parse(event.data));
                peopleRef.current = data.people;
                setPeopleCount(data.people.length);
                setLatencyMs(data.latency_ms);
                setIsConnected(true);
                setSessionId(data.session_id ?? null);

                if (data.people.length > 0) {
                    // Task #14: Performance logging
                    console.debug(
                        '[realtime-v2] frame',
                        data.people.map((person) => ({
                            track_id: person.track_id,
                            identity: person.identity,
                            identity_locked: person.identity_locked,
                            votes: person.identity_votes_count,
                            raw_prob: person.raw_prob.toFixed(3),
                            bilstm_prob: person.bilstm_prob.toFixed(3),
                            xgb_prob: person.xgb_prob.toFixed(3),
                            ema_prob: person.violence_prob.toFixed(3),
                            state: person.label,
                            violence: person.violence_state,
                            interaction: person.interaction_score.toFixed(3),
                            status: person.status,
                        })),
                    );
                    
                    // Log latency
                    if (frameCounterRef.current % 30 === 0) {  // Every ~30 frames
                        console.debug(`[PERF] E2E latency: ${data.latency_ms}ms, people: ${data.people.length}`);
                    }
                }

                if (data.alerts.length > 0) {
                    onAlerts?.(data.alerts);
                }
            } catch (err) {
                console.error('[WS] Error parsing data:', err);
                peopleRef.current = [];
                setPeopleCount(0);
                setLatencyMs(0);
            }

            scheduleNextFrame(intervalMs);
        };

        ws.onclose = () => {
            clearLoop();
            if (wsRef.current === ws) {
                wsRef.current = null;
            }

            setIsAnalyzing(false);
            setIsConnected(false);
            peopleRef.current = [];
            setPeopleCount(0);
            setLatencyMs(0);
            setSessionId(null);

            if (manualStopRef.current) {
                manualStopRef.current = false;
                return;
            }
            setCamStatus('disconnected');
        };

        ws.onerror = (err) => {
            console.error('[WS] Network error:', err);
            setIsConnected(false);
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
        setIsConnected(false);
        peopleRef.current = [];
        setPeopleCount(0);
        setLatencyMs(0);
        setSessionId(null);
        setCamStatus('active');
        frameCounterRef.current = 0;
    }, [clearLoop, setCamStatus]);

    useEffect(() => {
        if (camStatus === 'idle' || camStatus === 'error') {
            peopleRef.current = [];
            setPeopleCount(0);
            setLatencyMs(0);
            setIsConnected(false);
            setSessionId(null);
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

    return {
        isAnalyzing,
        peopleRef,
        peopleCount,
        latencyMs,
        isConnected,
        sessionId,
        wsActiveCount: isConnected ? 1 : 0,
        startAnalysis,
        stopAnalysis,
    };
};
