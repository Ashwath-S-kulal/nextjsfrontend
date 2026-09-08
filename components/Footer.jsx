'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { portfolio } from '@/data/portfolio';

export default function Footer() {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setTimeString(new Intl.DateTimeFormat('en-US', options).format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/5 pt-12 pb-10 overflow-hidden bg-[#070709] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          
          {/* Brand & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <a href="#home" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-white/[0.05] border border-white/10 text-white font-mono font-bold text-[10px] flex items-center justify-center">
                AS
              </div>
              <span className="font-heading font-bold text-base text-text-primary">
                {portfolio.name}
              </span>
            </a>
           
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap justify-center gap-5 font-mono text-xs text-text-secondary">
            <a href="#about" className="hover:text-text-primary transition-colors">About</a>
            <a href="#skills" className="hover:text-text-primary transition-colors">Skills</a>
            <a href="#freelance" className="hover:text-text-primary transition-colors">Freelance</a>
            <a href="#projects" className="hover:text-text-primary transition-colors">Projects</a>
            <a href="#education" className="hover:text-text-primary transition-colors">Education</a>
            <a href="#contact" className="hover:text-text-primary transition-colors">Contact</a>
          </div>

          {/* Back to top button */}
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs text-text-secondary bg-white/[0.02] border border-white/10 hover:border-white/20 hover:text-white transition-all group"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3 h-3 transition-transform group-hover:-translate-y-0.5" />
          </button>

        </div>

        {/* Bottom Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-text-muted">
         
          <div className="text-center text-[11px]">
            © {new Date().getFullYear()} {portfolio.name}. All rights reserved.
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={portfolio.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
            <a
              href={portfolio.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
            <a
              href={`mailto:${portfolio.email}`}
              className="text-text-muted hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
