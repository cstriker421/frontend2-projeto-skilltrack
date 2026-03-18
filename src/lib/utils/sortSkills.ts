export type SortableSkill = {
  id: string;
  title: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  progress: number;
  updatedAt: string;
};

export type SortKey =
  | "category-asc"
  | "category-desc"
  | "progress-desc"
  | "progress-asc"
  | "recent"
  | "oldest"
  | "name-asc"
  | "name-desc";

export const LEVEL_RANK: Record<SortableSkill["level"], number> = {
  BEGINNER: 0,
  INTERMEDIATE: 1,
  ADVANCED: 2,
};

export function sortSkills(skills: SortableSkill[], key: SortKey): SortableSkill[] {
  const copy = [...skills];

  const byRecent = (a: SortableSkill, b: SortableSkill) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();

  const byCategory = (a: SortableSkill, b: SortableSkill) =>
    LEVEL_RANK[a.level] - LEVEL_RANK[b.level];

  const byCategoryDesc = (a: SortableSkill, b: SortableSkill) =>
    LEVEL_RANK[b.level] - LEVEL_RANK[a.level];

  const byProgressDesc = (a: SortableSkill, b: SortableSkill) =>
    b.progress - a.progress;

  const byProgressAsc = (a: SortableSkill, b: SortableSkill) =>
    a.progress - b.progress;

  switch (key) {
    case "category-asc":
      return copy.sort((a, b) =>
        byCategory(a, b) || byProgressDesc(a, b) || byRecent(a, b)
      );
    case "category-desc":
      return copy.sort((a, b) =>
        byCategoryDesc(a, b) || byProgressDesc(a, b) || byRecent(a, b)
      );
    case "progress-desc":
      return copy.sort((a, b) =>
        byProgressDesc(a, b) || byCategory(a, b) || byRecent(a, b)
      );
    case "progress-asc":
      return copy.sort((a, b) =>
        byProgressAsc(a, b) || byCategory(a, b) || byRecent(a, b)
      );
    case "recent":
      return copy.sort(byRecent);
    case "oldest":
      return copy.sort((a, b) => -byRecent(a, b));
    case "name-asc":
      return copy.sort((a, b) =>
        a.title.localeCompare(b.title) || byRecent(a, b)
      );
    case "name-desc":
      return copy.sort((a, b) =>
        b.title.localeCompare(a.title) || byRecent(a, b)
      );
    default:
      return copy;
  }
}