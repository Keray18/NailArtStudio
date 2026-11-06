"use client";

import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-espresso uppercase tracking-wider mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-espresso/40">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-white border ${
              error ? "border-status-error" : "border-blush focus:border-rose"
            } rounded-md px-3.5 py-2.5 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:ring-1 ${
              error ? "focus:ring-status-error" : "focus:ring-rose"
            } transition-colors min-h-[44px] ${icon ? "pl-10" : ""} ${className}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="mt-1 text-xs text-status-error font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-espresso/60">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

