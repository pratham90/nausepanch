"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function TrainNudgeScroll() {
  const IMAGES = [
    "/1.jpg",
    "/2.jpg",
    "/3.jpg",
    "/4.jpg",
    "/1.jpg",
    "/2.jpg",
    "/3.jpg",
    "/4.jpg",
    "/1.jpg", // 9th  (index 8)
    "/2.jpg", // 10th (index 9)
    "/3.jpg", // 11th (index 10)
  ];

  // text → words
  const line1Words = useMemo(() => "Real fats,".split(" "), []);
  const line2Words = useMemo(() => "real flavor.".split(" "), []);
  const paraWords = useMemo(() => "All our old favorites, just made a different way.".split(" "), []);

  // refs
  const topRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const l1Ref = useRef<HTMLDivElement>(null);
  const l2Ref = useRef<HTMLDivElement>(null);
  const pRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  // curtain refs
  const curtainRef = useRef<HTMLDivElement>(null);
  const curtainImgRef = useRef<HTMLImageElement>(null);
  const curtainTxtRef = useRef<HTMLDivElement>(null);

  // sizes for the top sequence
  const WRAP_W = "min(12vw, 160px)";
  const WRAP_H = "min(31.5vw, 385px)";

  // ➜ Larger stepped sizes for last 3 (tight stack, no visible gap)
  const LAST_SIZES = ["32vh", "28vh", "24vh"] as const; // 9th > 10th > 11th

  // nudge / width scrub
  const TOP_DELTA = 32,
    TOP_FROM_X = 0.92,
    TOP_TO_X = 1.08;
  const LAST_DELTA = 28,
    LAST_FROM_X = 0.94,
    LAST_TO_X = 1.06;

  const baseImgScaleX = (i: number) => {
    if (i <= 3) return 1.0;
    const f = 1 - Math.min((i - 3) * 0.012, 0.06);
    return Number(f.toFixed(3));
  };

  const getSDirection = (i: number) => {
    if (i < 3) return 1;
    if (i < 8) return -1;
    return 1;
  };

  useEffect(() => {
    const applyNudge = (
      nodes: Element[] | NodeListOf<Element>,
      opts: {
        delta: number;
        start: string;
        end: string;
        fromScaleX: number;
        toScaleX: number;
        dirOverride?: 1 | -1;
        indexOffset?: number;
        progressToward?: "left" | "right";
      },
    ) => {
      const { delta, start, end, fromScaleX, toScaleX, dirOverride, indexOffset = 0, progressToward = "left" } = opts;

      gsap.utils.toArray<HTMLDivElement>(nodes).forEach((wrapper, i) => {
        const img = wrapper.querySelector("img") as HTMLImageElement;
        if (!img) return;

        const gi = i + indexOffset;
        const dir = dirOverride ?? getSDirection(gi);
        const bx = baseImgScaleX(gi);

        const fromWidth = 100 * fromScaleX * bx;
        const toWidth = 100 * toScaleX * bx;

        const startXP = (progressToward === "right" ? -dir : dir) * delta;
        const endXP = (progressToward === "right" ? dir : -dir) * delta;

        gsap.set(wrapper, {
          xPercent: startXP,
          width: `${fromWidth}%`,
          willChange: "transform, width",
        });
        gsap.to(wrapper, {
          xPercent: endXP,
          width: `${toWidth}%`,
          ease: "none",
          scrollTrigger: { trigger: wrapper, start, end, scrub: true },
        });
      });
    };

    // top 8
    if (topRef.current) {
      applyNudge(topRef.current.querySelectorAll("[data-nudge-wrapper]"), {
        delta: TOP_DELTA,
        start: "top 80%",
        end: "bottom 20%",
        fromScaleX: TOP_FROM_X,
        toScaleX: TOP_TO_X,
        indexOffset: 0,
      });
    }

    // last 3
    if (finalRef.current) {
      applyNudge(finalRef.current.querySelectorAll("[data-nudge-final-wrapper]"), {
        delta: LAST_DELTA,
        start: "top 80%",
        end: "bottom 10%",
        fromScaleX: LAST_FROM_X,
        toScaleX: LAST_TO_X,
        dirOverride: 1,
        indexOffset: 8,
        progressToward: "right",
      });
    }

    // right content
    if (contentRef.current) {
      const popWords = (container: HTMLElement | null, delay = 0) => {
        if (!container) return;
        const words = container.querySelectorAll<HTMLElement>("[data-word]");
        gsap.set(words, { opacity: 0, scale: 0.85, y: 18 });
        gsap.to(words, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.8)",
          stagger: 0.06,
          delay,
          scrollTrigger: { trigger: contentRef.current!, start: "top 76%", toggleActions: "play none none reverse" },
        });
      };
      popWords(l1Ref.current);
      popWords(l2Ref.current, 0.08);

      const pWords = pRef.current?.querySelectorAll<HTMLElement>("[data-word]");
      if (pWords) {
        gsap.set(pWords, { opacity: 0, scale: 0.85, y: 14 });
        gsap.to(pWords, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.44,
          ease: "back.out(1.7)",
          stagger: 0.045,
          delay: 0.14,
          scrollTrigger: { trigger: contentRef.current!, start: "top 76%", toggleActions: "play none none reverse" },
        });
      }

      if (ctaRef.current) {
        gsap.set(ctaRef.current, { opacity: 0, scale: 0.9, y: 10 });
        gsap.to(ctaRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(2)",
          delay: 0.22,
          scrollTrigger: { trigger: contentRef.current!, start: "top 76%", toggleActions: "play none none reverse" },
        });
      }
    }

    // curtain timeline (smooth in → hold → out)
    if (curtainRef.current && curtainImgRef.current && curtainTxtRef.current) {
      const img = curtainImgRef.current;
      const txt = curtainTxtRef.current;
      const words = txt.querySelectorAll<HTMLElement>("[data-word]");

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: curtainRef.current,
          start: "top 85%",
          end: "bottom 10%",
          scrub: true,
        },
      });

      gsap.set(img, { yPercent: -100, scale: 1.06, willChange: "transform" });
      gsap.set(words, { opacity: 0, y: 30, willChange: "transform, opacity" });

      tl.to(img, { yPercent: 0, scale: 1, ease: "power3.out", duration: 0.6 }, 0);
      tl.to(
        words,
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          duration: 0.45,
          ease: "power2.out",
        },
        0.1,
      );
      tl.to(
        words,
        {
          opacity: 0,
          y: 60,
          stagger: 0.04,
          duration: 0.6,
          ease: "power2.inOut",
        },
        0.62,
      );
    }
  }, []);

  return (
    <div className="bg-[#fbf2e2] overflow-hidden">
      {/* ===== TOP 8 ===== */}
      <section ref={topRef} className="mx-auto max-w-[800px] px-4 leading-none">
        {IMAGES.slice(0, 8).map((src, i) => (
          <figure
            key={i}
            data-nudge-wrapper
            className="relative mx-auto"
            style={{
              width: WRAP_W,
              height: WRAP_H,
              margin: "0 auto",
              overflow: "hidden",
              maxWidth: "calc(100vw - 40px)",
            }}
          >
            <img
              src={src || "/placeholder.svg"}
              alt={`img-${i}`}
              className="block w-full h-full object-cover rounded-[10px] shadow-[0_14px_40px_rgba(0,0,0,0.18)]"
              draggable={false}
            />
          </figure>
        ))}
      </section>

      {/* ===== LAST 3 + RIGHT CONTENT ===== */}
      <section
        ref={finalRef}
        className="relative mx-auto max-w-[1400px] px-4 pt-0 pb-[18vh] min-h-[90vh] leading-none -mt-[1px]"
      >
        {/* Tight vertical stack, bigger sizes, controlled overlap (no visible gaps) */}
        <div className="flex flex-col w-[45%] max-w-[520px] relative">
          {IMAGES.slice(-3).map((src, i) => {
            // i = 0 → biggest (9th), then smaller
            const translateXvw = [7, 3, -1][i];
            const mt = i === 0 ? "0" : "-3.2vh"; // tight stack, minimal visible gap
            const z = [3, 2, 1][i];
            const size = LAST_SIZES[i];

            return (
              <div
                key={i}
                data-nudge-final-wrapper
                style={{
                  width: size,
                  height: size,
                  transform: `translateX(${translateXvw}vw)`,
                  marginTop: mt,
                  overflow: "hidden",
                  position: "relative",
                  zIndex: z,
                  borderRadius: "12px",
                  boxShadow: "0 16px 45px rgba(0,0,0,0.18)",
                }}
              >
                <img
                  src={src || "/placeholder.svg"}
                  alt={`final-${i}`}
                  className="block w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>

        <aside
          ref={contentRef}
          className="absolute right-[4vw] top-1/2 -translate-y-1/2 w-[32%] max-w-[520px] select-none"
        >
          <h2 className="font-serif text-[#3b1510] text-[6rem] leading-[1.06]">
            <div ref={l1Ref} className="flex flex-wrap gap-x-[0.5rem]">
              {line1Words.map((w, i) => (
                <span key={`l1-${i}`} data-word>
                  {w}
                </span>
              ))}
            </div>
            <div ref={l2Ref} className="flex flex-wrap gap-x-[0.5rem]">
              {line2Words.map((w, i) => (
                <span key={`l2-${i}`} data-word>
                  {w}
                </span>
              ))}
            </div>
          </h2>

          <div ref={pRef} className="mt-6 text-[#6a4a3a] text-lg flex flex-wrap gap-x-[0.5rem]">
            {paraWords.map((w, i) => (
              <span key={`p-${i}`} data-word>
                {w}
              </span>
            ))}
          </div>

          <button
            ref={ctaRef}
            className="mt-8 inline-flex items-center gap-2 border border-[#3b1510] px-6 py-3 rounded-md text-[#3b1510] hover:bg-[#3b1510] hover:text-[#fbf2e2] transition"
          >
            Our — Foods
          </button>
        </aside>
      </section>

      {/* ===== CURTAIN ===== */}
      <section ref={curtainRef} className="relative h-screen w-full overflow-hidden bg-[#fbf2e2]">
        <img ref={curtainImgRef} src="/1.jpg" alt="hero" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div
          ref={curtainTxtRef}
          className="relative z-10 h-full flex items-end md:items-center pl-[6vw] pb-[7vh] md:pb-0"
        >
          <div className="font-serif text-[#f4f0ea] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] leading-[0.95]">
            <div className="text-[12vw] md:text-[8rem]">
              {"The future".split(" ").map((w, i) => (
                <span key={`tf-${i}`} data-word className="inline-block mr-3">
                  {w}
                </span>
              ))}
            </div>
            <div className="text-[12vw] md:text-[8rem]">
              {"tastes delicious".split(" ").map((w, i) => (
                <span key={`td-${i}`} data-word className="inline-block mr-3">
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
