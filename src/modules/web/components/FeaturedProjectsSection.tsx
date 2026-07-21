"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import SectionHeading from "@/shared/components/SectionHeading";
import { API_BASE_URL } from "@/shared/lib/api-config";
import AmenityIcon from "@/shared/components/AmenityIcon";

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
    <section className="mx-auto w-full max-w-7xl px-6 md:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <SectionHeading 
          badge="Selected Works" 
          plainText="Featured" 
          highlightText="Developments" 
          className="!mb-0" 
        />
        <Link href="/projects" className="mt-4 md:mt-0 text-sm font-semibold tracking-wider text-gold-solid hover:text-gold-hover transition-colors">
          View All Projects →
        </Link>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-2 border-gold-solid/20 border-t-gold-solid rounded-full animate-spin" />
          <p className="text-xs text-text-gray-muted uppercase tracking-widest font-semibold">Fetching projects...</p>
        </div>
      )}

      {error && (
        <div className="max-w-md mx-auto p-6 rounded-2xl border border-red-500/20 bg-red-500/5 text-center space-y-4">
          <span className="text-3xl">⚠️</span>
          <h3 className="text-base font-bold text-white">Unable to Load Portfolio</h3>
          <p className="text-xs text-text-gray-muted">{error}</p>
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="text-center py-20 bg-[#050c38]/20 rounded-3xl border border-white/5 p-8 space-y-4 max-w-xl mx-auto backdrop-blur-sm">
          <div className="text-3xl text-gold-solid/50">📂</div>
          <h3 className="text-lg font-bold text-white">No Developments Found</h3>
          <p className="text-xs text-text-gray-muted">
            We currently don't have active listings. Check back later.
          </p>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
             <Link 
              key={project.id} 
              href={`/projects/${project.slug}`} 
              className="group overflow-hidden rounded-2xl border border-white/5 bg-[#050c38]/20 hover:border-gold-solid/45 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6),_0_0_25px_rgba(221,189,129,0.08)] block no-underline"
            >
              <div className="aspect-[4/3] w-full relative overflow-hidden bg-background">
                {project.thumbnailImage ? (
                  <img
                    src={project.thumbnailImage}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-background to-dark-secondary/50 flex items-center justify-center">
                    <span className="text-gold-solid/20 font-extrabold text-xl uppercase tracking-widest font-mono">
                      {project.projectType}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-background/25 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Status Badge */}
                <span className={`absolute top-4 left-4 text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border backdrop-blur-md ${
                  project.projectStatus === "COMPLETED"
                    ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/25"
                    : project.projectStatus === "ONGOING"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/25"
                    : "bg-blue-500/10 text-blue-400 border-blue-500/25"
                }`}>
                  {project.projectStatus}
                </span>
              </div>
              <div className="p-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-solid">
                  Featured Development
                </span>
                <h3 className="mt-2 text-xl font-bold text-white font-sans group-hover:text-gold-solid transition-colors">
                  {project.name}
                </h3>
                <p className="mt-2 text-sm text-[#8E90A2] line-clamp-2 font-light leading-relaxed">
                  {project.shortDescription || project.description}
                </p>

                {/* Amenities Badges */}
                {project.amenities && project.amenities.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {project.amenities.slice(0, 3).map((am) => (
                      <span
                        key={am.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-[10px] font-medium text-slate-200"
                      >
                        <AmenityIcon name={am.name} icon={am.icon} className="w-3.5 h-3.5 text-[#DDBD81] shrink-0" />
                        <span className="truncate max-w-[80px]">
                          {am.name && (am.name.startsWith("http://") || am.name.startsWith("https://")) ? "Amenity" : am.name}
                        </span>
                      </span>
                    ))}
                    {project.amenities.length > 3 && (
                      <span className="text-[9px] font-bold text-[#DDBD81] font-mono px-1">
                        +{project.amenities.length - 3}
                      </span>
                    )}
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-text-gray-muted uppercase tracking-wider block">
                      Starting From
                    </span>
                    <span className="text-sm font-extrabold text-gold-solid">
                      {formatPrice(project.startingPrice)}
                    </span>
                  </div>
                  <div className="text-right bg-white/[0.03] border border-white/5 hover:border-gold-solid/20 px-3 py-1.5 rounded-xl transition-all">
                    <span className="text-[9px] font-bold text-text-gray-muted uppercase tracking-wider block">
                      Price Per Sqft
                    </span>
                    <span className="text-xs font-bold text-gold-solid">
                      ₹{parseFloat(project.pricePerSqft).toLocaleString()}/sqft
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
