// ============================================================
// src/features/reports/types/report.types.ts
// ============================================================
export interface ReportCreate {
    message_type: 'bug' | 'support' | 'complaint';
    target_type: 'video' | 'session' | 'account' | 'other';
    target_id?: string;
    category: string;
    title?: string;
    description: string;
    evidence_paths?: string[];
}

export interface ReportMessageCreate {
    message: string;
    attachments?: string[];
}

export interface ReportMessageRead {
    id: string;
    report_id: string;
    sender_user_id: string;
    message: string;
    attachments: string[] | null;
    created_at: string;
}

export interface ReportRead {
    id: string;
    reporter_user_id: string;
    message_type: string;
    target_type: string;
    category: string;
    title: string | null;
    description: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: string | null;
    created_at: string;
    updated_at: string;
}

// D3: GET /reports/:id trả về Report + messages[]
export interface ReportDetail extends ReportRead {
    messages: ReportMessageRead[];
}