'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Github
} from 'lucide-react';
import Image from 'next/image';
import SectionHeading from './SectionHeading';
import { portfolio } from '@/data/portfolio';
import { fadeUp, staggerContainer } from '@/lib/animations';

export default function About() {
  return (
    <section id="about" className="py-16 lg:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <SectionHeading
          number="01"
          subtitle="ABOUT ME"
          title="Building software that solves real problems."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* Left Column: Developer ID & Photo Card */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-2xl bg-bg-panel/90 backdrop-blur-xl p-5 sm:p-6 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group hover:border-white/20 transition-all duration-300">

              {/* Photo & Identity info */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                  <Image
                    src={portfolio.profileImage}
                    alt={portfolio.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary font-heading">
                    {portfolio.name}
                  </h3>
                  <p className="font-mono text-[11px] text-text-muted mt-0.5 tracking-wider uppercase">
                    {portfolio.title}
                  </p>
                </div>
              </div>

              {/* Quote block */}
              <div className="mt-5 pl-3.5 border-l-2 border-white/30 italic text-xs text-text-secondary leading-relaxed bg-white/[0.01] py-1.5 rounded-r-lg">
                &ldquo;{portfolio.quote}&rdquo;
              </div>

              {/* Live Status Indicator */}
              <div className="mt-5 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px] text-text-secondary">
                  {portfolio.availability}
                </span>
              </div>

              {/* Key stats row in card */}
              <div className="mt-6 pt-5 border-t border-white/5 grid grid-cols-2 gap-3">
                <div>
                  <span className="block font-mono text-base font-bold text-text-primary">
                    8.61 CGPA
                  </span>
                  <span className="block font-mono text-[9px] text-text-muted uppercase mt-0.5">
                    Academic Distinction
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-base font-bold text-white">
                    06+ Platforms
                  </span>
                  <span className="block font-mono text-[9px] text-text-muted uppercase mt-0.5">
                    Production Shipped
                  </span>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Right Column: Bio Narrative, Details Grid & Stats */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="lg:col-span-7 flex flex-col justify-between"
          >
            {/* Bio Narrative */}
            <motion.div variants={fadeUp} className="space-y-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
              <p>
                Hi, I&apos;m <strong className="text-text-primary font-semibold">Ashwath S</strong>, a Computer Science Engineering graduate from S D M Institute of Technology, Ujire. I&apos;m passionate about frontend development and enjoy creating clean, intuitive, and user-friendly digital experiences.
              </p>
              <p>
                I enjoy solving problems through code and building products that are simple, useful, and enjoyable to use. I focus on writing clean code and creating experiences that leave a positive impression on users.
              </p>
            </motion.div>

            {/* Quick Details Key-Value Grid */}
            <motion.div
              variants={fadeUp}
              className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-4 rounded-xl bg-bg-panel border border-white/5"
            >
              {portfolio.personalDetails.map((detail) => (
                <div
                  key={detail.label}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.03]"
                >
                  <span className="font-mono text-[11px] text-text-muted uppercase">
                    {detail.label}
                  </span>
                  <span className="font-medium text-xs text-text-primary">
                    {detail.value}
                  </span>
                </div>
              ))}
            </motion.div>



          </motion.div>

        </div>
      </div>
    </section>
  );
}
