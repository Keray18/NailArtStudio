import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { catalogueService } from "@/services/catalogueService";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { CategorySlug } from "@/types";
import { PrototypeNoticeBanner } from "@/components/layout/PrototypeNoticeBanner";
import { ArrowLeft } from "lucide-react";

const CATEGORY_METADATA: Record<CategorySlug, { name: string; description: string }> = {
  "press-on-nails": {
    name: "Press-on Nails",
    description: "Handcrafted salon-grade press-on tips in Almond, Coffin, Square, Oval, and Stiletto shapes. Available in Multi-Size 24-piece sets and custom sizes.",
  },
  "nail-polish-gel": {
    name: "Nail Polish & UV Gel Systems",
    description: "High-pigment professional gel lacquers, no-wipe top coats, and breathable air-dry lacquers formulated for durability.",
  },
  "nail-accessories": {
    name: "Nail Art & Accessories",
    description: "Ultra-fine glazed chrome powders, 3D charms, French tip smile guides, and crystal rhinestones for creative manicures.",
  },
  "nail-tools": {
    name: "Nail-Art Tools & Lamps",
    description: "Nano-glass files, surgical stainless steel cuticle pushers, detail liner brushes, and portable UV curing lamps.",
  },
  "application-kits": {
    name: "Application & Care Kits",
    description: "Everything you need for seamless application and gentle removal: adhesive jelly tabs, dehydrating wipes, and complete starter kits.",
  },
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = CATEGORY_METADATA[slug as CategorySlug];

  if (!meta) {
    notFound();
  }

  const products = await catalogueService.getProductsByCategory(slug as CategorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PrototypeNoticeBanner className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-6" />

      <Breadcrumbs
        items={[
          { label: "Catalogue", href: "/shop" },
          { label: meta.name },
        ]}
      />

      <div className="border-b border-blush/60 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-rose">
            Category Showcase
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-espresso">
            {meta.name}
          </h1>
          <p className="text-xs sm:text-sm text-espresso/70 leading-relaxed">
            {meta.description}
          </p>
        </div>

        <Link
          href="/shop"
          className="text-xs font-semibold text-rose hover:text-rose-hover flex items-center gap-1 self-start md:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>View All 36 Styles</span>
        </Link>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}

