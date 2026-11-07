import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { catalogueService } from "@/services/catalogueService";
import { ProductDetailClient } from "@/components/pdp/ProductDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await catalogueService.getProductBySlug(slug).catch(() => null);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested handcrafted style is not available in our catalogue.",
    };
  }

  const primaryImage = product.images[0]?.url;

  return {
    title: product.name,
    description: product.shortDescription || product.description.slice(0, 160),
    alternates: {
      canonical: `/products/${slug}`,
    },
    openGraph: {
      title: `${product.name} | The Nail Lounge`,
      description: product.shortDescription,
      images: primaryImage ? [{ url: primaryImage, alt: product.name }] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await catalogueService.getProductBySlug(slug).catch(() => null);

  if (!product) {
    notFound();
  }

  const related = await catalogueService
    .getProductsByCategory(product.category.slug)
    .then((list) => list.filter((p) => p.id !== product.id).slice(0, 4))
    .catch(() => []);

  return <ProductDetailClient product={product} relatedProducts={related} />;
}
