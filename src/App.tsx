// src/App.tsx
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from '@/router'; // Import router bạn vừa tạo

// Khởi tạo bộ quản lý API Caching (React Query)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tắt tự động gọi lại API khi chuyển tab (chống tự DDOS như ta đã phân tích)
      refetchOnWindowFocus: false,
      // Chỉ thử gọi lại 1 lần nếu API lỗi mạng
      retry: 1,
    },
  },
});

function App() {
  return (
    // Bọc toàn bộ App bằng QueryClientProvider để các Custom Hook gọi được API
    <QueryClientProvider client={queryClient}>

      {/* Bọc RouterProvider để kích hoạt hệ thống chuyển trang */}
      <RouterProvider router={router} />

    </QueryClientProvider>
  );
}

export default App;