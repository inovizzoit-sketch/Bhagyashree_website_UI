"use client";

import React from "react";

export default function LocationMapSection() {
  return (
    <section className="w-full relative overflow-hidden font-sans">
      <div className="w-full h-[400px] sm:h-[500px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3612.2905943566298!2d82.55798177516111!3d25.125864577756943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398feb5644b65f1b%3A0x7a474bec0b37de9f!2sGandhi%20Ghat%2C%20Bathua!5e0!3m2!1sen!2sin!4v1788002082281!5m2!1sen!2sin"
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Bhagyashree Real Estate Location - Gandhi Ghat, Bathua"
        />
      </div>
    </section>
  );
}
