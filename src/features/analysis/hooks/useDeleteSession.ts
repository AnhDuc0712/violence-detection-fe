// src/features/analysis/hooks/useDeleteSession.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { analysisApi } from '../api/analysis.api';

export const useDeleteSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => analysisApi.deleteSession(id),
        onSuccess: () => {
            // Invalidate danh sách sessions sau khi xóa
            queryClient.invalidateQueries({ queryKey: ['analysis_sessions'] });
        },
    });
};