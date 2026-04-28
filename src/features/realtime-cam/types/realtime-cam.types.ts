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
    track_id: number;                                    // ✅ thêm
    bbox: [number, number, number, number];
    keypoints: [number, number, number][];
    violence_prob: number;                              // ✅ thêm
    label: string;                                      // ✅ thêm
    identity: string;  
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
