import React, { useState, useEffect, useRef } from 'react';
import { SavorLogo } from './icons';

const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [navColor, setNavColor] = useState('text-cream');
    const [isBgVisible, setIsBgVisible] = useState(false);
    const [isAtTop, setIsAtTop] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsAtTop(currentScrollY < 10);
            setIsScrolled(currentScrollY > 20);
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setIsHidden(true); 
                setIsHidden(false); 
            }
            lastScrollY.current = currentScrollY;
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const colorAttr = entry.target.getAttribute('data-nav-color');
                        if (colorAttr === 'brown') {
                            setNavColor('text-brand-brown');
                            setIsBgVisible(true);
                        } else {
                            setNavColor('text-cream');
                            setIsBgVisible(false);
                        }
                    }
                });
            },
            { rootMargin: '-50% 0px -50% 0px' }
        );

        const sections = document.querySelectorAll('[data-nav-color]');
        sections.forEach((section) => observer.observe(section));

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            sections.forEach((section) => observer.unobserve(section));
        };
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
    }, [menuOpen]);
    
    const headerTextColor = navColor;
    const headerBgClass = isAtTop ? '' : isBgVisible ? 'bg-cream/90 backdrop-blur-sm shadow-sm' : 'bg-black/20 backdrop-blur-sm';

    const navLinks = ["Process", "Foods", "Mission", "Journal", "Contact"];

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBgClass} ${isHidden && !menuOpen ? '-translate-y-full' : 'translate-y-0'}`}>
                <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        <div className="flex-shrink-0">
                            <a href="#" aria-label="Home" className="flex items-end gap-2">
                                <SavorLogo className={`h-8 w-auto transition-colors duration-300 ${headerTextColor}`} />
                                <span className={`text-xs font-mono tracking-tighter -mb-1 transition-colors duration-300 ${headerTextColor}`}>1.00</span>
                            </a>
                        </div>
                        <nav className="hidden md:block">
                            <div className="flex items-baseline space-x-2">
                                {navLinks.map(link => (
                                    <a key={link} href="#" className={`${headerTextColor} hover:bg-white/10 text-sm font-medium transition-colors duration-300 px-4 py-2 rounded-md`}>
                                        {link}
                                    </a>
                                ))}
                            </div>
                        </nav>
                        <div className="md:hidden">
                            <button onClick={() => setMenuOpen(true)} className={`${headerTextColor} font-medium text-sm transition-colors duration-300`} aria-label="Open menu">Menu</button>
                        </div>
                    </div>
                </div>
            </header>
            
            <div className={`fixed inset-0 z-[100] bg-brand-brown transition-transform duration-500 ease-in-out md:hidden ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                 <div className="flex items-center justify-between h-20 px-4 sm:px-6">
                    <a href="#" aria-label="Home" onClick={() => setMenuOpen(false)}>
                        <SavorLogo className="h-8 w-auto text-cream" />
                    </a>
                    <button onClick={() => setMenuOpen(false)} className="text-cream font-medium text-sm" aria-label="Close menu">Close</button>
                 </div>
                 <nav className="flex flex-col items-center justify-center h-[calc(100%-5rem)] text-cream text-4xl space-y-10 font-serif">
                    {navLinks.map(link => (
                         <a key={link} href="#" onClick={() => setMenuOpen(false)} className="transition-transform hover:scale-105">{link}</a>
                    ))}
                 </nav>
            </div>
        </>
    );
};
export default Header;