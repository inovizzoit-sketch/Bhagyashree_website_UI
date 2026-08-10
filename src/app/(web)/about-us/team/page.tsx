"use client";

import React, { useState, useEffect } from "react";
import SectionHeading from "@/shared/components/SectionHeading";
import { useEnquiry } from "@/shared/context/EnquiryContext";
import { API_BASE_URL } from "@/shared/lib/api-config";

interface TeamMember {
  id: string;
  name: string;
  designation: string;
  department?: string;
  image?: string;
  bio?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  isFeatured: boolean;
}

const fallbackTeam: TeamMember[] = [
  {
    id: "1",
    name: "Dr. Sandeep Kumar",
    designation: "Managing Director",
    department: "Executive",
    image: "/images/team1.jpg",
    bio: "Visionary leader with 15+ years in real estate development and land acquisition strategy.",
    linkedin: "#",
    email: "sandeep@bhagyashree.com",
    isFeatured: true
  },
  {
    id: "2",
    name: "Aman Malhotra",
    designation: "Chief Planning Officer",
    department: "Planning",
    image: "/images/team2.jpg",
    bio: "Ex-town planner specializing in gated community architectures and smart layouts.",
    linkedin: "#",
    email: "aman@bhagyashree.com",
    isFeatured: true
  },
  {
    id: "3",
    name: "John Doe",
    designation: "Project Manager",
    department: "Operations",
    image: "/images/team3.jpg",
    bio: "Spearheading execution, quality control, and on-time delivery of gated communities.",
    linkedin: "#",
    email: "john@bhagyashree.com",
    isFeatured: false
  }
];

export default function TeamPage() {
  const { openEnquiry } = useEnquiry();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");

  useEffect(() => {
    fetch(`${API_BASE_URL}/team-members?isActive=true&limit=100`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.items) {
          setTeamMembers(data.items);
        }
      })
      .catch((err) => console.error("Error loading team members", err));
  }, []);

  const displayTeam = teamMembers.length > 0 ? teamMembers : fallbackTeam;

  // Dynamically extract unique departments (strictly typed)
  const departments: string[] = [
    "All",
    ...Array.from(new Set(displayTeam.map((m) => m.department).filter((d): d is string => !!d)))
  ];

  // Filter team based on selected tab
  const filteredTeam = selectedDepartment === "All"
    ? displayTeam
    : displayTeam.filter((m) => m.department === selectedDepartment);

  // Group into Featured Leaders and Regular Experts
  const featuredMembers = filteredTeam.filter((m) => m.isFeatured);
  const regularMembers = filteredTeam.filter((m) => !m.isFeatured);

  return (
    <div className="min-h-screen pb-32 overflow-hidden relative text-slate-300 font-sans">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-gold-solid/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20vh] -right-[200px] w-[600px] h-[600px] bg-gold-solid/3 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Intro Header Section */}
      <div className="relative pt-28 pb-6 md:pt-36 md:pb-8 z-10">
        <div className="mx-auto max-w-5xl px-6 md:px-8 text-center">
          <SectionHeading
            badge="Leadership & Experts"
            plainText="Meet Our"
            highlightText="Team"
            align="center"
            className="!mb-4"
          />
          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-text-gray-muted leading-relaxed font-light">
            The driving force behind Bhagyashree's commitment to quality, transparency, and innovation in plotted developments.
          </p>
        </div>
      </div>

      {/* Interactive Filter Pills */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-8 mb-16 flex flex-wrap justify-center gap-2.5">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDepartment(dept)}
            className={`rounded-full px-5 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-300 border outline-none cursor-pointer ${selectedDepartment === dept
              ? "bg-gold-solid text-white border-gold-solid shadow-[0_4px_15px_rgba(37,99,235,0.3)] scale-105"
              : "bg-card-bg text-text-gray-muted border-card-border hover:border-gold-solid hover:text-foreground"
              }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* ── Section 1: Executive Leadership ── */}
      {featuredMembers.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10 mb-20">
          <div className="mb-8">
            <h3 className="text-xl font-serif text-foreground font-light tracking-wide uppercase">
              Executive <span className="font-semibold italic text-gold-solid">Leadership</span>
            </h3>
            <p className="text-xs text-text-gray-muted mt-0.5">Visionaries driving the advisory board and organizational strategy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredMembers.map((member, idx) => (
              <div
                key={member.id || idx}
                className="bg-gradient-to-b from-gold-solid/5 to-transparent border border-gold-solid/20 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between backdrop-blur-sm group relative opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${idx * 80}ms`, animationFillMode: "forwards" }}
              >
                {/* Accent halo glow behind featured profiles */}
                <div className="absolute inset-0 bg-gradient-to-r from-gold-solid/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

                <div>
                  {/* Profile Image Wrapper */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-5 border border-gold-solid/15 bg-slate-200/40 shadow-inner">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const fallbackDiv = parent.querySelector('.fallback-avatar');
                            if (fallbackDiv) fallbackDiv.classList.remove('hidden');
                          }
                        }}
                      />
                    ) : null}
                    {/* Premium Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />
                    
                    <div className={`fallback-avatar w-full h-full bg-slate-200/40 flex items-center justify-center text-4xl text-gold-solid ${member.image ? 'hidden' : ''}`}>
                      👤
                    </div>
                    {member.department && (
                      <span className="absolute top-3 right-3 text-[8px] font-bold tracking-widest uppercase bg-gold-solid text-white px-2.5 py-1 rounded shadow-lg font-sans backdrop-blur-sm">
                        {member.department}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 relative z-10 text-center flex flex-col items-center">
                    <h4 className="text-lg font-bold text-foreground group-hover:text-gold-solid transition-colors duration-300">
                      {member.name}
                    </h4>
                    <p className="text-xs text-gold-solid font-semibold tracking-wider uppercase">
                      {member.designation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Section 2: Management & Experts ── */}
      {regularMembers.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10 mb-28">
          <div className="mb-8">
            <h3 className="text-xl font-serif text-foreground font-light tracking-wide uppercase">
              Management & <span className="font-semibold italic text-gold-solid">Experts</span>
            </h3>
            <p className="text-xs text-text-gray-muted mt-0.5">The dedicated managers and engineers ensuring flawless execution.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularMembers.map((member, idx) => (
              <div
                key={member.id || idx}
                className="bg-card-bg border border-card-border p-5 rounded-2xl transition-all duration-300 hover:border-gold-solid/30 hover:-translate-y-1 shadow-md hover:shadow-lg flex flex-col justify-between backdrop-blur-sm group opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${idx * 80}ms`, animationFillMode: "forwards" }}
              >
                <div>
                  {/* Profile Image Wrapper */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-5 border border-card-border bg-slate-200/40 shadow-inner">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const fallbackDiv = parent.querySelector('.fallback-avatar');
                            if (fallbackDiv) fallbackDiv.classList.remove('hidden');
                          }
                        }}
                      />
                    ) : null}
                    {/* Premium Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-50 pointer-events-none" />
                    
                    <div className={`fallback-avatar w-full h-full bg-slate-200/40 flex items-center justify-center text-4xl text-gold-solid ${member.image ? 'hidden' : ''}`}>
                      👤
                    </div>
                    {member.department && (
                      <span className="absolute top-3 right-3 text-[8px] font-bold tracking-widest uppercase bg-card-bg text-foreground border border-card-border px-2.5 py-1 rounded shadow-md">
                        {member.department}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-center flex flex-col items-center">
                    <h4 className="text-lg font-bold text-foreground group-hover:text-gold-solid transition-colors duration-300">
                      {member.name}
                    </h4>
                    <p className="text-xs text-gold-solid font-medium tracking-wide uppercase">
                      {member.designation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action Box */}
      <div className="mx-auto max-w-5xl px-6 md:px-8 relative z-10">
        <div className="bg-gradient-to-r from-dark-primary via-dark-secondary to-dark-secondary border border-card-border/10 p-8 md:p-14 rounded-3xl text-center space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gold-solid/5 rounded-full blur-[80px] pointer-events-none" />

          {/* Decorative Compass on Left */}
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-64 h-64 opacity-25 pointer-events-none hidden lg:block select-none">
            <svg viewBox="0 0 100 100" className="w-full h-full text-gold-solid">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="50" cy="50" r="41" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1.5" />
              {[...Array(24)].map((_, i) => {
                const angle = (i * 360) / 24;
                const length = i % 6 === 0 ? 5 : 3;
                return (
                  <line
                    key={i}
                    x1="50"
                    y1={5}
                    x2="50"
                    y2={5 + length}
                    stroke="currentColor"
                    strokeWidth={i % 6 === 0 ? 0.8 : 0.4}
                    transform={`rotate(${angle} 50 50)`}
                  />
                );
              })}
              <text x="50" y="59" textAnchor="middle" fill="currentColor" className="font-serif text-3xl font-light tracking-wide">N</text>
            </svg>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold-solid">Ready to Invest?</span>
            <h3 className="text-2xl md:text-4xl font-serif text-white font-light leading-tight">
              Begin your secure land legacy <span className="font-medium italic text-gold-solid">today</span>
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light">
              Connect with our land investment consultants to schedule a guided site tour of our premium layouts in Varanasi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
            <button
              onClick={() => openEnquiry()}
              className="w-full sm:w-auto rounded-full bg-gold-solid px-8 py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-gold-hover hover:scale-105 active:scale-95 transition-all shadow-[0_4px_25px_rgba(37,99,235,0.3)]"
            >
              ENQUIRE NOW
            </button>
            <a
              href="tel:+919519662111"
              className="w-full sm:w-auto text-center rounded-full border border-white/20 bg-transparent px-8 py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 hover:border-white transition-all no-underline"
            >
              CALL CONSULTANT
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
    </div>
  );
}
