// src/features/admin/ml-review/components/ReviewEventCard/ReviewEventCard.tsx
import { useState } from 'react';
import { OverrideModal } from '../OverrideModal/OverrideModal';
import { Button } from '@/shared/ui/atoms/Button';
import type { AnalysisEventAdmin, MLReviewAction } from '../../types/ml-review.types';

interface ReviewEventCardProps {
    event: AnalysisEventAdmin;
    onAction: (data: MLReviewAction) => void; // Khai báo Props mới
    isLoading: boolean;                       // Khai báo Props mới
}

export const ReviewEventCard = ({ event, onAction, isLoading }: ReviewEventCardProps) => {
    const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);

    // Bọc lại hàm onAction để đóng Modal nếu Modal đang mở
    const handleActionClick = (data: MLReviewAction) => {
        onAction(data);
        if (data.decision === 'overridden') {
            setIsOverrideModalOpen(false);
        }
    };

    return (
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm flex flex-col">
            <div className="aspect-video bg-gray-900 flex items-center justify-center text-gray-500">
                <span className="text-sm">Video Clip: {event.t_start}s → {event.t_end}s</span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-lg text-gray-800 capitalize">{event.event_type}</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${event.score > 0.8 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            Score: {(event.score * 100).toFixed(1)}%
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono">Session: {event.session_id.substring(0, 8)}...</p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    {/* ✅ Dùng trực tiếp props isLoading và onAction */}
                    <Button
                        variant="secondary"
                        className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200 text-xs py-1.5 px-1"
                        onClick={() => handleActionClick({ decision: 'approved' })}
                        isLoading={isLoading}
                    >
                        ✅ Approve
                    </Button>
                    <Button
                        variant="secondary"
                        className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200 text-xs py-1.5 px-1"
                        onClick={() => handleActionClick({ decision: 'rejected' })}
                        isLoading={isLoading}
                    >
                        ❌ Reject
                    </Button>
                    <Button
                        variant="secondary"
                        className="bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200 text-xs py-1.5 px-1"
                        onClick={() => setIsOverrideModalOpen(true)}
                        disabled={isLoading}
                    >
                        ✏️ Override
                    </Button>
                </div>
            </div>

            {isOverrideModalOpen && (
                <OverrideModal
                    onClose={() => setIsOverrideModalOpen(false)}
                    onSubmit={handleActionClick}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};