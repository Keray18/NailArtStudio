import React from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Sparkles, Shield, Clock, AlertTriangle, ArrowRight } from "lucide-react";
import { PrototypeNoticeBanner } from "@/components/layout/PrototypeNoticeBanner";

export default function HowToApplyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      <PrototypeNoticeBanner className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-6" />

      <Breadcrumbs items={[{ label: "Guidance" }, { label: "How to Apply & Remove" }]} />

      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-rose">
          Application &amp; Care
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-espresso">
          How to Apply &amp; Safely Remove
        </h1>
        <p className="text-xs sm:text-sm text-espresso/70 leading-relaxed">
          Master the salon-secret application technique to achieve long-lasting wear without damaging your natural nail beds.
        </p>
      </div>

      {/* Tabs vs Glue Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-blush shadow-card space-y-3">
          <span className="text-xs font-bold text-rose uppercase tracking-wider block">
            Option A &bull; Adhesive Jelly Tabs
          </span>
          <h2 className="font-serif text-xl font-semibold text-espresso">
            Temporary Wear (2–4 Days)
          </h2>
          <p className="text-xs text-espresso/70 leading-relaxed">
            Ideal for weekend getaways, parties, photoshoots, and special functions. Allows you to remove the nails easily and re-wear the set multiple times.
          </p>
          <ul className="text-xs text-espresso/80 space-y-1.5 list-disc list-inside pt-1">
            <li>Zero natural nail plate damage</li>
            <li>Press-on tips remain completely reusable</li>
            <li>Gentle warm water release in 5–8 minutes</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-blush shadow-card space-y-3">
          <span className="text-xs font-bold text-rose uppercase tracking-wider block">
            Option B &bull; Liquid Brush Glue
          </span>
          <h2 className="font-serif text-xl font-semibold text-espresso">
            Extended Wear (1–2 Weeks)
          </h2>
          <p className="text-xs text-espresso/70 leading-relaxed">
            Formulated for daily wear, typing, and standard activities. Requires thorough nail bed dehydration and patient soaking for safe removal.
          </p>
          <ul className="text-xs text-espresso/80 space-y-1.5 list-disc list-inside pt-1">
            <li>Maximum strength hold against daily tasks</li>
            <li>Water-resistant once fully bonded</li>
            <li>Requires 10–12 minute warm water &amp; oil soak to dissolve</li>
          </ul>
        </div>
      </div>

      {/* Step by Step Application */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-blush shadow-card space-y-6">
        <h2 className="font-serif text-2xl font-semibold text-espresso">
          Step-by-Step Application Guide
        </h2>

        <div className="space-y-6">
          <div className="flex gap-4 items-start">
            <span className="w-8 h-8 rounded-full bg-rose text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
              1
            </span>
            <div className="space-y-1">
              <h3 className="font-serif font-semibold text-base text-espresso">
                Prep &amp; Push Cuticles
              </h3>
              <p className="text-xs text-espresso/70 leading-relaxed">
                Use the wooden cuticle stick to gently push back cuticles. Buff your natural nail surface lightly with the mini buffer to remove natural shine.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <span className="w-8 h-8 rounded-full bg-rose text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
              2
            </span>
            <div className="space-y-1">
              <h3 className="font-serif font-semibold text-base text-espresso">
                Dehydrate with Alcohol Prep Pad
              </h3>
              <p className="text-xs text-espresso/70 leading-relaxed">
                Wipe all natural nails thoroughly with an alcohol sanitizing pad. Allow to air dry for 10 seconds. Do not touch your nails with fingertips after this step.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <span className="w-8 h-8 rounded-full bg-rose text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
              3
            </span>
            <div className="space-y-1">
              <h3 className="font-serif font-semibold text-base text-espresso">
                Apply Adhesive
              </h3>
              <p className="text-xs text-espresso/70 leading-relaxed">
                If using jelly tabs, apply the tab directly to your natural nail and peel the clear backing. If using liquid glue, place 1 small drop on your natural nail and 1 drop on the press-on back.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <span className="w-8 h-8 rounded-full bg-rose text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
              4
            </span>
            <div className="space-y-1">
              <h3 className="font-serif font-semibold text-base text-espresso">
                Align &amp; Hold Firmly
              </h3>
              <p className="text-xs text-espresso/70 leading-relaxed">
                Set the press-on tip at a 45-degree angle under your cuticle line, roll downward toward the free edge, and press down firmly for 30 seconds without moving.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safe Removal Warning */}
      <section className="bg-rose/10 p-6 sm:p-8 rounded-2xl border border-rose/30 space-y-3">
        <div className="flex items-center gap-2 text-rose font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-rose" />
          <span>Crucial Safe Removal Instructions</span>
        </div>
        <p className="text-xs text-espresso/80 leading-relaxed">
          <strong>NEVER rip, force, or pry off press-on nails.</strong> Forcing nails off can peel away natural keratin layers and cause thinning.
        </p>
        <p className="text-xs text-espresso/80 leading-relaxed">
          <strong>The Safe Technique:</strong> Soak hands in a bowl of warm soapy water with a tablespoon of olive oil or cuticle oil for 10–12 minutes. The water and oil will loosen the adhesive bond, allowing the tips to slide off naturally with gentle nudging from the wooden stick.
        </p>
      </section>

      <div className="text-center pt-2">
        <Link href="/shop">
          <Button variant="primary" size="lg" className="gap-2">
            <span>Explore Handcrafted Nail Sets</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

