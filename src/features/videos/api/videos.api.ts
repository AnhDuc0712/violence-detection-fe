// src/features/videos/api/videos.api.ts
import { apiClient } from '@/shared/api/client';
import type { VideoRead } from '../types/video.types';
import type { AxiosProgressEvent } from 'axios';

export const videosApi = {
    // Lấy danh sách với pagination mặc định
    getMyVideos: (skip = 0, limit = 20) =>
        apiClient.get<VideoRead[]>('/videos', { params: { skip, limit } }).then(r => r.data),

    getVideoById: (id: string) =>
        apiClient.get<VideoRead>(`/videos/${id}`).then(r => r.data),

    // Sử dụng FormData để upload file, hỗ trợ callback progress
    uploadVideo: (file: File, onProgress?: (progressEvent: AxiosProgressEvent) => void) => {
        const form = new FormData();
        form.append('file', file);
        return apiClient.post<VideoRead>('/videos/upload', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: onProgress
        }).then(r => r.data);
    },

    deleteVideo: (id: string) =>
        apiClient.delete(`/videos/${id}`),
};