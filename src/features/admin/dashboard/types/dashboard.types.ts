// src/features/admin/dashboard/types/dashboard.types.ts
export interface DashboardStats {
    system_stats: {
        total_users: number;
        total_analysis_sessions: number;
    };
    pending_tasks: {
        open_reports: number;
        pending_ml_reviews: number;
    };
}