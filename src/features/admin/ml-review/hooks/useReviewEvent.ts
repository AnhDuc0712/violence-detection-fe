// src/features/admin/ml-review/hooks/useReviewEvent.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mlReviewApi } from '../api/ml-review.api';
import type { MLReviewAction } from '../types/ml-review.types';

export const useReviewEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ eventId, data }: { eventId: string; data: MLReviewAction }) =>
            mlReviewApi.reviewEvent(eventId, data),
        onSuccess: () => {
            // Xóa event khỏi queue và cập nhật lại số lượng badge ở Sidebar
            queryClient.invalidateQueries({ queryKey: ['ml_pending_events'] });
            queryClient.invalidateQueries({ queryKey: ['admin_dashboard_stats'] });
        },
    });
};