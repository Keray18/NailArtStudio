"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { catalogueService } from "@/services/catalogueService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Truck, Lock, ArrowLeft, Info, CheckCircle2 } from "lucide-react";
import { PrototypeNoticeBanner } from "@/components/layout/PrototypeNoticeBanner";

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
  shippingSpeed: "STANDARD" | "EXPRESS";
  paymentMethod: "COD" | "ONLINE_MOCK";
}

interface FormErrors {
  [key: string]: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingFee, total, clearCart } = useCart();

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
    shippingSpeed: "STANDARD",
    paymentMethod: "COD",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  // Auto-fill city & state when 6-digit pincode is entered
  const handlePincodeChange = async (pinValue: string) => {
    const cleanPin = pinValue.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: cleanPin }));

    if (cleanPin.length === 6) {
      setPincodeLoading(true);
      try {
        const lookup = await catalogueService.validatePincode(cleanPin);
        if (lookup.isServiceable) {
          setFormData((prev) => ({
            ...prev,
            city: prev.city || lookup.city,
            state: prev.state || lookup.state,
          }));
          setErrors((prev) => ({ ...prev, pincode: "" }));
        }
      } catch {
        // Keep editable
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phone.trim() || formData.phone.length < 10)
      newErrors.phone = "Enter a valid 10-digit mobile number";
    if (!formData.email.trim() || !formData.email.includes("@"))
      newErrors.email = "Valid email address is required for your invoice";
    if (!formData.addressLine1.trim())
      newErrors.addressLine1 = "House number and street are required";
    if (!formData.pincode.trim() || formData.pincode.length !== 6)
      newErrors.pincode = "Enter a valid 6-digit postal pincode";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);

    // Simulate order placement
    setTimeout(() => {
      const orderNumber = `TNL-DEV-${Math.floor(10000 + Math.random() * 90000)}`;
      const orderAccessToken = `sec_${Math.random().toString(36).substring(2, 15)}`;

      // Save order snapshot in session storage for the confirmation page
      const orderReceipt = {
        orderNumber,
        orderAccessToken,
        createdAt: new Date().toISOString(),
        items: [...items],
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state,
          postalCode: formData.pincode,
          country: "India",
        },
        subtotal,
        shippingFee: formData.shippingSpeed === "EXPRESS" ? shippingFee + 99 : shippingFee,
        total: formData.shippingSpeed === "EXPRESS" ? total + 99 : total,
        paymentMethod: formData.paymentMethod,
        estimatedDeliveryWindow: "3–5 business days (Abohar Studio Dispatch)",
        isSimulatedPrototype: true,
      };

      try {
        sessionStorage.setItem(`tnl_order_${orderNumber}`, JSON.stringify(orderReceipt));
      } catch {
        // quota
      }

      clearCart();
      setIsSubmitting(false);
      router.push(`/order-confirmation/${orderNumber}?token=${orderAccessToken}`);
    }, 800);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="font-serif text-2xl font-semibold text-espresso mb-2">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-sm text-espresso/70 mb-6">
          Add styles to your shopping bag before proceeding to checkout.
        </p>
        <Link href="/shop">
          <Button variant="primary">Browse Catalogue</Button>
        </Link>
      </div>
    );
  }

  const expressFee = formData.shippingSpeed === "EXPRESS" ? 99 : 0;
  const grandTotal = total + expressFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PrototypeNoticeBanner className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-6" />

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
          <span>Guest Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Checkout Accordion Steps (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Contact Information */}
            <div className="bg-white p-6 rounded-xl border border-blush shadow-card space-y-4">
              <div className="flex items-center gap-2 border-b border-blush/40 pb-3">
                <span className="w-6 h-6 rounded-full bg-rose text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="font-serif text-lg font-semibold text-espresso">
                  Contact Details (Guest)
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
                  label="Mobile / WhatsApp Number *"
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
                  helperText="For delivery dispatch and courier updates"
                />

                <div className="sm:col-span-2">
                  <Input
                    label="Email Address (for Receipt) *"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    error={errors.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
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
                    label="Locality / Area / Landmark (Optional)"
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
                      pincodeLoading
                        ? "Looking up city/state..."
                        : "Auto-suggests city and state"
                    }
                  />
                </div>

                <div>
                  <Input
                    label="City *"
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
              </div>
            </div>

            {/* Step 3: Shipping & Payment Method (Simulated) */}
            <div className="bg-white p-6 rounded-xl border border-blush shadow-card space-y-4">
              <div className="flex items-center gap-2 border-b border-blush/40 pb-3">
                <span className="w-6 h-6 rounded-full bg-rose text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h2 className="font-serif text-lg font-semibold text-espresso">
                  Shipping Speed &amp; Payment (Prototype)
                </h2>
              </div>

              {/* Delivery Speed Radios */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-espresso block">
                  Select Delivery Option
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, shippingSpeed: "STANDARD" }))
                    }
                    className={`p-3 rounded-lg border text-left transition-all focus-ring ${
                      formData.shippingSpeed === "STANDARD"
                        ? "border-rose bg-rose/5 ring-1 ring-rose"
                        : "border-blush bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-espresso">
                      <span>Standard Surface</span>
                      <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
                    </div>
                    <span className="text-[11px] text-espresso/60 block mt-1">
                      3–5 business days across India
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, shippingSpeed: "EXPRESS" }))
                    }
                    className={`p-3 rounded-lg border text-left transition-all focus-ring ${
                      formData.shippingSpeed === "EXPRESS"
                        ? "border-rose bg-rose/5 ring-1 ring-rose"
                        : "border-blush bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-espresso">
                      <span>Express Air Courier</span>
                      <span>+₹99</span>
                    </div>
                    <span className="text-[11px] text-espresso/60 block mt-1">
                      1–2 business days priority dispatch
                    </span>
                  </button>
                </div>
              </div>

              {/* Payment Method Radios (Simulated) */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-espresso block">
                  Payment Method (Simulated Prototype)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, paymentMethod: "COD" }))
                    }
                    className={`p-3 rounded-lg border text-left transition-all focus-ring ${
                      formData.paymentMethod === "COD"
                        ? "border-rose bg-rose/5 ring-1 ring-rose"
                        : "border-blush bg-white"
                    }`}
                  >
                    <span className="text-xs font-bold text-espresso block">
                      Cash on Delivery (Simulated)
                    </span>
                    <span className="text-[11px] text-espresso/60 block mt-1">
                      Pay upon delivery with cash/UPI
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, paymentMethod: "ONLINE_MOCK" }))
                    }
                    className={`p-3 rounded-lg border text-left transition-all focus-ring ${
                      formData.paymentMethod === "ONLINE_MOCK"
                        ? "border-rose bg-rose/5 ring-1 ring-rose"
                        : "border-blush bg-white"
                    }`}
                  >
                    <span className="text-xs font-bold text-espresso block">
                      Simulated UPI / Netbanking
                    </span>
                    <span className="text-[11px] text-espresso/60 block mt-1">
                      Instant simulated confirmation
                    </span>
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isSubmitting}
                >
                  Confirm Simulated Order &bull; ₹{grandTotal}
                </Button>
                <p className="text-center text-[11px] text-espresso/50 mt-2">
                  By clicking, you confirm this is a development prototype test run.
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Order Review Summary (5 Cols) */}
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
              <span>Items Subtotal</span>
              <span className="font-semibold text-espresso">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>
                {shippingFee === 0 && expressFee === 0 ? (
                  <span className="text-status-success font-semibold">FREE</span>
                ) : (
                  `₹${shippingFee + expressFee}`
                )}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-espresso border-t border-blush/60 pt-3">
              <span>Total Payable</span>
              <span className="font-serif text-xl">₹{grandTotal}</span>
            </div>
          </div>

          <div className="p-3 bg-ivory-subtle/60 rounded-lg text-xs text-espresso/70 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-espresso">
              <ShieldCheck className="w-4 h-4 text-status-success" />
              <span>Abohar Studio Guarantee</span>
            </div>
            <p className="text-[11px]">
              Every parcel is carefully inspected, packed with protective foam, and tracked until doorstep delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
