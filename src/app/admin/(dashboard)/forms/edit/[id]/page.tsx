"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FormBuilder from "@/modules/admin/components/FormBuilder";
import { getFormById } from "@/modules/admin/services/form.service";
import { Form } from "@/modules/admin/types/form.types";

export default function EditFormPage() {
  const params = useParams();
  const id = params?.id as string;

  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadForm();
    }
  }, [id]);

  async function loadForm() {
    try {
      setLoading(true);
      setError(null);
      const data = await getFormById(id);
      setForm(data);
    } catch (err: any) {
      setError(err.message || "Failed to load form");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3 font-sans">
        <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-mono">Loading form configuration...</p>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center space-y-3 text-red-400 font-sans">
        <span className="text-2xl">⚠️</span>
        <p className="text-sm font-semibold">{error || "Form not found"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <FormBuilder form={form} />
    </div>
  );
}
