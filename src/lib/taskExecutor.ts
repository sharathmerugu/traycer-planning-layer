/**
 * Task execution engine - handles running tasks with dependency checking
 */

import { Task } from "./types";
import { canExecuteTask, getExecutionOrder } from "@/utils/dependencies";

/**
 * Executes a single task with dependency validation
 * @param taskId - ID of the task to execute
 * @param tasks - All tasks in the plan
 * @returns Updated task with new status
 * @throws Error if dependencies are not met
 */
export async function executeTask(
  taskId: string,
  tasks: Task[]
): Promise<Task> {
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    throw new Error(`Task with ID ${taskId} not found`);
  }

  // Check if task can be executed
  if (!canExecuteTask(task, tasks)) {
    throw new Error(
      `Cannot execute task "${task.title}" - dependencies not met`
    );
  }

  // Simulate task execution with realistic delay based on estimated time
  // Use estimated time in seconds (convert minutes to milliseconds)
  const executionTime = Math.min(task.estimatedTime * 100, 4000); // Cap at 4 seconds for demo

  // Simulate random failures (10% chance)
  const willFail = Math.random() < 0.1;

  try {
    // Mark as in-progress
    const inProgressTask: Task = {
      ...task,
      status: "in-progress",
    };

    // Simulate work being done
    await new Promise((resolve) => setTimeout(resolve, executionTime));

    if (willFail) {
      // Simulate failure
      return {
        ...task,
        status: "failed",
      };
    }

    // Mark as completed
    return {
      ...task,
      status: "completed",
    };
  } catch (error) {
    // Handle unexpected errors
    return {
      ...task,
      status: "failed",
    };
  }
}

/**
 * Executes tasks in sequence based on dependency order
 * Uses async generator to yield progress updates
 * @param tasks - Array of tasks to execute
 * @yields Updated task after each execution
 */
export async function* executeTaskSequence(
  tasks: Task[]
): AsyncGenerator<Task> {
  // Get execution order using topological sort
  const orderedTasks = getExecutionOrder(tasks);

  // Keep track of completed tasks for dependency checking
  const updatedTasks = [...tasks];

  for (const task of orderedTasks) {
    // Skip tasks that are already completed or in failed state
    if (task.status === "completed" || task.status === "failed") {
      continue;
    }

    try {
      // Execute the task
      const updatedTask = await executeTask(task.id, updatedTasks);

      // Update the task in our array
      const index = updatedTasks.findIndex((t) => t.id === task.id);
      if (index !== -1) {
        updatedTasks[index] = updatedTask;
      }

      // Yield the updated task for progress tracking
      yield updatedTask;

      // Stop execution if task failed
      if (updatedTask.status === "failed") {
        throw new Error(
          `Task "${updatedTask.title}" failed. Stopping execution.`
        );
      }
    } catch (error) {
      // Yield failed task and stop
      const failedTask: Task = {
        ...task,
        status: "failed",
      };

      const index = updatedTasks.findIndex((t) => t.id === task.id);
      if (index !== -1) {
        updatedTasks[index] = failedTask;
      }

      yield failedTask;
      break; // Stop execution on failure
    }
  }
}

/**
 * Estimates total execution time for a plan
 * @param tasks - Array of tasks
 * @returns Total estimated time in minutes
 */
export function estimateTotalTime(tasks: Task[]): number {
  return tasks.reduce((total, task) => total + task.estimatedTime, 0);
}

/**
 * Calculates progress percentage for a plan
 * @param tasks - Array of tasks
 * @returns Progress percentage (0-100)
 */
export function calculateProgress(tasks: Task[]): number {
  if (tasks.length === 0) {
    return 0;
  }

  const completedTasks = tasks.filter((task) => task.status === "completed");
  return Math.round((completedTasks.length / tasks.length) * 100);
}

/**
 * Gets execution statistics for a plan
 * @param tasks - Array of tasks
 * @returns Statistics object with counts and percentages
 */
export function getExecutionStats(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const failed = tasks.filter((t) => t.status === "failed").length;

  return {
    total,
    completed,
    inProgress,
    pending,
    failed,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    estimatedTimeRemaining: tasks
      .filter((t) => t.status === "pending")
      .reduce((sum, t) => sum + t.estimatedTime, 0),
  };
}

/**
 * Checks if a plan execution is complete
 * @param tasks - Array of tasks
 * @returns True if all tasks are completed or failed
 */
export function isExecutionComplete(tasks: Task[]): boolean {
  return tasks.every(
    (task) => task.status === "completed" || task.status === "failed"
  );
}

/**
 * Gets next executable task in a plan
 * @param tasks - Array of tasks
 * @returns Next task that can be executed, or null if none available
 */
export function getNextExecutableTask(tasks: Task[]): Task | null {
  const pendingTasks = tasks.filter((t) => t.status === "pending");

  for (const task of pendingTasks) {
    if (canExecuteTask(task, tasks)) {
      return task;
    }
  }

  return null;
}
