// ============================================================
// src/features/reports/components/ReportChatThread/ReportChatThread.tsx
// ============================================================
import { useAuthStore } from '@/store/auth.store';
import { formatDate } from '@/shared/lib/formatters';
import type { ReportMessageRead } from '../../types/report.types';

interface ReportChatThreadProps {
    messages: ReportMessageRead[];
}

export const ReportChatThread = ({ messages }: ReportChatThreadProps) => {
    const currentUser = useAuthStore((s) => s.user);

    if (messages.length === 0) {
        return (
            <div className="py-8 text-center text-gray-400 text-sm">
                Chưa có tin nhắn nào.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 mb-4 max-h-96 overflow-y-auto">
            {messages.map((msg) => {
                // Phân biệt User message (phải) vs Admin message (trái)
                const isOwn = msg.sender_user_id === currentUser?.id;

                return (
                    <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm shadow-sm ${isOwn
                                ? 'bg-blue-600 text-white rounded-br-sm'
                                : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                                }`}
                        >
                            <p className="whitespace-pre-wrap">{msg.message}</p>
                            <p className={`text-xs mt-1 ${isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
                                {formatDate(msg.created_at)}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};