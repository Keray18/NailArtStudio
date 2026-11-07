"use client";

import React, { useState, useEffect, useMemo, Suspense, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { MobileFilterDrawer } from "@/components/catalog/MobileFilterDrawer";
import { SortDropdown } from "@/components/catalog/SortDropdown";
import { catalogueService, ProductFilters } from "@/services/catalogueService";
import { Product, CategorySlug, NailShape, NailLength, NailFinish } from "@/types";
import { Filter, X } from "lucide-react";
import { PrototypeNoticeBanner } from "@/components/layout/PrototypeNoticeBanner";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse initial filters from URL query parameters
  const parseFiltersFromParams = useCallback((): ProductFilters => {
    const category = searchParams.get("category") as CategorySlug | null;
    const collection = searchParams.get("collection") || undefined;
    const shape = searchParams.get("shape") as NailShape | null;
    const length = searchParams.get("length") as NailLength | null;
    const finish = searchParams.get("finish") as NailFinish | null;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const inStockOnly = searchParams.get("inStockOnly") === "true";
    const sortBy = (searchParams.get("sort") || "featured") as "featured" | "price-asc" | "price-desc" | "newest";

    return {
      category: category || undefined,
      collection,
      shape: shape || undefined,
      length: length || undefined,
      finish: finish || undefined,
      minPrice,
      maxPrice,
      inStockOnly,
      sortBy,
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<ProductFilters>(parseFiltersFromParams);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync internal state when URL search params change (e.g., browser back/forward)
  useEffect(() => {
    setFilters(parseFiltersFromParams());
  }, [parseFiltersFromParams]);

  // Update URL search parameters when filters change
  const updateUrlParams = useCallback(
    (newFilters: ProductFilters) => {
      const params = new URLSearchParams();

      if (newFilters.category) params.set("category", newFilters.category);
      if (newFilters.collection) params.set("collection", newFilters.collection);
      if (newFilters.shape) params.set("shape", newFilters.shape);
      if (newFilters.length) params.set("length", newFilters.length);
      if (newFilters.finish) params.set("finish", newFilters.finish);
      if (newFilters.minPrice !== undefined) params.set("minPrice", String(newFilters.minPrice));
      if (newFilters.maxPrice !== undefined) params.set("maxPrice", String(newFilters.maxPrice));
      if (newFilters.inStockOnly) params.set("inStockOnly", "true");
      if (newFilters.sortBy && newFilters.sortBy !== "featured") params.set("sort", newFilters.sortBy);

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(targetUrl, { scroll: false });
    },
    [pathname, router]
  );

  const handleFilterChange = (newFilters: ProductFilters | ((prev: ProductFilters) => ProductFilters)) => {
    setFilters((prev) => {
      const next = typeof newFilters === "function" ? newFilters(prev) : newFilters;
      updateUrlParams(next);
      return next;
    });
  };

  // Fetch products whenever filters change
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    catalogueService
      .getProducts(filters)
      .then((data) => {
        if (isMounted) {
          setProducts(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProducts([]);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleResetFilters = () => {
    handleFilterChange({ sortBy: "featured" });
  };

  // Active filter pills for quick dismissal
  const activePills = useMemo(() => {
    const list: { label: string; clear: () => void }[] = [];

    if (filters.category) {
      list.push({
        label: `Category: ${filters.category.replace(/-/g, " ")}`,
        clear: () => handleFilterChange((prev) => ({ ...prev, category: undefined })),
      });
    }
    if (filters.collection) {
      list.push({
        label: `Collection: ${filters.collection.replace(/-/g, " ")}`,
        clear: () => handleFilterChange((prev) => ({ ...prev, collection: undefined })),
      });
    }
    if (filters.shape) {
      list.push({
        label: `Shape: ${filters.shape}`,
        clear: () => handleFilterChange((prev) => ({ ...prev, shape: undefined })),
      });
    }
    if (filters.length) {
      list.push({
        label: `Length: ${filters.length}`,
        clear: () => handleFilterChange((prev) => ({ ...prev, length: undefined })),
      });
    }
    if (filters.finish) {
      list.push({
        label: `Finish: ${filters.finish}`,
        clear: () => handleFilterChange((prev) => ({ ...prev, finish: undefined })),
      });
    }
    if (filters.inStockOnly) {
      list.push({
        label: "In Stock Only",
        clear: () => handleFilterChange((prev) => ({ ...prev, inStockOnly: false })),
      });
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      list.push({
        label: `Price: ${filters.minPrice ? `₹${filters.minPrice}` : "₹0"} - ${
          filters.maxPrice ? `₹${filters.maxPrice}` : "Above"
        }`,
        clear: () =>
          handleFilterChange((prev) => ({ ...prev, minPrice: undefined, maxPrice: undefined })),
      });
    }

    return list;
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PrototypeNoticeBanner className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-6" />

      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Catalogue", href: "/shop" }, { label: "All Styles" }]} />

      {/* Page Title & Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-blush/60">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-espresso">
            All Handcrafted Collections
          </h1>
          <p className="text-xs sm:text-sm text-espresso/70 mt-1">
            Showing {products.length} {products.length === 1 ? "style" : "styles"} across press-ons, gels, and nail tools
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          {/* Mobile Filter Trigger Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-blush rounded-md text-xs font-semibold text-espresso hover:bg-blush/20 focus-ring min-h-[40px]"
          >
            <Filter className="w-3.5 h-3.5 text-rose" />
            <span>Filters ({activePills.length})</span>
          </button>

          {/* Sort Dropdown */}
          <SortDropdown
            value={filters.sortBy || "featured"}
            onChange={(sort) => handleFilterChange((prev) => ({ ...prev, sortBy: sort }))}
          />
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {activePills.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
          <span className="text-xs text-espresso/60 font-medium mr-1">Active:</span>
          {activePills.map((pill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 bg-blush/50 text-espresso text-xs font-medium px-2.5 py-1 rounded-full border border-blush"
            >
              <span className="capitalize">{pill.label}</span>
              <button
                onClick={pill.clear}
                className="hover:text-status-error focus-ring rounded-full"
                aria-label={`Clear ${pill.label} filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={handleResetFilters}
            className="text-xs text-rose hover:text-rose-hover underline ml-2 font-medium"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Catalog Layout (Sidebar + Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Left Sidebar (1/4 width) */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-28 bg-white p-5 rounded-xl border border-blush shadow-card">
          <FilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </aside>

        {/* Main Product Grid (3/4 width) */}
        <div className="lg:col-span-3">
          <ProductGrid
            products={products}
            isLoading={isLoading}
            onClearFilters={handleResetFilters}
          />
        </div>
      </div>

      {/* Mobile Slide-Up Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        resultCount={products.length}
      />
    </div>
  );
}

export default function ShopAllPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="w-8 h-8 border-2 border-rose border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-serif text-sm text-espresso/60">Loading Catalogue...</p>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
