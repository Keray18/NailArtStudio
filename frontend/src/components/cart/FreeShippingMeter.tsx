"use client";

import React from "react";
import { Sparkles, Truck } from "lucide-react";
import { BRAND_CONFIG } from "@/config/brand";

export interface FreeShippingMeterProps {
  subtotal: number;
}

export const FreeShippingMeter: React.FC<FreeShippingMeterProps> = ({ subtotal }) => {
  const threshold = BRAND_CONFIG.freeShippingThreshold;
  const isEligible = subtotal >= threshold && subtotal > 0;
  const needed = Math.max(0, threshold - subtotal);
  const percentage = Math.min(100, Math.round((subtotal / threshold) * 100));

  return (
    <div className="bg-blush/30 p-3 rounded-lg border border-blush/60 text-xs text-espresso">
      <div className="flex items-center justify-between font-medium mb-1.5">
        {isEligible ? (
          <span className="text-status-success font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-champagne" />
            <span>Complimentary Express Delivery Unlocked!</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-rose" />
            <span>
              Add <strong>₹{needed}</strong> more for Free Shipping
            </span>
          </span>
        )}
        <span className="text-[11px] text-espresso/60 font-semibold">{percentage}%</span>
      </div>

      <div className="w-full h-1.5 bg-white/80 rounded-full overflow-hidden border border-blush/40">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isEligible ? "bg-status-success" : "bg-rose"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

