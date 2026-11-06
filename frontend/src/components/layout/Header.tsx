"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, Heart } from "lucide-react";
import { BRAND_CONFIG } from "@/config/brand";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { AnnouncementBar } from "./AnnouncementBar";
import { MobileNavDrawer } from "./MobileNavDrawer";

export const Header: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();

  const navLinks = [
    { label: "Shop All", href: "/shop" },
    { label: "Press-on Nails", href: "/category/press-on-nails" },
    { label: "Polish & Gels", href: "/category/nail-polish-gel" },
    { label: "Collections", href: "/collections" },
    { label: "Sizing Guide", href: "/sizing-guide" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-md border-b border-blush/60 transition-shadow">
      <AnnouncementBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="p-2 -ml-2 rounded-md text-espresso hover:text-rose hover:bg-blush/30 focus-ring"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <Link href="/" className="inline-block group focus-ring rounded-md">
              <span className="block font-serif text-2xl sm:text-3xl font-semibold tracking-wide text-espresso group-hover:text-rose transition-colors">
                {BRAND_CONFIG.name}
              </span>
              <span className="block text-[9px] tracking-[0.25em] uppercase text-espresso-muted font-sans font-medium -mt-1">
                Abohar &bull; Studio Edit
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors py-1 relative focus-ring rounded ${
                    isActive ? "text-rose font-semibold" : "text-espresso/80 hover:text-rose"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Utility Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search */}
            <Link
              href="/search"
              className="p-2 text-espresso hover:text-rose hover:bg-blush/30 rounded-full transition-colors focus-ring"
              aria-label="Search catalogue"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link
              href="/shop"
              className="p-2 text-espresso hover:text-rose hover:bg-blush/30 rounded-full transition-colors focus-ring relative"
              aria-label={`Wishlist with ${wishlistCount} items`}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Trigger Button */}
            <button
              onClick={openCart}
              className="p-2 text-espresso hover:text-rose hover:bg-blush/30 rounded-full transition-colors focus-ring relative"
              aria-label={`Shopping bag with ${itemCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in-75">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileNavDrawer
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </header>
  );
};

