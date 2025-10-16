import React, { useState, useEffect, useRef } from 'react';

const storyImages = [
    "https://cdn.sanity.io/images/jqzja4ip/production/a3edb67c6d72ec6afd5c610b58d92aa9d4dca0ba-1440x810.png?w=1000&fm=webp&q=90", 
    "https://cdn.sanity.io/images/jqzja4ip/production/70220126d3e8ae121147f08fd052458931deaaa6-2880x1620.png?w=1000&fm=webp&q=90",
    "https://cdn.sanity.io/images/jqzja4ip/production/ea59fbc6723a6ef8ed349a1aadae9117932e99e6-2880x1620.png?w=1000&fm=webp&q=90",
    "https://cdn.sanity.io/images/jqzja4ip/production/6b33388bdee3545b7ef4c28d6b95020c440778a6-2880x1620.png?w=1000&fm=webp&q=90",
    "https://cdn.sanity.io/images/jqzja4ip/production/ef32f0b92471e9878d3e6a214ff100175d873c06-2880x1620.png?w=1000&fm=webp&q=90",
];

const CharReveal: React.FC<{ text: string, progress: number, start: number, end: number, stagger?: number, className?: string }> = ({ text, progress, start, end, stagger = 0.8, className }) => {
    const localProgress = Math.max(0, Math.min(1, (progress - start) / (end - start)));
    
    return (
        <span className={`inline-block ${className}`} aria-label={text}>
            {text.split(' ').map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-[0.25em]">
                    {word.split('').map((char, charIndex) => {
                        const overallIndex = text.split(' ').slice(0, wordIndex).join(' ').length + charIndex;
                        return (
                            <span 
                                key={charIndex} 
                                className="char-reveal-container"
                            >
                                <span 
                                    className="char-reveal"
                                    style={{ 
                                        transform: `translateY(${110 - Math.min(1, Math.max(0, localProgress * text.length - overallIndex * stagger)) * 110}%)`
                                    }}
                                >
                                    {char === ' ' ? '\u00A0' : char}
                                </span>
                            </span>
                        )
                    })}
                </span>
            ))}
        </span>
    );
};


const AnimatedSVGPath: React.FC<{ progress: number, start: number, end: number, d: string, strokeDasharray?: string }> = ({ progress, start, end, d, strokeDasharray }) => {
    const pathRef = useRef<SVGPathElement>(null);
    const localProgress = Math.max(0, Math.min(1, (progress - start) / (end - start)));

    useEffect(() => {
        if (pathRef.current) {
            const length = pathRef.current.getTotalLength();
            pathRef.current.style.strokeDasharray = strokeDasharray ? strokeDasharray.split(' ').map(d => (parseFloat(d)/100)*length).join(' ') : `${length}`;
            pathRef.current.style.strokeDashoffset = `${length * (1 - localProgress)}`;
        }
    }, [localProgress, strokeDasharray]);

    return (
        <path ref={pathRef} d={d} stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" fill="none" className="stroked-path" style={{ willChange: 'stroke-dashoffset' }} />
    );
}

const StoryCanvas: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const [revealProgress, setRevealProgress] = useState(0);
    const animationFrameId = useRef<number | null>(null);
    
    useEffect(() => {
        const handleScroll = () => {
          if (animationFrameId.current) {
            window.cancelAnimationFrame(animationFrameId.current);
          }
          animationFrameId.current = window.requestAnimationFrame(() => {
            const container = containerRef.current;
            if (!container) return;
    
            const { top, height } = container.getBoundingClientRect();
            const vh = window.innerHeight;
         
            const currentRevealProgress = Math.max(0, Math.min(1, -top / vh));
            setRevealProgress(currentRevealProgress);

            const storyStartPoint = vh;
            const storyScrollableHeight = height - 2 * vh;

            if (storyScrollableHeight > 0) {
              const currentProgress = Math.max(0, Math.min(1, (-top - storyStartPoint) / storyScrollableHeight));
              setProgress(currentProgress);
            }
          });
        };
    
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => {
          if (animationFrameId.current) {
            window.cancelAnimationFrame(animationFrameId.current);
          }
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);

    const textSectionOpacity = Math.max(0, Math.min(1, (progress - 0.05) / 0.8));
    const outroOpacity = Math.max(0, Math.min(1, (progress - 0.92) / 0.08));

    const createTransform = (p: number, start: number, end: number) => {
        const localProgress = Math.max(0, Math.min(1, (p - start) / (end - start)));
        const opacity = Math.sin(localProgress * Math.PI);
        const y = (1 - localProgress) * 20;
        return { opacity, transform: `translateY(${y}px)`, willChange: 'transform, opacity' as const };
    }
    
    const imageSectionProgress = Math.min(1, progress / 0.9);
    const numImages = storyImages.length;
    
    const scale = 1 + imageSectionProgress * 0.1;
    const sceneFadeInProgress = Math.sin(Math.min(1, revealProgress * 1.5) * (Math.PI / 2));

    const imageDuration = 1.0 / numImages;
    const transitionDuration = imageDuration * 0.2;

    const y = 1 - revealProgress;
    const curveDepth = 0.2 * Math.sin(revealProgress * Math.PI);
    const d = `M 0,${y} C 0.5, ${y + curveDepth}, 0.5, ${y + curveDepth}, 1, ${y} L 1,1 L 0,1 Z`;

    return (
        <div ref={containerRef} className="relative h-[800vh] w-full bg-cream text-brand-brown">
             <svg width="0" height="0" className="absolute">
                <defs>
                    <clipPath id="curveRevealClip" clipPathUnits="objectBoundingBox">
                        <path d={d} />
                    </clipPath>
                </defs>
            </svg>
            <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ clipPath: 'url(#curveRevealClip)', willChange: 'clip-path' }}>
                 <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                        transform: `scale(${scale})`,
                        opacity: 1 - outroOpacity,
                        willChange: 'transform, opacity'
                    }}
                 >
                    {storyImages.map((src, index) => {
                        const imageStartTime = index * imageDuration;
                        const fadeInStartTime = imageStartTime - transitionDuration;
                        const fadeOutStartTime = imageStartTime + imageDuration - transitionDuration;
                        
                        const p = imageSectionProgress;
                        let opacity = 0;

                        if (p >= fadeInStartTime && p < imageStartTime) {
                            if (transitionDuration > 0) {
                                opacity = (p - fadeInStartTime) / transitionDuration;
                            }
                        } else if (p >= imageStartTime && p < fadeOutStartTime) {
                            opacity = 1;
                        } else if (p >= fadeOutStartTime && p < fadeOutStartTime + transitionDuration) {
                            if (transitionDuration > 0) {
                                opacity = 1 - ((p - fadeOutStartTime) / transitionDuration);
                            }
                        }

                        opacity *= sceneFadeInProgress;
                        opacity = Math.max(0, Math.min(1, opacity));

                        return (
                            <div 
                                key={src}
                                className="absolute inset-0 w-full h-full bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${src})`,
                                    opacity: opacity,
                                    willChange: 'opacity'
                                }}
                            />
                        );
                    })}
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center font-serif p-4" style={{ opacity: Math.min(1, (1 - outroOpacity) * 2), willChange: 'opacity' }}>
                     <div className="relative w-full h-full max-w-6xl mx-auto" style={{opacity: textSectionOpacity, willChange: 'opacity'}}>
                        
                        <div className="absolute inset-0" style={createTransform(progress, 0.05, 0.20)}>
                            <div className="absolute top-[15%] left-[10%] text-[3vw]"><CharReveal text="From butter" progress={progress} start={0.08} end={0.15}/></div>
                            <svg className="absolute top-[17.5%] left-[28%]" width="15vw" viewBox="0 0 174 2" fill="none"><AnimatedSVGPath progress={progress} start={0.1} end={0.18} d="M0 1.25L174 1.25"/></svg>
                        </div>
                        
                        <div className="absolute inset-0" style={createTransform(progress, 0.20, 0.35)}>
                            <div className="absolute top-[40%] right-[15%] text-[3vw]"><CharReveal text="to palm oil" progress={progress} start={0.22} end={0.29}/></div>
                        </div>

                        <div className="absolute inset-0" style={createTransform(progress, 0.35, 0.50)}>
                           <svg className="absolute top-[20%] left-[5%]" width="15vw" viewBox="0 0 243 243" fill="none"><AnimatedSVGPath progress={progress} start={0.37} end={0.48} d="M1 0C1.00001 133.653 109.347 242 243 242"/></svg>
                            <div className="absolute top-[50%] left-[15%] text-[3.5vw] leading-tight">
                                <CharReveal text="We craft delicious fats" progress={progress} start={0.38} end={0.45}/>
                                <br/>
                                <CharReveal text="Without depleting Earth’s resources." progress={progress} start={0.40} end={0.48}/>
                            </div>
                        </div>

                        <div className="absolute inset-0 text-[2.2vw] leading-tight" style={createTransform(progress, 0.50, 0.65)}>
                           <div className="absolute top-[20%] right-[10%]">
                                <CharReveal text="Without animals," progress={progress} start={0.52} end={0.58} />
                           </div>
                           <div className="absolute top-[45%] left-[10%]">
                                <CharReveal text="hormones, antibiotics," progress={progress} start={0.54} end={0.60} />
                           </div>
                           <div className="absolute top-[70%] left-[45%]">
                                <CharReveal text="farmland or fertilizers." progress={progress} start={0.56} end={0.62} />
                           </div>
                        </div>

                        <div className="absolute inset-0" style={createTransform(progress, 0.65, 0.9)}>
                            <div className="absolute top-[15%] left-[5%] text-[2.5vw]">
                                <CharReveal text="We’re talking about a future where there's" progress={progress} start={0.68} end={0.75} />
                            </div>
                            <svg className="absolute top-[20%] left-[65%]" width="18vw" viewBox="0 0 248 168" fill="none">
                                <AnimatedSVGPath progress={progress} start={0.72} end={0.82} d="M248 0 C248 28.5096 218.116 41.7984 122.19 71.0976 C15.0288 103.824 0 135.996 0 168" strokeDasharray="8 8" />
                            </svg>

                            <div className="absolute top-[35%] left-[50%] flex items-center gap-4">
                                <span className="text-[8vw] font-serif">
                                    <CharReveal text="&" progress={progress} start={0.74} end={0.79} />
                                </span>
                                <div className="text-left text-[1.8vw] leading-tight">
                                    {['more', 'more', 'more', 'more', 'more', 'more'].map((word, i) => (
                                        <div key={i}><CharReveal text={word} progress={progress} start={0.75 + i * 0.015} end={0.82 + i * 0.015} /></div>
                                    ))}
                                </div>
                            </div>

                             <div className="absolute top-[70%] right-[5%] text-[2vw] text-right leading-tight">
                               <CharReveal text="of the foods we love" progress={progress} start={0.82} end={0.88} />
                               <br />
                               <CharReveal text="room for wild things in wild places." progress={progress} start={0.84} end={0.9} />
                            </div>
                        </div>
                     </div>
                </div>

                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4" style={{ opacity: outroOpacity, willChange: 'opacity' }}>
                     <img 
                        src="https://www.savor.it/_nuxt/img/compromise.5222045.svg" 
                        alt="Made without compromise"
                        className="w-full max-w-3xl h-auto mb-6 filter invert"
                    />
                    <p className="text-brand-brown-light max-w-lg text-base md:text-lg transition-opacity duration-500" style={{opacity: Math.max(0, (progress - 0.96) / 0.04), willChange: 'opacity'}}>
                        Reviving an elemental process to produce food for us all while sustaining our planet.
                    </p>
                    <a href="#" className="mt-8 group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-transparent border border-brand-brown-light/50 px-8 py-3 text-sm font-medium text-brand-brown transition-all duration-500 hover:bg-brand-brown/5" style={{opacity: Math.max(0, (progress - 0.96) / 0.04), willChange: 'opacity'}}>
                        <span className="link-underline">Our Process</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default StoryCanvas;