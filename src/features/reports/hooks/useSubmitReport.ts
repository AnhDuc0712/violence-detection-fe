// ============================================================
// src/features/reports/hooks/useSubmitReport.ts
// ============================================================
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi } from '../api/reports.api';
import type { ReportCreate } from '../types/report.types';

export const useSubmitReport = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ReportCreate) => reportsApi.submitReport(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
};