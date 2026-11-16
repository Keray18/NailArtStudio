import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const prisma = new PrismaClient();

interface RealVariantInput {
  sku: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  weightGrams?: number;
  initialStock: number;
}

interface RealImageInput {
  url: string;
  altText?: string;
  isPrimary?: boolean;
}

interface RealProductInput {
  sku: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description: string;
  categorySlug: string;
  basePrice: number;
  compareAtPrice?: number;
  weightGrams?: number;
  variants: RealVariantInput[];
  images: RealImageInput[];
}

export async function runCatalogueImport() {
  const args = process.argv.slice(2);
  const isCommit = args.includes("--commit");
  const fileArg = args.find((a) => a.startsWith("--file="));
  const filePath = fileArg
    ? path.resolve(process.cwd(), fileArg.replace("--file=", ""))
    : path.resolve(__dirname, "realCatalogueTemplate.json");

  console.log(`\n======================================================`);
  console.log(`  THE NAIL LOUNGE — REAL CATALOGUE IMPORT UTILITY`);
  console.log(`  Mode: ${isCommit ? "🚨 COMMIT (LIVE DATABASE WRITE)" : "🔍 DRY RUN (VALIDATION ONLY)"}`);
  console.log(`  Source File: ${filePath}`);
  console.log(`======================================================\n`);

  if (!fs.existsSync(filePath)) {
    console.error(`[ERROR] Specified catalogue file does not exist: ${filePath}`);
    process.exit(1);
  }

  let rawData: string;
  let products: RealProductInput[];

  try {
    rawData = fs.readFileSync(filePath, "utf-8");
    products = JSON.parse(rawData);
    if (!Array.isArray(products)) {
      throw new Error("Catalogue JSON must be an array of product objects.");
    }
  } catch (err: any) {
    console.error(`[ERROR] Failed to parse catalogue JSON: ${err.message}`);
    process.exit(1);
  }

  console.log(`Loaded ${products.length} product definitions from file. Validating schema...\n`);

  const errors: string[] = [];
  const warnings: string[] = [];
  const seenSkus = new Set<string>();
  const seenSlugs = new Set<string>();

  // Fetch available categories from database
  const categories = await prisma.category.findMany();
  const categorySlugMap = new Map(categories.map((c) => [c.slug, c.id]));

  let totalVariants = 0;
  let totalStockUnits = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const prefix = `Product #${i + 1} (${p.sku || "NO_SKU"}):`;

    if (!p.sku || typeof p.sku !== "string") errors.push(`${prefix} Missing or invalid 'sku'`);
    if (seenSkus.has(p.sku)) errors.push(`${prefix} Duplicate product SKU '${p.sku}'`);
    seenSkus.add(p.sku);

    if (!p.name || typeof p.name !== "string") errors.push(`${prefix} Missing or invalid 'name'`);
    if (!p.slug || typeof p.slug !== "string") errors.push(`${prefix} Missing or invalid 'slug'`);
    if (seenSlugs.has(p.slug)) errors.push(`${prefix} Duplicate product slug '${p.slug}'`);
    seenSlugs.add(p.slug);

    if (!p.description) errors.push(`${prefix} Missing product description`);
    if (!p.categorySlug || !categorySlugMap.has(p.categorySlug)) {
      errors.push(`${prefix} Unknown categorySlug '${p.categorySlug}'. Valid: ${Array.from(categorySlugMap.keys()).join(", ")}`);
    }

    if (typeof p.basePrice !== "number" || p.basePrice <= 0) {
      errors.push(`${prefix} basePrice must be a positive number`);
    }

    if (!p.variants || !Array.isArray(p.variants) || p.variants.length === 0) {
      errors.push(`${prefix} Must provide at least one variant`);
    } else {
      for (const v of p.variants) {
        totalVariants++;
        totalStockUnits += v.initialStock || 0;
        if (!v.sku) errors.push(`${prefix} Variant missing 'sku'`);
        if (seenSkus.has(v.sku)) errors.push(`${prefix} Duplicate variant SKU '${v.sku}'`);
        seenSkus.add(v.sku);

        if (typeof v.price !== "number" || v.price <= 0) {
          errors.push(`${prefix} Variant '${v.sku}' price must be > 0`);
        }
        if (typeof v.initialStock !== "number" || v.initialStock < 0) {
          errors.push(`${prefix} Variant '${v.sku}' initialStock must be non-negative`);
        }
        if (v.initialStock === 0) {
          warnings.push(`${prefix} Variant '${v.sku}' has initial stock of 0 (will show Out of Stock)`);
        }
      }
    }

    if (!p.images || p.images.length === 0) {
      warnings.push(`${prefix} Product has no images`);
    }
  }

  console.log(`Validation Summary:`);
  console.log(`- Products: ${products.length}`);
  console.log(`- Total Variants: ${totalVariants}`);
  console.log(`- Total Stock Units: ${totalStockUnits}`);
  console.log(`- Schema Errors: ${errors.length}`);
  console.log(`- Warnings: ${warnings.length}\n`);

  if (warnings.length > 0) {
    console.log(`Warnings:`);
    warnings.forEach((w) => console.log(`  [WARN] ${w}`));
    console.log("");
  }

  if (errors.length > 0) {
    console.error(`Validation Failed with ${errors.length} errors:`);
    errors.forEach((e) => console.error(`  [FAIL] ${e}`));
    console.error(`\nPlease fix the errors in ${filePath} and re-run.`);
    await prisma.$disconnect();
    process.exit(1);
  }

  console.log(`✅ All product schemas, SKUs, and category references validated cleanly!`);

  if (!isCommit) {
    console.log(`\n[DRY RUN COMPLETE] Zero database writes performed.`);
    console.log(`To apply these products to the database and retire fictional fixtures, run:`);
    console.log(`  npx tsx prisma/importRealCatalogue.ts --commit --file=${path.relative(process.cwd(), filePath)}\n`);
    await prisma.$disconnect();
    return;
  }

  // COMMIT MODE: Perform database writes inside a transaction
  console.log(`\nApplying real products to database and retiring fictional fixtures...`);

  await prisma.$transaction(async (tx) => {
    // 1. Retire fictional development products (SKUs starting with FIX-)
    const retired = await tx.product.updateMany({
      where: {
        sku: { startsWith: "FIX-" },
        isPublished: true,
      },
      data: {
        isPublished: false,
      },
    });
    console.log(`- Retired ${retired.count} fictional development products (set isPublished = false)`);

    // 2. Upsert real products
    for (const p of products) {
      const categoryId = categorySlugMap.get(p.categorySlug)!;

      const product = await tx.product.upsert({
        where: { sku: p.sku },
        update: {
          name: p.name,
          slug: p.slug,
          shortDescription: p.shortDescription,
          description: p.description,
          categoryId,
          basePrice: p.basePrice,
          compareAtPrice: p.compareAtPrice,
          weightGrams: p.weightGrams || 40,
          isActive: true,
          isPublished: true,
        },
        create: {
          sku: p.sku,
          name: p.name,
          slug: p.slug,
          shortDescription: p.shortDescription,
          description: p.description,
          categoryId,
          basePrice: p.basePrice,
          compareAtPrice: p.compareAtPrice,
          weightGrams: p.weightGrams || 40,
          isActive: true,
          isPublished: true,
        },
      });

      // Upsert Variants and Inventory
      for (let vi = 0; vi < p.variants.length; vi++) {
        const v = p.variants[vi];
        const variant = await tx.productVariant.upsert({
          where: { sku: v.sku },
          update: {
            productId: product.id,
            title: v.title,
            price: v.price,
            compareAtPrice: v.compareAtPrice,
            weightGrams: v.weightGrams || p.weightGrams || 40,
            isAvailable: v.initialStock > 0,
            isPublished: true,
            sortOrder: vi,
          },
          create: {
            sku: v.sku,
            productId: product.id,
            title: v.title,
            price: v.price,
            compareAtPrice: v.compareAtPrice,
            weightGrams: v.weightGrams || p.weightGrams || 40,
            isAvailable: v.initialStock > 0,
            isPublished: true,
            sortOrder: vi,
          },
        });

        await tx.productInventory.upsert({
          where: { variantId: variant.id },
          update: {
            quantity: v.initialStock,
          },
          create: {
            variantId: variant.id,
            quantity: v.initialStock,
            reservedQuantity: 0,
            lowStockThreshold: 3,
          },
        });
      }

      // Upsert Images
      if (p.images && p.images.length > 0) {
        // Clean existing images for product to avoid duplicates
        await tx.productImage.deleteMany({ where: { productId: product.id } });
        for (let imgi = 0; imgi < p.images.length; imgi++) {
          const img = p.images[imgi];
          await tx.productImage.create({
            data: {
              productId: product.id,
              url: img.url,
              publicId: `${product.slug}_img_${imgi}`,
              altText: img.altText || product.name,
              sortOrder: imgi,
              isPrimary: img.isPrimary !== undefined ? img.isPrimary : imgi === 0,
            },
          });
        }
      }

      console.log(`  ✓ Published real product: ${product.name} (${product.sku})`);
    }
  });

  console.log(`\n🎉 COMMIT SUCCESSFUL! Real catalogue is now active in PostgreSQL.`);
  console.log(`Fictional products have been retired from the live storefront.\n`);
  await prisma.$disconnect();
}

if (require.main === module) {
  runCatalogueImport().catch((err) => {
    console.error("[FATAL] Catalogue import failed:", err);
    process.exit(1);
  });
}

