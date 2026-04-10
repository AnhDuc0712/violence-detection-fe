// src/features/admin/analysis/components/AdminSessionTable/AdminSessionTable.tsx
import { useState } from 'react';
import { useAdminSessions } from '../../hooks/useAdminSessions';
import { useCancelJob } from '../../hooks/useCancelJob';
import { formatDate } from '@/shared/lib/formatters';
import { useToast } from '@/shared/ui/organisms/Toast/useToast';
import { Button } from '@/shared/ui/atoms/Button';

const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800 animate-pulse',
        completed: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800',
        cancelled: 'bg-gray-100 text-gray-600'
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${styles[status] || styles.cancelled}`}>{status}</span>;
};

export const AdminSessionTable = () => {
    const [statusFilter, setStatusFilter] = useState<string>('');
    const { data: sessions, isLoading, isError } = useAdminSessions({ status_filter: statusFilter || undefined });
    const cancelMutation = useCancelJob();
    const toast = useToast();

    const handleCancel = async (id: string) => {
        if (!window.confirm('Bạn có chắc muốn hủy tiến trình AI này?')) return;
        try {
            await cancelMutation.mutateAsync(id);
            toast.show('Đã hủy tiến trình thành công.', 'success');
        } catch (error: any) {
            toast.show(error.response?.data?.detail || 'Chỉ có thể hủy job pending/processing.', 'error');
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex justify-end">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="pending">Pending (Chờ xử lý)</option>
                    <option value="processing">Processing (Đang chạy)</option>
                    <option value="completed">Completed (Hoàn thành)</option>
                    <option value="failed">Failed (Lỗi)</option>
                    <option value="cancelled">Cancelled (Đã hủy)</option>
                </select>
            </div>

            {isLoading && <div className="p-8 text-center animate-pulse text-gray-500">Đang tải danh sách sessions...</div>}
            {isError && <div className="p-8 text-center text-red-500">Lỗi tải dữ liệu.</div>}

            {!isLoading && !isError && sessions?.length === 0 ? (
                <div className="p-8 text-center text-gray-500">Không có phiên phân tích nào.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 uppercase">
                                <th className="p-4 border-b">Session ID</th>
                                <th className="p-4 border-b">Video ID</th>
                                <th className="p-4 border-b">Trạng Thái</th>
                                <th className="p-4 border-b">Ngày tạo</th>
                                <th className="p-4 border-b text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sessions?.map(session => (
                                <tr key={session.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-mono text-xs">{session.id.substring(0, 8)}...</td>
                                    <td className="p-4 font-mono text-xs text-gray-500">{session.video_id.substring(0, 8)}...</td>
                                    <td className="p-4">{getStatusBadge(session.status)}</td>
                                    <td className="p-4 text-gray-500">{formatDate(session.created_at)}</td>
                                    <td className="p-4 text-right">
                                        {/* Chỉ hiện nút Hủy khi status là pending hoặc processing */}
                                        {(session.status === 'pending' || session.status === 'processing') && (
                                            <Button
                                                variant="danger"
                                                className="py-1 px-3 text-xs"
                                                onClick={() => handleCancel(session.id)}
                                                isLoading={cancelMutation.isPending}
                                            >
                                                Hủy Job
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};