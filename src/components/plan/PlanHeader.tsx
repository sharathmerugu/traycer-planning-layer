/**
 * Plan header component with execution controls
 */

"use client";

import React from "react";
import { Plan } from "@/lib/types";
import { calculateProgress, getExecutionStats } from "@/lib/taskExecutor";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { Play, Pause } from "lucide-react";

export interface PlanHeaderProps {
  plan: Plan;
  onExecuteAll: () => void;
  onPause: () => void;
  isExecuting: boolean;
}

export const PlanHeader: React.FC<PlanHeaderProps> = ({
  plan,
  onExecuteAll,
  onPause,
  isExecuting,
}) => {
  const progress = calculateProgress(plan.tasks);
  const stats = getExecutionStats(plan.tasks);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white mb-2">{plan.name}</h1>
          <p className="text-slate-400">{plan.description}</p>
        </div>

        {/* Execute/Pause button */}
        <Button
          variant={isExecuting ? "danger" : "primary"}
          icon={
            isExecuting ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )
          }
          onClick={isExecuting ? onPause : onExecuteAll}
          disabled={stats.total === 0 || stats.completed === stats.total}
        >
          {isExecuting ? "Pause" : "Execute All"}
        </Button>
      </div>

      {/* Progress section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white">Progress</span>
          <span className="text-sm text-slate-400">
            {stats.completed} / {stats.total} tasks completed
          </span>
        </div>

        <ProgressBar percentage={progress} showLabel={false} />

        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          {stats.inProgress > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              {stats.inProgress} in progress
            </span>
          )}
          {stats.pending > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-500 rounded-full" />
              {stats.pending} pending
            </span>
          )}
          {stats.failed > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              {stats.failed} failed
            </span>
          )}
          {stats.estimatedTimeRemaining > 0 && (
            <span className="ml-auto">
              ~{stats.estimatedTimeRemaining} min remaining
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
