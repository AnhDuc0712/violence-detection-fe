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
                const existingIndex = merged.findIndex((item) => item.id === alert.id);
                if (existingIndex >= 0) {
                    merged[existingIndex] = {
                        ...merged[existingIndex],
                        ...alert,
                    };
                    return;
                }

                merged.unshift(alert);
            });

            const now = Date.now();
            const RESOLVED_TTL_MS = 8000;
            const pruned = merged.filter((item) => {
                if (item.alert_state !== 'RESOLVED') {
                    return true;
                }
                return now - (item.timestamp ?? now) <= RESOLVED_TTL_MS;
            });

            return pruned
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, MAX_HISTORY);
        });
    }, []);

    const clearHistory = useCallback(() => setAlerts([]), []);

    const recentWindow = alerts.slice(0, 5);

    const violentCount = recentWindow.filter(
        (alert) => alert.event_type === 'violent' && alert.alert_state !== 'RESOLVED',
    ).length;

    const smoothedLabel = violentCount >= 3 ? 'violent' : 'normal';

    const avgConfidence =
        recentWindow.reduce((sum, alert) => sum + alert.score, 0) /
        (recentWindow.length || 1);

    const isAlerting = smoothedLabel === 'violent' && avgConfidence > 0.7;

    const highConfidenceCount = alerts.filter(
        (alert) => alert.event_type === 'violent' && alert.score >= 0.8 && alert.alert_state !== 'RESOLVED'
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
