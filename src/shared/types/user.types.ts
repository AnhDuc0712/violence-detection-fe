// src/shared/types/user.types.ts
// UserResponse dùng chung cho cả auth và profile feature
// Đặt ở shared để tránh cross-feature import violation
export interface UserResponse {
    id: string;
    username: string;
    email: string;
    phone: string;
    role: 'user' | 'admin' | 'super_admin';
    status: 'active' | 'blocked' | 'suspended';
    created_at: string;
    // ⚠️ BE không trả về: email_verified, phone_verified, last_login_at
}

export interface Token {
    access_token: string;
    token_type: string;
}