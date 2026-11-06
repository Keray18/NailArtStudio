"use client";

import React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { FilterSidebar } from "./FilterSidebar";
import { ProductFilters } from "@/services/catalogueService";
import { Button } from "@/components/ui/Button";

export interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  onReset: () => void;
  resultCount: number;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onChange,
  onReset,
  resultCount,
}) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Filter Styles" position="bottom">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto pb-4">
          <FilterSidebar
            filters={filters}
            onChange={onChange}
            onReset={onReset}
            isMobile={true}
          />
        </div>
        <div className="pt-3 border-t border-blush/60 sticky bottom-0 bg-ivory">
          <Button variant="primary" fullWidth onClick={onClose}>
            View {resultCount} {resultCount === 1 ? "Result" : "Results"}
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

