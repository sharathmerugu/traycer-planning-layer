/**
 * Plan card component for sidebar display
 */

"use client";

import React from "react";
import { Plan } from "@/lib/types";
import { calculateProgress } from "@/lib/taskExecutor";

export interface PlanCardProps {
  plan: Plan;
  isSelected: boolean;
  onClick: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isSelected,
  onClick,
}) => {
  const taskCount = plan.tasks.length;
  const progress = calculateProgress(plan.tasks);

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-3 rounded-lg border transition-all duration-200
        hover:border-slate-600 hover:bg-slate-800/50
        ${
          isSelected
            ? "border-blue-500 bg-blue-500/10"
            : "border-slate-700 bg-slate-800/30"
        }
      `}
    >
      {/* Plan name */}
      <h3
        className={`
        font-semibold mb-1 truncate
        ${isSelected ? "text-blue-400" : "text-white"}
      `}
      >
        {plan.name}
      </h3>

      {/* Task count */}
      <p className="text-xs text-slate-400 mb-2">
        {taskCount} {taskCount === 1 ? "task" : "tasks"}
      </p>

      {/* Mini progress indicator */}
      {taskCount > 0 && (
        <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </button>
  );
};
