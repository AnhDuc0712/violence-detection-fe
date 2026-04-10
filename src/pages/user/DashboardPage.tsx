import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useVideos } from '@/features/videos/hooks/useVideos';
import { useSessions } from '@/features/analysis/hooks/useSessions';

// ✅ Import các UI Components đã được đóng gói từ Feature
import { VideoListItem } from '@/features/videos/components/VideoListItem';
import { SessionListItem } from '@/features/analysis/components/SessionListItem';

export const DashboardPage = () => {
    const user = useAuthStore(s => s.user);
    const { data: videos, isLoading: loadingVideos } = useVideos(0);
    const { data: sessions, isLoading: loadingSessions } = useSessions({ skip: 0, limit: 3 });

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Header Lời Chào */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Xin chào, <span className="text-blue-600 capitalize">{user?.username || 'bạn'}</span>! 👋</h1>
                <p className="text-gray-500 mt-2 text-lg">Chào mừng trở lại Hệ Thống Phân Tích Bạo Lực bằng AI.</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/videos/upload" className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">📤</div>
                    <h3 className="text-lg font-bold text-gray-800">Upload Video</h3>
                    <p className="text-sm text-gray-500 mt-1">Tải video mới lên hệ thống để bắt đầu quá trình phân tích AI.</p>
                </Link>

                <Link to="/analysis" className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-300 transition-all">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">📊</div>
                    <h3 className="text-lg font-bold text-gray-800">Phiên Phân Tích</h3>
                    <p className="text-sm text-gray-500 mt-1">Xem tiến trình và kết quả chi tiết của các video đang được xử lý.</p>
                </Link>

                <Link to="/reports/new" className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">🎧</div>
                    <h3 className="text-lg font-bold text-gray-800">Yêu Cầu Hỗ Trợ</h3>
                    <p className="text-sm text-gray-500 mt-1">Gửi khiếu nại về kết quả AI hoặc báo cáo lỗi cho Quản trị viên.</p>
                </Link>
            </div>

            {/* Bảng Dữ Liệu Tổng Quan */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Cột Trái: Video */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="font-bold text-gray-800">🎬 Video tải lên gần đây</h2>
                        <Link to="/videos" className="text-sm text-blue-600 hover:underline font-medium">Xem tất cả →</Link>
                    </div>
                    <div className="p-5 flex-1">
                        {loadingVideos ? (
                            <div className="animate-pulse space-y-3">
                                {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 rounded"></div>)}
                            </div>
                        ) : !videos || videos.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">Bạn chưa tải lên video nào.</div>
                        ) : (
                            <div className="space-y-3">
                                {/* ✅ Chỉ truyền Props, code HTML phức tạp đã bị giấu đi */}
                                {videos.map(video => (
                                    <VideoListItem key={video.id} video={video} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Cột Phải: Sessions */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="font-bold text-gray-800">⚙️ Tiến trình AI gần đây</h2>
                        <Link to="/analysis" className="text-sm text-blue-600 hover:underline font-medium">Xem tất cả →</Link>
                    </div>
                    <div className="p-5 flex-1">
                        {loadingSessions ? (
                            <div className="animate-pulse space-y-3">
                                {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 rounded"></div>)}
                            </div>
                        ) : !sessions || sessions.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">Chưa có phiên phân tích nào.</div>
                        ) : (
                            <div className="space-y-3">
                                {/* ✅ Gọn gàng tuyệt đối */}
                                {sessions.map(session => (
                                    <SessionListItem key={session.id} session={session} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};