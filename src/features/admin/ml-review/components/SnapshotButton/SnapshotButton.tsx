// src/features/admin/ml-review/components/SnapshotButton/SnapshotButton.tsx
import { useCreateSnapshot } from '../../hooks/useCreateSnapshot';
import { useToast } from '@/shared/ui/organisms/Toast/useToast';
import { Button } from '@/shared/ui/atoms/Button';

export const SnapshotButton = () => {
    const snapshotMutation = useCreateSnapshot();
    const toast = useToast();

    const handleCreate = async () => {
        if (!window.confirm('Đóng gói dữ liệu đã duyệt để retrain model?')) return; //

        try {
            const res = await snapshotMutation.mutateAsync();
            toast.show(`Đã tạo snapshot thành công! Số mẫu: ${res.num_samples}`, 'success');
            // Trong thực tế có thể mở Modal chi tiết, ở đây Toast cho mượt
        } catch (error) {
            toast.show('Lỗi tạo snapshot. Vui lòng thử lại.', 'error');
        }
    };

    return (
        <Button
            variant="primary"
            onClick={handleCreate}
            isLoading={snapshotMutation.isPending}
            className="bg-indigo-600 hover:bg-indigo-700"
        >
            📦 Tạo Dataset Snapshot
        </Button>
    );
};