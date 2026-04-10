// src/features/videos/hooks/useUploadVideo.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { videosApi } from '../api/videos.api';
import type { AxiosProgressEvent } from 'axios';

interface UploadPayload {
    file: File;
    onProgress?: (progressEvent: AxiosProgressEvent) => void;
}

export const useUploadVideo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ file, onProgress }: UploadPayload) => videosApi.uploadVideo(file, onProgress),
        onSuccess: () => {
            // Invalidate cache để refetch lại danh sách video
            queryClient.invalidateQueries({ queryKey: ['videos'] });
        },
    });
};