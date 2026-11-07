# The Nail Lounge — Phase 3 Inventory Read Model Specification

## 1. Purpose & Domain Scope

The Phase 3 inventory system is an **inventory read model**. It provides deterministic, real-time stock availability figures to public customers browsing the storefront without executing database write locks or mutating reservation states.

Full checkout stock reservations, optimistic locking, and order fulfillment decrements belong to **Phase 6 (Checkout & Order Lifecycle)**.

---

## 2. Inventory Calculations & Formulas

### 2.1 Available-to-Sell (ATS) Calculation
The available stock for purchase is calculated from the physical on-hand quantity and the currently active reserved quantity:

$$\text{ATS} = \max(0, \text{physicalQuantity} - \text{reservedQuantity})$$

- If physical quantity is 10 and reserved is 3: $\text{ATS} = 7$.
- If physical quantity is 2 and reserved is 5 (e.g. following warehouse discrepancy adjustments): $\text{ATS} = 0$. ATS is clamped to zero and **never returns negative numbers**.

### 2.2 Customer Availability Presentation Flags
```typescript
interface StockStatus {
  inStock: boolean;
  isLowStock: boolean;
  availableToSell: number;
}
```

1. **`inStock`**:
   - `true` if and only if `isAvailable === true` AND `availableToSell > 0`.
   - If a merchant flags a variant as unavailable (`isAvailable = false`), `inStock` evaluates to `false` regardless of physical inventory.
2. **`isLowStock`**:
   - `true` if `inStock === true` AND `availableToSell <= lowStockThreshold` (default threshold: 3 units).
   - Prompts the customer with ethical urgency indicator ("Only 3 left in stock") without artificial countdown timers or falsified scarcity.
3. **`variantCount` & Aggregate Product Stock**:
   - On the product card level, `inStock` is `true` if **at least one** published variant has available stock.
   - `isLowStock` is `true` if any variant is low in stock, giving customers visibility into limited edition items.

---

## 3. Database Representation

Stored in PostgreSQL table `inventory_items`:
```prisma
model InventoryItem {
  id                String   @id @default(uuid()) @db.Uuid
  variantId         String   @unique @db.Uuid
  sku               String   @unique @db.VarChar(100)
  quantity          Int      @default(0) // Physical count
  reservedQuantity  Int      @default(0) // Held in active checkouts
  lowStockThreshold Int      @default(3)
  updatedAt         DateTime @updatedAt @db.Timestamptz(6)

  variant ProductVariant @relation(fields: [variantId], references: [id], onDelete: Cascade)
  @@map("inventory_items")
}
```

---

## 4. Performance & Scalability Considerations

- **Single Query Joins**: Inventory records are retrieved in the same single Prisma relation join query as the variant (`include: { inventory: true }`), preventing $N+1$ database queries.
- **Pure Function Computation**: ATS computation is executed in memory via `inventoryService.determineStockStatus()` in $O(1)$ time per variant.

