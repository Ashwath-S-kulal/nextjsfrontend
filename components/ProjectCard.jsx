'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { fadeUp } from '@/lib/animations';

export default function ProjectCard({ project, onOpenDetails }) {
  return (
    <div
      className="relative h-full rounded-2xl bg-bg-panel border border-white/5 backdrop-blur-xl p-5 flex flex-col justify-between group hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300 overflow-hidden"
    >
      <div>
        {/* Preview image banner */}
        <div
          onClick={() => onOpenDetails(project)}
          className="relative h-44 sm:h-48 w-full rounded-xl overflow-hidden cursor-pointer border border-white/5 mb-4 group/item"
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover/item:scale-105"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-panel via-transparent to-transparent opacity-75" />
          
          {project.badge && (
            <div className="absolute top-2.5 left-2.5">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-black/80 text-white border border-white/10 backdrop-blur-md">
                {project.badge}
              </span>
            </div>
          )}
        </div>

        {/* Category Tag */}
        <span className="font-mono text-[10px] text-text-muted tracking-wider uppercase font-semibold">
          {project.tag}
        </span>

        {/* Title */}
        <h3
          onClick={() => onOpenDetails(project)}
          className="text-base font-bold text-text-primary mt-1 cursor-pointer hover:text-white transition-colors font-heading"
        >
          {project.title}
        </h3>

        {/* Short description */}
        <p className="mt-2 text-xs text-text-secondary line-clamp-2 leading-relaxed">
          {project.shortDesc}
        </p>

        {/* Tech Stack Chips */}
        <div className="mt-3.5 flex flex-wrap gap-1">
          {project.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded font-mono text-[10px] bg-white/[0.03] text-text-secondary border border-white/5"
            >
              {tech}
            </span>
          ))}
          {project.stack.length > 4 && (
            <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-white/[0.02] text-text-muted border border-white/5">
              +{project.stack.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Footer link row */}
      <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-5">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-text-primary hover:text-white inline-flex items-center gap-1 transition-colors"
            >
              <span>Live</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-text-muted hover:text-text-primary inline-flex items-center gap-1 transition-colors"
            >
              <span>Source</span>
              <Github className="w-3 h-3" />
            </a>
          )}
        </div>

        <button
          type="button"
          onClick={() => onOpenDetails(project)}
          className="font-mono text-xs text-text-secondary hover:text-white inline-flex items-center gap-1"
        >
          <span>Details</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
