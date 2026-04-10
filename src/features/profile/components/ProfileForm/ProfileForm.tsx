// src/features/profile/components/ProfileForm/ProfileForm.tsx
import { useState } from 'react';
import type { UserResponse } from '@/shared/types/user.types';

interface ProfileFormProps {
    initialData: UserResponse;
    onSubmit: (data: { username?: string; phone?: string }) => void;
    isLoading: boolean;
}

export const ProfileForm = ({ initialData, onSubmit, isLoading }: ProfileFormProps) => {
    const [formData, setFormData] = useState({
        username: initialData.username,
        phone: initialData.phone,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-500">Email (Không thể thay đổi)</label>
                <input type="email" value={initialData.email} disabled className="w-full border p-2 rounded bg-gray-100 text-gray-500 cursor-not-allowed" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Tên hiển thị</label>
                <input type="text" required value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" disabled={isLoading} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                <input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" disabled={isLoading} />
            </div>
            <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                {isLoading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </button>
        </form>
    );
};