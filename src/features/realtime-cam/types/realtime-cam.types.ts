// src/features/realtime-cam/types/realtime-cam.types.ts
export type CamStatus =
    | 'idle'
    | 'requesting'
    | 'active'
    | 'analyzing'
    | 'error'
    | 'disconnected';

export type DetectionEvent = {
    id: string;
    event_type: string;
    score: number;
    timestamp: number;
    message?: string;
};

export type RealtimePerson = {
    keypoints: [number, number, number][];
    bbox: [number, number, number, number] | null;
};

export interface AnalysisFrameResponse {
    people: RealtimePerson[];
    alerts: DetectionEvent[];
    latency_ms: number;
}

export interface AnalysisFrameRequest {
    image: string;
    timestamp: number;
}
