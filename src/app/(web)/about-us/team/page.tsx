"use client";

import React, { useState, useEffect } from "react";
import SectionHeading from "@/shared/components/SectionHeading";
import { useEnquiry } from "@/shared/context/EnquiryContext";
import { API_BASE_URL } from "@/shared/lib/api-config";
import CallToAction from "@/modules/web/components/CallToAction";

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
    <div className="min-h-screen bg-[#FBF8F2] pb-32 overflow-hidden relative text-slate-800 font-sans border-t border-[#EADBB4]/60">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20vh] -right-[200px] w-[600px] h-[600px] bg-[#8C6D23]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Intro Header Section */}
      <div className="relative pt-24 pb-6 md:pt-32 md:pb-8 z-10">
        <div className="mx-auto max-w-5xl px-6 md:px-8 text-center">
          <SectionHeading
            badge="Leadership & Experts"
            plainText="Meet Our"
            highlightText="Team"
            align="center"
            className="!mb-4"
          />
          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal">
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
            className={`rounded-full px-5 py-2 text-xs font-bold tracking-wider uppercase transition-all duration-300 border outline-none cursor-pointer ${selectedDepartment === dept
              ? "bg-[#1A150C] text-white border-[#1A150C] shadow-md scale-105"
              : "bg-white text-[#8C6D23] border-[#EADBB4] hover:border-[#D4AF37] hover:bg-[#FAF4E8]"
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
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#1A150C] tracking-tight uppercase">
              Executive <span className="text-[#8C6D23]">Leadership</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1 font-normal">Visionaries driving the advisory board and organizational strategy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredMembers.map((member, idx) => (
              <div
                key={member.id || idx}
                className="bg-white border border-[#EADBB4] hover:border-[#D4AF37] p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#D4AF37]/15 flex flex-col justify-between group relative opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${idx * 80}ms`, animationFillMode: "forwards" }}
              >
                <div>
                  {/* Profile Image Wrapper */}
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-5 border border-[#EADBB4] bg-[#FAF4E8]">
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
                    
                    <div className={`fallback-avatar w-full h-full bg-[#FAF4E8] flex items-center justify-center text-4xl text-[#D4AF37] ${member.image ? 'hidden' : ''}`}>
                      👤
                    </div>
                    {member.department && (
                      <span className="absolute top-3 right-3 text-[9px] font-extrabold tracking-widest uppercase bg-[#1A150C] text-[#D4AF37] px-3 py-1 rounded-full border border-[#D4AF37]/40 shadow-md">
                        {member.department}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 relative z-10 text-center flex flex-col items-center">
                    <h4 className="text-lg font-extrabold text-[#1A150C] group-hover:text-[#8C6D23] transition-colors duration-300">
                      {member.name}
                    </h4>
                    <p className="text-xs text-[#8C6D23] font-bold tracking-wider uppercase">
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
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#1A150C] tracking-tight uppercase">
              Management & <span className="text-[#8C6D23]">Experts</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1 font-normal">The dedicated managers and engineers ensuring flawless execution.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularMembers.map((member, idx) => (
              <div
                key={member.id || idx}
                className="bg-white border border-[#EADBB4] p-5 rounded-3xl transition-all duration-300 hover:border-[#D4AF37] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#D4AF37]/10 flex flex-col justify-between group opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${idx * 80}ms`, animationFillMode: "forwards" }}
              >
                <div>
                  {/* Profile Image Wrapper */}
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-5 border border-[#EADBB4] bg-[#FAF4E8]">
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
                    
                    <div className={`fallback-avatar w-full h-full bg-[#FAF4E8] flex items-center justify-center text-4xl text-[#D4AF37] ${member.image ? 'hidden' : ''}`}>
                      👤
                    </div>
                    {member.department && (
                      <span className="absolute top-3 right-3 text-[9px] font-extrabold tracking-widest uppercase bg-[#FAF4E8] text-[#8C6D23] border border-[#EADBB4] px-2.5 py-1 rounded-full shadow-sm">
                        {member.department}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-center flex flex-col items-center">
                    <h4 className="text-lg font-extrabold text-[#1A150C] group-hover:text-[#8C6D23] transition-colors duration-300">
                      {member.name}
                    </h4>
                    <p className="text-xs text-[#8C6D23] font-bold tracking-wide uppercase">
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
      <CallToAction />

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
