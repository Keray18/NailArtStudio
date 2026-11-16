import React from "react";

export interface BadgeProps {
  variant?: "default" | "rose" | "champagne" | "warning" | "soldout" | "outline";
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  children,
  className = "",
}) => {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase";

  const variantStyles = {
    default: "bg-blush text-espresso",
    rose: "bg-rose/15 text-rose border border-rose/20",
    champagne: "bg-champagne/20 text-champagne-dark border border-champagne/40",
    warning: "bg-amber-100 text-amber-800 border border-amber-200",
    soldout: "bg-stone-200 text-stone-600 border border-stone-300",
    outline: "border border-espresso/30 text-espresso bg-transparent",
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

