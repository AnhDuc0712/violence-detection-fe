// src/features/analysis/components/StartAnalysisModal/StartAnalysisModal.tsx
import { useState } from 'react';
import type { AnalysisSessionCreate } from '../../types/analysis.types';

interface StartAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (spec: AnalysisSessionCreate['pipeline_spec']) => void;
    isLoading: boolean;
}

export const StartAnalysisModal = ({ isOpen, onClose, onSubmit, isLoading }: StartAnalysisModalProps) => {
    const [threshold, setThreshold] = useState<number>(0.7);
    const [modelVersion, setModelVersion] = useState<string>('v1.0');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <h2 className="text-xl font-bold mb-4">Cấu hình phân tích AI</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Model Version</label>
                    <select
                        value={modelVersion}
                        onChange={(e) => setModelVersion(e.target.value)}
                        disabled={isLoading}
                        className="w-full border p-2 rounded"
                    >
                        <option value="v1.0">YOLOv8 Base (v1.0)</option>
                        <option value="v1.1">YOLOv8 Optimized (v1.1)</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Độ nhạy (Threshold): {threshold}</label>
                    <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.1"
                        value={threshold}
                        onChange={(e) => setThreshold(parseFloat(e.target.value))}
                        disabled={isLoading}
                        className="w-full"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} disabled={isLoading} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                        Hủy
                    </button>
                    <button
                        onClick={() => onSubmit({ model_version: modelVersion, threshold })}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Đang khởi tạo...' : 'Chạy phân tích'}
                    </button>
                </div>
            </div>
        </div>
    );
};