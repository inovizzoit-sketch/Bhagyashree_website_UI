"use client";

import React from "react";
import { useParams } from "next/navigation";
import DynamicFormRenderer from "@/shared/components/DynamicFormRenderer";
import SectionHeading from "@/shared/components/SectionHeading";

export default function PublicFormPage() {
  const params = useParams();
  const slug = params?.slug as string;

  return (
    <div className="min-h-screen py-28 px-6 md:px-8 max-w-4xl mx-auto space-y-8 relative font-sans text-slate-350">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold-solid/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="text-center space-y-4">
        <SectionHeading
          badge="Interactive Web Form"
          plainText="Complete Your"
          highlightText="Submission"
        />
        <p className="text-xs md:text-sm text-[#8E90A2] max-w-lg mx-auto leading-relaxed">
          Please fill out the form below. Our dedicated relationship manager will process your request promptly.
        </p>
      </div>

      <div className="bg-[#050c38]/20 border border-white/5 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-2xl relative z-10">
        <DynamicFormRenderer formSlug={slug} />
      </div>
    </div>
  );
}
