import { z } from "zod";

export const searchQuerySchema = z.object({
  q: z.string().trim().min(1, "Search query 'q' must not be empty").max(100),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
});

export type SearchQueryValidated = z.infer<typeof searchQuerySchema>;

