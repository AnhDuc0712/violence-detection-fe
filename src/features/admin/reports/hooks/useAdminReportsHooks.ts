// src/features/admin/reports/hooks/useAdminReportsHooks.ts
// Gộp chung các file hook nhỏ vào đây cho gọn gàng
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminReportsApi } from '../api/admin-reports.api';
import type { AdminReportFilters, ReportAssign, ReportStatusUpdate } from '../types/admin-reports.types';

export const useAdminReports = (params?: AdminReportFilters) => {
    return useQuery({
        queryKey: ['admin_reports', params],
        queryFn: () => adminReportsApi.getReports(params),
    });
};

export const useAdminReportDetail = (id: string) => {
    return useQuery({
        queryKey: ['admin_report', id],
        queryFn: () => adminReportsApi.getReportDetail(id),
        enabled: !!id,
    });
};

export const useAssignReport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ReportAssign }) => adminReportsApi.assignReport(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['admin_report', id] });
            queryClient.invalidateQueries({ queryKey: ['admin_reports'] });
        },
    });
};

export const useUpdateReportStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ReportStatusUpdate }) => adminReportsApi.updateStatus(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['admin_report', id] });
            queryClient.invalidateQueries({ queryKey: ['admin_reports'] });
            queryClient.invalidateQueries({ queryKey: ['admin_dashboard_stats'] }); // Update badge sidebar
        },
    });
};

export const useAdminReply = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { message: string; attachments?: string[] } }) =>
            adminReportsApi.sendMessage(id, data),
        onSuccess: (_, { id }) => {
            // BE tự đổi status -> in_progress, nên ta phải invalidate để cập nhật UI & Badge
            queryClient.invalidateQueries({ queryKey: ['admin_report', id] });
            queryClient.invalidateQueries({ queryKey: ['admin_dashboard_stats'] });
        },
    });
};