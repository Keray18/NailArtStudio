"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { deliveryService, DeliveryQuoteResponse } from "@/services/deliveryService";
import { orderService } from "@/services/orderService";
import { BRAND_CONFIG } from "@/config/brand";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Lock, ArrowLeft, Info, AlertCircle, QrCode, PhoneCall } from "lucide-react";

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  pincode: string;
  city: string;
  state: string;
  paymentMethod: "UPI_MANUAL" | "COD";
  customerNotes: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, isMinOrderMet, amountNeededForMinOrder, clearCart } = useCart();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
    paymentMethod: "UPI_MANUAL",
    customerNotes: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryQuote, setDeliveryQuote] = useState<DeliveryQuoteResponse | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Fetch delivery quote when pincode or items change
  useEffect(() => {
    const cleanPin = formData.pincode.trim();
    if (cleanPin.length === 6 && /^\d{6}$/.test(cleanPin) && items.length > 0) {
      setQuoteLoading(true);
      deliveryService
        .getQuote({
          items: items.map((i) => ({ variantId: i.variant.id, quantity: i.quantity })),
          destinationPincode: cleanPin,
        })
        .then((quote) => {
          setDeliveryQuote(quote);
          setErrors((prev) => ({ ...prev, pincode: "" }));
        })
        .catch(() => {
          // If quote fails, fallback to standard calculation
        })
        .finally(() => {
          setQuoteLoading(false);
        });
    }
  }, [formData.pincode, items]);

  const handlePincodeChange = (pinValue: string) => {
    const cleanPin = pinValue.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: cleanPin }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phone.trim() || formData.phone.length < 10)
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    if (!formData.email.trim() || !formData.email.includes("@"))
      newErrors.email = "Valid email address is required for receipt & tracking";
    if (!formData.addressLine1.trim())
      newErrors.addressLine1 = "Address line 1 (house / building / street) is required";
    if (!formData.pincode.trim() || formData.pincode.length !== 6)
      newErrors.pincode = "Enter a valid 6-digit postal pincode";
    if (!formData.city.trim()) newErrors.city = "City / District is required";
    if (!formData.state.trim()) newErrors.state = "State / Union Territory is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const deliveryCharge = deliveryQuote ? deliveryQuote.deliveryCharge : 60;
  const grandTotal = subtotal + deliveryCharge;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (items.length === 0) {
      setServerError("Your cart is empty. Please add products to proceed.");
      return;
    }

    if (!isMinOrderMet) {
      setServerError(
        `Minimum merchandise order subtotal is ₹${BRAND_CONFIG.minOrderMerchandiseSubtotal}. Please add ₹${amountNeededForMinOrder} more in items.`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const order = await orderService.createGuestOrder({
        customer: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
        },
        shippingAddress: {
          addressLine1: formData.addressLine1.trim(),
          addressLine2: formData.landmark.trim() ? `Near ${formData.landmark.trim()}` : undefined,
          city: formData.city.trim(),
          state: formData.state.trim(),
          postalCode: formData.pincode.trim(),
        },
        paymentMethod: formData.paymentMethod,
        items: items.map((i) => ({
          variantId: i.variant.id,
          quantity: i.quantity,
        })),
        customerNotes: formData.customerNotes.trim() || undefined,
        idempotencyKey,
      });

      clearCart();
      router.push(`/order-confirmation/${order.orderNumber}?token=${order.orderAccessToken}`);
    } catch (err: any) {
      setServerError(err.message || "Failed to place order. Please verify your details and try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="font-serif text-2xl font-semibold text-espresso mb-2">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-sm text-espresso/70 mb-6">
          Add handcrafted styles to your shopping bag before proceeding to checkout.
        </p>
        <Link href="/shop">
          <Button variant="primary">Browse Catalogue</Button>
        </Link>
      </div>
    );
  }

  if (!isMinOrderMet) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-2xl font-semibold text-espresso">
          Minimum Order Not Met
        </h1>
        <p className="text-sm text-espresso/70">
          The Nail Lounge requires a minimum merchandise subtotal of <strong>₹{BRAND_CONFIG.minOrderMerchandiseSubtotal}</strong>.
          Your current subtotal is <strong>₹{subtotal}</strong>.
        </p>
        <p className="text-xs text-espresso/60">
          Delivery charges (₹{BRAND_CONFIG.deliveryRatePerKg}/kg) are calculated separately and do not count toward this merchandise minimum.
        </p>
        <div className="pt-2">
          <Link href="/shop">
            <Button variant="primary">Add ₹{amountNeededForMinOrder} More to Continue</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-blush/60">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-espresso-muted hover:text-rose transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Bag</span>
        </Link>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-espresso">
          <Lock className="w-3.5 h-3.5 text-rose" />
          <span>Secure Guest Checkout</span>
        </div>
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-950 text-sm">Order Placement Notice</p>
            <p className="mt-0.5 leading-relaxed">{serverError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Contact Information */}
            <div className="bg-white p-6 rounded-xl border border-blush shadow-card space-y-4">
              <div className="flex items-center gap-2 border-b border-blush/40 pb-3">
                <span className="w-6 h-6 rounded-full bg-rose text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="font-serif text-lg font-semibold text-espresso">
                  Contact Information (Guest)
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  placeholder="e.g. Simran Kaur"
                  value={formData.fullName}
                  error={errors.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                />

                <Input
                  label="Mobile Number (WhatsApp) *"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  error={errors.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                    }))
                  }
                  helperText="Used for order confirmation & courier dispatch updates"
                />

                <div className="sm:col-span-2">
                  <Input
                    label="Email Address *"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    error={errors.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    helperText="Receipt and tracking details will be sent here"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Indian Delivery Address */}
            <div className="bg-white p-6 rounded-xl border border-blush shadow-card space-y-4">
              <div className="flex items-center gap-2 border-b border-blush/40 pb-3">
                <span className="w-6 h-6 rounded-full bg-rose text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="font-serif text-lg font-semibold text-espresso">
                  Indian Delivery Address
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Flat / House No. / Building / Street *"
                    placeholder="e.g. House #142, Street 3, Model Town"
                    value={formData.addressLine1}
                    error={errors.addressLine1}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, addressLine1: e.target.value }))
                    }
                  />
                </div>

                <div className="sm:col-span-2">
                  <Input
                    label="Landmark / Area (Optional)"
                    placeholder="e.g. Near Gurudwara Sahib"
                    value={formData.landmark}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, landmark: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Input
                    label="6-Digit Postal Pincode *"
                    placeholder="e.g. 152116"
                    value={formData.pincode}
                    error={errors.pincode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    helperText={
                      quoteLoading
                        ? "Calculating courier rate..."
                        : deliveryQuote
                        ? `Delivery: ₹${deliveryQuote.deliveryCharge} (${deliveryQuote.estimatedTransitDays})`
                        : "Rate calculated at ₹60/kg"
                    }
                  />
                </div>

                <div>
                  <Input
                    label="City / Town *"
                    placeholder="e.g. Abohar"
                    value={formData.city}
                    error={errors.city}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, city: e.target.value }))
                    }
                  />
                </div>

                <div className="sm:col-span-2">
                  <Input
                    label="State / Union Territory *"
                    placeholder="e.g. Punjab"
                    value={formData.state}
                    error={errors.state}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, state: e.target.value }))
                    }
                  />
                </div>

                <div className="sm:col-span-2">
                  <Input
                    label="Order Notes / Delivery Instructions (Optional)"
                    placeholder="e.g. Call before delivery, custom nail sizing preferences..."
                    value={formData.customerNotes}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, customerNotes: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Verified Payment Methods */}
            <div className="bg-white p-6 rounded-xl border border-blush shadow-card space-y-4">
              <div className="flex items-center gap-2 border-b border-blush/40 pb-3">
                <span className="w-6 h-6 rounded-full bg-rose text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h2 className="font-serif text-lg font-semibold text-espresso">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3">
                {/* UPI Option */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, paymentMethod: "UPI_MANUAL" }))
                  }
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    formData.paymentMethod === "UPI_MANUAL"
                      ? "border-rose bg-rose/5 ring-1 ring-rose"
                      : "border-blush bg-white hover:border-blush-dark"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose/10 text-rose flex items-center justify-center flex-shrink-0 mt-0.5">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-espresso">
                          Manual UPI / QR Code Payment (Recommended)
                        </span>
                        <span className="text-[10px] uppercase font-bold text-rose tracking-wider bg-rose/10 px-2 py-0.5 rounded">
                          Priority Dispatch
                        </span>
                      </div>
                      <p className="text-[11px] text-espresso/70 mt-1 leading-relaxed">
                        Pay via Google Pay, PhonePe, Paytm, or BHIM. You will scan the studio QR code and enter your 12-digit transaction UTR on the next screen for studio verification.
                      </p>
                    </div>
                  </div>
                </button>

                {/* COD Option */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, paymentMethod: "COD" }))
                  }
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    formData.paymentMethod === "COD"
                      ? "border-rose bg-rose/5 ring-1 ring-rose"
                      : "border-blush bg-white hover:border-blush-dark"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-espresso/10 text-espresso flex items-center justify-center flex-shrink-0 mt-0.5">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-espresso block">
                        Cash on Delivery (Phone Verification Required)
                      </span>
                      <p className="text-[11px] text-espresso/70 mt-1 leading-relaxed">
                        Our Abohar studio will call your phone to verify the shipping address prior to courier dispatch. Pay cash upon doorstep arrival.
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isSubmitting}
                >
                  Place Order &bull; ₹{grandTotal}
                </Button>
                <p className="text-center text-[11px] text-espresso/50 mt-2">
                  Direct studio fulfillment &bull; Abohar, Punjab &bull; Handcrafted with care
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-blush shadow-card space-y-4 sticky top-28">
          <h2 className="font-serif text-lg font-semibold text-espresso border-b border-blush/60 pb-3 flex items-center justify-between">
            <span>Order Summary</span>
            <span className="text-xs font-normal text-espresso/60">
              {items.length} {items.length === 1 ? "Item" : "Items"}
            </span>
          </h2>

          {/* Items Preview */}
          <div className="divide-y divide-blush/40 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                <div className="relative w-12 h-14 bg-ivory-subtle rounded overflow-hidden flex-shrink-0 border border-blush/40">
                  {item.product.images[0]?.url ? (
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-espresso truncate">{item.product.name}</p>
                  <p className="text-[11px] text-espresso/50 truncate">{item.variant.title}</p>
                  <p className="text-[11px] text-espresso/70">Qty: {item.quantity}</p>
                </div>
                <span className="font-bold text-espresso">₹{item.lineTotal}</span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="space-y-2 text-xs text-espresso/80 border-t border-blush/60 pt-3">
            <div className="flex justify-between">
              <span>Merchandise Subtotal</span>
              <span className="font-semibold text-espresso">₹{subtotal}</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span>Delivery charges</span>
                {deliveryQuote && (
                  <span className="block text-[10px] text-espresso/50">
                    Parcel Weight: {deliveryQuote.totalParcelWeightGrams}g (inc. {deliveryQuote.packagingWeightGrams}g box)
                  </span>
                )}
              </div>
              <span className="font-semibold text-espresso">₹{deliveryCharge}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-espresso border-t border-blush/60 pt-3">
              <span>Total Amount</span>
              <span className="font-serif text-xl">₹{grandTotal}</span>
            </div>
          </div>

          <div className="p-3 bg-ivory-subtle/60 rounded-lg text-xs text-espresso/70 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-espresso">
              <ShieldCheck className="w-4 h-4 text-status-success" />
              <span>Direct Studio Guarantee</span>
            </div>
            <p className="text-[11px] leading-tight">
              Handcrafted in Abohar, Punjab. Secure multi-layer bubble packaging to ensure pristine transit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
