/**
 * Core TypeScript interfaces for Traycer Planning Layer
 */

/**
 * Task status enum
 */
export type TaskStatus = "pending" | "in-progress" | "completed" | "failed";

/**
 * Task type enum - different categories of development tasks
 */
export type TaskType = "analysis" | "implementation" | "testing" | "refactor";

/**
 * Agent status enum
 */
export type AgentStatus = "available" | "busy";

/**
 * Task interface - represents a single unit of work
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  type: TaskType;
  dependencies: string[]; // Array of task IDs that must complete before this task
  estimatedTime: number; // In minutes
  files: string[]; // Files that will be affected by this task
  agent?: string; // ID of assigned agent (optional until assigned)
  createdAt: Date;
}

/**
 * Plan interface - represents a complete development plan with multiple tasks
 */
export interface Plan {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Agent interface - represents a coding assistant with specific capabilities
 */
export interface Agent {
  id: string;
  name: string;
  color: string; // Hex color for UI representation
  capabilities: string[]; // Array of capabilities/specializations
  status: AgentStatus;
}
