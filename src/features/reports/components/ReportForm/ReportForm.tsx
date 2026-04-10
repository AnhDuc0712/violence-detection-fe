// src/features/reports/components/ReportForm/ReportForm.tsx
import { useState } from 'react';
import type { ReportCreate } from '../../types/report.types';

interface ReportFormProps {
    onSubmit: (data: ReportCreate) => void;
    isLoading: boolean;
}

export const ReportForm = ({ onSubmit, isLoading }: ReportFormProps) => {
    const [formData, setFormData] = useState<ReportCreate>({
        message_type: 'support',
        target_type: 'other', // Default other không cần target_id
        category: 'other',
        title: '',
        description: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const needsTargetId = formData.target_type !== 'other';

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Loại yêu cầu</label>
                    <select name="message_type" value={formData.message_type} onChange={handleChange} className="w-full border p-2 rounded">
                        <option value="support">Hỗ trợ (Support)</option>
                        <option value="bug">Báo lỗi (Bug)</option>
                        <option value="complaint">Khiếu nại (Complaint)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Danh mục</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded">
                        <option value="other">Khác</option>
                        <option value="bug">Lỗi kỹ thuật</option>
                        <option value="abuse">Báo cáo vi phạm</option>
                        <option value="false_detection">Nhận diện sai (AI lỗi)</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Đối tượng liên quan</label>
                    <select name="target_type" value={formData.target_type} onChange={handleChange} className="w-full border p-2 rounded">
                        <option value="system">Hệ thống chung</option>
                        <option value="video">Video</option>
                        <option value="session">Phiên phân tích (Session)</option>
                        <option value="account">Tài khoản</option>
                    </select>
                </div>
                {needsTargetId && (
                    <div>
                        <label className="block text-sm font-medium mb-1">ID Đối tượng (UUID)</label>
                        <input type="text" name="target_id" value={formData.target_id || ''} onChange={handleChange} required placeholder="Nhập ID..." className="w-full border p-2 rounded font-mono text-sm" />
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Tiêu đề (Tùy chọn)</label>
                <input type="text" name="title" value={formData.title || ''} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Mô tả chi tiết <span className="text-red-500">*</span></label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={5} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"></textarea>
            </div>

            <button type="submit" disabled={isLoading || !formData.description.trim()} className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50">
                {isLoading ? 'Đang gửi yêu cầu...' : 'Gửi Yêu Cầu Hỗ Trợ'}
            </button>
        </form>
    );
};