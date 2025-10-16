import React, { useRef, useEffect } from 'react';
import heroVideo from '../assets/hero.mov';

const Hero: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.error("Hero video autoplay was prevented:", error);
            });
        }
    }, []);

    return (
        <section className="h-screen w-full relative overflow-hidden flex items-center justify-center">
         
            <div className="absolute inset-0">
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    src={heroVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60"></div>
            </div>

          
            

            <div className="relative z-10 w-full max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center">
                    <div className="w-full md:w-1/2 order-2 md:order-1">
                        <h1 className="font-serif text-cream leading-none tracking-tight">
                            <span className="block text-[3.4rem] sm:text-[4.8rem] md:text-[6.5rem] lg:text-[8rem] xl:text-[9rem] whitespace-nowrap">Feel good fats</span>
                            <span className="block text-[2.2rem] sm:text-[2.8rem] md:text-[3.6rem] lg:text-[4.4rem] xl:text-[5rem] mt-6 md:mt-10 lg:mt-14">from scratch</span>
                        </h1>
                    </div>

                    <div className="w-full md:w-1/2 order-1 md:order-2 flex flex-col items-start md:items-end gap-6 justify-center">
                        <p className="text-cream/80 text-base md:text-lg max-w-xs md:max-w-[320px]">
                            Pure, versatile, sustainably-made fats
                        </p>

                        <div className="mt-4">
                            <button className="bg-cream text-brown py-3 px-6 rounded-md shadow-md hover:opacity-95">Watch — Episode</button>
                        </div>
                    </div>
                </div>

                <a href="#process" aria-label="Scroll to next section" className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/80 hover:text-cream transition-colors group z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 animate-bounce-slow">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                    <span className="text-xs tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity">Our Process</span>
                </a>
            </div>
        </section>
    );
};

export default Hero;