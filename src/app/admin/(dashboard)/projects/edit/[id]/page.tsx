"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProjectForm from "@/modules/admin/components/ProjectForm";
import { getProjectByIdOrSlug } from "@/modules/admin/services/project.service";
import { Project } from "@/modules/admin/types";

export default function EditProjectPage() {
  const params = useParams();
  const id = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  async function loadProject() {
    try {
      setLoading(true);
      setError(null);
      const data = await getProjectByIdOrSlug(id);
      setProject(data);
    } catch (err: any) {
      setError(err.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-xs text-slate-500 tracking-wider uppercase font-semibold">Loading project details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center space-y-3 text-red-400">
        <span className="text-2xl">⚠️</span>
        <p className="text-sm font-semibold">{error || "Project not found"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
          Edit Project: {project.name}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Update specifications, change pricing, and select project amenities.
        </p>
      </div>

      <ProjectForm project={project} />
    </div>
  );
}
