// src/layouts/UserLayout/UserLayout.tsx
import { Outlet } from 'react-router-dom';
import { UserHeader } from './UserHeader';
import { UserSidebar } from './UserSidebar';

export const UserLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Lắp ráp thanh Header vào đây */}
            <UserHeader />

            <div className="flex flex-1 overflow-hidden">
                {/* Lắp ráp thanh Sidebar vào đây */}
                <UserSidebar />

                {/* Main Content Area: Nơi các trang (Pages) sẽ được render */}
                <main className="flex-1 overflow-y-auto bg-gray-50 relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};