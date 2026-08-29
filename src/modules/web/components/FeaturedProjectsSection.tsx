"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import SectionHeading from "@/shared/components/SectionHeading";
import { API_BASE_URL } from "@/shared/lib/api-config";
import AmenityIcon from "@/shared/components/AmenityIcon";
import DecorativeCircles from "./DecorativeCircles";

export interface Project {
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

export default function FeaturedProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE_URL}/projects`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch projects");
        return res.json();
      })
      .then((data) => {
        if (active) {
          // Filter active projects and limit to 3 latest ones
          const activeProjects = data.filter((p: Project) => p.isActive);
          setProjects(activeProjects.slice(0, 3));
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

  return (
    <section id="featured-projects" className="w-full bg-[#FBF8F2] py-10 md:py-14 relative overflow-hidden">
      <DecorativeCircles
        theme="light"
        circles={[
          { size: 480, right: "-120px", bottom: "-120px", opacity: 0.08, className: "lg:right-[-60px]" },
          { size: 380, right: "-60px", bottom: "-60px", opacity: 0.06, className: "lg:right-[0px]" }
        ]}
      />
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-4 border-b border-[#EADBB4]/60 pb-4">
          <SectionHeading
            badge="Selected Works"
            plainText="Featured"
            highlightText="Developments"
            className="!mb-0"
          />
          <Link href="/projects" className="text-xs sm:text-sm font-extrabold tracking-wider text-[#8C6D23] hover:text-[#D4AF37] transition-colors shrink-0 pb-1 flex items-center gap-1.5 min-h-[44px]">
            <span>View All Projects</span>
            <span>➔</span>
          </Link>
        </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
          <p className="text-xs text-text-gray-muted uppercase tracking-widest font-semibold">Fetching projects...</p>
        </div>
      )}

      {error && (
        <div className="max-w-md mx-auto p-6 rounded-2xl border border-red-500/20 bg-red-500/5 text-center space-y-4">
          <span className="text-3xl">⚠️</span>
          <h3 className="text-base font-bold text-slate-800">Unable to Load Portfolio</h3>
          <p className="text-xs text-text-gray-muted">{error}</p>
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="text-center py-20 bg-[#1A150C]/10 rounded-3xl border border-[#EADBB4] p-8 space-y-4 max-w-xl mx-auto backdrop-blur-sm">
          <div className="text-3xl text-[#D4AF37]">📂</div>
          <h3 className="text-lg font-bold text-slate-800">No Developments Found</h3>
          <p className="text-xs text-text-gray-muted">
            We currently don't have active listings. Check back later.
          </p>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 md:pb-0">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group overflow-hidden rounded-3xl border border-[#EADBB4] bg-white hover:border-[#D4AF37] transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#D4AF37]/15 block no-underline shrink-0 w-[290px] sm:w-[360px] md:w-auto md:shrink snap-start"
            >
              <div className="aspect-[16/9] w-full relative overflow-hidden bg-slate-900">
                {project.thumbnailImage ? (
                  <img
                    src={project.thumbnailImage}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-slate-900 to-[#1A150C] flex items-center justify-center">
                    <span className="text-[#D4AF37]/40 font-extrabold text-xl uppercase tracking-widest font-mono">
                      {project.projectType}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Status Badge */}
                <span className={`absolute top-4 left-4 text-[9px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full border backdrop-blur-md shadow-md ${project.projectStatus === "COMPLETED"
                    ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                    : project.projectStatus === "ONGOING"
                      ? "bg-amber-950/80 text-amber-300 border-amber-500/40"
                      : "bg-blue-950/80 text-blue-300 border-blue-500/40"
                  }`}>
                  {project.projectStatus}
                </span>
              </div>
              <div className="p-6 space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8C6D23] bg-[#F5EBE0] border border-[#EADBB4] px-2.5 py-0.5 rounded-full inline-block">
                  Featured Development
                </span>
                <h3 className="text-xl font-extrabold text-[#1A150C] group-hover:text-[#8C6D23] transition-colors line-clamp-1">
                  {project.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 font-normal leading-relaxed">
                  {project.shortDescription || project.description}
                </p>

                {/* Amenities Badges */}
                {project.amenities && project.amenities.length > 0 && (
                  <div className="pt-1 flex flex-wrap items-center gap-1.5">
                    {project.amenities.slice(0, 3).map((am) => (
                      <span
                        key={am.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF4E8] border border-[#EADBB4] text-[10px] font-bold text-[#8C6D23]"
                      >
                        <AmenityIcon name={am.name} icon={am.icon} className="w-3.5 h-3.5 text-[#8C6D23] shrink-0" />
                        <span className="truncate max-w-[80px]">
                          {am.name && (am.name.startsWith("http://") || am.name.startsWith("https://")) ? "Amenity" : am.name}
                        </span>
                      </span>
                    ))}
                    {project.amenities.length > 3 && (
                      <span className="text-[9px] font-extrabold text-[#8C6D23] font-mono px-1">
                        +{project.amenities.length - 3}
                      </span>
                    )}
                  </div>
                )}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Starting From
                    </span>
                    <span className="text-sm font-extrabold text-[#8C6D23]">
                      {formatPrice(project.startingPrice)}
                    </span>
                  </div>
                  <div className="text-right bg-[#FAF4E8] border border-[#EADBB4] px-3 py-1.5 rounded-xl transition-all">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                      Price Per Sqft
                    </span>
                    <span className="text-xs font-extrabold text-[#8C6D23]">
                      ₹{parseFloat(project.pricePerSqft).toLocaleString()}/sqft
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>
    </section>
  );
}
