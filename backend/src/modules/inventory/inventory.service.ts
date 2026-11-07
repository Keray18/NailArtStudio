/**
 * The Nail Lounge — Inventory Read Model Service
 * Provides consistent, non-negative available-to-sell stock calculations.
 * Strictly read-only: Zero stock reservations or mutations in this phase.
 */

export interface StockStatus {
  inStock: boolean;
  isLowStock: boolean;
  availableToSell: number;
}

export class InventoryService {
  /**
   * Calculates the available-to-sell (ATS) quantity.
   * Ensures reserved stock is subtracted and result is never negative.
   */
  public calculateAvailableStock(physicalQuantity: number, reservedQuantity: number): number {
    const rawAvailable = physicalQuantity - reservedQuantity;
    return Math.max(0, rawAvailable);
  }

  /**
   * Determines stock availability flags for public customer presentation.
   */
  public determineStockStatus(
    physicalQuantity: number,
    reservedQuantity: number,
    lowStockThreshold = 3,
    isAvailableFlag = true
  ): StockStatus {
    const availableToSell = this.calculateAvailableStock(physicalQuantity, reservedQuantity);
    const inStock = isAvailableFlag && availableToSell > 0;
    const isLowStock = inStock && availableToSell <= lowStockThreshold;

    return {
      inStock,
      isLowStock,
      availableToSell,
    };
  }
}

export const inventoryService = new InventoryService();

