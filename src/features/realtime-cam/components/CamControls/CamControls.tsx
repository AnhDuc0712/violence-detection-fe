// src/features/realtime-cam/components/CamControls/CamControls.tsx
import { Button } from '@/shared/ui/atoms/Button';
import type { CamStatus } from '../../types/realtime-cam.types';

interface Props {
    status: CamStatus;
    onStart: () => void;
    onStop: () => void;
    onStartAnalysis: () => void;
    onStopAnalysis: () => void;
}

export const CamControls = ({ status, onStart, onStop, onStartAnalysis, onStopAnalysis }: Props) => (
    <div className="flex gap-3 flex-wrap bg-white p-4 rounded-lg shadow-sm border">
        {status === 'idle' || status === 'error' ? (
            <Button variant="primary" onClick={onStart}>Bật Camera</Button>
        ) : (
            <Button variant="secondary" onClick={onStop}>Tắt Camera</Button>
        )}

        {(status === 'active' || status === 'disconnected') && (
            <Button
                variant={status === 'disconnected' ? 'secondary' : 'danger'}
                onClick={onStartAnalysis}
                className={status === 'active' ? 'animate-pulse' : ''}
            >
                {status === 'disconnected' ? 'Kết nối lại phân tích' : 'Bắt đầu phân tích'}
            </Button>
        )}

        {status === 'analyzing' && (
            <Button variant="secondary" onClick={onStopAnalysis} className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
                Dừng phân tích
            </Button>
        )}
    </div>
);
