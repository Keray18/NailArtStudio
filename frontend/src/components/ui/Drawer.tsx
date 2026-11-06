"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: "right" | "bottom";
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = "right",
  className = "",
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`fixed inset-y-0 right-0 max-w-full flex ${
          position === "bottom"
            ? "inset-x-0 bottom-0 top-auto max-h-[85vh] rounded-t-2xl"
            : "w-full sm:w-[440px]"
        }`}
      >
        <div
          className={`w-full bg-ivory shadow-drawer flex flex-col overflow-hidden animate-in ${
            position === "bottom" ? "slide-in-from-bottom" : "slide-in-from-right"
          } duration-300 ${className}`}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-blush/60 flex items-center justify-between bg-ivory-subtle/50">
            {title && (
              <h2 className="text-lg font-serif font-semibold text-espresso">
                {title}
              </h2>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-espresso/60 hover:text-espresso hover:bg-blush/40 transition-colors focus-ring ml-auto"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-5">{children}</div>
        </div>
      </div>
    </div>
  );
};

