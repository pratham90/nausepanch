import React, { useState, useEffect, useRef } from 'react';

const SavorWordReveal: React.FC<{ text: string }> = ({ text }) => {
    const ref = useRef<HTMLHeadingElement>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const el = ref.current;
            if (!el) return;

            const { top } = el.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
          
            const animStartPoint = viewportHeight;

            const animEndPoint = viewportHeight * 0.2;
            const animRange = animStartPoint - animEndPoint;

       
            const currentProgress = 1 - Math.max(0, Math.min(1, (top - animEndPoint) / animRange));
            
            setProgress(currentProgress);
        };
        
        let animationFrameId: number | null = null;
        const onScroll = () => {
             if (animationFrameId) cancelAnimationFrame(animationFrameId);
             animationFrameId = requestAnimationFrame(handleScroll);
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', onScroll);
            if(animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const textChars = text.split('');
    const numChars = textChars.length;

    const fadeDuration = 0.5;
   
    const staggerRange = 1.0 - fadeDuration;

    return (
        <h1
            ref={ref}
            className="font-serif text-[35vw] md:text-[30vw] lg:text-[28vw] leading-none text-brand-brown select-none flex justify-center"
            style={{ 
                transform: 'scaleY(1.5)',
            }}
            aria-label={text}
        >
            {textChars.map((char, index) => {
      
                const revealPoint = (index / (numChars - 1)) * staggerRange;
                

                const charProgress = Math.max(0, Math.min(1, (progress - revealPoint) / fadeDuration));
                
                return (
                    <span 
                        key={index}
                        style={{
                            opacity: charProgress,
                            willChange: 'opacity',
                            display: 'inline-block'
                        }}
                    >
                        {char}
                    </span>
                );
            })}
        </h1>
    );
};


const Footer: React.FC = () => {
    const navLinks1 = ["Home", "Process", "Foods", "Mission", "Journal", "Contact"];
    const navLinks2 = ["LinkedIn", "Instagram"];
    const legalLinks = ["Press Kit", "Terms of Service", "Privacy Policy"];
    
    return (
        <footer className="bg-cream text-brand-brown pt-16 md:pt-24 pb-8 overflow-hidden">
            <div className="container mx-auto px-6">
                
              
                <div className="flex flex-col md:flex-row justify-between items-start text-sm mb-24 md:mb-32">
                    <div className="flex gap-x-12 sm:gap-x-20">
                        <ul className="space-y-3">
                            {navLinks1.map(link => (
                                <li key={link}><a href="#" className="hover:opacity-70 transition-opacity"><span className="link-underline">{link}</span></a></li>
                            ))}
                        </ul>
                         <ul className="space-y-3">
                            {navLinks2.map(link => (
                                <li key={link}><a href="#" className="hover:opacity-70 transition-opacity"><span className="link-underline">{link}</span></a></li>
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

                <div className="relative text-center w-full my-16 md:my-24">
                     <SavorWordReveal text="savor" />
                </div>

            
                 <div className="mt-12 md:mt-16 border-t border-brand-brown/20 pt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-brand-brown-light/80">
                    <div className="flex flex-wrap gap-x-4 justify-center md:justify-start">
                         {legalLinks.map(link => (
                            <a key={link} href="#" className="hover:text-brand-brown"><span className="link-underline">{link}</span></a>
                        ))}
                    </div>
                    <div className="text-center">
                        <a href="mailto:hello@savor.it" className="hover:text-brand-brown"><span className="link-underline">hello@savor.it</span></a>
                    </div>
                    <p className="text-center md:text-right">©Savor {new Date().getFullYear()}.</p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;