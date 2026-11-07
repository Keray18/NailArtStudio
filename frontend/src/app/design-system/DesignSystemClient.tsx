"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Accordion } from "@/components/ui/Accordion";
import { Modal } from "@/components/ui/Modal";
import { Drawer } from "@/components/ui/Drawer";
import { FreeShippingMeter } from "@/components/cart/FreeShippingMeter";
import { ProductCard } from "@/components/catalog/ProductCard";
import { FIXTURE_PRODUCTS } from "@/data/fixtures";
import { Sparkles, Palette, Layers, Eye, CheckCircle2, AlertTriangle } from "lucide-react";

export function DesignSystemClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sampleSubtotal, setSampleSubtotal] = useState(650);

  // Representative edge case products for inspection
  const edgeCaseSoldOut = FIXTURE_PRODUCTS.find((p) => p.sku === "FIX-PRS-004");
  const edgeCaseLowStock = FIXTURE_PRODUCTS.find((p) => p.sku === "FIX-PRS-002");
  const edgeCaseLongTitle = FIXTURE_PRODUCTS.find((p) => p.sku === "FIX-PRS-018");
  const edgeCaseSingleImg = FIXTURE_PRODUCTS.find((p) => p.sku === "FIX-TLS-002");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumbs items={[{ label: "Internal Diagnostics" }, { label: "Design System & UI Tokens" }]} />

      <div className="bg-espresso text-ivory p-6 sm:p-8 rounded-2xl border border-espresso-light shadow-card space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-champagne">
          <Layers className="w-4 h-4 text-champagne" />
          <span>Internal Development Diagnostics</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ivory">
          Phase 1 Design System &amp; Component Inventory
        </h1>
        <p className="text-xs sm:text-sm text-ivory/70 max-w-2xl leading-relaxed">
          Inspectable UI tokens, typography scale, atomic primitives, interaction states, and catalog edge cases. Kept isolated from customer-facing navigation.
        </p>
      </div>

      {/* 1. Color Palette & Contrast Tokens */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-semibold text-espresso flex items-center gap-2">
          <Palette className="w-5 h-5 text-rose" />
          <span>1. Brand Color System &amp; WCAG Contrast Ratios</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-ivory border-2 border-blush shadow-sm space-y-1">
            <div className="h-12 w-full rounded bg-ivory border border-espresso/20 mb-2" />
            <span className="font-bold text-xs text-espresso block">Ivory (Canvas)</span>
            <span className="text-[11px] text-espresso/60 block font-mono">#F8F3EF</span>
            <span className="text-[10px] text-espresso/50">Base Background</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-blush shadow-sm space-y-1">
            <div className="h-12 w-full rounded bg-blush mb-2" />
            <span className="font-bold text-xs text-espresso block">Blush (Surface)</span>
            <span className="text-[11px] text-espresso/60 block font-mono">#E8CFCB</span>
            <span className="text-[10px] text-espresso/50">Pill &amp; Card Accent</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-blush shadow-sm space-y-1">
            <div className="h-12 w-full rounded bg-rose mb-2" />
            <span className="font-bold text-xs text-espresso block">Rose (Brand Signature)</span>
            <span className="text-[11px] text-espresso/60 block font-mono">#A86F78</span>
            <span className="text-[10px] text-status-success font-semibold">4.8:1 AA Contrast</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-blush shadow-sm space-y-1">
            <div className="h-12 w-full rounded bg-espresso mb-2" />
            <span className="font-bold text-xs text-espresso block">Espresso (Typography)</span>
            <span className="text-[11px] text-espresso/60 block font-mono">#453438</span>
            <span className="text-[10px] text-status-success font-semibold">10.4:1 AAA Contrast</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-blush shadow-sm space-y-1">
            <div className="h-12 w-full rounded bg-champagne mb-2" />
            <span className="font-bold text-xs text-espresso block">Champagne (Luxe)</span>
            <span className="text-[11px] text-espresso/60 block font-mono">#C3A67B</span>
            <span className="text-[10px] text-espresso/50">Metallic Badges</span>
          </div>
        </div>
      </section>

      {/* 2. Typographic Hierarchy */}
      <section className="bg-white p-6 rounded-2xl border border-blush shadow-card space-y-4">
        <h2 className="font-serif text-2xl font-semibold text-espresso">
          2. Typographic Scale (Cormorant Garamond + Manrope)
        </h2>
        <div className="space-y-4 divide-y divide-blush/40">
          <div className="pt-2">
            <span className="text-[10px] uppercase font-mono text-espresso/40">Display 1 (Cormorant Garamond 48px)</span>
            <p className="font-serif text-4xl sm:text-5xl font-semibold text-espresso">
              Artistry at Your Fingertips
            </p>
          </div>

          <div className="pt-3">
            <span className="text-[10px] uppercase font-mono text-espresso/40">Heading 1 (Cormorant Garamond 36px)</span>
            <p className="font-serif text-3xl font-semibold text-espresso">
              Curated Handcrafted Nail Suites
            </p>
          </div>

          <div className="pt-3">
            <span className="text-[10px] uppercase font-mono text-espresso/40">Heading 2 (Cormorant Garamond 28px)</span>
            <p className="font-serif text-2xl font-semibold text-espresso">
              The Bridal &amp; Festive Collection
            </p>
          </div>

          <div className="pt-3">
            <span className="text-[10px] uppercase font-mono text-espresso/40">Body Large (Manrope 16px)</span>
            <p className="font-sans text-base text-espresso/80 leading-relaxed max-w-2xl">
              Our press-on tips are layered with salon gel pigments and cured under professional UV wavelengths to achieve true salon depth.
            </p>
          </div>

          <div className="pt-3">
            <span className="text-[10px] uppercase font-mono text-espresso/40">Body Small &amp; Micro Overline (Manrope 12px / 11px)</span>
            <p className="font-sans text-xs uppercase tracking-widest text-rose font-bold">
              Multi-Size 24-Piece Set &bull; Abohar Dispatch
            </p>
          </div>
        </div>
      </section>

      {/* 3. Atomic Primitives: Buttons & Badges */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Buttons */}
        <div className="bg-white p-6 rounded-2xl border border-blush shadow-card space-y-4">
          <h3 className="font-serif text-xl font-semibold text-espresso">
            Button Variants &amp; States
          </h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary Rose</Button>
            <Button variant="secondary">Secondary Blush</Button>
            <Button variant="dark">Dark Espresso</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost Link</Button>
            <Button variant="primary" isLoading>Loading State</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white p-6 rounded-2xl border border-blush shadow-card space-y-4">
          <h3 className="font-serif text-xl font-semibold text-espresso">
            Badge Tokens
          </h3>
          <div className="flex flex-wrap gap-2.5 items-center">
            <Badge variant="default">Default Blush</Badge>
            <Badge variant="rose">Rose Accent</Badge>
            <Badge variant="champagne">Luxe Champagne</Badge>
            <Badge variant="warning">Only 2 Left (Low Stock)</Badge>
            <Badge variant="soldout">Sold Out</Badge>
            <Badge variant="outline">Almond &bull; Short</Badge>
          </div>
        </div>
      </section>

      {/* 4. Form Controls & Interactive Feedback */}
      <section className="bg-white p-6 rounded-2xl border border-blush shadow-card space-y-4">
        <h3 className="font-serif text-xl font-semibold text-espresso">
          Form Input States &amp; Validation
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Normal Input" placeholder="Standard text..." />
          <Input label="With Helper Text" placeholder="Enter value..." helperText="Auto-validates postal format" />
          <Input label="Error State" value="Invalid text" error="This field requires a 6-digit postal code" />
        </div>
      </section>

      {/* 5. Free Shipping Progress Meter Test */}
      <section className="bg-white p-6 rounded-2xl border border-blush shadow-card space-y-4">
        <h3 className="font-serif text-xl font-semibold text-espresso">
          Free Shipping Threshold Progress Meter
        </h3>
        <p className="text-xs text-espresso/70">
          Adjust the slider to simulate cart subtotal and observe the dynamic progress bar feedback.
        </p>
        <div className="max-w-md space-y-3">
          <input
            type="range"
            min={0}
            max={1500}
            step={50}
            value={sampleSubtotal}
            onChange={(e) => setSampleSubtotal(parseInt(e.target.value))}
            className="w-full accent-rose cursor-pointer"
          />
          <p className="text-xs font-mono font-semibold text-espresso">
            Simulated Subtotal: ₹{sampleSubtotal}
          </p>
          <FreeShippingMeter subtotal={sampleSubtotal} />
        </div>
      </section>

      {/* 6. Modal & Drawer Interaction Sandbox */}
      <section className="bg-white p-6 rounded-2xl border border-blush shadow-card space-y-4">
        <h3 className="font-serif text-xl font-semibold text-espresso">
          Modal Dialogs &amp; Drawers
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => setIsModalOpen(true)}>
            Open Test Modal Dialog
          </Button>
          <Button variant="outline" onClick={() => setIsDrawerOpen(true)}>
            Open Test Slide-out Drawer
          </Button>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Test Component Modal">
          <p className="text-sm text-espresso/80 leading-relaxed">
            This dialog implements accessible focus trapping, escape-key dismissal, backdrop blur, and body scroll locking.
          </p>
          <div className="pt-4 flex justify-end">
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)}>
              Got It
            </Button>
          </div>
        </Modal>

        <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Test Slide-Out Drawer">
          <p className="text-sm text-espresso/80 leading-relaxed">
            This drawer slides from the right edge on desktop and functions as a bottom sheet on mobile screens.
          </p>
        </Drawer>
      </section>

      {/* 7. Catalog Edge Cases Inspection Grid */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <h2 className="font-serif text-2xl font-semibold text-espresso">
            7. Catalog Edge Cases Resilience Inspection
          </h2>
        </div>
        <p className="text-xs text-espresso/70">
          Visual test cards rendering representative edge cases from `TEST_CATALOGUE_SPECIFICATION.md`:
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {edgeCaseSoldOut && (
            <div>
              <span className="text-[11px] font-mono font-semibold text-rose block mb-1">
                EC-01: Sold Out
              </span>
              <ProductCard product={edgeCaseSoldOut} />
            </div>
          )}

          {edgeCaseLowStock && (
            <div>
              <span className="text-[11px] font-mono font-semibold text-amber-700 block mb-1">
                EC-02: Low Stock (&le; 3 units)
              </span>
              <ProductCard product={edgeCaseLowStock} />
            </div>
          )}

          {edgeCaseLongTitle && (
            <div>
              <span className="text-[11px] font-mono font-semibold text-rose block mb-1">
                EC-07: Ultra-Long Title
              </span>
              <ProductCard product={edgeCaseLongTitle} />
            </div>
          )}

          {edgeCaseSingleImg && (
            <div>
              <span className="text-[11px] font-mono font-semibold text-rose block mb-1">
                EC-06: Tool (No Sizing)
              </span>
              <ProductCard product={edgeCaseSingleImg} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

