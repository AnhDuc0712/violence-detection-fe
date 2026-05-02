import { useState, useRef } from 'react';
import { useCamera } from '@/features/realtime-cam/hooks/useCamera';
import { useRealtimeAnalysis } from '@/features/realtime-cam/hooks/useRealtimeAnalysis';
import { useDetectionHistory } from '@/features/realtime-cam/hooks/useDetectionHistory';
import { CamPreview, CamControls, CamStatusBadge, DetectionEventList } from '@/features/realtime-cam';

export const RealtimeCamPage = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [debugMode] = useState(() => new URLSearchParams(window.location.search).get('debug') === 'true');

    const { status, setStatus, errorMsg, startCamera, stopCamera } = useCamera();
    const { alerts, addAlerts, clearHistory, highConfidenceCount } = useDetectionHistory();
    const {
        isAnalyzing,
        peopleRef,
        peopleCount,
        latencyMs,
        effectiveFps,
        isConnected,
        sessionId,
        sessionMetrics,
        wsActiveCount,
        startAnalysis,
        stopAnalysis,
    } = useRealtimeAnalysis(
        videoRef,
        status,
        setStatus,
        { intervalMs: 250, onAlerts: addAlerts },
    );

    const handleStart = () => {
        if (videoRef.current) {
            startCamera(videoRef.current);
        }
    };

    const handleStop = () => {
        if (isAnalyzing) {
            stopAnalysis();
        }
        stopCamera();
        clearHistory();
    };

    const queueHealth = (sessionMetrics?.dropped_frames_10s ?? 0) > 5
        ? 'Frame Drops Detected'
        : 'Realtime Stable';

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Camera Giam Sat Realtime</h1>
                <CamStatusBadge status={status} />
            </div>

            {errorMsg && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700 text-sm shadow-sm">
                    {errorMsg}
                </div>
            )}

            {status === 'disconnected' && (
                <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg text-orange-700 text-sm shadow-sm">
                    Mat ket noi toi realtime backend. Camera van dang bat, ban co the bam ket noi lai de tiep tuc phan tich.
                </div>
            )}

            {highConfidenceCount > 0 && (
                <div className="p-4 bg-red-100 border border-red-300 rounded-lg flex items-center justify-between shadow-sm animate-pulse">
                    <span className="text-red-700 font-bold">
                        Canh bao: Da phat hien {highConfidenceCount} su kien bao luc co do tin cay cao.
                    </span>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Realtime FPS</div>
                    <div className="text-2xl font-bold text-gray-800">{effectiveFps > 0 ? effectiveFps.toFixed(1) : '--'}</div>
                </div>
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Do tre khung gan nhat</div>
                    <div className="text-2xl font-bold text-gray-800">{latencyMs > 0 ? `${latencyMs} ms` : '--'}</div>
                </div>
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">WebSocket</div>
                    <div className={`text-2xl font-bold ${isConnected ? 'text-green-600' : 'text-orange-600'}`}>
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </div>
                </div>
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Active Tracks</div>
                    <div className="text-2xl font-bold text-gray-800">{sessionMetrics?.track_count ?? peopleCount}</div>
                </div>
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Queue Health</div>
                    <div className={`text-sm font-bold ${queueHealth === 'Realtime Stable' ? 'text-green-600' : 'text-red-600'}`}>
                        {queueHealth}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Dropped Frames</div>
                    <div className="text-xl font-bold text-gray-800">{sessionMetrics?.frames_dropped ?? 0}</div>
                    <div className="text-xs text-gray-500 mt-1">10s: {sessionMetrics?.dropped_frames_10s ?? 0}</div>
                </div>
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Frame Queue</div>
                    <div className="text-xl font-bold text-gray-800">{sessionMetrics?.queue_depth ?? 0}</div>
                </div>
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Result Queue</div>
                    <div className="text-xl font-bold text-gray-800">{sessionMetrics?.result_queue_depth ?? 0}</div>
                </div>
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Alert Count</div>
                    <div className="text-xl font-bold text-gray-800">{sessionMetrics?.alert_count ?? alerts.length}</div>
                </div>
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Session Status</div>
                    <div className="text-sm font-mono text-gray-800 break-all">{sessionId ?? '--'}</div>
                    <div className="text-xs text-gray-500 mt-1">WS {wsActiveCount}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <CamPreview
                        ref={videoRef}
                        isActive={status !== 'idle' && status !== 'error'}
                        peopleRef={peopleRef}
                        debugMode={debugMode}
                    />
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
