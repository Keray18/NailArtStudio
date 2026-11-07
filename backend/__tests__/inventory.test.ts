import { describe, it, expect } from "vitest";
import { inventoryService } from "../src/modules/inventory/inventory.service";

describe("Inventory Read Model Service", () => {
  it("should calculate available-to-sell stock accurately", () => {
    const ats = inventoryService.calculateAvailableStock(15, 3);
    expect(ats).toBe(12);
  });

  it("should clamp available-to-sell to 0 when reserved stock exceeds physical quantity", () => {
    const ats = inventoryService.calculateAvailableStock(5, 10);
    expect(ats).toBe(0);
  });

  it("should determine stock status as in-stock when ATS > 0 and isAvailableFlag is true", () => {
    const status = inventoryService.determineStockStatus(20, 5, 3, true);
    expect(status.inStock).toBe(true);
    expect(status.isLowStock).toBe(false);
    expect(status.availableToSell).toBe(15);
  });

  it("should flag low stock when ATS is less than or equal to low stock threshold", () => {
    const status = inventoryService.determineStockStatus(5, 2, 3, true);
    expect(status.inStock).toBe(true);
    expect(status.isLowStock).toBe(true);
    expect(status.availableToSell).toBe(3);
  });

  it("should mark out of stock when physical quantity equals reserved quantity", () => {
    const status = inventoryService.determineStockStatus(4, 4, 3, true);
    expect(status.inStock).toBe(false);
    expect(status.isLowStock).toBe(false);
    expect(status.availableToSell).toBe(0);
  });

  it("should mark out of stock when isAvailableFlag is false even if quantity is positive", () => {
    const status = inventoryService.determineStockStatus(50, 0, 3, false);
    expect(status.inStock).toBe(false);
    expect(status.isLowStock).toBe(false);
    expect(status.availableToSell).toBe(50);
  });
});

