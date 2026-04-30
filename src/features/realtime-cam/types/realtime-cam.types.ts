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
    track_id: number;
    bbox: [number, number, number, number];
    keypoints: [number, number, number][];
    violence_prob: number;
    label: string;
    identity: string;
    identity_source: string;
    face_confidence: number;
    body_confidence: number;
    violence_state: boolean;
    det_conf: number;
    status: string;
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
