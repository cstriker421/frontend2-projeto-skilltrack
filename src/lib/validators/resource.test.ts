import { describe, it, expect } from "vitest";
import { resourceCreateSchema } from "@/lib/validators/resource";

describe("resourceCreateSchema", () => {
  // ─── Valid inputs ──────────────────────────────────────────

  it("accepts a minimal valid resource", () => {
    const result = resourceCreateSchema.safeParse({
      skillId: "clxabc123",
      title: "MDN Docs",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a fully populated resource", () => {
    const result = resourceCreateSchema.safeParse({
      skillId: "clxabc123",
      title: "TypeScript Handbook",
      url: "https://www.typescriptlang.org/docs/",
      type: "ARTICLE",
      status: "IN_PROGRESS",
      notes: "Focus on generics chapter",
    });
    expect(result.success).toBe(true);
  });

  it("accepts all valid resource types", () => {
    for (const type of ["COURSE", "BOOK", "ARTICLE", "VIDEO", "CERTIFICATION"] as const) {
      const result = resourceCreateSchema.safeParse({
        skillId: "clxabc123",
        title: "Test Resource",
        type,
      });
      expect(result.success).toBe(true);
    }
  });

  it("accepts all valid status values", () => {
    for (const status of ["PLANNED", "IN_PROGRESS", "COMPLETED"] as const) {
      const result = resourceCreateSchema.safeParse({
        skillId: "clxabc123",
        title: "Test Resource",
        status,
      });
      expect(result.success).toBe(true);
    }
  });

  it("accepts a valid URL", () => {
    const result = resourceCreateSchema.safeParse({
      skillId: "clxabc123",
      title: "MDN",
      url: "https://developer.mozilla.org",
    });
    expect(result.success).toBe(true);
  });

  it("accepts an empty string URL and transforms it to undefined", () => {
    const result = resourceCreateSchema.safeParse({
      skillId: "clxabc123",
      title: "MDN",
      url: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.url).toBeUndefined();
    }
  });

  it("accepts title at exactly 2 characters (min boundary)", () => {
    const result = resourceCreateSchema.safeParse({
      skillId: "clxabc123",
      title: "Go",
    });
    expect(result.success).toBe(true);
  });

  it("accepts title at exactly 100 characters (max boundary)", () => {
    const result = resourceCreateSchema.safeParse({
      skillId: "clxabc123",
      title: "a".repeat(100),
    });
    expect(result.success).toBe(true);
  });

  it("accepts notes at exactly 1000 characters (max boundary)", () => {
    const result = resourceCreateSchema.safeParse({
      skillId: "clxabc123",
      title: "Test",
      notes: "a".repeat(1000),
    });
    expect(result.success).toBe(true);
  });

  // ─── Invalid inputs ────────────────────────────────────────

  it("rejects missing skillId", () => {
    const result = resourceCreateSchema.safeParse({ title: "MDN Docs" });
    expect(result.success).toBe(false);
  });

  it("rejects empty skillId", () => {
    const result = resourceCreateSchema.safeParse({
      skillId: "",
      title: "MDN Docs",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing title", () => {
    const result = resourceCreateSchema.safeParse({ skillId: "clxabc123" });
    expect(result.success).toBe(false);
  });

  it("rejects single character title (min is 2)", () => {
    const result = resourceCreateSchema.safeParse({
      skillId: "clxabc123",
      title: "X",
    });
    expect(result.success).toBe(false);
  });

  it("rejects title longer than 100 characters", () => {
    const result = resourceCreateSchema.safeParse({
      skillId: "clxabc123",
      title: "a".repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it("rejects a malformed URL", () => {
    const result = resourceCreateSchema.safeParse({
      skillId: "clxabc123",
      title: "MDN",
      url: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid resource type", () => {
    const result = resourceCreateSchema.safeParse({
      skillId: "clxabc123",
      title: "Test",
      type: "PODCAST",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid status", () => {
    const result = resourceCreateSchema.safeParse({
      skillId: "clxabc123",
      title: "Test",
      status: "ABANDONED",
    });
    expect(result.success).toBe(false);
  });

  it("rejects notes longer than 1000 characters", () => {
    const result = resourceCreateSchema.safeParse({
      skillId: "clxabc123",
      title: "Test",
      notes: "a".repeat(1001),
    });
    expect(result.success).toBe(false);
  });
});