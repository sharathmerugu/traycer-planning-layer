/**
 * Badge component for tags and status indicators
 */

import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "sm",
}) => {
  // Variant styles
  const variantStyles = {
    default: "bg-slate-700 text-slate-300 border-slate-600",
    success: "bg-green-500/20 text-green-400 border-green-500/30",
    warning: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    error: "bg-red-500/20 text-red-400 border-red-500/30",
    info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  // Size styles
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        rounded-full border font-medium
        ${variantStyles[variant]}
        ${sizeStyles[size]}
      `}
    >
      {children}
    </span>
  );
};
