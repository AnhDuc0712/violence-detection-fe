// src/layouts/UserLayout/UserSidebar.tsx
import { NavLink } from 'react-router-dom';

export const UserSidebar = () => {
    // Style cho NavLink: Tự động đổi màu nền xanh nếu đang ở đúng trang đó
    const navItemClass = ({ isActive }: { isActive: boolean }) =>
        `block px-6 py-3 hover:bg-gray-50 transition border-l-4 ${isActive ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-medium' : 'border-transparent text-gray-700'
        }`;

    return (
        <aside className="w-64 bg-white border-r h-full flex flex-col py-4 shrink-0">
            <nav className="flex flex-col gap-1">
                <NavLink to="/dashboard" className={navItemClass}>
                    Trang chủ (Dashboard)
                </NavLink>
                <NavLink to="/videos" className={navItemClass}>
                    Quản lý Video
                </NavLink>
                <NavLink to="/analysis" className={navItemClass}>
                    Phiên Phân tích
                </NavLink>
                <NavLink to="/cam" className={navItemClass}>
                    Camera Realtime
                </NavLink>
                <NavLink to="/reports" className={navItemClass}>
                    Hỗ trợ & Khiếu nại
                </NavLink>

                {/* ✅ Thêm menu Hồ sơ cá nhân vào cuối danh sách */}
                <div className="my-2 border-t mx-4"></div>
                <NavLink to="/profile" className={navItemClass}>
                    Hồ sơ cá nhân
                </NavLink>
            </nav>
        </aside>
    );
};