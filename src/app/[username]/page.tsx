import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CopyLinkButton from "./CopyLinkButton";

type Skill = {
  id: string;
  title: string;
  description?: string | null;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  progress: number;
};

type ProfileData = {
  username: string;
  avatar: string | null;
  createdAt: string;
  skills: Skill[];
};

const LEVEL_LABELS: Record<Skill["level"], string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

const LEVEL_COLORS: Record<Skill["level"], string> = {
  BEGINNER: "bg-emerald-500 dark:bg-emerald-400",
  INTERMEDIATE: "bg-sky-500 dark:bg-sky-400",
  ADVANCED: "bg-violet-500 dark:bg-violet-400",
};

const LEVEL_BADGE: Record<Skill["level"], string> = {
  BEGINNER: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950",
  INTERMEDIATE: "text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950",
  ADVANCED: "text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950",
};

async function getProfile(username: string): Promise<ProfileData | null> {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/public/users/${username}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfile(username);

  if (!profile) return { title: "Profile not found — SkillTrack" };

  const skillCount = profile.skills.length;
  const avgProgress =
    skillCount === 0
      ? 0
      : Math.round(
          profile.skills.reduce((sum, s) => sum + s.progress, 0) / skillCount
        );

  return {
    title: `${profile.avatar ?? "🔥"} ${profile.username} — SkillTrack`,
    description: `${profile.username} is tracking ${skillCount} skill${skillCount !== 1 ? "s" : ""} with an average progress of ${avgProgress}%.`,
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getProfile(username);

  if (!profile) notFound();

  const { skills } = profile;
  const avgProgress =
    skills.length === 0
      ? 0
      : Math.round(skills.reduce((sum, s) => sum + s.progress, 0) / skills.length);

  const levels: Skill["level"][] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
  const grouped = levels
    .map((level) => ({ level, skills: skills.filter((s) => s.level === level) }))
    .filter((g) => g.skills.length > 0);

  const joinYear = new Date(profile.createdAt).getFullYear();
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const profileUrl = `${baseUrl}/${username}`;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-8 animate-fade-up">

      {/* ── Profile header ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-5">
          <div className="flex items-center justify-center w-16 h-16 rounded-full text-4xl
            border-2 border-orange-200 dark:border-orange-900 select-none
            bg-orange-50 dark:bg-orange-950/30">
            {profile.avatar ?? "🔥"}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-zinc-50">
              {profile.username}
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Tracking skills since {joinYear}
            </p>
          </div>
        </div>

        <CopyLinkButton url={profileUrl} />
      </div>

      {/* ── Overall mastery ── */}
      {skills.length > 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-zinc-700
          bg-white dark:bg-zinc-900 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-700 dark:text-zinc-300">
              Overall Mastery
            </h2>
            <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
              {avgProgress}%
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
            <div
              className={`h-full rounded-full progress-bar-fill
                ${avgProgress === 100
                  ? "bar-complete"
                  : "bg-gradient-to-r from-orange-400 to-orange-600"
                }`}
              style={{ width: `${avgProgress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-gray-400 dark:text-zinc-500">
            {skills.length} active skill{skills.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* ── Skills by level ── */}
      {grouped.length === 0 ? (
        <p className="text-gray-500 dark:text-zinc-400">No public skills yet.</p>
      ) : (
        grouped.map(({ level, skills: levelSkills }) => (
          <div key={level} className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest
              text-gray-400 dark:text-zinc-500">
              {LEVEL_LABELS[level]}
            </h2>

            <ul className="grid gap-3 sm:grid-cols-2">
              {levelSkills.map((skill) => (
                <li key={skill.id}
                  className="rounded-lg border border-gray-200 dark:border-zinc-700
                    bg-white dark:bg-zinc-900 p-4 flex flex-col gap-3
                    transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
                    hover:border-orange-200 dark:hover:border-orange-900/50
                    dark:hover:shadow-zinc-800/50">

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-zinc-50 truncate">
                        {skill.title}
                      </p>
                      {skill.description && (
                        <p className="mt-0.5 text-sm text-gray-500 dark:text-zinc-400 line-clamp-2">
                          {skill.description}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${LEVEL_BADGE[level]}`}>
                        {LEVEL_LABELS[level]}
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50">
                        {skill.progress}%
                      </span>
                    </div>
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full
                        ${skill.progress === 100
                          ? "bar-complete"
                          : `progress-bar-fill ${LEVEL_COLORS[level]}`
                        }`}
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </main>
  );
}