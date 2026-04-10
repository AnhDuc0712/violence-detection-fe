// src/features/profile/hooks/useProfile.ts
import { useQuery } from '@tanstack/react-query';
import { profileApi } from '../api/profile.api';

export const useProfile = () => {
    return useQuery({
        queryKey: ['profile', 'me'],
        queryFn: profileApi.getMe,
    });
};