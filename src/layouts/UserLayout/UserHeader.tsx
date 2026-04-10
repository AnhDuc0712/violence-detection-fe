// src/layouts/UserLayout/UserHeader.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

export const UserHeader = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
            {/* Nhấn vào Logo/Tên app cũng sẽ về trang chủ cho tiện */}
            <Link to="/dashboard" className="font-bold text-blue-700 text-lg hover:text-blue-800 transition">
                Hệ Thống Phân Tích Bạo Lực
            </Link>

            <div className="flex items-center gap-6">
                {/* ✅ Thẻ Link giúp text biến thành nút bấm chuyển trang */}
                <Link
                    to="/profile"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600 hover:underline transition cursor-pointer"
                    title="Xem hồ sơ cá nhân"
                >
                    Chào, {user?.username || 'Bạn'}
                </Link>

                <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded transition font-medium"
                >
                    Đăng xuất
                </button>
            </div>
        </header>
    );
};