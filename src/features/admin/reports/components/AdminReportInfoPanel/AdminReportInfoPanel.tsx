// src/features/admin/reports/components/AdminReportInfoPanel/AdminReportInfoPanel.tsx
import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useAssignReport, useUpdateReportStatus } from '../../hooks/useAdminReportsHooks';
import { useToast } from '@/shared/ui/organisms/Toast/useToast';
import { Button } from '@/shared/ui/atoms/Button';
import { formatDate } from '@/shared/lib/formatters';
import type { AdminReportDetail } from '../../types/admin-reports.types';

export const AdminReportInfoPanel = ({ report }: { report: AdminReportDetail }) => {
    const adminId = useAuthStore(s => s.user?.id);
    const toast = useToast();
    const assignMutation = useAssignReport();
    const statusMutation = useUpdateReportStatus();

    const [selectedStatus, setSelectedStatus] = useState(report.status);
    const [actionNote, setActionNote] = useState('');

    const handleAssignToMe = async () => {
        if (!adminId) return;
        try {
            await assignMutation.mutateAsync({ id: report.id, data: { assigned_admin_id: adminId } });
            toast.show('Đã phân công cho chính bạn.', 'success');
        } catch (error) { toast.show('Lỗi phân công.', 'error'); }
    };

    const handleUpdateStatus = async () => {
        try {
            await statusMutation.mutateAsync({
                id: report.id,
                data: { status: selectedStatus, action_note: actionNote || undefined }
            });
            toast.show('Cập nhật trạng thái thành công!', 'success');
            setActionNote('');
        } catch (error) { toast.show('Lỗi cập nhật.', 'error'); }
    };

    return (
        <div className="bg-white rounded-lg border shadow-sm p-5 space-y-6">
            <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Thông tin Ticket</h2>
                <div className="space-y-2 text-sm text-gray-600">
                    <p><strong className="text-gray-800">Loại:</strong> <span className="capitalize">{report.message_type}</span></p>
                    <p><strong className="text-gray-800">Danh mục:</strong> {report.category}</p>
                    <p><strong className="text-gray-800">Target:</strong> {report.target_type}</p>
                    {report.target_id && <p className="font-mono text-xs truncate break-all">{report.target_id}</p>}
                    <p><strong className="text-gray-800">Ngày gửi:</strong> {formatDate(report.created_at)}</p>
                </div>
            </div>

            {/* Khối Phân công */}
            <div className="bg-gray-50 p-4 rounded border">
                <p className="text-sm font-bold text-gray-700 mb-2">Người xử lý (Assignee)</p>
                {report.assigned_admin_id ? (
                    <p className="text-sm font-mono text-indigo-600 truncate">{report.assigned_admin_id}</p>
                ) : (
                    <Button variant="secondary" className="w-full text-xs py-1" onClick={handleAssignToMe} isLoading={assignMutation.isPending}>
                        🙋 Nhận xử lý ticket này
                    </Button>
                )}
            </div>

            {/* Khối Cập nhật Trạng thái */}
            <div className="space-y-3">
                <p className="text-sm font-bold text-gray-700">Trạng thái Ticket</p>
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as any)}
                    className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="open">Open (Mới)</option>
                    <option value="in_progress">In Progress (Đang xử lý)</option>
                    <option value="resolved">Resolved (Đã giải quyết)</option>
                    <option value="closed">Closed (Đóng)</option>
                </select>
                <input
                    type="text"
                    placeholder="Ghi chú nội bộ (optional)"
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Button
                    variant="primary"
                    className="w-full py-1.5 text-sm"
                    onClick={handleUpdateStatus}
                    isLoading={statusMutation.isPending}
                    disabled={selectedStatus === report.status && !actionNote}
                >
                    Lưu thay đổi
                </Button>
            </div>
        </div>
    );
};