// src/features/auth/components/LoginForm/LoginForm.tsx
import React, { useState } from 'react';
import type { UserLogin } from '../../types/auth.types';

interface LoginFormProps {
    onSubmit: (data: UserLogin) => void;
    isLoading: boolean;
    errorMsg?: string | null;
}

export const LoginForm = ({ onSubmit, isLoading, errorMsg }: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ email, password });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm w-full">
            <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full border p-2 rounded"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full border p-2 rounded"
                />
            </div>

            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

            <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
        </form>
    );
};