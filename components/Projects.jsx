'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from './SectionHeading';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import { portfolio } from '@/data/portfolio';

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = ['ALL', 'FULL STACK', 'AI & ML', 'FRONTEND'];

  // Listen for navigation clicks across the site to close project modal
  useEffect(() => {
    const handleCloseModal = () => {
      setSelectedProject(null);
    };

    window.addEventListener('close-project-modal', handleCloseModal);
    return () => {
      window.removeEventListener('close-project-modal', handleCloseModal);
    };
  }, []);

  const filteredProjects = portfolio.projects.filter((p) => {
    if (activeFilter === 'ALL') return true;

    // Check explicit categories array
    if (p.categories && Array.isArray(p.categories)) {
      if (p.categories.includes(activeFilter)) return true;
    }

    // Fallback tag matching
    const tagLower = (p.tag || '').toLowerCase();
    if (activeFilter === 'FULL STACK') return tagLower.includes('full stack') || tagLower.includes('mern');
    if (activeFilter === 'AI & ML') return tagLower.includes('ai') || tagLower.includes('machine learning') || tagLower.includes('ml');
    if (activeFilter === 'FRONTEND') return tagLower.includes('frontend') || tagLower.includes('motion') || tagLower.includes('showcase');

    return true;
  });

  return (
    <section id="projects" className="py-16 lg:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading with Category Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-5">
          <SectionHeading
            number="04"
            subtitle="MY PROJECTS"
            title="Featured projects I've built."
          />

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-xl h-fit">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`px-3 py-1 rounded-lg font-mono text-[11px] tracking-wider transition-all duration-150 ${activeFilter === cat
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Unified Projects Grid with Staggered Entrance Animation on Every Filter Change */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={`${activeFilter}-${project.id}`}
                variants={{
                  hidden: { opacity: 0, y: 22, scale: 0.95 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
                className="h-full"
              >
                <ProjectCard
                  project={project}
                  onOpenDetails={setSelectedProject}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Full-Screen Deep Dive Modal */}
        <AnimatePresence>
          {selectedProject && (
            <ProjectModal
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
