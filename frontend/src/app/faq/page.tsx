"use client";

import React from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { BRAND_CONFIG } from "@/config/brand";
import { MessageCircle, HelpCircle } from "lucide-react";
import { PrototypeNoticeBanner } from "@/components/layout/PrototypeNoticeBanner";

export default function FAQPage() {
  const faqItems = [
    {
      id: "wear-time",
      title: "How long do The Nail Lounge press-on sets stay on?",
      content: (
        <p>
          Wear time depends on your chosen adhesive and natural nail preparation. When applied with our <strong>Adhesive Jelly Tabs</strong>, nails typically last 2 to 4 days, making them ideal for weekend wear and completely reusable. When applied with our <strong>Liquid Nail Glue</strong>, sets last approximately 1 to 2 weeks with proper prep (buffing and alcohol dehydration).
        </p>
      ),
    },
    {
      id: "damage",
      title: "Will press-on nails damage my natural nail beds?",
      content: (
        <p>
          No, provided they are applied and removed correctly. Unlike acrylic salon extensions that require harsh filing and electric drills, press-on nails cause zero damage when removed properly by soaking in warm soapy water with oil. Never rip or pry nails off forcefully.
        </p>
      ),
    },
    {
      id: "sizing",
      title: "How do I choose the correct nail size?",
      content: (
        <p>
          For guaranteed convenience without manual measuring, we recommend our <strong>Multi-Size 24-Piece Sets</strong>, which contain 12 distinct widths (2 of each size) to fit almost all finger shapes. If you prefer a tailored 10-piece set, visit our interactive <Link href="/sizing-guide" className="text-rose underline font-semibold">Sizing Guide</Link> to measure your nail beds in millimeters.
        </p>
      ),
    },
    {
      id: "water",
      title: "Can I shower, wash dishes, or swim with press-on nails?",
      content: (
        <p>
          Yes! Once the adhesive has fully bonded (we recommend waiting at least 1–2 hours after application before prolonged water exposure), our nails are water-resistant. For regular household dishwashing or heavy chores, wearing protective gloves will extend glue longevity.
        </p>
      ),
    },
    {
      id: "shipping",
      title: "How many days does delivery take across India?",
      content: (
        <p>
          All orders are prepared and dispatched from our Abohar, Punjab studio within 24 to 48 hours. Orders to Punjab, Chandigarh, and Delhi NCR typically arrive in 2–3 business days. Delivery to Mumbai, Bengaluru, and other metro/Tier 2 cities takes 3–5 business days via express courier.
        </p>
      ),
    },
    {
      id: "returns",
      title: "What is your return and damage replacement policy?",
      content: (
        <p>
          Due to cosmetic hygiene standards, opened or tried-on press-on sets cannot be returned. However, if your package arrives damaged in transit or defective, we provide an immediate <strong>free replacement</strong> upon receipt of an unboxing photo/video sent to our WhatsApp support within 48 hours of delivery.
        </p>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      <PrototypeNoticeBanner className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-6" />

      <Breadcrumbs items={[{ label: "Customer Care" }, { label: "FAQ & Help Center" }]} />

      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-rose">
          Got Questions?
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-espresso">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-espresso/70 leading-relaxed">
          Clear, transparent answers regarding application, wear duration, sizing fit, water resistance, and shipping.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-blush shadow-card">
        <Accordion items={faqItems} allowMultiple defaultOpenId="wear-time" />
      </div>

      {/* Still Need Assistance Banner */}
      <div className="bg-ivory-subtle p-6 rounded-2xl border border-blush flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h3 className="font-serif font-semibold text-lg text-espresso">
            Still Have Questions?
          </h3>
          <p className="text-xs text-espresso/70 mt-1">
            Our Abohar studio specialist is available on WhatsApp to assist with sizing and style matching.
          </p>
        </div>

        <a
          href={BRAND_CONFIG.socialHandles.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="primary" size="md" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </Button>
        </a>
      </div>
    </div>
  );
}

