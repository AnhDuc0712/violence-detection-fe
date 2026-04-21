import type { RealtimePerson } from '../../features/realtime-cam/types/realtime-cam.types';

// COCO skeleton
const skeleton: Array<[number, number]> = [
    [5, 7], [7, 9], [6, 8], [8, 10], [5, 6],
    [5, 11], [6, 12], [11, 12],
    [11, 13], [13, 15], [12, 14], [14, 16],
];

interface DrawConfig {
    scale: number;
    offsetX: number;
    offsetY: number;
    videoWidth: number;
    videoHeight: number;
    drawWidth: number;
    drawHeight: number;
}

const MIN_CONF = 0.5;

// 🔥 convert normalized → canvas (đã fix crop + scale)
function mapPoint(
    x: number,
    y: number,
    config: DrawConfig
) {
    const {
        scale,
        offsetX,
        offsetY,
        videoWidth,
        videoHeight,
        drawWidth,
        drawHeight
    } = config || {};

    const cropX = (videoWidth - drawWidth) / 2;
    const cropY = (videoHeight - drawHeight) / 2;

    const px = ((x * videoWidth) - cropX) * scale + offsetX;
    const py = ((y * videoHeight) - cropY) * scale + offsetY;

    return [px, py];
}

// ===== KEYPOINTS =====
export function drawKeypoints(
    ctx: CanvasRenderingContext2D,
    people: RealtimePerson[],
    config: DrawConfig
) {
    ctx.save();
    ctx.fillStyle = 'lime';

    people.forEach(person => {
        person.keypoints.forEach(([x, y, c]) => {
            if (c < MIN_CONF) return;

            const [px, py] = mapPoint(x, y, config);

            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    });

    ctx.restore();
}


export function drawSkeleton(
    ctx: CanvasRenderingContext2D,
    people: RealtimePerson[]
) {
    ctx.strokeStyle = 'cyan';
    ctx.lineWidth = 2;

    people.forEach(person => {
        skeleton.forEach(([i, j]) => {
            const p1 = person.keypoints[i];
            const p2 = person.keypoints[j];

            if (!p1 || !p2) return;
            if (p1[2] < 0.5 || p2[2] < 0.5) return;

            ctx.beginPath();
            ctx.moveTo(p1[0], p1[1]);
            ctx.lineTo(p2[0], p2[1]);
            ctx.stroke();
        });
    });
}