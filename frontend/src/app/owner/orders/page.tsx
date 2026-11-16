"use client";

import React, { useState, useEffect } from "react";
import { orderService, OrderDTO } from "@/services/orderService";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  ShieldAlert,
  Lock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Package,
  Phone,
  Mail,
  MapPin,
  FileText,
} from "lucide-react";

export default function OwnerOrdersPage() {
  const [secretKey, setSecretKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Check saved secret in sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("tnl_owner_key");
      if (saved) {
        setSecretKey(saved);
        loadOrders(saved);
      }
    } catch {
      // Ignore
    }
  }, []);

  const loadOrders = async (key: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getOwnerOrders(key);
      setOrders(data);
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem("tnl_owner_key", key);
      } catch {
        // Ignore
      }
    } catch (err: any) {
      setError(err.message || "Failed to load orders. Check your secret key.");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretKey.trim()) return;
    loadOrders(secretKey.trim());
  };

  const handleStatusUpdate = async (
    orderId: string,
    update: { orderStatus?: string; paymentStatus?: string; paymentNotes?: string }
  ) => {
    setActionLoadingId(orderId);
    try {
      const updated = await orderService.updateOrderStatus(orderId, secretKey, update);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (err: any) {
      alert(`Action failed: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-blush shadow-card space-y-5 text-center">
          <div className="w-12 h-12 rounded-full bg-espresso/10 text-espresso flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-semibold text-espresso">Studio Owner Access</h1>
            <p className="text-xs text-espresso/60 mt-1">
              Protected operations portal for The Nail Lounge (Abohar)
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 text-left">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <Input
              label="Owner Secret Key"
              type="password"
              placeholder="Enter OWNER_SECRET_KEY"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
            />
            <Button type="submit" variant="primary" fullWidth isLoading={loading}>
              Authenticate
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blush/60">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-espresso">Studio Order Fulfillment</h1>
          <p className="text-xs text-espresso/60 mt-1">
            Reconcile UPI UTR payments, verify COD orders, and manage dispatch status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadOrders(secretKey)}
            disabled={loading}
            className="gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              sessionStorage.removeItem("tnl_owner_key");
              setIsAuthenticated(false);
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-blush p-12 text-center text-espresso/60 text-sm">
          No orders placed in the database yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white rounded-xl border border-blush p-5 shadow-card space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blush/40 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-espresso">
                    {o.orderNumber}
                  </span>
                  <span className="text-xs text-espresso/50">
                    {new Date(o.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      o.paymentStatus === "PAID"
                        ? "bg-emerald-100 text-emerald-800"
                        : o.paymentStatus === "PENDING_VERIFICATION"
                        ? "bg-amber-100 text-amber-900"
                        : "bg-blue-100 text-blue-900"
                    }`}
                  >
                    Payment: {o.paymentStatus}
                  </span>

                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      o.orderStatus === "DELIVERED"
                        ? "bg-emerald-100 text-emerald-800"
                        : o.orderStatus === "SHIPPED"
                        ? "bg-purple-100 text-purple-900"
                        : o.orderStatus === "CONFIRMED"
                        ? "bg-teal-100 text-teal-900"
                        : o.orderStatus === "CANCELLED"
                        ? "bg-red-100 text-red-900"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    Order: {o.orderStatus}
                  </span>
                </div>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-espresso/80">
                {/* Customer Details */}
                <div className="space-y-1">
                  <p className="font-semibold text-espresso uppercase tracking-wider text-[11px]">
                    Customer
                  </p>
                  <p className="font-bold text-espresso text-sm">{o.customer.fullName}</p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-espresso/40" />
                    <a href={`tel:${o.customer.phone}`} className="hover:text-rose underline font-mono">
                      {o.customer.phone}
                    </a>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-espresso/40" />
                    <span>{o.customer.email}</span>
                  </p>
                </div>

                {/* Delivery Address */}
                <div className="space-y-1">
                  <p className="font-semibold text-espresso uppercase tracking-wider text-[11px]">
                    Shipping Destination
                  </p>
                  <p className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-espresso/40 mt-0.5 flex-shrink-0" />
                    <span>
                      {o.shippingAddress.addressLine1}
                      {o.shippingAddress.addressLine2 ? `, ${o.shippingAddress.addressLine2}` : ""}
                      <br />
                      {o.shippingAddress.city}, {o.shippingAddress.state} -{" "}
                      <strong>{o.shippingAddress.postalCode}</strong>
                    </span>
                  </p>
                </div>

                {/* Payment & Reconcile */}
                <div className="space-y-1 bg-ivory-subtle p-3 rounded-lg border border-blush/60">
                  <p className="font-semibold text-espresso uppercase tracking-wider text-[11px]">
                    Payment Verification
                  </p>
                  <p>
                    Method: <strong className="font-mono">{o.paymentMethod}</strong>
                  </p>
                  <p>
                    Claimed UTR:{" "}
                    <strong className="font-mono text-rose">
                      {o.paymentReference || "None Submitted"}
                    </strong>
                  </p>
                  <p>
                    Verification Status:{" "}
                    <strong className="font-mono">{o.verificationStatus}</strong>
                  </p>
                  {o.paymentNotes && (
                    <p className="text-[11px] text-espresso/60 italic">Note: {o.paymentNotes}</p>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="border-t border-blush/40 pt-3 text-xs space-y-1.5">
                <p className="font-semibold text-espresso uppercase tracking-wider text-[11px]">
                  Ordered Items ({o.items.length})
                </p>
                <div className="divide-y divide-blush/30">
                  {o.items.map((it) => (
                    <div key={it.id} className="py-1.5 flex justify-between items-center">
                      <div>
                        <span className="font-medium text-espresso">{it.productTitle}</span>
                        <span className="text-espresso/50 block text-[11px]">
                          {it.variantTitle} &bull; SKU: {it.sku} &bull; Qty: {it.quantity} &bull; Unit: ₹{it.unitPrice}
                        </span>
                      </div>
                      <span className="font-bold text-espresso">₹{it.lineTotal}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-xs font-semibold pt-2 border-t border-blush/40 text-espresso">
                  <span>
                    Subtotal: ₹{o.subtotal} + Delivery (Weight {o.totalWeightGrams}g): ₹{o.deliveryCharge}
                  </span>
                  <span className="font-serif text-sm font-bold text-rose">
                    Total: ₹{o.totalAmount}
                  </span>
                </div>
              </div>

              {/* Owner Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-blush/40">
                {o.paymentStatus !== "PAID" && (
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={actionLoadingId === o.id}
                    onClick={() =>
                      handleStatusUpdate(o.id, {
                        paymentStatus: "PAID",
                        orderStatus: "CONFIRMED",
                        paymentNotes: "Verified by Studio Owner",
                      })
                    }
                  >
                    Confirm Payment &amp; Deduct Stock
                  </Button>
                )}

                {o.orderStatus === "CONFIRMED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={actionLoadingId === o.id}
                    onClick={() =>
                      handleStatusUpdate(o.id, {
                        orderStatus: "PROCESSING",
                      })
                    }
                  >
                    Mark Processing
                  </Button>
                )}

                {(o.orderStatus === "PROCESSING" || o.orderStatus === "CONFIRMED") && (
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={actionLoadingId === o.id}
                    onClick={() =>
                      handleStatusUpdate(o.id, {
                        orderStatus: "SHIPPED",
                      })
                    }
                  >
                    Mark Shipped
                  </Button>
                )}

                {o.orderStatus === "SHIPPED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={actionLoadingId === o.id}
                    onClick={() =>
                      handleStatusUpdate(o.id, {
                        orderStatus: "DELIVERED",
                      })
                    }
                  >
                    Mark Delivered
                  </Button>
                )}

                {o.orderStatus !== "CANCELLED" && o.orderStatus !== "DELIVERED" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-700 hover:text-red-800"
                    disabled={actionLoadingId === o.id}
                    onClick={() => {
                      if (confirm(`Are you sure you want to cancel order ${o.orderNumber}? Reserved stock will be released back to inventory.`)) {
                        handleStatusUpdate(o.id, {
                          orderStatus: "CANCELLED",
                          paymentNotes: "Cancelled by owner",
                        });
                      }
                    }}
                  >
                    Cancel Order
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

