import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HealthStatusCard } from '@/features/health/components/HealthStatusCard';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
        <div className="w-full max-w-2xl text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 mb-4">
            Phase 0 Complete
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Nail Art & Beauty E-Commerce
          </h1>
          <p className="mt-3 text-sm sm:text-base text-stone-600 dark:text-stone-400">
            Technical foundation initialized. The architecture decouples the Next.js frontend
            from the Express.js API backend, PostgreSQL database, and Cloudinary storage.
          </p>
        </div>

        <HealthStatusCard />

        <div className="w-full max-w-2xl mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-500 dark:text-stone-400">
          <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
            <h3 className="font-semibold text-stone-800 dark:text-stone-200 mb-1">Architecture Rules</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>No Next.js backend API routes</li>
              <li>Prisma & DB access backend-only</li>
              <li>Frontend communicates via REST API client</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
            <h3 className="font-semibold text-stone-800 dark:text-stone-200 mb-1">Next Phase</h3>
            <p>Phase 1 will establish domain schemas (Categories, Products, Variants) and authenticated catalog APIs upon approval.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
