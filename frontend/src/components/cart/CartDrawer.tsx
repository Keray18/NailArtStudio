"use client";

import React from "react";
import Link from "next/link";
import { Drawer } from "@/components/ui/Drawer";
import { useCart } from "@/hooks/useCart";
import { CartItemRow } from "./CartItemRow";
import { MinimumOrderMeter } from "./MinimumOrderMeter";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { BRAND_CONFIG } from "@/config/brand";

export const CartDrawer: React.FC = () => {
  const { items, isCartOpen, closeCart, subtotal, itemCount, isMinOrderMet, amountNeededForMinOrder } = useCart();

  return (
    <Drawer
      isOpen={isCartOpen}
      onClose={closeCart}
      title={`Shopping Bag (${itemCount})`}
      position="right"
    >
      <div className="flex flex-col h-full justify-between -mt-1">
        {/* Top Minimum Order Progress */}
        <div className="pb-4">
          <MinimumOrderMeter subtotal={subtotal} />
        </div>

        {/* Middle: Items List or Empty State */}
        <div className="flex-1 overflow-y-auto pr-1">
          {items.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-blush/30 flex items-center justify-center text-rose mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-espresso mb-1">
                Your Shopping Bag is Empty
              </h3>
              <p className="text-xs text-espresso/60 max-w-xs mb-6">
                Discover our handcrafted press-on sets, gel systems, and application kits.
              </p>
              <Link href="/shop" onClick={closeCart}>
                <Button variant="primary" size="sm">
                  Explore Catalogue
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="divide-y divide-blush/60">
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Order Summary & Checkout Trigger */}
        {items.length > 0 && (
          <div className="pt-4 border-t border-blush/80 bg-ivory mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-espresso/70 font-medium">Merchandise Subtotal</span>
              <span className="font-serif text-lg font-bold text-espresso">
                ₹{subtotal}
              </span>
            </div>
            <p className="text-[11px] text-espresso/50">
              Delivery charges calculated at checkout (₹{BRAND_CONFIG.deliveryRatePerKg}/kg) &bull; Inclusive of all taxes
            </p>

            {isMinOrderMet ? (
              <Link href="/checkout" onClick={closeCart} className="block">
                <Button variant="primary" fullWidth size="lg" className="gap-2">
                  <span>Proceed to Guest Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <div>
                <Button variant="primary" fullWidth size="lg" disabled className="gap-2 opacity-60 cursor-not-allowed">
                  <span>Add ₹{amountNeededForMinOrder} More to Checkout</span>
                </Button>
                <p className="mt-1.5 text-center text-[11px] text-amber-800 flex items-center justify-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>Minimum merchandise order is ₹{BRAND_CONFIG.minOrderMerchandiseSubtotal}</span>
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-espresso/60 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
              <span>Secure Guest Checkout &bull; Direct Studio Dispatch</span>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};
