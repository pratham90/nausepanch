"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/* ----------------- Helpers ----------------- */
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ----------------- Ink Animation ----------------- */
const SavorInkStaggerTimed: React.FC<{
  word?: string;
  replayOnReenter?: boolean;
  threshold?: number;
  totalMs?: number;
  perCharDelayMs?: number;
  edgeScale?: number;
  fontPx?: number;
  trackingEm?: number;
}> = ({
  word = "savor",
  replayOnReenter = true,
  threshold = 0.5,
  totalMs = 4800,       // 🕰️ 4× slower (1200 → 4800)
  perCharDelayMs = 480, // 🕰️ 4× slower (120 → 480)
  edgeScale = 28,
  fontPx = 370,
  trackingEm = -0.045,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);

  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const letters = useMemo(() => word.split(""), [word]);
  const n = letters.length;

  // layout
  const vw = 1400;
  const vh = 380;
  const letterBox = 200;
  const totalW = letterBox * n;
  const startX = (vw - totalW) / 2 + letterBox / 2;
  const baseY = vh * 0.57;
  const scaleY = 1.26;
  const translateFix = -(baseY) * (scaleY - 1);
  const rMax = 820;

  const [radii, setRadii] = useState<number[]>(() => Array(n).fill(0));

  useEffect(() => {
    setRadii(Array(n).fill(reduced ? rMax : 0));
    setPlaying(false);
    startRef.current = null;
    setHasPlayedOnce(false);
  }, [word, n, reduced]);

  // Intersection trigger
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= threshold) {
            if (!replayOnReenter && hasPlayedOnce) return;
            setPlaying(true);
            setHasPlayedOnce(true);
          } else if (replayOnReenter) {
            setPlaying(false);
            startRef.current = null;
            setRadii(Array(n).fill(0));
          }
        }
      },
      { threshold: [0, threshold, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, replayOnReenter, hasPlayedOnce, n, reduced]);

  // Animation (time-based)
  useEffect(() => {
    if (reduced) {
      setRadii(Array(n).fill(rMax));
      return;
    }
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }

    const perLetterSpan = totalMs - perCharDelayMs * (n - 1);

    const tick = (t: number) => {
      if (startRef.current == null) startRef.current = t;
      const elapsed = t - startRef.current;

      setRadii(() =>
        Array.from({ length: n }, (_, i) => {
          const localStart = i * perCharDelayMs;
          const localT = clamp01((elapsed - localStart) / perLetterSpan);
          const e = easeOutCubic(localT);
          return lerp(0, rMax, e);
        })
      );

      if (elapsed < totalMs) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setRadii(Array(n).fill(rMax));
        rafRef.current = null;
        setPlaying(false);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [playing, totalMs, perCharDelayMs, n, reduced]);

  return (
    <div ref={wrapRef} className="w-full">
      <svg
        className="block w-full"
        viewBox={`0 0 ${vw} ${vh}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={word}
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id="inkDistort" x="-200%" y="-200%" width="500%" height="500%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="9" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={edgeScale} xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="2.1" />
          </filter>
          <filter id="inkBleed" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="0.35" result="blur" />
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="turb" />
            <feDisplacementMap in="blur" in2="turb" scale="1.6" xChannelSelector="R" yChannelSelector="G" result="distort" />
            <feMerge><feMergeNode in="distort" /></feMerge>
          </filter>
        </defs>

        {letters.map((ch, i) => {
          const cx = startX + i * letterBox;
          const r = radii[i] ?? 0;
          const maskId = `mask-${i}`;
          return (
            <g key={`g-${i}`}>
              <mask id={maskId}>
                <rect width={vw} height={vh} fill="black" />
                <g filter="url(#inkDistort)">
                  <circle cx={cx} cy={baseY} r={r} fill="white" />
                  <circle cx={cx + 14} cy={baseY - 10} r={r * 0.05} fill="white" opacity="0.35" />
                  <circle cx={cx - 16} cy={baseY + 12} r={r * 0.06} fill="white" opacity="0.25" />
                </g>
              </mask>
              <text
                x={cx}
                y={baseY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-serif"
                transform={`scale(1,${scaleY}) translate(0, ${translateFix})`}
                style={{ fontSize: `${fontPx}px`, letterSpacing: `${trackingEm}em` }}
                fill="currentColor"
                mask={`url(#${maskId})`}
                filter="url(#inkBleed)"
              >
                {ch}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/* ----------------- Footer ----------------- */
const Footer: React.FC = () => {
  const navLinks1 = ["Home", "Process", "Foods", "Mission", "Journal", "Contact"];
  const navLinks2 = ["LinkedIn", "Instagram"];
  const legalLinks = ["Press Kit", "Terms of Service", "Privacy Policy"];

  return (
    <footer className="bg-cream text-brand-brown pt-16 md:pt-20 pb-10 overflow-hidden">
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start text-sm mb-16 md:mb-20">
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

        {/* Centerpiece */}
        <div className="relative text-center w-full my-8 md:my-12 text-brand-brown">
          <SavorInkStaggerTimed
            replayOnReenter={true}
            threshold={0.5}
            totalMs={4800}       // ⏳ ultra slow 4×
            perCharDelayMs={480} // ⏳ ultra smooth stagger
            edgeScale={28}
            fontPx={370}
            trackingEm={-0.045}
          />
        </div>

        <div className="mt-8 md:mt-10 border-t border-brand-brown/20 pt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-brand-brown-light/80">
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
