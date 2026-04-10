// src/features/admin/users/hooks/useBlockUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUsersApi } from '../api/admin-users.api';

export const useBlockUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: 'active' | 'blocked' | 'suspended' }) =>
            adminUsersApi.updateUserStatus(id, status),
        onSuccess: (_, { id }) => {
            // Invalidate cache để bảng và chi tiết tự động cập nhật
            queryClient.invalidateQueries({ queryKey: ['admin_users'] });
            queryClient.invalidateQueries({ queryKey: ['admin_user', id] });
        },
    });
};