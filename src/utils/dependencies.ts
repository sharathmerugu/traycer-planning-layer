/**
 * Dependency management utilities for task execution order
 */

import { Task } from "@/lib/types";

/**
 * Checks if a task can be executed based on its dependencies
 * @param task - Task to check
 * @param allTasks - All tasks in the plan
 * @returns True if task can execute (all dependencies completed)
 */
export function canExecuteTask(task: Task, allTasks: Task[]): boolean {
  // If task has no dependencies, it can execute
  if (!task.dependencies || task.dependencies.length === 0) {
    return true;
  }

  // Check if all dependencies are completed
  const dependencyTasks = allTasks.filter((t) =>
    task.dependencies.includes(t.id)
  );

  // If any dependency task is not found, we can't execute
  if (dependencyTasks.length !== task.dependencies.length) {
    return false;
  }

  // All dependencies must be completed
  return dependencyTasks.every((dep) => dep.status === "completed");
}

/**
 * Performs topological sort to determine task execution order
 * @param tasks - Array of tasks with dependencies
 * @returns Tasks sorted in execution order (dependencies first)
 */
export function getExecutionOrder(tasks: Task[]): Task[] {
  // Create a copy to avoid mutating original array
  const tasksCopy = [...tasks];
  const sorted: Task[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  // Create a map for quick task lookup
  const taskMap = new Map<string, Task>();
  tasksCopy.forEach((task) => taskMap.set(task.id, task));

  /**
   * Depth-first search helper for topological sort
   */
  const visit = (taskId: string): boolean => {
    // Already processed
    if (visited.has(taskId)) {
      return true;
    }

    // Circular dependency detected
    if (visiting.has(taskId)) {
      return false;
    }

    const task = taskMap.get(taskId);
    if (!task) {
      return true; // Skip non-existent tasks
    }

    visiting.add(taskId);

    // Visit all dependencies first
    if (task.dependencies && task.dependencies.length > 0) {
      for (const depId of task.dependencies) {
        if (!visit(depId)) {
          return false; // Circular dependency found
        }
      }
    }

    visiting.delete(taskId);
    visited.add(taskId);
    sorted.push(task);

    return true;
  };

  // Visit all tasks
  for (const task of tasksCopy) {
    if (!visited.has(task.id)) {
      visit(task.id);
    }
  }

  return sorted;
}

/**
 * Validates task dependencies for circular references and invalid IDs
 * @param tasks - Array of tasks to validate
 * @returns Validation result with any error messages
 */
export function validateDependencies(tasks: Task[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const taskIds = new Set(tasks.map((t) => t.id));

  // Build adjacency list for cycle detection
  const graph = new Map<string, string[]>();
  tasks.forEach((task) => {
    graph.set(task.id, task.dependencies || []);
  });

  // Check for non-existent dependency IDs
  tasks.forEach((task) => {
    if (task.dependencies && task.dependencies.length > 0) {
      task.dependencies.forEach((depId) => {
        if (!taskIds.has(depId)) {
          errors.push(
            `Task "${task.title}" (${task.id}) depends on non-existent task: ${depId}`
          );
        }
      });
    }
  });

  // Check for circular dependencies using DFS
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const hasCycle = (taskId: string, path: string[]): boolean => {
    visited.add(taskId);
    recursionStack.add(taskId);

    const dependencies = graph.get(taskId) || [];

    for (const depId of dependencies) {
      if (!visited.has(depId)) {
        if (hasCycle(depId, [...path, taskId])) {
          return true;
        }
      } else if (recursionStack.has(depId)) {
        // Circular dependency found
        const cycle = [...path, taskId, depId];
        const cycleTaskNames = cycle
          .map((id) => {
            const task = tasks.find((t) => t.id === id);
            return task ? `"${task.title}"` : id;
          })
          .join(" → ");
        errors.push(`Circular dependency detected: ${cycleTaskNames}`);
        return true;
      }
    }

    recursionStack.delete(taskId);
    return false;
  };

  // Check each task for cycles
  tasks.forEach((task) => {
    if (!visited.has(task.id)) {
      hasCycle(task.id, []);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Creates a dependency graph as adjacency list
 * @param tasks - Array of tasks
 * @returns Map of task ID to array of tasks that depend on it
 */
export function getDependencyGraph(tasks: Task[]): Map<string, string[]> {
  const graph = new Map<string, string[]>();

  // Initialize all tasks in the graph
  tasks.forEach((task) => {
    if (!graph.has(task.id)) {
      graph.set(task.id, []);
    }
  });

  // Build the reverse dependency graph (who depends on whom)
  tasks.forEach((task) => {
    if (task.dependencies && task.dependencies.length > 0) {
      task.dependencies.forEach((depId) => {
        if (!graph.has(depId)) {
          graph.set(depId, []);
        }
        // depId is a dependency of task.id
        // So task.id depends on depId
        const dependents = graph.get(depId) || [];
        dependents.push(task.id);
        graph.set(depId, dependents);
      });
    }
  });

  return graph;
}

/**
 * Gets all tasks that are ready to execute (no pending dependencies)
 * @param tasks - Array of all tasks
 * @returns Array of tasks ready for execution
 */
export function getReadyTasks(tasks: Task[]): Task[] {
  return tasks.filter(
    (task) => task.status === "pending" && canExecuteTask(task, tasks)
  );
}

/**
 * Gets the dependency chain for a specific task
 * @param taskId - ID of the task
 * @param tasks - Array of all tasks
 * @returns Array of task IDs in dependency order (leaf to root)
 */
export function getDependencyChain(taskId: string, tasks: Task[]): string[] {
  const chain: string[] = [];
  const visited = new Set<string>();

  const traverse = (id: string): void => {
    if (visited.has(id)) {
      return;
    }

    visited.add(id);
    const task = tasks.find((t) => t.id === id);

    if (task && task.dependencies && task.dependencies.length > 0) {
      task.dependencies.forEach((depId) => traverse(depId));
    }

    chain.push(id);
  };

  traverse(taskId);
  return chain;
}
