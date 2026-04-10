// src/features/videos/components/VideoCard/VideoCard.tsx
import { Link } from 'react-router-dom';
import type { VideoRead } from '../../types/video.types';
import { formatFileSize, formatDate } from '@/shared/lib/formatters';

interface VideoCardProps {
    video: VideoRead;
    onDelete?: (id: string) => void;
}

export const VideoCard = ({ video, onDelete }: VideoCardProps) => {
    return (
        <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white flex flex-col">
            <div className="flex-1">
                <h3 className="font-semibold text-lg truncate" title={video.original_filename || 'Unknown'}>
                    {video.original_filename || 'Video không tên'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    Dung lượng: {formatFileSize(video.size_bytes)}
                </p>
                <p className="text-sm text-gray-500">
                    Ngày tải lên: {formatDate(video.created_at)}
                </p>
            </div>

            <div className="mt-4 flex gap-2">
                <Link
                    to={`/videos/${video.id}`}
                    className="flex-1 text-center bg-blue-50 text-blue-600 py-2 rounded hover:bg-blue-100 transition"
                >
                    Xem chi tiết
                </Link>
                {/* Chỉ render nút Xóa nếu có truyền prop onDelete */}
                {onDelete && (
                    <button
                        onClick={() => onDelete(video.id)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                    >
                        Xóa
                    </button>
                )}
            </div>
        </div>
    );
};