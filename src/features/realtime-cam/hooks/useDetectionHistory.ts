// src/features/realtime-cam/hooks/useDetectionHistory.ts
import { useState, useCallback } from 'react';
import type { DetectionEvent } from '../types/realtime-cam.types';

const MAX_HISTORY = 50;

export const useDetectionHistory = () => {
    const [alerts, setAlerts] = useState<DetectionEvent[]>([]);

    const addAlerts = useCallback((newAlerts: DetectionEvent[]) => {
        setAlerts(prev => {
            const merged = [...prev];

            newAlerts.forEach((alert) => {
                const last = merged[0];

                if (
                    last &&
                    last.event_type === alert.event_type &&
                    Math.abs(last.timestamp - alert.timestamp) < 1000
                ) {
                    return;
                }

                merged.unshift(alert);
            });

            return merged.slice(0, MAX_HISTORY);
        });
    }, []);

    const clearHistory = useCallback(() => setAlerts([]), []);

    const recentWindow = alerts.slice(0, 5);

    const violentCount = recentWindow.filter((alert) => alert.event_type === 'violent').length;

    const smoothedLabel = violentCount >= 3 ? 'violent' : 'normal';

    const avgConfidence =
        recentWindow.reduce((sum, alert) => sum + alert.score, 0) /
        (recentWindow.length || 1);

    const isAlerting = smoothedLabel === 'violent' && avgConfidence > 0.7;

    const highConfidenceCount = alerts.filter(
        (alert) => alert.event_type === 'violent' && alert.score >= 0.8
    ).length;

    return {
        alerts,
        addAlerts,
        clearHistory,
        highConfidenceCount,
        smoothedLabel,
        avgConfidence,
        isAlerting
    };
};
