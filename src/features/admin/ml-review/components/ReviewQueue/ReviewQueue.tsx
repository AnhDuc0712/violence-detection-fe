// src/features/admin/ml-review/components/ReviewQueue/ReviewQueue.tsx
import { usePendingReviews } from '../../hooks/usePendingReviews';
import { useReviewEvent } from '../../hooks/useReviewEvent';
import { ReviewEventCard } from '../ReviewEventCard/ReviewEventCard';
import { useToast } from '@/shared/ui/organisms/Toast/useToast';
import type { MLReviewAction } from '../../types/ml-review.types';

export const ReviewQueue = () => {
    const { data: events, isLoading, isError } = usePendingReviews();

    // ✅ Chuyển Hook API và Toast lên Component Cha
    const reviewMutation = useReviewEvent();
    const toast = useToast();

    // Hàm xử lý chung để truyền xuống component con
    const handleAction = async (eventId: string, data: MLReviewAction) => {
        try {
            await reviewMutation.mutateAsync({ eventId, data });
            toast.show('Đã ghi nhận kết quả duyệt', 'success');
        } catch (error) {
            toast.show('Lỗi khi duyệt sự kiện. Vui lòng thử lại.', 'error');
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500 animate-pulse">Đang tải queue...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Lỗi tải dữ liệu.</div>;

    if (!events || events.length === 0) {
        return (
            <div className="py-20 text-center bg-white border border-dashed rounded-lg">
                <span className="text-4xl">🎉</span>
                <p className="mt-4 text-gray-600 font-medium">Không còn sự kiện nào chờ duyệt. Tốt lắm!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
                <ReviewEventCard
                    key={event.id}
                    event={event}
                    // ✅ Truyền hàm xử lý và state loading xuống dưới dạng Props
                    onAction={(data) => handleAction(event.id, data)}
                    isLoading={reviewMutation.isPending}
                />
            ))}
        </div>
    );
};