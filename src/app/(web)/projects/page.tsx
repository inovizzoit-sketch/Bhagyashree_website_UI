"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/shared/lib/api-config";
import SectionHeading from "@/shared/components/SectionHeading";
import AmenityIcon from "@/shared/components/AmenityIcon";

interface Project {
  id: string;
  name: string;
  slug: string;
  projectType: string;
  projectStatus: string;
  shortDescription: string;
  description: string;
  location: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  startingPrice: string;
  pricePerSqft: string;
  thumbnailImage?: string;
  brochureFile?: string;
  isFeatured: boolean;
  isActive: boolean;
  amenities?: {
    id: string;
    name: string;
    icon?: string;
  }[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("ALL");


  useEffect(() => {
    let active = true;
    fetch(`${API_BASE_URL}/projects`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch projects");
        return res.json();
      })
      .then((data) => {
        if (active) {
          const activeProjects = data.filter((p: Project) => p.isActive);
          setProjects(activeProjects);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Failed to load projects");
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  function formatPrice(priceStr: string) {
    const val = parseFloat(priceStr);
    if (isNaN(val)) return "N/A";
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)} Lakh`;
    }
    return `₹${val.toLocaleString()}`;
  }

  const filteredProjects = activeFilter === "ALL"
    ? projects
    : activeFilter === "DEVELOPER"
      ? projects.filter(p => p.projectType === "DEVELOPER" || p.projectType === "CONSTRUCTION")
      : projects.filter(p => p.projectType === activeFilter);

  const uniqueTypes = new Set(projects.map(p => p.projectType));

  const filterTabs = [
    { label: "All Works", value: "ALL" },
    ...(uniqueTypes.has("APARTMENT") ? [{ label: "Apartments", value: "APARTMENT" }] : []),
    ...(uniqueTypes.has("VILLA") ? [{ label: "Villas", value: "VILLA" }] : []),
    ...(uniqueTypes.has("PLOT") ? [{ label: "Plots", value: "PLOT" }] : []),
    ...(uniqueTypes.has("COMMERCIAL") ? [{ label: "Commercial", value: "COMMERCIAL" }] : []),
    ...(uniqueTypes.has("DEVELOPER") || uniqueTypes.has("CONSTRUCTION") ? [{ label: "Developer / Construction", value: "DEVELOPER" }] : [])
  ];

  return (
    <div className="min-h-screen bg-[#FBF8F2] pb-32 overflow-hidden relative font-sans text-slate-800 border-t border-[#EADBB4]/60">
      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40vh] -left-[200px] w-[500px] h-[500px] bg-[#8C6D23]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Header Banner */}
      <div className="relative pt-24 pb-6 md:pt-32 md:pb-8 z-10">
        <SectionHeading
          badge="Exquisite Developments"
          plainText="Our Architectural"
          highlightText="Portfolio"
          align="center"
          className="!mb-4"
        />
        <p className="mx-auto max-w-2xl px-6 text-center text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal">
          Discover a curated collection of landmark premium residences, ultra-modern luxury apartments, and signature villa plotting projects designed for contemporary living.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10 space-y-12">
        {/* Filtering Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 border-b border-[#EADBB4]/60 pb-8">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`px-5 py-2.5 text-[11px] font-extrabold uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer border outline-none ${activeFilter === tab.value
                ? "bg-[#1A150C] text-white border-[#1A150C] shadow-md scale-105"
                : "bg-white border-[#EADBB4] text-[#8C6D23] hover:text-[#1A150C] hover:bg-[#FAF4E8]"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-10 h-10 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Fetching projects...</p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="max-w-md mx-auto p-6 rounded-2xl border border-red-500/20 bg-red-500/5 text-center space-y-4">
            <span className="text-3xl">⚠️</span>
            <h3 className="text-base font-bold text-[#1A150C]">Unable to Load Portfolio</h3>
            <p className="text-xs text-slate-600">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredProjects.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#EADBB4] p-8 space-y-4 max-w-xl mx-auto shadow-sm">
            <div className="text-3xl text-[#D4AF37]">📂</div>
            <h3 className="text-lg font-extrabold text-[#1A150C]">No Developments Found</h3>
            <p className="text-xs text-slate-600">
              We currently don&apos;t have active listings in this category. Check back later or view our general collection.
            </p>
            <button
              onClick={() => setActiveFilter("ALL")}
              className="px-6 py-3 bg-[#1A150C] hover:bg-[#8C6D23] text-white font-extrabold text-xs rounded-full uppercase tracking-wider transition-all cursor-pointer border-none"
            >
              Show All Developments
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && filteredProjects.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#EADBB4] bg-white hover:border-[#D4AF37] transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#D4AF37]/15 relative"
              >
                {/* Media Wrapper */}
                <Link
                  href={`/projects/${project.slug}`}
                  className="aspect-[16/10] w-full relative overflow-hidden bg-slate-900 block"
                >
                  {project.thumbnailImage ? (
                    <img
                      src={project.thumbnailImage}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-slate-900 to-[#1A150C] flex items-center justify-center">
                      <span className="text-[#D4AF37]/30 font-extrabold text-2xl uppercase tracking-widest font-mono">
                        {project.projectType}
                      </span>
                    </div>
                  )}

                  {/* Glass Backdrop Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />

                  {/* Status Badge */}
                  <span className={`absolute top-4 left-4 text-[9px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full border backdrop-blur-md shadow-md ${project.projectStatus === "COMPLETED"
                    ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                    : project.projectStatus === "ONGOING"
                      ? "bg-amber-950/80 text-amber-300 border-amber-500/40"
                      : "bg-blue-950/80 text-blue-300 border-blue-500/40"
                    }`}>
                    {project.projectStatus}
                  </span>

                  {/* Project Type Badge */}
                  <span className="absolute top-4 right-4 text-[9px] font-extrabold tracking-wider uppercase bg-[#1A150C]/90 text-[#D4AF37] border border-[#D4AF37]/40 px-3 py-1 rounded-full backdrop-blur-md shadow-md">
                    {project.projectType}
                  </span>
                </Link>

                {/* Details Wrapper */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8C6D23] bg-[#FAF4E8] border border-[#EADBB4] px-2.5 py-0.5 rounded-full inline-block">
                      📍 {project.location}, {project.city}
                    </span>
                    <Link href={`/projects/${project.slug}`} className="block no-underline group-hover:text-[#8C6D23] transition-colors">
                      <h3 className="text-xl font-extrabold text-[#1A150C] tracking-tight font-sans transition-colors duration-250 line-clamp-1">
                        {project.name}
                      </h3>
                    </Link>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 font-normal">
                      {project.shortDescription || project.description}
                    </p>
                  </div>

                  {/* Info Row & Price */}
                  <div className="border-t border-[#EADBB4]/60 pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        Starting From
                      </span>
                      <span className="text-base font-extrabold text-[#8C6D23]">
                        {formatPrice(project.startingPrice)}
                      </span>
                    </div>
                    <div className="text-right bg-[#FAF4E8] border border-[#EADBB4] px-3 py-1 rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">
                        Price Per Sqft
                      </span>
                      <span className="text-xs font-extrabold text-[#8C6D23]">
                        ₹{parseFloat(project.pricePerSqft).toLocaleString()}/sqft
                      </span>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="pt-3 border-t border-[#EADBB4]/60 flex gap-2">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex-1 py-3 bg-[#1A150C] hover:bg-[#8C6D23] text-white text-center rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 no-underline cursor-pointer shadow-md hover:scale-[1.02] active:scale-95 border-none"
                    >
                      Explore Project ➔
                    </Link>
                    {project.brochureFile && (
                      <a
                        href={project.brochureFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-3 bg-[#FAF4E8] hover:bg-[#EADBB4] text-[#1A150C] border border-[#EADBB4] rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer no-underline flex items-center justify-center active:scale-95"
                        title="Download Brochure"
                      >
                        📄
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
