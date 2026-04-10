// ============================================================
// src/features/reports/hooks/useMyReports.ts
// ============================================================
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../api/reports.api';

export const useMyReports = (params?: { skip?: number; limit?: number }) => {
    return useQuery({
        queryKey: ['reports', params],
        queryFn: () => reportsApi.getMyReports(params),
    });
};