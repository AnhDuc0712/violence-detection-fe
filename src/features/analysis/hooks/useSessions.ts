// src/features/analysis/hooks/useSessions.ts
import { useQuery } from '@tanstack/react-query';
import { analysisApi } from '../api/analysis.api';

export const useSessions = (params?: { skip?: number; limit?: number }) => {
    return useQuery({
        queryKey: ['analysis_sessions', params],
        queryFn: () => analysisApi.getMySessions(params),
    });
};