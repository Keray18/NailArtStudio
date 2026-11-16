-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'UPI_MANUAL';

-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'PENDING_VERIFICATION';

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "weightGrams" INTEGER NOT NULL DEFAULT 40;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "deliveryCharge" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "expiresAt" TIMESTAMPTZ(6),
ADD COLUMN     "idempotencyKey" VARCHAR(128),
ADD COLUMN     "packagingWeightGrams" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "paymentNotes" TEXT,
ADD COLUMN     "paymentReference" VARCHAR(100),
ADD COLUMN     "totalWeightGrams" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "verificationStatus" VARCHAR(30) NOT NULL DEFAULT 'UNVERIFIED';

-- AlterTable
ALTER TABLE "product_variants" ADD COLUMN     "weightGrams" INTEGER DEFAULT 40;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "weightGrams" INTEGER DEFAULT 40;

-- CreateIndex
CREATE UNIQUE INDEX "orders_idempotencyKey_key" ON "orders"("idempotencyKey");

-- CreateIndex
CREATE INDEX "orders_paymentStatus_idx" ON "orders"("paymentStatus");

