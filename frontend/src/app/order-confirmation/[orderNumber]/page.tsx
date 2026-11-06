"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Download, MessageCircle, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BRAND_CONFIG } from "@/config/brand";
import { OrderConfirmationData } from "@/types";

function OrderConfirmationContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderNumber = params?.orderNumber as string;
  const token = searchParams.get("token");

  const [order, setOrder] = useState<OrderConfirmationData | null>(null);

  useEffect(() => {
    if (orderNumber) {
      try {
        const stored = sessionStorage.getItem(`tnl_order_${orderNumber}`);
        if (stored) {
          setOrder(JSON.parse(stored));
        }
      } catch {
        // quota
      }
    }
  }, [orderNumber]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Explicit Prototype Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-950 text-sm">
            Simulated Prototype Confirmation
          </p>
          <p className="mt-0.5 text-amber-800 leading-relaxed">
            This is an interactive design prototype demonstration. No monetary charge has been incurred, and no physical order has been dispatched to warehouse fulfillment.
          </p>
        </div>
      </div>

      {/* Confirmation Header Card */}
      <div className="bg-white rounded-2xl border border-blush p-6 sm:p-10 text-center shadow-card space-y-4">
        <div className="w-16 h-16 rounded-full bg-status-success/10 text-status-success flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-espresso">
          Simulated Order Received
        </h1>

        <p className="text-sm text-espresso/70 max-w-md mx-auto leading-relaxed">
          Thank you for testing the storefront prototype. Your simulated order details have been recorded.
        </p>

        <div className="inline-flex items-center gap-2 bg-ivory-subtle px-4 py-2 rounded-lg border border-blush text-sm font-mono text-espresso font-semibold">
          <span>Order Reference:</span>
          <span className="text-rose">{orderNumber}</span>
        </div>
      </div>

      {/* Order Details Breakdown (if found in session) */}
      {order && (
        <div className="bg-white rounded-xl border border-blush p-6 shadow-card space-y-6">
          <h2 className="font-serif text-xl font-semibold text-espresso border-b border-blush/60 pb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-rose" />
            <span>Simulated Receipt Summary</span>
          </h2>

          {/* Delivery Address & Customer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-espresso/80">
            <div>
              <p className="font-semibold uppercase tracking-wider text-espresso/50 mb-1">
                Recipient
              </p>
              <p className="font-bold text-espresso text-sm">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.email}</p>
            </div>
            <div>
              <p className="font-semibold uppercase tracking-wider text-espresso/50 mb-1">
                Delivery Destination
              </p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
              </p>
              <p className="text-espresso-muted mt-1 font-semibold">{order.estimatedDeliveryWindow}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border-t border-blush/60 pt-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-espresso/50 mb-2">
              Items Ordered
            </p>
            <div className="divide-y divide-blush/40">
              {order.items.map((item) => (
                <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-espresso">{item.product.name}</span>
                    <span className="text-espresso/60 block">{item.variant.title} &bull; Qty: {item.quantity}</span>
                  </div>
                  <span className="font-bold text-espresso">₹{item.lineTotal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-blush/60 pt-4 space-y-1.5 text-xs text-espresso/80">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-espresso">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee}`}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-espresso pt-2 border-t border-blush/40">
              <span>Total Simulated Amount</span>
              <span className="font-serif text-lg text-rose">₹{order.total}</span>
            </div>
            <div className="flex justify-between text-xs text-espresso/60 pt-1">
              <span>Payment Type:</span>
              <span className="capitalize">{order.paymentMethod === "COD" ? "Cash on Delivery" : "Online UPI (Simulated)"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Post-Purchase Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/how-to-apply" className="block">
          <Button variant="outline" fullWidth size="md" className="gap-2">
            <Download className="w-4 h-4 text-rose" />
            <span>Download Care &amp; Prep Guide</span>
          </Button>
        </Link>

        <a
          href={BRAND_CONFIG.socialHandles.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button variant="secondary" fullWidth size="md" className="gap-2">
            <MessageCircle className="w-4 h-4 text-rose" />
            <span>WhatsApp Studio Concierge</span>
          </Button>
        </a>
      </div>

      <div className="text-center pt-4">
        <Link href="/shop">
          <Button variant="primary" size="lg" className="gap-2">
            <span>Explore More Handcrafted Sets</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-espresso/50">Loading Receipt...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
