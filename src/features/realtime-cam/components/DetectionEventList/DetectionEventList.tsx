// src/features/realtime-cam/components/DetectionEventList/DetectionEventList.tsx
import type { DetectionEvent } from '../../types/realtime-cam.types';

export const DetectionEventList = ({ alerts, onClear }: { alerts: DetectionEvent[], onClear: () => void }) => (
    <div className="bg-white rounded-lg border shadow-sm flex flex-col h-full">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
            <h3 className="font-semibold text-gray-800">Cảnh báo realtime ({alerts.length})</h3>
            {alerts.length > 0 && (
                <button onClick={onClear} className="text-xs text-gray-500 hover:text-red-600 font-medium transition">Xóa lịch sử</button>
            )}
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 p-2">
            {alerts.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">Hệ thống đang giám sát an toàn.</div>
            ) : (
                alerts.map((alert) => (
                    <div key={alert.id} className="p-3 flex justify-between items-start hover:bg-red-50/50 rounded transition">
                        <div>
                            <span className={`text-sm font-bold capitalize ${alert.event_type === 'violent' ? 'text-red-700' : 'text-yellow-700'}`}>
                                {alert.event_type}
                            </span>
                            {alert.message && (
                                <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                {new Date(alert.timestamp).toLocaleTimeString('vi-VN')}
                            </p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${alert.score >= 0.8 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {(alert.score * 100).toFixed(0)}%
                        </span>
                    </div>
                ))
            )}
        </div>
    </div>
);
