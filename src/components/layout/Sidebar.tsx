/**
 * Sidebar component with plans list and agent status
 */

"use client";

import React from "react";
import { Plus, Folder } from "lucide-react";
import { Plan, Agent } from "@/lib/types";
import { PlanCard } from "@/components/plan/PlanCard";

export interface SidebarProps {
  plans: Plan[];
  selectedPlanId: string | null;
  onSelectPlan: (planId: string) => void;
  onCreatePlan: () => void;
  agents: Agent[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  plans,
  selectedPlanId,
  onSelectPlan,
  onCreatePlan,
  agents,
}) => {
  return (
    <aside className="w-80 h-full border-r border-slate-700 bg-slate-900/50 backdrop-blur-sm flex flex-col">
      {/* Plans Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Plans</h2>
            <button
              onClick={onCreatePlan}
              className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors duration-200"
              aria-label="Create new plan"
              title="Create new plan (Cmd/Ctrl+N)"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Plans List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Folder className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm">No plans yet</p>
              <p className="text-slate-500 text-xs mt-1">
                Click + to create your first plan
              </p>
            </div>
          ) : (
            plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isSelected={plan.id === selectedPlanId}
                onClick={() => onSelectPlan(plan.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Available Agents Section */}
      <div className="p-4 border-t border-slate-700 bg-slate-800/30">
        <h3 className="text-sm font-semibold text-white mb-3">
          Available Agents
        </h3>
        <div className="space-y-2">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 border border-slate-700"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: agent.color,
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">
                  {agent.name}
                </p>
                <p className="text-xs text-slate-400">
                  {agent.status === "available" ? "Available" : "Busy"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
