// src/layouts/AdminLayout/AdminLayout.tsx
import { Outlet } from 'react-router-dom';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';

export const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
            <AdminHeader />
            <div className="flex flex-1 overflow-hidden">
                <AdminSidebar />
                {/* Khu vực nội dung chính của Admin Portal */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};