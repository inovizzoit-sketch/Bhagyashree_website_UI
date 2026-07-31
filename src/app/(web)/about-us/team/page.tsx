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
    email: "sandeep@nandeeka.com",
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
    email: "aman@nandeeka.com",
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
    email: "john@nandeeka.com",
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
            The driving force behind Nandeeka's commitment to quality, transparency, and innovation in plotted developments.
          </p>
        </div>
      </div>

      {/* Interactive Filter Pills */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-8 mb-16 flex flex-wrap justify-center gap-2.5">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDepartment(dept)}
            className={`rounded-full px-5 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-300 border outline-none cursor-pointer ${
              selectedDepartment === dept
                ? "bg-gold-solid text-dark-primary border-gold-solid shadow-[0_4px_15px_rgba(221,189,129,0.3)] scale-105"
                : "bg-white/5 text-slate-400 border-white/5 hover:border-white/10 hover:text-white"
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* ── Section 1: Executive Leadership ── */}
      {featuredMembers.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10 mb-20">
          <div className="border-l-2 border-gold-solid pl-4 mb-8">
            <h3 className="text-xl font-serif text-white font-light tracking-wide uppercase">
              Executive <span className="font-semibold italic text-gold-solid">Leadership</span>
            </h3>
            <p className="text-xs text-text-gray-muted mt-0.5">Visionaries driving the advisory board and organizational strategy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredMembers.map((member, idx) => (
              <div
                key={member.id || idx}
                className="bg-gradient-to-b from-gold-solid/5 to-transparent border border-gold-solid/20 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between backdrop-blur-sm group relative"
              >
                {/* Accent halo glow behind featured profiles */}
                <div className="absolute inset-0 bg-gradient-to-r from-gold-solid/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                
                <div>
                  {/* Profile Image Wrapper */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-5 border border-gold-solid/15 bg-[#1b2354]/10">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                    <div className={`fallback-avatar w-full h-full bg-[#1b2354]/40 flex items-center justify-center text-4xl text-gold-solid ${member.image ? 'hidden' : ''}`}>
                      👤
                    </div>
                    {member.department && (
                      <span className="absolute top-3 right-3 text-[9px] font-bold tracking-widest uppercase bg-gold-solid text-dark-primary px-2.5 py-1.5 rounded-md shadow-lg font-sans">
                        {member.department}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 relative z-10">
                    <h4 className="text-lg font-bold text-white group-hover:text-gold-solid transition-colors duration-300">
                      {member.name}
                    </h4>
                    <p className="text-xs text-gold-solid font-semibold tracking-wider uppercase">
                      {member.designation}
                    </p>
                    {member.bio && (
                      <p className="text-xs text-[#8E90A2] font-light line-clamp-4 leading-relaxed pt-1">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Social Links Footer */}
                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5 text-xs relative z-10">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#8E90A2] hover:text-gold-solid transition-colors font-medium flex items-center gap-1.5 no-underline"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      LinkedIn
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="text-[#8E90A2] hover:text-gold-solid transition-colors font-medium flex items-center gap-1.5 no-underline"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Section 2: Management & Experts ── */}
      {regularMembers.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10 mb-28">
          <div className="border-l-2 border-white/20 pl-4 mb-8">
            <h3 className="text-xl font-serif text-white font-light tracking-wide uppercase">
              Management & <span className="font-semibold italic text-slate-300">Experts</span>
            </h3>
            <p className="text-xs text-text-gray-muted mt-0.5">The dedicated managers and engineers ensuring flawless execution.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularMembers.map((member, idx) => (
              <div
                key={member.id || idx}
                className="bg-[#050c38]/15 border border-white/5 hover:border-gold-solid/40 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between backdrop-blur-sm group"
              >
                <div>
                  {/* Profile Image Wrapper */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-5 border border-white/5 bg-[#1b2354]/10">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                    <div className={`fallback-avatar w-full h-full bg-[#1b2354]/40 flex items-center justify-center text-4xl text-gold-solid ${member.image ? 'hidden' : ''}`}>
                      👤
                    </div>
                    {member.department && (
                      <span className="absolute top-3 right-3 text-[9px] font-bold tracking-widest uppercase bg-white/10 text-white backdrop-blur-md px-2 py-1 rounded-md shadow-md">
                        {member.department}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-white group-hover:text-gold-solid transition-colors duration-300">
                      {member.name}
                    </h4>
                    <p className="text-xs text-gold-solid font-medium tracking-wide uppercase">
                      {member.designation}
                    </p>
                    {member.bio && (
                      <p className="text-xs text-[#8E90A2] font-light line-clamp-3 leading-relaxed pt-1">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Social Links Footer */}
                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5 text-xs">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#8E90A2] hover:text-gold-solid transition-colors font-medium flex items-center gap-1.5 no-underline"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      LinkedIn
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="text-[#8E90A2] hover:text-gold-solid transition-colors font-medium flex items-center gap-1.5 no-underline"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action Box */}
      <div className="mx-auto max-w-5xl px-6 md:px-8 relative z-10">
        <div className="bg-gradient-to-r from-[#0d153b] via-[#050c38] to-[#020520] border border-white/15 p-8 md:p-14 rounded-3xl text-center space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gold-solid/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold-solid">Ready to Invest?</span>
            <h3 className="text-2xl md:text-4xl font-serif text-white font-light leading-tight">
              Begin your secure land legacy <span className="font-medium italic text-gold-solid">today</span>
            </h3>
            <p className="text-xs md:text-sm text-text-gray-muted leading-relaxed font-light">
              Connect with our land investment consultants to schedule a guided site tour of our premium layouts in Varanasi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => openEnquiry()}
              className="w-full sm:w-auto rounded-full bg-gold-solid px-8 py-4 text-xs font-bold uppercase tracking-widest text-dark-primary hover:bg-gold-hover hover:scale-105 active:scale-95 transition-all shadow-[0_4px_25px_rgba(221,189,129,0.3)]"
            >
              Enquire Now
            </button>
            <a
              href="tel:+919519662111"
              className="w-full sm:w-auto text-center rounded-full border border-white/20 bg-transparent px-8 py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 hover:border-white transition-all no-underline"
            >
              Call Consultant
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
