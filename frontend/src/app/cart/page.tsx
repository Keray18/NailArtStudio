"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { FreeShippingMeter } from "@/components/cart/FreeShippingMeter";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { PrototypeNoticeBanner } from "@/components/layout/PrototypeNoticeBanner";

export default function CartPage() {
  const { items, subtotal, shippingFee, total, isFreeShippingEligible } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;

    if (couponCode.toUpperCase() === "STUDIO10") {
      const discountVal = Math.round(subtotal * 0.1);
      setDiscount(discountVal);
      setCouponMessage("Prototype Coupon 'STUDIO10' applied (10% Off)");
    } else {
      setDiscount(0);
      setCouponMessage("Invalid code. Try prototype code 'STUDIO10'");
    }
  };

  const finalTotal = Math.max(0, total - discount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PrototypeNoticeBanner className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-6" />

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
            <FreeShippingMeter subtotal={subtotal} />

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
                <span>Items Subtotal</span>
                <span className="font-bold text-espresso">₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-rose font-medium">
                  <span>Coupon Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>
                  {isFreeShippingEligible ? (
                    <span className="text-status-success font-bold">FREE</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-espresso border-t border-blush/60 pt-3">
                <span>Total Amount</span>
                <span className="font-serif text-xl">₹{finalTotal}</span>
              </div>
              <p className="text-[11px] text-espresso/50">Inclusive of all taxes</p>
            </div>

            <Link href="/checkout" className="block pt-2">
              <Button variant="primary" size="lg" fullWidth className="gap-2">
                <span>Proceed to Guest Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-espresso/60 pt-2 border-t border-blush/40">
              <ShieldCheck className="w-4 h-4 text-status-success" />
              <span>Simulated Prototype Checkout &bull; Safe Browsing</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

