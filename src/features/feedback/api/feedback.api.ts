// src/features/feedback/api/feedback.api.ts
import { apiClient } from '@/shared/api/client';
import type { VideoFeedbackCreate, VideoFeedbackRead } from '../types/feedback.types';

export const feedbackApi = {
    submitFeedback: (data: VideoFeedbackCreate) =>
        apiClient.post<VideoFeedbackRead>('/feedback', data).then(r => r.data),
};