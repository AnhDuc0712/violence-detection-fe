// src/features/auth/api/auth.api.ts
import { apiClient } from '@/shared/api/client';
import type { UserCreate, UserLogin, Token, UserResponse } from '../types/auth.types';

export const authApi = {
    register: (data: UserCreate) =>
        apiClient.post<UserResponse>('/auth/register', data).then(r => r.data),

    login: (data: UserLogin) =>
        apiClient.post<Token>('/auth/login', data).then(r => r.data),
};