"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { MinimumOrderMeter } from "@/components/cart/MinimumOrderMeter";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, ArrowRight, ShieldCheck, AlertCircle, Info } from "lucide-react";
import { BRAND_CONFIG } from "@/config/brand";

export default function CartPage() {
  const { items, subtotal, isMinOrderMet, amountNeededForMinOrder, minOrderMerchandiseSubtotal } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;

    if (couponCode.toUpperCase() === "STUDIO10") {
      const discountVal = Math.round(subtotal * 0.1);
      setDiscount(discountVal);
      setCouponMessage("Promotional code 'STUDIO10' applied (10% Off)");
    } else {
      setDiscount(0);
      setCouponMessage("Code not applicable to current merchandise.");
    }
  };

  const finalTotal = Math.max(0, subtotal - discount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Shopping Bag" }]} />

      <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-espresso">
        Your Shopping Bag
      </h1>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-blush p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-blush/30 flex items-center justify-center text-rose mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-xl font-semibold text-espresso mb-2">
            Your Bag is Empty
          </h2>
          <p className="text-sm text-espresso/70 mb-6 leading-relaxed">
            Discover our handcrafted press-on sets, luxury gels, and precision tools.
          </p>
          <Link href="/shop">
            <Button variant="primary">Explore Catalogue</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Items List */}
          <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-blush shadow-card space-y-4">
            <MinimumOrderMeter subtotal={subtotal} />

            <div className="divide-y divide-blush/60">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>

            <div className="pt-4 flex justify-between items-center text-xs">
              <Link
                href="/shop"
                className="text-rose hover:text-rose-hover font-semibold uppercase tracking-wider"
              >
                &larr; Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-blush shadow-card space-y-5 sticky top-28">
            <h2 className="font-serif text-xl font-semibold text-espresso border-b border-blush/60 pb-3">
              Order Summary
            </h2>

            {/* Minimum Order Warning Alert if below threshold */}
            {!isMinOrderMet && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Minimum order threshold not met</p>
                  <p className="mt-0.5 text-amber-800/90 leading-tight">
                    Add <strong>₹{amountNeededForMinOrder}</strong> more in merchandise to reach the <strong>₹{minOrderMerchandiseSubtotal}</strong> requirement.
                  </p>
                </div>
              </div>
            )}

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-1.5">
              <label htmlFor="coupon" className="text-xs font-semibold uppercase tracking-wider text-espresso block">
                Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  id="coupon"
                  type="text"
                  placeholder="e.g. STUDIO10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-ivory border border-blush rounded px-3 py-2 text-xs uppercase focus-ring"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-espresso text-white rounded text-xs font-semibold hover:bg-espresso-light transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponMessage && (
                <p className="text-xs text-rose font-medium mt-1">{couponMessage}</p>
              )}
            </form>

            {/* Breakdown */}
            <div className="space-y-2.5 text-xs text-espresso/80 pt-2 border-t border-blush/60">
              <div className="flex justify-between">
                <span>Merchandise Subtotal</span>
                <span className="font-bold text-espresso">₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-rose font-medium">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-xs">
                <span>Delivery charges</span>
                <span className="text-espresso/60 italic">Calculated at checkout</span>
              </div>

              <div className="flex justify-between text-base font-bold text-espresso border-t border-blush/60 pt-3">
                <span>Estimated Subtotal</span>
                <span className="font-serif text-xl">₹{finalTotal}</span>
              </div>
              <p className="text-[11px] text-espresso/50 flex items-center gap-1">
                <Info className="w-3 h-3 text-espresso/40 flex-shrink-0" />
                <span>Delivery charges (₹{BRAND_CONFIG.deliveryRatePerKg}/kg based on parcel weight) added at checkout.</span>
              </p>
            </div>

            {isMinOrderMet ? (
              <Link href="/checkout" className="block pt-2">
                <Button variant="primary" size="lg" fullWidth className="gap-2">
                  <span>Proceed to Guest Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <div className="pt-2">
                <Button variant="primary" size="lg" fullWidth disabled className="gap-2 opacity-60 cursor-not-allowed">
                  <span>Minimum Order ₹{minOrderMerchandiseSubtotal} Required</span>
                </Button>
              </div>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-espresso/60 pt-2 border-t border-blush/40">
              <ShieldCheck className="w-4 h-4 text-status-success" />
              <span>Studio Quality &bull; Direct Fulfillment from Abohar</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
