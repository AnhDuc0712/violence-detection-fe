// src/pages/user/VideoUploadPage.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUploadVideo } from '@/features/videos/hooks/useUploadVideo';
import { formatFileSize } from '@/shared/lib/formatters';
import { useToast } from '@/shared/ui/organisms/Toast/useToast';
import { Button } from '@/shared/ui/atoms/Button';

export const VideoUploadPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // ✅ Dùng useRef để điều khiển input file đang bị ẩn
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const toast = useToast();
    const uploadMutation = useUploadVideo();

    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const handleUpload = async () => {
        if (!file) return;
        try {
            const newVideo = await uploadMutation.mutateAsync({ file });
            toast.show('Upload thành công!', 'success');
            navigate(`/videos/${newVideo.id}`); // Quay về danh sách video
        } catch (error) {
            toast.show('Lỗi định dạng hoặc kích thước file không hợp lệ.', 'error');
        }
    };

    // Hàm kích hoạt việc mở cửa sổ chọn file của hệ điều hành
    const handleSelectFileClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="p-6 max-w-3xl mx-auto mt-6">
            <h1 className="text-2xl font-bold mb-6">Upload Video Mới</h1>
            <div className="bg-white p-8 border rounded-lg shadow-sm">

                {/* Thẻ input file luôn bị ẩn đi */}
                <input
                    type="file"
                    accept="video/*"
                    ref={fileInputRef}
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                />

                {/* Giao diện khi CHƯA có file */}
                {!file && (
                    <div className="space-y-6">
                        {/* ✅ Nút chọn file TÁCH RỜI, gọi chuẩn Atom Button */}
                        <Button
                            variant="secondary"
                            onClick={handleSelectFileClick}
                            className="border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100"
                        >
                            📁 Tải video lên
                        </Button>

                        {/* Box phụ trợ bên dưới (Chỉ mang tính chất minh họa kéo thả) */}
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center bg-gray-50 text-gray-400">
                            <span className="block text-2xl mb-2">☁️</span>
                            <p>Hoặc kéo thả file video của bạn vào khu vực này</p>
                            <p className="text-sm mt-1">Hỗ trợ định dạng: MP4, AVI, MOV... (Tối đa 500MB)</p>
                        </div>
                    </div>
                )}

                {/* Giao diện khi ĐÃ chọn file (Video Preview) */}
                {file && previewUrl && (
                    <div className="mb-8 border rounded-lg overflow-hidden shadow-sm">
                        <div className="bg-black flex justify-center w-full aspect-video">
                            <video src={previewUrl} controls className="max-h-full w-auto">
                                Trình duyệt của bạn không hỗ trợ thẻ video.
                            </video>
                        </div>

                        <div className="p-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 border-t">
                            <div className="truncate w-full sm:w-auto">
                                <p className="font-semibold text-sm truncate max-w-md" title={file.name}>{file.name}</p>
                                <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</p>
                            </div>
                            {/* Nút hủy video hiện tại để chọn lại */}
                            <Button variant="danger" onClick={() => setFile(null)} className="py-1.5 px-4 text-sm shrink-0">
                                Xóa / Chọn file khác
                            </Button>
                        </div>
                    </div>
                )}

                {/* Các nút hành động chính */}
                <div className="flex gap-4 border-t pt-6 mt-6">
                    <Button variant="secondary" onClick={() => navigate(-1)} className="flex-1 sm:flex-none">
                        Trở về
                    </Button>

                    <Button
                        variant="primary"
                        onClick={handleUpload}
                        disabled={!file}
                        isLoading={uploadMutation.isPending}
                        className="flex-1"
                    >
                        {uploadMutation.isPending ? 'Đang tải lên...' : 'Tải lên hệ thống'}
                    </Button>
                </div>
            </div>
        </div>
    );
};