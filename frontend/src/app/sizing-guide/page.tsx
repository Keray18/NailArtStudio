"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Ruler, Download, CheckCircle2, Sparkles, HelpCircle } from "lucide-react";
import { PrototypeNoticeBanner } from "@/components/layout/PrototypeNoticeBanner";

export default function SizingGuidePage() {
  const [thumb, setThumb] = useState("");
  const [index, setIndex] = useState("");
  const [middle, setMiddle] = useState("");
  const [ring, setRing] = useState("");
  const [pinky, setPinky] = useState("");
  const [calcResult, setCalcResult] = useState<string | null>(null);

  const calculateSize = (e: React.FormEvent) => {
    e.preventDefault();
    const t = parseFloat(thumb) || 0;
    const i = parseFloat(index) || 0;
    const m = parseFloat(middle) || 0;
    const r = parseFloat(ring) || 0;
    const p = parseFloat(pinky) || 0;

    if (!t || !i || !m || !r || !p) {
      setCalcResult("Please enter measurements for all 5 fingers.");
      return;
    }

    if (t <= 14 && p <= 7) {
      setCalcResult("Recommended Size: Extra Small (XS)");
    } else if (t <= 15 && p <= 8) {
      setCalcResult("Recommended Size: Small (S)");
    } else if (t <= 16 && p <= 9) {
      setCalcResult("Recommended Size: Medium (M)");
    } else {
      setCalcResult("Recommended Size: Large (L)");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      <PrototypeNoticeBanner className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-6" />

      <Breadcrumbs items={[{ label: "Guidance" }, { label: "Sizing & Fit Guide" }]} />

      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-rose">
          Fit Reassurance
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-espresso">
          Nail Sizing &amp; Measurement Guide
        </h1>
        <p className="text-xs sm:text-sm text-espresso/70 leading-relaxed">
          Follow our 2-minute measurement guide to discover your tailored size, or explore our Multi-Size 24-Piece Sets for an instant fit with zero measuring required.
        </p>
      </div>

      {/* Sizing Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border-2 border-rose shadow-card space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-rose/10 text-rose text-xs font-bold px-2.5 py-1 rounded-full uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recommended for Beginners</span>
          </div>
          <h2 className="font-serif text-2xl font-semibold text-espresso">
            Multi-Size 24-Piece Sets
          </h2>
          <p className="text-xs text-espresso/70 leading-relaxed">
            Contains 24 nails across 12 distinct widths (2 of each size). Designed to fit diverse nail bed shapes out of the box with zero measuring needed.
          </p>
          <ul className="text-xs text-espresso/80 space-y-1.5 list-disc list-inside pt-1">
            <li>Includes 12 sizes with 2 of each number</li>
            <li>No household tape or measuring tools required</li>
            <li>Spare replacement nails included in every box</li>
          </ul>
          <div className="pt-2">
            <Link href="/category/press-on-nails">
              <Button variant="primary" size="sm" fullWidth>
                Shop Multi-Size 24-Piece Sets
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-blush shadow-card space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-blush text-espresso text-xs font-bold px-2.5 py-1 rounded-full uppercase">
            <Ruler className="w-3.5 h-3.5 text-rose" />
            <span>Custom Tailored</span>
          </div>
          <h2 className="font-serif text-2xl font-semibold text-espresso">
            Custom Sized 10-Piece Sets
          </h2>
          <p className="text-xs text-espresso/70 leading-relaxed">
            Ten precision nails tailored to your specific hand dimensions (XS, S, M, L). Ideal for experienced press-on wearers who know their exact sizes.
          </p>
          <ul className="text-xs text-espresso/80 space-y-1.5 list-disc list-inside pt-1">
            <li>Saves material; compact luxury packaging</li>
            <li>Requires measuring your 5 fingers in millimeters</li>
            <li>Available in standard salon sizes XS through L</li>
          </ul>
          <div className="pt-2">
            <Link href="/shop">
              <Button variant="outline" size="sm" fullWidth>
                Shop Custom Sized Sets
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Measurement Steps */}
      <section className="bg-ivory-subtle/50 p-6 sm:p-8 rounded-2xl border border-blush space-y-4">
        <h2 className="font-serif text-2xl font-semibold text-espresso">
          How to Measure Your Natural Nails
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2">
            <span className="w-7 h-7 rounded-full bg-rose text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="font-serif font-semibold text-base text-espresso">Apply Tape</h3>
            <p className="text-xs text-espresso/70 leading-relaxed">
              Place clear tape horizontally across the widest section of your natural nail bed, pressing into the lateral sidewalls.
            </p>
          </div>

          <div className="space-y-2">
            <span className="w-7 h-7 rounded-full bg-rose text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h3 className="font-serif font-semibold text-base text-espresso">Mark Sidewalls</h3>
            <p className="text-xs text-espresso/70 leading-relaxed">
              Use a fine-tip pen to mark the exact edges where your nail meets your skin on both sides.
            </p>
          </div>

          <div className="space-y-2">
            <span className="w-7 h-7 rounded-full bg-rose text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h3 className="font-serif font-semibold text-base text-espresso">Measure with Ruler</h3>
            <p className="text-xs text-espresso/70 leading-relaxed">
              Remove the tape and place it flat against a millimeter (mm) ruler to count the millimeters between marks.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Sizing Calculator */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-blush shadow-card space-y-4">
        <div className="flex items-center gap-2">
          <Ruler className="w-5 h-5 text-rose" />
          <h2 className="font-serif text-xl sm:text-2xl font-semibold text-espresso">
            Interactive Sizing Calculator
          </h2>
        </div>
        <p className="text-xs text-espresso/70">
          Enter your natural nail bed widths in millimeters (mm) to calculate your recommended size.
        </p>

        <form onSubmit={calculateSize} className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div>
            <label className="text-[11px] font-semibold uppercase text-espresso/70 block mb-1">
              Thumb
            </label>
            <input
              type="number"
              step="0.5"
              placeholder="e.g. 15"
              value={thumb}
              onChange={(e) => setThumb(e.target.value)}
              className="w-full bg-ivory border border-blush rounded px-3 py-2 text-xs focus-ring"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase text-espresso/70 block mb-1">
              Index
            </label>
            <input
              type="number"
              step="0.5"
              placeholder="e.g. 11"
              value={index}
              onChange={(e) => setIndex(e.target.value)}
              className="w-full bg-ivory border border-blush rounded px-3 py-2 text-xs focus-ring"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase text-espresso/70 block mb-1">
              Middle
            </label>
            <input
              type="number"
              step="0.5"
              placeholder="e.g. 12"
              value={middle}
              onChange={(e) => setMiddle(e.target.value)}
              className="w-full bg-ivory border border-blush rounded px-3 py-2 text-xs focus-ring"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase text-espresso/70 block mb-1">
              Ring
            </label>
            <input
              type="number"
              step="0.5"
              placeholder="e.g. 11"
              value={ring}
              onChange={(e) => setRing(e.target.value)}
              className="w-full bg-ivory border border-blush rounded px-3 py-2 text-xs focus-ring"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase text-espresso/70 block mb-1">
              Pinky
            </label>
            <input
              type="number"
              step="0.5"
              placeholder="e.g. 8"
              value={pinky}
              onChange={(e) => setPinky(e.target.value)}
              className="w-full bg-ivory border border-blush rounded px-3 py-2 text-xs focus-ring"
            />
          </div>

          <div className="col-span-2 sm:col-span-5 pt-2">
            <Button type="submit" variant="primary" size="md">
              Calculate Recommended Size
            </Button>
          </div>
        </form>

        {calcResult && (
          <div className="p-4 bg-blush/30 rounded-xl border border-blush text-espresso font-serif text-base font-semibold mt-4">
            {calcResult}
          </div>
        )}
      </section>

      {/* Sizing Matrix Table */}
      <section className="bg-white p-6 rounded-2xl border border-blush shadow-card space-y-4">
        <h2 className="font-serif text-xl font-semibold text-espresso">
          Standard Sizing Matrix (Thumb to Pinky in mm)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-blush bg-ivory-subtle">
                <th className="py-2.5 px-3 font-semibold">Size</th>
                <th className="py-2.5 px-3 font-semibold">Thumb</th>
                <th className="py-2.5 px-3 font-semibold">Index</th>
                <th className="py-2.5 px-3 font-semibold">Middle</th>
                <th className="py-2.5 px-3 font-semibold">Ring</th>
                <th className="py-2.5 px-3 font-semibold">Pinky</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blush/40">
              <tr>
                <td className="py-2.5 px-3 font-bold text-rose">Extra Small (XS)</td>
                <td className="py-2.5 px-3">14mm</td>
                <td className="py-2.5 px-3">10mm</td>
                <td className="py-2.5 px-3">11mm</td>
                <td className="py-2.5 px-3">10mm</td>
                <td className="py-2.5 px-3">7mm</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-rose">Small (S)</td>
                <td className="py-2.5 px-3">15mm</td>
                <td className="py-2.5 px-3">11mm</td>
                <td className="py-2.5 px-3">12mm</td>
                <td className="py-2.5 px-3">11mm</td>
                <td className="py-2.5 px-3">8mm</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-rose">Medium (M)</td>
                <td className="py-2.5 px-3">16mm</td>
                <td className="py-2.5 px-3">12mm</td>
                <td className="py-2.5 px-3">13mm</td>
                <td className="py-2.5 px-3">12mm</td>
                <td className="py-2.5 px-3">9mm</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-rose">Large (L)</td>
                <td className="py-2.5 px-3">18mm</td>
                <td className="py-2.5 px-3">13mm</td>
                <td className="py-2.5 px-3">14mm</td>
                <td className="py-2.5 px-3">13mm</td>
                <td className="py-2.5 px-3">10mm</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

