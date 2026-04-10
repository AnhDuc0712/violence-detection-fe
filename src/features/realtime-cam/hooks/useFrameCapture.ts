// src/features/realtime-cam/hooks/useFrameCapture.ts
import { useRef, useCallback } from 'react';

export const useFrameCapture = (options: { quality?: number; scale?: number } = {}) => {
    const { quality = 0.7, scale = 0.5 } = options;
    const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

    const captureFrame = useCallback((videoEl: HTMLVideoElement): string | null => {
        if (videoEl.readyState < 2) return null;

        const canvas = canvasRef.current;
        canvas.width = videoEl.videoWidth * scale;
        canvas.height = videoEl.videoHeight * scale;

        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', quality).split(',')[1]; // Chỉ lấy data base64
    }, [quality, scale]);

    return { captureFrame };
};