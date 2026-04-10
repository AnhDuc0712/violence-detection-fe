// src/pages/admin/AdminDashboardPage.tsx
import { useNavigate } from 'react-router-dom';
import { useDashboardStats } from '@/features/admin/dashboard/hooks/useDashboardStats';
import { StatCard } from '@/features/admin/dashboard/components/StatCard/StatCard';

export const AdminDashboardPage = () => {
    const { data: stats, isLoading, isError } = useDashboardStats();
    const navigate = useNavigate();

    if (isLoading) return <div className="p-8 text-gray-500 animate-pulse">Đang tải dữ liệu tổng quan...</div>;
    if (isError || !stats) return <div className="p-8 text-red-500">Lỗi tải dữ liệu. Vui lòng thử lại.</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Tổng Quan Hệ Thống</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Tổng Người Dùng"
                    value={stats.system_stats.total_users}
                    icon="👥"
                    colorClass="border-blue-500"
                />
                <StatCard
                    title="Tổng Phiên Phân Tích"
                    value={stats.system_stats.total_analysis_sessions}
                    icon="🎥"
                    colorClass="border-green-500"
                />

                {/* Các thẻ bấm được để giải quyết công việc tồn đọng */}
                <StatCard
                    title="Report Đang Mở"
                    value={stats.pending_tasks.open_reports}
                    icon="🟡"
                    colorClass="border-yellow-500"
                    onClick={() => navigate('/admin/reports?status_filter=open')}
                />
                <StatCard
                    title="ML Cần Duyệt"
                    value={stats.pending_tasks.pending_ml_reviews}
                    icon="🟠"
                    colorClass="border-orange-500"
                    onClick={() => navigate('/admin/ml-review')}
                />
            </div>
        </div>
    );
};