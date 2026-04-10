// src/features/realtime-cam/components/CamStatusBadge/CamStatusBadge.tsx
import type { CamStatus } from '../../types/realtime-cam.types';

const CONFIG: Record<CamStatus, { cls: string; label: string }> = {
    idle: { cls: 'bg-gray-100 text-gray-600', label: 'Chưa bật camera' },
    requesting: { cls: 'bg-yellow-100 text-yellow-700 animate-pulse', label: 'Đang xin quyền...' },
    active: { cls: 'bg-green-100 text-green-700', label: 'Camera sẵn sàng' },
    analyzing: { cls: 'bg-blue-100 text-blue-700 animate-pulse', label: 'Đang phân tích...' },
    error: { cls: 'bg-red-100 text-red-700', label: 'Lỗi camera' },
    disconnected: { cls: 'bg-orange-100 text-orange-700', label: 'Mất kết nối BE' },
};

export const CamStatusBadge = ({ status }: { status: CamStatus }) => {
    const { cls, label } = CONFIG[status];
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
};