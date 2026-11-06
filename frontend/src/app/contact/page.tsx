"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { BRAND_CONFIG } from "@/config/brand";
import { MessageCircle, Mail, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { PrototypeNoticeBanner } from "@/components/layout/PrototypeNoticeBanner";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderNumber: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in your name, email, and message.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      <PrototypeNoticeBanner className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-6" />

      <Breadcrumbs items={[{ label: "Customer Care" }, { label: "Contact Us" }]} />

      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-rose">
          We&apos;re Here to Help
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-espresso">
          Contact Our Studio
        </h1>
        <p className="text-xs sm:text-sm text-espresso/70 leading-relaxed">
          Have an inquiry about custom bridal sets, sizing recommendations, or delivery? Reach out to our Abohar studio team directly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Channels & Studio Address */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-blush shadow-card space-y-5 text-xs text-espresso/80">
            <h2 className="font-serif text-xl font-semibold text-espresso border-b border-blush/60 pb-3">
              Direct Contact
            </h2>

            <div className="flex items-start gap-3">
              <MessageCircle className="w-4 h-4 text-rose flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-espresso">WhatsApp Instant Support</p>
                <a
                  href={BRAND_CONFIG.socialHandles.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose hover:underline"
                >
                  {BRAND_CONFIG.whatsappNumber}
                </a>
                <p className="text-[11px] text-espresso/50">Mon–Sat, 10 AM – 7 PM IST</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-rose flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-espresso">Email Support</p>
                <a href={`mailto:${BRAND_CONFIG.supportEmail}`} className="text-rose hover:underline">
                  {BRAND_CONFIG.supportEmail}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-rose flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-espresso">Founding Studio</p>
                <p>{BRAND_CONFIG.name}</p>
                <p>{BRAND_CONFIG.location}</p>
                <p className="text-[11px] text-espresso/50">Punjab - 152116, India</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-rose flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-espresso">Studio Working Hours</p>
                <p>Monday to Saturday: 10:00 AM – 7:00 PM</p>
                <p className="text-[11px] text-espresso/50">Closed on Sundays &amp; National Holidays</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-blush shadow-card">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-status-success/10 text-status-success flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-espresso">
                Message Sent Successfully
              </h3>
              <p className="text-xs text-espresso/70 max-w-sm mx-auto leading-relaxed">
                Thank you, {formData.name}. Our studio team will review your message and reply via WhatsApp/Email within 24 hours.
              </p>
              <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-serif text-xl font-semibold text-espresso border-b border-blush/60 pb-3">
                Send an Inquiry
              </h2>

              <Input
                label="Your Name *"
                placeholder="e.g. Priya Sharma"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address *"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />

                <Input
                  label="WhatsApp Number (Optional)"
                  type="tel"
                  placeholder="10-digit number"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <Input
                label="Order Number (If applicable)"
                placeholder="e.g. TNL-DEV-10492"
                value={formData.orderNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, orderNumber: e.target.value }))}
              />

              <div>
                <label className="block text-xs font-semibold text-espresso uppercase tracking-wider mb-1.5">
                  Your Message or Sizing Question *
                </label>
                <textarea
                  rows={4}
                  placeholder="How can our studio team assist you?"
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  required
                  className="w-full bg-white border border-blush rounded-md p-3 text-sm text-espresso placeholder:text-espresso/40 focus-ring"
                />
              </div>

              <Button type="submit" variant="primary" fullWidth size="lg">
                Submit Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

