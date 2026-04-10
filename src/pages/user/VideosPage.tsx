// src/pages/user/VideosPage.tsx
import { Link } from 'react-router-dom';
import { useVideos } from '@/features/videos/hooks/useVideos';
import { VideoCard } from '@/features/videos/components/VideoCard/VideoCard';

export const VideosPage = () => {
    const { data: videos, isLoading, isError, error } = useVideos();

    if (isLoading) return <div className="p-8 text-center">Đang tải danh sách video...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Lỗi: {(error as Error).message}</div>;

    const isEmpty = !videos || videos.length === 0;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Video của tôi</h1>
                <Link
                    to="/videos/upload"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Upload Video
                </Link>
            </div>

            {isEmpty ? (
                // Empty State
                <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed">
                    <p className="text-gray-500 mb-4">Chưa có video nào. Hãy upload video đầu tiên!</p>
                    <Link to="/videos/upload" className="text-blue-600 font-medium hover:underline">
                        Tải lên ngay
                    </Link>
                </div>
            ) : (
                // Video Grid
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {videos.map((video) => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </div>
            )}
        </div>
    );
};