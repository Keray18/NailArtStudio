"use client";

import React, { useState } from "react";
import { Info, X } from "lucide-react";

export const PrototypeNoticeBanner: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  // Unconditionally suppress in production customer-facing environments unless explicitly enabled
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SHOW_DEV_BANNER !== "true") {
    return null;
  }

  if (isDismissed) {
    return null;
  }

  return (
    <aside
      aria-label="Development environment notice"
      className={`bg-amber-50/90 backdrop-blur-sm border-y border-amber-200/80 px-4 py-2 text-xs text-amber-900 ${className}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-700 flex-shrink-0" aria-hidden="true" />
          <p className="leading-tight">
            <span className="font-semibold">Development Storefront &mdash;</span> Products and stock information are loaded from the development database. Cart and checkout are for testing only. No real orders or payments are processed.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider uppercase bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded">
            Dev Mode
          </span>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss development notice"
            className="p-1 text-amber-700 hover:text-amber-950 rounded hover:bg-amber-100/60 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
};
