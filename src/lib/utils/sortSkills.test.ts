import { describe, it, expect } from "vitest";
import { sortSkills } from "@/lib/utils/sortSkills";
import type { Skill } from "@/lib/api/skills";

// ─── Fixtures ────────────────────────────────────────────────
const skills: Skill[] = [
  {
    id: "1",
    title: "TypeScript",
    level: "BEGINNER",
    progress: 100,
    isArchived: false,
    updatedAt: "2025-01-03T10:00:00Z",
  },
  {
    id: "2",
    title: "React",
    level: "INTERMEDIATE",
    progress: 60,
    isArchived: false,
    updatedAt: "2025-01-01T10:00:00Z",
  },
  {
    id: "3",
    title: "Algorithms",
    level: "ADVANCED",
    progress: 30,
    isArchived: false,
    updatedAt: "2025-01-04T10:00:00Z",
  },
  {
    id: "4",
    title: "CSS",
    level: "BEGINNER",
    progress: 80,
    isArchived: false,
    updatedAt: "2025-01-02T10:00:00Z",
  },
  {
    id: "5",
    title: "Node.js",
    level: "INTERMEDIATE",
    progress: 60,
    isArchived: false,
    updatedAt: "2025-01-05T10:00:00Z",
  },
];

// ─── category-asc ────────────────────────────────────────────
describe("sortSkills — category-asc", () => {
  it("puts BEGINNER before INTERMEDIATE before ADVANCED", () => {
    const result = sortSkills(skills, "category-asc");
    const levels = result.map((s) => s.level);
    const beginnerEnd = levels.lastIndexOf("BEGINNER");
    const intermediateStart = levels.indexOf("INTERMEDIATE");
    const intermediateEnd = levels.lastIndexOf("INTERMEDIATE");
    const advancedStart = levels.indexOf("ADVANCED");

    expect(beginnerEnd).toBeLessThan(intermediateStart);
    expect(intermediateEnd).toBeLessThan(advancedStart);
  });

  it("within same level, sorts by progress descending", () => {
    const result = sortSkills(skills, "category-asc");
    const beginners = result.filter((s) => s.level === "BEGINNER");
    expect(beginners[0].progress).toBeGreaterThanOrEqual(beginners[1].progress);
  });

  it("within same level and progress, sorts by most recent first", () => {
    const result = sortSkills(skills, "category-asc");
    const intermediates = result.filter((s) => s.level === "INTERMEDIATE");
    // Both have progress 60 — Node.js (Jan 5) should beat React (Jan 1)
    expect(intermediates[0].title).toBe("Node.js");
    expect(intermediates[1].title).toBe("React");
  });

  it("does not mutate the original array", () => {
    const original = [...skills];
    sortSkills(skills, "category-asc");
    expect(skills.map((s) => s.id)).toEqual(original.map((s) => s.id));
  });
});

// ─── category-desc ───────────────────────────────────────────
describe("sortSkills — category-desc", () => {
  it("puts ADVANCED before INTERMEDIATE before BEGINNER", () => {
    const result = sortSkills(skills, "category-desc");
    const levels = result.map((s) => s.level);
    const advancedEnd = levels.lastIndexOf("ADVANCED");
    const intermediateStart = levels.indexOf("INTERMEDIATE");
    const intermediateEnd = levels.lastIndexOf("INTERMEDIATE");
    const beginnerStart = levels.indexOf("BEGINNER");

    expect(advancedEnd).toBeLessThan(intermediateStart);
    expect(intermediateEnd).toBeLessThan(beginnerStart);
  });
});

// ─── progress-desc ───────────────────────────────────────────
describe("sortSkills — progress-desc", () => {
  it("sorts by progress from highest to lowest", () => {
    const result = sortSkills(skills, "progress-desc");
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].progress).toBeGreaterThanOrEqual(result[i + 1].progress);
    }
  });

  it("places 100% skill first", () => {
    const result = sortSkills(skills, "progress-desc");
    expect(result[0].progress).toBe(100);
  });
});

// ─── progress-asc ────────────────────────────────────────────
describe("sortSkills — progress-asc", () => {
  it("sorts by progress from lowest to highest", () => {
    const result = sortSkills(skills, "progress-asc");
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].progress).toBeLessThanOrEqual(result[i + 1].progress);
    }
  });

  it("places 0% or lowest skill first", () => {
    const result = sortSkills(skills, "progress-asc");
    expect(result[0].progress).toBe(Math.min(...skills.map((s) => s.progress)));
  });
});

// ─── recent / oldest ─────────────────────────────────────────
describe("sortSkills — recent", () => {
  it("sorts most recently updated first", () => {
    const result = sortSkills(skills, "recent");
    for (let i = 0; i < result.length - 1; i++) {
      expect(new Date(result[i].updatedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(result[i + 1].updatedAt).getTime()
      );
    }
  });

  it("Node.js (Jan 5) is first", () => {
    const result = sortSkills(skills, "recent");
    expect(result[0].title).toBe("Node.js");
  });
});

describe("sortSkills — oldest", () => {
  it("sorts oldest updated first", () => {
    const result = sortSkills(skills, "oldest");
    for (let i = 0; i < result.length - 1; i++) {
      expect(new Date(result[i].updatedAt).getTime()).toBeLessThanOrEqual(
        new Date(result[i + 1].updatedAt).getTime()
      );
    }
  });

  it("React (Jan 1) is first", () => {
    const result = sortSkills(skills, "oldest");
    expect(result[0].title).toBe("React");
  });
});

// ─── name-asc / name-desc ────────────────────────────────────
describe("sortSkills — name-asc", () => {
  it("sorts titles A to Z", () => {
    const result = sortSkills(skills, "name-asc");
    const titles = result.map((s) => s.title);
    const sorted = [...titles].sort((a, b) => a.localeCompare(b));
    expect(titles).toEqual(sorted);
  });
});

describe("sortSkills — name-desc", () => {
  it("sorts titles Z to A", () => {
    const result = sortSkills(skills, "name-desc");
    const titles = result.map((s) => s.title);
    const sorted = [...titles].sort((a, b) => b.localeCompare(a));
    expect(titles).toEqual(sorted);
  });
});

// ─── Edge cases ───────────────────────────────────────────────
describe("sortSkills — edge cases", () => {
  it("returns empty array unchanged", () => {
    expect(sortSkills([], "category-asc")).toEqual([]);
  });

  it("returns single-item array unchanged", () => {
    const single = [skills[0]];
    expect(sortSkills(single, "progress-desc")).toEqual(single);
  });
});