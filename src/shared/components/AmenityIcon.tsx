"use client";

import React from "react";

interface AmenityIconProps {
  name: string;
  icon?: string;
  className?: string;
}

export default function AmenityIcon({ name, icon, className = "w-5 h-5 text-[#DDBD81]" }: AmenityIconProps) {
  // If a custom string emoji/text icon was passed in database that isn't a URL
  if (icon && !icon.startsWith("http") && !icon.startsWith("/")) {
    return <span className="text-base leading-none select-none">{icon}</span>;
  }

  const lower = (name || "").toLowerCase();

  // Swimming Pool
  if (lower.includes("pool") || lower.includes("swim")) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      </svg>
    );
  }

  // Gymnasium & Fitness
  if (lower.includes("gym") || lower.includes("fit") || lower.includes("workout")) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6.5 6.5 11 11" />
        <path d="m21 21-1-1" />
        <path d="m3 3 1 1" />
        <path d="m18 22 4-4" />
        <path d="m2 6 4-4" />
        <path d="m3 10 7-7" />
        <path d="m14 21 7-7" />
      </svg>
    );
  }

  // Park & Garden / Greenery
  if (lower.includes("park") || lower.includes("garden") || lower.includes("lawn") || lower.includes("tree")) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 10v12" />
        <path d="M12 2a7 7 0 0 0-7 7c0 2.2 1 4.2 2.6 5.5A7 7 0 0 0 12 20a7 7 0 0 0 4.4-5.5A7 7 0 0 0 19 9a7 7 0 0 0-7-7Z" />
      </svg>
    );
  }

  // Security / CCTV / Gated Community
  if (lower.includes("security") || lower.includes("cctv") || lower.includes("guard") || lower.includes("gated")) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }

  // Car Parking / Garage
  if (lower.includes("car") || lower.includes("park") || lower.includes("garage") || lower.includes("vehicle")) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
      </svg>
    );
  }

  // Clubhouse / Banquet / Lounge
  if (lower.includes("club") || lower.includes("hall") || lower.includes("banquet") || lower.includes("lounge")) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 22V10" />
        <path d="M18 22V10" />
        <path d="M2 6l10-4 10 4v2H2V6z" />
        <path d="M10 22V10" />
        <path d="M14 22V10" />
        <path d="M2 22h20" />
      </svg>
    );
  }

  // Sports & Games / Tennis / Courts
  if (lower.includes("court") || lower.includes("tennis") || lower.includes("badminton") || lower.includes("sport") || lower.includes("game")) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20" />
        <path d="M2 12h20" />
      </svg>
    );
  }

  // Power Backup / Electricity
  if (lower.includes("power") || lower.includes("generator") || lower.includes("backup") || lower.includes("electric")) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    );
  }

  // Water Supply / Borewell
  if (lower.includes("water") || lower.includes("tank") || lower.includes("borewell") || lower.includes("supply")) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    );
  }

  // Elevator / Lift
  if (lower.includes("lift") || lower.includes("elevator")) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="m9 10 3-3 3 3" />
        <path d="m9 14 3 3 3-3" />
      </svg>
    );
  }

  // Kids Play Area
  if (lower.includes("play") || lower.includes("kid") || lower.includes("child")) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" x2="9.01" y1="9" y2="9" strokeWidth="3" />
        <line x1="15" x2="15.01" y1="9" y2="9" strokeWidth="3" />
      </svg>
    );
  }

  // Spa / Wellness / Sauna
  if (lower.includes("spa") || lower.includes("sauna") || lower.includes("jacuzzi") || lower.includes("wellness")) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a5 5 0 0 0-5 5c0 3.5 5 9 5 9s5-5.5 5-9a5 5 0 0 0-5-5Z" />
        <path d="M12 16v6" />
        <path d="M8 22h8" />
      </svg>
    );
  }

  // High Speed Wi-Fi / Smart Home
  if (lower.includes("wifi") || lower.includes("internet") || lower.includes("smart")) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h.01" />
        <path d="M2 8.82a15 15 0 0 1 20 0" />
        <path d="M5 12.85a10 10 0 0 1 14 0" />
        <path d="M8.5 16.88a5 5 0 0 1 7 0" />
      </svg>
    );
  }

  // Fire Safety / Extinguisher
  if (lower.includes("fire") || lower.includes("safety")) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5Z" />
      </svg>
    );
  }

  // Yoga / Meditation
  if (lower.includes("yoga") || lower.includes("meditation")) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="3" />
        <path d="M12 8v8" />
        <path d="m8 12 4-2 4 2" />
        <path d="m6 20 6-4 6 4" />
      </svg>
    );
  }

  // Default Luxury Sparkles Icon
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
