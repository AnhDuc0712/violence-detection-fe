// src/features/admin/ml-review/components/OverrideModal/OverrideModal.tsx
import { useState } from 'react';
import { Button } from '@/shared/ui/atoms/Button';
import type { MLReviewAction } from '../../types/ml-review.types';

interface OverrideModalProps {
    onClose: () => void;
    onSubmit: (data: MLReviewAction) => void;
    isLoading: boolean;
}

export const OverrideModal = ({ onClose, onSubmit, isLoading }: OverrideModalProps) => {
    const [labelOverride, setLabelOverride] = useState('');
    const [note, setNote] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Cảnh vệ bắt buộc
        if (!labelOverride.trim()) return;

        onSubmit({
            decision: 'overridden',
            label_override: labelOverride.trim(),
            note: note.trim() || undefined,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h2 className="text-xl font-bold mb-4">Override Nhãn Sự Kiện</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nhãn mới (Bắt buộc) <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            value={labelOverride}
                            onChange={(e) => setLabelOverride(e.target.value)}
                            placeholder="Nhập nhãn chính xác..."
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Ghi chú (Tùy chọn)</label>
                        <input
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Lý do override..."
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div className="flex gap-3 justify-end mt-6">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
                            Hủy
                        </Button>
                        <Button type="submit" variant="primary" isLoading={isLoading} disabled={!labelOverride.trim()}>
                            Xác nhận Override
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};