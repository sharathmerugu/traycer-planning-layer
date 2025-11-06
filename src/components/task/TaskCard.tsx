/**
 * Individual task card component
 */

"use client";

import React from "react";
import { Task } from "@/lib/types";
import { TASK_TYPES, STATUS_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Circle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Play,
  Trash2,
  Clock,
  FileText,
  GitBranch,
} from "lucide-react";

export interface TaskCardProps {
  task: Task;
  onExecute?: () => void;
  onDelete?: () => void;
  canExecute: boolean;
  agentName?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onExecute,
  onDelete,
  canExecute,
  agentName,
}) => {
  // Status icon mapping
  const statusIcons = {
    pending: Circle,
    "in-progress": Loader2,
    completed: CheckCircle2,
    failed: AlertCircle,
  };

  const StatusIcon = statusIcons[task.status];
  const statusConfig = STATUS_CONFIG[task.status];
  const taskTypeConfig = TASK_TYPES[task.type];

  return (
    <div
      className={`
        relative bg-slate-800/50 backdrop-blur-sm border rounded-xl p-4
        hover:border-slate-600 transition-all duration-200
        ${task.status === "completed" ? "border-green-500/30" : ""}
        ${task.status === "failed" ? "border-red-500/30" : ""}
        ${
          task.status === "in-progress"
            ? "border-blue-500/30"
            : "border-slate-700"
        }
      `}
    >
      <div className="flex items-start gap-4">
        {/* Left - Status Icon */}
        <div className="flex-shrink-0 pt-1">
          <StatusIcon
            className={`
              w-6 h-6 ${statusConfig.textColor}
              ${task.status === "in-progress" ? "animate-spin" : ""}
            `}
          />
        </div>

        {/* Center - Content */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{taskTypeConfig.icon}</span>
              <h3 className="text-lg font-semibold text-white truncate">
                {task.title}
              </h3>
            </div>
            <p
              className="text-sm text-slate-400 line-clamp-2"
              title={task.description}
            >
              {task.description}
            </p>
          </div>

          {/* Metadata row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Time estimate */}
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{task.estimatedTime} min</span>
            </div>

            {/* Agent */}
            {agentName && (
              <Badge variant="info" size="sm">
                {agentName}
              </Badge>
            )}

            {/* Task type */}
            <Badge variant="default" size="sm">
              {taskTypeConfig.label}
            </Badge>

            {/* Dependencies */}
            {task.dependencies.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <GitBranch className="w-3.5 h-3.5" />
                <span>{task.dependencies.length} dependencies</span>
              </div>
            )}

            {/* Files */}
            {task.files.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <FileText className="w-3.5 h-3.5" />
                <span>{task.files.length} files</span>
              </div>
            )}
          </div>

          {/* Files list (if any) */}
          {task.files.length > 0 && (
            <div className="space-y-1">
              {task.files.slice(0, 3).map((file, index) => (
                <div
                  key={index}
                  className="text-xs text-slate-500 font-mono truncate"
                >
                  {file}
                </div>
              ))}
              {task.files.length > 3 && (
                <div className="text-xs text-slate-500">
                  +{task.files.length - 3} more files
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right - Action Buttons */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {task.status === "pending" && onExecute && (
            <Button
              size="sm"
              variant="primary"
              icon={<Play className="w-3.5 h-3.5" />}
              onClick={onExecute}
              disabled={!canExecute}
              title={
                canExecute
                  ? "Execute this task"
                  : "Cannot execute - dependencies not completed"
              }
            >
              Execute
            </Button>
          )}

          {task.status === "failed" && onExecute && (
            <Button
              size="sm"
              variant="secondary"
              icon={<Play className="w-3.5 h-3.5" />}
              onClick={onExecute}
              title="Retry failed task"
            >
              Retry
            </Button>
          )}

          {onDelete && task.status !== "in-progress" && (
            <Button
              size="sm"
              variant="ghost"
              icon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={onDelete}
              title="Delete this task"
            />
          )}
        </div>
      </div>
    </div>
  );
};
