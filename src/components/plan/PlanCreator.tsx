/**
 * Modal form for creating new plans
 */

"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Sparkles } from "lucide-react";

export interface PlanCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlan: (name: string, description: string) => void;
}

export const PlanCreator: React.FC<PlanCreatorProps> = ({
  isOpen,
  onClose,
  onCreatePlan,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const maxDescriptionLength = 500;
  const descriptionLength = description.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      return;
    }

    setIsGenerating(true);

    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onCreatePlan(name.trim(), description.trim());

    // Reset form
    setName("");
    setDescription("");
    setIsGenerating(false);
    onClose();
  };

  const handleClose = () => {
    if (!isGenerating) {
      setName("");
      setDescription("");
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Plan"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Plan Name */}
        <div>
          <label
            htmlFor="plan-name"
            className="block text-sm font-medium text-white mb-2"
          >
            Plan Name *
          </label>
          <input
            id="plan-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., User Authentication System"
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            disabled={isGenerating}
            required
            maxLength={100}
          />
        </div>

        {/* Plan Description */}
        <div>
          <label
            htmlFor="plan-description"
            className="block text-sm font-medium text-white mb-2"
          >
            Description *
          </label>
          <textarea
            id="plan-description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value.slice(0, maxDescriptionLength))
            }
            placeholder="Describe what you want to build... (e.g., 'Build a user authentication system with email and password login, JWT tokens, and password reset functionality')"
            rows={6}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
            disabled={isGenerating}
            required
            minLength={20}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-slate-500">
              Be specific about technologies, features, and requirements
            </p>
            <p
              className={`text-xs ${
                descriptionLength >= maxDescriptionLength
                  ? "text-red-400"
                  : "text-slate-400"
              }`}
            >
              {descriptionLength} / {maxDescriptionLength}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={<Sparkles className="w-4 h-4" />}
            loading={isGenerating}
            disabled={!name.trim() || !description.trim()}
          >
            {isGenerating ? "Generating Plan..." : "Generate Plan"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
