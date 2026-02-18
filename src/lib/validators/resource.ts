import { z } from "zod";

export const resourceCreateSchema = z.object({
  skillId: z.string().min(1),
  title: z.string().min(2).max(100),
  url: z.string().url().optional().or(z.literal("")).transform((v) => (v ? v : undefined)),
  type: z.enum(["COURSE", "BOOK", "ARTICLE", "VIDEO", "CERTIFICATION"]).optional(),
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED"]).optional(),
  notes: z.string().max(1000).optional(),
});
