"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenId?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpenId,
}) => {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenId ? [defaultOpenId] : []);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className="divide-y divide-blush/60 border-y border-blush/60">
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className="py-1">
            <button
              onClick={() => toggle(item.id)}
              className="w-full py-4 flex items-center justify-between text-left text-espresso font-medium focus-ring group transition-colors"
              aria-expanded={isOpen}
            >
              <span className="font-serif text-base group-hover:text-rose transition-colors">
                {item.title}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-espresso/60 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-rose" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="pb-4 pt-1 text-sm text-espresso/80 leading-relaxed animate-in fade-in-50 duration-200">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

