// src/features/admin/ml-review/hooks/usePendingReviews.ts
import { useQuery } from '@tanstack/react-query';
import { mlReviewApi } from '../api/ml-review.api';

export const usePendingReviews = (params?: { skip?: number; limit?: number }) => {
    return useQuery({
        queryKey: ['ml_pending_events', params],
        queryFn: () => mlReviewApi.getPendingEvents(params),
    });
};