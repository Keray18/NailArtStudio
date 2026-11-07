"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Product, ProductVariant } from "@/types";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductGallery } from "@/components/pdp/ProductGallery";
import { SizingSelector } from "@/components/pdp/SizingSelector";
import { QuantitySelector } from "@/components/pdp/QuantitySelector";
import { PincodeEstimator } from "@/components/pdp/PincodeEstimator";
import { StickyMobileCTA } from "@/components/pdp/StickyMobileCTA";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/catalog/ProductCard";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { Heart, ShoppingBag, Check, ArrowRight } from "lucide-react";
import { PrototypeNoticeBanner } from "@/components/layout/PrototypeNoticeBanner";

export interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  product,
  relatedProducts,
}) => {
  const router = useRouter();

  // Default to first in-stock variant or first variant
  const defaultVar =
    product.variants.find((v) => v.isAvailable && v.stock > 0) || product.variants[0];

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVar);
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);
  const isAvailable =
    product.isAvailable && selectedVariant && selectedVariant.isAvailable && selectedVariant.stock > 0;
  const isPressOn = product.category.slug === "press-on-nails";

  const discountPercentage =
    selectedVariant &&
    selectedVariant.compareAtPrice &&
    selectedVariant.compareAtPrice > selectedVariant.price
      ? Math.round(
          ((selectedVariant.compareAtPrice - selectedVariant.price) /
            selectedVariant.compareAtPrice) *
            100
        )
      : null;

  const handleAddToCart = () => {
    if (isAvailable && selectedVariant) {
      addItem(product, selectedVariant, quantity);
    }
  };

  const handleBuyNow = () => {
    if (isAvailable && selectedVariant) {
      addItem(product, selectedVariant, quantity);
      router.push("/checkout");
    }
  };

  // Accordion Sections
  const accordionItems = [
    {
      id: "package-contents",
      title: "What's Inside the Box",
      content: (
        <ul className="space-y-1.5 list-disc list-inside text-xs text-espresso/80">
          {(
            product.packageContents || [
              "Handcrafted press-on nail tips",
              "1 Brush-on liquid nail adhesive (2g)",
              "1 Sheet extra-strength jelly glue tabs (24 tabs)",
              "1 Dual-sided mini buffer file",
              "1 Wooden cuticle pusher stick",
              "2 Alcohol sanitizing preparation pads",
            ]
          ).map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      ),
    },
    {
      id: "how-to-apply",
      title: "How to Apply in 4 Steps",
      content: (
        <div className="space-y-2 text-xs text-espresso/80">
          <p>
            <strong>Step 1: Prep</strong> — Gently push cuticles back with the wooden stick and buff the natural nail surface to remove shine.
          </p>
          <p>
            <strong>Step 2: Cleanse</strong> — Wipe natural nails with the alcohol pad to strip natural oils and moisture.
          </p>
          <p>
            <strong>Step 3: Adhere</strong> — Select an adhesive tab (for 2–4 days wear) or apply a drop of glue (for 1–2 weeks wear).
          </p>
          <p>
            <strong>Step 4: Press</strong> — Align at a 45-degree angle under the cuticle line and press firmly for 30 seconds.
          </p>
        </div>
      ),
    },
    {
      id: "safe-removal",
      title: "Safe, Damage-Free Removal",
      content: (
        <div className="space-y-2 text-xs text-espresso/80">
          <p>
            Submerge hands in a bowl of warm water with gentle hand soap and a few drops of cuticle oil for 10–12 minutes.
          </p>
          <p>
            Gently lift edges with the wooden stick. <strong>Never force or peel nails off</strong>, which can delaminate natural nail layers.
          </p>
        </div>
      ),
    },
    {
      id: "materials-origin",
      title: "Quality & Origin Disclosures",
      content: (
        <div className="space-y-1.5 text-xs text-espresso/80">
          <p>&bull; <strong>Country of Origin:</strong> India (Abohar Studio Dispatch)</p>
          <p>&bull; <strong>Net Quantity:</strong> 1 Complete Box Set</p>
          <p>&bull; <strong>Adhesive Safety:</strong> Formaldehyde-free, non-damaging adhesive formula</p>
          <p>&bull; <strong>Customer Care:</strong> support@thenaillounge.in &bull; +91 98765 43210</p>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <PrototypeNoticeBanner className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-6" />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Catalogue", href: "/shop" },
          { label: product.category.name, href: `/category/${product.category.slug}` },
          { label: product.name },
        ]}
      />

      {/* 2-Column Product Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Media Gallery (Sticky Desktop) */}
        <div className="lg:col-span-6 lg:sticky lg:top-28">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Column: Buy Box & Product Specifications */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header & Badges */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-rose">
                {product.category.name}
              </span>
              <button
                onClick={() => toggleWishlist(product)}
                className="flex items-center gap-1.5 text-xs font-medium text-espresso/70 hover:text-rose transition-colors focus-ring rounded p-1"
                aria-label={isFavorited ? "Saved to favorites" : "Save to favorites"}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorited ? "fill-rose text-rose" : "text-espresso/60"
                  }`}
                />
                <span>{isFavorited ? "Saved" : "Save Look"}</span>
              </button>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-espresso leading-tight">
              {product.name}
            </h1>

            {selectedVariant && (
              <p className="text-xs text-espresso/50 mt-1">
                SKU: <span className="font-mono">{selectedVariant.sku}</span>
              </p>
            )}
          </div>

          {/* Pricing Row */}
          {selectedVariant && (
            <div className="p-4 rounded-xl bg-ivory-subtle/50 border border-blush/60 flex items-baseline justify-between">
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-bold text-espresso">
                  ₹{selectedVariant.price}
                </span>
                {selectedVariant.compareAtPrice &&
                  selectedVariant.compareAtPrice > selectedVariant.price && (
                    <span className="text-sm text-espresso-muted line-through">
                      ₹{selectedVariant.compareAtPrice}
                    </span>
                  )}
                {discountPercentage && (
                  <span className="bg-rose/15 text-rose text-xs font-bold px-2 py-0.5 rounded">
                    Save {discountPercentage}%
                  </span>
                )}
              </div>
              <span className="text-[11px] text-espresso/60 font-medium">
                Inclusive of all taxes
              </span>
            </div>
          )}

          {/* Press-on Specifications Chips */}
          {isPressOn && product.attributes && (
            <div className="flex flex-wrap gap-2 text-xs">
              {product.attributes.shape && (
                <Badge variant="default">Shape: {product.attributes.shape}</Badge>
              )}
              {product.attributes.length && (
                <Badge variant="default">Length: {product.attributes.length}</Badge>
              )}
              {product.attributes.finish && (
                <Badge variant="rose">Finish: {product.attributes.finish}</Badge>
              )}
            </div>
          )}

          {/* Sizing & Packaging Selector (Press-on nails) */}
          {isPressOn && product.variants.length > 0 && selectedVariant && (
            <SizingSelector
              variants={product.variants}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
            />
          )}

          {/* Generic Variant Selector (Non-press-on products with multiple options) */}
          {!isPressOn && product.variants.length > 1 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-espresso block">
                Select Option:
              </span>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  const isOutOfStock = !v.isAvailable || v.stock <= 0;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => setSelectedVariant(v)}
                      className={`py-2 px-3 rounded-md text-xs font-semibold border transition-all flex items-center gap-1.5 focus-ring ${
                        isSelected
                          ? "bg-rose text-white border-rose shadow-sm"
                          : isOutOfStock
                          ? "bg-stone-100 text-stone-400 border-stone-200 line-through cursor-not-allowed"
                          : "bg-white text-espresso border-blush hover:border-espresso/40"
                      }`}
                    >
                      <span>{v.title}</span>
                      <span className="font-normal opacity-80">(₹{v.price})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock Availability Indicator */}
          <div>
            {isAvailable ? (
              <div className="flex items-center gap-1.5 text-xs text-status-success font-semibold">
                <Check className="w-4 h-4 text-status-success" />
                <span>
                  In Stock &bull; Ready for Abohar Studio Dispatch
                  {selectedVariant && selectedVariant.stock <= 3 && ` (Only ${selectedVariant.stock} left!)`}
                </span>
              </div>
            ) : (
              <div className="text-xs text-status-error font-semibold">
                &bull; Sold Out in this variant combination.
              </div>
            )}
          </div>

          {/* Quantity & Add to Cart Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-espresso">
                Qty:
              </span>
              <QuantitySelector
                quantity={quantity}
                max={selectedVariant?.stock || 1}
                onChange={setQuantity}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <Button
                variant="primary"
                size="lg"
                disabled={!isAvailable}
                onClick={handleAddToCart}
                className="gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag &bull; ₹{(selectedVariant?.price || 0) * quantity}</span>
              </Button>

              <Button
                variant="dark"
                size="lg"
                disabled={!isAvailable}
                onClick={handleBuyNow}
              >
                Buy Now (Express)
              </Button>
            </div>
          </div>

          {/* Pincode Estimator Helper */}
          <PincodeEstimator />

          {/* Short Description */}
          <p className="text-sm text-espresso/80 leading-relaxed pt-2">
            {product.description}
          </p>

          {/* Collapsible Accordions */}
          <div className="pt-2">
            <Accordion items={accordionItems} defaultOpenId="package-contents" />
          </div>
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-blush/80">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-semibold text-espresso">
              You May Also Adore
            </h2>
            <Link
              href={`/category/${product.category.slug}`}
              className="text-xs font-semibold text-rose hover:text-rose-hover flex items-center gap-1"
            >
              <span>More in {product.category.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Mobile Add to Bag Bar */}
      {selectedVariant && (
        <StickyMobileCTA
          product={product}
          selectedVariant={selectedVariant}
          onAddToCart={handleAddToCart}
          isAvailable={isAvailable}
        />
      )}
    </div>
  );
};

