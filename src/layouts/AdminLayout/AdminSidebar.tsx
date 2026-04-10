// src/layouts/AdminLayout/AdminSidebar.tsx
import { NavLink } from 'react-router-dom';
import { useDashboardStats } from '@/features/admin/dashboard/hooks/useDashboardStats';

export const AdminSidebar = () => {
    // Lấy data từ cache (nếu đã gọi ở Dashboard rồi thì lấy ra dùng luôn)
    const { data: stats } = useDashboardStats();

    const navItemClass = ({ isActive }: { isActive: boolean }) =>
        `flex justify-between items-center px-6 py-3 hover:bg-gray-800 transition border-l-4 ${isActive ? 'border-purple-500 bg-gray-800 text-white font-medium' : 'border-transparent text-gray-400'
        }`;

    return (
        <aside className="w-64 bg-gray-900 border-r border-gray-800 h-full flex flex-col py-4 shrink-0 text-sm">
            <div className="px-6 pb-6 mb-2 border-b border-gray-800">
                <span className="text-gray-500 uppercase font-bold tracking-wider text-xs">Quản trị hệ thống</span>
            </div>

            <nav className="flex flex-col gap-1">
                <NavLink to="/admin/dashboard" className={navItemClass}>
                    <span>📊 Tổng Quan</span>
                </NavLink>

                <NavLink to="/admin/users" className={navItemClass}>
                    <span>👥 Người Dùng</span>
                    {/* Badge xám nhỏ cho tổng user */}
                    {stats && <span className="bg-gray-700 text-gray-300 py-0.5 px-2 rounded-full text-xs">{stats.system_stats.total_users}</span>}
                </NavLink>

                <NavLink to="/admin/analysis" className={navItemClass}>
                    <span>🎥 Video & Phân Tích</span>
                </NavLink>

                <NavLink to="/admin/ml-review" className={navItemClass}>
                    <span>👁️ Duyệt AI (ML)</span>
                    {/* Badge đỏ cảnh báo nếu có việc chờ */}
                    {stats && stats.pending_tasks.pending_ml_reviews > 0 && (
                        <span className="bg-red-500 text-white py-0.5 px-2 rounded-full text-xs animate-pulse">
                            {stats.pending_tasks.pending_ml_reviews}
                        </span>
                    )}
                </NavLink>

                <NavLink to="/admin/reports" className={navItemClass}>
                    <span>🎧 Hỗ Trợ (Tickets)</span>
                    {/* Badge vàng cảnh báo ticket mở */}
                    {stats && stats.pending_tasks.open_reports > 0 && (
                        <span className="bg-yellow-500 text-white py-0.5 px-2 rounded-full text-xs">
                            {stats.pending_tasks.open_reports}
                        </span>
                    )}
                </NavLink>
            </nav>
        </aside>
    );
};