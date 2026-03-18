import { z } from "zod";

export const skillCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional().nullable(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("BEGINNER"),
  progress: z.number().int().min(0).max(100).default(0),
});

// All fields optional for partial updates (edit form + archive/restore)
export const skillUpdateSchema = skillCreateSchema.partial().extend({
  isArchived: z.boolean().optional(),
});

export const resourceCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  url: z.string().url("Must be a valid URL").optional().nullable(),
  type: z
    .enum(["ARTICLE", "VIDEO", "COURSE", "BOOK", "CERTIFICATION"])
    .default("ARTICLE"),
  status: z
    .enum(["PLANNED", "IN_PROGRESS", "COMPLETED"])
    .default("PLANNED"),
  notes: z.string().max(1000).optional().nullable(),
});

export type SkillCreateInput = z.infer<typeof skillCreateSchema>;
export type SkillUpdateInput = z.infer<typeof skillUpdateSchema>;
export type ResourceCreateInput = z.infer<typeof resourceCreateSchema>;