// src/features/realtime-cam/hooks/useRealtimeAnalysis.ts
import { useState, useRef, useCallback, useEffect } from 'react';
import { realtimeCamApi } from '../api/realtime-cam.api';
import { useFrameCapture } from './useFrameCapture';
import type { DetectionEvent, CamStatus } from '../types/realtime-cam.types';

export const useRealtimeAnalysis = (
    videoRef: React.RefObject<HTMLVideoElement>,
    camStatus: CamStatus,
    setCamStatus: (s: CamStatus) => void,
    options: { intervalMs?: number; onDetection?: (events: DetectionEvent[]) => void } = {}
) => {
    const { intervalMs = 2000, onDetection } = options;
    const { captureFrame } = useFrameCapture();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isRunningRef = useRef(false);

    const startAnalysis = useCallback(async () => {
        if (camStatus !== 'active' || isRunningRef.current) return;

        const session = await realtimeCamApi.startSession();
        if (session) setSessionId(session.session_id);

        isRunningRef.current = true;
        setIsAnalyzing(true);
        setCamStatus('analyzing');

        intervalRef.current = setInterval(async () => {
            if (!videoRef.current || !isRunningRef.current) return;

            const frame = captureFrame(videoRef.current);
            if (!frame) return;

            try {
                const result = await realtimeCamApi.analyzeFrame({
                    frame_base64: frame,
                    session_id: sessionId ?? undefined,
                    timestamp: Date.now(),
                });
                if (result.events.length > 0) onDetection?.(result.events);
            } catch { /* Bỏ qua lỗi mạng nhất thời */ }
        }, intervalMs);
    }, [camStatus, captureFrame, intervalMs, onDetection, sessionId, setCamStatus, videoRef]);

    const stopAnalysis = useCallback(async () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        isRunningRef.current = false;
        setIsAnalyzing(false);

        if (sessionId) {
            await realtimeCamApi.endSession(sessionId);
            setSessionId(null);
        }
        setCamStatus('active');
    }, [sessionId, setCamStatus]);

    useEffect(() => {
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, []);

    return { isAnalyzing, startAnalysis, stopAnalysis };
};