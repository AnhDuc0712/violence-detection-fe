// src/features/videos/hooks/useVideoDetail.ts
import { useQuery } from '@tanstack/react-query';
import { videosApi } from '../api/videos.api';

export const useVideoDetail = (id: string) => {
    return useQuery({
        queryKey: ['video', id],
        queryFn: () => videosApi.getVideoById(id),
        enabled: !!id, // Chỉ gọi API khi id tồn tại
    });
};
