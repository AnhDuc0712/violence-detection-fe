// src/pages/user/RealtimeCamPage.tsx
import { useRef } from 'react';
import { useCamera } from '@/features/realtime-cam/hooks/useCamera';
import { useRealtimeAnalysis } from '@/features/realtime-cam/hooks/useRealtimeAnalysis';
import { useDetectionHistory } from '@/features/realtime-cam/hooks/useDetectionHistory';
import { CamPreview, CamControls, CamStatusBadge, DetectionEventList } from '@/features/realtime-cam';

export const RealtimeCamPage = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Gọi hooks
    const { status, setStatus, errorMsg, startCamera, stopCamera } = useCamera();
    const { alerts, addAlerts, clearHistory, highConfidenceCount } = useDetectionHistory();
    const { isAnalyzing, people, latencyMs, startAnalysis, stopAnalysis } = useRealtimeAnalysis(
        videoRef, status, setStatus,
        { intervalMs: 250, onAlerts: addAlerts }
    );
    const peopleCount = people.length;

    // Handlers truyền cho UI
    const handleStart = () => { if (videoRef.current) startCamera(videoRef.current); };
    const handleStop = () => { if (isAnalyzing) stopAnalysis(); stopCamera(); clearHistory(); };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Camera Giám Sát Realtime</h1>
                <CamStatusBadge status={status} />
            </div>

            {errorMsg && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700 text-sm shadow-sm">{errorMsg}</div>
            )}

            {status === 'disconnected' && (
                <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg text-orange-700 text-sm shadow-sm">
                    Mất kết nối tới realtime backend. Camera vẫn đang bật, bạn có thể bấm kết nối lại để tiếp tục phân tích.
                </div>
            )}

            {highConfidenceCount > 0 && (
                <div className="p-4 bg-red-100 border border-red-300 rounded-lg flex items-center justify-between shadow-sm animate-pulse">
                    <span className="text-red-700 font-bold">
                        ⚠️ Cảnh báo: Đã phát hiện {highConfidenceCount} sự kiện bạo lực có độ tin cậy cao!
                    </span>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Đối tượng đang thấy</div>
                    <div className="text-2xl font-bold text-gray-800">{peopleCount}</div>
                </div>
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Độ trễ khung gần nhất</div>
                    <div className="text-2xl font-bold text-gray-800">{latencyMs > 0 ? `${latencyMs} ms` : '--'}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <CamPreview ref={videoRef} isActive={status !== 'idle' && status !== 'error'} people={people} />
                    <CamControls
                        status={status}
                        onStart={handleStart}
                        onStop={handleStop}
                        onStartAnalysis={startAnalysis}
                        onStopAnalysis={stopAnalysis}
                    />
                </div>
                <div className="lg:col-span-1 h-[400px] lg:h-auto">
                    <DetectionEventList alerts={alerts} onClear={clearHistory} />
                </div>
            </div>
        </div>
    );
};
