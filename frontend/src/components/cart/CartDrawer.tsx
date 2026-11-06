"use client";

import React from "react";
import Link from "next/link";
import { Drawer } from "@/components/ui/Drawer";
import { useCart } from "@/hooks/useCart";
import { CartItemRow } from "./CartItemRow";
import { FreeShippingMeter } from "./FreeShippingMeter";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, ArrowRight, ShieldCheck, Sparkles, Plus } from "lucide-react";
import { FIXTURE_PRODUCTS } from "@/data/fixtures";

export const CartDrawer: React.FC = () => {
  const { items, isCartOpen, closeCart, subtotal, itemCount, addItem } = useCart();

  // Curated in-cart impulse items (Glue tabs and alcohol wipes)
  const impulseTabs = FIXTURE_PRODUCTS.find((p) => p.sku === "FIX-KIT-002");
  const impulseWipes = FIXTURE_PRODUCTS.find((p) => p.sku === "FIX-KIT-003");

  const handleAddImpulse = (product: typeof impulseTabs) => {
    if (product && product.variants[0]) {
      addItem(product, product.variants[0], 1);
    }
  };

  return (
    <Drawer
      isOpen={isCartOpen}
      onClose={closeCart}
      title={`Shopping Bag (${itemCount})`}
      position="right"
    >
      <div className="flex flex-col h-full justify-between -mt-1">
        {/* Top Free Shipping Progress */}
        <div className="pb-4">
          <FreeShippingMeter subtotal={subtotal} />
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

              {/* In-Cart 1-Click Complementary Add-ons */}
              <div className="mt-6 pt-4 border-t border-blush/60 bg-ivory-subtle/40 -mx-5 px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-espresso/70 mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-champagne" />
                  <span>Essential Application Add-ons</span>
                </p>
                <div className="space-y-2">
                  {impulseTabs && (
                    <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-blush/50 text-xs">
                      <div>
                        <p className="font-medium text-espresso">{impulseTabs.name}</p>
                        <p className="text-espresso-muted font-bold">₹{impulseTabs.basePrice}</p>
                      </div>
                      <button
                        onClick={() => handleAddImpulse(impulseTabs)}
                        className="px-2.5 py-1.5 bg-blush/40 hover:bg-rose hover:text-white rounded text-xs font-semibold text-espresso transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  )}

                  {impulseWipes && (
                    <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-blush/50 text-xs">
                      <div>
                        <p className="font-medium text-espresso">{impulseWipes.name}</p>
                        <p className="text-espresso-muted font-bold">₹{impulseWipes.basePrice}</p>
                      </div>
                      <button
                        onClick={() => handleAddImpulse(impulseWipes)}
                        className="px-2.5 py-1.5 bg-blush/40 hover:bg-rose hover:text-white rounded text-xs font-semibold text-espresso transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Order Summary & Checkout Trigger */}
        {items.length > 0 && (
          <div className="pt-4 border-t border-blush/80 bg-ivory mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-espresso/70 font-medium">Subtotal</span>
              <span className="font-serif text-lg font-bold text-espresso">
                ₹{subtotal}
              </span>
            </div>
            <p className="text-[11px] text-espresso/50">
              Delivery fee calculated at checkout &bull; Inclusive of all taxes
            </p>

            <Link href="/checkout" onClick={closeCart} className="block">
              <Button variant="primary" fullWidth size="lg" className="gap-2">
                <span>Proceed to Guest Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-espresso/60 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
              <span>Simulated Prototype Checkout &bull; No Real Charge</span>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

