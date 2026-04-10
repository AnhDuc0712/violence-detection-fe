import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import type { UserCreate } from '../types/auth.types';

export const useRegister = () => {
    return useMutation({
        mutationFn: (data: UserCreate) => authApi.register(data),
    });
};