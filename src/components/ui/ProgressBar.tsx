/**
 * Animated progress bar component
 */

import React from "react";

export interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "blue" | "green" | "purple" | "gradient";
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  showLabel = true,
  size = "md",
  color = "gradient",
}) => {
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  // Size styles
  const sizeStyles = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  // Color styles
  const colorStyles = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    gradient: "bg-gradient-to-r from-blue-500 to-purple-500",
  };

  return (
    <div className="w-full space-y-1">
      {/* Progress bar container */}
      <div
        className={`w-full bg-slate-700 rounded-full overflow-hidden ${sizeStyles[size]}`}
      >
        {/* Progress fill */}
        <div
          className={`
            ${sizeStyles[size]} ${colorStyles[color]}
            rounded-full transition-all duration-500 ease-out
          `}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>

      {/* Optional label */}
      {showLabel && (
        <div className="flex justify-end">
          <span className="text-xs text-slate-400 font-medium">
            {Math.round(clampedPercentage)}%
          </span>
        </div>
      )}
    </div>
  );
};
