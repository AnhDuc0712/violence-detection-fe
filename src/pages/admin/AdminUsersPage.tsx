// src/pages/admin/AdminUsersPage.tsx
// src/pages/admin/AdminUsersPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminUsers } from '@/features/admin/users/hooks/useAdminUsers';
import { formatDate } from '@/shared/lib/formatters';
// ✅ Import chuẩn từ Shared
import { useDebounce } from '@/shared/hooks/useDebounce';

export const AdminUsersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 300);
    const [statusFilter, setStatusFilter] = useState('');

    const { data: users, isLoading, isError } = useAdminUsers({
        search: debouncedSearch || undefined,
        status_filter: statusFilter || undefined,
    });

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header & Filters */}
            <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-xl font-bold text-gray-800">Quản lý Người Dùng</h1>
                <div className="flex gap-4 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Tìm email hoặc username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border p-2 rounded w-full sm:w-64"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="active">Hoạt động (Active)</option>
                        <option value="blocked">Bị khóa (Blocked)</option>
                    </select>
                </div>
            </div>

            {/* User Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-sm uppercase">
                            <th className="p-4 border-b">Username</th>
                            <th className="p-4 border-b">Email</th>
                            <th className="p-4 border-b">Role</th>
                            <th className="p-4 border-b">Trạng thái</th>
                            <th className="p-4 border-b">Ngày tạo</th>
                            <th className="p-4 border-b">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                        {isLoading && (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500 animate-pulse">Đang tải danh sách...</td></tr>
                        )}
                        {isError && (
                            <tr><td colSpan={6} className="p-8 text-center text-red-500">Lỗi tải dữ liệu.</td></tr>
                        )}
                        {users?.length === 0 && (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500">Không tìm thấy người dùng nào.</td></tr>
                        )}
                        {users?.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 transition">
                                <td className="p-4 font-medium">{user.username}</td>
                                <td className="p-4 text-gray-600">{user.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500">{formatDate(user.created_at)}</td>
                                <td className="p-4">
                                    <Link to={`/admin/users/${user.id}`} className="text-blue-600 hover:underline">Chi tiết</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};