// src/features/analysis/components/SessionStatusBadge/SessionStatusBadge.tsx
interface BadgeProps {
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
}

export const SessionStatusBadge = ({ status }: BadgeProps) => {
    // Map màu sắc theo UI Flows
    const config = {
        pending: { color: 'bg-yellow-100 text-yellow-800', label: '⏳ Chờ xử lý' },
        processing: { color: 'bg-blue-100 text-blue-800 animate-pulse', label: '🔄 Đang phân tích' },
        completed: { color: 'bg-green-100 text-green-800', label: '✅ Hoàn thành' },
        failed: { color: 'bg-red-100 text-red-800', label: '❌ Thất bại' },
        cancelled: { color: 'bg-gray-100 text-gray-800', label: '⛔ Đã hủy' },
    };

    const { color, label } = config[status] || config.pending;

    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>{label}</span>;
};