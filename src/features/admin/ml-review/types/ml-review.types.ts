// src/features/admin/ml-review/types/ml-review.types.ts
export type ReviewDecision = 'approved' | 'rejected' | 'overridden';

export interface MLReviewAction {
    decision: ReviewDecision;
    label_override?: string; // Bắt buộc khi decision='overridden'
    note?: string;
}

export interface AnalysisEventAdmin {
    id: string;
    session_id: string;
    event_type: string;
    score: number;
    t_start: number | null;
    t_end: number | null;
    ml_review_status: 'pending' | 'approved' | 'rejected' | 'overridden';
    ml_label_override: string | null;
    created_at: string;
}

export interface SnapshotResponse {
    message: string;
    num_samples: number;
    snapshot_id: string;
}