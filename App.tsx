import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import StoryCanvas from './components/Features';
import EntrypointVertical from './components/PhoneScrollSection';
import SScrollSection from './components/SScrollSection';
import FullBleedBanner from './components/Testimonials';
import PressGrid from './components/DownloadCTA';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="bg-cream text-brand-brown font-sans">
      <Header />
      <main>
        <div data-nav-color="cream"><Hero /></div>
        <div data-nav-color="brown" id="process"><StoryCanvas /></div>
        <div data-nav-color="brown"><EntrypointVertical /></div>
        <div data-nav-color="cream"><SScrollSection /></div>
        <div data-nav-color="cream"><FullBleedBanner /></div>
        <div data-nav-color="cream"><PressGrid /></div>
        <div data-nav-color="brown"><Footer /></div>
      </main>
    </div>
  );
};

export default App;