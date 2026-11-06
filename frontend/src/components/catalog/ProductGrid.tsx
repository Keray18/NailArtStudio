import React from "react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptySubtitle?: string;
  onClearFilters?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  emptyTitle = "No matching styles found",
  emptySubtitle = "Try adjusting your filters or search query to explore other handcrafted sets.",
  onClearFilters,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col bg-white rounded-lg border border-blush/40 overflow-hidden">
            <Skeleton className="aspect-[4/5] w-full" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-4 w-1/4 mt-2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-blush p-8 sm:p-12 text-center max-w-xl mx-auto my-8">
        <div className="w-12 h-12 rounded-full bg-blush/40 flex items-center justify-center mx-auto mb-4 text-rose">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-xl sm:text-2xl font-semibold text-espresso mb-2">
          {emptyTitle}
        </h3>
        <p className="text-sm text-espresso/70 leading-relaxed mb-6">
          {emptySubtitle}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {onClearFilters && (
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              Clear All Filters
            </Button>
          )}
          <Link href="/shop">
            <Button variant="primary" size="sm">
              View All Catalogue
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

