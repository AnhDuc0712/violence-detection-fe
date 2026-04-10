// src/shared/ui/atoms/Button/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    isLoading?: boolean;
}

export const Button = ({
    variant = 'primary',
    isLoading = false,
    className = '',
    children,
    disabled,
    ...props
}: ButtonProps) => {
    // Định nghĩa các style tương ứng với từng variant
    const baseStyle = "px-4 py-2 rounded font-medium transition disabled:opacity-50 flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "border border-gray-300 text-gray-700 hover:bg-gray-50",
        danger: "bg-red-50 text-red-600 hover:bg-red-100",
        ghost: "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
    };

    return (
        <button
            className={`${baseStyle} ${variants[variant]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            )}
            {children}
        </button>
    );
};