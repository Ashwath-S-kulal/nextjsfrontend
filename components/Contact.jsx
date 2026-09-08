'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Copy,
  Check,
  MessageSquare,
  ArrowUpRight,
  Send,
  MapPin,
  Sparkles,
  Radio
} from 'lucide-react';
import SectionHeading from './SectionHeading';
import { portfolio } from '@/data/portfolio';
import { fadeUp, staggerContainer } from '@/lib/animations';

const socialProfiles = [
  {
    name: 'GitHub',
    handle: '@Ashwath-S-kulal',
    url: portfolio.socials.github,
    color: '#ffffff',
    hoverText: 'hover:text-white',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    handle: 'in/ashwath-s',
    url: portfolio.socials.linkedin,
    color: '#0A66C2',
    hoverText: 'hover:text-[#0A66C2]',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    ),
  },
  {
    name: 'LeetCode',
    handle: 'ashwathkulal2004',
    url: portfolio.socials.leetcode,
    color: '#FFA116',
    hoverText: 'hover:text-[#FFA116]',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .666-1.607L9.36 7.77l4.135-4.206c.54-.54.54-1.414.003-1.955A1.37 1.37 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382H10.617z" />
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    handle: '+91 84312 94514',
    url: portfolio.socials.whatsapp,
    color: '#25D366',
    hoverText: 'hover:text-[#25D366]',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.35.99 2.51c.13.16 1.7 2.6 4.12 3.65.58.25 1.02.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.29-.25-.12-1.44-.71-1.66-.79-.22-.09-.39-.13-.55.13-.16.25-.64.79-.78.96-.14.16-.29.18-.54.06s-1.05-.39-2-1.23c-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43s.16-.25.25-.41c.08-.17.04-.31-.02-.44-.06-.12-.55-1.33-.76-1.82-.2-.48-.41-.41-.56-.42l-.48-.01z" />
      </svg>
    ),
  },
  {
    name: 'X (Twitter)',
    handle: '@Ashwath52870943',
    url: portfolio.socials.twitter,
    color: '#ffffff',
    hoverText: 'hover:text-white',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    handle: '@ashwath_kulal',
    url: portfolio.socials.instagram,
    color: '#E4405F',
    hoverText: 'hover:text-[#E4405F]',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    handle: 'Ashwath Kulal',
    url: portfolio.socials.facebook,
    color: '#1877F2',
    hoverText: 'hover:text-[#1877F2]',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

export default function Contact() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolio.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(portfolio.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  return (
    <section id="contact" className="py-8 sm:py-12 relative overflow-hidden">
      {/* Subtle Background Glow for ambiance */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Heading with Status Indicator */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-6 sm:mb-8 gap-4 border-b border-white/[0.08] pb-3">
          <SectionHeading
            number="06"
            subtitle="GET IN TOUCH"
            title="Let's connect and work together."
          />

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap items-center gap-3 text-xs font-mono text-text-muted"
          >


            <div className="flex items-center gap-1.5 text-text-secondary">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{portfolio.location}</span>
            </div>
          </motion.div>
        </div>

        {/* Medium-Sized Unboxed Interactive Channels */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="space-y-6 sm:space-y-8"
        >

          {/* Primary Communication Channels — Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* 1. Email Card */}
            <motion.div
              variants={fadeUp}
              className="relative group rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-xl p-5 sm:p-6 flex flex-col justify-between gap-5 overflow-hidden transition-all duration-300 hover:border-cyan-500/25 hover:bg-white/[0.04] hover:shadow-[0_0_40px_rgba(6,182,212,0.06)]"
            >
              {/* Subtle top glow on hover */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Top row: icon + label */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/15 group-hover:border-cyan-500/35 transition-all duration-300 flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-mono text-[15px] tracking-widest uppercase text-white/35 font-semibold">Email</p>
                  </div>
                </div>
              
              </div>

              {/* Email address */}
              <div>
                <a
                  href={`mailto:${portfolio.email}`}
                  className="text-sm sm:text-base font-semibold text-white/80 group-hover:text-white transition-colors duration-200 tracking-tight break-all leading-snug hover:text-cyan-300"
                >
                  {portfolio.email}
                </a>
              </div>

              {/* Action row */}
              <div className="flex items-center gap-2 pt-1 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-mono text-[11px] font-semibold text-white/50 bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all active:scale-95"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <a
                  href={`mailto:${portfolio.email}`}
                  className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg font-mono text-[11px] font-bold text-white bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 hover:border-cyan-500/40 hover:text-cyan-200 transition-all active:scale-95 group/btn ml-auto"
                >
                  <span>Compose</span>
                  <Send className="w-2.5 h-2.5 transition-transform group-hover/btn:translate-x-0.5" />
                </a>
              </div>
            </motion.div>

            {/* 2. WhatsApp Card */}
            <motion.div
              variants={fadeUp}
              className="relative group rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-xl p-5 sm:p-6 flex flex-col justify-between gap-5 overflow-hidden transition-all duration-300 hover:border-emerald-500/25 hover:bg-white/[0.04] hover:shadow-[0_0_40px_rgba(16,185,129,0.06)]"
            >
              {/* Subtle top glow on hover */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Top row: icon + label */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/15 group-hover:border-emerald-500/35 transition-all duration-300 flex-shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-mono text-[15px] tracking-widest uppercase text-white/35 font-semibold">WhatsApp</p>
                  </div>
                </div>
              </div>

              {/* Phone number */}
              <div>
                <span className="text-sm sm:text-base font-semibold text-white/80 group-hover:text-white transition-colors duration-200 tracking-tight">
                  {portfolio.phone}
                </span>
              </div>

              {/* Action row */}
              <div className="flex items-center gap-2 pt-1 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-mono text-[11px] font-semibold text-white/50 bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all active:scale-95"
                  title="Copy Phone Number"
                >
                  {copiedPhone ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <a
                  href={portfolio.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg font-mono text-[11px] font-bold text-white bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:text-emerald-200 transition-all active:scale-95 group/btn ml-auto"
                >
                  <span>Chat Now</span>
                  <ArrowUpRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </a>
              </div>
            </motion.div>

          </div>

          {/* 3. Open Digital Ecosystem & Social Network */}
          <motion.div variants={fadeUp} className="pt-1">
            <div className="flex items-center justify-between pb-2.5 mb-3 text-[11px] font-mono text-text-muted">
              <span className="uppercase tracking-widest text-zinc-300 font-bold">
                // PROFILES & ECOSYSTEM
              </span>
            </div>

            {/* Compact Unboxed Social Directory Flow */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {socialProfiles.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -1 }}
                  className="group flex items-center justify-between p-2 rounded-lg bg-white/[0.01] hover:bg-white/[0.04] border border-white/[0.04] hover:border-white/15 transition-all"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center bg-white/[0.03] border border-white/[0.06] group-hover:border-white/20 transition-colors flex-shrink-0"
                      style={{ color: social.color }}
                    >
                      {social.icon}
                    </div>
                    <span className={`text-xs font-semibold text-text-primary ${social.hoverText} transition-colors truncate`}>
                      {social.name}
                    </span>
                  </div>

                  <ArrowUpRight className="w-3 h-3 text-text-muted group-hover:text-white transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0 ml-1" />
                </motion.a>
              ))}
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}
