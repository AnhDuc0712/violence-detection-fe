// src/pages/user/AnalysisDetailPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useSessionDetail } from '@/features/analysis/hooks/useSessionDetail';
import { SessionStatusBadge } from '@/features/analysis/components/SessionStatusBadge/SessionStatusBadge';
import { EventTimeline } from '@/features/analysis/components/EventTimeline/EventTimeline';
import { FeedbackForm } from '@/features/feedback/components/FeedbackForm/FeedbackForm';
import { formatDate } from '@/shared/lib/formatters';
// ✅ 1. Import Component VideoPlayer vào
import { VideoPlayer } from '@/shared/ui/atoms/VideoPlayer';

export const AnalysisDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: session, isLoading, isError } = useSessionDetail(id!);

    if (isLoading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;
    if (isError || !session) {
        navigate('/analysis'); // Lỗi 404 thì redirect về danh sách
        return null;
    }

    // Hàm mô phỏng việc bấm vào Timeline để seek video
    const handleSeekVideo = (time: number) => {
        console.log(`Command video player to seek to: ${time}s`);
        // Thực tế sẽ dùng Ref trỏ tới HTMLVideoElement hoặc Player Component
        // (Sếp có thể thêm useRef truyền vào VideoPlayer sau nếu muốn code tính năng seek)
    };

    return (
        <div className="p-6 max-w-6xl mx-auto mt-6">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Chi tiết phiên phân tích</h1>
                    <p className="text-sm text-gray-500 font-mono">ID: {session.id}</p>
                </div>
                <SessionStatusBadge status={session.status} />
            </div>

            {/* Xử lý hiển thị theo Status */}
            {session.status === 'pending' || session.status === 'processing' ? (
                <div className="text-center py-20 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-blue-800">AI đang phân tích video...</h2>
                    <p className="text-blue-600 mt-2">Vui lòng đợi. Trang sẽ tự động cập nhật kết quả.</p>
                </div>
            ) : session.status === 'failed' ? (
                <div className="p-6 bg-red-50 text-red-800 border border-red-200 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">Phân tích thất bại</h3>
                    <p>{session.failure_reason || 'Không rõ nguyên nhân lỗi từ server.'}</p>
                </div>
            ) : (
                // Layout 2 cột cho trạng thái Completed
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Cột trái: Thông tin chung & Video */}
                    <div>
                        {/* ✅ 2. THAY THẾ PLACEHOLDER BẰNG VIDEO COMPONENT THẬT */}
                        <VideoPlayer 
                            src={session.processed_video_url || session.video_url} 
                            className="aspect-video mb-4 rounded-lg bg-black" 
                        />
                        
                        <div className="bg-white p-4 rounded border shadow-sm text-sm space-y-2">
                            <p><span className="font-semibold w-24 inline-block">Ngày tạo:</span> {formatDate(session.created_at)}</p>
                            {session.started_at && <p><span className="font-semibold w-24 inline-block">Bắt đầu:</span> {formatDate(session.started_at)}</p>}
                            {session.finished_at && <p><span className="font-semibold w-24 inline-block">Kết thúc:</span> {formatDate(session.finished_at)}</p>}
                        </div>

                        {/* Form đánh giá (chỉ hiện khi đã complete) */}
                        <FeedbackForm sessionId={session.id} />
                    </div>

                    {/* Cột phải: Timeline sự kiện */}
                    <div>
                        <EventTimeline events={session.events || []} onSeek={handleSeekVideo} />
                    </div>

                </div>
            )}
        </div>
    );
};