"use client"

import { useLayoutEffect, useMemo, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const toFixed = (n: number) => Number.parseFloat(n.toFixed(4))

const CLIP_URL = "url(#storyReveal)"
const RECT_PATH = "M0 0 L1 0 L1 1 L0 1 Z"

const buildClipPath = (p: number) => {
  const progress = clamp(p, 0, 1)
  const base = clamp(0.92 - progress * 1.05, -0.25, 0.92)
  const phase = progress < 0.45 ? progress / 0.45 : (progress - 0.45) / 0.55
  const amplitude = progress < 0.45 ? lerp(-0.5, -0.1, phase) : lerp(-0.1, 0.45, phase)
  const cpY = clamp(base + amplitude, -0.35, 1.35)
  const cpY2 = clamp(base + amplitude * 0.92, -0.35, 1.35)

  return ["M0", toFixed(base), "C0.25", toFixed(cpY), "0.75", toFixed(cpY2), "1", toFixed(base), "L1 1 L0 1 Z"].join(
    " ",
  )
}

const TRANSITION_SEQUENCE = ["./1.jpg", "./2.jpg", "./3.jpg", "./4.jpg", "./1.jpg"]
const OUTRO_IMAGES = ["./1.jpg", "./2.jpg", "./3.jpg", "./4.jpg"]

const TIMINGS = {
  arcReveal: 0.24,
  arcExpand: 0.46,
  arcExit: 0.72,
  g1Copy: 0.9,
  g1Exit: 1.28,
  g2Start: 1.42,
  g2Exit: 1.9,
  g3Start: 2.08,
  g3Exit: 2.32,
  outroStart: 2.34,
  outroFrame: 2.4,
}

export default function StoryCanvas() {
  const root = useRef<HTMLDivElement | null>(null)
  const pin = useRef<HTMLDivElement | null>(null)
  const clipPathRef = useRef<SVGPathElement | null>(null)
  const initialClipPath = useMemo(() => buildClipPath(0), [])
  const underlayRef = useRef<HTMLDivElement | null>(null)
  const sceneRef = useRef<HTMLDivElement | null>(null)

  const g1 = useRef<HTMLDivElement | null>(null)
  const fromRef = useRef<HTMLDivElement | null>(null)
  const palmRef = useRef<HTMLDivElement | null>(null)
  const craftRef = useRef<HTMLDivElement | null>(null)
  const lineRef = useRef<SVGPathElement | null>(null)
  const arcRef = useRef<SVGPathElement | null>(null)
  const arcSvgRef = useRef<SVGSVGElement | null>(null)

  const g2 = useRef<HTMLDivElement | null>(null)
  const wLinesRef = useRef<HTMLDivElement | null>(null)

  const futureRef = useRef<HTMLDivElement | null>(null)
  const moreStackRef = useRef<HTMLDivElement | null>(null)
  const ampCellRef = useRef<HTMLSpanElement | null>(null)
  const moreLastRef = useRef<HTMLSpanElement | null>(null)
  const dashedRef = useRef<SVGPathElement | null>(null)
  const tailRef = useRef<HTMLDivElement | null>(null)

  const outroRef = useRef<HTMLDivElement | null>(null)
  const headlineRef = useRef<HTMLHeadingElement | null>(null)
  const sideCopyRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    let removeListener: (() => void) | null = null
    const ctx = gsap.context(() => {
      if (dashedRef.current) {
        const L = dashedRef.current.getTotalLength()
        gsap.set(dashedRef.current, { strokeDasharray: "10 10", strokeDashoffset: L, autoAlpha: 0 })
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
      })

      const clipState = { value: 0 }
      let clipReleased = false

      const releaseClip = () => {
        if (!pin.current) return
        pin.current.style.clipPath = "none"
        pin.current.style.webkitClipPath = "none"
        if (clipPathRef.current) clipPathRef.current.setAttribute("d", RECT_PATH)
        clipReleased = true
      }

      const reapplyClip = () => {
        if (!pin.current) return
        pin.current.style.clipPath = CLIP_URL
        pin.current.style.webkitClipPath = CLIP_URL
        clipReleased = false
      }

      const applyClip = () => {
        if (!clipPathRef.current) return
        if (clipState.value >= 1.01) {
          releaseClip()
          return
        }
        if (clipReleased) reapplyClip()
        clipPathRef.current.setAttribute("d", buildClipPath(clipState.value))
      }

      applyClip()

      if (arcSvgRef.current) {
        gsap.set(arcSvgRef.current, { transformOrigin: "50% 100%", scaleX: 1, scaleY: 1.45, autoAlpha: 0, yPercent: 0 })
        const arcStart = TIMINGS.g1Copy - 0.46
        tl.to(arcSvgRef.current, { autoAlpha: 1, duration: 0.03, ease: "power1.out" }, arcStart)
        tl.to(arcSvgRef.current, { scaleX: 1.16, duration: 0.12, ease: "power2.inOut" }, arcStart)
        tl.to(arcSvgRef.current, { scaleX: 1, scaleY: 1.12, duration: 0.1, ease: "power2.out" }, arcStart + 0.12)
        tl.to(
          arcSvgRef.current,
          { scaleX: 0.32, scaleY: 0.72, yPercent: -210, autoAlpha: 0.8, duration: 0.36, ease: "power2.inOut" },
          arcStart + 0.22,
        )
      }

      tl.to(clipState, { value: 0.55, duration: 0.16, ease: "power2.inOut", onUpdate: applyClip }, 0)
      tl.to(clipState, { value: 1, duration: 0.36, ease: "power2.out", onUpdate: applyClip }, 0.16)
      tl.call(releaseClip, undefined, 0.54)

      const transitionTimings = [
        { time: TIMINGS.g1Copy, image: TRANSITION_SEQUENCE[0] },
        { time: TIMINGS.g1Exit, image: TRANSITION_SEQUENCE[1] },
        { time: TIMINGS.g2Start, image: TRANSITION_SEQUENCE[2] },
        { time: TIMINGS.g2Exit, image: TRANSITION_SEQUENCE[3] },
      ]

      if (sceneRef.current) {
        sceneRef.current.style.backgroundImage = `url(${TRANSITION_SEQUENCE[0]})`
      }

      for (let i = 0; i < transitionTimings.length - 1; i++) {
        const nextTiming = transitionTimings[i + 1]
        tl.call(
          () => {
            if (sceneRef.current) {
              sceneRef.current.style.backgroundImage = `url(${nextTiming.image})`
            }
          },
          undefined,
          nextTiming.time,
        )
      }

      tl.call(
        () => {
          if (sceneRef.current) {
            sceneRef.current.style.backgroundImage = `url(${TRANSITION_SEQUENCE[4]})`
          }
        },
        undefined,
        Math.max(0, TIMINGS.g3Exit - 0.08),
      )

      //tl.to(sceneRef.current, { opacity: 0, duration: 0.15, ease: "power1.inOut" }, TIMINGS.g3Exit - 0.05)
      //tl.to(sceneRef.current, { opacity: 1, duration: 0.15, ease: "power1.inOut" }, TIMINGS.g3Exit + 0.1)

      const riseIn = (el: Element | null, at: number, dur = 0.1, y = 36, extra?: gsap.TweenVars) => {
        if (!el) return
        tl.fromTo(
          el,
          { y, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: dur, ease: "power3.out", ...(extra || {}) },
          at,
        )
      }

      const strokeDraw = (
        path: SVGPathElement | null,
        at: number,
        dur = 0.12,
        dashed = false,
        extra?: { from?: gsap.TweenVars; to?: gsap.TweenVars },
      ) => {
        if (!path) return
        const L = path.getTotalLength()
        gsap.set(path, {
          strokeDasharray: dashed ? "10 10" : L,
          strokeDashoffset: L,
          autoAlpha: 0,
          ...(extra?.from ?? {}),
        })
        tl.to(path, { autoAlpha: 1, duration: 0.04, ease: "power1.out" }, at)
        tl.to(path, { strokeDashoffset: 0, duration: dur, ease: "none", ...(extra?.to ?? {}) }, at + 0.02)
      }

      riseIn(fromRef.current, TIMINGS.g1Copy + 0.08, 0.1)
      strokeDraw(lineRef.current, TIMINGS.g1Copy + 0.1, 0.08)
      riseIn(palmRef.current, TIMINGS.g1Copy + 0.2, 0.12)
      tl.set(arcSvgRef.current, { autoAlpha: 1, scaleX: 1, scaleY: 1, yPercent: 0 }, TIMINGS.g1Copy + 0.26)
      strokeDraw(arcRef.current, TIMINGS.g1Copy + 0.28, 0.14)
      riseIn(craftRef.current, TIMINGS.g1Copy + 0.34, 0.14)
      tl.to(arcRef.current, { autoAlpha: 0, duration: 0.1 }, TIMINGS.g1Exit + 0.02)
      tl.to(g1.current, { yPercent: -38, duration: 0.14, ease: "power2.inOut" }, TIMINGS.g1Exit)
      tl.to(g1.current, { autoAlpha: 0, duration: 0.08 }, TIMINGS.g1Exit + 0.08)

      riseIn(g2.current, TIMINGS.g2Start, 0.1, 24)
      tl.fromTo(
        wLinesRef.current?.children ?? [],
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.1, ease: "power3.out", stagger: 0.06 },
        TIMINGS.g2Start + 0.06,
      )
      tl.to(g2.current, { yPercent: -34, duration: 0.12, ease: "power2.inOut" }, TIMINGS.g2Exit - 0.14)
      tl.to(g2.current, { autoAlpha: 0, duration: 0.08 }, TIMINGS.g2Exit)

      riseIn(futureRef.current, TIMINGS.g3Start, 0.14, 22)
      if (dashedRef.current) {
        const L = dashedRef.current.getTotalLength()
        tl.set(dashedRef.current, { autoAlpha: 1 }, TIMINGS.g3Start + 0.04)
        tl.fromTo(
          dashedRef.current,
          { strokeDashoffset: L },
          { strokeDashoffset: 0, duration: 0.22, ease: "none" },
          TIMINGS.g3Start + 0.04,
        )
      }
      riseIn(moreStackRef.current, TIMINGS.g3Start + 0.08, 0.12, 26)
      riseIn(ampCellRef.current, TIMINGS.g3Start + 0.14, 0.1, 16)
      riseIn(moreLastRef.current, TIMINGS.g3Start + 0.14, 0.1, 16)
      riseIn(tailRef.current, TIMINGS.g3Start + 0.22, 0.12, 20)

      const g3Els = [
        futureRef.current,
        moreStackRef.current,
        ampCellRef.current,
        moreLastRef.current,
        tailRef.current,
        dashedRef.current,
      ].filter(Boolean)
      tl.to(g3Els, { autoAlpha: 0, duration: 0.1, ease: "power1.out" }, TIMINGS.outroStart)

      tl.set(outroRef.current, { opacity: 1 }, TIMINGS.outroStart)
      tl.set(sceneRef.current, { opacity: 1 }, TIMINGS.outroStart)

      const shrinkDur = 1.6

      if (sceneRef.current) {
        const outroImageTransitions = [
          { time: TIMINGS.outroStart, image: OUTRO_IMAGES[0] },
          { time: TIMINGS.outroStart + shrinkDur * 0.33, image: OUTRO_IMAGES[1] },
          { time: TIMINGS.outroStart + shrinkDur * 0.66, image: OUTRO_IMAGES[2] },
          { time: TIMINGS.outroStart + shrinkDur * 0.95, image: OUTRO_IMAGES[3] },
        ]

        tl.call(
          () => {
            if (sceneRef.current) {
              sceneRef.current.style.backgroundImage = `url(${OUTRO_IMAGES[0]})`
            }
          },
          undefined,
          Math.max(0, TIMINGS.outroStart - 0.08),
        )

        for (let i = 0; i < outroImageTransitions.length - 1; i++) {
          const nextTiming = outroImageTransitions[i + 1]
          tl.call(
            () => {
              if (sceneRef.current) {
                sceneRef.current.style.backgroundImage = `url(${nextTiming.image})`
              }
            },
            undefined,
            nextTiming.time,
          )
        }

        tl.call(
          () => {
            const stage = pin.current as HTMLDivElement | null
            if (!stage) return
            const stageW = stage.clientWidth
            const stageH = stage.clientHeight
            const targetW = stageW * 0.24
            const targetH = targetW * 1.2
            const leftInset = Math.max((stageW - targetW) / 2, 0)
            const rightInset = leftInset
            const topInset = Math.max(stageH * 0.18, 0)
            const bottomInset = Math.max(stageH - topInset - targetH, 0)
            const clip = `inset(${topInset}px ${rightInset}px ${bottomInset}px ${leftInset}px round 14px)`
            gsap.set(sceneRef.current, {
              willChange: "opacity, transform, clip-path",
              transformOrigin: "50% 22%",
              clipPath: "inset(0px 0px 0px 0px)",
              opacity: 1,
            })
            tl.to(
              sceneRef.current,
              {
                scale: 1.0,
                y: 0,
                clipPath: clip,
                borderRadius: 14,
                boxShadow: "0 16px 48px rgba(0,0,0,.28)",
                duration: shrinkDur,
                ease: "power3.inOut",
              },
              TIMINGS.outroStart,
            )
          },
          undefined,
          Math.max(0, TIMINGS.outroStart - 0.02),
        )
      }

      if (headlineRef.current || document) {
        const inspired = document.querySelector(".headline-inspired")
        const earth = document.querySelector(".headline-earth span")
        if (inspired) gsap.set(inspired, { autoAlpha: 0, y: 18 })
        if (earth) gsap.set(earth, { autoAlpha: 0, y: 18 })
        if (inspired)
          tl.to(
            inspired,
            { autoAlpha: 1, y: 0, duration: 0.26, ease: "power3.out" },
            TIMINGS.outroStart + shrinkDur + 0.04,
          )
        if (earth)
          tl.to(
            earth,
            { autoAlpha: 1, y: 0, duration: 0.34, ease: "power3.out" },
            TIMINGS.outroStart + shrinkDur + 0.12,
          )
      }

      tl.call(() => {
        const side = sideCopyRef.current as HTMLDivElement | null
        if (!side) return
        const p = side.querySelector("p") as HTMLParagraphElement | null
        const btn = side.querySelector(".outro-cta") as HTMLButtonElement | null
        const dash = btn?.querySelector(".dash") as HTMLSpanElement | null
        if (p) gsap.set(p, { autoAlpha: 0, y: 14, filter: "blur(6px)" })
        if (btn) gsap.set(btn, { autoAlpha: 0, y: 16, scale: 0.96 })
        if (dash) gsap.set(dash, { transformOrigin: "left center", scaleX: 0 })
      })
      const sideAt = TIMINGS.outroStart + shrinkDur + 0.14
      tl.fromTo(
        sideCopyRef.current?.querySelector("p")!,
        { autoAlpha: 0, y: 14, filter: "blur(6px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.28, ease: "power3.out" },
        sideAt,
      )
      tl.fromTo(
        sideCopyRef.current?.querySelector(".outro-cta")!,
        { autoAlpha: 0, y: 16, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.26, ease: "power3.out" },
        sideAt + 0.08,
      )
      tl.to(
        sideCopyRef.current?.querySelector(".outro-cta .dash")!,
        { scaleX: 1, duration: 0.22, ease: "power2.out" },
        sideAt + 0.12,
      )

      ScrollTrigger.addEventListener("refresh", applyClip)
      removeListener = () => ScrollTrigger.removeEventListener("refresh", applyClip)
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }, root)

    return () => {
      removeListener?.()
      ctx.revert()
    }
  }, [])

  return (
    <div ref={root} className="story-root">
      <svg width="0" height="0" className="defs" aria-hidden>
        <defs>
          <clipPath id="storyReveal" clipPathUnits="objectBoundingBox">
            <path ref={clipPathRef} d={initialClipPath} />
          </clipPath>
        </defs>
      </svg>

      <div ref={pin} className="stage" style={{ clipPath: "url(#storyReveal)", WebkitClipPath: "url(#storyReveal)" }}>
        <div ref={underlayRef} className="underlay" />

        <div className="scene-container">
          <div ref={sceneRef} className="scene" style={{ backgroundImage: `url(${TRANSITION_SEQUENCE[0]})` }} />
        </div>

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
          <div className="palm" ref={palmRef}>
            to palm oil
          </div>
          <svg ref={arcSvgRef} className="arc" viewBox="0 0 360 240" preserveAspectRatio="none" aria-hidden>
            <path
              ref={arcRef}
              d="M10 20 C 60 170, 260 260, 350 215"
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

        <div className="future-line" ref={futureRef}>
          We're talking about a future where there's
        </div>
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
        <div className="more-stack copy" ref={moreStackRef}>
          <span className="more-line">more</span>
          <span className="more-line">more</span>
          <span className="more-line">more</span>
          <span className="more-line">more</span>
          <span className="more-line">more</span>
          <div className="more-row">
            <span className="amp" ref={ampCellRef}>
              &
            </span>
            <span className="more-inline" ref={moreLastRef}>
              more
            </span>
          </div>
        </div>
        <div className="tail copy" ref={tailRef}>
          <div>of the foods we love</div>
          <div>room for wild things in wild places.</div>
        </div>

        <div className="outro" ref={outroRef}>
          <div className="outro-layout">
            <h2 className="outro-headline headline-inspired" ref={headlineRef}>
              <span className="br">Inspired by</span>
            </h2>
            <h2 className="outro-headline headline-earth" ref={headlineRef}>
              <span>Earth&apos;s blueprints</span>
            </h2>

            <div className="outro-side" ref={sideCopyRef}>
              <p>Reviving an elemental process to produce food for us all while sustaining our planet.</p>
              <button className="outro-cta">
                <span>Our</span>
                <span className="dash" />
                Process
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
  .story-root { position: relative; width: 100%; height: 800vh; background: #fcf7ea; color: #fff; }
  .stage { position: sticky; top: 0; height: 100vh; width: 100%; overflow: hidden; isolation: isolate; will-change: clip-path; }
  .underlay { position: absolute; inset: 0; background: #ffffff; z-index: 0; }
  .scene { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 1; z-index: 1; }
  .copy, .group1, .group2 { z-index: 2; position: absolute; inset: 0; pointer-events: none; }

  .from { position: absolute; top: 18%; left: 8%; font-family: ui-serif, Georgia, Times, serif; font-size: min(2.9vw, 36px); line-height: 1.12; font-weight: 700; text-shadow: 0 1px 0 rgba(0,0,0,.25); }
  .from-line { position: absolute; top: 55%; left: calc(100% + 12px); width: 12vw; height: 3px; }
  .palm { position: absolute; top: 18%; left: calc(8% + 14vw + 140px + 24px); font-family: ui-serif, Georgia, Times, serif; font-size: min(2.9vw, 36px); line-height: 1.12; font-weight: 700; }
  .arc { position: absolute; top: 22%; left: calc(8% + 8vw + 140px + 8vw); width: 28vw; height: 22vw; overflow: visible; }
  .craft { position: absolute; top: 62%; left: calc(8% + 8vw + 140px + 8vw + 20vw + 32px); transform: translateY(-50%); max-width: 32vw; font-family: ui-serif, Georgia, Times, serif; font-size: min(2.4vw, 28px); line-height: 1.22; font-weight: 600; }

  .without { position: absolute; top: 18%; left: 16%; display: grid; gap: .6rem 3vw; grid-auto-rows: min-content; font-family: ui-serif, Georgia, Times, serif; font-size: min(2.2vw, 28px); line-height: 1.24; }

  .future-line { position: absolute; top: 26%; right: 12%; max-width: 36vw; text-align: left; font-family: ui-serif, Georgia, Times, serif; font-size: min(2.0vw, 24px); line-height: 1.25; z-index: 3; }
  .dashed { position: absolute; top: 28%; right: 18%; width: 32vw; height: 24vw; z-index: 2; }
  .more-stack { position: absolute; top: 60%; left: 52%; transform: translateY(-50%); display: grid; gap: 2px; text-align: left; font-size: min(2.1vw, 22px); line-height: 1.05; width: max-content; }
  .more-line { display: block; }
  .more-row { display: flex; align-items: baseline; gap: 6px; margin-top: 0; }
  .amp { display: inline-block; font-size: min(9.6vw, 122px); font-weight: 800; line-height: .86; order: 2; }
  .more-inline { font-size: min(2.1vw, 22px); line-height: 1.05; order: 1; }
  .tail { position: absolute; top: 58.5%; left: 58.2%; transform: translateY(-50%); text-align: left; font-size: min(2.2vw, 24px); line-height: 1.28; max-width: 32vw; padding-left: 4px; }

  :root{
    --frame-top: 18vh;
    --frame-w: 24vw;
    --frame-h: calc(var(--frame-w) * 1.2);
    --frame-left: calc((100vw - var(--frame-w)) / 2);
    --baseline: calc(var(--frame-top) + var(--frame-h));
    --col-gap: 4vw;
  }

  .outro { position: absolute; inset: 0; z-index: 5; opacity: 0; }
  .outro-layout { position: absolute; inset: 0; z-index: 7; pointer-events: none; }

  .outro-side{
    position: absolute;
    top: calc(var(--baseline) - 4vh);
    left: calc(var(--frame-left) + var(--frame-w) + var(--col-gap));
    width: 28vw;
    max-width: 32rem;
    color: #3c1915;
    font-family: ui-serif, Georgia, Times, serif;
    font-size: clamp(14px, 1.2vw, 18px);
    line-height: 1.6;
    text-align: left;
    z-index: 9;
    pointer-events: auto;
  }
  .outro-cta{
    margin-top: 12px;
    background: #efe4d2;
    color: #3c1915;
    border: none;
    padding: 10px 18px;
    border-radius: 6px;
    font-family: inherit;
    font-size: clamp(12px, 1.2vw, 16px);
    display: inline-flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    pointer-events: auto;
  }
  .outro-cta .dash{ display:inline-block; width:36px; height:1px; background:currentColor; opacity:.6; }

  .outro-headline{
    position: absolute;
    margin: 0;
    color: #3c1915;
    font-family: 'Dancing Script', cursive;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: .92;
    text-align: left;
    z-index: 8;
  }
  .outro-headline .br{ display:inline; }

  .headline-inspired{
    left: calc(var(--frame-left) - 31vw);
    top:  calc(var(--baseline) - 3vh);
    font-size: clamp(28px, 8.6vw, 130px);
    white-space: nowrap;
    z-index: 8;
  }

  .headline-earth{
    top: calc(var(--baseline) + 5vh);
    left: 6vw;
    max-width: 90vw;
    font-size: 18vw;
    white-space: normal;
  }

  @media (max-width: 640px){
    .story-root { height: 1200vh; }
    .from { font-size: 7.2vw; } .from-line { width: 22vw; }
    .palm { left: calc(8% + 22vw + 120px); font-size: 7.2vw; }
    .arc { left: calc(8% + 22vw + 120px + 6vw); width: 26vw; height: 26vw; top: 33%; }
    .craft { left: calc(8% + 22vw + 120px + 6vw + 26vw + 24px); max-width: 56vw; font-size: 5.4vw; }
    .without { font-size: 4.6vw; }
    .future-line { top: 24%; right: 10%; font-size: 4.2vw; max-width: 70vw; }
    .dashed { top: 30%; right: 10%; width: 46vw; height: 36vw; }
    .more-stack { left: 40%; top: 60%; font-size: 4.2vw; gap: 4px; }
    .amp { font-size: 18vw; }
    .more-inline { font-size: 4.2vw; }
    .tail { top: 59%; left: 57%; max-width: 44vw; font-size: 4.2vw; }

    :root{
      --frame-top: 22vh;
      --frame-w: 58vw;
      --frame-h: calc(var(--frame-w) * 1.2);
      --frame-left: calc((100vw - var(--frame-w)) / 2);
      --baseline: calc(var(--frame-top) + var(--frame-h));
      --col-gap: 6vw;
    }

    .outro-side{
      top: calc(var(--baseline) + -1.2em);
      left: 6vw;
      width: 88vw;
    }

    .headline-inspired{
      left: calc(var(--frame-left) - 34vw);
      top:  calc(var(--baseline) - 1.2em);
      font-size: 14vw;
      white-space: normal;
    }

    .headline-earth{
      top: calc(var(--baseline) + 8vh);
      left: 6vw;
      max-width: 90vw;
      font-size: 18vw;
      white-space: normal;
    }
  }

  .outro-layout .outro-headline:nth-of-type(1),
  .headline-inspired{
    left: calc(var(--frame-left) - 36vw) !important;
    top:  calc(var(--baseline) - 16vh) !important;
  }

  .outro-side{
    top: calc(var(--baseline) - 17vh) !important;
  }

  .headline-earth{
    left: calc(var(--frame-left) - 14vw) !important;
    font-size: clamp(30px, 9.2vw, 140px) !important;
  }

  .scene-container {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  .scene {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    will-change: opacity;
  }
`}</style>
    </div>
  )
}
