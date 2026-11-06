"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, Sparkles } from "lucide-react";
import { CartItem } from "@/types";
import { useCart } from "@/hooks/useCart";

export interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const [imageError, setImageError] = useState(false);
  const { updateQuantity, removeItem } = useCart();

  const primaryImg = item.product.images[0]?.url;

  return (
    <div className="flex gap-3.5 py-4 border-b border-blush/60 last:border-b-0">
      {/* Thumbnail */}
      <Link
        href={`/products/${item.product.slug}`}
        className="relative w-16 sm:w-20 aspect-[4/5] bg-ivory-subtle rounded-md overflow-hidden flex-shrink-0 border border-blush/40"
      >
        {primaryImg && !imageError ? (
          <Image
            src={primaryImg}
            alt={item.product.name}
            fill
            sizes="80px"
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blush/20 text-rose/60">
            <Sparkles className="w-5 h-5" />
          </div>
        )}
      </Link>

      {/* Item Information & Controls */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/products/${item.product.slug}`}
              className="font-serif text-sm font-semibold text-espresso hover:text-rose transition-colors line-clamp-1"
            >
              {item.product.name}
            </Link>
            <button
              onClick={() => removeItem(item.id)}
              className="text-espresso/40 hover:text-status-error transition-colors p-1 -mr-1 focus-ring rounded"
              aria-label={`Remove ${item.product.name} from bag`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-espresso-muted mt-0.5">
            {item.variant.title}
          </p>

          <p className="text-xs font-bold text-espresso mt-1">
            ₹{item.unitPrice}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-3">
          <div className="inline-flex items-center border border-blush rounded bg-white">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-1.5 text-espresso/60 hover:text-espresso transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-7 text-center text-xs font-semibold text-espresso">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.variant.stock}
              className="p-1.5 text-espresso/60 hover:text-espresso transition-colors disabled:opacity-30"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <span className="text-xs font-bold text-espresso">
            Total: ₹{item.lineTotal}
          </span>
        </div>
      </div>
    </div>
  );
};

