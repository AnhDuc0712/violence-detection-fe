// src/features/videos/hooks/useVideos.ts
import { useQuery } from '@tanstack/react-query';
import { videosApi } from '../api/videos.api';

export const useVideos = (skip: number = 0, limit: number = 20) => {
    return useQuery({
        queryKey: ['videos', skip, limit],
        queryFn: () => videosApi.getMyVideos(skip, limit),
    });
};