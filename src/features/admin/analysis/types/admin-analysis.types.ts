// src/features/admin/analysis/types/admin-analysis.types.ts
export interface AdminVideoRead {
    id: string;
    owner_user_id: string;
    content_hash: string;
    raw_path: string;
    original_filename: string | null;
    mime_type: string | null;
    size_bytes: number | null;
    duration_sec: number | null;
    created_at: string;
}

export interface AdminSessionRead {
    id: string;
    video_id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    created_at: string;
    started_at: string | null;
    finished_at: string | null;
    failure_reason: string | null;
}