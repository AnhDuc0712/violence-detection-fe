// src/pages/user/AnalysisPage.tsx
import { useSessions } from '@/features/analysis/hooks/useSessions';
import { SessionCard } from '@/features/analysis/components/SessionCard/SessionCard';

export const AnalysisPage = () => {
    const { data: sessions, isLoading, isError } = useSessions();

    if (isLoading) return <div className="p-8 text-center">Đang tải danh sách phiên phân tích...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Lỗi tải dữ liệu.</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Lịch Sử Phân Tích</h1>

            {!sessions || sessions.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded border border-dashed text-gray-500">
                    Chưa có phiên phân tích nào.
                </div>
            ) : (
                <div className="grid gap-4">
                    {sessions.map(session => (
                        <SessionCard key={session.id} session={session} />
                    ))}
                </div>
            )}
        </div>
    );
};