// src/features/analysis/hooks/useSessionDetail.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import type { AnalysisSessionDetail } from '../types/analysis.types';

// Tách hàm gọi API riêng cho gọn
const getSessionDetail = (id: string) =>
    apiClient.get<AnalysisSessionDetail>(`/analysis/${id}`).then(r => r.data);

export const useSessionDetail = (id: string) => {
    return useQuery({
        queryKey: ['analysis_session', id],
        queryFn: () => getSessionDetail(id),
        enabled: !!id, // Chỉ gọi API khi có id hợp lệ

        // Auto-polling: Tự động gọi lại API mỗi 5 giây nếu AI chưa xử lý xong
        refetchInterval: (query) => {
            const status = query.state.data?.status;
            return (status === 'pending' || status === 'processing') ? 5000 : false;
        },
    });
};