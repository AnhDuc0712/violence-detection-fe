// src/features/analysis/components/EventTimeline/EventTimeline.tsx
import type { AnalysisEventRead } from '../../types/analysis.types';

interface EventTimelineProps {
    events: AnalysisEventRead[];
    onSeek: (time: number) => void;
}

export const EventTimeline = ({ events, onSeek }: EventTimelineProps) => {
    if (events.length === 0) {
        return <div className="p-4 text-center text-gray-500 bg-gray-50 rounded">Không phát hiện bạo lực trong video này.</div>;
    }

    return (
        <div className="space-y-3">
            <h3 className="font-bold border-b pb-2">Timeline Sự kiện ({events.length})</h3>
            {events.map((ev) => (
                <div key={ev.id} className="p-3 border rounded hover:bg-gray-50 flex justify-between items-center bg-white shadow-sm transition">
                    <div>
                        <div className="font-semibold text-red-600 capitalize">{ev.event_type}</div>
                        <div className="text-sm text-gray-600">
                            {ev.t_start?.toFixed(1)}s → {ev.t_end?.toFixed(1)}s
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-sm font-mono bg-red-100 text-red-800 px-2 py-1 rounded">
                            Score: {(ev.score * 100).toFixed(0)}%
                        </div>
                        {/* Click event -> seek video */}
                        <button onClick={() => ev.t_start && onSeek(ev.t_start)} className="text-blue-600 hover:underline text-sm">
                            Xem lại
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};