'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download } from 'lucide-react';
import Image from 'next/image';
import { portfolio } from '@/data/portfolio';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Freelance', href: '#freelance' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const sections = navItems.map((item) => item.href.substring(1));
      const scrollPosition = window.scrollY + 180;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('close-modals'));
      window.dispatchEvent(new CustomEvent('close-project-modal'));
      document.body.style.overflow = 'unset';
    }
    setMobileMenuOpen(false);

    setTimeout(() => {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }, 40);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled
          ? 'py-2.5 bg-[#050505]/90 backdrop-blur-xl  '
          : 'py-5 bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo / Brand with Profile Picture */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 ring-1 ring-white/10 group-hover:border-white/40 group-hover:scale-105 transition-all shadow-sm flex-shrink-0 bg-white/5">
              <Image
                src="/images/profilepicture1.jpeg"
                alt={portfolio.name}
                fill
                className="object-cover"
                sizes="32px"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-mono font-bold text-xs tracking-wider text-text-primary group-hover:text-white transition-colors">
                {portfolio.name.toUpperCase()}
              </span>
            </div>
          </a>

          {/* Desktop Floating Navigation Pill */}
          <nav className="hidden lg:flex items-center gap-0.5 px-2.5 py-1 rounded-full bg-[#111114]/90 border border-white/10 backdrop-blur-xl shadow-lg">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative px-3.5 py-1 text-[11px] font-mono tracking-wider transition-colors duration-150 rounded-full ${isActive
                    ? 'text-black font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                    }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavTab"
                      className="absolute inset-0 rounded-full bg-white shadow-sm -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action CTA & Mobile Menu Toggle */}
          <div className="flex items-center gap-2.5">
            <a
              href="/resume/Resume Ashwath_S.pdf"
              download="Resume_Ashwath_S.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-mono font-semibold tracking-wider text-text-primary bg-white/[0.05] border border-white/10 hover:bg-white hover:text-black transition-all duration-200 group"
            >
              <span>RESUME</span>
              <Download className="w-3 h-3 transition-transform group-hover:translate-y-0.5" />
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-text-primary hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full Screen Animated Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-[#050505]/98 backdrop-blur-2xl lg:hidden flex flex-col justify-center px-6 py-16"
          >
            <div className="flex flex-col gap-4 max-w-xs mx-auto w-full">
              <span className="font-mono text-[10px] text-text-muted tracking-widest uppercase">
                // NAVIGATION
              </span>
              {navItems.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`text-xl font-bold font-heading transition-colors ${activeSection === item.href.substring(1)
                    ? 'text-white'
                    : 'text-text-secondary hover:text-text-primary'
                    }`}
                >
                  <span className="font-mono text-xs text-text-muted mr-2.5">
                    0{index + 1}.
                  </span>
                  {item.label}
                </a>
              ))}

              <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-2.5">
                <a
                  href="/resume/Resume Ashwath_S.pdf"
                  download="Resume_Ashwath_S.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-2.5 rounded-xl font-mono text-xs font-bold text-black bg-white hover:bg-zinc-200 transition-all shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD RESUME</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
