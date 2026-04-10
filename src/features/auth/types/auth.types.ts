// src/features/auth/types/auth.types.ts
// UserResponse được đặt ở shared để tránh cross-feature import
// auth feature re-export để giữ backward compat

export interface UserCreate {
    email: string;
    username: string;
    phone: string;
    password: string; // BE enforce: min 6, max 64 chars
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface Token {
    access_token: string;
    token_type: string;
}
