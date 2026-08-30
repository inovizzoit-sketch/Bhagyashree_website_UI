"use client";

import React, { useState, useEffect } from "react";
import SectionHeading from "@/shared/components/SectionHeading";
import { useEnquiry } from "@/shared/context/EnquiryContext";
import { API_BASE_URL } from "@/shared/lib/api-config";

interface BlogArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  descriptionHtml?: string;
  content: string[];
}

export default function BlogsWebPage() {
  const [selectedBlog, setSelectedBlog] = useState<BlogArticle | null>(null);
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const { openEnquiry } = useEnquiry();

  const staticArticles: BlogArticle[] = [
    {
      id: "mirzapur-renaissance",
      title: "The Mirzapur Renaissance: Why Development Zones are Plotted Land's Next Goldmine",
      category: "Market Insights",
      date: "July 15, 2026",
      readTime: "4 min read",
      image: "/images/hero_brand.png",
      excerpt: "With the expansion of key transit highways and rapid urban migration, Mirzapur's outskirts are witnessing unprecedented appreciation. Here's a deep dive into the numbers.",
      content: [
        "Mirzapur is experiencing an unprecedented structural boom. The expansion of regional transit corridors and arterial highway connectivity has brought new development zones into the primary limelight for both commercial expansions and luxury residential plotting layout developments.",
        "Over the last 36 months, land values along the outer corridors have seen historic capital appreciation multipliers. The influx of retail spaces, institutional campuses, and national transit projects has created a supply-demand imbalance that favors early investors.",
        "Unlike traditional unorganized land segments where title clearing remains an issue, branded plotted avenues in Mirzapur offer secure investment channels with clear exit strategies, high resale liquidity, and robust legal backing."
      ]
    },
    {
      id: "land-buying-checklist",
      title: "The Ultimate Due Diligence Checklist for Purchasing Land in Uttar Pradesh",
      category: "Guides",
      date: "June 28, 2026",
      readTime: "6 min read",
      image: "/images/About.jpeg",
      excerpt: "Avoid legal pitfalls and disputes. Our comprehensive guide walks you through verifying land registries, mutation status, and local municipal zoning laws.",
      content: [
        "Buying plotted land is one of the most stable wealth generators in India, but it requires thorough due diligence to avoid common title disputes and regulatory hurdles.",
        "First, always verify the 30-year title registry history to ensure there are no pre-existing claims or family disputes. Second, confirm that the land has non-agricultural (NA) conversion clearances and conforms to planning layouts approved by the local municipal corporation.",
        "Finally, ensure that the property has a clear mutation entry in the land records database. Branded developers like Bhagyashree handle all these legal steps upfront, ensuring complete peace of mind."
      ]
    }
  ];

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await fetch(`${API_BASE_URL}/blogs`);
        if (res.ok) {
          const data = await res.json();
          const activeBlogs = data.filter((b: any) => b.isActive !== false);
          if (activeBlogs.length > 0) {
            const mapped = activeBlogs.map((b: any) => {
              const textOnly = (b.description || "").replace(/<[^>]*>/g, "");
              const wordsCount = textOnly.split(/\s+/).length;
              const readTimeMinutes = Math.max(1, Math.ceil(wordsCount / 200));
              const imageUrl = b.blogImage
                ? (b.blogImage.startsWith("http") || b.blogImage.startsWith("https")
                  ? b.blogImage
                  : `${API_BASE_URL.replace("/api/v1", "")}${b.blogImage}`)
                : "/images/hero_brand.png";

              return {
                id: b.id,
                title: b.title,
                category: "Market Insights",
                date: new Date(b.createdAt || Date.now()).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
                readTime: `${readTimeMinutes} min read`,
                image: imageUrl,
                excerpt: b.description ? (b.description.length > 150 ? b.description.slice(0, 150) + "..." : b.description) : "",
                descriptionHtml: b.description || "",
                content: (b.description || "").split(/\r?\n/).filter((line: string) => line.trim().length > 0),
              };
            });
            setArticles(mapped);
          } else {
            setArticles(staticArticles);
          }
        } else {
          setArticles(staticArticles);
        }
      } catch (err) {
        console.error("Error loading API blogs, falling back to static ones:", err);
        setArticles(staticArticles);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF8F2] pb-32 overflow-hidden relative font-sans text-slate-800 border-t border-[#EADBB4]/60">
      {/* Visual background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[60vh] -right-[200px] w-[500px] h-[500px] bg-[#8C6D23]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Header Banner */}
      <div className="relative pt-24 pb-6 md:pt-32 md:pb-8 z-10">
        <SectionHeading 
          badge="Asset Intelligence Blog" 
          plainText="Bhagyashree" 
          highlightText="Insights" 
          align="center" 
          className="!mb-4"
        />
        <p className="mx-auto max-w-2xl px-6 text-center text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal">
          Stay ahead with curated deep-dives into Mirzapur&apos;s property trends, legal guidelines, and branded plotted land developments.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6 md:px-8 relative z-10 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3 col-span-full">
              <div className="w-8 h-8 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
              <p className="text-xs text-[#8C6D23] uppercase tracking-widest font-semibold">
                Loading Articles...
              </p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 col-span-full text-slate-500 font-normal">
              No articles found.
            </div>
          ) : (
            articles.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedBlog(article)}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#EADBB4] bg-white hover:border-[#D4AF37] transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-[#D4AF37]/15 cursor-pointer"
              >
                <div className="space-y-4">
                  {/* Image container */}
                  <div className="aspect-[16/10] overflow-hidden relative bg-slate-900">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-[#1A150C] text-[#D4AF37] border border-[#D4AF37]/40 text-[9px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      {article.category}
                    </div>
                  </div>

                  {/* Text contents */}
                  <div className="px-6 space-y-2">
                    <span className="text-[10px] text-slate-500 font-mono font-bold">
                      {article.date} • {article.readTime}
                    </span>
                    <h3 className="text-base font-extrabold text-[#1A150C] group-hover:text-[#8C6D23] transition-colors duration-300 leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-600 font-normal leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 mt-auto">
                  <span className="text-xs font-extrabold text-[#8C6D23] group-hover:text-[#1A150C] transition-colors flex items-center gap-1.5 uppercase tracking-wider">
                    Read Full Article ➔
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Glassmorphic Blog Article Modal Overlay */}
      {selectedBlog && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in font-sans cursor-pointer"
          onClick={() => setSelectedBlog(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-white border border-[#EADBB4] rounded-3xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col animate-slide-up cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Top gold accent line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#997A15] shrink-0" />

            {/* Header / Cover container */}
            <div className="relative w-full h-44 sm:h-52 bg-slate-900 shrink-0 overflow-hidden">
              <img
                src={selectedBlog.image}
                alt={selectedBlog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/20 pointer-events-none" />
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-[#D4AF37] text-white hover:text-[#1A150C] border border-white/20 transition-all flex items-center justify-center cursor-pointer outline-none font-bold shadow-md"
                title="Close Article"
              >
                ✕
              </button>
            </div>

            {/* Content area */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4 leading-relaxed text-sm text-slate-700 font-normal scrollbar-thin flex-1">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8C6D23] bg-[#FAF4E8] border border-[#EADBB4] px-3 py-1 rounded-full inline-block">
                  {selectedBlog.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#1A150C] leading-tight">
                  {selectedBlog.title}
                </h3>
                <p className="text-xs text-slate-500 font-mono font-bold">
                  Published on {selectedBlog.date} • {selectedBlog.readTime}
                </p>
              </div>

              <hr className="border-[#EADBB4]/60 my-3" />

              {selectedBlog.descriptionHtml ? (
                <div 
                  className="rich-text-renderer space-y-4 text-slate-700 font-normal text-xs sm:text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedBlog.descriptionHtml }}
                />
              ) : (
                selectedBlog.content.map((p, idx) => (
                  <p key={idx} className="text-xs sm:text-sm leading-relaxed text-slate-700 font-normal">{p}</p>
                ))
              )}
            </div>

            {/* Modal Footer Bar */}
            <div className="p-4 sm:p-5 border-t border-[#EADBB4]/60 bg-[#FAF4E8] flex flex-col sm:flex-row items-center justify-end shrink-0 gap-3">
              <button
                onClick={() => {
                  const blogTitle = selectedBlog.title;
                  setSelectedBlog(null);
                  openEnquiry(`Enquiry via Blog: ${blogTitle}`);
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-[#EADBB4] border border-[#EADBB4] text-[#8C6D23] font-extrabold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer shadow-sm text-center"
              >
                Consult Property Expert
              </button>
              <button
                onClick={() => setSelectedBlog(null)}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#1A150C] hover:bg-[#8C6D23] text-white font-extrabold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer border-none shadow-sm text-center"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
