// src/shared/api/client.ts
import axios from 'axios';
import { useAuthStore } from '@/store/auth.store'; // Giữ lại dòng này

// ✅ tạo api trước
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api/v1",
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ alias lại sau
export const apiClient = api;

// 🚀 Xài useAuthStore ở đây để TypeScript không la làng nữa
api.interceptors.request.use((config) => {
    // Lưu ý: tùy thuộc vào cách sếp viết zustand store mà cách gọi hàm getState() có thể khác
    const token = useAuthStore.getState().token; 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});