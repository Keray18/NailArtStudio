import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-stone-200 bg-white/80 backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            N
          </span>
          <span className="font-semibold text-stone-900 dark:text-stone-100 text-lg tracking-tight">
            Nail Art & Beauty
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-1 rounded bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300">
            Phase 0 Foundation
          </span>
        </div>
      </div>
    </header>
  );
};

