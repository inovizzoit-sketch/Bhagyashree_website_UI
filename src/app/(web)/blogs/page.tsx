"use client";

import React, { useState, useEffect } from "react";
import { useEnquiry } from "@/shared/context/EnquiryContext";
import SectionHeading from "@/shared/components/SectionHeading";
import { API_BASE_URL } from "@/shared/lib/api-config";

interface BlogArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  content: string[];
}

export default function BlogsWebPage() {
  const [selectedBlog, setSelectedBlog] = useState<BlogArticle | null>(null);
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const { openEnquiry } = useEnquiry();

  const staticArticles: BlogArticle[] = [
    {
      id: "varanasi-renaissance",
      title: "The Varanasi Renaissance: Why Rohania is Plotted Land's Next Goldmine",
      category: "Market Insights",
      date: "July 15, 2026",
      readTime: "4 min read",
      image: "/images/hero_brand.png",
      excerpt: "With the expansion of the Ring Road and rapid urban migration, Varanasi's outskirts are witnessing unprecedented appreciation. Here's a deep dive into the numbers.",
      content: [
        "Varanasi is experiencing an unprecedented structural boom. The expansion of the Ring Road Phase 2 and arterial highway connectivity has brought suburbs like Rohania into the primary limelight for both commercial expansions and luxury residential plotting layout developments.",
        "Over the last 36 months, land values along the outer corridors have seen historic capital appreciation multipliers. The influx of retail spaces, institutional campuses, and national transit projects has created a supply-demand imbalance that favors early investors.",
        "Unlike traditional unorganized land segments where title clearing remains an issue, branded plotted avenues in Rohania offer secure investment channels with clear exit strategies, high resale liquidity, and robust legal backing."
      ]
    },
    {
      id: "branded-plotted-land",
      title: "Branded Plotted Land: The Safest Wealth Multiplier in 2026",
      category: "Land Economics",
      date: "July 12, 2026",
      readTime: "5 min read",
      image: "/images/clubhouse.png",
      excerpt: "Why institutional security, legal clearances, and immediate road access make branded land layouts outperform traditional unorganized plots by 3x.",
      content: [
        "For decades, plotted land purchase was considered high-risk due to duplicate registrations, boundary overlaps, and encroachment threats. Branded land developers have changed the paradigm by offering institutional security.",
        "Branded plotted layouts undergo rigorous legal checks. They guarantee non-agricultural (NA) certification, RERA compliance, and clear demarcation from day one, which standardizes plot value appreciation.",
        "Additionally, branded layouts deliver ready utilities (paved asphalt roads, electricity connections, water supply drains) immediately. This pre-installed infrastructure ensures rapid valuation growth, outperforming raw agricultural plots by up to 300%."
      ]
    },
    {
      id: "legal-due-diligence",
      title: "The Smart Investor's Legal Checklist for Land in Uttar Pradesh",
      category: "Due Diligence",
      date: "July 08, 2026",
      readTime: "6 min read",
      image: "/images/wellness.png",
      excerpt: "Navigating non-agricultural certificates, RERA documentation numbers, and land mutation records can be tricky. Here is our 5-step checklist.",
      content: [
        "Due diligence is the single most important step when acquiring land in Uttar Pradesh. First, verify the 'Khatauni' (land record registers) to establish the current ownership names and check for hidden bank mortgages.",
        "Ensure the plot is registered as Non-Agricultural (NA) or verify that a conversion certificate has been officially issued by the sub-divisional magistrate. This prevents zoning fines down the road.",
        "Finally, ensure that the layout is RERA approved. Buying inside a RERA-registered development protects your capital against developer defaults, boundary conflicts, and infrastructure delivery delays."
      ]
    }
  ];

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await fetch(`${API_BASE_URL}/blog`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: BlogArticle[] = data.map((b: any) => {
            const readTimeMinutes = Math.max(2, Math.ceil((b.description || "").split(/\s+/).length / 200));
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
              content: (b.description || "").split(/\r?\n/).filter((line: string) => line.trim().length > 0),
            };
          });
          setArticles(mapped);
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
    <div className="min-h-screen pb-32 overflow-hidden relative text-slate-300 font-sans">
      {/* Visual background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-gold-solid/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[60vh] -right-[200px] w-[500px] h-[500px] bg-gold-solid/2 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Header Banner */}
      <div className="relative pt-28 pb-6 md:pt-36 md:pb-8 z-10">
          <SectionHeading 
            badge="Asset Intelligence Blog" 
            plainText="Nandeeka" 
            highlightText="Insights" 
            align="center" 
            className="!mb-4"
          />
          <p className="mx-auto max-w-2xl px-6 text-center text-xs sm:text-sm md:text-base text-text-gray-muted leading-relaxed font-light">
            Stay ahead with curated deep-dives into Varanasi&apos;s property trends, legal guidelines, and branded plotted land developments.
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
            <div className="text-center py-20 col-span-full text-slate-400">
              No articles found.
            </div>
          ) : (
            articles.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedBlog(article)}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-[#0d153b]/15 hover:border-gold-solid/35 transition-all duration-300 shadow-xl cursor-pointer"
              >
                <div className="space-y-4">
                  {/* Image container */}
                  <div className="aspect-[16/10] overflow-hidden relative bg-[#080d27]">
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
                    <span className="text-[10px] text-text-gray-muted font-mono">
                      {article.date} • {article.readTime}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-gold-solid transition-colors duration-300 leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-text-gray-muted font-light leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 mt-auto">
                  <span className="text-xs font-semibold text-gold-solid group-hover:text-white transition-colors flex items-center gap-1.5">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#0e163d]/95 to-[#080d27]/98 border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-slide-up">
            
            {/* Top decorative line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-gold-solid to-gold-hover" />

            {/* Header / Cover container */}
            <div className="relative aspect-[21/9] w-full bg-[#080d27] shrink-0">
              <img
                src={selectedBlog.image}
                alt={selectedBlog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e163d] to-transparent" />
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 border border-white/10 text-white hover:bg-gold-solid hover:text-[#020520] transition-colors flex items-center justify-center cursor-pointer outline-none"
              >
                ✕
              </button>
            </div>

            {/* Content area */}
            <div className="p-8 overflow-y-auto space-y-4 leading-relaxed text-sm text-text-gray-light font-light scrollbar-thin">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold-solid bg-gold-solid/10 border border-gold-solid/25 px-2 py-0.5 rounded inline-block">
                  {selectedBlog.category}
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-white leading-tight">
                  {selectedBlog.title}
                </h3>
                <p className="text-xs text-text-gray-muted font-mono">
                  Published on {selectedBlog.date} • {selectedBlog.readTime}
                </p>
              </div>

              <hr className="border-white/5 my-4" />

              {selectedBlog.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="p-6 border-t border-white/5 bg-[#080d27]/40 flex justify-end shrink-0 gap-3">
              <button
                onClick={() => {
                  setSelectedBlog(null);
                  openEnquiry(`Enquiry via Blog: ${selectedBlog.title}`);
                }}
                className="px-5 py-2.5 bg-transparent hover:bg-white/5 border border-gold-solid text-gold-solid font-bold text-xs rounded-xl transition-all cursor-pointer"
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
