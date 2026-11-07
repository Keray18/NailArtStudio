-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "tagline" VARCHAR(200);

-- AlterTable
ALTER TABLE "product_variants" ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "brand" VARCHAR(100),
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "countryOfOrigin" DROP NOT NULL,
ALTER COLUMN "countryOfOrigin" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "product_variants_isPublished_idx" ON "product_variants"("isPublished");

-- CreateIndex
CREATE INDEX "products_isPublished_idx" ON "products"("isPublished");
