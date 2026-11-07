import type { Metadata } from "next";
import "@/styles/globals.css";
import { BRAND_CONFIG } from "@/config/brand";
import { CartProvider } from "@/hooks/useCart";
import { WishlistProvider } from "@/hooks/useWishlist";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: {
    default: `${BRAND_CONFIG.name} — ${BRAND_CONFIG.tagline}`,
    template: `%s | ${BRAND_CONFIG.name}`,
  },
  description: BRAND_CONFIG.shortDescription,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  robots: {
    // Prevent development fixture preview sites from being indexed in search engines
    index: process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_DATA_SOURCE === "api",
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-ivory text-espresso font-sans antialiased">
        <WishlistProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <CartDrawer />
            <Footer />
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}

