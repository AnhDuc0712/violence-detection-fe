// src/features/admin/users/api/admin-users.api.ts
import { apiClient } from '@/shared/api/client';
import type { UserResponse } from '@/shared/types/user.types';
import type { UserLogsResponse } from '../types/admin-users.types';

export const adminUsersApi = {
    // ADMIN-C1: Lấy danh sách (Có phân trang, tìm kiếm, lọc)
    getUsers: (params?: { search?: string; status_filter?: string; skip?: number; limit?: number }) =>
        apiClient.get<UserResponse[]>('/admin/users', { params }).then(r => r.data),

    // ADMIN-C2: Lấy chi tiết
    getUserDetail: (id: string) =>
        apiClient.get<UserResponse>(`/admin/users/${id}`).then(r => r.data),

    // ADMIN-C4: Lấy lịch sử hoạt động
    getUserLogs: (id: string, params?: { skip?: number; limit?: number }) =>
        apiClient.get<UserLogsResponse>(`/admin/users/${id}/logs`, { params }).then(r => r.data),

    // ADMIN-C3: Khóa/Mở khóa (PATCH, params)
    updateUserStatus: (id: string, new_status: 'active' | 'blocked' | 'suspended') =>
        apiClient.patch(`/admin/users/${id}/status`, null, { params: { new_status } }).then(r => r.data),
};