import { PrismaClient } from "@prisma/client";
import { SEED_CATEGORIES, SEED_COLLECTIONS, SEED_PRODUCTS } from "../src/data/seedData";
import { logger } from "../src/utils/logger";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const prisma = new PrismaClient();

interface SeedStats {
  categoriesInserted: number;
  categoriesUpdated: number;
  collectionsInserted: number;
  collectionsUpdated: number;
  productsInserted: number;
  productsUpdated: number;
  variantsUpserted: number;
  inventoriesUpserted: number;
  imagesUpserted: number;
  attributesUpserted: number;
  failedRecords: number;
}

export async function runCatalogueSeed(): Promise<SeedStats> {
  const nodeEnv = (process.env.NODE_ENV || "development").toLowerCase();
  const dbUrl = process.env.DATABASE_URL || "";

  // 1. Unconditional production refusal gate
  // Production seeding is permanently prohibited. Overrides (such as ALLOW_PRODUCTION_SEED) are explicitly rejected.
  if (nodeEnv === "production" || process.env.ALLOW_PRODUCTION_SEED) {
    throw new Error(
      "[FATAL SECURITY GATE] Seeding fictional development data into a PRODUCTION environment is strictly forbidden. Overrides are permanently disallowed."
    );
  }

  // 2. Strict target database validation gate
  // Requires explicit confirmation of a local development or test database host and name.
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(dbUrl);
  } catch {
    throw new Error("[SECURITY GATE] DATABASE_URL is not a valid connection URL format.");
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  const dbName = parsedUrl.pathname.replace(/^\//, "").toLowerCase();

  const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";
  const isAuthorizedDbName =
    dbName === "the_nail_lounge" ||
    dbName === "the_nail_lounge_dev" ||
    dbName === "the_nail_lounge_test";

  if (!isLocalHost || !isAuthorizedDbName) {
    throw new Error(
      `[SECURITY GATE] Target database (${hostname}/${dbName}) is not an authorized local development or test database. Seeding rejected to protect business data.`
    );
  }

  logger.info("Initiating deterministic catalogue seed...", { environment: nodeEnv });

  const stats: SeedStats = {
    categoriesInserted: 0,
    categoriesUpdated: 0,
    collectionsInserted: 0,
    collectionsUpdated: 0,
    productsInserted: 0,
    productsUpdated: 0,
    variantsUpserted: 0,
    inventoriesUpserted: 0,
    imagesUpserted: 0,
    attributesUpserted: 0,
    failedRecords: 0,
  };

  // 3. Seed Categories
  const categoryMap = new Map<string, string>(); // slug -> id
  for (const cat of SEED_CATEGORIES) {
    try {
      const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
      if (existing) {
        const updated = await prisma.category.update({
          where: { id: existing.id },
          data: {
            name: cat.name,
            description: cat.description,
            sortOrder: cat.sortOrder,
            isActive: true,
          },
        });
        categoryMap.set(cat.slug, updated.id);
        stats.categoriesUpdated++;
      } else {
        const created = await prisma.category.create({
          data: {
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            sortOrder: cat.sortOrder,
            isActive: true,
          },
        });
        categoryMap.set(cat.slug, created.id);
        stats.categoriesInserted++;
      }
    } catch (err) {
      logger.error(`Failed to seed category ${cat.slug}: ${String(err)}`);
      stats.failedRecords++;
    }
  }

  // 4. Seed Collections
  const collectionMap = new Map<string, string>(); // slug -> id
  for (const col of SEED_COLLECTIONS) {
    try {
      const existing = await prisma.collection.findUnique({ where: { slug: col.slug } });
      if (existing) {
        const updated = await prisma.collection.update({
          where: { id: existing.id },
          data: {
            name: col.name,
            tagline: col.tagline,
            description: col.description,
            bannerImageUrl: col.bannerImageUrl,
            isFeatured: col.isFeatured,
            sortOrder: col.sortOrder,
            isActive: true,
          },
        });
        collectionMap.set(col.slug, updated.id);
        stats.collectionsUpdated++;
      } else {
        const created = await prisma.collection.create({
          data: {
            name: col.name,
            slug: col.slug,
            tagline: col.tagline,
            description: col.description,
            bannerImageUrl: col.bannerImageUrl,
            isFeatured: col.isFeatured,
            sortOrder: col.sortOrder,
            isActive: true,
          },
        });
        collectionMap.set(col.slug, created.id);
        stats.collectionsInserted++;
      }
    } catch (err) {
      logger.error(`Failed to seed collection ${col.slug}: ${String(err)}`);
      stats.failedRecords++;
    }
  }

  // 5. Seed 36 Products and their related graphs
  for (const p of SEED_PRODUCTS) {
    try {
      const categoryId = categoryMap.get(p.categorySlug);
      if (!categoryId) {
        throw new Error(`Category ${p.categorySlug} not found in categoryMap!`);
      }

      const existingProd = await prisma.product.findUnique({ where: { slug: p.slug } });

      let productId: string;
      const productPayload = {
        name: p.name,
        sku: p.sku,
        slug: p.slug,
        categoryId,
        shortDescription: p.shortDescription,
        description: p.description,
        basePrice: p.basePrice,
        compareAtPrice: p.compareAtPrice ?? null,
        brand: "The Nail Lounge",
        countryOfOrigin: "India",
        isFeatured: p.isFeatured ?? false,
        isActive: true,
        isPublished: p.isPublished ?? true,
        packageContents: p.packageContents ? p.packageContents.join("\n") : null,
        applicationGuide: p.applicationGuide ? p.applicationGuide.join("\n") : null,
        removalGuide: p.removalGuide ? p.removalGuide.join("\n") : null,
      };

      if (existingProd) {
        const updated = await prisma.product.update({
          where: { id: existingProd.id },
          data: productPayload,
        });
        productId = updated.id;
        stats.productsUpdated++;
      } else {
        const created = await prisma.product.create({
          data: productPayload,
        });
        productId = created.id;
        stats.productsInserted++;
      }

      // 5a. Seed Images (Upsert/Replace for this product)
      await prisma.productImage.deleteMany({ where: { productId } });
      for (let i = 0; i < p.images.length; i++) {
        const img = p.images[i];
        await prisma.productImage.create({
          data: {
            productId,
            url: img.url,
            publicId: `tnl_fixtures/${p.slug}_${i + 1}`,
            altText: img.altText,
            sortOrder: i,
            isPrimary: img.isPrimary,
          },
        });
        stats.imagesUpserted++;
      }

      // 5b. Seed Attributes (Faceted navigation)
      await prisma.productAttribute.deleteMany({ where: { productId } });
      for (const [name, value] of Object.entries(p.attributes)) {
        await prisma.productAttribute.create({
          data: {
            productId,
            name,
            value,
          },
        });
        stats.attributesUpserted++;
      }

      // 5c. Link Collections
      for (const colSlug of p.collections) {
        const colId = collectionMap.get(colSlug);
        if (colId) {
          await prisma.collectionProduct.upsert({
            where: {
              collectionId_productId: {
                collectionId: colId,
                productId,
              },
            },
            update: {},
            create: {
              collectionId: colId,
              productId,
              sortOrder: 0,
            },
          });
        }
      }

      // 5d. Seed Options, OptionValues, Variants & Inventory
      // Cache product options to avoid duplicate option creates
      const optionMap = new Map<string, string>(); // optionName -> optionId
      const valueMap = new Map<string, string>(); // `${optionName}:${value}` -> optionValueId

      for (let vIndex = 0; vIndex < p.variants.length; vIndex++) {
        const v = p.variants[vIndex];

        // Ensure each option for this variant exists on the product
        const assignedValueIds: string[] = [];

        for (let optIndex = 0; optIndex < v.options.length; optIndex++) {
          const opt = v.options[optIndex];
          let optId = optionMap.get(opt.name);

          if (!optId) {
            let existingOpt = await prisma.productOption.findFirst({
              where: { productId, name: opt.name },
            });
            if (!existingOpt) {
              existingOpt = await prisma.productOption.create({
                data: {
                  productId,
                  name: opt.name,
                  sortOrder: optIndex,
                },
              });
            }
            optId = existingOpt.id;
            optionMap.set(opt.name, optId);
          }

          const valKey = `${opt.name}:${opt.value}`;
          let valId = valueMap.get(valKey);

          if (!valId) {
            let existingVal = await prisma.productOptionValue.findFirst({
              where: { optionId: optId, value: opt.value },
            });
            if (!existingVal) {
              existingVal = await prisma.productOptionValue.create({
                data: {
                  optionId: optId,
                  value: opt.value,
                  sortOrder: optIndex,
                },
              });
            }
            valId = existingVal.id;
            valueMap.set(valKey, valId);
          }

          assignedValueIds.push(valId);
        }

        // Upsert ProductVariant
        const variantRecord = await prisma.productVariant.upsert({
          where: { sku: v.sku },
          update: {
            title: v.title,
            price: v.price,
            compareAtPrice: v.compareAtPrice ?? null,
            isAvailable: v.isAvailable,
            isPublished: v.isPublished ?? true,
            sortOrder: vIndex,
          },
          create: {
            productId,
            sku: v.sku,
            title: v.title,
            price: v.price,
            compareAtPrice: v.compareAtPrice ?? null,
            isAvailable: v.isAvailable,
            isPublished: v.isPublished ?? true,
            sortOrder: vIndex,
          },
        });
        stats.variantsUpserted++;

        // Connect VariantOptionValue mappings
        for (const valId of assignedValueIds) {
          await prisma.variantOptionValue.upsert({
            where: {
              variantId_optionValueId: {
                variantId: variantRecord.id,
                optionValueId: valId,
              },
            },
            update: {},
            create: {
              variantId: variantRecord.id,
              optionValueId: valId,
            },
          });
        }

        // Upsert Inventory
        await prisma.productInventory.upsert({
          where: { variantId: variantRecord.id },
          update: {
            quantity: v.stock,
            reservedQuantity: 0,
            lowStockThreshold: 3,
          },
          create: {
            variantId: variantRecord.id,
            quantity: v.stock,
            reservedQuantity: 0,
            lowStockThreshold: 3,
          },
        });
        stats.inventoriesUpserted++;
      }
    } catch (err) {
      logger.error(`Failed seeding product ${p.slug}: ${String(err)}`);
      stats.failedRecords++;
    }
  }

  logger.info("Catalogue seed completed successfully!", { stats });
  return stats;
}

// CLI runner
if (require.main === module) {
  runCatalogueSeed()
    .then((stats) => {
      console.log("\n=======================================================");
      console.log("THE NAIL LOUNGE — SEED EXECUTION SUMMARY");
      console.log("=======================================================");
      console.log(`Categories Created/Updated : ${stats.categoriesInserted} created, ${stats.categoriesUpdated} updated`);
      console.log(`Collections Created/Updated: ${stats.collectionsInserted} created, ${stats.collectionsUpdated} updated`);
      console.log(`Products Created/Updated   : ${stats.productsInserted} created, ${stats.productsUpdated} updated (Total: 36)`);
      console.log(`Variants Upserted          : ${stats.variantsUpserted}`);
      console.log(`Inventory Records Upserted : ${stats.inventoriesUpserted}`);
      console.log(`Images Upserted            : ${stats.imagesUpserted}`);
      console.log(`Attributes Upserted        : ${stats.attributesUpserted}`);
      console.log(`Failed Records             : ${stats.failedRecords}`);
      console.log("=======================================================\n");
      process.exit(stats.failedRecords > 0 ? 1 : 0);
    })
    .catch((err) => {
      console.error("\n[SEED FATAL ERROR]", err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

