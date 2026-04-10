// src/features/admin/users/hooks/useAdminUserDetail.ts
import { useQuery } from '@tanstack/react-query';
import { adminUsersApi } from '../api/admin-users.api';

export const useAdminUserDetail = (id: string) => {
    return useQuery({
        queryKey: ['admin_user', id],
        queryFn: () => adminUsersApi.getUserDetail(id),
        enabled: !!id,
    });
};