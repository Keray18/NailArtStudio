"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, ProductVariant, CartItem } from "@/types";
import { BRAND_CONFIG } from "@/config/brand";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => boolean;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  total: number;
  freeShippingThreshold: number;
  freeShippingProgress: number;
  amountNeededForFreeShipping: number;
  isFreeShippingEligible: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize and reconcile from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tnl_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out corrupted, incomplete, or invalid cart entries
          const validItems = parsed.filter(
            (i: any) =>
              i &&
              typeof i.id === "string" &&
              i.product &&
              typeof i.product.id === "string" &&
              i.variant &&
              typeof i.variant.id === "string" &&
              typeof i.quantity === "number" &&
              i.quantity > 0 &&
              typeof i.unitPrice === "number"
          );
          setItems(validItems);
        }
      }
    } catch {
      // Local storage unreadable or disabled
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem("tnl_cart", JSON.stringify(items));
      } catch {
        // Storage quota or private mode
      }
    }
  }, [items, isHydrated]);

  const addItem = (product: Product, variant: ProductVariant, quantity = 1): boolean => {
    if (!variant.isAvailable || variant.stock <= 0) {
      return false;
    }

    const itemId = `${product.id}_${variant.id}`;
    let success = false;

    setItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      const currentQty = existing ? existing.quantity : 0;
      const targetQty = currentQty + quantity;

      // Cap at available variant stock
      const finalQty = Math.min(targetQty, variant.stock);

      if (finalQty <= 0) return prev;

      success = true;
      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: finalQty, lineTotal: finalQty * variant.price }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: itemId,
            product,
            variant,
            quantity: finalQty,
            unitPrice: variant.price,
            lineTotal: finalQty * variant.price,
          },
        ];
      }
    });

    if (success) {
      setIsCartOpen(true);
    }
    return success;
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const maxStock = item.variant.stock;
          const safeQty = Math.min(quantity, maxStock);
          return {
            ...item,
            quantity: safeQty,
            lineTotal: safeQty * item.unitPrice,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  const threshold = BRAND_CONFIG.freeShippingThreshold;
  const isFreeShippingEligible = subtotal >= threshold && subtotal > 0;
  const amountNeededForFreeShipping = Math.max(0, threshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / threshold) * 100));

  const shippingFee = isFreeShippingEligible || subtotal === 0 ? 0 : BRAND_CONFIG.standardShippingFee;
  const total = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        shippingFee,
        total,
        freeShippingThreshold: threshold,
        freeShippingProgress,
        amountNeededForFreeShipping,
        isFreeShippingEligible,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((prev) => !prev),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

