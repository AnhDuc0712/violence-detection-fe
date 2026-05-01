import { forwardRef, useCallback, useEffect, useRef, type MutableRefObject, type RefObject } from 'react';
import type { RealtimePerson } from '../../types/realtime-cam.types';
import { drawKeypoints, drawSkeleton, mapCanvasPoint, type OverlayConfig } from '@/shared/lib/drawSkeleton';

type CamPreviewProps = {
    isActive: boolean;
    peopleRef: MutableRefObject<RealtimePerson[]>;
};

const drawBoundingBoxes = (
    ctx: CanvasRenderingContext2D,
    people: RealtimePerson[],
    config: OverlayConfig,
) => {
    for (const person of people) {
        const [x1, y1] = mapCanvasPoint(person.bbox[0], person.bbox[1], config);
        const [x2, y2] = mapCanvasPoint(person.bbox[2], person.bbox[3], config);
        const left = Math.min(x1, x2);
        const top = Math.min(y1, y2);
        const width = Math.abs(x2 - x1);
        const height = Math.abs(y2 - y1);

        const stroke = person.violence_state ? '#ef4444' : '#22c55e';
        const fill = person.violence_state ? 'rgba(239,68,68,0.16)' : 'rgba(34,197,94,0.12)';

        ctx.save();
        ctx.strokeStyle = stroke;
        ctx.fillStyle = fill;
        ctx.lineWidth = person.violence_state ? 3 : 2;
        ctx.fillRect(left, top, width, height);
        ctx.strokeRect(left, top, width, height);

        // Task #10: Improved overlay debug info
        const lines = [
            `Track #${person.track_id}`,
            person.identity || 'Unknown',
            `Violence: ${person.violence_prob.toFixed(2)}${person.violence_state ? ' ALERT' : ''}`,
            // Debug info: show interaction score if multi-person
            ...(person.interaction_score > 0.1 ? [`Interaction: ${person.interaction_score.toFixed(2)}`] : []),
            // Debug info: show identity lock state
            ...(person.identity_locked ? [`[LOCKED]`] : []),
            // Debug info: show identity votes
            ...(person.identity_votes_count > 0 ? [`Votes: ${person.identity_votes_count}/5`] : []),
        ];

        ctx.font = '12px monospace';
        const textWidth = Math.max(...lines.map((line) => ctx.measureText(line).width));
        const labelHeight = 18 * lines.length + 6;
        const labelTop = Math.max(0, top - labelHeight - 4);

        ctx.fillStyle = 'rgba(15,23,42,0.88)';
        ctx.fillRect(left, labelTop, textWidth + 12, labelHeight);
        ctx.fillStyle = '#f8fafc';
        lines.forEach((line, index) => {
            ctx.fillText(line, left + 6, labelTop + 16 + (index * 16));
        });
        ctx.restore();
    }
};

export const CamPreview = forwardRef<HTMLVideoElement, CamPreviewProps>(
    ({ isActive, peopleRef }, ref) => {
        const canvasRef = useRef<HTMLCanvasElement | null>(null);

        const getVideoElement = useCallback(() => {
            if (!ref || typeof ref === 'function') {
                return null;
            }
            return (ref as RefObject<HTMLVideoElement>).current;
        }, [ref]);

        useEffect(() => {
            let animationId = 0;

            const render = () => {
                const canvasEl = canvasRef.current;
                const videoEl = getVideoElement();

                if (!canvasEl || !videoEl || !videoEl.videoWidth) {
                    animationId = requestAnimationFrame(render);
                    return;
                }

                const rect = videoEl.getBoundingClientRect();
                const nextWidth = Math.max(1, Math.round(rect.width));
                const nextHeight = Math.max(1, Math.round(rect.height));

                if (canvasEl.width !== nextWidth || canvasEl.height !== nextHeight) {
                    canvasEl.width = nextWidth;
                    canvasEl.height = nextHeight;
                }

                const ctx = canvasEl.getContext('2d');
                if (!ctx) {
                    animationId = requestAnimationFrame(render);
                    return;
                }

                ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

                if (!isActive) {
                    animationId = requestAnimationFrame(render);
                    return;
                }

                const videoWidth = videoEl.videoWidth;
                const videoHeight = videoEl.videoHeight;
                const canvasWidth = canvasEl.width;
                const canvasHeight = canvasEl.height;
                const scale = Math.max(canvasWidth / videoWidth, canvasHeight / videoHeight);
                const renderedWidth = videoWidth * scale;
                const renderedHeight = videoHeight * scale;
                const cropX = Math.max(0, (renderedWidth - canvasWidth) / (2 * scale));
                const cropY = Math.max(0, (renderedHeight - canvasHeight) / (2 * scale));

                const config: OverlayConfig = {
                    scale,
                    offsetX: 0,
                    offsetY: 0,
                    mirrorX: true,
                    canvasWidth: canvasWidth,
                    sourceCropX: cropX,
                    sourceCropY: cropY,
                };

                const people = peopleRef.current;
                if (people.length > 0) {
                    drawBoundingBoxes(ctx, people, config);
                    drawSkeleton(ctx, people, config);
                    drawKeypoints(ctx, people, config);
                }

                animationId = requestAnimationFrame(render);
            };

            render();
            return () => cancelAnimationFrame(animationId);
        }, [getVideoElement, isActive, peopleRef]);

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
    },
);
