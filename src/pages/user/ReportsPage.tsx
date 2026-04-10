// src/pages/user/ReportsPage.tsx
import { Link } from 'react-router-dom';
import { useMyReports } from '@/features/reports/hooks/useMyReports';
import { ReportStatusBadge } from '@/features/reports/components/ReportStatusBadge/ReportStatusBadge';
import { formatDate } from '@/shared/lib/formatters';

export const ReportsPage = () => {
    const { data: reports, isLoading, isError } = useMyReports();

    if (isLoading) return <div className="p-8 text-center">Đang tải yêu cầu hỗ trợ...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Lỗi tải dữ liệu.</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Yêu cầu hỗ trợ của tôi</h1>
                <Link to="/reports/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    + Tạo yêu cầu mới
                </Link>
            </div>

            {reports?.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded border border-dashed">
                    <p className="text-gray-500">Bạn chưa có yêu cầu hỗ trợ nào.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {reports?.map((report) => (
                        <Link key={report.id} to={`/reports/${report.id}`} className="block bg-white p-4 rounded-lg border hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg">{report.title || 'Không có tiêu đề'}</h3>
                                <ReportStatusBadge status={report.status} />
                            </div>
                            <p className="text-sm text-gray-600 mb-2 truncate">{report.description}</p>
                            <div className="flex gap-4 text-xs text-gray-500">
                                <span>Loại: <span className="uppercase">{report.category}</span></span>
                                <span>Ngày tạo: {formatDate(report.created_at)}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};