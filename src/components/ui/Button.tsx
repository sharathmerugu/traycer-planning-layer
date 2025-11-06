/**
 * Reusable Button component with multiple variants and states
 */

import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  loading?: boolean;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  // Variant styles
  const variantStyles = {
    primary:
      "bg-blue-500 hover:bg-blue-600 text-white border-blue-600 hover:border-blue-700",
    secondary:
      "bg-slate-700 hover:bg-slate-600 text-white border-slate-600 hover:border-slate-500",
    ghost:
      "bg-transparent hover:bg-slate-800 text-slate-300 border-transparent hover:border-slate-700",
    danger:
      "bg-red-500 hover:bg-red-600 text-white border-red-600 hover:border-red-700",
  };

  // Size styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  // Icon size styles
  const iconSizeStyles = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 
        rounded-lg border font-medium
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <Loader2 className={`${iconSizeStyles[size]} animate-spin`} />
      ) : icon ? (
        <span className={iconSizeStyles[size]}>{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
