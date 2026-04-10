// src/features/profile/types/profile.types.ts
export interface UserUpdate {
    username?: string;
    phone?: string;
}

export interface UserChangePassword {
    old_password: string;
    new_password: string;
}