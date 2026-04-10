// src/pages/user/ProfilePage.tsx
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useUpdateProfile } from '@/features/profile/hooks/useUpdateProfile';
import { useChangePassword } from '@/features/profile/hooks/useChangePassword';
import { ProfileForm } from '@/features/profile/components/ProfileForm/ProfileForm';
import { ChangePasswordForm } from '@/features/profile/components/ChangePasswordForm/ChangePasswordForm';
import { useToast } from '@/shared/ui/organisms/Toast/useToast';

export const ProfilePage = () => {
    const toast = useToast();

    // Custom Hooks xử lý API và Caching
    const { data: user, isLoading } = useProfile();
    const updateMutation = useUpdateProfile();
    const passwordMutation = useChangePassword();

    if (isLoading) return <div className="p-8 text-center">Đang tải hồ sơ...</div>;
    if (!user) return null;

    const handleUpdateProfile = async (data: any) => {
        try {
            await updateMutation.mutateAsync(data);
            toast.show('Cập nhật thông tin thành công', 'success');
        } catch (error) {
            toast.show('Lỗi cập nhật thông tin', 'error');
        }
    };

    const handleChangePassword = async (data: any) => {
        try {
            await passwordMutation.mutateAsync(data);
            toast.show('Đổi mật khẩu thành công. Vui lòng đăng nhập lại.', 'success');
            // Logic logout sẽ được handle ở tầng Hook hoặc Axios Interceptor
        } catch (error: any) {
            const msg = error.response?.data?.detail || 'Mật khẩu cũ không chính xác';
            toast.show(msg, 'error');
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Hồ Sơ Cá Nhân</h1>

            <div className="bg-white p-6 border rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">Thông tin cơ bản</h2>
                <ProfileForm
                    initialData={user}
                    onSubmit={handleUpdateProfile}
                    isLoading={updateMutation.isPending}
                />
            </div>

            <div className="bg-white p-6 border rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">Đổi mật khẩu</h2>
                <ChangePasswordForm
                    onSubmit={handleChangePassword}
                    isLoading={passwordMutation.isPending}
                />
            </div>
        </div>
    );
};