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
    raw_prob?: number;
    bilstm_prob: number;
    xgb_prob: number;
    label: string;
    identity: string;
    identity_source: string;
    face_confidence: number;
    body_confidence: number;
    violence_state: boolean;
    det_conf: number;
    status: string;
    ema_prob?: number;
    threshold_on?: number;
    threshold_off?: number;
    consecutive_violent_frames?: number;
    required_consecutive_frames?: number;
    alert_cooldown_frames?: number;
    temporal_buffer_size?: number;
    temporal_window_size?: number;
    frames_until_ready?: number;
    frames_until_alert?: number;
    effective_fps?: number;
    // DEBUG FIELDS (Task #6, #10)
    identity_locked: boolean;
    identity_votes_count: number;
    interaction_score: number;
};

export interface AnalysisFrameResponse {
    session_id?: string;
    people: RealtimePerson[];
    alerts: DetectionEvent[];
    latency_ms: number;
}

export interface AnalysisFrameRequest {
    image: string;
    timestamp: number;
}
