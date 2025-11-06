/**
 * Main application header component
 */

"use client";

import React from "react";
import { Sparkles, Settings } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700 bg-slate-900/80 backdrop-blur-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Traycer Planning Layer
              </h1>
              <p className="text-sm text-slate-400">
                Orchestrate your coding agents
              </p>
            </div>
          </div>

          {/* Right side - Settings button */}
          <button
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors duration-200"
            aria-label="Settings"
            title="Settings (Coming soon)"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
