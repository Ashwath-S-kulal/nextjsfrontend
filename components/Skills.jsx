'use client';

import { motion } from 'framer-motion';
import {
  Layout,
  Server,
  Cpu,
  Code,
  Wrench,
  Layers
} from 'lucide-react';
import SectionHeading from './SectionHeading';
import { portfolio } from '@/data/portfolio';
import { fadeUp, staggerContainer } from '@/lib/animations';

const iconMap = {
  Layout: Layout,
  Server: Server,
  Cpu: Cpu,
  Code: Code,
  Wrench: Wrench,
};

export default function Skills() {
  return (
    <section id="skills" className="py-16 lg:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <SectionHeading
          number="02"
          subtitle="TECHNICAL SKILLS"
          title="Technologies and tools I work with."
        />

        {/* Skills Cards Grid - Auto-balanced 6-column system to eliminate empty gaps on odd counts */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5"
        >
          {portfolio.skills.map((category, index) => {
            const total = portfolio.skills.length;
            // When total is 5: first 3 take 2 cols each (row 1 = 6 cols), last 2 take 3 cols each (row 2 = 6 cols)
            // On md (2 cols), the last odd item spans across 2 cols so no empty gap exists
            const lgSpan = total === 5
              ? (index < 3 ? 'lg:col-span-2' : 'lg:col-span-3')
              : (total % 3 === 2 && index >= total - 2)
                ? 'lg:col-span-3'
                : (total % 3 === 1 && index === total - 1)
                  ? 'lg:col-span-6'
                  : 'lg:col-span-2';

            const mdSpan = (total % 2 !== 0 && index === total - 1) ? 'md:col-span-2' : 'md:col-span-1';

            return (
              <motion.div
                key={category.id}
                variants={fadeUp}
                className={`relative rounded-2xl bg-bg-panel border border-white/5 p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 group hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)] ${mdSpan} ${lgSpan} flex flex-col justify-between`}
              >

                <div>
                  {/* Title and Category Header */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base sm:text-lg font-bold text-text-primary font-heading">
                      {category.category}
                    </h3>
                  </div>

                  {/* Skill Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/[0.02] text-text-secondary border border-white/[0.06] hover:border-white/25 hover:text-white transition-colors duration-150"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
