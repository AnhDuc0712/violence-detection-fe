// src/features/profile/hooks/useChangePassword.ts
import { useMutation } from '@tanstack/react-query';
import { profileApi } from '../api/profile.api';
import type { UserChangePassword } from '../types/profile.types';

export const useChangePassword = () => {
    return useMutation({
        mutationFn: (data: UserChangePassword) => profileApi.changePassword(data),
    });
};