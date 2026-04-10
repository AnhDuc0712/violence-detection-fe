// src/features/analysis/components/SessionCard/SessionCard.tsx
import { Link } from 'react-router-dom';
import type { AnalysisSessionRead } from '../../types/analysis.types';
import { formatDate } from '@/shared/lib/formatters';
import { SessionStatusBadge } from '../SessionStatusBadge/SessionStatusBadge';

interface SessionCardProps {
    session: AnalysisSessionRead;
}

export const SessionCard = ({ session }: SessionCardProps) => {
    return (
        <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow transition flex justify-between items-center">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold font-mono text-sm">Session ID: {session.id.substring(0, 8)}...</h3>
                    <SessionStatusBadge status={session.status} />
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                    <p>Video ID: <span className="font-mono text-xs">{session.video_id}</span></p>
                    <p>Ngày tạo: {formatDate(session.created_at)}</p>
                </div>
            </div>
            <Link
                to={`/analysis/${session.id}`}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-medium"
            >
                Chi tiết
            </Link>
        </div>
    );
};