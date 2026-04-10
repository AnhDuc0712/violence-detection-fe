// src/store/ui.store.ts
import { create } from 'zustand';

interface UiState {
    toast: { message: string; type: 'success' | 'error' | 'info' } | null;
    setToast: (message: string, type: 'success' | 'error' | 'info') => void;
    clearToast: () => void;
}

export const useUiStore = create<UiState>((set) => ({
    toast: null,
    setToast: (message, type) => {
        set({ toast: { message, type } });
        // Tự động tắt toast sau 3 giây
        setTimeout(() => set({ toast: null }), 3000);
    },
    clearToast: () => set({ toast: null }),
}));