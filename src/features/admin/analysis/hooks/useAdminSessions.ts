// src/features/admin/analysis/hooks/useAdminSessions.ts
import { useQuery } from '@tanstack/react-query';
import { adminAnalysisApi } from '../api/admin-analysis.api';

export const useAdminSessions = (params?: { status_filter?: string; skip?: number; limit?: number }) => {
    return useQuery({
        queryKey: ['admin_sessions', params],
        queryFn: () => adminAnalysisApi.getSessions(params),
    });
};