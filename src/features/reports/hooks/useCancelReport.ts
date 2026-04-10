// ============================================================
// src/features/reports/hooks/useCancelReport.ts
// ============================================================
// ✅ Fix vi phạm từ ReportDetailPage: business logic phải nằm trong hook
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { reportsApi } from '../api/reports.api';

export const useCancelReport = (reportId: string) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: () => reportsApi.cancelReport(reportId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            navigate('/reports');
        },
    });
};
