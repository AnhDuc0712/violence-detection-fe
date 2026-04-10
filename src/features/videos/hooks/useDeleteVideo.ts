import { useMutation, useQueryClient } from '@tanstack/react-query';
import { videosApi } from '../api/videos.api';

export const useDeleteVideo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => videosApi.deleteVideo(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['videos'] });
        },
    });
};