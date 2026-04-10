// src/shared/ui/organisms/Toast/useToast.ts
import { useUiStore } from '@/store/ui.store';

export const useToast = () => {
    const setToast = useUiStore((state) => state.setToast);

    return {
        show: (message: string, type: 'success' | 'error' | 'info' = 'info') => {
            setToast(message, type);
        }
    };
};