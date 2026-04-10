// src/router/guards.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

// Bảo vệ User routes
export const AuthGuard = () => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />; // Redirect về login nếu chưa auth
    }

    return <Outlet />;
};

// Bảo vệ Admin routes
export const AdminGuard = () => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Yêu cầu role admin hoặc super_admin
    const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

    if (!isAdmin) {
        return <Navigate to="/403" replace />; // Sai role -> 403 page
    }

    return <Outlet />;
};