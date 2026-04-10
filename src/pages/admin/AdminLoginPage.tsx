// src/pages/admin/AdminLoginPage.tsx
import { useState } from 'react';
import { useAdminLogin } from '@/features/admin/auth/hooks/useAdminLogin'; // ✅ Import Hook mới
import { Button } from '@/shared/ui/atoms/Button';

export const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // ✅ Gọi logic từ Hook (Page giờ cực kỳ mỏng)
    const loginMutation = useAdminLogin();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Gọi mutate và truyền payload
        loginMutation.mutate({ email, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white tracking-wide">
                        <span className="text-purple-500">⚡</span> Admin Portal
                    </h1>
                    <p className="text-gray-400 text-sm mt-2">Đăng nhập để quản trị hệ thống</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email Quản Trị</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-600 bg-gray-700 text-white p-2.5 rounded focus:ring-2 focus:ring-purple-500 outline-none transition"
                            disabled={loginMutation.isPending}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Mật khẩu</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-600 bg-gray-700 text-white p-2.5 rounded focus:ring-2 focus:ring-purple-500 outline-none transition"
                            disabled={loginMutation.isPending}
                        />
                    </div>

                    <Button
                        type="submit"
                        isLoading={loginMutation.isPending}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 mt-2 border-none"
                    >
                        {loginMutation.isPending ? 'Đang xác thực...' : 'Đăng Nhập'}
                    </Button>
                </form>
            </div>
        </div>
    );
};