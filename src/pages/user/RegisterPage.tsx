// src/pages/user/RegisterPage.tsx
import { useNavigate } from 'react-router-dom';
import { useRegister } from '@/features/auth/hooks/useRegister';
import { RegisterForm } from '@/features/auth/components/RegisterForm/RegisterForm';
import { useToast } from '@/shared/ui/organisms/Toast/useToast';
import type { UserCreate } from '@/features/auth/types/auth.types';

export const RegisterPage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const registerMutation = useRegister();

    const handleRegister = async (data: UserCreate) => {
        try {
            await registerMutation.mutateAsync(data);
            toast.show('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
            navigate('/login'); // Luồng A.1
        } catch (error: any) {
            const detail = error.response?.data?.detail || 'Lỗi đăng ký. Vui lòng thử lại.';
            toast.show(detail, 'error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Đăng Ký Tài Khoản</h1>
                <RegisterForm onSubmit={handleRegister} isLoading={registerMutation.isPending} />
                <p className="mt-4 text-center text-sm text-gray-600">
                    Đã có tài khoản? <a href="/login" className="text-blue-600 hover:underline">Đăng nhập</a>
                </p>
            </div>
        </div>
    );
};