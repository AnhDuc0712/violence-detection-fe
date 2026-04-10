// src/pages/user/ReportNewPage.tsx
import { useNavigate } from 'react-router-dom';
import { useSubmitReport } from '@/features/reports/hooks/useSubmitReport';
import { ReportForm } from '@/features/reports/components/ReportForm/ReportForm';
import { useToast } from '@/shared/ui/organisms/Toast/useToast';
import type { ReportCreate } from '@/features/reports/types/report.types';

export const ReportNewPage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const submitMutation = useSubmitReport();

    const handleSubmit = async (data: ReportCreate) => {
        try {
            const newReport = await submitMutation.mutateAsync(data);
            toast.show('Gửi yêu cầu hỗ trợ thành công!', 'success');
            navigate(`/reports/${newReport.id}`); // Luồng F.1: Điều hướng tới chi tiết
        } catch (error) {
            toast.show('Không thể gửi yêu cầu. Vui lòng kiểm tra lại dữ liệu.', 'error');
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Tạo Yêu Cầu Mới</h1>
                <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
                    Trở về
                </button>
            </div>

            <div className="bg-white p-6 border rounded-lg shadow-sm">
                <ReportForm onSubmit={handleSubmit} isLoading={submitMutation.isPending} />
            </div>
        </div>
    );
};