import { z } from "zod";

export const skillCreateSchema = z.object({
  title: z.string().min(2).max(80),
  description: z.string().max(500).optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  progress: z.number().int().min(0).max(100).optional(),
});
