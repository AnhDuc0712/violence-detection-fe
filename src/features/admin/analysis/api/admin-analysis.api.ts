// src/features/admin/analysis/api/admin-analysis.api.ts
import { apiClient } from '@/shared/api/client';
import type { AdminVideoRead, AdminSessionRead } from '../types/admin-analysis.types';

export const adminAnalysisApi = {
    getVideos: (params?: { skip?: number; limit?: number }) =>
        apiClient.get<AdminVideoRead[]>('/admin/analysis/videos', { params }).then(r => r.data),

    getSessions: (params?: { status_filter?: string; skip?: number; limit?: number }) =>
        apiClient.get<AdminSessionRead[]>('/admin/analysis/sessions', { params }).then(r => r.data),

    cancelJob: (sessionId: string) =>
        apiClient.post<{ message: string }>(`/admin/analysis/sessions/${sessionId}/cancel`).then(r => r.data),
};