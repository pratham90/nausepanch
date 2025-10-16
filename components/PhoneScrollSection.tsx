import React, { useRef, useState, useEffect } from 'react';

const images = [
  { src: "https://cdn.sanity.io/images/jqzja4ip/production/29cecd77efbdc0e3e5def3c30ae7a368de55281a-2880x1920.png?rect=0,109,2880,1703&w=793&h=469&fm=webp&q=90", alt: "A dollop of cultured butter on a rustic slice of bread", className: "col-span-12 md:col-span-8 md:col-start-3", parallaxFactor: 0.15 },
  { src: "https://cdn.sanity.io/images/jqzja4ip/production/226d3f7cd9e45264d5bf5de0003c68d61c9998b-5500x3684.jpg?rect=0,216,5500,3253&w=793&h=469&fm=webp&q=90", alt: "A stack of fluffy pancakes topped with a melting pat of butter", className: "col-span-12 md:col-span-7 md:col-start-1", parallaxFactor: 0.25 },
  { src: "https://cdn.sanity.io/images/jqzja4ip/production/a180c39f450d2cc846adbcede2940a1170a47743-4608x2592.jpg?rect=113,0,4383,2592&w=793&h=469&fm=webp&q=90", alt: "A golden-brown, flaky croissant on a simple plate", className: "col-span-12 md:col-span-9 md:col-start-4", parallaxFactor: 0.1 },
  { src: "https://cdn.sanity.io/images/jqzja4ip/production/cbcf81531e7583abc04075e566e6933ceb629ba1-2880x1920.png?rect=96,0,2688,1920&w=658&h=470&fm=webp&q=90", alt: "A gourmet pasta dish with a creamy sauce and fresh herbs", className: "col-span-12 md:col-span-6 md:col-start-2", parallaxFactor: 0.2 },
  { src: "https://cdn.sanity.io/images/jqzja4ip/production/27baef14621728e4d8f2a7092155c1b9a36003da-2880x1920.png?rect=297,0,2286,1920&w=450&h=378&fm=webp&q=90", alt: "A close-up of a savory dish with grains and greens", className: "col-span-12 md:col-span-5 md:col-start-7", parallaxFactor: 0.3 },
  { src: "https://cdn.sanity.io/images/jqzja4ip/production/b49b0acdd0afea0944f7396039984e4b800daa5f-2880x1920.png?rect=0,56,2880,1808&w=352&h=221&fm=webp&q=90", alt: "Freshly baked bread with a crisp crust", className: "col-span-12 md:col-span-7 md:col-start-3", parallaxFactor: 0.18 }
];

const ParallaxImage: React.FC<{ src: string; alt: string; className?: string; parallaxFactor: number; }> = ({ src, alt, className, parallaxFactor }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<React.CSSProperties>({
        transform: 'scale(1.05)',
        opacity: 0,
        willChange: 'transform, opacity',
    });
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                const { top, height } = ref.current.getBoundingClientRect();
                const viewportHeight = window.innerHeight;

                if (top < viewportHeight && top + height > 0) {
                    const translateY = top * parallaxFactor;

                    const revealStartPoint = viewportHeight;
                    const revealEndPoint = viewportHeight * 0.5;
                    const revealProgress = Math.min(1, Math.max(0, (revealStartPoint - top) / (revealStartPoint - revealEndPoint)));
                    
                    const scale = 1.05 - (0.05 * revealProgress);
                    const opacity = revealProgress;

                    setStyle({
                        transform: `translateY(${translateY}px) scale(${scale})`,
                        opacity: opacity,
                        willChange: 'transform, opacity',
                    });
                }
            }
        };

        const onScroll = () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            animationFrameId.current = requestAnimationFrame(handleScroll);
        };
        
        window.addEventListener('scroll', onScroll, { passive: true });
   
        requestAnimationFrame(handleScroll);
        
        return () => {
            window.removeEventListener('scroll', onScroll);
            if(animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [parallaxFactor]);

    return (
        <div ref={ref} className={className}>
             <div className="overflow-hidden rounded-md shadow-lg bg-brand-brown-light/10">
                <img 
                    src={src} 
                    alt={alt} 
                    className="w-full h-auto object-cover" 
                    style={style}
                />
            </div>
        </div>
    );
}


const EntrypointVertical: React.FC = () => {
    return (
        <section className="bg-cream text-brand-brown py-20 md:py-40">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 md:mb-24 max-w-3xl mx-auto">
                    <img 
                        src="https://www.savor.it/_nuxt/img/realfats.92a2113.svg" 
                        alt="Real fats, real flavor."
                        className="w-full h-auto mx-auto max-w-lg mb-6"
                    />
                    <p className="text-md sm:text-lg text-brand-brown-light">
                        All our old favorites, just made a different way.
                    </p>
                    <a href="#" className="mt-8 group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-transparent border border-brand-brown-light/50 px-8 py-3 text-sm font-medium text-brand-brown transition-all duration-300 hover:bg-brand-brown/5">
                        <span className="link-underline">Our Foods</span>
                    </a>
                </div>
                <div className="grid grid-cols-12 gap-y-12 md:gap-y-24 gap-x-8">
                    {images.map((img) => (
                       <ParallaxImage key={img.src} src={img.src} alt={img.alt} className={img.className} parallaxFactor={img.parallaxFactor}/>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EntrypointVertical;