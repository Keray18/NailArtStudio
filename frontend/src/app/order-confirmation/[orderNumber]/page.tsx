"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  QrCode,
  Copy,
  Check,
  MessageCircle,
  ArrowRight,
  Package,
  AlertCircle,
  PhoneCall,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BRAND_CONFIG } from "@/config/brand";
import { orderService, OrderDTO } from "@/services/orderService";

function OrderConfirmationContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderNumber = params?.orderNumber as string;
  const token = searchParams.get("token") || "";

  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UTR submission state
  const [utrInput, setUtrInput] = useState("");
  const [utrSubmitting, setUtrSubmitting] = useState(false);
  const [utrSuccess, setUtrSuccess] = useState(false);
  const [utrError, setUtrError] = useState<string | null>(null);
  const [copiedVpa, setCopiedVpa] = useState(false);

  useEffect(() => {
    if (orderNumber && token) {
      setLoading(true);
      orderService
        .getOrderByNumber(orderNumber, token)
        .then((data) => {
          setOrder(data);
          if (data.paymentReference) {
            setUtrInput(data.paymentReference);
          }
        })
        .catch((err: any) => {
          setError(err.message || "Unable to locate order details with the provided security token.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError("Missing order number or security access token.");
    }
  }, [orderNumber, token]);

  const handleCopyVpa = (vpa: string) => {
    navigator.clipboard.writeText(vpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleUtrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrInput.trim()) {
      setUtrError("Please enter your 12-digit transaction UTR / Reference number.");
      return;
    }

    setUtrSubmitting(true);
    setUtrError(null);

    try {
      const updated = await orderService.submitUtr(orderNumber, token, utrInput.trim());
      setOrder(updated);
      setUtrSuccess(true);
    } catch (err: any) {
      setUtrError(err.message || "Failed to submit UTR reference. Please try again.");
    } finally {
      setUtrSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-rose border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-espresso/70">Loading verified order records...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-2xl font-semibold text-espresso">Order Not Found</h1>
        <p className="text-sm text-espresso/70 leading-relaxed">
          {error || "We could not find an order matching this reference and access key."}
        </p>
        <div className="pt-2">
          <Link href="/shop">
            <Button variant="primary">Return to Store</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isUtrSubmitted = order.verificationStatus === "UTR_SUBMITTED" || utrSuccess;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header Confirmation Card */}
      <div className="bg-white rounded-2xl border border-blush p-6 sm:p-10 text-center shadow-card space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-espresso">
          Order Placed Successfully
        </h1>

        <p className="text-sm text-espresso/70 max-w-md mx-auto leading-relaxed">
          Thank you, <strong>{order.customer.fullName}</strong>. Your order has been recorded in our Abohar studio system.
        </p>

        <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-ivory-subtle px-4 py-2 rounded-lg border border-blush text-sm font-mono text-espresso font-semibold">
          <span>Order Number:</span>
          <span className="text-rose font-bold">{order.orderNumber}</span>
        </div>
      </div>

      {/* Payment Instruction Section */}
      {order.paymentMethod === "UPI_MANUAL" ? (
        <div className="bg-white rounded-2xl border border-blush p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-blush/60 pb-3">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-rose" />
              <h2 className="font-serif text-xl font-semibold text-espresso">
                Manual UPI Payment &amp; UTR Verification
              </h2>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              order.paymentStatus === "PAID"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-amber-100 text-amber-900"
            }`}>
              {order.paymentStatus === "PAID" ? "Payment Confirmed" : "Verification Pending"}
            </span>
          </div>

          {/* If already submitted */}
          {isUtrSubmitted ? (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-emerald-800 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>UTR Reference Submitted for Verification</span>
              </div>
              <p className="leading-relaxed">
                We have recorded your UTR / transaction claim: <strong className="font-mono text-espresso">{order.paymentReference || utrInput}</strong>.
              </p>
              <p className="text-emerald-900/80 leading-relaxed">
                Our Abohar studio will reconcile this transaction against our merchant account statement. Once verified, your order status will be updated to Confirmed and prepared for dispatch.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="p-4 bg-ivory-subtle rounded-xl border border-blush/60 space-y-3">
                <p className="text-xs font-semibold text-espresso uppercase tracking-wider">
                  Step 1: Pay ₹{order.totalAmount} to Studio UPI
                </p>

                {order.paymentDetails?.upiVpa && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-lg border border-blush gap-2 text-xs">
                    <div>
                      <span className="text-espresso/60 block text-[11px]">Merchant UPI VPA:</span>
                      <span className="font-mono font-bold text-sm text-espresso">
                        {order.paymentDetails.upiVpa}
                      </span>
                      {order.paymentDetails.merchantName && (
                        <span className="text-espresso/60 block text-[11px]">
                          Name: {order.paymentDetails.merchantName}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleCopyVpa(order.paymentDetails!.upiVpa!)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blush/50 hover:bg-blush text-espresso rounded font-semibold transition-colors self-start sm:self-center"
                    >
                      {copiedVpa ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedVpa ? "Copied!" : "Copy VPA"}</span>
                    </button>
                  </div>
                )}

                {order.paymentDetails?.dynamicUpiUri && (
                  <div className="pt-1">
                    <a
                      href={order.paymentDetails.dynamicUpiUri}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-espresso text-white rounded-lg text-xs font-semibold hover:bg-espresso-light transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in UPI App (GPay / PhonePe / Paytm)</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Step 2: UTR Submission Form */}
              <form onSubmit={handleUtrSubmit} className="space-y-3 pt-2">
                <div>
                  <label htmlFor="utr" className="block text-xs font-semibold uppercase tracking-wider text-espresso mb-1">
                    Step 2: Enter 12-Digit Transaction UTR Number *
                  </label>
                  <p className="text-[11px] text-espresso/60 mb-2">
                    Found in your bank receipt, Google Pay, PhonePe, or Paytm payment details.
                  </p>
                  <div className="flex gap-2">
                    <input
                      id="utr"
                      type="text"
                      placeholder="e.g. 429381920194"
                      value={utrInput}
                      onChange={(e) => setUtrInput(e.target.value)}
                      className="flex-1 bg-ivory border border-blush rounded px-3 py-2 text-xs font-mono uppercase focus-ring"
                    />
                    <Button type="submit" variant="primary" size="sm" isLoading={utrSubmitting}>
                      Submit UTR
                    </Button>
                  </div>
                  {utrError && <p className="text-xs text-rose mt-1 font-medium">{utrError}</p>}
                </div>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-blush p-6 sm:p-8 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-blush/60 pb-3">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-rose" />
              <h2 className="font-serif text-xl font-semibold text-espresso">
                Cash on Delivery &bull; Verification Notice
              </h2>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-900">
              Phone Verification Required
            </span>
          </div>

          <p className="text-xs sm:text-sm text-espresso/80 leading-relaxed">
            Your Cash on Delivery order is queued. To prevent bogus shipments, our studio representative will call you on <strong>{order.customer.phone}</strong> to confirm your address prior to parcel packaging.
          </p>

          <p className="text-xs text-espresso/70 font-medium">
            Total amount payable in cash or UPI upon delivery: <strong className="text-espresso font-serif text-base">₹{order.totalAmount}</strong>.
          </p>
        </div>
      )}

      {/* Persistent Order Details */}
      <div className="bg-white rounded-xl border border-blush p-6 shadow-card space-y-6">
        <h2 className="font-serif text-xl font-semibold text-espresso border-b border-blush/60 pb-3 flex items-center gap-2">
          <Package className="w-5 h-5 text-rose" />
          <span>Order Details</span>
        </h2>

        {/* Delivery Address & Customer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-espresso/80">
          <div>
            <p className="font-semibold uppercase tracking-wider text-espresso/50 mb-1">
              Customer Details
            </p>
            <p className="font-bold text-espresso text-sm">{order.customer.fullName}</p>
            <p>{order.customer.phone}</p>
            <p>{order.customer.email}</p>
          </div>
          <div>
            <p className="font-semibold uppercase tracking-wider text-espresso/50 mb-1">
              Shipping Destination
            </p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
            </p>
          </div>
        </div>

        {/* Items List */}
        <div className="border-t border-blush/60 pt-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-espresso/50 mb-2">
            Items Ordered
          </p>
          <div className="divide-y divide-blush/40">
            {order.items.map((item) => (
              <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                <div>
                  <span className="font-semibold text-espresso">{item.productTitle}</span>
                  <span className="text-espresso/60 block">
                    {item.variantTitle} &bull; Qty: {item.quantity} &bull; Unit: ₹{item.unitPrice}
                  </span>
                </div>
                <span className="font-bold text-espresso">₹{item.lineTotal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Totals */}
        <div className="border-t border-blush/60 pt-4 space-y-2 text-xs text-espresso/80">
          <div className="flex justify-between">
            <span>Merchandise Subtotal</span>
            <span className="font-semibold text-espresso">₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span>Delivery charges</span>
              <span className="block text-[10.5px] text-espresso/50">
                Parcel Weight: {order.totalWeightGrams}g (inc. {order.packagingWeightGrams}g packaging)
              </span>
            </div>
            <span className="font-semibold text-espresso">₹{order.deliveryCharge}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-espresso pt-2 border-t border-blush/40">
            <span>Total Amount</span>
            <span className="font-serif text-lg text-rose">₹{order.totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Post-Purchase Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/how-to-apply" className="block">
          <Button variant="outline" fullWidth size="md" className="gap-2">
            <span>Application &amp; Care Guide</span>
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

      <div className="text-center pt-2">
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
