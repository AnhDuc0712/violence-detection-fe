// src/features/profile/hooks/useUpdateProfile.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api/profile.api';
import type { UserUpdate } from '../types/profile.types';

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UserUpdate) => profileApi.updateMe(data),
        onSuccess: () => {
            // Clear cache để UI tự động cập nhật lại tên/SĐT mới
            queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
        },
    });
};