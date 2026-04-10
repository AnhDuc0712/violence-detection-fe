// src/features/admin/auth/hooks/useAdminLogin.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/shared/api/client';
import { useAuthStore } from '@/store/auth.store';
import { useToast } from '@/shared/ui/organisms/Toast/useToast';
import type { Token, UserLogin } from '@/features/auth/types/auth.types'; // ✅ Sửa nguồn import
import type { UserResponse } from '@/shared/types/user.types';

export const useAdminLogin = () => {
    const { login, logout } = useAuthStore();
    const navigate = useNavigate();
    const toast = useToast();

    return useMutation({
        mutationFn: async (data: UserLogin) => {
            // Bước 1: Lấy Token
            const { data: tokenData } = await apiClient.post<Token>('/auth/login', data);

            // Bước 1.5: Ép token vào store tạm thời để Axios Interceptor có thể dùng cho request tiếp theo
            useAuthStore.setState({ token: tokenData.access_token });

            // Bước 2: Gọi API lấy Profile
            const { data: profile } = await apiClient.get<UserResponse>('/profile/me');

            // Bước 3: Cảnh vệ phân quyền
            if (profile.role !== 'admin' && profile.role !== 'super_admin') {
                throw new Error('NO_ADMIN_ROLE');
            }

            // Thành công toàn tập: Lưu chính thức vào store persist
            login(tokenData.access_token, profile);
            return profile;
        },
        onSuccess: (profile) => {
            toast.show(`Chào mừng Admin ${profile.username}!`, 'success');
            navigate('/admin/dashboard');
        },
        onError: (error: any) => {
            logout(); // Quét sạch token tạm nếu bị lỗi giữa chừng
            const msg = error.message === 'NO_ADMIN_ROLE'
                ? 'Tài khoản không có quyền quản trị viên.'
                : 'Sai email hoặc mật khẩu.';
            toast.show(msg, 'error');
        }
    });
};