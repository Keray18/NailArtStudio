"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";

export interface QuantitySelectorProps {
  quantity: number;
  max: number;
  onChange: (quantity: number) => void;
  className?: string;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  max,
  onChange,
  className = "",
}) => {
  const handleDecrement = () => {
    if (quantity > 1) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div
      className={`inline-flex items-center border border-blush rounded-md bg-white overflow-hidden ${className}`}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= 1}
        className="p-2.5 text-espresso/70 hover:text-espresso hover:bg-blush/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-ring"
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-10 text-center font-bold text-sm text-espresso select-none">
        {quantity}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={quantity >= max}
        className="p-2.5 text-espresso/70 hover:text-espresso hover:bg-blush/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-ring"
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

