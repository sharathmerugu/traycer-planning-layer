/**
 * Main application page - Traycer Planning Layer
 */

"use client";

import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

// Store
import { usePlanStore } from "@/store/usePlanStore";

// Layout components
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

// Plan components
import { PlanCreator } from "@/components/plan/PlanCreator";
import { PlanHeader } from "@/components/plan/PlanHeader";

// Task components
import { TaskList } from "@/components/task/TaskList";
import { TaskForm } from "@/components/task/TaskForm";

// UI components
import { Button } from "@/components/ui/Button";

// Utilities
import {
  generateTasksFromDescription,
  assignAgentToTask,
} from "@/lib/planGenerator";
import { Task } from "@/lib/types";

export default function HomePage() {
  // Global state from store
  const {
    plans,
    selectedPlanId,
    agents,
    createPlan,
    selectPlan,
    addTask,
    updateTask,
    deleteTask,
    getSelectedPlan,
  } = usePlanStore();

  // Local state
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const shouldStopExecution = React.useRef(false);

  // Get selected plan
  const selectedPlan = getSelectedPlan();

  // Initialize demo data on first mount
  useEffect(() => {
    // Only create demo if no plans exist
    if (plans.length === 0) {
      createDemoPlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Creates an impressive demo plan with realistic tasks
   */
  const createDemoPlan = () => {
    const planId = createPlan(
      "Build Real-time Collaboration Dashboard",
      "Create a collaborative dashboard with live updates, user presence, and data visualization using WebSocket connections and React"
    );

    // Create tasks with proper structure
    const baseTime = Date.now();

    const task1: Task = {
      id: `task-${baseTime}-1`,
      title: "Analyze requirements and existing codebase",
      description:
        "Conduct thorough analysis of project requirements, review current architecture patterns, and identify optimal integration points for real-time collaborative features",
      status: "completed",
      type: "analysis",
      dependencies: [],
      estimatedTime: 12,
      files: [
        "REQUIREMENTS.md",
        "src/app/layout.tsx",
        "docs/architecture.md",
        "package.json",
      ],
      agent: "cursor",
      createdAt: new Date(),
    };

    const task2: Task = {
      id: `task-${baseTime}-2`,
      title: "Design WebSocket architecture and data flow",
      description:
        "Design scalable WebSocket connection strategy, define event protocols, plan state synchronization patterns, and document API specifications",
      status: "completed",
      type: "analysis",
      dependencies: [task1.id],
      estimatedTime: 18,
      files: [
        "docs/websocket-architecture.md",
        "docs/event-protocols.md",
        "src/lib/websocket/types.ts",
        "src/lib/websocket/constants.ts",
      ],
      agent: "cursor",
      createdAt: new Date(),
    };

    const task3: Task = {
      id: `task-${baseTime}-3`,
      title: "Implement real-time WebSocket connection handler",
      description:
        "Build robust WebSocket connection manager with automatic reconnection, exponential backoff, event emitter pattern, and comprehensive connection state management",
      status: "pending",
      type: "implementation",
      dependencies: [task2.id],
      estimatedTime: 35,
      files: [
        "src/lib/websocket/WebSocketManager.ts",
        "src/lib/websocket/ConnectionHandler.ts",
        "src/lib/websocket/EventEmitter.ts",
        "src/hooks/useWebSocket.ts",
        "src/hooks/useRealtimeConnection.ts",
      ],
      agent: "copilot",
      createdAt: new Date(),
    };

    const task4: Task = {
      id: `task-${baseTime}-4`,
      title: "Build interactive data visualization dashboard",
      description:
        "Create responsive, interactive charts and graphs using Recharts library. Implement real-time data streaming, smooth animations, and customizable data views for analytics dashboard",
      status: "pending",
      type: "implementation",
      dependencies: [task1.id],
      estimatedTime: 42,
      files: [
        "src/components/charts/RealtimeLineChart.tsx",
        "src/components/charts/ActivityBarChart.tsx",
        "src/components/charts/UserMetricsPie.tsx",
        "src/components/dashboard/AnalyticsDashboard.tsx",
        "src/components/dashboard/DataPanel.tsx",
        "src/lib/chart-utils.ts",
      ],
      agent: "copilot",
      createdAt: new Date(),
    };

    const task5: Task = {
      id: `task-${baseTime}-5`,
      title: "Implement collaborative user presence system",
      description:
        "Build comprehensive user presence tracking with online/offline status, real-time cursor positions, active user indicators, and typing awareness notifications",
      status: "pending",
      type: "implementation",
      dependencies: [task3.id],
      estimatedTime: 28,
      files: [
        "src/lib/presence/PresenceTracker.ts",
        "src/lib/presence/CursorSync.ts",
        "src/components/presence/UserAvatar.tsx",
        "src/components/presence/ActiveUsersList.tsx",
        "src/components/presence/CursorOverlay.tsx",
        "src/hooks/usePresence.ts",
      ],
      agent: "codeium",
      createdAt: new Date(),
    };

    const task6: Task = {
      id: `task-${baseTime}-6`,
      title: "Write comprehensive integration and E2E tests",
      description:
        "Develop full test suite covering WebSocket connections, real-time data synchronization, presence tracking, UI state updates, and error recovery scenarios",
      status: "pending",
      type: "testing",
      dependencies: [task3.id, task4.id, task5.id],
      estimatedTime: 38,
      files: [
        "src/__tests__/websocket/connection.test.ts",
        "src/__tests__/websocket/events.test.ts",
        "src/__tests__/integration/realtime-sync.test.tsx",
        "src/__tests__/integration/presence-tracking.test.tsx",
        "src/__tests__/e2e/dashboard.test.ts",
        "src/__tests__/utils/test-helpers.ts",
      ],
      agent: "codeium",
      createdAt: new Date(),
    };

    const task7: Task = {
      id: `task-${baseTime}-7`,
      title: "Optimize rendering performance and bundle size",
      description:
        "Implement React.memo for expensive components, add useMemo/useCallback hooks, implement virtual scrolling for large data sets, and optimize chart re-renders",
      status: "pending",
      type: "refactor",
      dependencies: [task4.id, task5.id],
      estimatedTime: 22,
      files: [
        "src/components/charts/RealtimeLineChart.tsx",
        "src/components/dashboard/AnalyticsDashboard.tsx",
        "src/components/presence/ActiveUsersList.tsx",
        "src/hooks/useOptimizedWebSocket.ts",
        "src/hooks/useDebouncedCallback.ts",
      ],
      agent: "windsurf",
      createdAt: new Date(),
    };

    // Add all tasks to the plan
    [task1, task2, task3, task4, task5, task6, task7].forEach((task) => {
      addTask(planId, task);
    });

    // Select the newly created plan
    selectPlan(planId);
  };

  /**
   * Handles plan creation with AI-generated tasks
   */
  const handleCreatePlan = (name: string, description: string) => {
    // Create the plan
    const planId = createPlan(name, description);

    // Generate tasks from description
    const generatedTasks = generateTasksFromDescription(description);

    // Assign agents to tasks and add them to the plan
    generatedTasks.forEach((task) => {
      const agentId = assignAgentToTask(task, agents);
      const taskWithAgent: Task = {
        ...task,
        agent: agentId,
      };
      addTask(planId, taskWithAgent);
    });

    // Select the newly created plan
    selectPlan(planId);
    setIsCreatingPlan(false);
  };

  /**
   * Executes a single task
   */
  const handleExecuteTask = async (taskId: string) => {
    if (!selectedPlanId) return;

    try {
      // Update to in-progress
      updateTask(selectedPlanId, taskId, { status: "in-progress" });

      // Simulate task execution
      const task = selectedPlan?.tasks.find((t) => t.id === taskId);
      if (task) {
        const executionTime = Math.min(task.estimatedTime * 100, 4000);
        await new Promise((resolve) => setTimeout(resolve, executionTime));

        // 10% chance of failure for demo
        const success = Math.random() > 0.1;

        updateTask(selectedPlanId, taskId, {
          status: success ? "completed" : "failed",
        });
      }
    } catch {
      // Handle execution errors gracefully
      updateTask(selectedPlanId, taskId, { status: "failed" });
    }
  };

  /**
   * Executes all tasks in sequence
   */
  const handleExecuteAll = async () => {
    if (!selectedPlan || isExecuting) return;

    // Check if there are any pending tasks
    const pendingTasks = selectedPlan.tasks.filter(
      (t) => t.status === "pending"
    );

    if (pendingTasks.length === 0) {
      return; // No tasks to execute
    }

    shouldStopExecution.current = false;
    setIsExecuting(true);

    try {
      // Execute tasks sequentially
      for (const task of pendingTasks) {
        // Stop if user paused
        if (shouldStopExecution.current) break;

        await handleExecuteTask(task.id);
      }
    } finally {
      setIsExecuting(false);
      shouldStopExecution.current = false;
    }
  };

  /**
   * Pauses execution
   */
  const handlePause = () => {
    shouldStopExecution.current = true;
    setIsExecuting(false);
  };

  /**
   * Handles task deletion
   */
  const handleDeleteTask = (taskId: string) => {
    if (!selectedPlanId || !selectedPlan) return;

    // Check if other tasks depend on this one
    const dependentTasks = selectedPlan.tasks.filter((t) =>
      t.dependencies.includes(taskId)
    );

    if (dependentTasks.length > 0) {
      const taskNames = dependentTasks.map((t) => `"${t.title}"`).join(", ");
      const confirmed = window.confirm(
        `Warning: ${dependentTasks.length} task(s) depend on this task:\n${taskNames}\n\nDelete anyway? Dependencies will be removed from these tasks.`
      );
      if (!confirmed) return;

      // Remove this task from dependencies of other tasks
      dependentTasks.forEach((depTask) => {
        const newDeps = depTask.dependencies.filter((d) => d !== taskId);
        updateTask(selectedPlanId, depTask.id, { dependencies: newDeps });
      });
    }

    deleteTask(selectedPlanId, taskId);
  };

  /**
   * Handles adding a manual task
   */
  const handleAddTask = (taskData: Partial<Task>) => {
    if (!selectedPlanId) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskData.title || "",
      description: taskData.description || "",
      status: "pending",
      type: taskData.type || "implementation",
      dependencies: taskData.dependencies || [],
      estimatedTime: taskData.estimatedTime || 30,
      files: taskData.files || [],
      agent: assignAgentToTask(taskData as Task, agents),
      createdAt: new Date(),
    };

    addTask(selectedPlanId, newTask);
    setShowTaskForm(false);
  };

  /**
   * Keyboard shortcuts
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + N: Create new plan
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        setIsCreatingPlan(true);
      }

      // Cmd/Ctrl + E: Execute all tasks
      if ((e.metaKey || e.ctrlKey) && e.key === "e") {
        e.preventDefault();
        if (selectedPlan && !isExecuting) {
          handleExecuteAll();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlan, isExecuting]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <Header />

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <Sidebar
          plans={plans}
          selectedPlanId={selectedPlanId}
          onSelectPlan={selectPlan}
          onCreatePlan={() => setIsCreatingPlan(true)}
          agents={agents}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 max-w-6xl">
            {selectedPlan ? (
              <div className="space-y-6">
                {/* Plan Header */}
                <PlanHeader
                  plan={selectedPlan}
                  onExecuteAll={handleExecuteAll}
                  onPause={handlePause}
                  isExecuting={isExecuting}
                />

                {/* Add Task Button */}
                <div className="flex justify-end">
                  <Button
                    variant="secondary"
                    onClick={() => setShowTaskForm(true)}
                  >
                    Add Task Manually
                  </Button>
                </div>

                {/* Task List */}
                <TaskList
                  tasks={selectedPlan.tasks}
                  agents={agents}
                  onExecuteTask={handleExecuteTask}
                  onDeleteTask={handleDeleteTask}
                />
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-6">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">
                  No Plan Selected
                </h2>
                <p className="text-slate-400 mb-8 max-w-md">
                  Create a new plan to start orchestrating your coding agents.
                  Describe what you want to build, and we&apos;ll generate a
                  structured execution plan.
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Sparkles className="w-5 h-5" />}
                  onClick={() => setIsCreatingPlan(true)}
                >
                  Create Your First Plan
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <PlanCreator
        isOpen={isCreatingPlan}
        onClose={() => setIsCreatingPlan(false)}
        onCreatePlan={handleCreatePlan}
      />

      <TaskForm
        isOpen={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        onSubmit={handleAddTask}
        availableTasks={selectedPlan?.tasks || []}
      />
    </div>
  );
}
