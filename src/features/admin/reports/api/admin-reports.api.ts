// src/features/admin/reports/api/admin-reports.api.ts
import { apiClient } from '@/shared/api/client';
import type {
    AdminReportFilters, ReportAssign, ReportStatusUpdate,
    AdminReportRead, AdminReportDetail, AdminReportMessage
} from '../types/admin-reports.types';

export const adminReportsApi = {
    getReports: (params?: AdminReportFilters) =>
        apiClient.get<AdminReportRead[]>('/admin/reports', { params }).then(r => r.data),

    getReportDetail: (id: string) =>
        apiClient.get<AdminReportDetail>(`/admin/reports/${id}`).then(r => r.data),

    // Sử dụng PATCH cho Assign và Status theo chuẩn
    assignReport: (id: string, data: ReportAssign) =>
        apiClient.patch<{ message: string }>(`/admin/reports/${id}/assign`, data).then(r => r.data),

    updateStatus: (id: string, data: ReportStatusUpdate) =>
        apiClient.patch<{ message: string }>(`/admin/reports/${id}/status`, data).then(r => r.data),

    // API gửi tin nhắn dùng đường dẫn SỐ NHIỀU (/messages)
    sendMessage: (id: string, data: { message: string; attachments?: string[] }) =>
        apiClient.post<AdminReportMessage>(`/admin/reports/${id}/messages`, data).then(r => r.data),
};