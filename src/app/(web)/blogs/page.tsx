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
    <div className="min-h-screen bg-background pb-32 overflow-hidden relative text-slate-800 font-sans">
      {/* Visual background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-gold-solid/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[60vh] -right-[200px] w-[500px] h-[500px] bg-gold-solid/2 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Header Banner */}
      <div className="relative pt-28 pb-6 md:pt-36 md:pb-8 z-10">
        <SectionHeading 
          badge="Asset Intelligence Blog" 
          plainText="Bhagyashree" 
          highlightText="Insights" 
          align="center" 
          className="!mb-4"
        />
        <p className="mx-auto max-w-2xl px-6 text-center text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-light">
          Stay ahead with curated deep-dives into Mirzapur&apos;s property trends, legal guidelines, and branded plotted land developments.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6 md:px-8 relative z-10 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3 col-span-full">
              <div className="w-8 h-8 border-2 border-gold-solid/20 border-t-gold-solid rounded-full animate-spin" />
              <p className="text-xs text-gold-solid/60 uppercase tracking-widest font-semibold">
                Loading Articles...
              </p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 col-span-full text-slate-500">
              No articles found.
            </div>
          ) : (
            articles.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedBlog(article)}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-dark-secondary/10 bg-surface hover:border-gold-solid/35 transition-all duration-300 shadow-xl cursor-pointer"
              >
                <div className="space-y-4">
                  {/* Image container */}
                  <div className="aspect-[16/10] overflow-hidden relative bg-slate-50">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-gold-solid text-[#020520] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      {article.category}
                    </div>
                  </div>

                  {/* Text contents */}
                  <div className="px-6 space-y-2">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {article.date} • {article.readTime}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-gold-solid transition-colors duration-300 leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-600 font-light leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 mt-auto">
                  <span className="text-xs font-semibold text-gold-solid group-hover:text-gold-hover transition-colors flex items-center gap-1.5">
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-surface border border-dark-secondary/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-slide-up">
            
            {/* Top decorative line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-gold-solid to-gold-hover" />

            {/* Header / Cover container */}
            <div className="relative aspect-[21/9] w-full bg-slate-50 shrink-0">
              <img
                src={selectedBlog.image}
                alt={selectedBlog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 border border-white/10 text-white hover:bg-gold-solid hover:text-[#020520] transition-colors flex items-center justify-center cursor-pointer outline-none"
              >
                ✕
              </button>
            </div>

            {/* Content area */}
            <div className="p-8 overflow-y-auto space-y-4 leading-relaxed text-sm text-slate-700 font-light scrollbar-thin">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold-solid bg-gold-solid/10 border border-gold-solid/25 px-2 py-0.5 rounded inline-block">
                  {selectedBlog.category}
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">
                  {selectedBlog.title}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Published on {selectedBlog.date} • {selectedBlog.readTime}
                </p>
              </div>

              <hr className="border-slate-100 my-4" />

              {selectedBlog.descriptionHtml ? (
                <div 
                  className="rich-text-renderer space-y-4"
                  dangerouslySetInnerHTML={{ __html: selectedBlog.descriptionHtml }}
                />
              ) : (
                selectedBlog.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end shrink-0 gap-3">
              <button
                onClick={() => {
                  setSelectedBlog(null);
                  openEnquiry(`Enquiry via Blog: ${selectedBlog.title}`);
                }}
                className="px-5 py-2.5 bg-transparent hover:bg-slate-50 border border-gold-solid text-gold-solid font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Consult Property Expert
              </button>
              <button
                onClick={() => setSelectedBlog(null)}
                className="px-6 py-2.5 bg-gold-solid hover:bg-gold-hover text-[#020520] font-bold text-xs rounded-xl transition-all cursor-pointer"
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
