"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Plus, Sparkles } from "lucide-react";
import { Product } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

export interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);
  const primaryImg = product.images[0]?.url;
  const secondaryImg = product.images[1]?.url || primaryImg;

  // Determine active display image
  const displayImg = isHovered && secondaryImg ? secondaryImg : primaryImg;

  // Variant selection for Quick-Add
  // Default to first available variant
  const defaultVariant = product.variants.find((v) => v.isAvailable && v.stock > 0) || product.variants[0];
  const isSoldOut = !product.isAvailable || product.totalStock <= 0;
  const isLowStock = product.totalStock > 0 && product.totalStock <= 3;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (defaultVariant && !isSoldOut) {
      addItem(product, defaultVariant, 1);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      className="group relative flex flex-col bg-ivory rounded-lg overflow-hidden border border-blush/40 hover:border-blush hover:shadow-card-hover transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame (4:5 Aspect Ratio) */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] bg-ivory-subtle overflow-hidden">
        {displayImg && !imageError ? (
          <Image
            src={displayImg}
            alt={product.images[0]?.altText || product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-ivory-subtle to-blush/30 p-4 text-center">
            <Sparkles className="w-8 h-8 text-rose/40 mb-2" />
            <span className="font-serif text-sm font-semibold text-espresso/70 line-clamp-2">
              {product.name}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-espresso/40 mt-1">
              {product.category.name}
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {isSoldOut ? (
            <Badge variant="soldout">Sold Out</Badge>
          ) : isLowStock ? (
            <Badge variant="warning">Only {product.totalStock} Left</Badge>
          ) : product.attributes?.shape ? (
            <Badge variant="default">
              {product.attributes.shape} &bull; {product.attributes.length || "Med"}
            </Badge>
          ) : product.attributes?.finish ? (
            <Badge variant="default">{product.attributes.finish}</Badge>
          ) : null}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-ivory/80 backdrop-blur-sm text-espresso hover:text-rose hover:bg-ivory shadow-sm transition-all focus-ring"
          aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited ? "fill-rose text-rose" : "text-espresso/70"
            }`}
          />
        </button>

        {/* Quick Add Overlay on Hover (Desktop) */}
        {!isSoldOut && defaultVariant && (
          <div className="hidden sm:block absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              onClick={handleQuickAdd}
              className="w-full py-2.5 px-4 rounded bg-espresso/90 hover:bg-espresso text-ivory text-xs font-semibold uppercase tracking-wider backdrop-blur-sm flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Quick Add &bull; ₹{defaultVariant.price}</span>
            </button>
          </div>
        )}
      </Link>

      {/* Card Content Information */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category / Finish Tag */}
          <div className="flex items-center justify-between text-[11px] text-espresso-muted mb-1 font-medium">
            <span className="uppercase tracking-wider truncate">
              {product.attributes?.finish || product.category.name}
            </span>
            {product.variants.length > 1 && (
              <span className="text-[10px] text-espresso/50">
                {product.variants.length} options
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link
            href={`/products/${product.slug}`}
            className="block font-serif text-sm sm:text-base font-semibold text-espresso hover:text-rose transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>
        </div>

        {/* Price & Action Row */}
        <div className="mt-3 pt-2.5 border-t border-blush/40 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-bold text-espresso">
              ₹{product.basePrice}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
              <span className="text-xs text-espresso-muted line-through">
                ₹{product.compareAtPrice}
              </span>
            )}
          </div>

          {/* Mobile Quick Add Button */}
          {!isSoldOut ? (
            <button
              onClick={handleQuickAdd}
              className="sm:hidden p-2 rounded-full bg-blush/50 text-espresso hover:bg-rose hover:text-white transition-colors focus-ring"
              aria-label={`Add ${product.name} to bag`}
            >
              <Plus className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
              Sold Out
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

