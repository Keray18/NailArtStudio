import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { catalogueService } from "@/services/catalogueService";
import { ArrowRight, Sparkles } from "lucide-react";
import { PrototypeNoticeBanner } from "@/components/layout/PrototypeNoticeBanner";

export default async function CollectionsPage() {
  const collections = await catalogueService.getCollections();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <PrototypeNoticeBanner className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-6" />

      <Breadcrumbs items={[{ label: "Thematic Edits & Collections" }]} />

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-rose">
          Curated Visual Lookbooks
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-espresso">
          Thematic Nail Collections
        </h1>
        <p className="text-xs sm:text-sm text-espresso/70 leading-relaxed">
          From opulent wedding suites to minimalist clean-girl staples, browse handcrafted designs curated around singular aesthetic moments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {collections.map((col) => (
          <Link
            key={col.slug}
            href={`/collections/${col.slug}`}
            className="group relative rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] bg-ivory-subtle border border-blush shadow-card"
          >
            <Image
              src={col.bannerImage}
              alt={col.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/40 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-champagne" />
                <span className="text-xs font-bold tracking-widest uppercase text-champagne">
                  {col.productCount} Handcrafted Styles
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold leading-tight group-hover:text-blush transition-colors">
                {col.name}
              </h2>
              <p className="text-xs sm:text-sm text-white/80 line-clamp-2 max-w-lg">
                {col.description}
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-rose-hover uppercase tracking-wider text-blush group-hover:text-white transition-colors">
                <span>Explore The Lookbook</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

