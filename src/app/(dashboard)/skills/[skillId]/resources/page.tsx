"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  fetchResources,
  createResource,
  deleteResource,
  type Resource,
} from "@/lib/api/resources";

const fieldCls =
  "w-full rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 " +
  "p-2 text-gray-900 dark:text-zinc-50 placeholder:text-gray-400 dark:placeholder:text-zinc-500 " +
  "focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors";

const selectCls =
  "rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 " +
  "p-2 text-gray-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors";

// Isolated component — each row gets its own mutation instance, avoiding shared isPending state
function ResourceItem({
  resource,
  skillId,
}: {
  resource: Resource;
  skillId: string;
}) {
  const qc = useQueryClient();

  const delMut = useMutation({
    mutationFn: () => deleteResource(skillId, resource.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["resources", skillId] }),
  });

  return (
    <li
      className="rounded-lg border border-gray-200 dark:border-zinc-700
        bg-white dark:bg-zinc-900 p-4 transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-zinc-800/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="font-medium text-gray-900 dark:text-zinc-50 truncate">
            {resource.title}
          </h2>

          {resource.url ? (
            <a
              className="mt-1 block break-all text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              href={resource.url}
              target="_blank"
              rel="noreferrer"
            >
              {resource.url}
            </a>
          ) : null}

          <p className="mt-2 text-xs text-gray-400 dark:text-zinc-500 uppercase tracking-wide">
            {resource.type} · {resource.status.replace("_", " ")}
          </p>
        </div>

        <button
          className="shrink-0 text-sm text-red-600 dark:text-red-400 hover:underline
            disabled:opacity-40 transition-opacity"
          disabled={delMut.isPending}
          onClick={() => {
            if (confirm(`Delete "${resource.title}"?`)) delMut.mutate();
          }}
        >
          {delMut.isPending ? "Deleting…" : "Delete"}
        </button>
      </div>

      {delMut.isError && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
          Failed to delete. Try again.
        </p>
      )}
    </li>
  );
}

export default function SkillResourcesPage() {
  const { skillId } = useParams<{ skillId: string }>();
  const qc = useQueryClient();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Resource["status"]>("PLANNED");
  const [type, setType] = useState<Resource["type"]>("ARTICLE");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["resources", skillId],
    queryFn: () => fetchResources(skillId),
    enabled: !!skillId,
  });

  const createMut = useMutation({
    mutationFn: () =>
      createResource(skillId, { title, url: url || undefined, status, type }),
    onSuccess: async () => {
      setTitle("");
      setUrl("");
      setStatus("PLANNED");
      setType("ARTICLE");
      await qc.invalidateQueries({ queryKey: ["resources", skillId] });
    },
  });

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-zinc-50">Resources</h1>
        <Link
          className="rounded-md border border-gray-200 dark:border-zinc-700 px-3 py-2 text-sm
            text-gray-900 dark:text-zinc-50 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          href="/skills"
        >
          Back to skills
        </Link>
      </div>

      {/* Add resource form */}
      <form
        className="space-y-3 rounded-lg border border-gray-200 dark:border-zinc-700
          bg-white dark:bg-zinc-900 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          createMut.mutate();
        }}
      >
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            className={fieldCls}
            placeholder="Resource title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            className={fieldCls}
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            className={selectCls}
            value={type}
            onChange={(e) => setType(e.target.value as Resource["type"])}
          >
            <option value="ARTICLE">Article</option>
            <option value="VIDEO">Video</option>
            <option value="COURSE">Course</option>
            <option value="BOOK">Book</option>
            <option value="CERTIFICATION">Certification</option>
          </select>

          <select
            className={selectCls}
            value={status}
            onChange={(e) => setStatus(e.target.value as Resource["status"])}
          >
            <option value="PLANNED">Planned</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <button
            className="rounded-md bg-gray-900 dark:bg-indigo-600 px-4 py-2 text-white text-sm
              hover:bg-gray-700 dark:hover:bg-indigo-500 disabled:opacity-50 transition-colors"
            disabled={createMut.isPending}
          >
            {createMut.isPending ? "Adding…" : "Add resource"}
          </button>
        </div>

        {createMut.isError && (
          <p className="text-sm text-red-600 dark:text-red-400">Failed to create resource.</p>
        )}
      </form>

      {isLoading && <p className="text-gray-500 dark:text-zinc-400">Loading…</p>}
      {isError && <p className="text-red-600 dark:text-red-400">Failed to load resources.</p>}

      {!isLoading && data?.length === 0 && (
        <p className="text-gray-500 dark:text-zinc-400">No resources yet. Add one above.</p>
      )}

      <ul className="grid gap-3 sm:grid-cols-2">
        {data?.map((r) => (
          <ResourceItem key={r.id} resource={r} skillId={skillId} />
        ))}
      </ul>
    </div>
  );
}