// src/features/realtime-cam/types/realtime-cam.types.ts
export type CamStatus =
    | 'idle'
    | 'requesting'
    | 'active'
    | 'analyzing'
    | 'error'
    | 'disconnected';

export interface DetectionEvent {
    id: string;
    event_type: string;
    score: number;
    timestamp: number;
    frame_data_url?: string;
    bounding_box?: { x: number; y: number; width: number; height: number; };
}

export interface AnalysisFrameResponse {
    events: DetectionEvent[];
    processing_time_ms?: number;
}

export interface AnalysisFrameRequest {
    frame_base64: string;
    session_id?: string;
    timestamp: number;
}