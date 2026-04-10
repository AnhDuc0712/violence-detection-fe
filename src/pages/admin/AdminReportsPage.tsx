// src/pages/admin/AdminReportsPage.tsx
import { useState } from 'react';
import { useAdminReports } from '@/features/admin/reports/hooks/useAdminReportsHooks';
import { AdminReportTable } from '@/features/admin/reports/components/AdminReportTable/AdminReportTable';

export const AdminReportsPage = () => {
    const [statusFilter, setStatusFilter] = useState<'open' | 'in_progress' | 'resolved' | 'closed' | ''>('open');
    const { data: reports, isLoading } = useAdminReports({ status_filter: statusFilter || undefined });

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Yêu cầu (Tickets)</h1>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="border p-2 rounded text-sm bg-white"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="open">Đang mở (Open)</option>
                    <option value="in_progress">Đang xử lý (In Progress)</option>
                    <option value="resolved">Đã giải quyết (Resolved)</option>
                    <option value="closed">Đã đóng (Closed)</option>
                </select>
            </div>

            <AdminReportTable reports={reports} isLoading={isLoading} />
        </div>
    );
};