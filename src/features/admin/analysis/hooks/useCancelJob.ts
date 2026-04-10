// src/features/admin/analysis/hooks/useCancelJob.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAnalysisApi } from '../api/admin-analysis.api';

export const useCancelJob = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (sessionId: string) => adminAnalysisApi.cancelJob(sessionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_sessions'] });
        }
    });
};