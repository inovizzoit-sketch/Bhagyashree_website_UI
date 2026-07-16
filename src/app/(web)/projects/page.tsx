"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/shared/lib/api-config";

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
          const dbSlugs = activeProjects.map((p: Project) => p.slug);
          const uniqueStatic = STATIC_PROJECTS.filter(sp => !dbSlugs.includes(sp.slug));
          setProjects([...activeProjects, ...uniqueStatic]);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Failed to load projects");
          setProjects(STATIC_PROJECTS);
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
    : projects.filter(p => p.projectType === activeFilter);

  const filterTabs = [
    { label: "All Works", value: "ALL" },
    { label: "Apartments", value: "APARTMENT" },
    { label: "Villas", value: "VILLA" },
    { label: "Plots", value: "PLOT" },
    { label: "Commercial", value: "COMMERCIAL" }
  ];

  return (
    <div className="min-h-screen bg-[#020520] pb-32 overflow-hidden relative">
      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-gold-solid/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40vh] -left-[200px] w-[500px] h-[500px] bg-gold-solid/2 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Header Banner */}
      <div className="relative pt-28 pb-16 md:pt-36 md:pb-24 z-10">
        <div className="mx-auto max-w-5xl px-6 md:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-solid/5 border border-gold-solid/20 text-[10px] font-bold uppercase tracking-widest text-gold-solid">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-solid animate-pulse"></span>
            Exquisite Developments
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white font-sans leading-tight">
            Our Architectural <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-solid via-gold-hover to-gold-dark">Portfolio</span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm md:text-base text-text-gray-muted leading-relaxed font-light">
            Discover a curated collection of landmark premium residences, ultra-modern luxury apartments, and signature villa plotting projects designed for contemporary living.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10 space-y-12">
        {/* Filtering Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 border-b border-white/5 pb-8">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer border ${
                activeFilter === tab.value
                  ? "bg-gold-solid text-[#020520] border-gold-solid shadow-lg shadow-gold-solid/10 font-extrabold scale-[1.03]"
                  : "bg-[#050c38]/40 border-white/5 text-text-gray-muted hover:text-white hover:border-gold-solid/30"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-10 h-10 border-2 border-gold-solid/20 border-t-gold-solid rounded-full animate-spin" />
            <p className="text-xs text-text-gray-muted uppercase tracking-widest font-semibold">Fetching projects...</p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="max-w-md mx-auto p-6 rounded-2xl border border-red-500/20 bg-red-500/5 text-center space-y-4">
            <span className="text-3xl">⚠️</span>
            <h3 className="text-base font-bold text-white">Unable to Load Portfolio</h3>
            <p className="text-xs text-text-gray-muted">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredProjects.length === 0 && (
          <div className="text-center py-20 bg-[#050c38]/20 rounded-3xl border border-white/5 p-8 space-y-4 max-w-xl mx-auto backdrop-blur-sm">
            <div className="text-3xl text-gold-solid/50">📂</div>
            <h3 className="text-lg font-bold text-white">No Developments Found</h3>
            <p className="text-xs text-text-gray-muted">
              We currently don&apos;t have active listings in this category. Check back later or view our general collection.
            </p>
            <button
              onClick={() => setActiveFilter("ALL")}
              className="px-5 py-2.5 bg-gold-solid hover:bg-gold-hover text-[#020520] font-bold text-xs rounded-xl transition-all cursor-pointer"
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
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-[#050c38]/25 hover:bg-[#050c38]/40 hover:border-gold-solid/35 transition-all duration-300 shadow-2xl relative backdrop-blur-sm"
              >
                {/* Media Wrapper */}
                <Link
                  href={`/projects/${project.slug}`}
                  className="aspect-[16/10] w-full relative overflow-hidden bg-[#020520] block"
                >
                  {project.thumbnailImage ? (
                    <img
                      src={project.thumbnailImage}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-[#020520] to-[#050c38] flex items-center justify-center">
                      <span className="text-gold-solid/25 font-extrabold text-2xl uppercase tracking-widest font-mono">
                        {project.projectType}
                      </span>
                    </div>
                  )}
                  
                  {/* Glass Backdrop Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020520]/80 via-transparent to-transparent opacity-60" />

                  {/* Status Badge */}
                  <span className={`absolute top-4 left-4 text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border backdrop-blur-md ${
                    project.projectStatus === "COMPLETED"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : project.projectStatus === "ONGOING"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  }`}>
                    {project.projectStatus}
                  </span>
                  
                  {/* Project Type Badge */}
                  <span className="absolute top-4 right-4 text-[9px] font-bold tracking-wider uppercase bg-[#020520]/80 text-gold-solid border border-gold-solid/25 px-2.5 py-1 rounded-md backdrop-blur-md">
                    {project.projectType}
                  </span>
                </Link>

                {/* Details Wrapper */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-solid flex items-center gap-1.5">
                      <span>📍</span> {project.location}, {project.city}
                    </span>
                    <Link href={`/projects/${project.slug}`} className="block no-underline group-hover:text-gold-solid transition-colors">
                      <h3 className="text-lg font-bold text-white tracking-tight font-sans transition-colors duration-250">
                        {project.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-text-gray-muted leading-relaxed line-clamp-3 font-light">
                      {project.shortDescription || project.description}
                    </p>
                  </div>

                  {/* Info Row & Price */}
                  <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-text-gray-muted uppercase tracking-wider block">
                        Starting From
                      </span>
                      <span className="text-base font-extrabold text-gold-solid">
                        {formatPrice(project.startingPrice)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-text-gray-muted uppercase tracking-wider block">
                        Price Per Sqft
                      </span>
                      <span className="text-xs font-semibold text-white">
                        ₹{parseFloat(project.pricePerSqft).toLocaleString()}/sqft
                      </span>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="pt-3 border-t border-white/5 flex gap-2">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex-1 py-2.5 bg-gold-solid hover:bg-gold-hover text-[#020520] text-center rounded-xl text-xs font-bold transition-all duration-300 no-underline cursor-pointer shadow-md hover:shadow-lg hover:shadow-gold-solid/5 active:scale-[0.98]"
                    >
                      Explore Project
                    </Link>
                    {project.brochureFile && (
                      <a
                        href={project.brochureFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2.5 bg-[#050c38]/40 hover:bg-[#050c38]/80 text-text-gray-light hover:text-gold-solid border border-white/5 hover:border-gold-solid/35 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer no-underline flex items-center justify-center active:scale-[0.98]"
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

const STATIC_PROJECTS: Project[] = [
  {
    id: "static-enclave-id",
    name: "Nandeeka Enclave",
    slug: "nandeeka-enclave",
    projectType: "VILLA",
    projectStatus: "ONGOING",
    shortDescription: "An elite gated community layout offering residential villa plots with top-tier utility setups in Rohaniya.",
    description: "An elite gated community layout offering residential villa plots with top-tier utility setups in Rohaniya.",
    location: "Rohaniya",
    address: "Rohaniya",
    city: "Varanasi",
    state: "UP",
    pincode: "221108",
    startingPrice: "8500000",
    pricePerSqft: "4500",
    thumbnailImage: "/images/hero_brand.png",
    isFeatured: true,
    isActive: true,
  },
  {
    id: "static-heights-id",
    name: "Nandeeka Heights",
    slug: "nandeeka-heights",
    projectType: "APARTMENT",
    projectStatus: "ONGOING",
    shortDescription: "Modern corporate towers and premium retail spaces at the most high-potential commercial growth corridor of Varanasi.",
    description: "Modern corporate towers and premium retail spaces at the most high-potential commercial growth corridor of Varanasi.",
    location: "Rohaniya",
    address: "Rohaniya - DLW Road",
    city: "Varanasi",
    state: "UP",
    pincode: "221108",
    startingPrice: "12500000",
    pricePerSqft: "6500",
    thumbnailImage: "/images/hero_waterfront.png",
    isFeatured: true,
    isActive: true,
  }
];
