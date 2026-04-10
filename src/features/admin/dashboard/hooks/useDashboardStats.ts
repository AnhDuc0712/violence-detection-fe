// src/features/admin/dashboard/hooks/useDashboardStats.ts
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['admin_dashboard_stats'],
        queryFn: dashboardApi.getStats,
        staleTime: 60 * 1000, // Cache 1 phút cho Sidebar & Dashboard dùng chung
    });
};