/**
 * Task list component with timeline layout
 */

"use client";

import React from "react";
import { Task, Agent } from "@/lib/types";
import { TaskCard } from "./TaskCard";
import { canExecuteTask } from "@/utils/dependencies";
import { ClipboardList } from "lucide-react";

export interface TaskListProps {
  tasks: Task[];
  agents: Agent[];
  onExecuteTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = React.memo(
  ({ tasks, agents, onExecuteTask, onDeleteTask }) => {
    // Get agent name by ID
    const getAgentName = (agentId?: string): string | undefined => {
      if (!agentId) return undefined;
      return agents.find((a) => a.id === agentId)?.name;
    };

    if (tasks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ClipboardList className="w-16 h-16 text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No tasks yet
          </h3>
          <p className="text-slate-400 max-w-md">
            This plan doesn&apos;t have any tasks. Tasks will be automatically
            generated when you create a plan with a description.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div key={task.id} className="relative">
            {/* Task Card */}
            <TaskCard
              task={task}
              onExecute={() => onExecuteTask(task.id)}
              onDelete={() => onDeleteTask(task.id)}
              canExecute={canExecuteTask(task, tasks)}
              agentName={getAgentName(task.agent)}
            />

            {/* Dependency connector line */}
            {index < tasks.length - 1 && (
              <div className="absolute left-7 top-full w-0.5 h-4 bg-slate-700" />
            )}
          </div>
        ))}
      </div>
    );
  }
);

TaskList.displayName = "TaskList";
