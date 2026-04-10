// src/features/admin/users/types/admin-users.types.ts
export interface LoginAttempt {
    id: string;
    user_id: string;
    ip_address: string;
    created_at: string;
}

export interface AuditLog {
    id: string;
    actor_user_id: string;
    action: string;
    created_at: string;
}

export interface UserLogsResponse {
    login_history: LoginAttempt[];
    activity_logs: AuditLog[];
}