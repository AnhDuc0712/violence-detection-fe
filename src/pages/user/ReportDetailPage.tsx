// src/pages/user/ReportDetailPage.tsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useReportDetail } from '@/features/reports/hooks/useReportDetail';
import { useSendMessage } from '@/features/reports/hooks/useSendMessage';
import { useCancelReport } from '@/features/reports/hooks/useCancelReport'; // Import hook mới
import { ReportStatusBadge } from '@/features/reports/components/ReportStatusBadge/ReportStatusBadge';
import { ReportChatThread } from '@/features/reports/components/ReportChatThread/ReportChatThread';
import { formatDate } from '@/shared/lib/formatters';
import { useToast } from '@/shared/ui/organisms/Toast/useToast'; // Thay thế alert

export const ReportDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const toast = useToast();

    // Chỉ gọi Custom Hooks, không chứa QueryClient hay Axios API
    const { data: report, isLoading, isError } = useReportDetail(id!);
    const sendMessageMutation = useSendMessage(id!);
    const cancelMutation = useCancelReport(id!);

    const [messageInput, setMessageInput] = useState('');

    if (isLoading) return <div className="p-8 text-center">Đang tải chi tiết...</div>;
    if (isError || !report) return <div className="p-8 text-center text-red-500">Không tìm thấy báo cáo.</div>;

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;
        try {
            await sendMessageMutation.mutateAsync({ message: messageInput });
            setMessageInput('');
        } catch (error) {
            toast.show('Không thể gửi tin nhắn. Vui lòng thử lại.', 'error');
        }
    };

    const handleCancel = () => {
        if (window.confirm('Bạn có chắc muốn hủy yêu cầu này?')) {
            cancelMutation.mutate(undefined, {
                onError: () => toast.show('Lỗi khi hủy yêu cầu.', 'error'),
                onSuccess: () => toast.show('Đã hủy yêu cầu hỗ trợ.', 'success')
            });
        }
    };

    const canChat = report.status === 'open' || report.status === 'in_progress';

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">{report.title || 'Chi tiết yêu cầu'}</h1>
                        <p className="text-sm text-gray-500 font-mono">ID: {report.id}</p>
                    </div>
                    <ReportStatusBadge status={report.status} />
                </div>

                <div className="text-sm space-y-2 mb-4">
                    <p><span className="font-semibold text-gray-600 w-24 inline-block">Phân loại:</span> <span className="uppercase">{report.category}</span></p>
                    <p><span className="font-semibold text-gray-600 w-24 inline-block">Ngày tạo:</span> {formatDate(report.created_at)}</p>
                    <div className="mt-4 p-4 bg-gray-50 rounded border">
                        <h4 className="font-semibold mb-2">Nội dung mô tả ban đầu:</h4>
                        <p className="whitespace-pre-wrap">{report.description}</p>
                    </div>
                </div>

                {report.status === 'open' && (
                    <button
                        onClick={handleCancel}
                        disabled={cancelMutation.isPending}
                        className="text-red-600 hover:underline text-sm font-medium"
                    >
                        {cancelMutation.isPending ? 'Đang hủy...' : 'Hủy yêu cầu này'}
                    </button>
                )}
            </div>

            {/* Chat Thread */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-bold text-lg mb-4">Trao đổi với Quản trị viên</h3>

                <ReportChatThread messages={report.messages || []} />

                {canChat ? (
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Nhập nội dung tin nhắn..."
                            disabled={sendMessageMutation.isPending}
                            className="flex-1 border p-3 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        <button
                            type="submit"
                            disabled={!messageInput.trim() || sendMessageMutation.isPending}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            Gửi
                        </button>
                    </form>
                ) : (
                    <div className="text-center p-4 bg-gray-100 rounded text-gray-500 text-sm">
                        Yêu cầu này đã được đóng hoặc giải quyết. Bạn không thể gửi thêm tin nhắn.
                    </div>
                )}
            </div>
        </div>
    );
};