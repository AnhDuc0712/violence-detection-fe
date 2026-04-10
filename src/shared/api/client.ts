import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

// ✅ tạo api trước
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api/v1",
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ alias lại sau
export const apiClient = api;