import React from "react";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { BRAND_CONFIG } from "@/config/brand";
import { PrototypeNoticeBanner } from "@/components/layout/PrototypeNoticeBanner";

const POLICIES: Record<
  string,
  { title: string; subtitle: string; content: React.ReactNode }
> = {
  shipping: {
    title: "Shipping & Delivery Policy",
    subtitle: "Transparent timelines and courier dispatch standards across India",
    content: (
      <div className="space-y-4 text-xs sm:text-sm text-espresso/80 leading-relaxed">
        <p>
          All orders placed on {BRAND_CONFIG.name} are handcrafted, packaged, and dispatched from our primary studio in <strong>{BRAND_CONFIG.location}</strong>.
        </p>

        <h3 className="font-serif text-lg font-semibold text-espresso pt-2">
          1. Processing &amp; Dispatch SLA
        </h3>
        <p>
          Standard in-stock sets are processed and dispatched within <strong>24 to 48 hours</strong> of order receipt (excluding Sundays and national holidays). Bespoke custom-sized sets requiring hand-detailing may require up to 72 hours for thorough UV curing and quality inspection before dispatch.
        </p>

        <h3 className="font-serif text-lg font-semibold text-espresso pt-2">
          2. Estimated Transit Timelines
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Punjab, Haryana &amp; Chandigarh:</strong> 2 to 3 business days</li>
          <li><strong>Delhi NCR &amp; North India Metros:</strong> 2 to 4 business days</li>
          <li><strong>Mumbai, Bengaluru, Hyderabad, Kolkata:</strong> 3 to 5 business days</li>
          <li><strong>Tier 2 &amp; Tier 3 Cities / Northeast:</strong> 4 to 6 business days</li>
        </ul>

        <h3 className="font-serif text-lg font-semibold text-espresso pt-2">
          3. Shipping Fees &amp; Free Shipping
        </h3>
        <p>
          We offer complimentary standard shipping on all prepaid orders exceeding <strong>₹{BRAND_CONFIG.freeShippingThreshold}</strong>. Orders below this threshold incur an illustrative delivery charge of ₹{BRAND_CONFIG.standardShippingFee} to cover protective bubble packaging and courier conveyance.
        </p>
      </div>
    ),
  },
  returns: {
    title: "Hygiene & Returns Policy",
    subtitle: "Personal cosmetic hygiene standards and 48-hour transit damage replacement guarantee",
    content: (
      <div className="space-y-4 text-xs sm:text-sm text-espresso/80 leading-relaxed">
        <h3 className="font-serif text-lg font-semibold text-espresso">
          1. Personal Hygiene Notice
        </h3>
        <p>
          Under Indian Consumer Protection regulations and international cosmetic hygiene standards, press-on nails, nail adhesives, prep wipes, and personal beauty accessories <strong>cannot be returned, exchanged, or refunded once opened or tried on</strong>. Because our nails come into direct contact with natural keratin nail plates and cuticles, we cannot resell returned goods to other customers.
        </p>

        <h3 className="font-serif text-lg font-semibold text-espresso pt-2">
          2. 48-Hour Transit Damage Guarantee
        </h3>
        <p>
          We take immense pride in our protective packaging. In the unlikely event that your parcel arrives crushed, broken, or contains missing items:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Take an unboxing photograph or short video clearly showing the damaged tips or parcel.</li>
          <li>Send the unboxing proof to our WhatsApp customer care ({BRAND_CONFIG.whatsappNumber}) within <strong>48 hours of delivery receipt</strong>.</li>
          <li>Upon verification, our studio will dispatch a brand-new identical replacement set immediately at zero additional cost to you.</li>
        </ul>

        <h3 className="font-serif text-lg font-semibold text-espresso pt-2">
          3. Sizing Fit Guarantee &amp; Assistance
        </h3>
        <p>
          If you ordered custom-sized tips and find that a specific tip does not fit your natural nail width, contact our studio specialist. We offer individual replacement sizing tips rather than requiring you to repurchase an entire set.
        </p>
      </div>
    ),
  },
  privacy: {
    title: "Privacy Policy",
    subtitle: "Compliance with the Indian Digital Personal Data Protection (DPDP) Act, 2023",
    content: (
      <div className="space-y-4 text-xs sm:text-sm text-espresso/80 leading-relaxed">
        <p>
          {BRAND_CONFIG.name} is committed to safeguarding the privacy and personal data of our customers. This policy details how your information is collected, used, and protected.
        </p>

        <h3 className="font-serif text-lg font-semibold text-espresso pt-2">
          1. Information We Collect
        </h3>
        <p>
          We collect personal information necessary to fulfill your orders: Full Name, WhatsApp/Phone Number, Delivery Address, Postal Pincode, and Email Address. We do not store sensitive payment card details or netbanking passwords on our servers.
        </p>

        <h3 className="font-serif text-lg font-semibold text-espresso pt-2">
          2. Use of Information
        </h3>
        <p>
          Your information is used strictly to:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Generate shipping labels and coordinate courier delivery to your address.</li>
          <li>Send digital invoices and WhatsApp dispatch tracking notifications.</li>
          <li>Provide customer care and sizing support upon your request.</li>
        </ul>

        <h3 className="font-serif text-lg font-semibold text-espresso pt-2">
          3. Zero Sale of Personal Data
        </h3>
        <p>
          We never sell, rent, or trade your contact details to third-party advertising brokers or data harvesting syndicates.
        </p>
      </div>
    ),
  },
  terms: {
    title: "Terms and Conditions of Sale",
    subtitle: "Contractual terms governing purchases from The Nail Lounge",
    content: (
      <div className="space-y-4 text-xs sm:text-sm text-espresso/80 leading-relaxed">
        <p>
          By accessing and placing an order on {BRAND_CONFIG.name}, you agree to be bound by these Terms of Sale.
        </p>

        <h3 className="font-serif text-lg font-semibold text-espresso pt-2">
          1. Product Descriptions &amp; Handcrafting Variations
        </h3>
        <p>
          Because many of our press-on sets feature hand-painted art, 3D chrome powders, and hand-placed rhinestones, minor variations in stone placement and marble swirl patterns may occur. These variations are characteristics of artisanal beauty and are not manufacturing defects.
        </p>

        <h3 className="font-serif text-lg font-semibold text-espresso pt-2">
          2. Pricing &amp; Typographical Errors
        </h3>
        <p>
          Prices are listed in Indian Rupees (INR) inclusive of applicable taxes. In the event a product is listed at an incorrect price due to typographical error, {BRAND_CONFIG.name} reserves the right to cancel or refund the order prior to dispatch.
        </p>

        <h3 className="font-serif text-lg font-semibold text-espresso pt-2">
          3. Governing Law &amp; Jurisdiction
        </h3>
        <p>
          These terms are governed by the laws of India. Any legal dispute or claim arising from storefront transactions shall be subject to the exclusive jurisdiction of the competent courts in Abohar / Fazilka District, Punjab.
        </p>
      </div>
    ),
  },
};

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = POLICIES[slug];

  if (!policy) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <PrototypeNoticeBanner className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-6" />

      <Breadcrumbs
        items={[
          { label: "Policies" },
          { label: policy.title },
        ]}
      />

      <div className="space-y-2 border-b border-blush/60 pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-espresso">
          {policy.title}
        </h1>
        <p className="text-xs sm:text-sm text-espresso/70">
          {policy.subtitle}
        </p>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-blush shadow-card">
        {policy.content}
      </div>
    </div>
  );
}

