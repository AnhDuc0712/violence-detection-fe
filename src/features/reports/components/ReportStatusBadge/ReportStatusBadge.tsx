// ============================================================
// src/features/reports/components/ReportStatusBadge/ReportStatusBadge.tsx
// ============================================================
interface ReportStatusBadgeProps {
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
}

export const ReportStatusBadge = ({ status }: ReportStatusBadgeProps) => {
    const config: Record<string, { cls: string; label: string }> = {
        open: { cls: 'bg-yellow-100 text-yellow-800', label: 'Chờ xử lý' },
        in_progress: { cls: 'bg-blue-100 text-blue-800', label: 'Đang xử lý' },
        resolved: { cls: 'bg-green-100 text-green-800', label: 'Đã giải quyết' },
        closed: { cls: 'bg-gray-100 text-gray-700', label: 'Đã đóng' },
    };

    const { cls, label } = config[status] ?? config.open;

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${cls}`}>
            {label}
        </span>
    );
};



