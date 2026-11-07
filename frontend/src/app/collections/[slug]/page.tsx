import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { catalogueService } from "@/services/catalogueService";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { PrototypeNoticeBanner } from "@/components/layout/PrototypeNoticeBanner";
import { Sparkles, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await catalogueService.getCollectionBySlug(slug).catch(() => null);

  if (!collection) {
    return { title: "Collection Not Found" };
  }

  return {
    title: collection.name,
    description: collection.description || collection.tagline || `Browse ${collection.name} at The Nail Lounge.`,
    alternates: {
      canonical: `/collections/${slug}`,
    },
    openGraph: {
      title: `${collection.name} | The Nail Lounge`,
      description: collection.description || collection.tagline,
      images: collection.bannerImage ? [{ url: collection.bannerImage }] : [],
    },
  };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await catalogueService.getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const products = await catalogueService.getProductsByCollection(slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <PrototypeNoticeBanner className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-6" />

      <Breadcrumbs
        items={[
          { label: "Collections", href: "/collections" },
          { label: collection.name },
        ]}
      />

      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-espresso text-white border border-blush/60 min-h-[280px] sm:min-h-[340px] flex items-end">
        <Image
          src={collection.bannerImage}
          alt={collection.name}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/40 to-transparent" />

        <div className="relative z-10 p-6 sm:p-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-champagne">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Studio Edit</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold leading-tight text-ivory">
            {collection.name}
          </h1>
          <p className="text-xs sm:text-sm text-ivory/80 leading-relaxed">
            {collection.description}
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-blush/60">
          <p className="text-xs font-semibold uppercase tracking-wider text-espresso/70">
            {products.length} {products.length === 1 ? "Curated Style" : "Curated Styles"}
          </p>
          <Link
            href="/collections"
            className="text-xs font-semibold text-rose hover:text-rose-hover flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>All Collections</span>
          </Link>
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  );
}

