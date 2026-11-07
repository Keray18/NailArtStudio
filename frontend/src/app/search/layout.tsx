import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search The Catalogue",
  description:
    "Search handcrafted press-on nails, shapes, finishes, gel systems, and care kits.",
  alternates: {
    canonical: "/search",
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

