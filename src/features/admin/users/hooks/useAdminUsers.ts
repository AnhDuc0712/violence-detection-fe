// src/features/admin/users/hooks/useAdminUsers.ts
import { useQuery } from '@tanstack/react-query';
import { adminUsersApi } from '../api/admin-users.api';

export const useAdminUsers = (params?: { search?: string; status_filter?: string; skip?: number; limit?: number }) => {
    return useQuery({
        queryKey: ['admin_users', params],
        queryFn: () => adminUsersApi.getUsers(params),
    });
};