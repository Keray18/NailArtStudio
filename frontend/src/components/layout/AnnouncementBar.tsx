import React from "react";
import { Sparkles, Truck } from "lucide-react";
import { BRAND_CONFIG } from "@/config/brand";

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-espresso text-ivory text-xs py-2 px-4 border-b border-espresso-light">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-xs">
        <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
          <Truck className="w-3.5 h-3.5 text-champagne" />
          <span>
            Complimentary shipping on orders above ₹{BRAND_CONFIG.freeShippingThreshold} (Illustrative)
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-ivory/80">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-champagne" />
            Designed & Dispatched from {BRAND_CONFIG.location}
          </span>
        </div>
      </div>
    </div>
  );
};

