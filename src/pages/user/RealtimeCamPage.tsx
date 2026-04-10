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
    const { events, addEvents, clearHistory, highConfidenceCount } = useDetectionHistory();
    const { isAnalyzing, startAnalysis, stopAnalysis } = useRealtimeAnalysis(
        videoRef, status, setStatus,
        { intervalMs: 2000, onDetection: addEvents }
    );

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

            {highConfidenceCount > 0 && (
                <div className="p-4 bg-red-100 border border-red-300 rounded-lg flex items-center justify-between shadow-sm animate-pulse">
                    <span className="text-red-700 font-bold">
                        ⚠️ Cảnh báo: Đã phát hiện {highConfidenceCount} sự kiện bạo lực có độ tin cậy cao!
                    </span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <CamPreview ref={videoRef} isActive={status !== 'idle' && status !== 'error'} />
                    <CamControls
                        status={status}
                        onStart={handleStart}
                        onStop={handleStop}
                        onStartAnalysis={startAnalysis}
                        onStopAnalysis={stopAnalysis}
                    />
                </div>
                <div className="lg:col-span-1 h-[400px] lg:h-auto">
                    <DetectionEventList events={events} onClear={clearHistory} />
                </div>
            </div>
        </div>
    );
};