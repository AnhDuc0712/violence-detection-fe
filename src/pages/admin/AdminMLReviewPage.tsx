// src/pages/admin/AdminMLReviewPage.tsx
import { ReviewQueue, SnapshotButton } from '@/features/admin/ml-review';

export const AdminMLReviewPage = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Queue Duyệt Nhãn (ML Review)</h1>
                    <p className="text-sm text-gray-500 mt-1">Duyệt kết quả của AI để làm sạch dữ liệu trước khi train model.</p>
                </div>

                {/* Nút Snapshot đặt ở Header theo chuẩn */}
                <SnapshotButton />
            </div>

            <ReviewQueue />
        </div>
    );
};