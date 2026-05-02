import type { AnalysisFrameResponse, DetectionEvent, RealtimePerson, RealtimeSessionMetrics } from '../types/realtime-cam.types';

const REALTIME_PATH = '/api/v1/ws/realtime-v2';

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
            const rawKeypointConf = Array.isArray(record.keypoint_conf) ? record.keypoint_conf : [];
            const rawBbox = Array.isArray(record.bbox) ? record.bbox : null;

            const keypoints = rawKeypoints
                .map((point, index) => {
                    if (!Array.isArray(point) || point.length < 2) {
                        return null;
                    }

                    return [
                        toSafeNumber(point[0]),
                        toSafeNumber(point[1]),
                        Math.max(
                            0,
                            Math.min(
                                1,
                                toSafeNumber(
                                    point[2],
                                    Array.isArray(rawKeypointConf) ? rawKeypointConf[index] : 1,
                                ),
                            ),
                        ),
                    ] as [number, number, number];
                })
                .filter((point): point is [number, number, number] => point !== null);

            const bbox =
                rawBbox && rawBbox.length === 4
                    ? (rawBbox.map((point) => toSafeNumber(point)) as [number, number, number, number])
                    : null;

            if (!bbox) {
                return null;
            }

            const violenceProb = Math.max(
                0,
                Math.min(
                    1,
                    toSafeNumber(
                        record.violence_prob ?? record.score ?? record.xgb_prob ?? record.raw_prob,
                        0,
                    ),
                ),
            );

            return {
                track_id: Math.max(0, Math.trunc(toSafeNumber(record.track_id, 0))),
                bbox,
                keypoints,
                violence_prob: violenceProb,
                raw_prob: toSafeNumber(record.raw_prob, 0),
                bilstm_prob: toSafeNumber(record.bilstm_prob, 0),
                xgb_prob: toSafeNumber(record.xgb_prob, 0),
                label: String(record.label ?? 'unknown'),
                identity: String(record.identity ?? 'Unknown'),
                identity_source: String(record.identity_source ?? 'unknown'),
                face_confidence: Math.max(0, Math.min(1, toSafeNumber(record.face_confidence ?? record.face_score, 0))),
                body_confidence: Math.max(0, Math.min(1, toSafeNumber(record.body_confidence ?? 0, 0))),
                violence_state: Boolean(record.violence_state ?? record.is_violent ?? (String(record.label ?? '') === 'violence')),
                det_conf: Math.max(0, Math.min(1, toSafeNumber(record.det_conf, 0))),
                status: String(record.status ?? 'unknown'),
                ema_prob: Math.max(0, Math.min(1, toSafeNumber(record.ema_prob, violenceProb))),
                threshold_on: Math.max(0, Math.min(1, toSafeNumber(record.threshold_on, 0))),
                threshold_off: Math.max(0, Math.min(1, toSafeNumber(record.threshold_off, 0))),
                consecutive_violent_frames: Math.max(0, Math.trunc(toSafeNumber(record.consecutive_violent_frames, 0))),
                required_consecutive_frames: Math.max(0, Math.trunc(toSafeNumber(record.required_consecutive_frames, 0))),
                alert_cooldown_frames: Math.max(0, Math.trunc(toSafeNumber(record.alert_cooldown_frames, 0))),
                temporal_buffer_size: Math.max(0, Math.trunc(toSafeNumber(record.temporal_buffer_size, 0))),
                temporal_window_size: Math.max(0, Math.trunc(toSafeNumber(record.temporal_window_size, 0))),
                frames_until_ready: Math.max(0, Math.trunc(toSafeNumber(record.frames_until_ready, 0))),
                frames_until_alert: Math.max(0, Math.trunc(toSafeNumber(record.frames_until_alert, 0))),
                effective_fps: Math.max(0, toSafeNumber(record.effective_fps, 0)),
                // DEBUG FIELDS (Task #6, #10)
                identity_locked: Boolean(record.identity_locked ?? false),
                identity_votes_count: Math.max(0, Math.trunc(toSafeNumber(record.identity_votes_count, 0))),
                interaction_score: Math.max(0, Math.min(1, toSafeNumber(record.interaction_score, 0))),
            } satisfies RealtimePerson;
        })
        .filter(Boolean) as RealtimePerson[];
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
            semantic_message: typeof record.semantic_message === 'string' ? record.semantic_message : undefined,
            semantic_confidence: Math.max(0, Math.min(1, toSafeNumber(record.score, toSafeNumber(record.confidence, 0)))),
            interaction_pair: Array.isArray(record.interaction_pair)
                ? record.interaction_pair.map((value) => Math.max(0, Math.trunc(toSafeNumber(value, 0))))
                : undefined,
            aggressor_track_id: Math.max(0, Math.trunc(toSafeNumber(record.aggressor_track_id, 0))),
            victim_track_id: Math.max(0, Math.trunc(toSafeNumber(record.victim_track_id, 0))),
            alert_state: ['DETECTED', 'ACTIVE', 'RESOLVED'].includes(String(record.alert_state))
                ? (String(record.alert_state) as DetectionEvent['alert_state'])
                : 'DETECTED',
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
        return `${cleanPath}/ws/realtime-v2`;
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
        const record = payload && typeof payload === 'object'
            ? (payload as Record<string, unknown>)
            : {};

        return {
            session_id: typeof record.session_id === 'string' ? record.session_id : undefined,
            people: normalizePeople(record.people),
            alerts: normalizeAlerts(record.alerts ?? record.events),
            latency_ms: Math.max(0, Math.trunc(toSafeNumber(record.latency_ms, 0))),
            effective_fps: Math.max(0, toSafeNumber(record.effective_fps, 0)),
        };
    },

    getRealtimeSessionMetrics: async (baseUrl: string, sessionId: string): Promise<RealtimeSessionMetrics | null> => {
        const url = new URL(baseUrl || window.location.origin, window.location.origin);
        const cleanPath = url.pathname.replace(/\/$/, '');
        url.pathname = (
            cleanPath.endsWith('/api/v1')
                ? `${cleanPath}/ws/realtime-v2/metrics`
                : `${cleanPath}/api/v1/ws/realtime-v2/metrics`
        ).replace(/\/{2,}/g, '/');
        url.search = '';
        url.hash = '';

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: { Accept: 'application/json' },
        });
        if (!response.ok) {
            return null;
        }

        const payload = await response.json() as { sessions?: Array<Record<string, unknown>> };
        const session = Array.isArray(payload.sessions)
            ? payload.sessions.find((item) => String(item.session_id ?? '') === sessionId)
            : undefined;
        if (!session) {
            return null;
        }

        return {
            session_id: String(session.session_id ?? sessionId),
            frames_received: Math.max(0, Math.trunc(toSafeNumber(session.frames_received, 0))),
            frames_processed: Math.max(0, Math.trunc(toSafeNumber(session.frames_processed, 0))),
            frames_dropped: Math.max(0, Math.trunc(toSafeNumber(session.frames_dropped, 0))),
            dropped_frames_10s: Math.max(0, Math.trunc(toSafeNumber(session.dropped_frames_10s, 0))),
            avg_latency_ms: Math.max(0, toSafeNumber(session.avg_latency_ms, 0)),
            queue_depth: Math.max(0, Math.trunc(toSafeNumber(session.queue_depth, 0))),
            result_queue_depth: Math.max(0, Math.trunc(toSafeNumber(session.result_queue_depth, 0))),
            effective_fps: Math.max(0, toSafeNumber(session.effective_fps, 0)),
            track_count: Math.max(0, Math.trunc(toSafeNumber(session.track_count, 0))),
            alert_count: Math.max(0, Math.trunc(toSafeNumber(session.alert_count, 0))),
        };
    },
};
