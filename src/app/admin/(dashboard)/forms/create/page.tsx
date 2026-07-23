"use client";

import React from "react";
import FormBuilder from "@/modules/admin/components/FormBuilder";

export default function CreateFormPage() {
  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
          Create Dynamic Form
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Add new fields, re-order inputs, and define submit handler rules.
        </p>
      </div>

      <FormBuilder />
    </div>
  );
}
