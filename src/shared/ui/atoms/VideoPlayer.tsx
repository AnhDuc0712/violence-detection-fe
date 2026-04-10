// src/shared/ui/atoms/VideoPlayer.tsx
import React, { useRef, useEffect } from 'react';

interface VideoPlayerProps {
    src?: string | null;
    className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, className = '' }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Vẫn giữ useEffect để đảm bảo load lại nếu DOM không bị đập đi
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, [src]);

    // Giao diện dự phòng (Fallback) khi chưa có link video
    if (!src) {
        return (
            <div className={`bg-gray-100 flex items-center justify-center text-gray-400 border border-dashed rounded-lg ${className}`}>
                <span className="text-sm">Đang chờ URL video...</span>
            </div>
        );
    }

    // 🚀 TRÌNH PHÁT VIDEO ĐÃ ĐƯỢC ÉP RE-RENDER THEO TUYỆT KỸ CỦA SẾP
    return (
        <video
            ref={videoRef}
            key={src} // ✅ VŨ KHÍ BÍ MẬT 1: Ép React đập đi xây lại khi src thay đổi
            controls
            className={`w-full h-auto bg-black rounded-lg shadow-sm ${className}`}
            controlsList="nodownload" 
        >
            {/* ✅ VŨ KHÍ BÍ MẬT 2: Dùng thẻ source bên trong thay vì gắn thẳng vào src của video */}
            <source src={src} type="video/mp4" />
            
            Trình duyệt của bạn không hỗ trợ thẻ video.
        </video>
    );
};