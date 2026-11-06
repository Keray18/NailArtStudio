"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { catalogueService } from "@/services/catalogueService";
import { Product } from "@/types";
import { Search, X, Sparkles } from "lucide-react";
import { PrototypeNoticeBanner } from "@/components/layout/PrototypeNoticeBanner";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery.trim()) {
      setIsLoading(true);
      catalogueService.searchProducts(initialQuery).then((data) => {
        setResults(data);
        setIsLoading(false);
        setSearched(true);
      });
    } else {
      setResults([]);
      setSearched(false);
    }
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (keyword: string) => {
    setQuery(keyword);
    router.push(`/search?q=${encodeURIComponent(keyword)}`);
  };

  const suggestions = ["Almond", "Glazed Chrome", "Bridal", "Micro-French", "Short Square", "Coffin", "Application Kit"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <PrototypeNoticeBanner className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-6" />

      <Breadcrumbs items={[{ label: "Catalogue", href: "/shop" }, { label: "Search" }]} />

      {/* Search Input Box */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-espresso">
          Search The Catalogue
        </h1>
        <p className="text-xs sm:text-sm text-espresso/70">
          Find press-on shapes, finishes, gel systems, or application accessories.
        </p>

        <form onSubmit={handleSearchSubmit} className="relative max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search styles (e.g. French, Almond, Chrome)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white border border-blush rounded-full pl-12 pr-10 py-3 text-sm text-espresso focus-ring shadow-sm"
          />
          <Search className="w-5 h-5 text-espresso/40 absolute left-4 top-1/2 -translate-y-1/2" />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                router.push("/search");
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-espresso/40 hover:text-espresso"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 text-xs">
          <span className="text-espresso/50 font-medium">Popular:</span>
          {suggestions.map((sug) => (
            <button
              key={sug}
              onClick={() => handleSuggestionClick(sug)}
              className="px-2.5 py-1 rounded-full bg-blush/40 hover:bg-rose hover:text-white text-espresso transition-colors text-xs"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      {searched && (
        <div className="border-b border-blush/60 pb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-espresso/70">
            {results.length} {results.length === 1 ? "Result" : "Results"} for &ldquo;{initialQuery}&rdquo;
          </p>
          {results.length > 0 && (
            <button
              onClick={() => {
                setQuery("");
                router.push("/search");
              }}
              className="text-xs text-rose hover:underline font-medium"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Product Grid Results */}
      {searched ? (
        <ProductGrid
          products={results}
          isLoading={isLoading}
          emptyTitle={`No styles found for "${initialQuery}"`}
          emptySubtitle="Try searching with a broader term such as 'Almond', 'Nude', or explore our full collection."
        />
      ) : (
        <div className="py-12 text-center text-espresso/60 text-xs">
          <Sparkles className="w-6 h-6 mx-auto mb-2 text-rose/50" />
          <span>Enter a search term above to browse specific shapes and finishes.</span>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-espresso/50">Loading Search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
