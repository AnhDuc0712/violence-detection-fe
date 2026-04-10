// src/layouts/AdminLayout/AdminHeader.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

export const AdminHeader = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login'); // Redirect về trang login admin
    };

    return (
        <header className="bg-gray-900 border-b border-gray-800 h-16 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
            <Link to="/admin/dashboard" className="font-bold text-white text-lg tracking-wide flex items-center gap-2">
                <span className="text-purple-500">⚡</span> Admin Portal
            </Link>

            <div className="flex items-center gap-6">
                <span className="text-sm font-medium text-gray-300">
                    Role: <span className="text-purple-400 capitalize">{user?.role || 'Admin'}</span>
                </span>

                <button
                    onClick={handleLogout}
                    className="text-sm text-gray-400 hover:text-white border border-gray-600 hover:bg-gray-700 px-4 py-1.5 rounded transition"
                >
                    Đăng xuất
                </button>
            </div>
        </header>
    );
};