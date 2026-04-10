// src/router/admin.routes.tsx
import { Navigate } from 'react-router-dom';
import { AdminGuard } from './guards';
import { AdminLayout } from '@/layouts/AdminLayout/AdminLayout';

// ✅ IMPORT CÁC TRANG THẬT ĐÃ CODE
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminUserDetailPage } from '@/pages/admin/AdminUserDetailPage';
import { AdminAnalysisPage } from '@/pages/admin/AdminAnalysisPage';
import { AdminMLReviewPage } from '@/pages/admin/AdminMLReviewPage';
import { AdminReportsPage } from '@/pages/admin/AdminReportsPage';
import { AdminReportDetailPage } from '@/pages/admin/AdminReportDetailPage';
// Trang 403 giữ nguyên vì nó chỉ là thông báo nhỏ
const ForbiddenPage = () => (
    <div className="min-h-screen flex items-center justify-center text-center bg-gray-100">
        <div>
            <h1 className="text-4xl font-bold text-red-600 mb-2">403 - Cấm Truy Cập</h1>
            <p className="text-gray-600">Bạn không có quyền quản trị viên.</p>
            <a href="/login" className="text-blue-500 hover:underline mt-4 inline-block">Về trang đăng nhập User</a>
        </div>
    </div>
);

export const adminRoutes = [
    // Trang login admin là public (không cần guard)
    { path: '/admin/login', element: <AdminLoginPage /> },
    { path: '/403', element: <ForbiddenPage /> },

    // Tự động chuyển hướng /admin về dashboard
    { path: '/admin', element: <Navigate to="/admin/dashboard" replace /> },

    // Nhóm route CẦN quyền Admin
    {
        element: <AdminGuard />,
        children: [
            {
                element: <AdminLayout />, // Bọc giao diện Header/Sidebar Admin chung
                children: [
                    { path: '/admin/dashboard', element: <AdminDashboardPage /> },
                    { path: '/admin/users', element: <AdminUsersPage /> },
                    { path: '/admin/users/:id', element: <AdminUserDetailPage /> },
                    { path: '/admin/analysis', element: <AdminAnalysisPage /> },
                    { path: '/admin/ml-review', element: <AdminMLReviewPage /> },
                    { path: '/admin/reports', element: <AdminReportsPage /> },
                    { path: '/admin/reports/:id', element: <AdminReportDetailPage /> },
                ],
            },
        ],
    },
];