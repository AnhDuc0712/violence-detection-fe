// src/features/admin/dashboard/components/StatCard/StatCard.tsx

interface StatCardProps {
    title: string;
    value: number | string;
    icon: string;
    colorClass: string;
    onClick?: () => void;
}

export const StatCard = ({ title, value, icon, colorClass, onClick }: StatCardProps) => {
    return (
        <div
            onClick={onClick}
            className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${colorClass} flex items-center justify-between ${onClick ? 'cursor-pointer hover:shadow-md hover:bg-gray-50 transition' : ''}`}
        >
            <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
            </div>
            <div className="text-4xl opacity-80">{icon}</div>
        </div>
    );
};