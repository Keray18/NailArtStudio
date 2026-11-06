"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";

export interface SortDropdownProps {
  value: "featured" | "price-asc" | "price-desc" | "newest";
  onChange: (value: "featured" | "price-asc" | "price-desc" | "newest") => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  return (
    <div className="relative inline-flex items-center">
      <label htmlFor="catalog-sort" className="sr-only">
        Sort products by
      </label>
      <div className="relative flex items-center">
        <ArrowUpDown className="w-3.5 h-3.5 text-espresso/60 absolute left-3 pointer-events-none" />
        <select
          id="catalog-sort"
          value={value}
          onChange={(e) => onChange(e.target.value as any)}
          className="appearance-none bg-white border border-blush rounded-md pl-8 pr-8 py-2 text-xs font-medium text-espresso focus-ring cursor-pointer hover:border-espresso/40 transition-colors"
        >
          <option value="featured">Featured Curations</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">New Arrivals</option>
        </select>
        <span className="absolute right-3 pointer-events-none text-espresso/40 text-[10px]">
          ▼
        </span>
      </div>
    </div>
  );
};

