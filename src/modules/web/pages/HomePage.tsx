"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Hero from "@/modules/web/components/Hero";
import CounterSection from "@/modules/web/components/CounterSection";
import PromiseSection from "@/modules/web/components/PromiseSection";
import LegacySection from "@/modules/web/components/LegacySection";
import SectionHeading from "@/shared/components/SectionHeading";
import FaqSection from "@/modules/web/components/FaqSection";
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

export default function HomePage() {
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
    <div className="flex flex-col gap-12 md:gap-16 pb-20">
      {/* Immersive Modular Hero Component */}
      <Hero />

      {/* Animated Counter Stats Section */}
      <CounterSection />

      {/* Stacked Promise Carousel Section */}
      <PromiseSection />

      {/* Featured Projects Summary */}
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
                className="group overflow-hidden rounded-2xl border border-white/5 bg-[#050c38]/20 hover:border-gold-solid/30 transition-all shadow-xl block no-underline"
              >
                <div className="aspect-[4/3] w-full relative overflow-hidden bg-[#020520]">
                  {project.thumbnailImage ? (
                    <img
                      src={project.thumbnailImage}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-[#020520] to-[#050c38] flex items-center justify-center">
                      <span className="text-gold-solid/20 font-extrabold text-xl uppercase tracking-widest font-mono">
                        {project.projectType}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[#020520]/25 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
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
                    {project.projectType} Development • {project.location}, {project.city}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-white font-sans group-hover:text-gold-solid transition-colors">
                    {project.name}
                  </h3>
                  <p className="mt-2 text-sm text-[#8E90A2] line-clamp-2 font-light leading-relaxed">
                    {project.shortDescription || project.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-text-gray-muted uppercase tracking-wider block">
                        Starting From
                      </span>
                      <span className="text-sm font-extrabold text-gold-solid">
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
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Immersive Gallery Section */}
      <section className="w-full bg-[#0d153b]/10 py-16 md:py-24 border-y border-white/5">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <SectionHeading 
            badge="Visual Experience" 
            plainText="Gallery &" 
            highlightText="Lifestyle" 
            align="center"
            className="max-w-2xl"
          />
          <p className="mt-[-2rem] text-sm text-[#8E90A2] text-center max-w-2xl mx-auto mb-16">
            A glance into the state-of-the-art architectures, wellness setups, and elite clubhouses designed for modern comfort.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Gallery Item 1 */}
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border-muted">
              <img
                src="/images/clubhouse.png"
                alt="Elite Clubhouse"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-primary via-dark-primary/20 to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#DDBD81]">Amenity</span>
                <h4 className="text-lg font-bold text-white mt-1">Elite Clubhouse</h4>
              </div>
            </div>

            {/* Gallery Item 2 */}
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border-muted lg:translate-y-4">
              <img
                src="/images/wellness.png"
                alt="Wellness Center"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-primary via-dark-primary/20 to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#DDBD81]">Health</span>
                <h4 className="text-lg font-bold text-white mt-1">Wellness Center</h4>
              </div>
            </div>

            {/* Gallery Item 3 */}
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border-muted">
              <img
                src="/images/spiritual_club.png"
                alt="Spiritual Lounge"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-primary via-dark-primary/20 to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#DDBD81]">Recreation</span>
                <h4 className="text-lg font-bold text-white mt-1">Spiritual Lounge</h4>
              </div>
            </div>

            {/* Gallery Item 4 */}
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border-muted lg:translate-y-4">
              <img
                src="/images/amenity_saryu.png"
                alt="Sarayu Deck"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-primary via-dark-primary/20 to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#DDBD81]">Nature</span>
                <h4 className="text-lg font-bold text-white mt-1">Sarayu Deck</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy Section */}
      <LegacySection />

      {/* Frequently Asked Questions */}
      <FaqSection />
    </div>
  );
}
