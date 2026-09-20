"use client";

import { useEffect, useRef } from "react";
import lottie from "lottie-web";

export default function HeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/hero-animation.json",
    });

    return () => {
      anim.destroy();
    };
  }, []);

  return (
    <div className="relative w-80 h-80 sm:w-100 sm:h-100 md:w-120 md:h-120 lg:w-130 lg:h-130 flex items-center justify-center pointer-events-none select-none shrink-0">
      {/* Soft Ambient Brand Glow Behind Animation */}
      <div className="absolute inset-2 bg-[#6395ee]/25 rounded-full blur-3xl" />
      <div ref={containerRef} className="w-full h-full relative z-10 drop-shadow-2xl" />
    </div>
  );
}
