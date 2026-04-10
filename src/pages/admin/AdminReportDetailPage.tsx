// src/pages/admin/AdminReportDetailPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminReportDetail } from '@/features/admin/reports/hooks/useAdminReportsHooks';
import { AdminReportInfoPanel } from '@/features/admin/reports/components/AdminReportInfoPanel/AdminReportInfoPanel';
import { AdminChatThread } from '@/features/admin/reports/components/AdminChatThread/AdminChatThread';
import { Button } from '@/shared/ui/atoms/Button';

export const AdminReportDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: report, isLoading, isError } = useAdminReportDetail(id || '');

    if (isLoading) return <div className="p-8 text-center animate-pulse">Đang tải dữ liệu ticket...</div>;
    if (isError || !report) return <div className="p-8 text-center text-red-500">Lỗi tải dữ liệu hoặc ticket không tồn tại.</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="secondary" onClick={() => navigate('/admin/reports')}>Trở về</Button>
                <h1 className="text-xl font-bold text-gray-800">Xử lý Ticket #{report.id.substring(0, 8)}</h1>
            </div>

            {/* Layout 2 cột chuẩn mực */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-1">
                    <AdminReportInfoPanel report={report} />
                </div>
                <div className="lg:col-span-2">
                    <AdminChatThread report={report} />
                </div>
            </div>
        </div>
    );
};