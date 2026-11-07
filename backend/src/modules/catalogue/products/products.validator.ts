import { z } from "zod";

export const productListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
  category: z.string().trim().min(1).optional(),
  collection: z.string().trim().min(1).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  inStockOnly: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => {
      if (typeof val === "boolean") return val;
      if (typeof val === "string") {
        return val.toLowerCase() === "true" || val === "1";
      }
      return false;
    }),
  shape: z.string().trim().min(1).optional(),
  length: z.string().trim().min(1).optional(),
  finish: z.string().trim().min(1).optional(),
  sort: z.enum(["featured", "price-asc", "price-desc", "newest"]).default("featured"),
  q: z.string().trim().max(100).optional(),
});

export type ProductListQueryValidated = z.infer<typeof productListQuerySchema>;

