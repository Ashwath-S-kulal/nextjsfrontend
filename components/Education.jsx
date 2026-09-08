'use client';

import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Calendar, Award, BookOpen, CheckCircle2 } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { portfolio } from '@/data/portfolio';
import { fadeUp, staggerContainer } from '@/lib/animations';

export default function Education() {
  return (
    <section id="education" className="py-16 lg:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <SectionHeading
          number="05"
          subtitle="ACADEMIC BACKGROUND"
          title="Education & qualifications."
        />

        {/* Modern Modular Education Grid UI */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {portfolio.education.map((item, index) => (
            <motion.div
              key={item.degree}
              variants={fadeUp}
              className={`relative rounded-2xl bg-bg-panel border p-6 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] ${item.current
                  ? 'border-white/20 bg-gradient-to-b from-white/[0.04] to-transparent'
                  : 'border-white/5'
                }`}
            >
              <div>
                {/* Header: Period & Status Pill */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[11px] text-text-muted">
                    {item.period}
                  </span>
                  {item.current ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-white/[0.08] text-white border border-white/15">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      In Progress
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-text-muted bg-white/[0.02] border border-white/5">
                      <CheckCircle2 className="w-3 h-3 text-zinc-500" />
                      Completed
                    </span>
                  )}
                </div>

                {/* Degree Title */}
                <div className="flex items-start gap-3 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-text-primary font-heading leading-snug">
                      {item.degree}
                    </h3>
                    <div className="text-xs text-text-secondary mt-1">
                      {item.institution}
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs font-mono text-text-muted">
                  <MapPin className="w-3 h-3" />
                  <span>{item.location}</span>
                </div>


              </div>

              {/* Bottom Score Footer */}
              <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between">
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                  Academic Performance
                </span>
                <div className="inline-flex items-baseline gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-white font-mono text-xs font-bold">
                  <span>{item.score}</span>
                  <span className="text-[9px] text-text-muted font-normal uppercase">{item.scoreType}</span>
                </div>
              </div>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
