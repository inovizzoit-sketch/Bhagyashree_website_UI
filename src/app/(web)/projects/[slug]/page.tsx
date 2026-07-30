"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/shared/lib/api-config";
import { useEnquiry } from "@/shared/context/EnquiryContext";
import SectionHeading from "@/shared/components/SectionHeading";
import AmenityIcon from "@/shared/components/AmenityIcon";

interface Property {
  id: string;
  title: string;
  propertyType: string;
  unitNumber?: string;
  propertyImage?: string;
  areaSqft?: string;
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  price?: string;
  facing?: string;
  floorNumber?: number;
  status: string;
  isActive: boolean;
}

interface Amenity {
  id: string;
  categoryId?: string;
  name: string;
  icon?: string;
  category?: {
    id: string;
    name: string;
  };
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

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
  properties?: Property[];
  amenities?: Amenity[];
  isFeatured?: boolean;
}

function getAmenityIcon(name: string, icon?: string): string {
  if (icon && !icon.startsWith("http") && !icon.startsWith("/")) {
    return icon;
  }
  const lower = (name || "").toLowerCase();
  if (lower.includes("pool") || lower.includes("swim")) return "🏊‍♂️";
  if (lower.includes("gym") || lower.includes("fit") || lower.includes("workout")) return "🏋️‍♂️";
  if (lower.includes("park") || lower.includes("garden") || lower.includes("lawn")) return "🌳";
  if (lower.includes("play") || lower.includes("kid") || lower.includes("child")) return "🛝";
  if (lower.includes("security") || lower.includes("cctv") || lower.includes("guard")) return "🛡️";
  if (lower.includes("park") || lower.includes("car") || lower.includes("garage")) return "🚗";
  if (lower.includes("club") || lower.includes("hall") || lower.includes("lounge")) return "🏛️";
  if (lower.includes("court") || lower.includes("tennis") || lower.includes("badminton") || lower.includes("sport")) return "🎾";
  if (lower.includes("power") || lower.includes("generator") || lower.includes("backup")) return "⚡";
  if (lower.includes("water") || lower.includes("tank") || lower.includes("borewell")) return "💧";
  if (lower.includes("lift") || lower.includes("elevator")) return "🛗";
  if (lower.includes("spa") || lower.includes("sauna") || lower.includes("jacuzzi")) return "🧖‍♀️";
  if (lower.includes("wifi") || lower.includes("internet")) return "📶";
  if (lower.includes("fire") || lower.includes("safety")) return "🧯";
  if (lower.includes("store") || lower.includes("shop") || lower.includes("mart")) return "🛒";
  if (lower.includes("yoga") || lower.includes("meditation")) return "🧘‍♀️";
  if (lower.includes("run") || lower.includes("jog") || lower.includes("track")) return "🏃‍♂️";
  if (lower.includes("game") || lower.includes("billiard") || lower.includes("table")) return "🎮";
  if (lower.includes("theatre") || lower.includes("cinema") || lower.includes("movie")) return "🎬";
  return "✨";
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { openEnquiry } = useEnquiry();
  const slug = params?.slug as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);
  const descContainerRef = useRef<HTMLDivElement>(null);
  const [showToggle, setShowToggle] = useState(false);

  const handleToggleDescription = () => {
    if (isDescExpanded && descContainerRef.current) {
      const rect = descContainerRef.current.getBoundingClientRect();
      const navbarHeight = 80;
      if (rect.top < navbarHeight) {
        window.scrollTo({
          top: window.scrollY + rect.top - navbarHeight - 16,
          behavior: "smooth"
        });
      }
    }
    setIsDescExpanded((prev) => !prev);
  };

  function getProfessionalDetailsText() {
    if (!project) return "";
    const priceVal = parseFloat(project.startingPrice);
    const priceFormatted = !isNaN(priceVal)
      ? priceVal >= 10000000
        ? `₹${(priceVal / 10000000).toFixed(2)} Cr`
        : `₹${(priceVal / 100000).toFixed(1)} Lakh`
      : "N/A";
    const pricePerSqftFormatted = parseFloat(project.pricePerSqft).toLocaleString();
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    return `*PROPERTY SPECIFICATIONS: ${project.name.toUpperCase()}*

• Location: ${project.address ? project.address.trim() + ", " : ""}${project.location}, ${project.city}
• Starting Price: ${priceFormatted}+
• Rate: ₹${pricePerSqftFormatted}/sqft
• Status: ${project.projectStatus} (${project.projectType})

Overview:
${project.shortDescription}

Explore Details & Inventory:
${shareUrl}

-- NANDEEKA ENTERPRISES --`;
  }

  function handleCopyDetails() {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(getProfessionalDetailsText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  useEffect(() => {
    if (!slug) return;
    let active = true;

    fetch(`${API_BASE_URL}/projects/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load project details");
        return res.json();
      })
      .then((data) => {
        if (active) {
          setProject(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Failed to load project details");
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (project?.description) {
      const textOnly = project.description.replace(/<[^>]*>/g, "");
      setShowToggle(textOnly.length > 300);
    }
  }, [project?.description]);

  function formatPrice(priceStr?: string) {
    if (!priceStr) return "N/A";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020520] flex flex-col items-center justify-center space-y-4 py-32 text-slate-300">
        <div className="w-10 h-10 border-2 border-gold-solid/20 border-t-gold-solid rounded-full animate-spin" />
        <p className="text-xs text-text-gray-muted uppercase tracking-widest font-semibold">Loading details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#020520] py-32 text-center px-6">
        <div className="max-w-md mx-auto p-8 rounded-2xl border border-red-500/20 bg-red-500/5 space-y-4">
          <span className="text-3xl">⚠️</span>
          <h3 className="text-base font-bold text-white">Project Not Found</h3>
          <p className="text-xs text-text-gray-muted">{error || "The development details could not be found."}</p>
          <button
            onClick={() => router.push("/projects")}
            className="px-5 py-2.5 bg-gold-solid hover:bg-gold-hover text-[#020520] font-bold text-xs rounded-xl cursor-pointer"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const activeProperties = project.properties?.filter((p) => p.isActive) || [];

  return (
    <div className="min-h-screen pb-32 relative overflow-x-clip text-slate-350">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-solid/2 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[80vh] left-0 w-[500px] h-[500px] bg-gold-solid/2 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation breadcrumbs */}
      {/* <div className="mx-auto max-w-7xl px-6 md:px-8 pt-10 relative z-10">
        <button
          onClick={() => router.push("/projects")}
          className="text-xs font-bold text-gold-solid hover:text-gold-hover flex items-center gap-1.5 transition-colors cursor-pointer bg-transparent border-0 outline-none"
        >
          ← Back to Portfolio
        </button>
      </div> */}

      {/* Hero Split Layout */}
      <div className="mx-auto max-w-7xl px-6 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start relative z-10">
        {/* Left Column: Visual Media & Specs */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
          <div className="rounded-2xl overflow-hidden border border-white/5 bg-[#050c38]/20 aspect-[16/10] relative shadow-2xl">
            {project.thumbnailImage ? (
              <img
                src={project.thumbnailImage}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[#020520] to-[#050c38] flex items-center justify-center">
                <span className="text-gold-solid/20 font-extrabold text-2xl uppercase tracking-widest font-mono">
                  {project.projectType}
                </span>
              </div>
            )}
            <span className={`absolute top-4 left-4 text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border backdrop-blur-md ${project.projectStatus === "COMPLETED"
              ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/20"
              : project.projectStatus === "ONGOING"
                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                : "bg-blue-500/10 text-blue-400 border-blue-500/20"
              }`}>
              {project.projectStatus}
            </span>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#050c38]/25 border border-white/5 rounded-xl p-4 backdrop-blur-sm shadow-xl">
              <span className="text-[10px] text-text-gray-muted block uppercase tracking-wider mb-1">Starting Price</span>
              <span className="text-gold-solid font-extrabold text-xl">
                {formatPrice(project.startingPrice)}
              </span>
            </div>
            <div className="bg-gold-solid/5 border border-gold-solid/30 rounded-xl p-4 backdrop-blur-sm shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gold-solid/10 rounded-full blur-md pointer-events-none" />
              <span className="text-[10px] text-gold-solid block uppercase tracking-wider mb-1 font-bold">Price Per Sqft</span>
              <span className="text-white font-extrabold text-xl tracking-tight">
                ₹{parseFloat(project.pricePerSqft).toLocaleString()}/sqft
              </span>
            </div>
          </div>

          {/* Actions Block */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row gap-4">
              {project.brochureFile && (
                <a
                  href={project.brochureFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-between px-5 py-4 bg-gold-solid/5 hover:bg-gold-solid/10 border border-gold-solid/35 hover:border-gold-solid text-gold-solid rounded-xl text-xs font-bold tracking-wide transition-all duration-300 no-underline cursor-pointer active:scale-[0.98] shadow-lg shadow-gold-solid/2"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-gold-solid" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download Brochure</span>
                  </div>
                  <span className="text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                </a>
              )}

              {/* Copy Details Share Action */}
              <button
                onClick={handleCopyDetails}
                className={`flex-1 flex items-center justify-between px-5 py-4 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer active:scale-[0.98] shadow-lg outline-none border ${copied
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-[#050c38]/20 hover:bg-[#050c38]/35 border-white/5 hover:border-gold-solid/35 text-text-gray-light hover:text-gold-solid"
                  }`}
              >
                <div className="flex items-center gap-3">
                  {copied ? (
                    <svg className="w-4 h-4 text-emerald-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-text-gray-muted group-hover:text-gold-solid transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  )}
                  <span>{copied ? "Details Copied!" : "Copy Specs"}</span>
                </div>
                <span className="text-xs">➔</span>
              </button>

              {/* WhatsApp Direct Share Action */}
              <button
                onClick={() => {
                  window.open(`https://wa.me/?text=${encodeURIComponent(getProfessionalDetailsText())}`, "_blank");
                }}
                className="flex-1 md:hidden flex items-center justify-between px-5 py-4 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer active:scale-[0.98] shadow-lg outline-none border bg-emerald-600/15 hover:bg-emerald-600/25 border-emerald-500/30 text-emerald-400 hover:text-emerald-300"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm">💬</span>
                  <span>Share on WhatsApp</span>
                </div>
                <span className="text-xs">↗</span>
              </button>
            </div>

            {/* Enquire Now Call to Action Button */}
            <button
              onClick={() => openEnquiry(project.name)}
              className="w-full flex items-center justify-center gap-2.5 px-5 py-4 bg-gold-solid hover:bg-gold-hover text-[#020520] rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer active:scale-[0.98] shadow-lg shadow-gold-solid/10"
            >
              <span>Enquire about this Project</span>
            </button>
          </div>
        </div>

        {/* Right Column: Title, Address & Narrative */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3.5">
            <SectionHeading
              badge={`${project.projectType} Development`}
              plainText={project.name.split(" ").slice(0, -1).join(" ")}
              highlightText={project.name.split(" ").slice(-1)[0]}
              className="!mb-4"
            />
            <p className="text-xs md:text-sm font-medium text-gold-solid flex items-start gap-1.5">
              <span className="text-base mt-0.5">📍</span>
              <span className="leading-relaxed font-light text-slate-200">
                {project.address}, {project.location}, {project.city}, {project.state} - {project.pincode}
              </span>
            </p>
          </div>

          <div className="bg-[#050c38]/20 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 backdrop-blur-sm shadow-2xl">
            <div>
              <span className="text-[10px] text-gold-solid font-bold uppercase tracking-widest block mb-2 font-mono">Overview</span>
              <p className="text-sm text-text-gray-light leading-relaxed font-light">
                {project.shortDescription}
              </p>
            </div>
            <div ref={descContainerRef} className="border-t border-white/5 pt-6">
              <span className="text-[10px] text-text-gray-muted font-bold uppercase tracking-widest block mb-2 font-mono">Detailed Description</span>
              <div className="relative">
                <div 
                  ref={descRef}
                  className={`text-sm text-[#8E90A2] leading-relaxed overflow-hidden rich-text-renderer ${
                    showToggle && !isDescExpanded ? "max-h-36" : "max-h-none"
                  }`}
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
                {showToggle && !isDescExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#030623] to-transparent pointer-events-none" />
                )}
              </div>
              
              {showToggle && (
                <button
                  type="button"
                  onClick={handleToggleDescription}
                  className="mt-3 text-xs font-bold text-gold-solid hover:text-gold-hover transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-0 outline-none p-0"
                >
                  {isDescExpanded ? "Read Less ▲" : "Read More ▼"}
                </button>
              )}
            </div>

            {/* Key Amenities & Facilities Section */}
            {project.amenities && project.amenities.length > 0 && (
              <div className="border-t border-white/10 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#DDBD81]">★</span>
                    <span className="text-[11px] text-[#DDBD81] font-bold uppercase tracking-widest font-mono">
                      Key Amenities & Facilities
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-[#DDBD81] bg-[#DDBD81]/10 border border-[#DDBD81]/25 px-2.5 py-0.5 rounded-full">
                    {project.amenities.length} Offerings
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {project.amenities.map((am) => {
                    const cleanName = am.name && (am.name.startsWith("http://") || am.name.startsWith("https://"))
                      ? "Amenity Offering"
                      : am.name;
                    const displayIcon = getAmenityIcon(cleanName, am.icon);

                    return (
                      <div
                        key={am.id}
                        className="group flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-[#DDBD81]/50 hover:bg-gradient-to-r hover:from-[#DDBD81]/10 hover:to-white/[0.04] transition-all duration-300 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_25px_rgba(221,189,129,0.12)] hover:-translate-y-0.5"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DDBD81]/20 to-[#DDBD81]/5 border border-[#DDBD81]/30 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 group-hover:border-[#DDBD81]/60 transition-all duration-300">
                          <AmenityIcon name={cleanName} icon={am.icon} className="w-5 h-5 text-[#DDBD81]" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold text-slate-100 group-hover:text-[#DDBD81] transition-colors truncate">
                            {cleanName}
                          </span>
                          {am.category?.name && (
                            <span className="text-[9px] text-slate-400 font-mono tracking-wider truncate">
                              {am.category.name}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Amenities & Facilities Section */}
      {/* {project.amenities && project.amenities.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 md:px-8 mt-16 space-y-8 relative z-10">
          <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white font-sans">
                Project Amenities & Facilities
              </h2>
              <p className="text-xs text-text-gray-muted mt-1 leading-relaxed">
                World-class features and lifestyle offerings integrated within {project.name}.
              </p>
            </div>
            <span className="text-[10px] bg-gold-solid/5 border border-gold-solid/20 text-gold-solid font-bold uppercase px-3 py-1 rounded-full">
              {project.amenities.length} Offerings Available
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {project.amenities.map((am) => (
              <div
                key={am.id}
                className="bg-[#050c38]/20 border border-white/5 hover:border-gold-solid/30 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2 backdrop-blur-sm transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-solid/10 border border-gold-solid/20 flex items-center justify-center text-xl text-gold-solid group-hover:bg-gold-solid group-hover:text-background transition-colors duration-300 overflow-hidden">
                  {am.icon && (am.icon.startsWith("http") || am.icon.startsWith("/")) ? (
                    <img src={am.icon} alt={am.name} className="w-7 h-7 object-contain" />
                  ) : (
                    am.icon || "✨"
                  )}
                </div>
                <h4 className="font-bold text-white text-xs truncate max-w-full">
                  {am.name && (am.name.startsWith("http://") || am.name.startsWith("https://"))
                    ? "Amenity Offering"
                    : am.name}
                </h4>
                {am.category?.name && (
                  <span className="text-[9px] text-text-gray-muted font-mono uppercase tracking-wider block">
                    {am.category.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Properties Inventory Section */}
      {activeProperties.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 md:px-8 mt-20 space-y-8 relative z-10">
          <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white font-sans">
                Inventory & Available Units
              </h2>
              <p className="text-xs text-text-gray-muted mt-1 leading-relaxed">
                Browse unit layouts, sizes, and pricing configurations available within {project.name}.
              </p>
            </div>
            <span className="text-[10px] bg-gold-solid/5 border border-gold-solid/20 text-gold-solid font-bold uppercase px-3 py-1 rounded-full">
              {activeProperties.length} Units Available
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-[#050c38]/20 border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between hover:border-gold-solid/30 transition-all duration-300 group backdrop-blur-sm"
              >
                {/* Image Layout Preview */}
                <div className="aspect-[16/10] bg-[#020520] relative overflow-hidden">
                  {prop.propertyImage ? (
                    <img
                      src={prop.propertyImage}
                      alt={prop.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-[#020520] to-[#050c38] flex flex-col items-center justify-center p-4 text-center">
                      <span className="text-3xl mb-1 opacity-20">🏘️</span>
                      <span className="text-[9px] uppercase font-bold tracking-widest text-gold-solid/40">
                        {prop.propertyType}
                      </span>
                    </div>
                  )}

                  {/* Status Badge */}
                  <span className={`absolute top-4 left-4 text-[8px] font-bold tracking-wider uppercase px-2.5 py-1 rounded border backdrop-blur-md ${prop.status === "AVAILABLE" || prop.status === "Available"
                    ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/20 shadow-sm"
                    : prop.status === "SOLD" || prop.status === "Sold"
                      ? "bg-red-500/10 text-red-400 border-red-500/20 shadow-sm"
                      : "bg-amber-500/10 text-amber-400 border-emerald-500/20 shadow-sm"
                    }`}>
                    {prop.status}
                  </span>
                </div>

                {/* Details Wrapper */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-gold-solid uppercase tracking-wider bg-gold-solid/5 border border-gold-solid/10 px-2 py-0.5 rounded">
                        {prop.propertyType}
                      </span>
                      {prop.unitNumber && (
                        <span className="text-[10px] text-text-gray-muted font-bold font-mono">
                          Unit: {prop.unitNumber}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-white text-base truncate group-hover:text-gold-solid transition-colors duration-250">
                      {prop.title}
                    </h4>

                    {/* Specs Details Grid */}
                    <div className="grid grid-cols-2 gap-y-2 gap-x-3 pt-3 text-[11px] text-text-gray-muted border-t border-white/5 font-light">
                      <div className="flex items-center gap-1.5">
                        <span>📐</span> Size: <span className="text-white font-medium">{prop.areaSqft || "N/A"} sqft</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span>🧭</span> Facing: <span className="text-white font-medium">{prop.facing || "N/A"}</span>
                      </div>
                      {prop.bedrooms && (
                        <div className="flex items-center gap-1.5">
                          <span>🛌</span> Beds: <span className="text-white font-medium">{prop.bedrooms} BHK</span>
                        </div>
                      )}
                      {prop.floorNumber !== null && prop.floorNumber !== undefined && (
                        <div className="flex items-center gap-1.5">
                          <span>🏢</span> Floor: <span className="text-white font-medium">{prop.floorNumber}</span>
                        </div>
                      )}
                      {prop.price && prop.areaSqft && !isNaN(parseFloat(prop.price)) && !isNaN(parseFloat(prop.areaSqft)) && parseFloat(prop.areaSqft) > 0 ? (
                        <div className="flex items-center gap-1.5 col-span-2 text-gold-solid font-bold mt-1">
                          <span>🏷️</span> Price Rate: <span className="text-white font-extrabold bg-gold-solid/10 border border-gold-solid/25 px-2 py-0.5 rounded">₹{Math.round(parseFloat(prop.price) / parseFloat(prop.areaSqft)).toLocaleString()}/sqft</span>
                        </div>
                      ) : project.pricePerSqft ? (
                        <div className="flex items-center gap-1.5 col-span-2 text-gold-solid font-bold mt-1">
                          <span>🏷️</span> Est. Rate: <span className="text-white font-extrabold bg-gold-solid/10 border border-gold-solid/25 px-2 py-0.5 rounded">₹{parseFloat(project.pricePerSqft).toLocaleString()}/sqft</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Price Row */}
                  <div className="border-t border-white/5 pt-4 flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-text-gray-muted uppercase tracking-wider font-semibold">Pricing</span>
                      <span className="font-extrabold text-white text-base">
                        {formatPrice(prop.price)}
                      </span>
                    </div>

                    <button
                      onClick={() => openEnquiry(`Booking Enquiry for ${project.name}: ${prop.title} (Unit ${prop.unitNumber || "N/A"})`)}
                      className="px-4 py-2 bg-gold-solid hover:bg-gold-hover text-[#020520] font-bold text-xs rounded-xl uppercase tracking-wider transition-all duration-300 cursor-pointer active:scale-[0.97] hover:shadow-lg hover:shadow-gold-solid/20"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
