// src/shared/api/client.ts
import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

// Base URL từ cấu hình API Contract
const BASE_URL = 'https://violence-backend-1-57zx.onrender.com';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: Tự động đính kèm token nếu có
apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Format chuẩn Bearer JWT
    }
    return config;
});

// Response interceptor: Xử lý lỗi toàn cục
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // 401 Unauthorized: token hết hạn hoặc sai — FE redirect về /login
            useAuthStore.getState().logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);