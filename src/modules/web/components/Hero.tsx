"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useEnquiry } from "@/shared/context/EnquiryContext";

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

function YouTubeHeroPlayer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Inject YouTube IFrame API script if not already present
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Set callback or run directly if already loaded
    window.onYouTubeIframeAPIReady = () => {
      initPlayer();
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    }

    function initPlayer() {
      playerRef.current = new window.YT.Player("hero-youtube-iframe", {
        events: {
          onReady: (event: YTPlayerReadyEvent) => {
            event.target.mute();
            event.target.playVideo();
          },
          onStateChange: (event: YTStateChangeEvent) => {
            // Loop the video manually if ended
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          },
        },
      });
    }
  }, []);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

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
      {/* Wrapper with deep crop to hide controls and channel name watermark */}
      <div className="absolute top-[-30%] left-[-30%] w-[160%] h-[160%]">
        <iframe
          id="hero-youtube-iframe"
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/z4SA0ciEoO8?enablejsapi=1&autoplay=1&mute=1&controls=0&loop=1&playlist=z4SA0ciEoO8&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3"
          title="Ayodhya Sarayu Riverfront Development"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          style={{ pointerEvents: "none", objectFit: "cover", width: "100%", height: "100%" }}
        />
      </div>

      {/* Play/Pause Button Overlay in Center */}
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause Video" : "Play Video"}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center cursor-pointer z-10 hover:bg-black/80 hover:scale-110 active:scale-95 transition-all duration-300"
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16" className="translate-x-0.5">
            <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
          </svg>
        )}
      </button>

      {/* Mute/Unmute Button Overlay in Top Right */}
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

export default function Hero() {
  const { openEnquiry } = useEnquiry();

  return (
    <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden bg-background">
      {/* Premium Luxury Grid Pattern Overlays */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Ambient background glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] h-[400px] md:h-[600px] w-[400px] md:w-[600px] rounded-full bg-gold-solid/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[5%] h-[300px] md:h-[500px] w-[300px] md:w-[500px] rounded-full bg-dark-secondary/80 blur-[130px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.2fr] gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Brand Description Panel */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-left duration-700">
            
            {/* Live Counter/Urgency Notification Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-solid/30 bg-gold-solid/5 px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#DDBD81] mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Ganges Waterfront Plots • 12 Units Left
            </div>

            {/* Main Brand Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light tracking-tight text-white leading-[1.05] mb-6 font-serif">
              Kashi <br />
              <span className="bg-gradient-to-r from-gold-solid via-gold-hover to-gold-dark bg-clip-text text-transparent inline-block font-normal italic">
                has Chosen You
              </span>
            </h1>

            {/* Subtext description */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 max-w-md lg:max-w-none font-light">
              Own premium gated villa land plots on the banks of the holy Ganga in Banaras. Just minutes away from the divine Kashi Vishwanath Corridor.
            </p>

            {/* Trust Highlights Checklist */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-8 text-xs font-medium text-slate-400 font-sans tracking-wide">
              <div className="flex items-center gap-1.5">
                <span className="text-gold-solid">✓</span> RERA Approved
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-gold-solid">✓</span> 100% Vetted Titles
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-gold-solid">✓</span> Gated Layout Security
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-gold-solid">✓</span> 30ft Wide Roads
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:max-w-md lg:max-w-none">
              <button
                className="w-full sm:w-auto rounded-full bg-gold-solid hover:bg-gold-hover px-8 py-4 text-xs font-bold uppercase tracking-widest text-[#020520] transition-all hover:scale-105 active:scale-95 shadow-[0_4px_25px_rgba(221,189,129,0.3)] animate-pulse"
                onClick={() => openEnquiry("Ganges Waterfront Plots (Varanasi Banaras)")}
              >
                Enquire Now
              </button>
              <Link
                href="/projects"
                className="w-full sm:w-auto text-center rounded-full border border-white/20 bg-transparent px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white/10 hover:border-white hover:scale-105 active:scale-95"
              >
                View Projects →
              </Link>
            </div>
          </div>

          {/* Right Column: Video Container */}
          <div className="w-full max-w-2xl mx-auto lg:max-w-none flex items-center justify-center animate-in fade-in slide-in-from-right duration-700">
            <YouTubeHeroPlayer />
          </div>
        </div>
      </div>
    </section>
  );
}
