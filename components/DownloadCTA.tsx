
import React from 'react';

const pressLogosRow1 = [
  { src: "https://cdn.sanity.io/images/jqzja4ip/production/c29def4130ee692d10d71b21e99f0e5b99d58a5b-239x34.png", alt: "Fast Company" },
  { src: "https://cdn.sanity.io/images/jqzja4ip/production/8bb146d504917b4e623b16a6d92ee6db0de563ab-154x39.png", alt: "Axios" },
  { src: "https://cdn.sanity.io/images/jqzja4ip/production/6ecfa3bbc6dbee17ef47df7512f87c562d588a86-216x40.png", alt: "Bloomberg" },
  { src: "https://cdn.sanity.io/images/jqzja4ip/production/5c527190401eb308047a2910ec70e4fa90472db2-198x65.png", alt: "The Guardian" },
];

const pressLogosRow2 = [
  { src: "https://cdn.sanity.io/images/jqzja4ip/production/0b40e98f3a62125adb3e0dac8e6a65eeff673c21-2400x754.png", alt: "Time" },
  { src: "https://cdn.sanity.io/images/jqzja4ip/production/b2aa764655d47529fcf774b42cf98cd909495b4f-2400x1916.png", alt: "CNBC" },
];

interface Logo {
    src: string;
    alt: string;
}

const LogoBox: React.FC<{ logo: Logo; className?: string; imgClassName?: string; isStatic?: boolean }> = ({ logo, className, imgClassName, isStatic = false }) => {
    const boxColor = 'bg-[#FBF4E4]'; 
    
    return (
        <div className={`flex justify-center items-center ${className || ''}`}>
            <div className={`p-4 sm:p-6 transition-colors duration-300 ease-in-out ${isStatic ? boxColor : 'hover:bg-[#FBF4E4]'}`}>
                <img 
                    src={logo.src} 
                    alt={logo.alt} 
                    className={`w-auto ${imgClassName}`}
                />
            </div>
        </div>
    );
};


const PressGrid: React.FC = () => {
    return (
        <section className="bg-cream text-brand-brown py-20 md:py-24">
            <div className="container mx-auto px-4">
                <h3 className="text-center font-serif text-4xl md:text-5xl mb-20">In the press</h3>
                
                <div className="flex flex-col items-center max-w-4xl mx-auto">
                
                    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 items-center">
                        {pressLogosRow1.map((logo) => (
                           <LogoBox key={logo.alt} logo={logo} imgClassName="max-h-8" />
                        ))}
                    </div>
                    
                 
                    <div className="mt-16 w-full max-w-lg grid grid-cols-2 gap-x-8 items-center justify-items-center">
                       {pressLogosRow2.map((logo) => (
                           <LogoBox 
                                key={logo.alt} 
                                logo={logo}
                                imgClassName="max-h-12"
                                isStatic={logo.alt === 'Time'}
                                className={logo.alt === 'Time' ? 'w-full max-w-[200px]' : ''}
                           />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PressGrid;
