"use client";

import React from "react";
import Link from "next/link";
import { Drawer } from "@/components/ui/Drawer";
import { BRAND_CONFIG } from "@/config/brand";
import { Sparkles, Shield, Ruler, HelpCircle, Phone } from "lucide-react";

export interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ isOpen, onClose }) => {
  const navLinks = [
    { label: "Shop All Nails & Kits", href: "/shop" },
    { label: "Press-on Nails", href: "/category/press-on-nails" },
    { label: "Nail Polish & UV Gels", href: "/category/nail-polish-gel" },
    { label: "Nail Art & Accessories", href: "/category/nail-accessories" },
    { label: "Nail-Art Tools & Lamps", href: "/category/nail-tools" },
    { label: "Application & Care Kits", href: "/category/application-kits" },
    { label: "Curated Collections", href: "/collections" },
  ];

  const utilityLinks = [
    { label: "Nail Sizing & Fit Guide", href: "/sizing-guide", icon: Ruler },
    { label: "Application & Removal Guide", href: "/how-to-apply", icon: Sparkles },
    { label: "About The Abohar Studio", href: "/about", icon: Shield },
    { label: "Help & Frequently Asked Questions", href: "/faq", icon: HelpCircle },
    { label: "Contact Customer Support", href: "/contact", icon: Phone },
  ];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={BRAND_CONFIG.name}>
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-espresso/50 mb-3">
              Explore Collections
            </p>
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="block py-2.5 px-3 rounded-lg text-base font-serif text-espresso hover:bg-blush/30 hover:text-rose transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-blush/60">
            <p className="text-xs font-semibold uppercase tracking-wider text-espresso/50 mb-3">
              Customer Guidance
            </p>
            <ul className="space-y-1">
              {utilityLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-sm text-espresso/80 hover:bg-blush/30 hover:text-espresso transition-colors"
                    >
                      <Icon className="w-4 h-4 text-rose" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-blush/60 text-xs text-espresso/60 text-center">
          <p className="font-serif font-medium text-espresso">{BRAND_CONFIG.name}</p>
          <p>{BRAND_CONFIG.location}</p>
        </div>
      </div>
    </Drawer>
  );
};

