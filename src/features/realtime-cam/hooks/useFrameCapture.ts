// src/features/realtime-cam/hooks/useFrameCapture.ts
import { useRef, useCallback } from 'react';

export const useFrameCapture = (options: { quality?: number; scale?: number } = {}) => {
    const { quality = 0.6, scale = 0.5 } = options;
    const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

    const captureFrame = useCallback((videoEl: HTMLVideoElement): string | null => {
        if (videoEl.readyState < 2) return null;

        const canvas = canvasRef.current;

        const w = videoEl.videoWidth;
        const h = videoEl.videoHeight;

        canvas.width = Math.min(w * scale, 640);
        canvas.height = Math.min(h * scale, 480);

        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

        // ✅ trả full DataURL cho BE decode chuẩn
        return canvas.toDataURL('image/jpeg', quality);
    }, [quality, scale]);

    return { captureFrame };
};