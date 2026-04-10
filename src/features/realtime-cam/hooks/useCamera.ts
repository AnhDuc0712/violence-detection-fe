// src/features/realtime-cam/hooks/useCamera.ts
import { useState, useRef, useCallback } from 'react';
import type { CamStatus } from '../types/realtime-cam.types';

export const useCamera = () => {
    const [status, setStatus] = useState<CamStatus>('idle');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = useCallback(async (videoEl: HTMLVideoElement) => {
        setStatus('requesting');
        setErrorMsg(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720, facingMode: 'environment' },
                audio: false,
            });
            streamRef.current = stream;
            videoEl.srcObject = stream;
            await videoEl.play();
            setStatus('active');
        } catch (err: any) {
            const msg = err.name === 'NotAllowedError'
                ? 'Trình duyệt bị từ chối quyền truy cập camera. Vui lòng cấp quyền trong cài đặt trình duyệt.'
                : err.name === 'NotFoundError'
                    ? 'Không tìm thấy camera. Hãy kết nối thiết bị camera.'
                    : 'Không thể khởi động camera.';
            setErrorMsg(msg);
            setStatus('error');
        }
    }, []);

    const stopCamera = useCallback(() => {
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        setStatus('idle');
    }, []);

    return { status, setStatus, errorMsg, streamRef, startCamera, stopCamera };
};