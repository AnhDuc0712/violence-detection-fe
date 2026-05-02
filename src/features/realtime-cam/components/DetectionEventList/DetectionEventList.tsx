// src/features/realtime-cam/components/DetectionEventList/DetectionEventList.tsx
import type { DetectionEvent } from '../../types/realtime-cam.types';

const stateStyles: Record<string, string> = {
    DETECTED: 'bg-amber-100 text-amber-800',
    ACTIVE: 'bg-red-100 text-red-700',
    RESOLVED: 'bg-slate-100 text-slate-600',
};

export const DetectionEventList = ({ alerts, onClear }: { alerts: DetectionEvent[], onClear: () => void }) => (
    <div className="bg-white rounded-lg border shadow-sm flex flex-col h-full">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
            <h3 className="font-semibold text-gray-800">Canh bao realtime ({alerts.length})</h3>
            {alerts.length > 0 && (
                <button onClick={onClear} className="text-xs text-gray-500 hover:text-red-600 font-medium transition">Xoa lich su</button>
            )}
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 p-2">
            {alerts.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">He thong dang giam sat an toan.</div>
            ) : (
                alerts.map((alert) => (
                    <div key={alert.id} className="p-3 flex justify-between items-start hover:bg-red-50/50 rounded transition gap-3">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stateStyles[alert.alert_state ?? 'DETECTED'] ?? stateStyles.DETECTED}`}>
                                    {alert.alert_state ?? 'DETECTED'}
                                </span>
                                <span className={`text-sm font-bold capitalize ${alert.event_type === 'violent' ? 'text-red-700' : 'text-yellow-700'}`}>
                                    {alert.semantic_message ?? alert.message ?? alert.event_type}
                                </span>
                            </div>
                            {alert.message && alert.semantic_message !== alert.message && (
                                <p className="text-xs text-gray-500 mt-1">{alert.message}</p>
                            )}
                            {alert.interaction_pair && alert.interaction_pair.length > 0 && (
                                <p className="text-xs text-gray-600 mt-1">
                                    Pair: {alert.interaction_pair.join(' ↔ ')}
                                </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                {new Date(alert.timestamp).toLocaleTimeString('vi-VN')}
                            </p>
                        </div>
                        <div className="text-right shrink-0">
                            <div className={`text-xs font-bold px-2 py-1 rounded-full ${alert.score >= 0.8 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {((alert.semantic_confidence ?? alert.score) * 100).toFixed(0)}%
                            </div>
                            <div className="text-[11px] text-gray-500 mt-1">
                                Severity {(alert.score * 100).toFixed(0)}%
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
);
