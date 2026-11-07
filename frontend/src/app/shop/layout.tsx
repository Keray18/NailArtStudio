import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Handcrafted Styles",
  description:
    "Browse all salon-grade press-on nails, UV gel polishes, and precision nail art tools from The Nail Lounge.",
  alternates: {
    canonical: "/shop",
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

