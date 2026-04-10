// src/router/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthGuard } from './guards';
import { UserLayout } from '@/layouts/UserLayout/UserLayout';

// Import toàn bộ Pages của User Portal
import { LoginPage } from '@/pages/user/LoginPage';
import { RegisterPage } from '@/pages/user/RegisterPage';
import { DashboardPage } from '@/pages/user/DashboardPage';
import { ProfilePage } from '@/pages/user/ProfilePage';
import { VideosPage } from '@/pages/user/VideosPage';
import { VideoUploadPage } from '@/pages/user/VideoUploadPage';
import { VideoDetailPage } from '@/pages/user/VideoDetailPage';
import { AnalysisPage } from '@/pages/user/AnalysisPage';
import { AnalysisDetailPage } from '@/pages/user/AnalysisDetailPage';
import { ReportsPage } from '@/pages/user/ReportsPage';
import { ReportNewPage } from '@/pages/user/ReportNewPage';
import { ReportDetailPage } from '@/pages/user/ReportDetailPage';
import { RealtimeCamPage } from '@/pages/user/RealtimeCamPage';
// Import Admin Routes mới tạo
import { adminRoutes } from './admin.routes';

export const router = createBrowserRouter([
    // Tự động chuyển hướng root về dashboard
    { path: '/', element: <Navigate to="/dashboard" replace /> },

    // Các trang không cần đăng nhập (Public)
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },

    // Các trang CẦN đăng nhập (Private)
    {
        element: <AuthGuard />, // Chặn nếu chưa có token
        children: [
            {
                element: <UserLayout />, // Bọc giao diện Header/Sidebar chung
                children: [
                    { path: '/dashboard', element: <DashboardPage /> },
                    { path: '/profile', element: <ProfilePage /> },

                    { path: '/videos', element: <VideosPage /> },
                    { path: '/videos/upload', element: <VideoUploadPage /> },
                    { path: '/videos/:id', element: <VideoDetailPage /> },

                    { path: '/analysis', element: <AnalysisPage /> },
                    { path: '/analysis/:id', element: <AnalysisDetailPage /> },

                    { path: '/reports', element: <ReportsPage /> },
                    { path: '/reports/new', element: <ReportNewPage /> },
                    { path: '/reports/:id', element: <ReportDetailPage /> },
                    { path: '/cam', element: <RealtimeCamPage /> },
                ],
            },
        ],
    },

    // Bắt lỗi 404 (Trang không tồn tại)
    {
        path: '*',
        element: (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
                    <p className="text-xl text-gray-600">Trang bạn tìm kiếm không tồn tại.</p>
                    <a href="/dashboard" className="mt-6 inline-block text-blue-600 hover:underline">Về trang chủ</a>
                </div>
            </div>
        ),
    }
    , ...adminRoutes
]);