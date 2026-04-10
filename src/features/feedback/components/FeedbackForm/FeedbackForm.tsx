// src/features/feedback/components/FeedbackForm/FeedbackForm.tsx
import { useState } from 'react';
import { useSubmitFeedback } from '../../hooks/useSubmitFeedback';

interface FeedbackFormProps {
    sessionId: string;
}

export const FeedbackForm = ({ sessionId }: FeedbackFormProps) => {
    const mutation = useSubmitFeedback();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [feedbackType, setFeedbackType] = useState<'false_positive' | 'false_negative' | 'excellent'>('excellent');
    const [rating, setRating] = useState<number>(5);
    const [comment, setComment] = useState('');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        try {
            await mutation.mutateAsync({ session_id: sessionId, feedback_type: feedbackType, rating, comment });
            setIsSubmitted(true); // Ẩn form, hiện trạng thái đã đánh giá
        } catch (error: any) {
            setErrorMsg(error.response?.data?.detail || 'Lỗi gửi đánh giá');
        }
    };

    if (isSubmitted) {
        return <div className="p-4 bg-green-50 text-green-700 rounded border border-green-200">Đã gửi đánh giá ✓ Cảm ơn bạn!</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow-sm mt-6">
            <h3 className="font-bold text-lg mb-4">Đánh giá kết quả AI</h3>
            {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Loại phản hồi</label>
                    <select value={feedbackType} onChange={(e: any) => setFeedbackType(e.target.value)} className="w-full border p-2 rounded">
                        <option value="excellent">Chính xác tuyệt đối</option>
                        <option value="false_positive">Báo động giả (Bình thường nhưng báo bạo lực)</option>
                        <option value="false_negative">Bỏ sót (Có bạo lực nhưng không báo)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Điểm (1-5)</label>
                    <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full border p-2 rounded" />
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Bình luận thêm</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full border p-2 rounded" rows={3}></textarea>
            </div>

            <button type="submit" disabled={mutation.isPending} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                {mutation.isPending ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
        </form>
    );
};