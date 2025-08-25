import { z } from "zod";

export const plateSchema = z
  .string()
  .regex(/^[A-Z0-9]{2,7}$/, "Plate must be 2-7 uppercase alphanumerics");

export const checkQuerySchema = z.object({
  plate: plateSchema,
  state: z.enum(["CA"]).default("CA"),
});

export const suggestBodySchema = z.object({
  seed: z.string().min(1),
  count: z.number().min(1).max(50).default(12),
  constraints: z
    .object({
      min: z.number().min(1).max(7).optional(),
      max: z.number().min(1).max(7).optional(),
      allowNumbers: z.boolean().optional(),
    })
    .default({}),
});
