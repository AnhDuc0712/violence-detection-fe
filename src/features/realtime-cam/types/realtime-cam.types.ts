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
    semantic_message?: string;
    semantic_confidence?: number;
    interaction_pair?: number[];
    aggressor_track_id?: number;
    victim_track_id?: number;
    alert_state?: 'DETECTED' | 'ACTIVE' | 'RESOLVED';
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
    effective_fps?: number;
}

export interface AnalysisFrameRequest {
    image: string;
    timestamp: number;
}

export type RealtimeSessionMetrics = {
    session_id: string;
    frames_received: number;
    frames_processed: number;
    frames_dropped: number;
    dropped_frames_10s: number;
    avg_latency_ms: number;
    queue_depth: number;
    result_queue_depth: number;
    effective_fps: number;
    track_count: number;
    alert_count: number;
};
