// src/features/auth/hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import type { UserLogin } from '../types/auth.types';

export const useLogin = () => {
    return useMutation({
        mutationFn: (data: UserLogin) => authApi.login(data),
    });
};

