// src/features/feedback/hooks/useSubmitFeedback.ts
import { useMutation } from '@tanstack/react-query';
import { feedbackApi } from '../api/feedback.api';
import type { VideoFeedbackCreate } from '../types/feedback.types';

export const useSubmitFeedback = () => {
    return useMutation({
        mutationFn: (data: VideoFeedbackCreate) => feedbackApi.submitFeedback(data),
    });
};