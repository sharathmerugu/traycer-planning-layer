/**
 * Task form component for adding/editing tasks
 */

"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Task, TaskType } from "@/lib/types";
import { TASK_TYPES } from "@/lib/constants";

export interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Partial<Task>) => void;
  existingTask?: Task;
  availableTasks?: Task[];
}

export const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingTask,
  availableTasks = [],
}) => {
  const [title, setTitle] = useState(existingTask?.title || "");
  const [description, setDescription] = useState(
    existingTask?.description || ""
  );
  const [type, setType] = useState<TaskType>(
    existingTask?.type || "implementation"
  );
  const [estimatedTime, setEstimatedTime] = useState(
    existingTask?.estimatedTime || 30
  );
  const [dependencies, setDependencies] = useState<string[]>(
    existingTask?.dependencies || []
  );
  const [files, setFiles] = useState(existingTask?.files.join(", ") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const taskData: Partial<Task> = {
      title: title.trim(),
      description: description.trim(),
      type,
      estimatedTime,
      dependencies,
      files: files
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f),
    };

    onSubmit(taskData);
    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setType("implementation");
    setEstimatedTime(30);
    setDependencies([]);
    setFiles("");
    onClose();
  };

  const toggleDependency = (taskId: string) => {
    setDependencies((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={existingTask ? "Edit Task" : "Add Task"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="task-title"
            className="block text-sm font-medium text-white mb-2"
          >
            Task Title *
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Implement user registration API"
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="task-description"
            className="block text-sm font-medium text-white mb-2"
          >
            Description *
          </label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this task involves..."
            rows={3}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
          />
        </div>

        {/* Type and Estimated Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="task-type"
              className="block text-sm font-medium text-white mb-2"
            >
              Task Type *
            </label>
            <select
              id="task-type"
              value={type}
              onChange={(e) => setType(e.target.value as TaskType)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(TASK_TYPES).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.icon} {config.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="task-time"
              className="block text-sm font-medium text-white mb-2"
            >
              Estimated Time (min) *
            </label>
            <input
              id="task-time"
              type="number"
              min="5"
              max="120"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(parseInt(e.target.value) || 30)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Files */}
        <div>
          <label
            htmlFor="task-files"
            className="block text-sm font-medium text-white mb-2"
          >
            Files (comma-separated)
          </label>
          <input
            id="task-files"
            type="text"
            value={files}
            onChange={(e) => setFiles(e.target.value)}
            placeholder="e.g., src/api/auth.ts, src/components/Login.tsx"
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Dependencies */}
        {availableTasks.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Dependencies (optional)
            </label>
            <div className="max-h-32 overflow-y-auto space-y-2 p-3 bg-slate-900 border border-slate-700 rounded-lg">
              {availableTasks
                .filter((t) => t.id !== existingTask?.id)
                .map((task) => (
                  <label
                    key={task.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={dependencies.includes(task.id)}
                      onChange={() => toggleDependency(task.id)}
                      className="w-4 h-4 text-blue-500 bg-slate-800 border-slate-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-300">{task.title}</span>
                  </label>
                ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!title.trim() || !description.trim()}
          >
            {existingTask ? "Update Task" : "Add Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
