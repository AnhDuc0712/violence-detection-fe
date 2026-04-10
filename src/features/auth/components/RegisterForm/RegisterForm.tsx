// src/features/auth/components/RegisterForm/RegisterForm.tsx
import { useState } from 'react';
import type { UserCreate } from '../../types/auth.types';

interface RegisterFormProps {
    onSubmit: (data: UserCreate) => void;
    isLoading: boolean;
}

export const RegisterForm = ({ onSubmit, isLoading }: RegisterFormProps) => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        phone: '',
        password: '',
        confirm_password: '',
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError(null); // Clear error khi user gõ lại
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation chuẩn theo ui.flows.md
        if (formData.password.length < 8) {
            return setError('Mật khẩu phải có ít nhất 8 ký tự.');
        }
        if (formData.password !== formData.confirm_password) {
            return setError('Mật khẩu xác nhận không khớp.');
        }

        onSubmit({
            email: formData.email,
            username: formData.username,
            phone: formData.phone,
            password: formData.password
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded">{error}</div>}

            <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" disabled={isLoading} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Tên hiển thị (Username)</label>
                <input type="text" name="username" required value={formData.username} onChange={handleChange}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" disabled={isLoading} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" disabled={isLoading} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                <input type="password" name="password" required minLength={8} value={formData.password} onChange={handleChange}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" disabled={isLoading} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu</label>
                <input type="password" name="confirm_password" required minLength={8} value={formData.confirm_password} onChange={handleChange}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" disabled={isLoading} />
            </div>

            <button type="submit" disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition">
                {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
            </button>
        </form>
    );
};