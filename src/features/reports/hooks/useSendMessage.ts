// ============================================================
// src/features/reports/hooks/useSendMessage.ts
// ============================================================
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi } from '../api/reports.api';
import type { ReportMessageCreate } from '../types/report.types';

export const useSendMessage = (reportId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ReportMessageCreate) => reportsApi.sendMessage(reportId, data),
        onSuccess: () => {
            // Refresh detail để lấy messages mới nhất
            queryClient.invalidateQueries({ queryKey: ['report', reportId] });
        },
    });
};