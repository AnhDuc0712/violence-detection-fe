// src/features/realtime-cam/api/realtime-cam.api.ts
import type { AnalysisFrameRequest, AnalysisFrameResponse } from '../types/realtime-cam.types';

export const realtimeCamApi = {
    analyzeFrame: async (_payload: AnalysisFrameRequest): Promise<AnalysisFrameResponse> => {
        // TODO: uncomment khi BE sẵn sàng
        // return apiClient.post<AnalysisFrameResponse>('/realtime/analyze-frame', _payload).then(r => r.data);

        // Mock response trong lúc chờ BE (Giả lập delay mạng 200ms)
        await new Promise(resolve => setTimeout(resolve, 200));
        return { events: [], processing_time_ms: 200 };
    },

    startSession: async (): Promise<{ session_id: string } | null> => {
        // TODO: uncomment khi BE sẵn sàng
        // return apiClient.post<{ session_id: string }>('/realtime/sessions').then(r => r.data);
        return null;
    },

    endSession: async (_sessionId: string): Promise<void> => {
        // TODO: uncomment khi BE sẵn sàng
        // await apiClient.delete(`/realtime/sessions/${_sessionId}`);
    },
};