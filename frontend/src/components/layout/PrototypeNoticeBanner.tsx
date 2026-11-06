import React from "react";
import { Info } from "lucide-react";

export const PrototypeNoticeBanner: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`bg-amber-50 border-y border-amber-200/80 px-4 py-2.5 text-xs text-amber-900 ${className}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>
            <strong>Phase 1 Visual Prototype:</strong> All catalogue data, inventory, and checkout actions are simulated fixtures. No real orders or payments will be executed.
          </span>
        </div>
        <span className="hidden md:inline-block text-[11px] font-semibold tracking-wider uppercase bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded">
          Preview Mode
        </span>
      </div>
    </div>
  );
};

