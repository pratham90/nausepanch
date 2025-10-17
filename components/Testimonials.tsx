import React, { useRef, useEffect, useState } from 'react';

const FullBleedBanner: React.FC = () => {
    const videoSrc = "https://cdn.sanity.io/files/jqzja4ip/production/a7d85349545161042732050113c41180b545f474.mp4";
    const posterSrc = "https://cdn.sanity.io/images/jqzja4ip/production/e7f1a34b2049d470559f21396f866b17c240970a-3840x2160.png?w=1440&fm=webp&q=90";
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.error("Testimonial video autoplay was prevented:", error);
            });
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);
    
    return (
        <section 
            ref={sectionRef}
            className="h-[75vh] md:h-[85vh] relative flex items-center justify-center text-center overflow-hidden"
        >
            <video
                ref={videoRef}
                className="absolute top-0 left-0 w-full h-full object-cover scale-105"
                autoPlay
                loop
                muted
                playsInline
                poster={posterSrc}
            >
                <source src={videoSrc} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-brand-brown/30 via-brand-brown/40 to-brand-brown/50"></div>
            <div 
                className="relative z-10 px-4 w-full max-w-5xl transition-all duration-1000 ease-out"
                style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(40px)'
                }}
            >
                <img 
                    src="https://www.savor.it/_nuxt/img/delicious.373a7dc.svg" 
                    alt="The future tastes delicious"
                    className="w-full h-auto"
                />
            </div>
        </section>
    );
};

export default FullBleedBanner;