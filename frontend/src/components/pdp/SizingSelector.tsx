"use client";

import React, { useState } from "react";
import { ProductVariant } from "@/types";
import { Ruler, Check, HelpCircle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

export interface SizingSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onSelectVariant: (variant: ProductVariant) => void;
}

export const SizingSelector: React.FC<SizingSelectorProps> = ({
  variants,
  selectedVariant,
  onSelectVariant,
}) => {
  const [isSizingModalOpen, setIsSizingModalOpen] = useState(false);

  // Group variants by setType
  const universalVariant = variants.find((v) => v.setType === "UNIVERSAL_24");
  const customVariants = variants.filter((v) => v.setType === "CUSTOM_10");

  const isCustomSelected = selectedVariant.setType === "CUSTOM_10";

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-espresso">
          Packaging & Sizing
        </span>
        <button
          type="button"
          onClick={() => setIsSizingModalOpen(true)}
          className="text-xs text-rose hover:text-rose-hover font-medium flex items-center gap-1 focus-ring rounded"
        >
          <Ruler className="w-3.5 h-3.5" />
          <span>Sizing & Measurement Guide</span>
        </button>
      </div>

      {/* Set Type Radio Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Universal 24-Piece Option */}
        {universalVariant && (
          <button
            type="button"
            onClick={() => onSelectVariant(universalVariant)}
            className={`p-3 rounded-lg border text-left transition-all relative focus-ring ${
              !isCustomSelected
                ? "border-rose bg-rose/5 ring-1 ring-rose"
                : "border-blush bg-white hover:border-espresso/40"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-espresso block">
                  Multi-Size 24-Piece Set
                </span>
                <span className="text-[11px] text-espresso/70 block mt-0.5">
                  12 sizes x 2 nails. Multiple options included.
                </span>
              </div>
              {!isCustomSelected && (
                <span className="w-4 h-4 rounded-full bg-rose text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-2.5 h-2.5" />
                </span>
              )}
            </div>
            <div className="mt-2 text-xs font-semibold text-rose">
              ₹{universalVariant.price}
            </div>
          </button>
        )}

        {/* Custom 10-Piece Option */}
        {customVariants.length > 0 && (
          <button
            type="button"
            onClick={() => {
              const firstAvail = customVariants.find((v) => v.isAvailable) || customVariants[0];
              onSelectVariant(firstAvail);
            }}
            className={`p-3 rounded-lg border text-left transition-all relative focus-ring ${
              isCustomSelected
                ? "border-rose bg-rose/5 ring-1 ring-rose"
                : "border-blush bg-white hover:border-espresso/40"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-espresso block">
                  Custom Sized 10-Piece Set
                </span>
                <span className="text-[11px] text-espresso/70 block mt-0.5">
                  Tailored to your hand measurements.
                </span>
              </div>
              {isCustomSelected && (
                <span className="w-4 h-4 rounded-full bg-rose text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-2.5 h-2.5" />
                </span>
              )}
            </div>
            <div className="mt-2 text-xs font-semibold text-rose">
              ₹{customVariants[0]?.price}
            </div>
          </button>
        )}
      </div>

      {/* Sub-selector for Custom Sizes (XS, S, M, L) */}
      {isCustomSelected && (
        <div className="pt-2">
          <span className="text-xs text-espresso-muted block mb-2 font-medium">
            Select Your Size:
          </span>
          <div className="flex gap-2">
            {customVariants.map((variant) => {
              const isSelected = selectedVariant.id === variant.id;
              const isOutOfStock = !variant.isAvailable || variant.stock <= 0;

              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => onSelectVariant(variant)}
                  className={`flex-1 py-2 px-3 rounded-md text-xs font-bold border transition-all flex flex-col items-center justify-center focus-ring ${
                    isSelected
                      ? "bg-rose text-white border-rose"
                      : isOutOfStock
                      ? "bg-stone-100 text-stone-400 border-stone-200 line-through cursor-not-allowed"
                      : "bg-white text-espresso border-blush hover:border-espresso/50"
                  }`}
                >
                  <span>{variant.size}</span>
                  {isOutOfStock && <span className="text-[9px] font-normal no-underline">Out</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sizing Modal Dialog */}
      <Modal
        isOpen={isSizingModalOpen}
        onClose={() => setIsSizingModalOpen(false)}
        title="Nail Sizing & Measurement Guide"
      >
        <div className="space-y-4 text-sm text-espresso/80">
          <div className="bg-blush/30 p-3.5 rounded-lg border border-blush">
            <h4 className="font-serif font-semibold text-espresso text-base mb-1">
              How to Measure in 2 Minutes
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Place clear household adhesive tape across the widest part of your natural nail bed.</li>
              <li>Press down gently and mark the left and right side walls with a pen.</li>
              <li>Remove tape and measure the distance between marks using a millimeter (mm) ruler.</li>
            </ol>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-espresso text-base mb-2">
              Standard Sizing Dimensions (Thumb to Pinky)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-blush bg-ivory-subtle">
                    <th className="py-2 px-2 font-semibold">Size</th>
                    <th className="py-2 px-2 font-semibold">Thumb</th>
                    <th className="py-2 px-2 font-semibold">Index</th>
                    <th className="py-2 px-2 font-semibold">Middle</th>
                    <th className="py-2 px-2 font-semibold">Ring</th>
                    <th className="py-2 px-2 font-semibold">Pinky</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blush/40">
                  <tr>
                    <td className="py-2 px-2 font-bold text-rose">XS</td>
                    <td className="py-2 px-2">14mm</td>
                    <td className="py-2 px-2">10mm</td>
                    <td className="py-2 px-2">11mm</td>
                    <td className="py-2 px-2">10mm</td>
                    <td className="py-2 px-2">7mm</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 font-bold text-rose">S</td>
                    <td className="py-2 px-2">15mm</td>
                    <td className="py-2 px-2">11mm</td>
                    <td className="py-2 px-2">12mm</td>
                    <td className="py-2 px-2">11mm</td>
                    <td className="py-2 px-2">8mm</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 font-bold text-rose">M</td>
                    <td className="py-2 px-2">16mm</td>
                    <td className="py-2 px-2">12mm</td>
                    <td className="py-2 px-2">13mm</td>
                    <td className="py-2 px-2">12mm</td>
                    <td className="py-2 px-2">9mm</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 font-bold text-rose">L</td>
                    <td className="py-2 px-2">18mm</td>
                    <td className="py-2 px-2">13mm</td>
                    <td className="py-2 px-2">14mm</td>
                    <td className="py-2 px-2">13mm</td>
                    <td className="py-2 px-2">10mm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-2 text-xs text-espresso/70 italic flex items-start gap-1.5">
            <HelpCircle className="w-4 h-4 text-rose flex-shrink-0 mt-0.5" />
            <span>
              Unsure or in between sizes? Choose our <strong>Multi-Size 24-Piece Set</strong> which includes 12 sizes with 2 of each to fit multiple hand shapes without pre-measuring.
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

