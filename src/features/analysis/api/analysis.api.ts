// src/features/analysis/api/analysis.api.ts
import { apiClient } from '@/shared/api/client';
import type {
    AnalysisSessionCreate,
    AnalysisSessionRead,
    AnalysisSessionDetail,
} from '../types/analysis.types';

export const analysisApi = {
    // D1 — POST /analysis/start
    startAnalysis: (data: AnalysisSessionCreate) =>
        apiClient.post<AnalysisSessionRead>('/analysis/start', data).then((r) => r.data),

    // D2 — GET /analysis
    getMySessions: (params?: { skip?: number; limit?: number }) =>
        apiClient.get<AnalysisSessionRead[]>('/analysis', { params }).then((r) => r.data),

    // D3 — GET /analysis/:id  (trả về session + events[] trong 1 response)
    getSessionDetail: (id: string) =>
        apiClient.get<AnalysisSessionDetail>(`/analysis/${id}`).then((r) => r.data),

    // D4 — DELETE /analysis/sessions/:id  (hard delete)
    deleteSession: (id: string) =>
        apiClient.delete(`/analysis/sessions/${id}`),
};