"use client";

import React from "react";
import { Product, ProductVariant } from "@/types";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export interface StickyMobileCTAProps {
  product: Product;
  selectedVariant: ProductVariant;
  onAddToCart: () => void;
  isAvailable: boolean;
}

export const StickyMobileCTA: React.FC<StickyMobileCTAProps> = ({
  product,
  selectedVariant,
  onAddToCart,
  isAvailable,
}) => {
  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 bg-ivory/95 backdrop-blur-md border-t border-blush p-3 z-30 shadow-sheet safe-bottom-padding">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex-1 min-w-0">
          <p className="font-serif text-xs font-semibold text-espresso truncate">
            {product.name}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-espresso">
              ₹{selectedVariant.price}
            </span>
            <span className="text-[10px] text-espresso/60 truncate">
              {selectedVariant.title}
            </span>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          disabled={!isAvailable}
          onClick={onAddToCart}
          className="px-5 py-2.5 flex-shrink-0"
        >
          {isAvailable ? (
            <span className="flex items-center gap-1">
              <Plus className="w-4 h-4" />
              <span>Add to Bag</span>
            </span>
          ) : (
            "Sold Out"
          )}
        </Button>
      </div>
    </div>
  );
};

