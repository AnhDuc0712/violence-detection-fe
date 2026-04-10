// src/features/analysis/types/analysis.types.ts
export interface AnalysisSessionCreate {
    video_id: string;
    pipeline_spec: {
        model_version: string;
        threshold: number;
        [key: string]: unknown;
    };
}

export interface AnalysisSessionRead {
    id: string;
    video_id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    created_at: string;
    started_at: string | null;
    finished_at: string | null;
    failure_reason: string | null;
}

export interface AnalysisEventRead {
    id: string;
    session_id: string;
    event_type: string;
    score: number;
    t_start: number | null;
    t_end: number | null;
    ml_review_status: 'pending' | 'approved' | 'rejected' | 'overridden'; //
    created_at: string;
}

export interface AnalysisSessionDetail extends AnalysisSessionRead {
    events: AnalysisEventRead[]; // Bao gồm toàn bộ timeline trong 1 response
}