import type { RealtimePerson } from '../../features/realtime-cam/types/realtime-cam.types';

const SKELETON: Array<[number, number]> = [
    [0, 5], [0, 6],
    [5, 6],
    [5, 7], [7, 9],
    [6, 8], [8, 10],
    [5, 11], [6, 12],
    [11, 12],
    [11, 13], [13, 15],
    [12, 14], [14, 16],
];

const MIN_CONF = 0.35;

export interface OverlayConfig {
    scale: number;
    offsetX: number;
    offsetY: number;
    mirrorX: boolean;
    canvasWidth: number;
    sourceCropX: number;
    sourceCropY: number;
}

export const mapCanvasPoint = (
    x: number,
    y: number,
    config: OverlayConfig,
): [number, number] => {
    const mappedX = ((x - config.sourceCropX) * config.scale) + config.offsetX;
    const mappedY = ((y - config.sourceCropY) * config.scale) + config.offsetY;
    if (!config.mirrorX) {
        return [mappedX, mappedY];
    }
    return [config.canvasWidth - mappedX, mappedY];
};

export const drawKeypoints = (
    ctx: CanvasRenderingContext2D,
    people: RealtimePerson[],
    config: OverlayConfig,
) => {
    ctx.save();

    for (const person of people) {
        ctx.fillStyle = person.violence_state ? '#ef4444' : '#22c55e';

        for (const [x, y, conf] of person.keypoints) {
            if (conf < MIN_CONF) {
                continue;
            }

            const [px, py] = mapCanvasPoint(x, y, config);
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.restore();
};

export const drawSkeleton = (
    ctx: CanvasRenderingContext2D,
    people: RealtimePerson[],
    config: OverlayConfig,
) => {
    ctx.save();

    for (const person of people) {
        ctx.strokeStyle = person.violence_state ? 'rgba(239,68,68,0.85)' : 'rgba(34,197,94,0.75)';
        ctx.lineWidth = person.violence_state ? 2.5 : 1.5;

        for (const [start, end] of SKELETON) {
            const p1 = person.keypoints[start];
            const p2 = person.keypoints[end];

            if (!p1 || !p2 || p1[2] < MIN_CONF || p2[2] < MIN_CONF) {
                continue;
            }

            const [x1, y1] = mapCanvasPoint(p1[0], p1[1], config);
            const [x2, y2] = mapCanvasPoint(p2[0], p2[1], config);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }

    ctx.restore();
};
