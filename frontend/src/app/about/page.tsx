import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { BRAND_CONFIG } from "@/config/brand";
import { Sparkles, Shield, Heart, ArrowRight } from "lucide-react";
import { PrototypeNoticeBanner } from "@/components/layout/PrototypeNoticeBanner";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      <PrototypeNoticeBanner className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-6" />

      <Breadcrumbs items={[{ label: "Our Story" }]} />

      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-rose">
          The Abohar Studio Heritage
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-espresso">
          Artistry at Your Fingertips
        </h1>
        <p className="text-xs sm:text-sm text-espresso/70 leading-relaxed">
          The story behind {BRAND_CONFIG.name} — bridging the gap between salon artistry and home convenience from Abohar, Punjab.
        </p>
      </div>

      <div className="relative aspect-video sm:aspect-[21/9] rounded-2xl overflow-hidden bg-ivory-subtle border border-blush shadow-card">
        <Image
          src="https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1400&auto=format&fit=crop"
          alt="The Nail Lounge Studio"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <p className="text-xs uppercase tracking-widest text-champagne font-semibold">Founding Studio</p>
          <p className="font-serif text-xl sm:text-2xl font-semibold">{BRAND_CONFIG.location}</p>
        </div>
      </div>

      <div className="space-y-6 text-sm sm:text-base text-espresso/80 leading-relaxed">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-espresso">
          Why We Started The Nail Lounge
        </h2>
        <p>
          For decades, achieving salon-quality nail art meant sacrificing hours sitting under salon lamps and spending thousands of rupees every few weeks. More frustratingly, conventional salon acrylics frequently damage natural nail beds during harsh drill removals.
        </p>
        <p>
          Born in <strong>Abohar, Punjab</strong>, {BRAND_CONFIG.name} was established with a singular mission: to make luxury, high-fashion manicures instantly accessible, damage-free, and affordable.
        </p>
        <p>
          We curate and finish salon-grade press-on nails that provide the exact weight, thickness, and shine of professional salon extensions. Each set can be applied in under 15 minutes at your home vanity and safely removed with warm water and oil whenever you choose.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
        <div className="p-6 bg-white rounded-xl border border-blush shadow-card space-y-2">
          <Sparkles className="w-6 h-6 text-rose" />
          <h3 className="font-serif font-semibold text-lg text-espresso">Design Integrity</h3>
          <p className="text-xs text-espresso/70 leading-relaxed">
            From subtle micro-French lines to Kundan-embellished bridal suites, every design is chosen with intention and artistic flair.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-blush shadow-card space-y-2">
          <Shield className="w-6 h-6 text-rose" />
          <h3 className="font-serif font-semibold text-lg text-espresso">Nail Health First</h3>
          <p className="text-xs text-espresso/70 leading-relaxed">
            No harsh e-files, drills, or damaging acetone wraps. Our sets prioritize the long-term health of your natural nail plate.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-blush shadow-card space-y-2">
          <Heart className="w-6 h-6 text-rose" />
          <h3 className="font-serif font-semibold text-lg text-espresso">Accessible Luxury</h3>
          <p className="text-xs text-espresso/70 leading-relaxed">
            Premium finishes without salon markups, delivered directly from our Abohar studio to beauty lovers across India.
          </p>
        </div>
      </div>

      <div className="text-center pt-6">
        <Link href="/shop">
          <Button variant="primary" size="lg" className="gap-2">
            <span>Explore Handcrafted Styles</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

