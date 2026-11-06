"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/types";
import { Sparkles } from "lucide-react";

export interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const activeImage = images[selectedIndex] || images[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Frame (4:5 Aspect Ratio) */}
      <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-ivory-subtle border border-blush/60 shadow-sm">
        {activeImage?.url && !imageError ? (
          <Image
            src={activeImage.url}
            alt={activeImage.altText || productName}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center transition-all duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-ivory-subtle to-blush/30">
            <Sparkles className="w-12 h-12 text-rose/40 mb-3" />
            <span className="font-serif text-lg font-semibold text-espresso/80">
              {productName}
            </span>
            <span className="text-xs text-espresso/50 mt-1">High-Resolution Studio Photo</span>
          </div>
        )}
      </div>

      {/* Thumbnails Row (Only render if more than 1 image - handles EC-06 gracefully) */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none" role="tablist" aria-label="Product thumbnails">
          {images.map((img, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                key={img.id || index}
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setSelectedIndex(index);
                  setImageError(false);
                }}
                className={`relative w-20 aspect-square rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 focus-ring ${
                  isSelected ? "border-rose ring-1 ring-rose" : "border-blush/80 hover:border-espresso/40 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.altText || `View ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

