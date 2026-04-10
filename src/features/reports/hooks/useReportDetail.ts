// ============================================================
// src/features/reports/hooks/useReportDetail.ts
// ============================================================
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../api/reports.api';

export const useReportDetail = (id: string) => {
    return useQuery({
        queryKey: ['report', id],
        queryFn: () => reportsApi.getReportDetail(id),
        enabled: !!id,
    });
};