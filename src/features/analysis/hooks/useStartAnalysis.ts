// src/features/analysis/hooks/useStartAnalysis.ts
import { useMutation } from '@tanstack/react-query';
import { analysisApi } from '../api/analysis.api';
import type { AnalysisSessionCreate } from '../types/analysis.types';

export const useStartAnalysis = () => {
    return useMutation({
        mutationFn: (data: AnalysisSessionCreate) => analysisApi.startAnalysis(data),
    });
};