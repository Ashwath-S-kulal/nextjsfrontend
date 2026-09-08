'use client';

import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const fadeSlideUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const lineVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const ghostVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};

export default function SectionHeading({ number, subtitle, align = 'left' }) {
  const isCenter = align === 'center';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className={`relative pt-6 sm:pt-8 mb-10 sm:mb-14 ${isCenter ? 'text-center' : 'text-left'}`}
    >
      {/* Ghost oversized background number for depth */}
      {number && (
        <motion.span
          variants={ghostVariants}
          aria-hidden="true"
          className={`hidden md:inline absolute -top-3 sm:-top-5 select-none pointer-events-none font-heading font-black text-[3rem] sm:text-[5rem] leading-none text-white/[0.035] tracking-tighter ${
            isCenter ? 'left-1/2 -translate-x-1/2' : '-left-1 sm:-left-2'
          }`}
        >
          {number}
        </motion.span>
      )}

      {/* Label pill: index + section name */}
      <motion.div
        variants={fadeSlideUp}
        className={`inline-flex items-center gap-2 mb-3 ${isCenter ? 'justify-center' : ''}`}
      >
        {number && (
          <span className="font-mono text-[12px] font-bold tracking-widest text-white/40 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-full uppercase">
            {number}
          </span>
        )}
        <span className="font-mono text-[12px] text-white/25 select-none">/</span>
        <span className="font-mono text-[12px] font-semibold tracking-[0.2em] uppercase text-white/50">
          {subtitle}
        </span>
      </motion.div>

      {/* Gradient accent line */}
      <motion.div
        variants={lineVariants}
        style={{ originX: isCenter ? 0.5 : 0 }}
        className={`h-px bg-gradient-to-r from-white/50 via-white/15 to-transparent ${
          isCenter ? 'mx-auto w-24' : 'w-16 sm:w-20'
        }`}
      />
    </motion.div>
  );
}
