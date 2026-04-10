// src/features/admin/analysis/components/AdminVideoTable/AdminVideoTable.tsx
import { useAdminVideos } from '../../hooks/useAdminVideos';
import { formatDate, formatFileSize } from '@/shared/lib/formatters';

export const AdminVideoTable = () => {
    const { data: videos, isLoading, isError } = useAdminVideos();

    if (isLoading) return <div className="p-8 text-center animate-pulse text-gray-500">Đang tải danh sách video...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Lỗi tải dữ liệu.</div>;
    if (!videos?.length) return <div className="p-8 text-center text-gray-500">Không có video nào trên hệ thống.</div>;

    return (
        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table className="w-full text-left border-collapse text-sm">
                <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase">
                        <th className="p-4 border-b">Tên File</th>
                        <th className="p-4 border-b">Owner ID</th>
                        <th className="p-4 border-b">Dung lượng</th>
                        <th className="p-4 border-b">Ngày tải lên</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {videos.map(video => (
                        <tr key={video.id} className="hover:bg-gray-50">
                            <td className="p-4 font-medium truncate max-w-xs" title={video.original_filename || 'Unknown'}>
                                {video.original_filename || 'Video không tên'}
                            </td>
                            <td className="p-4 text-gray-500 font-mono text-xs">{video.owner_user_id.substring(0, 8)}...</td>
                            <td className="p-4 text-gray-600">{formatFileSize(video.size_bytes)}</td>
                            <td className="p-4 text-gray-500">{formatDate(video.created_at)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};