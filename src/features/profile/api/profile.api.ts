// src/features/profile/api/profile.api.ts
import { apiClient } from '@/shared/api/client';
import type { UserResponse } from '@/shared/types/user.types'; // ✅ shared, không phải features/auth
import type { UserUpdate, UserChangePassword } from '../types/profile.types';

export const profileApi = {
    // B1 — GET /profile/me
    getMe: () =>
        apiClient.get<UserResponse>('/profile/me').then((r) => r.data),

    // B2 — PUT /profile/me
    updateMe: (data: UserUpdate) =>
        apiClient.put<UserResponse>('/profile/me', data).then((r) => r.data),

    // B3 — PUT /profile/me/password
    changePassword: (data: UserChangePassword) =>
        apiClient.put<{ message: string }>('/profile/me/password', data).then((r) => r.data),
};