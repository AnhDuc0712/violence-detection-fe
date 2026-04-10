// src/features/admin/reports/components/AdminReportTable/AdminReportTable.tsx
import { Link } from 'react-router-dom';
import { formatDate } from '@/shared/lib/formatters';
import type { AdminReportRead } from '../../types/admin-reports.types';

export const AdminReportTable = ({ reports, isLoading }: { reports?: AdminReportRead[], isLoading: boolean }) => {
    if (isLoading) return <div className="p-8 text-center text-gray-500 animate-pulse">Đang tải danh sách...</div>;
    if (!reports?.length) return <div className="p-8 text-center text-gray-500 border border-dashed rounded-lg bg-white">Không có ticket nào.</div>;

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'open': return 'bg-yellow-100 text-yellow-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'closed': return 'bg-gray-100 text-gray-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="bg-white rounded-lg border overflow-x-auto shadow-sm">
            <table className="w-full text-left text-sm border-collapse">
                <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase border-b">
                        <th className="p-4">Tiêu đề</th>
                        <th className="p-4">Danh mục</th>
                        <th className="p-4">Trạng thái</th>
                        <th className="p-4">Ngày tạo</th>
                        <th className="p-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {reports.map(report => (
                        <tr key={report.id} className="hover:bg-gray-50">
                            <td className="p-4 font-medium text-gray-800">
                                {report.title || 'Không có tiêu đề'}
                                <p className="text-xs text-gray-400 font-mono mt-1">ID: {report.id.substring(0, 8)}...</p>
                            </td>
                            <td className="p-4 text-gray-600 capitalize">{report.category}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${getStatusStyle(report.status)}`}>
                                    {report.status}
                                </span>
                            </td>
                            <td className="p-4 text-gray-500">{formatDate(report.created_at)}</td>
                            <td className="p-4 text-right">
                                <Link to={`/admin/reports/${report.id}`} className="text-blue-600 hover:underline font-medium">Xử lý</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};