// src/features/realtime-cam/api/realtime-cam.api.ts
import type { AnalysisFrameResponse, DetectionEvent, RealtimePerson } from '../types/realtime-cam.types';

const REALTIME_PATH = '/api/v1/realtime/ws/realtime';

const toSafeNumber = (value: unknown, fallback = 0) => {
    const next = Number(value);
    return Number.isFinite(next) ? next : fallback;
};

const normalizePeople = (value: unknown): RealtimePerson[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((person) => {
            if (!person || typeof person !== 'object') {
                return null;
            }

            const record = person as Record<string, unknown>;
            const rawKeypoints = Array.isArray(record.keypoints) ? record.keypoints : [];
            const rawBbox = Array.isArray(record.bbox) ? record.bbox : null;

            const keypoints = rawKeypoints
                .map((point) => {
                    if (!Array.isArray(point) || point.length < 2) {
                        return null;
                    }

                    return [
                        toSafeNumber(point[0]),
                        toSafeNumber(point[1]),
                        Math.max(0, Math.min(1, toSafeNumber(point[2], 0))),
                    ] as [number, number, number];
                })
                .filter((point): point is [number, number, number] => point !== null);

            const bbox =
                rawBbox && rawBbox.length === 4
                    ? (rawBbox.map((point) => toSafeNumber(point)) as [number, number, number, number])
                    : null;

            return { keypoints, bbox };
        })
        .filter((person): person is RealtimePerson => person !== null);
};

const normalizeAlerts = (value: unknown): DetectionEvent[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.reduce<DetectionEvent[]>((acc, alert, index) => {
            if (!alert || typeof alert !== 'object') {
                return acc;
            }

            const record = alert as Record<string, unknown>;
            const eventType = String(record.event_type ?? record.label ?? record.type ?? 'warning');
            const timestamp = Math.max(0, Math.trunc(toSafeNumber(record.timestamp, Date.now())));
            const nextAlert: DetectionEvent = {
                id: String(record.id ?? `${eventType}-${timestamp}-${index}`),
                event_type: eventType,
                score: Math.max(0, Math.min(1, toSafeNumber(record.score ?? record.confidence, 0))),
                timestamp,
            };

            if (typeof record.message === 'string') {
                nextAlert.message = record.message;
            }

            acc.push(nextAlert);
            return acc;
        }, []);
};

const buildRealtimePath = (pathname: string) => {
    const cleanPath = pathname.replace(/\/$/, '');
    if (cleanPath.endsWith('/api/v1')) {
        return `${cleanPath}/realtime/ws/realtime`;
    }
    return `${cleanPath}${REALTIME_PATH}`;
};

export const realtimeCamApi = {
    getWebSocketUrl: () => {
        const explicitWsUrl = import.meta.env.VITE_REALTIME_WS_URL;
        if (explicitWsUrl) {
            return explicitWsUrl;
        }

        const source = import.meta.env.VITE_API_URL || window.location.origin;
        const url = new URL(source, window.location.origin);
        url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
        url.pathname = buildRealtimePath(url.pathname).replace(/\/{2,}/g, '/');
        url.search = '';
        url.hash = '';
        return url.toString();
    },

    normalizeResponse: (payload: unknown): AnalysisFrameResponse => {
        if (!payload || typeof payload !== 'object') {
            return { people: [], alerts: [], latency_ms: 0 };
        }

        const record = payload as Record<string, unknown>;

        return {
            people: normalizePeople(record.people),
            alerts: normalizeAlerts(record.alerts ?? record.events),
            latency_ms: Math.max(0, Math.trunc(toSafeNumber(record.latency_ms, 0))),
        };
    },

    analyzeFrame: async (_payload: { image: string; timestamp: number }): Promise<AnalysisFrameResponse> => {
        // TODO: uncomment khi BE sẵn sàng
        // return apiClient.post<AnalysisFrameResponse>('/realtime/analyze-frame', _payload).then(r => r.data);

        // Mock response trong lúc chờ BE (Giả lập delay mạng 200ms)
        await new Promise(resolve => setTimeout(resolve, 200));
        return { people: [], alerts: [], latency_ms: 200 };
    },

    startSession: async (): Promise<{ session_id: string } | null> => {
        // TODO: uncomment khi BE sẵn sàng
        // return apiClient.post<{ session_id: string }>('/realtime/sessions').then(r => r.data);
        return null;
    },

    endSession: async (_sessionId: string): Promise<void> => {
        // TODO: uncomment khi BE sẵn sàng
        // await apiClient.delete(`/realtime/sessions/${_sessionId}`);
    },
};
