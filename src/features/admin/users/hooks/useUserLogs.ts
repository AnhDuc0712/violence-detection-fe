// src/features/admin/users/hooks/useUserLogs.ts
import { useQuery } from '@tanstack/react-query';
import { adminUsersApi } from '../api/admin-users.api';

export const useUserLogs = (id: string) => {
    return useQuery({
        queryKey: ['admin_user_logs', id],
        queryFn: () => adminUsersApi.getUserLogs(id),
        enabled: !!id,
    });
};