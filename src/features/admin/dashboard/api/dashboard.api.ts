// src/features/admin/dashboard/api/dashboard.api.ts
import { apiClient } from '@/shared/api/client';
import type { DashboardStats } from '../types/dashboard.types';

export const dashboardApi = {
    getStats: () =>
        apiClient.get<DashboardStats>('/admin/dashboard/stats').then(r => r.data),
};