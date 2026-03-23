import { describe, it, expect } from "vitest";
import {
  skillCreateSchema,
  skillUpdateSchema,
} from "@/lib/validators/skill";

// ─── skillCreateSchema ───────────────────────────────────────
describe("skillCreateSchema", () => {
  it("accepts a minimal valid skill", () => {
    const result = skillCreateSchema.safeParse({ title: "Go" });
    expect(result.success).toBe(true);
  });

  it("accepts a fully populated skill", () => {
    const result = skillCreateSchema.safeParse({
      title: "TypeScript",
      description: "A typed superset of JavaScript",
      level: "INTERMEDIATE",
      progress: 75,
    });
    expect(result.success).toBe(true);
  });

  it("accepts all valid levels", () => {
    for (const level of ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const) {
      const result = skillCreateSchema.safeParse({ title: "Test", level });
      expect(result.success).toBe(true);
    }
  });

  it("accepts progress at boundary values 0 and 100", () => {
    expect(skillCreateSchema.safeParse({ title: "Test", progress: 0 }).success).toBe(true);
    expect(skillCreateSchema.safeParse({ title: "Test", progress: 100 }).success).toBe(true);
  });

  it("rejects missing title", () => {
    const result = skillCreateSchema.safeParse({ level: "BEGINNER" });
    expect(result.success).toBe(false);
  });

  it("rejects empty title", () => {
    const result = skillCreateSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });

  it("accepts single character title (min is 1)", () => {
    const result = skillCreateSchema.safeParse({ title: "X" });
    expect(result.success).toBe(true);
  });

  it("rejects title longer than 100 characters", () => {
    const result = skillCreateSchema.safeParse({ title: "a".repeat(101) });
    expect(result.success).toBe(false);
  });

  it("rejects invalid level", () => {
    const result = skillCreateSchema.safeParse({ title: "Test", level: "EXPERT" });
    expect(result.success).toBe(false);
  });

  it("rejects progress below 0", () => {
    const result = skillCreateSchema.safeParse({ title: "Test", progress: -1 });
    expect(result.success).toBe(false);
  });

  it("rejects progress above 100", () => {
    const result = skillCreateSchema.safeParse({ title: "Test", progress: 101 });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer progress", () => {
    const result = skillCreateSchema.safeParse({ title: "Test", progress: 50.5 });
    expect(result.success).toBe(false);
  });

  it("rejects description longer than 500 characters", () => {
    const result = skillCreateSchema.safeParse({ title: "Test", description: "a".repeat(501) });
    expect(result.success).toBe(false);
  });

  it("accepts description at exactly 500 characters", () => {
    const result = skillCreateSchema.safeParse({ title: "Test", description: "a".repeat(500) });
    expect(result.success).toBe(true);
  });
});

// ─── skillUpdateSchema ───────────────────────────────────────
describe("skillUpdateSchema", () => {
  it("accepts a partial update with just progress", () => {
    const result = skillUpdateSchema.safeParse({ progress: 75 });
    expect(result.success).toBe(true);
  });

  it("accepts a partial update with just level", () => {
    const result = skillUpdateSchema.safeParse({ level: "ADVANCED" });
    expect(result.success).toBe(true);
  });

  it("accepts isArchived true", () => {
    const result = skillUpdateSchema.safeParse({ isArchived: true });
    expect(result.success).toBe(true);
  });

  it("accepts isArchived false (restore)", () => {
    const result = skillUpdateSchema.safeParse({ isArchived: false });
    expect(result.success).toBe(true);
  });

  it("accepts an empty object (no-op patch)", () => {
    const result = skillUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts a full update", () => {
    const result = skillUpdateSchema.safeParse({
      title: "Updated Title",
      description: "New description",
      level: "ADVANCED",
      progress: 90,
      isArchived: false,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid progress even in a partial update", () => {
    const result = skillUpdateSchema.safeParse({ progress: 150 });
    expect(result.success).toBe(false);
  });

  it("rejects invalid level even in a partial update", () => {
    const result = skillUpdateSchema.safeParse({ level: "MASTER" });
    expect(result.success).toBe(false);
  });

  it("accepts single character title in a partial update (min is 1)", () => {
    const result = skillUpdateSchema.safeParse({ title: "X" });
    expect(result.success).toBe(true);
  });

  it("applies default level of BEGINNER", () => {
    const result = skillCreateSchema.safeParse({ title: "Test" });
    if (result.success) expect(result.data.level).toBe("BEGINNER");
  });

  it("applies default progress of 0", () => {
    const result = skillCreateSchema.safeParse({ title: "Test" });
    if (result.success) expect(result.data.progress).toBe(0);
  });
});