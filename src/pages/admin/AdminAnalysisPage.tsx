// src/pages/admin/AdminAnalysisPage.tsx
import { useState } from 'react';
import { AdminVideoTable } from '@/features/admin/analysis/components/AdminVideoTable/AdminVideoTable';
import { AdminSessionTable } from '@/features/admin/analysis/components/AdminSessionTable/AdminSessionTable';

export const AdminAnalysisPage = () => {
    const [activeTab, setActiveTab] = useState<'videos' | 'sessions'>('videos');

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Quản lý Video & Phiên Phân Tích</h1>

            {/* Điều hướng Tabs */}
            <div className="flex border-b border-gray-300">
                <button
                    onClick={() => setActiveTab('videos')}
                    className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'videos' ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    🎥 Tất cả Video
                </button>
                <button
                    onClick={() => setActiveTab('sessions')}
                    className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'sessions' ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    ⚙️ Tiến trình Phân tích (Sessions)
                </button>
            </div>

            {/* Nội dung Tab */}
            <div className="mt-4">
                {activeTab === 'videos' ? <AdminVideoTable /> : <AdminSessionTable />}
            </div>
        </div>
    );
};