'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  Globe,
  Server,
  Check,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Wifi,
  Battery,
  Layers,
  Cpu,
  ShieldCheck
} from 'lucide-react';
import Image from 'next/image';
import SectionHeading from './SectionHeading';
import { portfolio } from '@/data/portfolio';
import { fadeUp } from '@/lib/animations';

export default function Freelance() {
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('mobile');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const data = portfolio.freelance;
  const screenshots = data.images || [];

  const handlePrev = useCallback(() => {
    if (screenshots.length <= 1) return;
    setActiveScreenIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  }, [screenshots.length]);

  const handleNext = useCallback(() => {
    if (screenshots.length <= 1) return;
    setActiveScreenIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
  }, [screenshots.length]);

  // Listen for navigation clicks across the site to close lightbox
  useEffect(() => {
    const handleClose = () => {
      setIsFullscreen(false);
    };
    window.addEventListener('close-modals', handleClose);
    window.addEventListener('close-project-modal', handleClose);
    return () => {
      window.removeEventListener('close-modals', handleClose);
      window.removeEventListener('close-project-modal', handleClose);
    };
  }, []);

  // Keyboard navigation & body scroll lock for phone screens
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  const currentScreenshot = screenshots[activeScreenIndex] || screenshots[0];

  return (
    <section id="freelance" className="py-12 lg:py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className="mb-8">
          <SectionHeading
            number="03"
            subtitle="MY FREELANCE"
            title="Dual-platform commercial ecosystem."
          />
        </div>

        {/* Borderless Single-Screen Grid Layout */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"
        >

          {/* Left: Sleek Android Device Frame */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[190px] sm:max-w-[220px]">

              {/* Device Chassis */}
              <div className="relative rounded-[28px] sm:rounded-[32px] p-2 bg-[#141417] border border-zinc-700/70 shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden">

                {/* Screen Frame */}
                <div className="relative rounded-[20px] sm:rounded-[24px] overflow-hidden bg-black aspect-[9/19.5] flex flex-col border border-zinc-800">

                  {/* Status Bar */}
                  <div className="relative z-20 flex items-center justify-between px-3 pt-1 pb-0.5 text-[8px] font-mono text-zinc-400 select-none">
                    <span className="font-semibold">09:24</span>

                    {/* Punch Hole */}
                    <div className="w-2 h-2 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                      <div className="w-0.5 h-0.5 rounded-full bg-zinc-900" />
                    </div>

                    <div className="flex items-center gap-1 text-zinc-400">
                      <Wifi className="w-2 h-2" />
                      <Battery className="w-2.5 h-2.5" />
                    </div>
                  </div>

                  {/* Screenshot Viewport */}
                  <div className="relative flex-1 w-full overflow-hidden bg-zinc-950 select-none">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentScreenshot}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="relative w-full h-full"
                      >
                        <Image
                          src={currentScreenshot}
                          alt={`App Screenshot ${activeScreenIndex + 1}`}
                          fill
                          className="object-cover"
                          sizes="220px"
                          priority
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation Arrows */}
                    {screenshots.length > 1 && (
                      <>
                        <button
                          onClick={handlePrev}
                          aria-label="Previous screen"
                          className="absolute left-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/60 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-all active:scale-90"
                        >
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                        <button
                          onClick={handleNext}
                          aria-label="Next screen"
                          className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/60 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-all active:scale-90"
                        >
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </>
                    )}

                    {/* Maximize */}
                    <button
                      onClick={() => setIsFullscreen(true)}
                      aria-label="Expand preview"
                      className="absolute bottom-1.5 right-1.5 p-1 rounded-md bg-black/70 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-all hover:scale-105"
                      title="View Fullscreen"
                    >
                      <Maximize2 className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  {/* Android Gesture Bar */}
                  <div className="relative z-20 py-1 flex justify-center bg-black">
                    <div className="w-12 h-0.5 rounded-full bg-zinc-600" />
                  </div>

                </div>
              </div>

              {/* Screen Counter */}
              <div className="mt-2 flex items-center justify-between px-1 text-[10px] font-mono">
                <span className="text-text-muted flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-zinc-400" />
                  <span>Android & iOS</span>
                </span>
                <span className="text-text-secondary bg-white/[0.04] px-1.5 py-0.2 rounded border border-white/10">
                  {String(activeScreenIndex + 1).padStart(2, '0')} / {String(screenshots.length).padStart(2, '0')}
                </span>
              </div>

              {/* Compact Thumbnail Carousel */}

            </div>
            {screenshots.length > 1 && (
              <div className="mt-2 flex items-center justify-center gap-1 flex-wrap">
                {screenshots.map((imgSrc, idx) => {
                  const isActive = idx === activeScreenIndex;
                  return (
                    <button
                      key={imgSrc + idx}
                      onClick={() => setActiveScreenIndex(idx)}
                      className={`relative w-4 h-7 sm:w-5 sm:h-8 rounded overflow-hidden border transition-all ${isActive
                          ? 'border-white ring-1 ring-white/50 scale-105 opacity-100'
                          : 'border-white/10 opacity-40 hover:opacity-80'
                        }`}
                      title={`Screen ${idx + 1}`}
                    >
                      <Image
                        src={imgSrc}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="20px"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Architecture, Highlights & Specs */}
          <div className="lg:col-span-7 space-y-4">

            {/* Header badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Commercial Contract
              </span>
              <span className="text-[11px] font-mono text-text-muted">
                {data.timeline}
              </span>
              <span className="text-[10px] font-mono text-text-muted bg-white/[0.03] px-2 py-0.5 rounded border border-white/5">
                MERN + React Native
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
                {data.title}
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary mt-1.5 leading-relaxed">
                {data.description}
              </p>
            </div>

            {/* Dynamic Architecture Tabs */}
            <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/10 w-fit">
              <button
                type="button"
                onClick={() => setActiveTab('mobile')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[10px] md:text-xs transition-all ${activeTab === 'mobile'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-text-muted hover:text-white'
                  }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>Mobile App</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('web')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[10px] md:text-xs transition-all ${activeTab === 'web'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-text-muted hover:text-white'
                  }`}
              >
                <Globe className="w-3 h-3" />
                <span>Website</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[10px] md:text-xs transition-all ${activeTab === 'admin'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-text-muted hover:text-white'
                  }`}
              >
                <Server className="w-3 h-3" />
                <span>Admin Side</span>
              </button>
            </div>

            {/* Tab Features Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'mobile' && (
                <motion.div
                  key="mob-tab"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {data.features[0].points.slice(0, 10).map((pt, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-text-secondary"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {data.mobileStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md font-mono text-[11px] bg-white/[0.03] text-text-primary border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'web' && (
                <motion.div
                  key="web-tab"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {data.features[0].points.slice(0, 10).map((pt, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-text-secondary"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>Storefront: {pt}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {data.webStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md font-mono text-[11px] bg-white/[0.03] text-text-primary border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'admin' && (
                <motion.div
                  key="admin-tab"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {data.features[1].points.slice(0, 10).map((pt, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-text-secondary"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {data.webStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md font-mono text-[11px] bg-white/[0.03] text-text-primary border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center gap-3">
              <span className="text-[11px] font-mono text-text-muted">
                {data.note}
              </span>
            </div>

          </div>

        </motion.div>

      </div>

      {/* Fullscreen Screenshot Lightbox Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-between p-4 sm:p-8 pt-16 sm:pt-20"
          >
            <div className="w-full flex items-center justify-between z-10 pb-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-white font-semibold">
                  {data.title} — Mobile Screenshot
                </span>
                <span className="font-mono text-xs text-text-muted">
                  Screen {activeScreenIndex + 1} of {screenshots.length}
                </span>
              </div>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close fullscreen preview"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative w-full flex-1 max-w-sm max-h-[85vh] my-auto flex items-center justify-center">
              <Image
                src={currentScreenshot}
                alt={`Screenshot ${activeScreenIndex + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />

              {screenshots.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    aria-label="Previous screen"
                    className="absolute -left-12 sm:-left-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-transform hover:scale-110 shadow-2xl"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next screen"
                    className="absolute -right-12 sm:-right-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-transform hover:scale-110 shadow-2xl"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {screenshots.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pt-4 max-w-full no-scrollbar">
                {screenshots.map((imgSrc, idx) => (
                  <button
                    key={'fs-freelance-' + imgSrc + idx}
                    onClick={() => setActiveScreenIndex(idx)}
                    className={`relative w-8 h-14 rounded-md overflow-hidden border transition-all ${idx === activeScreenIndex
                        ? 'border-white ring-2 ring-white/50 scale-105 opacity-100'
                        : 'border-white/20 opacity-40 hover:opacity-80'
                      }`}
                  >
                    <Image
                      src={imgSrc}
                      alt={`Thumb ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
