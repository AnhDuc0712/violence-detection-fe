import { Link } from 'react-router-dom';
import { formatDate } from '@/shared/lib/formatters';
import type { VideoRead } from '../../types/video.types';

export const VideoListItem = ({ video }: { video: VideoRead }) => {
    return (
        <Link to={`/videos/${video.id}`} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition">
            <div className="truncate pr-4">
                <p className="font-medium text-sm text-gray-800 truncate" title={video.original_filename || ''}>
                    {video.original_filename || 'Video không tên'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{formatDate(video.created_at)}</p>
            </div>
            <span className="text-gray-400">›</span>
        </Link>
    );
};