// src/features/realtime-cam/hooks/useDetectionHistory.ts
import { useState, useCallback } from 'react';
import type { DetectionEvent } from '../types/realtime-cam.types';

const MAX_HISTORY = 50;

export const useDetectionHistory = () => {
    const [events, setEvents] = useState<DetectionEvent[]>([]);

    const addEvents = useCallback((newEvents: DetectionEvent[]) => {
        setEvents(prev => [...newEvents, ...prev].slice(0, MAX_HISTORY));
    }, []);

    const clearHistory = useCallback(() => setEvents([]), []);
    const highConfidenceCount = events.filter(e => e.score >= 0.8).length;

    return { events, addEvents, clearHistory, highConfidenceCount };
};