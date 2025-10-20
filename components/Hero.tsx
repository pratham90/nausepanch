import React, { useRef, useEffect } from "react";
import heroVideo from "../assets/hero.mp4";

const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.play().catch((e) =>
      console.error("Hero video autoplay was prevented:", e)
    );
  }, []);

  return (
    <section className="relative h-svh md:h-screen w-full overflow-hidden flex items-center">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/80 md:from-transparent md:via-black/30 md:to-black/70" />
      </div>

      {/* Foreground */}
      <div className="relative z-10 flex flex-col justify-between h-full w-full px-4 sm:px-8 lg:px-14 pt-20 pb-24 md:pt-24 md:pb-20">
        {/* Heading */}
        <div className="text-left mt-auto">
          <h1 className="font-serif font-thin text-cream tracking-tight">
            <span className="block leading-[0.95] text-[clamp(2rem,9vw,8.5rem)]">
              Feel good fats
            </span>
            <span className="block leading-[0.95] text-[clamp(2rem,9vw,8.5rem)]">
              from scratch
            </span>
          </h1>
        </div>

        {/* CTA: flow on mobile (no overlap), absolute on md+ */}
        <div
          className={[
            "flex flex-col gap-4 sm:gap-5 md:gap-6",
            "mt-6 items-center text-center", // mobile/tablet default
            "md:mt-0 md:absolute md:bottom-20 md:right-[8%] md:items-end md:text-right", // desktop behavior
          ].join(" ")}
        >
          <p className="text-cream/80 text-base sm:text-lg md:text-2xl leading-snug max-w-xs md:max-w-sm">
            Pure, versatile, <br className="hidden sm:block" /> sustainably-made fats
          </p>
          <button className="bg-cream text-brown font-medium text-base sm:text-lg md:text-xl py-2.5 sm:py-3 px-8 sm:px-12 rounded-md shadow-md hover:opacity-95 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-cream/60">
            <span className="group-hover:tracking-tight transition-all duration-300">Watch</span>
            <span className="mx-1 group-hover:opacity-0 transition-all duration-200">—</span>
            <span className="group-hover:ml-1 transition-all duration-300">Episode</span>
          </button>
        </div>

        {/* Scroll Icon */}
        <a
          href="#process"
          aria-label="Scroll to next section"
          className="absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/80 hover:text-cream transition-colors group z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 animate-bounce-slow">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
          <span className="text-[10px] md:text-xs tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity">
            Our Process
          </span>
        </a>
      </div>
    </section>
  );
};

export default Hero;
