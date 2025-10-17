import React, { useEffect, useRef, useState } from 'react';

const processSteps = [
    {
        image: "https://cdn.sanity.io/images/jqzja4ip/production/a180c39f450d2cc846adbcede2940a1170a47743-4608x2592.jpg?rect=113,0,4383,2592&w=793&h=469&fm=webp&q=90",
        title: "Cultured & Fermented",
        description: "We start with a simple culture, feeding it a precise blend of water and agricultural inputs. Through fermentation, we create a rich, flavorful fat that forms the foundation of all our products.",
        align: 'left'
    },
    {
        image: "https://cdn.sanity.io/images/jqzja4ip/production/226d3f7cd9e45264d5bf5de0003c68d61c9998b-5500x3684.jpg?rect=0,216,5500,3253&w=793&h=469&fm=webp&q=90",
        title: "Washed & Refined",
        description: "Our fats are gently washed and refined using a proprietary, all-natural process. This purifies the product, resulting in a clean, neutral base with a beautiful texture and unparalleled performance.",
        align: 'right'
    },
    {
        image: "https://cdn.sanity.io/images/jqzja4ip/production/29cecd77efbdc0e3e5def3c30ae7a368de55281a-2880x1920.png?rect=0,109,2880,1703&w=793&h=469&fm=webp&q=90",
        title: "Ready to Create",
        description: "The result is a versatile, high-performance fat that's ready for any culinary application. From flaky pastries to creamy sauces, Savor provides the taste and functionality chefs demand, without compromise.",
        align: 'left'
    }
];

const AnimatedContentBlock: React.FC<{ item: typeof processSteps[0] }> = ({ item }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            animationFrameId.current = requestAnimationFrame(() => {
                if (ref.current) {
                    const rect = ref.current.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                  
                    const start = windowHeight * 0.85;
                    const end = windowHeight * 0.25;
                    const rawProgress = (start - rect.top) / (start - end);
                    setProgress(Math.max(0, Math.min(1, rawProgress)));
                }
            });
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []);

    const isImageLeft = item.align === 'left';

    const easedProgress = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const imageStyle: React.CSSProperties = {
        opacity: easedProgress,
        transform: `translateX(${isImageLeft ? (-50 * (1 - easedProgress)) : (50 * (1 - easedProgress))}px) translateY(${20 * (1 - easedProgress)}px)`,
        transition: 'none',
        willChange: 'transform, opacity'
    };

    const textStyle: React.CSSProperties = {
        opacity: easedProgress,
        transform: `translateX(${isImageLeft ? (50 * (1 - easedProgress)) : (-50 * (1 - easedProgress))}px) translateY(${20 * (1 - easedProgress)}px)`,
        transition: 'none',
        willChange: 'transform, opacity'
    };

    return (
        <div 
            ref={ref}
            className={`flex flex-col md:flex-row items-center gap-12 md:gap-20 ${isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
        >
            <div className="w-full md:w-1/2" style={imageStyle}>
                <img src={item.image} alt={item.title} className="rounded-lg shadow-xl w-full" />
            </div>
            <div className="w-full md:w-1/2" style={textStyle}>
                <h3 className="font-serif text-3xl md:text-4xl mb-4">{item.title}</h3>
                <p className="text-brand-brown-light text-base md:text-lg">{item.description}</p>
            </div>
        </div>
    );
};


const SScrollSection: React.FC = () => {
    return (
        <section className="bg-cream text-brand-brown py-24 md:py-40">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                <div className="text-center mb-24 md:mb-36">
                    <h2 className="font-serif text-5xl md:text-6xl mb-6">How it's made</h2>
                    <p className="text-brand-brown-light text-lg md:text-xl">A process that's better for you, and the planet.</p>
                </div>

                <div className="space-y-32 md:space-y-48">
                    {processSteps.map((step, index) => (
                        <AnimatedContentBlock key={index} item={step} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SScrollSection;