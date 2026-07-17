"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

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

declare global {
  interface Window {
    YT: {
      Player: new (
        id: string,
        config: {
          events: {
            onReady: (event: YTPlayerReadyEvent) => void;
            onStateChange: (event: YTStateChangeEvent) => void;
          };
        }
      ) => void;
      PlayerState: {
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
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
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
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
  const openModal = (config?: { type: string; project: string }) => {
    alert(`Enquire modal triggered for ${config?.project || "General Portfolio"}`);
  };

  return (
    // Main background section with padding, overflow safety, and top navigation clearance.
    <section className="relative w-full bg-[#020520] py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background ambient lighting blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] h-[400px] md:h-[600px] w-[400px] md:w-[600px] rounded-full bg-gold-solid/5 blur-[100px] md:blur-[150px]" />
        <div className="absolute bottom-[10%] right-[5%] h-[300px] md:h-[500px] w-[300px] md:w-[500px] rounded-full bg-dark-secondary/60 blur-[90px] md:blur-[130px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {/* Responsive Grid: Stacks on Mobile & Tablet (grid-cols-1), Splits on Desktop (lg:grid-cols-[1fr_1.3fr]) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-10 md:gap-16 items-center">
          
          {/* Left Column: Brand Description Panel */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-left duration-700">
            
            {/* Subtitle location badge (displays flex alignment dynamically) */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-solid/20 bg-gold-solid/5 px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#DDBD81] mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Ganges Waterfront Plots
            </div>

            {/* Main Brand Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light tracking-tight text-white leading-[1.05] mb-6 font-serif">
              Varanasi <br />
              <span className="bg-gradient-to-r from-gold-solid via-gold-hover to-gold-dark bg-clip-text text-transparent inline-block font-normal italic">
                has Chosen You
              </span>
            </h1>

            {/* Subtext description */}
            <p className="text-sm sm:text-base text-text-gray-light leading-relaxed mb-8 max-w-md lg:max-w-none">
              Own premium gated villa land plots on the banks of the holy Ganga in Banaras. Just minutes away from the divine Kashi Vishwanath Corridor.
            </p>

            {/* CTA action buttons (adjusts from full-width column to row spacing based on viewport) */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:max-w-md lg:max-w-none">
              <button
                className="w-full sm:w-auto rounded-full bg-gold-solid px-8 py-4 text-xs font-bold uppercase tracking-widest text-dark-primary transition-all hover:bg-gold-hover hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(221,189,129,0.25)]"
                onClick={() => openModal({ type: "enquire", project: "Varanasi Banaras" })}
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

          {/* Right Column: Immersive YouTube Player container (stacks cleanly below text on mobile/tablets) */}
          <div className="w-full max-w-2xl mx-auto lg:max-w-none flex items-center justify-center animate-in fade-in slide-in-from-right duration-700">
            <YouTubeHeroPlayer />
          </div>
        </div>
      </div>
    </section>
  );
}
