// src/pages/admin/AdminUserDetailPage.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useAdminUserDetail } from '@/features/admin/users/hooks/useAdminUserDetail';
import { useUserLogs } from '@/features/admin/users/hooks/useUserLogs';
import { useBlockUser } from '@/features/admin/users/hooks/useBlockUser';
import { formatDate } from '@/shared/lib/formatters';
import { useToast } from '@/shared/ui/organisms/Toast/useToast';
import { Button } from '@/shared/ui/atoms/Button';

export const AdminUserDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useToast();
    const currentAdminId = useAuthStore(s => s.user?.id); // Để check xem có đang xem chính mình không

    // Gọi 2 API song song
    const { data: user, isLoading: isLoadingUser } = useAdminUserDetail(id || '');
    const { data: logs, isLoading: isLoadingLogs } = useUserLogs(id || '');
    const blockMutation = useBlockUser();

    const [activeTab, setActiveTab] = useState<'info' | 'logins' | 'actions'>('info');

    if (isLoadingUser || isLoadingLogs) return <div className="p-8 text-center animate-pulse">Đang tải hồ sơ...</div>;
    if (!user) return <div className="p-8 text-center text-red-500">Không tìm thấy người dùng.</div>;

    const handleToggleStatus = async () => {
        const newStatus = user.status === 'active' ? 'blocked' : 'active';
        const actionName = newStatus === 'blocked' ? 'Khóa' : 'Mở khóa';

        if (!window.confirm(`Bạn có chắc muốn ${actionName} tài khoản này?`)) return;

        try {
            await blockMutation.mutateAsync({ id: user.id, status: newStatus });
            toast.show(`Đã ${actionName} tài khoản thành công!`, 'success');
        } catch (error: any) {
            toast.show(error.response?.data?.detail || 'Lỗi hệ thống.', 'error');
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="secondary" onClick={() => navigate('/admin/users')}>Trở về</Button>
                <h1 className="text-2xl font-bold">Chi tiết Người Dùng</h1>
            </div>

            {/* Profile Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold">{user.username}</h2>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="mt-4 space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {user.status.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                            Role: {user.role}
                        </span>
                    </div>
                </div>

                {/* Ẩn nút nếu đang xem chính mình */}
                {user.id !== currentAdminId && (
                    <Button
                        variant={user.status === 'active' ? 'danger' : 'primary'}
                        onClick={handleToggleStatus}
                        isLoading={blockMutation.isPending}
                    >
                        {user.status === 'active' ? '🔒 Khóa Tài Khoản' : '🔓 Mở Khóa'}
                    </Button>
                )}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="flex border-b">
                    <button onClick={() => setActiveTab('info')} className={`p-4 font-medium ${activeTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Thông tin</button>
                    <button onClick={() => setActiveTab('logins')} className={`p-4 font-medium ${activeTab === 'logins' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Lịch sử Đăng nhập</button>
                    <button onClick={() => setActiveTab('actions')} className={`p-4 font-medium ${activeTab === 'actions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Nhật ký Hoạt động</button>
                </div>

                <div className="p-6">
                    {activeTab === 'info' && (
                        <div className="space-y-4">
                            <p><strong>ID:</strong> <span className="font-mono text-sm text-gray-500">{user.id}</span></p>
                            <p><strong>Số điện thoại:</strong> {user.phone}</p>
                            <p><strong>Ngày tạo:</strong> {formatDate(user.created_at)}</p>
                        </div>
                    )}

                    {activeTab === 'logins' && (
                        <table className="w-full text-left text-sm">
                            <thead><tr className="border-b"><th className="py-2">IP Address</th><th className="py-2">Thời gian</th></tr></thead>
                            <tbody>
                                {logs?.login_history.map(log => (
                                    <tr key={log.id} className="border-b border-gray-100"><td className="py-2">{log.ip_address}</td><td className="py-2">{formatDate(log.created_at)}</td></tr>
                                ))}
                                {!logs?.login_history.length && <tr><td colSpan={2} className="py-4 text-center text-gray-500">Chưa có lịch sử đăng nhập.</td></tr>}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'actions' && (
                        <table className="w-full text-left text-sm">
                            <thead><tr className="border-b"><th className="py-2">Hành động</th><th className="py-2">Thời gian</th></tr></thead>
                            <tbody>
                                {logs?.activity_logs.map(log => (
                                    <tr key={log.id} className="border-b border-gray-100"><td className="py-2">{log.action}</td><td className="py-2">{formatDate(log.created_at)}</td></tr>
                                ))}
                                {!logs?.activity_logs.length && <tr><td colSpan={2} className="py-4 text-center text-gray-500">Chưa có nhật ký hoạt động.</td></tr>}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};