"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Scenes: butter → palm/process → lab → brown → green
const SCENES = [
  "https://cdn.sanity.io/images/jqzja4ip/production/70220126d3e8ae121147f08fd052458931deaaa6-2880x1620.png?w=2000&fm=webp&q=80",
  "https://cdn.sanity.io/images/jqzja4ip/production/ea59fbc6723a6ef8ed349a1aadae9117932e99e6-2880x1620.png?w=2000&fm=webp&q=80",
  "https://cdn.sanity.io/images/jqzja4ip/production/6b33388bdee3545b7ef4c28d6b95020c440778a6-2880x1620.png?w=2000&fm=webp&q=80",
  "https://cdn.sanity.io/images/jqzja4ip/production/ef32f0b92471e9878d3e6a214ff100175d873c06-2880x1620.png?w=2000&fm=webp&q=80",
  "https://cdn.sanity.io/images/jqzja4ip/production/a3edb67c6d72ec6afd5c610b58d92aa9d4dca0ba-1440x810.png?w=2000&fm=webp&q=80",
];

export default function StoryCanvas() {
  const root = useRef<HTMLDivElement | null>(null);
  const pin = useRef<HTMLDivElement | null>(null);

  // initial curved reveal
  const clipRect = useRef<SVGRectElement | null>(null);
  const clipEllipse = useRef<SVGEllipseElement | null>(null);

  const underlayRef = useRef<HTMLDivElement | null>(null);

  // scenes
  const layers = useRef<HTMLDivElement[]>([]);
  layers.current = [];
  const setLayer = (el: HTMLDivElement | null) => {
    if (el && !layers.current.includes(el)) layers.current.push(el);
  };

  // Group 1
  const g1 = useRef<HTMLDivElement | null>(null);
  const fromRef = useRef<HTMLDivElement | null>(null);
  const palmRef = useRef<HTMLDivElement | null>(null);
  const craftRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<SVGPathElement | null>(null);
  const arcRef = useRef<SVGPathElement | null>(null);

  // Group 2
  const g2 = useRef<HTMLDivElement | null>(null);
  const wLinesRef = useRef<HTMLDivElement | null>(null);

  // Group 3 (finale)
  const futureRef = useRef<HTMLDivElement | null>(null);
  const moreStackRef = useRef<HTMLDivElement | null>(null);
  const ampCellRef = useRef<HTMLSpanElement | null>(null);
  const moreLastRef = useRef<HTMLSpanElement | null>(null);
  const dashedRef = useRef<SVGPathElement | null>(null);
  const tailRef = useRef<HTMLDivElement | null>(null);

  // Outro (post Group 3)
  const outroRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const outroLayers = useRef<HTMLDivElement[]>([]);
  outroLayers.current = [];
  const setOutroLayer = (el: HTMLDivElement | null) => {
    if (el && !outroLayers.current.includes(el)) outroLayers.current.push(el);
  };
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const sideCopyRef = useRef<HTMLDivElement | null>(null);
  const OUTRO_IMAGES = ["/one.png", "/two.png", "/three.png", "/four.png", "/five.png"];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // make sure dashed path is hidden until finale
      if (dashedRef.current) {
        const L = dashedRef.current.getTotalLength();
        gsap.set(dashedRef.current, {
          strokeDasharray: "10 10",
          strokeDashoffset: L,
          autoAlpha: 0,
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=700%",
          scrub: true,
          pin: pin.current!,
          anticipatePin: 1,
        },
        defaults: { ease: "none" },
      });

      // quick initial clip reveal
      tl.fromTo(
        clipRect.current,
        { attr: { y: 0.96, height: 0.04 } },
        { attr: { y: -0.45, height: 1.45 }, duration: 0.1 },
        0
      );
      tl.fromTo(
        clipEllipse.current,
        { attr: { cy: 0.96, rx: 0.62, ry: 0.22 } },
        { attr: { cy: -0.45, rx: 0.56, ry: 0.2 }, duration: 0.1 },
        0
      );
      tl.fromTo(
        underlayRef.current,
        { backgroundColor: "#fcf7ea" },
        { backgroundColor: "#0b0b0b", duration: 0.08 },
        0.02
      );

      // crossfades
      const seg = [
        { i: 0, in: 0.0, peak: 0.06, out: 0.22 },
        { i: 1, in: 0.18, peak: 0.26, out: 0.38 },
        { i: 2, in: 0.34, peak: 0.48, out: 0.6 },
        { i: 3, in: 0.56, peak: 0.66, out: 0.78 },
        { i: 4, in: 0.74, peak: 0.86, out: 1.0 },
      ];
      seg.forEach(({ i, in: a, peak, out }) => {
        const el = layers.current[i];
        if (!el) return;
        tl.fromTo(
          el,
          { opacity: i === 0 ? 1 : 0 },
          { opacity: 1, duration: peak - a, ease: "power1.inOut" },
          a
        );
        tl.to(
          el,
          { opacity: i === seg.length - 1 ? 1 : 0, duration: out - peak, ease: "power1.inOut" },
          peak
        );
      });

      const riseIn = (el: Element | null, at: number, dur = 0.1, y = 36) => {
        if (!el) return;
        tl.fromTo(
          el,
          { y, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: dur, ease: "power3.out" },
          at
        );
      };
      const strokeDraw = (
        path: SVGPathElement | null,
        at: number,
        dur = 0.12,
        dashed = false
      ) => {
        if (!path) return;
        const L = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: dashed ? "10 10" : L,
          strokeDashoffset: L,
        });
        tl.to(path, { strokeDashoffset: 0, duration: dur, ease: "none" }, at);
      };

      // Group 1 sequence
      riseIn(fromRef.current, 0.08, 0.1);
      strokeDraw(lineRef.current, 0.1, 0.08); // switch from butter → palm at end
      riseIn(palmRef.current, 0.2, 0.12);
      strokeDraw(arcRef.current, 0.28, 0.14); // then palm → lab
      riseIn(craftRef.current, 0.34, 0.14);

      // move Group 1 away as brown enters
      tl.to(g1.current, { yPercent: -38, duration: 0.12, ease: "power2.inOut" }, 0.56);
      tl.to(g1.current, { autoAlpha: 0, duration: 0.06 }, 0.64);

      // Group 2
      riseIn(g2.current, 0.56, 0.08, 24);
      tl.fromTo(
        wLinesRef.current?.children ?? [],
        { y: 20, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.08,
          ease: "power3.out",
          stagger: 0.06,
        },
        0.58
      );
      tl.to(g2.current, { yPercent: -34, duration: 0.1, ease: "power2.inOut" }, 0.74);
      tl.to(g2.current, { autoAlpha: 0, duration: 0.06 }, 0.8);

      // -------- Group 3 (finale) --------
      // Make sure intro line is definitely visible
      riseIn(futureRef.current, 0.72, 0.12, 22);

      // show/draw dotted path from the future line down to the stack
      if (dashedRef.current) {
        const L = dashedRef.current.getTotalLength();
        tl.set(dashedRef.current, { autoAlpha: 1 }, 0.74);
        tl.fromTo(
          dashedRef.current,
          { strokeDashoffset: L },
          { strokeDashoffset: 0, duration: 0.22, ease: "none" },
          0.74
        );
      }

      // stack of mores + last row “& more”
      riseIn(moreStackRef.current, 0.76, 0.12, 26);
      riseIn(ampCellRef.current, 0.80, 0.10, 16);
      riseIn(moreLastRef.current, 0.80, 0.10, 16);

      // right-hand tail
      riseIn(tailRef.current, 0.86, 0.12, 20);

      // -------- OUTRO: shrink to centered frame + quick scene carousel --------
      const g3Els = [futureRef.current, moreStackRef.current, ampCellRef.current, moreLastRef.current, tailRef.current, dashedRef.current].filter(Boolean);
      tl.to(g3Els, { autoAlpha: 0, duration: 0.10, ease: "power1.out" }, 0.90);
      tl.to(underlayRef.current, { backgroundColor: "#fcf7ea", duration: 0.14, ease: "power1.inOut" }, 0.90);
      tl.set(outroRef.current, { autoAlpha: 1 }, 0.94);
      // shrink the ACTUAL final background scene, not a new overlay
      const lastLayer = () => layers.current[layers.current.length - 1];
      gsap.set(lastLayer(), { willChange: "transform" });
      tl.to(lastLayer(), {
        scale: 0.36,
        transformOrigin: "50% 22%",
        borderRadius: 8,
        boxShadow: "0 12px 32px rgba(0,0,0,.25)",
        duration: 0.22,
        ease: "power2.inOut",
      }, 0.94);

      // elegant left-to-right headline reveal using clipPath
      if (headlineRef.current) {
        gsap.set(headlineRef.current, { clipPath: "inset(0 100% 0 0)", autoAlpha: 1 });
      }
      // bring in headline and side copy after the frame settles
      tl.to(headlineRef.current, { clipPath: "inset(0 0% 0 0)", duration: 0.18, ease: "power2.out" }, 1.02);
      tl.fromTo(sideCopyRef.current, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.12, ease: "power2.out" }, 1.06);

      // swap images on the ACTUAL last layer 5 times
      OUTRO_IMAGES.forEach((src, i) => {
        const at = 1.02 + i * 0.05; // quick cadence
        tl.call(() => {
          const el = lastLayer();
          if (el) el.style.backgroundImage = `url(${src})`;
        }, undefined, at);
        // gentle pulse to accent the swap
        tl.to(lastLayer(), { scale: "+=0.015", duration: 0.02, yoyo: true, repeat: 1, ease: "power1.inOut" }, at);
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="story-root">
      {/* clipPath defs */}
      <svg width="0" height="0" className="defs">
        <defs>
          <clipPath id="storyReveal" clipPathUnits="objectBoundingBox">
            <rect ref={clipRect} x="0" y="0.96" width="1" height="0.04" />
            <ellipse ref={clipEllipse} cx="0.5" cy="0.96" rx="0.62" ry="0.22" />
          </clipPath>
        </defs>
      </svg>

      <div ref={pin} className="stage" style={{ clipPath: "url(#storyReveal)" }}>
        <div ref={underlayRef} className="underlay" />

        {SCENES.map((src, i) => (
          <div key={i} ref={setLayer} className="scene" style={{ backgroundImage: `url(${src})` }} />
        ))}

        {/* ---------- GROUP 1 ---------- */}
        <div className="group1 copy" ref={g1}>
          <div className="from" ref={fromRef}>
            From butter
            <svg className="from-line" viewBox="0 0 140 2" preserveAspectRatio="none" aria-hidden>
              <path
                ref={lineRef}
                d="M1 1 L139 1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          <div className="palm" ref={palmRef}>to palm oil</div>

          <svg className="arc" viewBox="0 0 240 240" preserveAspectRatio="none" aria-hidden>
            <path
              ref={arcRef}
              d="M10 20 C 40 170, 240 260, 330 210"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="craft" ref={craftRef}>
            <div>We craft delicious fats</div>
            <div>Without depleting Earth&apos;s resources.</div>
          </div>
        </div>

        {/* ---------- GROUP 2 (brown) ---------- */}
        <div className="group2 copy" ref={g2}>
          <div className="without" ref={wLinesRef}>
            <div className="w">Without</div>
            <div className="w">animals</div>
            <div className="w">hormones</div>
            <div className="w">antibiotics</div>
            <div className="w">farmland</div>
            <div className="w">or fertilizers.</div>
          </div>
        </div>

        {/* ---------- GROUP 3 (green) ---------- */}
        {/* Intro line above the curve */}
        <div className="future-line" ref={futureRef}>
          We’re talking about a future where there’s
        </div>

        {/* Dotted path — starts just after the intro line, curves down-left to the stack */}
        <svg className="dashed" viewBox="0 0 360 240" preserveAspectRatio="none" aria-hidden>
          <path
            ref={dashedRef}
            d="M330 20 C 310 70, 255 95, 190 118 C 135 138, 104 152, 96 170"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* The vertical “more” stack with compact spacing and final row “& more” */}
        <div className="more-stack copy" ref={moreStackRef}>
          <span className="more-line">more</span>
          <span className="more-line">more</span>
          <span className="more-line">more</span>
          <span className="more-line">more</span>
          <span className="more-line">more</span>
          <div className="more-row">
            <span className="amp" ref={ampCellRef}>&</span>
            <span className="more-inline" ref={moreLastRef}>more</span>
          </div>
        </div>

        {/* Right-aligned tail copy, offset so it doesn’t sit on the curve */}
        <div className="tail copy" ref={tailRef}>
          <div>of the foods we love</div>
          <div>room for wild things in wild places.</div>
        </div>

        {/* ---------- OUTRO (centered shrinking frame with quick image carousel) ---------- */}
        <div className="outro" ref={outroRef}>
          <div className="outro-frame" ref={frameRef}>
            {SCENES.map((src, i) => (
              <div key={`o-${i}`} ref={setOutroLayer} className="outro-scene" style={{ backgroundImage: `url(${src})` }} />
            ))}
          </div>
          <h2 className="outro-headline" ref={headlineRef}>
            <span className="br">Inspired by</span>
            <span>Earth's blueprints</span>
          </h2>
          <div className="outro-side" ref={sideCopyRef}>
            <p>Reviving an elemental process to produce food for us all while sustaining our planet.</p>
            <button className="outro-cta"><span>Our</span><span className="dash" />Process</button>
          </div>
        </div>
      </div>

      <div className="preload" aria-hidden>
        {SCENES.map((s) => (
          <img key={s} src={s} loading="lazy" alt="" />
        ))}
      </div>

      <style jsx>{`
        .story-root { position: relative; width: 100%; height: 800vh; background: #fcf7ea; color: #fff; }
        .stage { position: sticky; top: 0; height: 100vh; width: 100%; overflow: hidden; isolation: isolate; will-change: clip-path; }
        .underlay { position: absolute; inset: 0; background: #0b0b0b; z-index: 0; }

        .scene { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transform: translateZ(0); will-change: opacity; z-index: 1; }
        .copy, .group1, .group2 { z-index: 2; position: absolute; inset: 0; pointer-events: none; }

        /* -------- Group 1 -------- */
        .from {
          position: absolute; top: 18%; left: 8%;
          font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
          font-size: min(2.9vw, 36px); line-height: 1.12; font-weight: 700;
          text-shadow: 0 1px 0 rgba(0,0,0,.25);
        }
        .from-line { position: absolute; top: 55%; left: calc(100% + 12px); width: 12vw; height: 3px; }

        .palm {
          position: absolute;
          top: 18%;
          left: calc(8% + 14vw + 140px + 24px);
          font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
          font-size: min(2.9vw, 36px);
          line-height: 1.12;
          font-weight: 700;
        }

        .arc {
          position: absolute;
          top: 22%;
          left: calc(8% + 8vw + 140px + 8vw);
          width: 28vw;
          height: 22vw;
          overflow: visible;
        }

        .craft {
          position: absolute;
          top: 62%;
          left: calc(8% + 8vw + 140px + 8vw + 20vw + 32px);
          transform: translateY(-50%);
          max-width: 32vw;
          font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
          font-size: min(2.4vw, 28px);
          line-height: 1.22;
          font-weight: 600;
        }

        /* -------- Group 2 -------- */
        .without {
          position: absolute; top: 18%; left: 16%;
          display: grid; gap: .6rem 3vw; grid-auto-rows: min-content;
          font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
          font-size: min(2.2vw, 28px); line-height: 1.24;
        }

        /* -------- Group 3 -------- */

        /* intro line above the curve */
        .future-line {
          position: absolute;
          top: 26%;
          right: 12%;
          max-width: 36vw;
          text-align: left;
          font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
          font-size: min(2.0vw, 24px);
          line-height: 1.25;
          color: #fff;
          z-index: 3;
        }

        /* dotted connector curving down-left toward the stack */
        .dashed {
          position: absolute;
          top: 28%;
          right: 18%;
          width: 32vw;
          height: 24vw;
          z-index: 2;
        }

        /* compact vertical stack of “more” on the left of the curve end */
        .more-stack {
          position: absolute;
          top: 60%;
          left: 52%;
          transform: translateY(-50%);
          display: grid;
          gap: 2px;                 /* tighter spacing */
          text-align: left;
          font-size: min(2.1vw, 22px);
          line-height: 1.05;        /* tight line height */
          width: max-content;
        }
        .more-line { display: block; }

        .more-row {
          display: flex;
          align-items: baseline;
          gap: 6px;                 /* very small gap between “more” and “&” */
          margin-top: 0;            /* remove extra space above the final row */
        }

        /* oversized ampersand for weight; sits on same baseline as “more” */
        .amp {
          display: inline-block;
          font-size: min(9.6vw, 122px);
          font-weight: 800;
          line-height: .86;         /* brings its baseline up a touch */
          order: 2;                 /* place ampersand AFTER the word “more” */
        }
        .more-inline { font-size: min(2.1vw, 22px); line-height: 1.05; order: 1; }

        /* right-hand tail copy; nudged right so it doesn't sit on the curve */
        .tail {
          position: absolute;
          top: 58.5%;               /* align roughly with the last “more” */
          left: 58.2%;              /* sit right next to the stack */
          transform: translateY(-50%);
          text-align: left;
          font-size: min(2.2vw, 24px);
          line-height: 1.28;
          max-width: 32vw;
          padding-left: 4px;        /* tiny breathing room from stack */
        }

        /* -------- Outro styles -------- */
        .outro { position: absolute; inset: 0; z-index: 5; opacity: 0; }
        .outro-frame { display: none; }
        .outro-scene { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; }

        .outro-headline { position: absolute; left: 6%; bottom: 8%; margin: 0; color: #3c1915; font-family: "Playfair Display", "Cormorant Garamond", ui-serif, Georgia, "Times New Roman", Times, serif; font-weight: 700; line-height: .92; font-size: clamp(28px, 11vw, 142px); letter-spacing: -.02em; z-index: 6; }
        .outro-headline .br { display: block; }
        .outro-side { position: absolute; top: 22%; left: 62%; width: 28vw; color: #3c1915; font-family: ui-serif, Georgia, "Times New Roman", Times, serif; font-size: clamp(14px, 1.4vw, 20px); line-height: 1.5; z-index: 6; }
        .outro-cta { margin-top: 16px; background: #efe4d2; color: #3c1915; border: none; padding: 10px 18px; border-radius: 6px; font-family: inherit; font-size: clamp(12px, 1.2vw, 16px); display: inline-flex; align-items: center; gap: 12px; box-shadow: 0 0 0 1px rgba(0,0,0,.04) inset; }
        .outro-cta .dash { display: inline-block; width: 36px; height: 1px; background: currentColor; opacity: .6; }

        /* preload imgs */
        .preload { position: absolute; width: 0; height: 0; overflow: hidden; }
        .preload img { width: 1px; height: 1px; opacity: 0; }

        @media (max-width: 640px) {
          .from { font-size: 7.2vw; }
          .from-line { width: 22vw; }
          .palm { left: calc(8% + 22vw + 120px); font-size: 7.2vw; }
          .arc { left: calc(8% + 22vw + 120px + 6vw); width: 26vw; height: 26vw; top: 33%; }
          .craft { left: calc(8% + 22vw + 120px + 6vw + 26vw + 24px); max-width: 56vw; font-size: 5.4vw; }

          .without { font-size: 4.6vw; }

          .future-line { top: 24%; right: 10%; font-size: 4.2vw; max-width: 70vw; }
          .dashed { top: 30%; right: 10%; width: 46vw; height: 36vw; }

          .more-stack { left: 40%; top: 60%; font-size: 4.2vw; gap: 4px; }
          .amp { font-size: 18vw; line-height: .86; }
          .more-inline { font-size: 4.2vw; }

          .tail { top: 59%; left: 57%; right: auto; max-width: 44vw; font-size: 4.2vw; transform: translateY(-50%); padding-left: 4px; }

          .outro-frame { display: none; }
          .outro-headline { left: 5%; bottom: 8%; font-size: 16vw; }
          .outro-side { top: 28%; left: 56%; width: 40vw; font-size: 4vw; }
          .outro-cta { padding: 12px 16px; gap: 10px; }
        }
      `}</style>
    </div>
  );
}
