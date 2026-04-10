# 🛡️ Hệ Thống Phân Tích Bạo Lực Bằng AI (Violence Detection System)

Dự án này bao gồm Frontend (React + Vite) và Backend (FastAPI + PostgreSQL), cho phép người dùng tải video lên, AI tự động phân tích và trả về các khung hình có chứa hành vi bạo lực.

## 🚀 Hướng Dẫn Khởi Động Hệ Thống (Local Development)

### 1. Khởi động fe (Python/FastAPI)
\

 Cài đặt thư viện:
   ```bash
   npm install

   Run hệ thống:
   npm run dev


Cấu trúc :
src/
│
├── 📁 shared/                  # Tầng 1: Các thành phần dùng chung (Không chứa logic nghiệp vụ)
│   ├── api/                    # Cấu hình Axios Client & Interceptors
│   ├── lib/                    # Các hàm tiện ích (formatDate, formatFileSize...)
│   ├── types/                  # TypeScript Types dùng chung toàn hệ thống
│   └── ui/                     # UI Components (Atomic Design)
│       └── atoms/              # Nút bấm (Button), Input, Badge...
│
├── 📁 features/                # Tầng 2: Các tính năng cốt lõi (Độc lập 100%)
│   ├── auth/                   # Xử lý Đăng nhập, Đăng ký
│   ├── profile/                # Quản lý hồ sơ, đổi mật khẩu
│   ├── videos/                 # Upload, Xóa, Xem metadata video
│   ├── analysis/               # Trigger AI, xem Timeline kết quả phân tích
│   ├── feedback/               # Đánh giá kết quả nhận diện (FP/FN)
│   └── reports/                # Quản lý luồng gửi Ticket hỗ trợ
│   │
│   └── (Cấu trúc bên trong mỗi feature)
│       ├── api/                # Nơi gọi API bằng Axios
│       ├── hooks/              # Nơi chứa Business Logic (React Query)
│       ├── components/         # UI Forms, Cards riêng của tính năng
│       └── types/              # TypeScript schemas map với Backend
│
├── 📁 layouts/                 # Tầng 3: Khung giao diện chính
│   ├── UserLayout.tsx          # Wrapper Sidebar + Header cho User
│   └── AdminLayout.tsx         # Wrapper cho Admin Portal
│
├── 📁 pages/                   # Tầng 4: Các Trang hiển thị (Siêu mỏng, dùng để rẽ nhánh UI)
│   ├── user/                   # Dashboard, VideoUploadPage, AnalysisDetailPage...
│   └── admin/                  # AdminDashboard, UsersPage...
│
├── 📁 store/                   # Tầng 5: Global State (Zustand)
│   ├── auth.store.ts           # Quản lý Token và User Profile toàn cục
│   └── ui.store.ts             # Quản lý Toast Notification
│
├── 📁 router/                  # Quản lý luồng điều hướng (React Router v6)
│   ├── index.tsx               # Khai báo các Routes
│   └── guards.tsx              # Bảo vệ trang (AuthGuard, AdminGuard)
│
├── App.tsx                     # Điểm kết nối Providers (QueryClient, Router)
└── main.tsx                    # Điểm khởi chạy React

2.Công Nghệ Sử Dụng (Tech Stack)
Core: React 18, TypeScript, Vite.

Routing: React Router v6.

State Management & API Caching: TanStack React Query v5.

Global State: Zustand.

Styling: Tailwind CSS.