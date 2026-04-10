// src/features/admin/reports/components/AdminChatThread/AdminChatThread.tsx
import { useState } from 'react';
import { useAdminReply } from '../../hooks/useAdminReportsHooks';
import { formatDate } from '@/shared/lib/formatters';
import { Button } from '@/shared/ui/atoms/Button';
import type { AdminReportDetail } from '../../types/admin-reports.types';

export const AdminChatThread = ({ report }: { report: AdminReportDetail }) => {
    const [message, setMessage] = useState('');
    const replyMutation = useAdminReply();
    const isClosed = report.status === 'closed' || report.status === 'resolved';

    const handleSend = async () => {
        if (!message.trim()) return;
        try {
            await replyMutation.mutateAsync({ id: report.id, data: { message } });
            setMessage('');
        } catch (error) { }
    };

    return (
        <div className="bg-white rounded-lg border shadow-sm flex flex-col h-[700px]">
            {/* Header chi tiết report */}
            <div className="p-5 border-b bg-gray-50 rounded-t-lg">
                <h3 className="text-lg font-bold text-gray-800">{report.title || 'Yêu cầu hỗ trợ'}</h3>
                <p className="text-gray-600 text-sm mt-2 whitespace-pre-wrap">{report.description}</p>
            </div>

            {/* Khung chứa tin nhắn */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
                {report.messages.map((msg) => {
                    const isAdmin = msg.sender_user_id !== report.reporter_user_id; // Check sender
                    return (
                        <div key={msg.id} className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}>
                            <span className="text-xs text-gray-400 mb-1 mx-1">
                                {isAdmin ? 'Admin (You)' : 'User'} • {formatDate(msg.created_at)}
                            </span>
                            <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${isAdmin ? 'bg-purple-600 text-white rounded-tl-none shadow-md' : 'bg-gray-200 text-gray-800 rounded-tr-none'}`}>
                                {msg.message}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Khung Input (Ẩn nếu status = resolved/closed) */}
            {!isClosed ? (
                <div className="p-4 border-t bg-white rounded-b-lg">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Nhập phản hồi cho người dùng..."
                        rows={3}
                        className="w-full border p-3 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none bg-gray-50"
                    />
                    <div className="flex justify-end mt-2">
                        <Button variant="primary" onClick={handleSend} isLoading={replyMutation.isPending} disabled={!message.trim()}>
                            Gửi phản hồi
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="p-4 border-t bg-gray-100 rounded-b-lg text-center text-sm text-gray-500 font-medium">
                    🔒 Ticket này đã được đóng hoặc giải quyết. Không thể gửi thêm tin nhắn.
                </div>
            )}
        </div>
    );
};