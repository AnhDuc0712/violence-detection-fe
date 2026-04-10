// src/features/feedback/types/feedback.types.ts
export interface VideoFeedbackCreate {
    session_id: string;
    feedback_type: 'false_positive' | 'false_negative' | 'excellent';
    rating?: number; // 1-5
    comment?: string;
}

// ✅ Định nghĩa riêng hoàn toàn — không extends Create
// Lý do: Read và Create có semantic khác nhau, extends gây nhầm lẫn
export interface VideoFeedbackRead {
    id: string;
    owner_user_id: string;
    session_id: string;
    feedback_type: 'false_positive' | 'false_negative' | 'excellent';
    rating: number | null;
    comment: string | null;
    created_at: string;
}