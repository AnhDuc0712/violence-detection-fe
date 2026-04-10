// src/features/admin/reports/types/admin-reports.types.ts
export interface AdminReportFilters {
    status_filter?: 'open' | 'in_progress' | 'resolved' | 'closed' | '';
    category_filter?: string;
    skip?: number;
    limit?: number;
}

export interface ReportAssign {
    assigned_admin_id: string;
}

export interface ReportStatusUpdate {
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    action_note?: string;
}

export interface AdminReportRead {
    id: string;
    reporter_user_id: string;
    assigned_admin_id: string | null;
    message_type: 'bug' | 'support' | 'complaint';
    target_type: 'video' | 'session' | 'account' | 'other';
    target_id: string | null;
    category: string;
    title: string | null;
    description: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: string | null;
    created_at: string;
    updated_at: string;
    resolved_at: string | null;
}

export interface AdminReportMessage {
    id: string;
    report_id: string;
    sender_user_id: string;
    message: string;
    attachments: string[] | null;
    created_at: string;
}

export interface AdminReportDetail extends AdminReportRead {
    messages: AdminReportMessage[];
}