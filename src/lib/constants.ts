/**
 * Application constants for Traycer Planning Layer
 */

import { Agent, TaskType } from "./types";

/**
 * Task type configuration with icons and colors for UI
 */
export const TASK_TYPES: Record<
  TaskType,
  { icon: string; color: string; label: string }
> = {
  analysis: {
    icon: "🔍",
    color: "bg-blue-500",
    label: "Analysis",
  },
  implementation: {
    icon: "⚙️",
    color: "bg-purple-500",
    label: "Implementation",
  },
  testing: {
    icon: "✅",
    color: "bg-green-500",
    label: "Testing",
  },
  refactor: {
    icon: "♻️",
    color: "bg-orange-500",
    label: "Refactor",
  },
};

/**
 * Available AI coding agents with their capabilities
 */
export const AGENTS: Agent[] = [
  {
    id: "copilot",
    name: "GitHub Copilot",
    color: "#24292e",
    capabilities: [
      "code-completion",
      "inline-suggestions",
      "documentation",
      "testing",
    ],
    status: "available",
  },
  {
    id: "cursor",
    name: "Cursor AI",
    color: "#8B5CF6",
    capabilities: [
      "code-generation",
      "refactoring",
      "debugging",
      "architecture",
    ],
    status: "available",
  },
  {
    id: "codeium",
    name: "Codeium",
    color: "#09B6A2",
    capabilities: ["auto-complete", "multi-language", "fast-inference"],
    status: "available",
  },
  {
    id: "windsurf",
    name: "Windsurf",
    color: "#3B82F6",
    capabilities: ["full-stack", "planning", "execution", "collaboration"],
    status: "available",
  },
];

/**
 * Status configuration with colors for UI
 */
export const STATUS_CONFIG = {
  pending: {
    color: "bg-gray-500",
    textColor: "text-gray-400",
    label: "Pending",
    icon: "⏳",
  },
  "in-progress": {
    color: "bg-blue-500",
    textColor: "text-blue-400",
    label: "In Progress",
    icon: "🔄",
  },
  completed: {
    color: "bg-green-500",
    textColor: "text-green-400",
    label: "Completed",
    icon: "✓",
  },
  failed: {
    color: "bg-red-500",
    textColor: "text-red-400",
    label: "Failed",
    icon: "✗",
  },
};
