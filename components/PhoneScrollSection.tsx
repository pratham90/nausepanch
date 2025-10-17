"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function TrainNudgeScroll() {
  const IMAGES = [
    "/1.jpg","/2.jpg","/3.jpg","/4.jpg",
    "/1.jpg","/2.jpg","/3.jpg","/4.jpg",
    "/1.jpg","/2.jpg","/3.jpg",
  ];

  // content text → words
  const line1Words = useMemo(() => "Real fats,".split(" "), []);
  const line2Words = useMemo(() => "real flavor.".split(" "), []);
  const paraWords  = useMemo(
    () => "All our old favorites, just made a different way.".split(" "),
    []
  );

  // refs (existing sections)
  const topRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const l1Ref = useRef<HTMLDivElement>(null);
  const l2Ref = useRef<HTMLDivElement>(null);
  const pRef  = useRef<HTMLDivElement>(null);
  const ctaRef= useRef<HTMLButtonElement>(null);

  // CURTAIN refs (image behind, section itself bg = page color)
  const curtainRef     = useRef<HTMLDivElement>(null);   // whole section
  const curtainImgRef  = useRef<HTMLImageElement>(null); // bg image that slides in
  const curtainTxtRef  = useRef<HTMLDivElement>(null);   // text block

  // sizes
  const WRAP_W = "min(72vw, 880px)";
  const WRAP_H = "52.5vh";
  const LAST_SIZE = "34vh";

  // nudge / zoom (width-only)
  const TOP_DELTA = 12, TOP_FROM_X = 1.12, TOP_TO_X = 0.90;
  const LAST_DELTA = 14, LAST_FROM_X = 1.10, LAST_TO_X = 0.92;

  const baseImgScaleX = (i: number) => {
    if (i <= 3) return 1.0;
    const f = 1 - Math.min((i - 3) * 0.012, 0.06);
    return Number(f.toFixed(3));
  };

  useEffect(() => {
    const applyNudge = (
      nodes: Element[] | NodeListOf<Element>,
      opts: { delta: number; start: string; end: string; fromScaleX: number; toScaleX: number }
    ) => {
      const { delta, start, end, fromScaleX, toScaleX } = opts;
      gsap.utils.toArray<HTMLImageElement>(nodes).forEach((img, i) => {
        const dir = i % 2 === 0 ? -1 : 1;
        gsap.set(img, {
          xPercent: dir * delta,
          scaleX: fromScaleX,
          scaleY: 1,
          willChange: "transform",
          transformOrigin: i % 2 === 0 ? "left center" : "right center",
        });
        gsap.to(img, {
          xPercent: -dir * delta,
          scaleX: toScaleX,
          ease: "none",
          scrollTrigger: { trigger: img, start, end, scrub: true },
        });
      });
    };

    // image sequences
    if (topRef.current) {
      applyNudge(topRef.current.querySelectorAll("img[data-nudge]"), {
        delta: TOP_DELTA, start: "top 80%", end: "bottom 20%", fromScaleX: TOP_FROM_X, toScaleX: TOP_TO_X,
      });
    }
    if (finalRef.current) {
      applyNudge(finalRef.current.querySelectorAll("img[data-nudge-final]"), {
        delta: LAST_DELTA, start: "top 90%", end: "bottom 10%", fromScaleX: LAST_FROM_X, toScaleX: LAST_TO_X,
      });
    }

    // right content (smooth pops)
    if (contentRef.current) {
      const popWords = (container: HTMLElement | null, delay = 0) => {
        if (!container) return;
        const words = container.querySelectorAll<HTMLElement>("[data-word]");
        gsap.set(words, { opacity: 0, scale: 0.85, y: 18 });
        gsap.to(words, {
          opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.8)", stagger: 0.06, delay,
          scrollTrigger: { trigger: contentRef.current!, start: "top 76%", toggleActions: "play none none reverse" },
        });
      };
      popWords(l1Ref.current);
      popWords(l2Ref.current, 0.08);

      const pWords = pRef.current?.querySelectorAll<HTMLElement>("[data-word]");
      if (pWords) {
        gsap.set(pWords, { opacity: 0, scale: 0.85, y: 14 });
        gsap.to(pWords, {
          opacity: 1, scale: 1, y: 0, duration: 0.44, ease: "back.out(1.7)", stagger: 0.045, delay: 0.14,
          scrollTrigger: { trigger: contentRef.current!, start: "top 76%", toggleActions: "play none none reverse" },
        });
      }

      if (ctaRef.current) {
        gsap.set(ctaRef.current, { opacity: 0, scale: 0.9, y: 10 });
        gsap.to(ctaRef.current, {
          opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(2)", delay: 0.22,
          scrollTrigger: { trigger: contentRef.current!, start: "top 76%", toggleActions: "play none none reverse" },
        });
      }
    }

    // ============ CURTAIN SECTION (no overlay; image slides in) ============
    if (curtainRef.current && curtainImgRef.current && curtainTxtRef.current) {
      const img = curtainImgRef.current;
      const txt = curtainTxtRef.current;

      // image starts fully above the section; then slides down behind the text
      gsap.set(img, { yPercent: -100, scale: 1.06, willChange: "transform" }); // slight zoom for luxe feel
      gsap.to(img, {
        yPercent: 0,
        scale: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: curtainRef.current,
          start: "top 85%",
          end: "bottom 20%",
          scrub: 1, // tied to scroll = true curtain feel
        },
      });

      // text pops when content comes into view (always on top)
      const words = txt.querySelectorAll<HTMLElement>("[data-word]");
      gsap.set(words, { opacity: 0, scale: 0.9, y: 16 });
      gsap.to(words, {
        opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(1.9)", stagger: 0.07,
        scrollTrigger: {
          trigger: curtainRef.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });
    }
  }, []);

  return (
    <div className="bg-[#fbf2e2] overflow-hidden">
      {/* ===== TOP 8 ===== */}
      <section ref={topRef} className="mx-auto max-w-[1200px] px-4 leading-none">
        {IMAGES.slice(0, 8).map((src, i) => (
          <figure
            key={i}
            className={`relative mx-auto ${i % 2 === 0 ? "ml-[8vw]" : "mr-[8vw]"}`}
            style={{ width: `calc(${WRAP_W})`, height: WRAP_H, margin: 0, overflow: "hidden" }}
          >
            <img
              data-nudge
              src={src}
              alt={`img-${i}`}
              className="block w-full h-full object-cover rounded-[10px] shadow-[0_14px_40px_rgba(0,0,0,0.18)]"
              style={{ transform: `scaleX(${baseImgScaleX(i)})` }}
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
        <div className="grid grid-rows-3 gap-0 w-[60%]">
          {IMAGES.slice(-3).map((src, i) => {
            const scatter = i === 0 ? "translateX(-4vw)" : i === 1 ? "translateX(3vw)" : "translateX(6vw)";
            return (
              <div key={i} style={{ width: LAST_SIZE, height: LAST_SIZE, transform: scatter, overflow: "hidden" }}>
                <img
                  data-nudge-final
                  src={src}
                  alt={`final-${i}`}
                  className="block w-full h-full object-cover rounded-[10px] shadow-[0_12px_32px_rgba(0,0,0,0.16)]"
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
              {line1Words.map((w, i) => <span key={`l1-${i}`} data-word>{w}</span>)}
            </div>
            <div ref={l2Ref} className="flex flex-wrap gap-x-[0.5rem]">
              {line2Words.map((w, i) => <span key={`l2-${i}`} data-word>{w}</span>)}
            </div>
          </h2>

          <div ref={pRef} className="mt-6 text-[#6a4a3a] text-lg flex flex-wrap gap-x-[0.5rem]">
            {paraWords.map((w, i) => <span key={`p-${i}`} data-word>{w}</span>)}
          </div>

          <button
            ref={ctaRef}
            className="mt-8 inline-flex items-center gap-2 border border-[#3b1510] px-6 py-3 rounded-md text-[#3b1510] hover:bg-[#3b1510] hover:text-[#fbf2e2] transition"
          >
            Our — Foods
          </button>
        </aside>
      </section>

      {/* ===== CURTAIN SECTION (image behind; section bg = page color) ===== */}
      <section
        ref={curtainRef}
        className="relative h-screen w-full overflow-hidden bg-[#fbf2e2]"
      >
        {/* image BEHIND — slides down from top (no overlay used) */}
        <img
          ref={curtainImgRef}
          src="/1.jpg"
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* text ABOVE image; always visible; add subtle shadow for readability */}
        <div
          ref={curtainTxtRef}
          className="relative z-10 h-full flex items-end md:items-center pl-[6vw] pb-[7vh] md:pb-0"
        >
          <div className="font-serif text-[#f4f0ea] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] leading-[0.95]">
            <div className="text-[12vw] md:text-[8rem]">
              {"The future".split(" ").map((w, i) => (
                <span key={`tf-${i}`} data-word className="inline-block mr-3">{w}</span>
              ))}
            </div>
            <div className="text-[12vw] md:text-[8rem]">
              {"tastes delicious".split(" ").map((w, i) => (
                <span key={`td-${i}`} data-word className="inline-block mr-3">{w}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
