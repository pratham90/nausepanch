import React, { useRef, useEffect } from "react";
import heroVideo from "../assets/hero.mp4";

const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .catch((error) =>
          console.error("Hero video autoplay was prevented:", error)
        );
    }
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center">
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70"></div>
      </div>

      {/* Foreground */}
      <div className="relative z-10 flex flex-col justify-between h-full w-full px-6 sm:px-10 lg:px-14 py-20">
        {/* Heading */}
        <div className="text-left mt-auto">
<h1 className="font-serif font-thin text-cream leading-none tracking-tight">
  <span className="block text-[3.8rem] sm:text-[5rem] md:text-[6.2rem] lg:text-[7.5rem] xl:text-[8.5rem]">
    Feel good fats
  </span>
  <span className="block text-[3.8rem] sm:text-[5rem] md:text-[6.2rem] lg:text-[7.5rem] xl:text-[8.5rem]">
    from scratch
  </span>
</h1>

        </div>

        {/* Bottom Content — slightly left-shifted */}
        <div className="absolute bottom-20 right-[8%] flex flex-col items-end gap-6 text-right md:right-[12%]">
          <p className="text-cream/80 text-lg sm:text-xl md:text-2xl leading-snug max-w-xs md:max-w-sm text-left">
            Pure, versatile, <br /> sustainably-made fats
          </p>
          <button className="bg-cream text-brown font-medium text-lg md:text-xl py-3 px-12 rounded-md shadow-md hover:opacity-95 transition-all duration-300 group">
            <span className="group-hover:tracking-tight transition-all duration-300">
              Watch
            </span>
            <span className="mx-1 group-hover:opacity-0 transition-all duration-200">
              —
            </span>
            <span className="group-hover:ml-1 transition-all duration-300">
              Episode
            </span>
          </button>
        </div>

        {/* Scroll Icon */}
        <a
          href="#process"
          aria-label="Scroll to next section"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/80 hover:text-cream transition-colors group z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 animate-bounce-slow"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
          <span className="text-xs tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity">
            Our Process
          </span>
        </a>
      </div>
    </section>
  );
};

export default Hero;
