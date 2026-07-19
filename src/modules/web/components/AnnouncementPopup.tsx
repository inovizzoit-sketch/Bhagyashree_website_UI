"use client";

import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/shared/lib/api-config";

interface Announcement {
  id: string;
  title: string;
  content: string;
  link?: string;
  imageUrl?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

export default function AnnouncementPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    // Fetch the active announcement
    fetch(`${API_BASE_URL}/announcements/active`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch active announcement");
        return res.json();
      })
      .then((data: Announcement) => {
        if (data && data.isActive) {
          // Check if this announcement was already closed in this session
          const isClosed = sessionStorage.getItem(`announcement_closed_${data.id}`);
          if (!isClosed) {
            setAnnouncement(data);
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching announcement:", err);
      });
  }, []);

  useEffect(() => {
    if (!announcement) return;

    const handleScroll = () => {
      // Trigger popup when user scrolls down more than 150px
      if (window.scrollY > 150) {
        setIsOpen(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [announcement]);

  const handleClose = () => {
    if (announcement) {
      sessionStorage.setItem(`announcement_closed_${announcement.id}`, "true");
    }
    setIsOpen(false);
  };

  if (!isOpen || !announcement) return null;

  const isVideo = (url?: string) => {
    if (!url) return false;
    const cleanUrl = url.split("?")[0].split("#")[0].toLowerCase();
    return (
      cleanUrl.endsWith(".mp4") ||
      cleanUrl.endsWith(".webm") ||
      cleanUrl.endsWith(".ogg") ||
      cleanUrl.endsWith(".mov")
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-[500px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-dark-secondary to-background border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col justify-between">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all flex items-center justify-center cursor-pointer outline-none"
          title="Close"
        >
          ✕
        </button>

        <div className="space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-gold-solid/10 border border-gold-solid/35">
            <span className="text-[10px] text-[#DDBD81]">★</span>
            <span className="text-[10px] text-[#DDBD81] font-bold uppercase tracking-wider">Latest Update</span>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-serif text-white font-medium leading-tight">
            {announcement.title}
          </h3>

          {/* Media Player / Image */}
          {announcement.imageUrl && (
            <div className="w-full overflow-hidden rounded-2xl border border-white/5">
              {isVideo(announcement.imageUrl) ? (
                <video
                  src={announcement.imageUrl}
                  controls
                  className="w-full max-h-56 object-cover bg-black"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={announcement.imageUrl}
                  alt={announcement.title}
                  className="w-full max-h-56 object-cover"
                />
              )}
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-[#8E90A2] font-light leading-relaxed whitespace-pre-line">
            {announcement.content}
          </p>

          {/* Footer Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={handleClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-white/10 text-white/80 hover:text-white hover:bg-white/5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
            >
              Dismiss
            </button>
            {announcement.link && (
              <a
                href={announcement.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center px-6 py-2.5 rounded-full bg-gold-solid hover:bg-gold-hover text-background text-xs font-bold uppercase tracking-widest transition-all shadow-[0_4px_20px_rgba(221,189,129,0.2)] hover:scale-[1.02] active:scale-[0.98]"
              >
                Know More ➔
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
