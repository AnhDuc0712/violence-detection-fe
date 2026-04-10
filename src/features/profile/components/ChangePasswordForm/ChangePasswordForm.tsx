// src/features/profile/components/ChangePasswordForm/ChangePasswordForm.tsx
import { useState } from 'react';

interface ChangePasswordFormProps {
    onSubmit: (data: { old_password: string; new_password: string }) => void;
    isLoading: boolean;
}

export const ChangePasswordForm = ({ onSubmit, isLoading }: ChangePasswordFormProps) => {
    const [formData, setFormData] = useState({ old_password: '', new_password: '', confirm_password: '' });
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.new_password.length < 8) return setError('Mật khẩu mới phải có ít nhất 8 ký tự.');
        if (formData.new_password !== formData.confirm_password) return setError('Mật khẩu xác nhận không khớp.');

        onSubmit({ old_password: formData.old_password, new_password: formData.new_password });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded">{error}</div>}
            {/* Các thẻ input tương tự như form trên, gọi setFormData... */}
            <div>
                <input type="password" placeholder="Mật khẩu cũ" required onChange={e => setFormData({ ...formData, old_password: e.target.value })} className="w-full border p-2 rounded" disabled={isLoading} />
            </div>
            <div>
                <input type="password" placeholder="Mật khẩu mới (tối thiểu 8 ký tự)" required minLength={8} onChange={e => setFormData({ ...formData, new_password: e.target.value })} className="w-full border p-2 rounded" disabled={isLoading} />
            </div>
            <div>
                <input type="password" placeholder="Xác nhận mật khẩu mới" required minLength={8} onChange={e => setFormData({ ...formData, confirm_password: e.target.value })} className="w-full border p-2 rounded" disabled={isLoading} />
            </div>
            <button type="submit" disabled={isLoading} className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 disabled:opacity-50">
                Đổi Mật Khẩu
            </button>
        </form>
    );
};