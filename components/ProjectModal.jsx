'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ExternalLink,
  Github,
  CheckCircle2,
  Layers,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Images,
  Sparkles
} from 'lucide-react';
import Image from 'next/image';

export default function ProjectModal({ project, onClose }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const snapshots = project?.images && project.images.length > 0
    ? project.images
    : (project?.image ? [project.image] : []);

  useEffect(() => {
    setActiveImageIndex(0);
    setIsFullscreen(false);
  }, [project]);

  const handlePrev = useCallback(() => {
    if (snapshots.length <= 1) return;
    setActiveImageIndex((prev) => (prev === 0 ? snapshots.length - 1 : prev - 1));
  }, [snapshots.length]);

  const handleNext = useCallback(() => {
    if (snapshots.length <= 1) return;
    setActiveImageIndex((prev) => (prev === snapshots.length - 1 ? 0 : prev + 1));
  }, [snapshots.length]);

  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [project, onClose, isFullscreen, handlePrev, handleNext]);

  if (!project) return null;

  const currentSnapshot = snapshots[activeImageIndex] || project.image;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-40 w-full h-full bg-[#050505] overflow-y-auto flex flex-col pt-14 sm:pt-16"
    >
      {/* Sticky Top Header Bar with Close Button */}
      <div className="sticky top-0 z-30 flex items-center justify-end px-6 sm:px-12 py-3">
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white border border-white/10 transition-all hover:scale-105 active:scale-95"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Full-Screen Body Container */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 pb-6 sm:pb-8 space-y-8">

        {/* Title & Tag Area */}
        <div className="border-b border-white/10 pb-5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono text-text-muted mb-2">
            <span>{project.tag}</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-1 font-heading">
            {project.title}
          </h1>
          <p className="mt-2.5 text-xs sm:text-sm text-text-secondary max-w-3xl leading-relaxed">
            {project.shortDesc}
          </p>
        </div>

        {/* TOP ROW: Snapshot on Left + Tech Stack on Right side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Left Side: Snapshot Viewport with same width and height proportions (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Images className="w-3.5 h-3.5 text-zinc-300" />
                <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Project UI Snapshot
                </h3>
              </div>
              <span className="font-mono text-[11px] text-text-secondary bg-white/[0.04] px-2 py-0.5 rounded border border-white/10">
                {String(activeImageIndex + 1).padStart(2, '0')} / {String(snapshots.length).padStart(2, '0')}
              </span>
            </div>

            {/* Main Snapshot Frame with fixed clean aspect ratio */}
            <div className="relative w-full aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0c] shadow-2xl group select-none flex flex-col">

              {/* Window Top Bar */}
              <div className="flex items-center justify-between px-3 py-1.5 bg-black/60 border-b border-white/5 text-[10px] font-mono text-text-muted">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/70" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
                  <div className="w-2 h-2 rounded-full bg-green-500/70" />
                </div>
                <span className="text-[10px] text-zinc-400 truncate max-w-[220px] md:max-w-full">
                  {project.title.toLowerCase().replace(/\s+/g, '-')}-preview
                </span>
                <div className="w-8" />
              </div>

              {/* Image Container */}
              <div className="relative flex-1 w-full overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSnapshot}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.01 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={currentSnapshot}
                      alt={`${project.title} - Snapshot ${activeImageIndex + 1}`}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 1024px) 100vw, 700px"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Prev / Next Navigation Arrows */}
                {snapshots.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      aria-label="Previous snapshot"
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-lg"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={handleNext}
                      aria-label="Next snapshot"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-lg"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </>
                )}

                {/* Fullscreen Expand Action */}
                <button
                  onClick={() => setIsFullscreen(true)}
                  aria-label="View fullscreen snapshot"
                  className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-black/70 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-all hover:scale-105"
                  title="Expand preview"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Thumbnail Carousel Strip */}
            {snapshots.length > 1 && (
              <div className="flex items-center justify-start sm:justify-start gap-2 overflow-x-auto pb-1 pt-1 pl-1 no-scrollbar scroll-smooth">
                {snapshots.map((imgSrc, idx) => {
                  const isActive = idx === activeImageIndex;
                  return (
                    <button
                      key={imgSrc + idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative flex-shrink-0 w-14 sm:w-16 h-9 sm:h-10 rounded-lg overflow-hidden border transition-all duration-150 ${isActive
                          ? 'border-white ring-1 ring-white/50 scale-[1.04] shadow-md opacity-100'
                          : 'border-white/10 opacity-40 hover:opacity-85 hover:border-white/30'
                        }`}
                    >
                      <Image
                        src={imgSrc}
                        alt={`Snapshot ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 60px, 70px"
                      />
                      <div className="absolute top-0.5 left-1 px-1 py-0.2 rounded bg-black/80 font-mono text-[8px] text-white">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Side: Tech Stack Box right near to the snapshot (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="p-5 sm:p-6 rounded-2xl bg-bg-panel/90 border border-white/10 backdrop-blur-xl h-full flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/5">
                  <h3 className="font-mono text-xs text-white uppercase tracking-wider font-semibold flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-white" />
                    <span>Engineered With</span>
                  </h3>
                  <span className="text-[10px] font-mono text-text-muted bg-white/[0.04] px-2 py-0.5 rounded border border-white/5">
                    {project.stack.length} Technologies
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-xl font-mono text-xs bg-white/[0.04] text-text-primary border border-white/10 hover:border-white/25 hover:bg-white/[0.08] transition-all"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Spec Highlights */}
              <div className="mt-6 pt-4 border-t border-white/5 space-y-2 text-xs font-mono text-text-muted">
                <div className="flex items-center justify-between">
                  <span>CATEGORY</span>
                  <span className="text-white">{project.categories ? project.categories.join(' · ') : project.tag}</span>
                </div>
               
                <div className="flex items-center justify-between">
                  <span>STATUS</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Production Ready
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* BELOW AREA: Architecture Description & All Features */}
        <div className="space-y-8 pt-6 border-t border-white/10">

          {/* Deep Architectural Breakdown */}
          <div>
            <h2 className="font-mono text-xs text-white uppercase tracking-wider mb-3 font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4 text-white" />
              <span>Architecture & Deep Overview</span>
            </h2>
            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed whitespace-pre-line">
                {project.longDesc || project.shortDesc}
              </p>
            </div>
          </div>

          {/* Key Shipped Features Checklist */}
          {project.features && project.features.length > 0 && (
            <div>
              <h2 className="font-mono text-xs text-white uppercase tracking-wider mb-4 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>All Key Features & Capabilities ({project.features.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {project.features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors text-xs sm:text-sm text-text-secondary leading-normal"
                  >
                    <CheckCircle2 className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* BOTTOM RIGHT: 2 Action Buttons on the bottom right side */}
        <div className="pt-6 pb-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono text-text-muted">
            // READY TO TEST & REVIEW
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-medium text-text-primary bg-white/[0.03] border border-white/10 hover:border-white/25 hover:bg-white/[0.06] transition-all active:scale-95"
              >
                <Github className="w-4 h-4" />
                <span>Git Repository</span>
              </a>
            )}

            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-mono text-xs font-semibold text-black bg-white hover:bg-zinc-200 transition-all shadow-md active:scale-95"
              >
                <span>Launch Live </span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-10 inset-0 z-[70] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-between p-4 sm:p-8"
          >
            {/* Lightbox Header */}
            <div className="w-full flex items-center justify-between z-10 pb-4">
              <div className="flex items-center gap-3">
               
                <span className="font-mono text-xs text-text-muted">
                  Snapshot {activeImageIndex + 1} of {snapshots.length}
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

            {/* Lightbox Main Image */}
            <div className="relative w-full flex-1 max-w-7xl max-h-[80vh] my-auto flex items-center justify-center">
              <Image
                src={currentSnapshot}
                alt={`${project.title} - Snapshot ${activeImageIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />

              {snapshots.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    aria-label="Previous snapshot"
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-transform hover:scale-110 shadow-2xl"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next snapshot"
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-transform hover:scale-110 shadow-2xl"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Lightbox Bottom Thumbnails */}
            {snapshots.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pt-4 max-w-full no-scrollbar">
                {snapshots.map((imgSrc, idx) => (
                  <button
                    key={'fs-' + imgSrc + idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-10 rounded-lg overflow-hidden border transition-all ${idx === activeImageIndex
                        ? 'border-white ring-2 ring-white/50 scale-105 opacity-100'
                        : 'border-white/20 opacity-40 hover:opacity-80'
                      }`}
                  >
                    <Image
                      src={imgSrc}
                      alt={`Thumb ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
