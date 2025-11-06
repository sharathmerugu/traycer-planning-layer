/**
 * Zustand store for global state management
 */

import { create } from "zustand";
import { Plan, Task, Agent } from "@/lib/types";
import { AGENTS } from "@/lib/constants";

interface PlanStore {
  // State
  plans: Plan[];
  selectedPlanId: string | null;
  agents: Agent[];

  // Actions
  createPlan: (name: string, description: string) => string;
  updatePlan: (planId: string, updates: Partial<Plan>) => void;
  deletePlan: (planId: string) => void;
  selectPlan: (planId: string | null) => void;
  addTask: (planId: string, task: Task) => void;
  updateTask: (planId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (planId: string, taskId: string) => void;
  executeTask: (planId: string, taskId: string) => Promise<void>;

  // Computed getters
  getSelectedPlan: () => Plan | null;
  getPlanById: (planId: string) => Plan | null;
}

export const usePlanStore = create<PlanStore>((set, get) => ({
  // Initial state
  plans: [],
  selectedPlanId: null,
  agents: AGENTS,

  // Create a new plan
  createPlan: (name: string, description: string) => {
    const newPlan: Plan = {
      id: `plan-${Date.now()}`,
      name,
      description,
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
      plans: [...state.plans, newPlan],
      selectedPlanId: newPlan.id,
    }));

    return newPlan.id;
  },

  // Update an existing plan
  updatePlan: (planId: string, updates: Partial<Plan>) => {
    set((state) => ({
      plans: state.plans.map((plan) =>
        plan.id === planId
          ? { ...plan, ...updates, updatedAt: new Date() }
          : plan
      ),
    }));
  },

  // Delete a plan
  deletePlan: (planId: string) => {
    set((state) => ({
      plans: state.plans.filter((plan) => plan.id !== planId),
      selectedPlanId:
        state.selectedPlanId === planId ? null : state.selectedPlanId,
    }));
  },

  // Select a plan to view/edit
  selectPlan: (planId: string | null) => {
    set({ selectedPlanId: planId });
  },

  // Add a task to a plan
  addTask: (planId: string, task: Task) => {
    set((state) => ({
      plans: state.plans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              tasks: [...plan.tasks, task],
              updatedAt: new Date(),
            }
          : plan
      ),
    }));
  },

  // Update a task in a plan
  updateTask: (planId: string, taskId: string, updates: Partial<Task>) => {
    set((state) => ({
      plans: state.plans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              tasks: plan.tasks.map((task) =>
                task.id === taskId ? { ...task, ...updates } : task
              ),
              updatedAt: new Date(),
            }
          : plan
      ),
    }));
  },

  // Delete a task from a plan
  deleteTask: (planId: string, taskId: string) => {
    set((state) => ({
      plans: state.plans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              tasks: plan.tasks.filter((task) => task.id !== taskId),
              updatedAt: new Date(),
            }
          : plan
      ),
    }));
  },

  // Execute a task (simulated for now)
  executeTask: async (planId: string, taskId: string) => {
    // Mark task as in-progress
    get().updateTask(planId, taskId, { status: "in-progress" });

    // Simulate task execution with delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mark task as completed
    get().updateTask(planId, taskId, { status: "completed" });
  },

  // Get the currently selected plan
  getSelectedPlan: () => {
    const { plans, selectedPlanId } = get();
    return plans.find((plan) => plan.id === selectedPlanId) || null;
  },

  // Get a plan by ID
  getPlanById: (planId: string) => {
    const { plans } = get();
    return plans.find((plan) => plan.id === planId) || null;
  },
}));
