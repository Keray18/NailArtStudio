import React from "react";
import Link from "next/link";
import { BRAND_CONFIG } from "@/config/brand";
import { Sparkles, MessageCircle } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-espresso text-ivory/90 border-t border-espresso-light mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif text-2xl font-semibold tracking-wide text-ivory block">
              {BRAND_CONFIG.name}
            </span>
            <p className="text-sm text-ivory/70 leading-relaxed max-w-sm">
              Artistry at Your Fingertips. Hand-finished press-on nails and salon essentials curated to elevate your personal style with zero salon wait times.
            </p>
            <div className="pt-2 text-xs text-champagne flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-champagne" />
              <span>Founding Studio: {BRAND_CONFIG.location}</span>
            </div>
            <div className="pt-2">
              <a
                href={BRAND_CONFIG.socialHandles.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-xs font-medium text-ivory transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-champagne" />
                <span>WhatsApp Studio Support</span>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-champagne mb-4">
              Catalogue
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/shop" className="text-ivory/70 hover:text-ivory transition-colors">
                  Shop All Styles
                </Link>
              </li>
              <li>
                <Link href="/category/press-on-nails" className="text-ivory/70 hover:text-ivory transition-colors">
                  Press-On Nails
                </Link>
              </li>
              <li>
                <Link href="/category/nail-polish-gel" className="text-ivory/70 hover:text-ivory transition-colors">
                  Gel & Lacquer Polishes
                </Link>
              </li>
              <li>
                <Link href="/category/nail-accessories" className="text-ivory/70 hover:text-ivory transition-colors">
                  Art Accessories
                </Link>
              </li>
              <li>
                <Link href="/category/nail-tools" className="text-ivory/70 hover:text-ivory transition-colors">
                  Tools & Curing Lamps
                </Link>
              </li>
              <li>
                <Link href="/category/application-kits" className="text-ivory/70 hover:text-ivory transition-colors">
                  Application Kits
                </Link>
              </li>
            </ul>
          </div>

          {/* Guidance Column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-champagne mb-4">
              Care & Sizing
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/sizing-guide" className="text-ivory/70 hover:text-ivory transition-colors">
                  Nail Sizing & Fit Guide
                </Link>
              </li>
              <li>
                <Link href="/how-to-apply" className="text-ivory/70 hover:text-ivory transition-colors">
                  How to Apply & Remove
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-ivory/70 hover:text-ivory transition-colors">
                  FAQ & Longevity
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-ivory/70 hover:text-ivory transition-colors">
                  Our Abohar Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-ivory/70 hover:text-ivory transition-colors">
                  Contact Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Prototype Column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-champagne mb-4">
              Terms & Preview
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/policies/shipping" className="text-ivory/70 hover:text-ivory transition-colors">
                  Shipping Terms
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="text-ivory/70 hover:text-ivory transition-colors">
                  Hygiene & Returns
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="text-ivory/70 hover:text-ivory transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="text-ivory/70 hover:text-ivory transition-colors">
                  Terms of Sale
                </Link>
              </li>
              <li className="pt-2 border-t border-espresso-light">
                <Link href="/design-system" className="text-champagne/80 hover:text-champagne transition-colors text-xs flex items-center gap-1">
                  <span>Internal UI Token Index</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-espresso-light flex flex-col sm:flex-row items-center justify-between text-xs text-ivory/50 gap-4">
          <p>
            &copy; {new Date().getFullYear()} {BRAND_CONFIG.name}. All rights reserved. Realistic development prototype.
          </p>
          <p className="text-[11px] text-ivory/40">
            Compliant with Indian Consumer Protection (E-Commerce) Rules &bull; Abohar, Punjab 152116
          </p>
        </div>
      </div>
    </footer>
  );
};

