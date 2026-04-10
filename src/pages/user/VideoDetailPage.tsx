// src/pages/user/VideoDetailPage.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVideoDetail } from '@/features/videos/hooks/useVideoDetail';
import { useDeleteVideo } from '@/features/videos/hooks/useDeleteVideo';
import { useStartAnalysis } from '@/features/analysis/hooks/useStartAnalysis';
import { StartAnalysisModal } from '@/features/analysis/components/StartAnalysisModal/StartAnalysisModal';
import { formatFileSize, formatDate } from '@/shared/lib/formatters';
import { useToast } from '@/shared/ui/organisms/Toast/useToast'; 
// ✅ IMPORT CÁI VIDEO PLAYER VÀO ĐÂY
import { VideoPlayer } from '@/shared/ui/atoms/VideoPlayer'; 

export const VideoDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useToast();

    const { data: video, isLoading, isError } = useVideoDetail(id!);
    const deleteMutation = useDeleteVideo();
    const startAnalysisMutation = useStartAnalysis();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa video này?')) return;
        try {
            await deleteMutation.mutateAsync(id!);
            toast.show('Đã xóa video thành công', 'success');
            navigate('/videos');
        } catch (error) {
            toast.show('Không thể xóa video. Vui lòng thử lại.', 'error');
        }
    };

    const handleStartAnalysis = async (pipeline_spec: any) => {
        try {
            const session = await startAnalysisMutation.mutateAsync({
                video_id: id!,
                model_version: pipeline_spec.model_version,
                threshold: pipeline_spec.threshold,
            });
            setIsModalOpen(false);
            toast.show('Khởi tạo phân tích thành công!', 'success');
            navigate(`/analysis/${session.id}`);
        } catch (error) {
            toast.show('Lỗi khởi tạo phân tích. Video có thể không hợp lệ.', 'error');
        }
    };

    if (isLoading) return <div className="p-8 text-center">Đang tải thông tin video...</div>;
    if (isError || !video) {
        navigate('/videos');
        return null;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto mt-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold truncate pr-4">{video.original_filename || 'Video không tên'}</h1>
                <div className="flex gap-2 shrink-0">
                    <button
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 disabled:opacity-50"
                    >
                        {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa Video'}
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        🚀 Bắt đầu phân tích
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold text-lg border-b pb-2 mb-4">Thông tin Metadata</h3>
                    <ul className="space-y-3 text-sm">
                        <li><span className="text-gray-500 w-32 inline-block">Ngày tải lên:</span> {formatDate(video.created_at)}</li>
                        <li><span className="text-gray-500 w-32 inline-block">Dung lượng:</span> {formatFileSize(video.size_bytes)}</li>
                        <li><span className="text-gray-500 w-32 inline-block">Thời lượng:</span> {video.duration_sec ? `${video.duration_sec} giây` : 'N/A'}</li>
                        <li><span className="text-gray-500 w-32 inline-block">Định dạng:</span> {video.mime_type || 'N/A'}</li>
                        <li>
                            <span className="text-gray-500 w-32 inline-block">Mã Video (ID):</span>
                            <span className="font-mono text-xs">{video.id}</span>
                        </li>
                    </ul>
                </div>

                {/* ✅ THAY BẰNG COMPONENT THẬT, NHẬN TRỰC TIẾP URL TỪ BACKEND */}
                <div>
                     <VideoPlayer 
                        src={video.video_url} 
                        className="h-full min-h-[16rem] object-contain bg-black rounded" 
                    />
                </div>
            </div>

            {/* Tích hợp component StartAnalysisModal */}
            <StartAnalysisModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleStartAnalysis}
                isLoading={startAnalysisMutation.isPending}
            />
        </div>
    );
};