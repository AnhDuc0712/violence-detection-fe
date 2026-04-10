// src/features/realtime-cam/components/CamPreview/CamPreview.tsx
import { forwardRef } from 'react';

export const CamPreview = forwardRef<HTMLVideoElement, { isActive: boolean }>(
    ({ isActive }, ref) => (
        <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-inner">
            <video
                ref={ref}
                muted
                playsInline
                className={`w-full h-full object-cover transition-opacity duration-300 -scale-x-100 ${isActive ? 'opacity-100' : 'opacity-0'}`}
            />
            {!isActive && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-medium">
                    Camera đang tắt
                </div>
            )}
        </div>
    )
);