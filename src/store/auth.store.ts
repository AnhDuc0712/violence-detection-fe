// src/store/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserResponse } from '@/shared/types/user.types'; // ✅ Fix lỗi 1

interface AuthState {
    token: string | null;
    user: UserResponse | null;
    isAuthenticated: boolean;
    login: (token: string, user: UserResponse) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            login: (token, user) => set({ token, user, isAuthenticated: true }),
            logout: () => {
                set({ token: null, user: null, isAuthenticated: false });
                // ✅ Fix lỗi 2: bỏ localStorage.removeItem — persist tự sync
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({  // tùy chọn: chỉ persist data, bỏ actions
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);