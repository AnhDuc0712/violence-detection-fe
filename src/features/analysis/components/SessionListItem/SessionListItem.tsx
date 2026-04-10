import { Link } from 'react-router-dom';
import { formatDate } from '@/shared/lib/formatters';
import { SessionStatusBadge } from '../SessionStatusBadge'; // ✅ Tái sử dụng Component đã có!
import type { AnalysisSessionRead } from '../../types/analysis.types';

export const SessionListItem = ({ session }: { session: AnalysisSessionRead }) => {
    return (
        <Link to={`/analysis/${session.id}`} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition">
            <div>
                <p className="font-mono text-sm text-gray-600">ID: {session.id.substring(0, 8)}...</p>
                <p className="text-xs text-gray-500 mt-0.5">{formatDate(session.created_at)}</p>
            </div>
            <div>
                <SessionStatusBadge status={session.status} />
            </div>
        </Link>
    );
};