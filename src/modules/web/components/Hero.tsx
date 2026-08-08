"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useEnquiry } from "@/shared/context/EnquiryContext";
import { API_BASE_URL } from "@/shared/lib/api-config";
import DynamicFormRenderer from "@/shared/components/DynamicFormRenderer";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayerReadyEvent {
  target: {
    mute: () => void;
    playVideo: () => void;
    unMute: () => void;
    pauseVideo: () => void;
  };
}

interface YTStateChangeEvent {
  data: number;
  target: {
    playVideo: () => void;
  };
}

function YouTubeHeroPlayer({ videoId }: { videoId: string }) {
  const [isMuted, setIsMuted] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      initPlayer();
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    }

    function initPlayer() {
      playerRef.current = new window.YT.Player(`hero-yt-${videoId}`, {
        events: {
          onReady: (event: YTPlayerReadyEvent) => {
            event.target.mute();
            event.target.playVideo();
          },
          onStateChange: (event: YTStateChangeEvent) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          },
        },
      });
    }
  }, [videoId]);

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  return (
    <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl group/player">
      <div className="absolute top-[-30%] left-[-30%] w-[160%] h-[160%]">
        <iframe
          id={`hero-yt-${videoId}`}
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`}
          title="Hero Video Player"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          style={{ pointerEvents: "none", objectFit: "cover", width: "100%", height: "100%" }}
        />
      </div>
      <button
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute Video" : "Mute Video"}
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center cursor-pointer z-10 hover:bg-black/80 hover:scale-110 active:scale-95 transition-all duration-300"
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.536 14.01A8.473 8.473 0 0 0 14 8c0-2.29-.904-4.37-2.37-5.914a.5.5 0 0 1 .708-.707A9.471 9.471 0 0 1 15 8a9.472 9.472 0 0 1-2.756 6.717.5.5 0 0 1-.707-.707zm-2.122-2.122A5.474 5.474 0 0 0 11 8c0-1.503-.603-2.871-1.585-3.877a.5.5 0 0 1 .707-.707A6.471 6.471 0 0 1 12 8a6.471 6.471 0 0 1-1.878 4.607.5.5 0 0 1-.707-.707zm-2.122-2.122A2.99 2.99 0 0 0 8 8c0-.776-.293-1.48-.773-2.012a.5.5 0 0 1 .707-.707A3.99 3.99 0 0 1 9 8a3.99 3.99 0 0 1-1.066 2.653.5.5 0 0 1-.707-.707zM5.01 5.3a.5.5 0 0 1 .19.37v4.66a.5.5 0 0 1-.76.42L2.75 8.75H1.5A.5.5 0 0 1 1 8.25v-1.5a.5.5 0 0 1 .5-.5h1.25l1.69-2.02a.5.5 0 0 1 .57-.13z" />
          </svg>
        )}
      </button>
    </div>
  );
}

function VideoHeroPlayer({ videoUrl }: { videoUrl: string }) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl group/player">
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <button
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute Video" : "Mute Video"}
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center cursor-pointer z-10 hover:bg-black/80 hover:scale-110 active:scale-95 transition-all duration-300"
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.536 14.01A8.473 8.473 0 0 0 14 8c0-2.29-.904-4.37-2.37-5.914a.5.5 0 0 1 .708-.707A9.471 9.471 0 0 1 15 8a9.472 9.472 0 0 1-2.756 6.717.5.5 0 0 1-.707-.707zm-2.122-2.122A5.474 5.474 0 0 0 11 8c0-1.503-.603-2.871-1.585-3.877a.5.5 0 0 1 .707-.707A6.471 6.471 0 0 1 12 8a6.471 6.471 0 0 1-1.878 4.607.5.5 0 0 1-.707-.707zm-2.122-2.122A2.99 2.99 0 0 0 8 8c0-.776-.293-1.48-.773-2.012a.5.5 0 0 1 .707-.707A3.99 3.99 0 0 1 9 8a3.99 3.99 0 0 1-1.066 2.653.5.5 0 0 1-.707-.707zM5.01 5.3a.5.5 0 0 1 .19.37v4.66a.5.5 0 0 1-.76.42L2.75 8.75H1.5A.5.5 0 0 1 1.5 8.25v-1.5a.5.5 0 0 1 .5-.5h1.25l1.69-2.02a.5.5 0 0 1 .57-.13z" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default function Hero({ previewData }: { previewData?: any }) {
  const { openEnquiry } = useEnquiry();
  const [slides, setSlides] = useState<any[]>([]);



  useEffect(() => {
    if (previewData) {
      // If previewing, wrap data in an array
      setSlides(Array.isArray(previewData) ? previewData : [previewData]);
      return;
    }

    fetch(`${API_BASE_URL}/hero`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Hero request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const nextSlides = Array.isArray(data) ? data : data ? [data] : [];

        if (nextSlides.length > 0) {
          setSlides(nextSlides);
        }
      })
      .catch((err) => console.error("Failed to load hero slides", err));
  }, [previewData]);

  if (slides.length === 0) {
    return null;
  }

  // The public home hero is intentionally static and uses the first configured slide.
  const activeSlide = slides[0];

  // Map variables
  const badgeText = activeSlide.badgeText || "";
  const heading = activeSlide.heading || "";
  const description = activeSlide.description || "";
  const mediaType = activeSlide.mediaType || "IMAGE";
  const mediaUrl = activeSlide.mediaUrl || "z4SA0ciEoO8";
  const layoutType = activeSlide.layoutType || "LEFT_CONTENT";
  const features = activeSlide.features || [];

  const customBg = activeSlide.backgroundColor || undefined;
  const customBgGradient = activeSlide.bgGradient || undefined;
  const customText = activeSlide.textColor || undefined;
  const customAccent = activeSlide.accentColor || "#DDBD81";
  const overlayColor = activeSlide.overlayColor || "#000000";
  const overlayOpacity = activeSlide.overlayOpacity ?? 0.4;

  // Split headline
  const headingParts = heading.split("\n");
  const headingLine1 = headingParts[0] || "";
  const headingLine2 = headingParts[1] || "";

  // Parse JSON CTA Buttons
  let ctaButtons: any[] = [];
  if (activeSlide.ctaButtons) {
    try {
      ctaButtons = JSON.parse(activeSlide.ctaButtons);
    } catch (e) {
      console.error("Failed to parse ctaButtons JSON", e);
    }
  }

  // Parse JSON Statistics
  let statistics: any[] = [];
  if (activeSlide.statistics) {
    try {
      statistics = JSON.parse(activeSlide.statistics);
    } catch (e) {
      console.error("Failed to parse statistics JSON", e);
    }
  }



  const renderMedia = () => {
    if (mediaType === "VIDEO") {
      const isDirectVideo = mediaUrl.startsWith("http") || mediaUrl.includes(".mp4");
      if (isDirectVideo) {
        return <VideoHeroPlayer videoUrl={mediaUrl} />;
      }
      return <YouTubeHeroPlayer videoId={mediaUrl} />;
    }

    // Default image rendering
    const imgUrl = mediaUrl.startsWith("http") || mediaUrl.startsWith("/") ? mediaUrl : `/images/${mediaUrl}`;
    return (
      <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgUrl} alt={activeSlide.altText || "Hero Media"} className="w-full h-full object-cover" />
      </div>
    );
  };

  const renderContentPanel = (align: "left" | "right" | "center" = "left") => {
    const isCenter = align === "center";
    return (
      <div className={`flex flex-col ${isCenter ? "items-center text-center max-w-4xl mx-auto" : "items-center lg:items-start text-center lg:text-left max-w-2xl mx-auto lg:mx-0"} animate-in fade-in duration-700`}>
        {badgeText && (
          <div
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6"
            style={{
              borderColor: `${customAccent}4d`,
              backgroundColor: `${customAccent}0d`,
              color: customAccent,
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {badgeText}
          </div>
        )}

        <h1
          className="text-4xl sm:text-5xl lg:text-7xl font-light tracking-tight leading-[1.05] mb-6 font-serif"
          style={{ color: customText || "var(--text-white)" }}
        >
          {headingLine1}
          {headingLine2 && (
            <>
              <br />
              <span
                className="bg-gradient-to-r bg-clip-text text-transparent inline-block font-normal italic"
                style={{
                  backgroundImage: `linear-gradient(to right, ${customAccent}, ${customAccent}dd)`,
                  color: customAccent,
                }}
              >
                {headingLine2}
              </span>
            </>
          )}
        </h1>

        <p
          className="text-sm sm:text-base leading-relaxed mb-6 max-w-md lg:max-w-none font-light"
          style={{ color: customText ? `${customText}dd` : "var(--text-gray-light)" }}
        >
          {description}
        </p>

        {features.length > 0 && (
          <div
            className={`grid grid-cols-2 gap-x-6 gap-y-2 mb-8 text-xs font-medium font-sans tracking-wide`}
            style={{ color: customText ? `${customText}bb` : "var(--text-gray-muted)" }}
          >
            {features.map((feat: string, idx: number) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span style={{ color: customAccent }}>✓</span> {feat}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:max-w-md lg:max-w-none justify-center lg:justify-start">
          {ctaButtons.map((btn: any, idx: number) => {
            const isPrimary = btn.style === "PRIMARY" || !btn.style;
            if (!btn.url) {
              return (
                <button
                  key={idx}
                  onClick={() => openEnquiry(badgeText)}
                  className="w-full sm:w-auto px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 animate-pulse cursor-pointer border-none"
                  style={{
                    backgroundColor: isPrimary ? customAccent : "transparent",
                    color: isPrimary ? "#020520" : customText || "var(--text-white)",
                    border: isPrimary ? "none" : `1px solid ${customText ? `${customText}33` : "var(--border-muted)"}`,
                    boxShadow: isPrimary ? `0 4px 25px ${customAccent}4d` : "none",
                    borderRadius: 'var(--radius-btn)',
                  }}
                >
                  {btn.text}
                </button>
              );
            }
            return (
              <Link
                key={idx}
                href={btn.url}
                target={btn.openInNewTab ? "_blank" : undefined}
                className="w-full sm:w-auto text-center px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 no-underline"
                style={{
                  backgroundColor: isPrimary ? customAccent : "transparent",
                  color: isPrimary ? "#020520" : customText || "var(--text-white)",
                  border: isPrimary ? "none" : `1px solid ${customText ? `${customText}33` : "var(--border-muted)"}`,
                  boxShadow: isPrimary ? `0 4px 25px ${customAccent}4d` : "none",
                  borderRadius: 'var(--radius-btn)',
                }}
              >
                {btn.text}
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  const renderLayout = () => {
    switch (layoutType) {
      case "RIGHT_CONTENT":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.1fr] gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">{renderMedia()}</div>
            <div className="order-1 lg:order-2">{renderContentPanel("left")}</div>
          </div>
        );

      case "CENTER":
        return <div className="max-w-4xl mx-auto">{renderContentPanel("center")}</div>;

      case "FULL_WIDTH":
        // Background banner layout
        const fullBg = mediaUrl.startsWith("http") || mediaUrl.startsWith("/") ? mediaUrl : `/images/${mediaUrl}`;
        return (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center flex items-center justify-center px-6 md:px-8 py-20"
            style={{
              backgroundImage: mediaType === "IMAGE" ? `url(${fullBg})` : undefined,
            }}
          >
            {/* Background Video Overlay */}
            {mediaType === "VIDEO" && (
              <div className="absolute inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                {mediaUrl.startsWith("http") || mediaUrl.includes(".mp4") ? (
                  <video
                    src={mediaUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${mediaUrl}?enablejsapi=1&autoplay=1&mute=1&controls=0&loop=1&playlist=${mediaUrl}&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`}
                    title="Banner Video Background"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  />
                )}
              </div>
            )}
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: overlayColor,
                opacity: overlayOpacity,
              }}
            />
            <div className="relative z-10 w-full">{renderContentPanel("center")}</div>
          </div>
        );

      case "STATS":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.2fr] gap-12 lg:gap-16 items-center">
            <div>{renderContentPanel("left")}</div>
            <div className="grid grid-cols-2 gap-6 bg-[#13131a]/50 p-8 rounded-3xl border border-white/5 backdrop-blur">
              {statistics.map((st: any, idx: number) => (
                <div key={idx} className="space-y-1 p-4 border-l-2 border-gold-solid/40">
                  <div className="text-3xl font-serif text-white font-bold">
                    {st.number}
                    <span style={{ color: customAccent }}>{st.suffix || ""}</span>
                  </div>
                  <div className="text-xs uppercase tracking-widest text-slate-400 font-sans">{st.title}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case "FORM":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.2fr] gap-12 lg:gap-16 items-center">
            <div>{renderContentPanel("left")}</div>
            <div className="bg-[#13131a] p-8 rounded-3xl border border-white/10 shadow-2xl max-w-md mx-auto w-full">
              <h3 className="text-lg font-serif text-white mb-2">Request Exclusive Pricing</h3>
              <p className="text-xs text-slate-400 mb-6">Submit your detail and our representative will reach back shortly.</p>
              <DynamicFormRenderer formSlug="quick-project-inquiry" pageSource={`Hero - ${activeSlide.title || "Slide"}`} />
            </div>
          </div>
        );

      default: // LEFT_CONTENT
        return (
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.2fr] gap-12 lg:gap-16 items-center">
            <div>{renderContentPanel("left")}</div>
            <div className="flex items-center justify-center">{renderMedia()}</div>
          </div>
        );
    }
  };

  return (
    <section
      className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden bg-background min-h-[550px] flex items-center"
      style={{
        backgroundColor: customBg,
        backgroundImage: customBgGradient,
        color: customText,
      }}
    >
      {/* Premium Luxury Grid Pattern Overlays */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Ambient background glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-[30%] -left-[10%] h-[400px] md:h-[600px] w-[400px] md:w-[600px] rounded-full blur-[120px]"
          style={{ backgroundColor: `${customAccent}1a` }}
        />
        <div className="absolute bottom-[10%] right-[5%] h-[300px] md:h-[500px] w-[300px] md:w-[500px] rounded-full bg-dark-secondary/80 blur-[130px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10 w-full">
        {renderLayout()}
      </div>

    </section>
  );
}
