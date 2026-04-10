// src/pages/user/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { profileApi } from '@/features/profile/api/profile.api';
import { LoginForm } from '@/features/auth/components/LoginForm/LoginForm';
import type { UserLogin } from '@/features/auth/types/auth.types';

export const LoginPage = () => {
    const navigate = useNavigate();
    const loginMutation = useLogin();
    const setAuthData = useAuthStore((s) => s.login);

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleLoginSubmit = async (data: UserLogin) => {
        setErrorMsg(null);
        try {
            // 1. Gọi API Login lấy Token
            const tokenResponse = await loginMutation.mutateAsync(data);

            // Tạm lưu token để axios interceptor có thể dùng gọi API tiếp theo
            useAuthStore.setState({ token: tokenResponse.access_token });

            // 2. Gọi API lấy thông tin Profile ngay sau khi có token
            const userResponse = await profileApi.getMe();

            // 3. Lưu toàn bộ vào Global Store
            setAuthData(tokenResponse.access_token, userResponse);

            // 4. Redirect
            navigate('/dashboard');

        } catch (error: any) {
            // Xử lý lỗi 400 (Sai thông tin hoặc account bị khóa)
            const detail = error.response?.data?.detail || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
            setErrorMsg(detail);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-6 text-center">Hệ Thống Phân Tích Bạo Lực</h1>

                <LoginForm
                    onSubmit={handleLoginSubmit}
                    isLoading={loginMutation.isPending}
                    errorMsg={errorMsg}
                />

                <p className="mt-4 text-sm text-gray-600">
                    Chưa có tài khoản? <a href="/register" className="text-blue-600 hover:underline">Đăng ký ngay</a>
                </p>
            </div>
        </div>
    );
};