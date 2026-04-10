// src/features/admin/analysis/hooks/useAdminVideos.ts
import { useQuery } from '@tanstack/react-query';
import { adminAnalysisApi } from '../api/admin-analysis.api';

export const useAdminVideos = (params?: { skip?: number; limit?: number }) => {
    return useQuery({
        queryKey: ['admin_videos', params],
        queryFn: () => adminAnalysisApi.getVideos(params),
    });
};