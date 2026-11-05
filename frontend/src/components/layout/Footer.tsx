import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 dark:text-stone-400 gap-4">
        <p>© 2026 Nail Art & Beauty E-Commerce. All rights reserved.</p>
        <p className="font-mono">Decoupled Architecture • Next.js App Router & Express.js</p>
      </div>
    </footer>
  );
};
