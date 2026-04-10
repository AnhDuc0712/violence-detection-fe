// src/features/videos/types/video.types.ts
export interface VideoRead {
    id: string;
    owner_user_id: string;
    content_hash: string;
    raw_path: string;
    original_filename: string | null;
    mime_type: string | null;
    size_bytes: number | null;
    duration_sec: number | null;
    created_at: string;
    video_url?: string;
    // Tuân thủ nghiêm ngặt: KHÔNG có status, deleted_at, filename
}