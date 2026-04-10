// src/features/admin/ml-review/hooks/useCreateSnapshot.ts
import { useMutation } from '@tanstack/react-query';
import { mlReviewApi } from '../api/ml-review.api';

export const useCreateSnapshot = () => {
    return useMutation({
        mutationFn: mlReviewApi.createSnapshot,
    });
};