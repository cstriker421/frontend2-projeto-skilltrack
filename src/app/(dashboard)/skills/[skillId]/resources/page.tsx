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
  });

  const createMut = useMutation({
    mutationFn: async () =>
      createResource({ skillId, title, url: url || undefined, status, type }),
    onSuccess: async () => {
      setTitle("");
      setUrl("");
      await qc.invalidateQueries({ queryKey: ["resources", skillId] });
    },
  });

  const delMut = useMutation({
    mutationFn: async (resourceId: string) => deleteResource(resourceId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["resources", skillId] });
    },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Resources</h1>
        <Link className="rounded-md border px-3 py-2 text-sm" href="/skills">
          Back to skills
        </Link>
      </div>

      <form
        className="rounded-md border p-3 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          createMut.mutate();
        }}
      >
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            className="w-full rounded-md border p-2"
            placeholder="Resource title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            className="w-full rounded-md border p-2"
            placeholder="URL (optional)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            className="rounded-md border p-2"
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
            className="rounded-md border p-2"
            value={status}
            onChange={(e) => setStatus(e.target.value as Resource["status"])}
          >
            <option value="PLANNED">Planned</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <button
            className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
            disabled={createMut.isPending}
          >
            {createMut.isPending ? "Adding…" : "Add resource"}
          </button>
        </div>

        {createMut.isError ? (
          <p className="text-sm text-red-600">Failed to create resource.</p>
        ) : null}
      </form>

      {isLoading && <p>Loading…</p>}
      {isError && <p className="text-red-600">Failed to load resources.</p>}

      <ul className="grid gap-3 sm:grid-cols-2">
        {data?.map((r) => (
          <li key={r.id} className="rounded-md border p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-medium">{r.title}</h2>
                {r.url ? (
                  <a
                    className="mt-1 block text-sm text-blue-600 hover:underline break-all"
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {r.url}
                  </a>
                ) : null}
                <p className="mt-2 text-xs text-neutral-600">
                  {r.type} • {r.status}
                </p>
              </div>

              <button
                className="text-sm text-red-600 hover:underline disabled:opacity-50"
                disabled={delMut.isPending}
                onClick={() => {
                  if (confirm("Delete this resource?")) delMut.mutate(r.id);
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
