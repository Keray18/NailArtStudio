import { notFound } from "next/navigation";
import { Metadata } from "next";
import { DesignSystemClient } from "./DesignSystemClient";

export const metadata: Metadata = {
  title: "Design System & UI Tokens | Internal Diagnostics",
  description: "Internal development sandbox for UI tokens, typography, and atomic primitives.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DesignSystemPage() {
  // Prevent any exposure or crawling of internal developer tools in production environments
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <DesignSystemClient />;
}
