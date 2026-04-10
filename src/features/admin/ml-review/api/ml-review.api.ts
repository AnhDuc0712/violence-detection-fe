// src/features/admin/ml-review/api/ml-review.api.ts
import { apiClient } from '@/shared/api/client';
import type { AnalysisEventAdmin, MLReviewAction, SnapshotResponse } from '../types/ml-review.types';

export const mlReviewApi = {
    getPendingEvents: (params?: { skip?: number; limit?: number }) =>
        apiClient.get<AnalysisEventAdmin[]>('/admin/ml-review/events/pending', { params }).then(r => r.data),

    reviewEvent: (eventId: string, data: MLReviewAction) =>
        apiClient.post<{ message: string }>(`/admin/ml-review/events/${eventId}/review`, data).then(r => r.data),

    createSnapshot: () =>
        apiClient.post<SnapshotResponse>('/admin/ml-review/dataset/snapshot').then(r => r.data),
};