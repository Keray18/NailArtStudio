"use client";

import React from "react";
import { ProductFilters } from "@/services/catalogueService";
import { NailShape, NailLength, NailFinish, CategorySlug } from "@/types";
import { Filter, X, RotateCcw } from "lucide-react";

export interface FilterSidebarProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  onReset: () => void;
  className?: string;
  isMobile?: boolean;
}

const CATEGORIES: { slug: CategorySlug; name: string }[] = [
  { slug: "press-on-nails", name: "Press-on Nails" },
  { slug: "nail-polish-gel", name: "Polish & Gels" },
  { slug: "nail-accessories", name: "Nail Accessories" },
  { slug: "nail-tools", name: "Tools & Lamps" },
  { slug: "application-kits", name: "Care & Prep Kits" },
];

const SHAPES: NailShape[] = ["Almond", "Coffin", "Square", "Oval", "Stiletto", "Squoval"];
const LENGTHS: NailLength[] = ["Short", "Medium", "Long"];
const FINISHES: NailFinish[] = [
  "Glazed Chrome",
  "Glossy",
  "Velvet Matte",
  "Cat Eye",
  "3D Embellished",
  "Gold Leaf",
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onReset,
  className = "",
  isMobile = false,
}) => {
  const isPressOnActive = !filters.category || filters.category === "press-on-nails";

  const handleCategoryToggle = (slug: CategorySlug) => {
    onChange({
      ...filters,
      category: filters.category === slug ? undefined : slug,
    });
  };

  const handleShapeToggle = (shape: NailShape) => {
    onChange({
      ...filters,
      shape: filters.shape === shape ? undefined : shape,
    });
  };

  const handleLengthToggle = (length: NailLength) => {
    onChange({
      ...filters,
      length: filters.length === length ? undefined : length,
    });
  };

  const handleFinishToggle = (finish: NailFinish) => {
    onChange({
      ...filters,
      finish: filters.finish === finish ? undefined : finish,
    });
  };

  const handleStockToggle = () => {
    onChange({
      ...filters,
      inStockOnly: !filters.inStockOnly,
    });
  };

  const activeFiltersCount = [
    filters.category,
    filters.shape,
    filters.length,
    filters.finish,
    filters.inStockOnly,
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-3 border-b border-blush/60">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-rose" />
          <h3 className="font-serif font-semibold text-espresso text-base">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-rose text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-rose hover:text-rose-hover flex items-center gap-1 font-medium transition-colors focus-ring rounded"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* In-Stock Filter Toggle */}
      <div className="flex items-center justify-between py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-espresso">
          In Stock Only
        </span>
        <button
          role="switch"
          aria-checked={!!filters.inStockOnly}
          onClick={handleStockToggle}
          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring ${
            filters.inStockOnly ? "bg-rose" : "bg-stone-300"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              filters.inStockOnly ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Category Facets */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-espresso/70 mb-2.5">
          Product Line
        </h4>
        <div className="flex flex-col space-y-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => handleCategoryToggle(cat.slug)}
                className={`flex items-center justify-between px-3 py-2 rounded text-xs font-medium text-left transition-colors ${
                  isSelected
                    ? "bg-rose text-white"
                    : "text-espresso hover:bg-blush/40"
                }`}
              >
                <span>{cat.name}</span>
                {isSelected && <X className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Press-on Specific Filters: Shape & Length */}
      {isPressOnActive && (
        <>
          {/* Nail Shape */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-espresso/70 mb-2.5">
              Nail Shape
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {SHAPES.map((shape) => {
                const isSelected = filters.shape === shape;
                return (
                  <button
                    key={shape}
                    onClick={() => handleShapeToggle(shape)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      isSelected
                        ? "bg-rose text-white border-rose"
                        : "border-blush bg-white text-espresso hover:border-espresso/40"
                    }`}
                  >
                    {shape}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nail Length */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-espresso/70 mb-2.5">
              Nail Length
            </h4>
            <div className="flex gap-1.5">
              {LENGTHS.map((len) => {
                const isSelected = filters.length === len;
                return (
                  <button
                    key={len}
                    onClick={() => handleLengthToggle(len)}
                    className={`flex-1 py-1.5 rounded text-xs font-medium border text-center transition-all ${
                      isSelected
                        ? "bg-rose text-white border-rose"
                        : "border-blush bg-white text-espresso hover:border-espresso/40"
                    }`}
                  >
                    {len}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Finish & Texture */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-espresso/70 mb-2.5">
              Finish & Texture
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {FINISHES.map((finish) => {
                const isSelected = filters.finish === finish;
                return (
                  <button
                    key={finish}
                    onClick={() => handleFinishToggle(finish)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      isSelected
                        ? "bg-rose text-white border-rose"
                        : "border-blush bg-white text-espresso hover:border-espresso/40"
                    }`}
                  >
                    {finish}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Price Range Filter */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-espresso/70 mb-2.5">
          Price Range
        </h4>
        <div className="flex flex-col space-y-1.5 text-xs">
          {[
            { label: "All Prices", min: undefined, max: undefined },
            { label: "Under ₹500", min: 0, max: 500 },
            { label: "₹500 – ₹999", min: 500, max: 999 },
            { label: "₹1,000 & Above", min: 1000, max: undefined },
          ].map((tier, idx) => {
            const isSelected =
              filters.minPrice === tier.min && filters.maxPrice === tier.max;
            return (
              <button
                key={idx}
                onClick={() =>
                  onChange({
                    ...filters,
                    minPrice: tier.min,
                    maxPrice: tier.max,
                  })
                }
                className={`py-1.5 px-3 rounded text-left transition-colors ${
                  isSelected
                    ? "bg-blush font-semibold text-espresso"
                    : "text-espresso/80 hover:bg-blush/30"
                }`}
              >
                {tier.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

