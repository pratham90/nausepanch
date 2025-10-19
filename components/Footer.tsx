"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/* ---------------- SavorWordReveal ----------------
   - Triggers when heading enters the viewport.
   - Staggers letters with easing, opacity, and subtle lift.
   - Respects prefers-reduced-motion (no animation).
--------------------------------------------------- */

type SavorWordRevealProps = {
  text: string;
  /** milliseconds for the full word to complete revealing */
  durationMs?: number;
  /** per-letter delay in ms (stagger) */
  perCharDelayMs?: number;
  /** optional once-only trigger (default: true) */
  once?: boolean;
  /** threshold for intersection (0..1) */
  threshold?: number;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const SavorWordReveal: React.FC<SavorWordRevealProps> = ({
  text,
  durationMs = 900,
  perCharDelayMs = 45,
  once = true,
  threshold = 0.25,
}) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const chars = useMemo(() => text.split(""), [text]);
  const totalChars = chars.length;

  // Precompute each char's delay (so re-renders don't change the timeline)
  const delays = useMemo(() => {
    const arr = new Array(totalChars).fill(0).map((_, i) => i * perCharDelayMs);
    return arr;
  }, [totalChars, perCharDelayMs]);

  // The animated state for each char (opacity + y)
  const [charStates, setCharStates] = useState(
    () =>
      new Array(totalChars).fill(0).map(() => ({
        o: reducedMotion ? 1 : 0,
        y: reducedMotion ? 0 : 10, // slight lift
        b: reducedMotion ? 0 : 6, // blur in px
      }))
  );

  // Reset when text changes
  useEffect(() => {
    setCharStates(
      new Array(totalChars).fill(0).map(() => ({
        o: reducedMotion ? 1 : 0,
        y: reducedMotion ? 0 : 10,
        b: reducedMotion ? 0 : 6,
      }))
    );
    setIsAnimating(false);
    setHasPlayed(false);
    startTimeRef.current = null;
  }, [text, totalChars, reducedMotion]);

  // IntersectionObserver to start the animation
  useEffect(() => {
    if (reducedMotion) return;

    const el = headingRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (once && hasPlayed) return;
            // kick off animation
            setIsAnimating(true);
            if (once) setHasPlayed(true);
            break;
          } else if (!once) {
            // allow replay if not once
            setIsAnimating(false);
            startTimeRef.current = null;
          }
        }
      },
      {
        root: null,
        threshold,
      }
    );

    io.observe(el);
    return () => {
      io.disconnect();
    };
  }, [once, threshold, hasPlayed, reducedMotion]);

  // RAF-driven animation loop
  useEffect(() => {
    if (reducedMotion) return;
    if (!isAnimating) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const totalDuration = durationMs + delays[delays.length - 1]; // include trailing delay

    const tick = (t: number) => {
      if (startTimeRef.current == null) startTimeRef.current = t;
      const elapsed = t - startTimeRef.current;

      // Update each character based on its local progress
      setCharStates((prev) =>
        prev.map((state, i) => {
          const local = clamp01((elapsed - delays[i]) / durationMs);
          const e = easeOutCubic(local);
          return {
            o: e, // opacity
            y: (1 - e) * 10, // translateY from 10px → 0
            b: (1 - e) * 6, // blur from 6px → 0
          };
        })
      );

      if (elapsed < totalDuration) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // ensure we end at final state
        setCharStates((prev) =>
          prev.map(() => ({ o: 1, y: 0, b: 0 }))
        );
        rafRef.current = null;
        setIsAnimating(false);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [isAnimating, delays, durationMs, reducedMotion]);

  return (
    <h1
      ref={headingRef}
      aria-label={text}
      className="font-serif text-[35vw] md:text-[30vw] lg:text-[26vw] leading-none text-brand-brown select-none flex justify-center"
      style={{
        transform: "scaleY(1.6)",
        filter: "none",
      }}
    >
      {chars.map((char, i) => {
        const s = charStates[i] ?? { o: 1, y: 0, b: 0 };
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: s.o,
              transform: `translateY(${s.y}px)`,
              filter: `blur(${s.b}px)`,
              willChange: "opacity, transform, filter",
              transition: reducedMotion ? "none" : undefined,
            }}
          >
            {char}
          </span>
        );
      })}
    </h1>
  );
};

/* ---------------- Footer ---------------- */

const Footer: React.FC = () => {
  const navLinks1 = ["Home", "Process", "Foods", "Mission", "Journal", "Contact"];
  const navLinks2 = ["LinkedIn", "Instagram"];
  const legalLinks = ["Press Kit", "Terms of Service", "Privacy Policy"];

  return (
    <footer className="bg-cream text-brand-brown pt-20 md:pt-32 pb-10 overflow-hidden">
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start text-sm mb-24 md:mb-32">
          <div className="flex gap-x-12 sm:gap-x-20">
            <ul className="space-y-3">
              {navLinks1.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:opacity-70 transition-opacity">
                    <span className="link-underline">{link}</span>
                  </a>
                </li>
              ))}
            </ul>
            <ul className="space-y-3">
              {navLinks2.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:opacity-70 transition-opacity">
                    <span className="link-underline">{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 md:mt-0 md:text-left max-w-xs">
            <p className="font-serif text-lg leading-snug">
              Hungry for more? Join our newsletter and be the first to know where and when to find us.
            </p>
            <button className="mt-6 bg-brand-brown text-cream px-8 py-3 rounded-full text-sm font-medium hover:bg-opacity-90 transition-colors">
              Join — now
            </button>
          </div>
        </div>

        <div className="relative text-center w-full my-16 md:my-24">
          {/* Adjust perCharDelayMs/durationMs to taste */}
          <SavorWordReveal text="savor" perCharDelayMs={55} durationMs={850} />
        </div>

        <div className="mt-12 md:mt-16 border-t border-brand-brown/20 pt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-brand-brown-light/80">
          <div className="flex flex-wrap gap-x-4 justify-center md:justify-start">
            {legalLinks.map((link) => (
              <a key={link} href="#" className="hover:text-brand-brown">
                <span className="link-underline">{link}</span>
              </a>
            ))}
          </div>
          <div className="text-center">
            <a href="mailto:hello@savor.it" className="hover:text-brand-brown">
              <span className="link-underline">hello@savor.it</span>
            </a>
          </div>
          <p className="text-center md:text-right">©Savor {new Date().getFullYear()}.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
