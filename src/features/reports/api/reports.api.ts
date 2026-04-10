// src/features/reports/api/reports.api.ts
import { apiClient } from '@/shared/api/client';
import type {
    ReportCreate,
    ReportRead,
    ReportDetail,
    ReportMessageCreate,
    ReportMessageRead,
} from '../types/report.types';

export const reportsApi = {
    // F1 — POST /reports
    submitReport: (data: ReportCreate) =>
        apiClient.post<ReportRead>('/reports', data).then((r) => r.data),

    // F2 — GET /reports
    getMyReports: (params?: { skip?: number; limit?: number }) =>
        apiClient.get<ReportRead[]>('/reports', { params }).then((r) => r.data),

    // F3 — GET /reports/:id  (trả về Report + messages[])
    getReportDetail: (id: string) =>
        apiClient.get<ReportDetail>(`/reports/${id}`).then((r) => r.data),

    // F4 — POST /reports/:id/messages
    sendMessage: (reportId: string, data: ReportMessageCreate) =>
        apiClient.post<ReportMessageRead>(`/reports/${reportId}/messages`, data).then((r) => r.data),

    // F5 — DELETE /reports/:id  (chỉ cancel được khi status = 'open')
    cancelReport: (id: string) =>
        apiClient.delete(`/reports/${id}`),
};