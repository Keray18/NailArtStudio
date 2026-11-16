"use client";

import React from "react";
import { CheckCircle2, ShoppingBag, Info } from "lucide-react";
import { BRAND_CONFIG } from "@/config/brand";

export interface MinimumOrderMeterProps {
  subtotal: number;
}

export const MinimumOrderMeter: React.FC<MinimumOrderMeterProps> = ({ subtotal }) => {
  const minRequired = BRAND_CONFIG.minOrderMerchandiseSubtotal;
  const isMet = subtotal >= minRequired;
  const needed = Math.max(0, minRequired - subtotal);
  const percentage = Math.min(100, Math.round((subtotal / minRequired) * 100));

  return (
    <div className={`p-3 rounded-lg border text-xs transition-colors ${
      isMet ? "bg-emerald-50/70 border-emerald-200 text-emerald-950" : "bg-amber-50/70 border-amber-200 text-espresso"
    }`}>
      <div className="flex items-center justify-between font-medium mb-1.5">
        {isMet ? (
          <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Minimum order requirement (₹{minRequired}) met!</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-amber-900 font-medium">
            <ShoppingBag className="w-4 h-4 text-amber-700" />
            <span>
              Add <strong>₹{needed}</strong> more to reach the <strong>₹{minRequired}</strong> minimum order
            </span>
          </span>
        )}
        <span className="text-[11px] font-semibold opacity-75">{percentage}%</span>
      </div>

      <div className="w-full h-1.5 bg-white/90 rounded-full overflow-hidden border border-black/5">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isMet ? "bg-emerald-600" : "bg-amber-600"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-2 text-[10.5px] leading-tight text-espresso/70 flex items-center gap-1">
        <Info className="w-3 h-3 flex-shrink-0 text-espresso/50" />
        <span>Delivery charges (₹{BRAND_CONFIG.deliveryRatePerKg}/kg) are calculated separately and do not count toward the ₹{minRequired} merchandise minimum.</span>
      </p>
    </div>
  );
};

