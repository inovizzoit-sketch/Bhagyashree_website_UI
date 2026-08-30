"use client";

import React, { useEffect, useState, useRef } from "react";
import { API_BASE_URL } from "@/shared/lib/api-config";
import { usePathname } from "next/navigation";

interface PopupItem {
  id: string;
  title: string;
  slug: string;
  popupType: "ANNOUNCEMENT" | "PROMOTION" | "NEWSLETTER" | "LEAD_FORM" | "IMAGE_POPUP" | "VIDEO_POPUP" | "CUSTOM_HTML";
  heading?: string;
  subHeading?: string;
  description?: string;
  image?: string;
  videoUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  htmlContent?: string;
  triggerType: "ON_PAGE_LOAD" | "AFTER_X_SECONDS" | "ON_SCROLL" | "EXIT_INTENT" | "ON_BUTTON_CLICK";
  showAfterSeconds: number;
  frequency: "ONCE" | "EVERY_SESSION" | "ONCE_A_DAY" | "ALWAYS";
  priority: number;
  deviceType: "ALL" | "DESKTOP" | "MOBILE";
  targetType: "ALL_PAGES" | "SPECIFIC_PAGES";
  targetPages: string[];
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export default function AnnouncementPopup() {
  const pathname = usePathname();
  const [popupQueue, setPopupQueue] = useState<PopupItem[]>([]);
  const [currentPopup, setCurrentPopup] = useState<PopupItem | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  // Lead Form state
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadMessage, setLeadMessage] = useState("");

  const hasRecordedImpression = useRef(false);

  // Fetch active campaigns and evaluate eligibility
  useEffect(() => {
    fetch(`${API_BASE_URL}/popup/active`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch active popups");
        return res.json();
      })
      .then((popups: PopupItem[]) => {
        if (!popups || popups.length === 0) return;

        // 1. Determine Device Type
        const isMobile = window.innerWidth < 768;

        // 2. Filter campaigns
        const eligiblePopups = popups.filter((popup) => {
          // Device check
          if (popup.deviceType === "DESKTOP" && isMobile) return false;
          if (popup.deviceType === "MOBILE" && !isMobile) return false;

          // Target pages check
          if (popup.targetType === "SPECIFIC_PAGES" && popup.targetPages && popup.targetPages.length > 0) {
            const normalizePath = (rawPath: string): string => {
              let path = rawPath.trim().toLowerCase();
              if (path.startsWith("http://") || path.startsWith("https://")) {
                try {
                  path = new URL(path).pathname;
                } catch {
                  // Keep as is if URL parsing fails
                }
              }
              if (path.length > 1 && path.endsWith("/")) {
                path = path.slice(0, -1);
              }
              return path || "/";
            };

            const currentNormalized = normalizePath(pathname || "/");
            const matchesPage = popup.targetPages.some((page) => {
              const targetNormalized = normalizePath(page);
              if (!targetNormalized) return false;
              if (targetNormalized === currentNormalized) return true;
              if (targetNormalized.endsWith("*")) {
                const prefix = targetNormalized.slice(0, -1);
                return currentNormalized.startsWith(prefix);
              }
              return false;
            });
            if (!matchesPage) return false;
          }

          // Frequency Check
          const localKey = `bhagyashree_popup_shown_${popup.id}`;
          const sessionKey = `bhagyashree_popup_shown_session_${popup.id}`;

          if (popup.frequency === "ONCE") {
            if (localStorage.getItem(localKey)) return false;
          } else if (popup.frequency === "EVERY_SESSION") {
            if (sessionStorage.getItem(sessionKey)) return false;
          } else if (popup.frequency === "ONCE_A_DAY") {
            const lastShown = localStorage.getItem(localKey);
            if (lastShown) {
              const lastTime = parseInt(lastShown, 10);
              const oneDayMs = 24 * 60 * 60 * 1000;
              if (Date.now() - lastTime < oneDayMs) return false;
            }
          }

          return true;
        });

        if (eligiblePopups.length > 0) {
          // Sort queue: SPECIFIC_PAGES take precedence over ALL_PAGES, then by priority desc
          const sorted = eligiblePopups.sort((a, b) => {
            if (a.targetType !== b.targetType) {
              return a.targetType === "SPECIFIC_PAGES" ? -1 : 1;
            }
            return b.priority - a.priority;
          });

          setPopupQueue(sorted);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch active popups:", err?.message || err);
      });
  }, [pathname]);

  // Set current active popup from top of queue
  useEffect(() => {
    if (popupQueue.length > 0 && !currentPopup) {
      setCurrentPopup(popupQueue[0]);
      hasRecordedImpression.current = false;
      setLeadSuccess(false);
      setLeadError(null);
    }
  }, [popupQueue, currentPopup]);

  // Handle Triggers for currentPopup
  useEffect(() => {
    if (!currentPopup) return;

    let triggerTimeout: NodeJS.Timeout;

    const showPopup = () => {
      setIsVisible(true);
      // Mark as shown according to frequency requirements
      const localKey = `bhagyashree_popup_shown_${currentPopup.id}`;
      const sessionKey = `bhagyashree_popup_shown_session_${currentPopup.id}`;

      if (currentPopup.frequency === "ONCE") {
        localStorage.setItem(localKey, "true");
      } else if (currentPopup.frequency === "EVERY_SESSION") {
        sessionStorage.setItem(sessionKey, "true");
      } else if (currentPopup.frequency === "ONCE_A_DAY") {
        localStorage.setItem(localKey, String(Date.now()));
      }

      // Record impression telemetry
      if (!hasRecordedImpression.current) {
        fetch(`${API_BASE_URL}/popup/${currentPopup.id}/impression`, { method: "POST" })
          .then(() => {
            hasRecordedImpression.current = true;
          })
          .catch((err) => console.error("Impression telemetry error:", err));
      }
    };

    // ON_PAGE_LOAD & AFTER_X_SECONDS
    if (currentPopup.triggerType === "ON_PAGE_LOAD" || currentPopup.triggerType === "AFTER_X_SECONDS") {
      const delayMs = (currentPopup.showAfterSeconds || 0) * 1000;
      triggerTimeout = setTimeout(showPopup, delayMs);
    }

    // ON_SCROLL (scrolls down > 150px)
    const handleScroll = () => {
      if (window.scrollY > 150) {
        showPopup();
        window.removeEventListener("scroll", handleScroll);
      }
    };

    if (currentPopup.triggerType === "ON_SCROLL") {
      window.addEventListener("scroll", handleScroll);
    }

    // EXIT_INTENT (mouse leaves viewport top boundary)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 20) {
        showPopup();
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };

    if (currentPopup.triggerType === "EXIT_INTENT") {
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      clearTimeout(triggerTimeout);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [currentPopup]);

  if (!isVisible || !currentPopup) return null;

  const handleClose = () => {
    if (currentPopup) {
      fetch(`${API_BASE_URL}/popup/${currentPopup.id}/close`, { method: "POST" }).catch((err) =>
        console.error("Close telemetry error:", err)
      );
    }
    setIsVisible(false);
    // Advance queue to next popup
    setCurrentPopup(null);
    setPopupQueue((prev) => prev.slice(1));
  };

  const handleCTAClick = () => {
    fetch(`${API_BASE_URL}/popup/${currentPopup.id}/click`, { method: "POST" }).catch((err) =>
      console.error("Click telemetry error:", err)
    );
  };

  // Submit Lead form/newsletter
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail && !leadPhone && !leadName) {
      setLeadError("Please provide at least a name, phone number, or email.");
      return;
    }

    try {
      if (currentPopup?.popupType === "LEAD_FORM" && leadPhone && leadPhone.length !== 10) {
        setLeadError("Please enter a valid 10-digit mobile number.");
        return;
      }
      setSubmittingLead(true);
      setLeadError(null);

      const response = await fetch(`${API_BASE_URL}/popup/${currentPopup.id}/lead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: leadName || undefined,
          email: leadEmail,
          phone: leadPhone || undefined,
          message: leadMessage || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit inquiry.");
      }

      setLeadSuccess(true);
      // Track click on form submission
      handleCTAClick();
    } catch (err: any) {
      setLeadError(err.message || "An error occurred. Please try again.");
    } finally {
      setSubmittingLead(false);
    }
  };

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

  // RENDER CUSTOM HTML
  if (currentPopup.popupType === "CUSTOM_HTML") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      >
        <div
          className="relative w-full max-w-[650px] max-h-[90vh] overflow-y-auto bg-background border border-border-color rounded-3xl shadow-2xl p-4 flex flex-col justify-between text-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground/60 hover:text-foreground transition-all flex items-center justify-center cursor-pointer outline-none"
            title="Close"
          >
            ✕
          </button>
          <div
            dangerouslySetInnerHTML={{ __html: currentPopup.htmlContent || "" }}
            onClick={handleCTAClick}
            className="w-full"
          />
        </div>
      </div>
    );
  }

  // RENDER IMAGE POPUP
  if (currentPopup.popupType === "IMAGE_POPUP") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      >
        <div
          className="relative w-full max-w-[500px] bg-transparent rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white/80 hover:text-white transition-all flex items-center justify-center cursor-pointer outline-none border border-white/10"
            title="Close"
          >
            ✕
          </button>

          {currentPopup.buttonLink ? (
            <a href={currentPopup.buttonLink} target="_blank" rel="noopener noreferrer" onClick={handleCTAClick}>
              <img
                src={currentPopup.image}
                alt={currentPopup.title}
                className="w-full h-auto object-cover max-h-[80vh] rounded-3xl border border-white/10"
              />
            </a>
          ) : (
            <img
              src={currentPopup.image}
              alt={currentPopup.title}
              className="w-full h-auto object-cover max-h-[80vh] rounded-3xl border border-white/10"
            />
          )}
        </div>
      </div>
    );
  }

  // RENDER STANDARD LAYOUTS: ANNOUNCEMENT, PROMOTION, NEWSLETTER, LEAD_FORM, VIDEO_POPUP
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-[500px] max-h-[90vh] overflow-y-auto bg-background border border-border-color rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col justify-between text-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground/60 hover:text-foreground transition-all flex items-center justify-center cursor-pointer outline-none"
          title="Close"
        >
          ✕
        </button>

        <div className="space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-gold-solid/10 border border-gold-solid/35">
            <span className="text-[10px] text-gold-solid">★</span>
            <span className="text-[10px] text-gold-solid font-bold uppercase tracking-wider">
              {currentPopup.popupType === "PROMOTION" ? "Special Promotion" : "Latest Update"}
            </span>
          </div>

          {/* Heading */}
          {currentPopup.heading && (
            <h3 className="text-2xl font-serif text-foreground font-medium leading-tight pt-1">
              {currentPopup.heading}
            </h3>
          )}

          {/* Subheading */}
          {currentPopup.subHeading && (
            <h4 className="text-sm font-sans text-gold-solid font-medium tracking-wide">
              {currentPopup.subHeading}
            </h4>
          )}

          {/* Video Popup type */}
          {currentPopup.popupType === "VIDEO_POPUP" && currentPopup.videoUrl && (
            <div className="w-full overflow-hidden rounded-2xl border border-white/5 bg-black aspect-video mt-2">
              {isVideo(currentPopup.videoUrl) ? (
                <video
                  src={currentPopup.videoUrl}
                  controls
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                />
              ) : (
                <iframe
                  src={currentPopup.videoUrl}
                  title={currentPopup.title}
                  className="w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          )}

          {/* Banner image for Announcements or Promotions */}
          {currentPopup.image && currentPopup.popupType !== "VIDEO_POPUP" && (
            <div className="w-full overflow-hidden rounded-2xl border border-border-color/30 mt-2">
              <img
                src={currentPopup.image}
                alt={currentPopup.heading || currentPopup.title}
                className="w-full max-h-56 object-cover"
              />
            </div>
          )}

          {/* Description Content */}
          {currentPopup.description && (
            <p className="text-sm text-foreground/75 font-light leading-relaxed whitespace-pre-line">
              {currentPopup.description}
            </p>
          )}

          {/* Newsletter Form / Lead Capture Form */}
          {(currentPopup.popupType === "NEWSLETTER" || currentPopup.popupType === "LEAD_FORM") && (
            <div className="pt-2">
              {leadSuccess ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
                  <span className="text-xl">✓</span>
                  <p className="text-sm text-emerald-400 font-semibold mt-1">Thank you for submitting!</p>
                  <p className="text-xs text-foreground/65 mt-0.5">We will get back to you shortly.</p>
                  <button
                    onClick={handleClose}
                    className="mt-3 px-4 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-300 rounded-full text-xs font-semibold uppercase tracking-wider cursor-pointer border-none transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-3">
                  {currentPopup.popupType === "LEAD_FORM" && (
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="w-full bg-card-bg border border-border-color focus:border-gold-solid outline-none rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/45 transition-colors"
                    />
                  )}
                  <input
                    type="email"
                    placeholder="Email Address (Optional)"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="w-full bg-card-bg border border-border-color focus:border-gold-solid outline-none rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/45 transition-colors"
                  />
                  {currentPopup.popupType === "LEAD_FORM" && (
                    <>
                      <input
                        type="tel"
                        maxLength={10}
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        placeholder="10-Digit Mobile Number"
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className="w-full bg-card-bg border border-border-color focus:border-gold-solid outline-none rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/45 transition-colors"
                      />
                      <textarea
                        rows={2}
                        placeholder="Your Message"
                        value={leadMessage}
                        onChange={(e) => setLeadMessage(e.target.value)}
                        className="w-full bg-card-bg border border-border-color focus:border-gold-solid outline-none rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/45 resize-none transition-colors"
                      />
                    </>
                  )}
                  {leadError && <p className="text-xs text-red-400">{leadError}</p>}
                  <button
                    type="submit"
                    disabled={submittingLead}
                    className="w-full py-2.5 rounded-xl bg-gold-solid hover:bg-gold-hover text-[#010314] text-xs font-bold uppercase tracking-widest transition-all shadow-[0_4px_20px_rgba(221,189,129,0.2)] disabled:opacity-50 cursor-pointer border-none"
                  >
                    {submittingLead ? "Submitting..." : currentPopup.buttonText || "Submit Inquiry"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Standard Dismiss / CTA buttons for announcement/promotions/video */}
          {currentPopup.popupType !== "NEWSLETTER" && currentPopup.popupType !== "LEAD_FORM" && (
            <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-border-color text-foreground/80 hover:text-foreground hover:bg-foreground/5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer bg-transparent"
              >
                Dismiss
              </button>
              {currentPopup.buttonLink && (
                <a
                  href={currentPopup.buttonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCTAClick}
                  className="w-full sm:w-auto text-center px-6 py-2.5 rounded-full bg-gold-solid hover:bg-gold-hover text-[#010314] text-xs font-bold uppercase tracking-widest transition-all shadow-[0_4px_20px_rgba(221,189,129,0.2)] hover:scale-[1.02] active:scale-[0.98] no-underline"
                >
                  {currentPopup.buttonText || "Know More"} ➔
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
