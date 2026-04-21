import { forwardRef, useCallback, useEffect, useRef, type RefObject } from 'react';
import type { RealtimePerson } from '../../types/realtime-cam.types';
import { drawKeypoints, drawSkeleton } from '@/shared/lib/drawSkeleton';

export const CamPreview = forwardRef<HTMLVideoElement, { isActive: boolean; people: RealtimePerson[] }>(
    ({ isActive, people }, ref) => {
        const canvasRef = useRef<HTMLCanvasElement | null>(null);

        const getVideoElement = useCallback(() => {
            if (!ref || typeof ref === 'function') {
                return null;
            }
            return (ref as RefObject<HTMLVideoElement>).current;
        }, [ref]);

        // 🔥 VÒNG LẶP RENDER HOÀN THIỆN TÍNH TOÁN CẢ SCALE, OFFSET & MIRROR
        useEffect(() => {
            let animationId: number;

            const render = () => {
    const canvasEl = canvasRef.current;
    const videoEl = getVideoElement();

    if (!canvasEl || !videoEl || !videoEl.videoWidth) {
        animationId = requestAnimationFrame(render);
        return;
    }

    const rect = videoEl.getBoundingClientRect();
    canvasEl.width = rect.width;
    canvasEl.height = rect.height;

    const ctx = canvasEl.getContext('2d');
    if (!ctx) {
        animationId = requestAnimationFrame(render);
        return;
    }

    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    if (isActive && people.length > 0) {
        const videoWidth = videoEl.videoWidth;
        const videoHeight = videoEl.videoHeight;

        const canvasWidth = canvasEl.width;
        const canvasHeight = canvasEl.height;

        const videoRatio = videoWidth / videoHeight;
        const canvasRatio = canvasWidth / canvasHeight;

        let scale = 1;
        let offsetX = 0;
        let offsetY = 0;
        let drawWidth = videoWidth;
        let drawHeight = videoHeight;

        if (videoRatio > canvasRatio) {
            drawHeight = videoHeight;
            drawWidth = videoHeight * canvasRatio;

            scale = canvasHeight / videoHeight;
            offsetX = (canvasWidth - drawWidth * scale) / 2;
        } else {
            drawWidth = videoWidth;
            drawHeight = videoWidth / canvasRatio;

            scale = canvasWidth / videoWidth;
            offsetY = (canvasHeight - drawHeight * scale) / 2;
        }

        const config = {
            scale,
            offsetX,
            offsetY,
            videoWidth,
            videoHeight,
            drawWidth,
            drawHeight
        };

        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-canvasWidth, 0);

        drawSkeleton(ctx, people);
        drawKeypoints(ctx, people, config);

        ctx.restore();
    }

    animationId = requestAnimationFrame(render); // ✅ phải ở đây
};

        render();
        return () => cancelAnimationFrame(animationId);

    }, [isActive, people, getVideoElement]);

    return (
        <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <video
                ref={ref}
                muted
                playsInline
                className={`w-full h-full object-cover -scale-x-100 ${isActive ? 'opacity-100' : 'opacity-0'}`}
            />
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ display: isActive ? 'block' : 'none' }}
            />
        </div>
    );
});