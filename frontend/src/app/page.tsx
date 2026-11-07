import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Shield, Clock, Ruler, PackageCheck } from "lucide-react";
import { BRAND_CONFIG } from "@/config/brand";
import { catalogueService } from "@/services/catalogueService";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Button } from "@/components/ui/Button";
import { PrototypeNoticeBanner } from "@/components/layout/PrototypeNoticeBanner";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProducts, collections, categoriesData] = await Promise.all([
    catalogueService.getFeaturedProducts().catch(() => []),
    catalogueService.getCollections().catch(() => []),
    catalogueService.getCategories().catch(() => []),
  ]);

  const categories = categoriesData.length > 0
    ? categoriesData.map((c) => ({
        name: c.name,
        slug: c.slug,
        count: `${c.productCount} Styles`,
      }))
    : [
        { name: "Press-on Nails", slug: "press-on-nails", count: "Explore" },
        { name: "Polish & Gels", slug: "nail-polish-gel", count: "Explore" },
        { name: "Art Accessories", slug: "nail-accessories", count: "Explore" },
        { name: "Tools & Equipment", slug: "nail-tools", count: "Explore" },
        { name: "Application Kits", slug: "application-kits", count: "Explore" },
      ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Prototype Status Banner */}
      <PrototypeNoticeBanner />

      {/* 1. Hero Editorial Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden bg-ivory-subtle border border-blush shadow-card min-h-[500px] lg:min-h-[560px] flex items-center">
          {/* Hero Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=1600&auto=format&fit=crop"
              alt="Editorial manicure photography"
              fill
              priority
              sizes="100vw"
              className="object-cover object-right md:object-center opacity-30 md:opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ivory via-ivory/80 to-transparent" />
          </div>

          {/* Hero Text Content */}
          <div className="relative z-10 p-6 sm:p-12 lg:p-16 max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-rose bg-rose/10 px-3 py-1 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5 text-rose" />
              <span>Abohar Studio &bull; Curated Edit</span>
            </span>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-semibold text-espresso leading-[1.1] mb-4">
              Artistry at Your Fingertips.
            </h1>

            <p className="text-sm sm:text-base text-espresso/80 leading-relaxed mb-8">
              Salon-grade handcrafted press-on nails, high-pigment gel systems, and precision nail accessories delivered across India with zero salon wait times.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/shop">
                <Button variant="primary" size="lg" className="gap-2">
                  <span>Explore Catalogue</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/sizing-guide">
                <Button variant="outline" size="lg">
                  Find Your Fit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Quick-Pills Navigation */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl sm:text-2xl font-semibold text-espresso">
            Shop by Category
          </h2>
          <Link href="/shop" className="text-xs font-semibold text-rose hover:text-rose-hover flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="p-4 rounded-xl bg-white border border-blush/60 hover:border-rose/50 hover:shadow-card transition-all text-center group"
            >
              <p className="font-serif text-base font-semibold text-espresso group-hover:text-rose transition-colors">
                {cat.name}
              </p>
              <p className="text-[11px] text-espresso/50 mt-1 uppercase tracking-wider font-medium">
                {cat.count}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Value Proposition Strip */}
      <section className="border-y border-blush/80 bg-ivory-subtle/40 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <Clock className="w-5 h-5 text-rose mx-auto mb-1.5" />
            <h3 className="font-serif font-semibold text-sm text-espresso">15-Min Application</h3>
            <p className="text-xs text-espresso/60">Flawless manicures at home</p>
          </div>
          <div className="space-y-1">
            <PackageCheck className="w-5 h-5 text-rose mx-auto mb-1.5" />
            <h3 className="font-serif font-semibold text-sm text-espresso">Reusable with Tabs</h3>
            <p className="text-xs text-espresso/60">Gently soak off & re-wear</p>
          </div>
          <div className="space-y-1">
            <Shield className="w-5 h-5 text-rose mx-auto mb-1.5" />
            <h3 className="font-serif font-semibold text-sm text-espresso">Gentle on Nails</h3>
            <p className="text-xs text-espresso/60">Warm water soak-off removal</p>
          </div>
          <div className="space-y-1">
            <Ruler className="w-5 h-5 text-rose mx-auto mb-1.5" />
            <h3 className="font-serif font-semibold text-sm text-espresso">Multi-Size Options</h3>
            <p className="text-xs text-espresso/60">24-piece sets & custom sizes</p>
          </div>
        </div>
      </section>

      {/* 4. Curated Featured Spotlight */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-rose block mb-1">
              Curator&apos;s Selection
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-espresso">
              Trending Handcrafted Styles
            </h2>
          </div>
          <Link href="/shop" className="text-xs font-semibold text-rose hover:text-rose-hover flex items-center gap-1 self-start sm:self-auto">
            <span>Explore Entire Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center rounded-xl border border-blush/60 bg-ivory-subtle p-8">
            <Sparkles className="w-8 h-8 text-rose/50 mx-auto mb-2" />
            <p className="font-serif text-lg text-espresso/70">New seasonal edits arriving soon.</p>
            <p className="text-xs text-espresso/50 mt-1">Visit our full shop to explore handcrafted sets.</p>
            <Link href="/shop" className="inline-block mt-4">
              <Button variant="outline" size="sm">Browse Shop</Button>
            </Link>
          </div>
        )}
      </section>

      {/* 5. Shop by Mood & Occasion */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-rose block mb-1">
            Thematic Lookbooks
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-espresso">
            Shop by Mood &amp; Occasion
          </h2>
          <p className="text-xs sm:text-sm text-espresso/70 mt-2">
            Curated edits assembled for weddings, weekend parties, clean everyday aesthetics, and after-hours glamour.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {collections.map((col) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="group relative rounded-xl overflow-hidden aspect-[4/5] bg-ivory-subtle border border-blush shadow-card"
            >
              <Image
                src={col.bannerImage}
                alt={col.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <span className="text-[10px] uppercase tracking-widest text-champagne block mb-1 font-semibold">
                  {col.productCount} Handcrafted Styles
                </span>
                <h3 className="font-serif text-xl font-semibold leading-snug group-hover:text-blush transition-colors">
                  {col.name}
                </h3>
                <p className="text-xs text-white/80 line-clamp-2 mt-1">
                  {col.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Sizing Confidence Teaser Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-2xl bg-gradient-to-br from-ivory-subtle via-blush/30 to-ivory p-6 sm:p-10 border border-blush flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-rose">
              Fit &amp; Sizing Confidence
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-espresso">
              Unsure About Your Nail Size?
            </h3>
            <p className="text-xs sm:text-sm text-espresso/80 leading-relaxed">
              We offer Multi-Size 24-Piece Sets containing 12 distinct finger sizes (2 of each) designed to accommodate diverse natural nail beds without measuring. For a bespoke fit, try our 2-minute tape and ruler sizing guide.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/sizing-guide">
              <Button variant="primary" size="md">
                Open Sizing Guide
              </Button>
            </Link>
            <Link href="/category/press-on-nails">
              <Button variant="outline" size="md">
                Shop Multi-Size Sets
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Abohar Studio Heritage Snippet */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="border-t border-blush/80 pt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-rose">
              Our Craft &bull; Abohar, Punjab
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-espresso">
              Bringing Salon Luxury to Your Home Vanity
            </h2>
            <p className="text-sm text-espresso/80 leading-relaxed">
              Founded in Abohar, Punjab, The Nail Lounge was created to democratize high-fashion nail artistry. We believe that expressing your mood, aesthetic, and elegance shouldn&apos;t require expensive 2-hour salon appointments or damage your natural nails.
            </p>
            <Link href="/about" className="inline-flex items-center gap-1.5 text-xs font-bold text-rose hover:text-rose-hover uppercase tracking-wider">
              <span>Read Our Full Story</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="relative aspect-video sm:aspect-[4/3] rounded-xl overflow-hidden bg-ivory-subtle border border-blush shadow-card">
            <Image
              src="https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1200&auto=format&fit=crop"
              alt="Artisan nail craftsmanship"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

