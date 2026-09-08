'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  MessageSquare,
  Terminal,
  Sparkles,
  MapPin,
  CheckCircle2,
  Code2
} from 'lucide-react';
import Image from 'next/image';
import { portfolio } from '@/data/portfolio';
import { fadeUp, staggerContainer } from '@/lib/animations';

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [consoleCommand, setConsoleCommand] = useState('');
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isTypingCmd, setIsTypingCmd] = useState(true);
  const [step, setStep] = useState(0);

  // Cycle animated roles
  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % portfolio.roles.length);
    }, 3400);
    return () => clearInterval(timer);
  }, []);

  // Terminal simulated execution sequence: first display cmd command, then display its out below
  useEffect(() => {
    const terminalScripts = [
      { cmd: 'npx create-next-app@latest', out: 'Next.js 15 App Architecture initialized' },
      { cmd: 'npm run build', out: '✓ Optimized production build generated' },
      { cmd: 'connect --db mongodb+srv://cluster.prod', out: 'MongoDB Atlas Connected (Operational)' },
      { cmd: 'deploy --target production', out: 'Deployed to Global Edge Network [Vercel]' },
    ];

    let isCancelled = false;

    const runScript = async () => {
      if (isCancelled) return;
      const current = terminalScripts[step % terminalScripts.length];

      // Reset for new command run
      setConsoleCommand('');
      setConsoleOutput('');
      setIsTypingCmd(true);

      // 1. First display the cmd command with typing effect
      for (let i = 0; i <= current.cmd.length; i++) {
        if (isCancelled) return;
        setConsoleCommand(current.cmd.substring(0, i));
        await new Promise((r) => setTimeout(r, 38));
      }

      setIsTypingCmd(false);

      // Small pause before output appears
      await new Promise((r) => setTimeout(r, 260));
      if (isCancelled) return;

      // 2. Display their out below
      setConsoleOutput(current.out);

      // Display both command and output together for comfortable reading
      await new Promise((r) => setTimeout(r, 2400));
      if (isCancelled) return;

      setStep((prev) => prev + 1);
    };

    runScript();

    return () => {
      isCancelled = true;
    };
  }, [step]);

  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center pt-24 pb-14 lg:pt-32 lg:pb-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* Left Column: Hero Copy & CTAs */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Status Pill */}
          

            {/* Main Heading */}
            <motion.h1
              variants={fadeUp}
              className="text-3xl sm:text-5xl lg:text-6xl pt-8 md:pt-10 font-bold tracking-tight text-white leading-[1.1] font-heading"
            >
              Hi, I&apos;m{' '}
              <span className="text-white">
                {portfolio.name}
              </span>
              .
            </motion.h1>

            {/* Animated Dynamic Role Subtitle */}
            <motion.div
              variants={fadeUp}
              className="mt-2 sm:mt-3 h-10 sm:h-12 flex items-center overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={roleIndex}
                  initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -18, filter: 'blur(4px)' }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight font-heading text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 inline-block drop-shadow-[0_2px_12px_rgba(255,255,255,0.08)]"
                >
                  {portfolio.roles[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            {/* Bio paragraph */}
            <motion.p
              variants={fadeUp}
              className="mt-3.5 text-xs sm:text-sm text-text-secondary leading-relaxed max-w-xl"
            >
              {portfolio.bio}
            </motion.p>



            {/* Social Links & Quick Connect */}
            <motion.div
              variants={fadeUp}
              className="mt-6 flex items-center gap-2"
            >
              <span className="font-mono text-[11px] text-text-muted mr-1.5 uppercase tracking-wider">CONNECT:</span>
              <a
                href={portfolio.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-text-secondary hover:text-white hover:border-white/20 transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={portfolio.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-text-secondary hover:text-white hover:border-white/20 transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${portfolio.email}`}
                aria-label="Send Email"
                className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-text-secondary hover:text-white hover:border-white/20 transition-all"
              >
                <Mail className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Quick Metrics Bar */}
            <motion.div
              variants={fadeUp}
              className="mt-8 grid grid-cols-3 gap-4 pt-5 border-t border-white/10 w-full max-w-lg"
            >
              {portfolio.stats.slice(0, 3).map((stat) => (
                <div key={stat.label} className="border-l border-white/10 pl-3.5">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-text-primary">
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column: Unique Multi-layer Interactive Developer Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center w-full"
          >
            {/* Free-Standing Unboxed Portrait & Interactive Terminal */}
            <div className="relative w-full max-w-[320px] sm:max-w-[360px] flex flex-col items-center">

              {/* Ambient Radiant Backlight Spotlight */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 sm:w-72 sm:h-72 bg-gradient-to-tr from-cyan-500/20 via-emerald-500/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

           

              {/* Free-Standing Cutout Photo (No Card Box!) */}
              <div className="relative w-full aspect-[5/5] [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]">
                <Image
                  src={portfolio.profileImage}
                  alt={`${portfolio.name} - ${portfolio.title}`}
                  fill
                  className="object-contain object-bottom hover:scale-105 transition-transform duration-700 ease-out drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>

              {/* Standalone Sleek Live Terminal Console (Directly below, no card container) */}
              <div className="w-full mt-1 p-2.5 sm:p-3 rounded-2xl bg-[#09090b]/80 border border-white/10 font-mono text-[10px] leading-relaxed backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/5 text-[9px] text-text-muted">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/80" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-1 text-zinc-400 font-mono">bash ~ portfolio</span>
                  </div>
                  <span className="text-emerald-400 font-bold tracking-wider text-[8.5px]">● LIVE</span>
                </div>

                {/* 1. First display the cmd command */}
                <div className="flex items-center gap-1.5 text-text-primary truncate">
                  <span className="text-emerald-400 font-bold">➜</span>
                  <span className="text-zinc-200 font-medium">{consoleCommand}</span>
                  {isTypingCmd && <span className="w-1.5 h-3 bg-emerald-400 inline-block animate-pulse" />}
                </div>

                {/* 2. Then display their out below */}
                {consoleOutput ? (
                  <motion.div
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-emerald-400/90 text-[9.5px] truncate pl-3 pt-0.5 flex items-center gap-1 font-mono"
                  >
                    <span className="text-emerald-500/70">↳</span>
                    <span>{consoleOutput}</span>
                  </motion.div>
                ) : (
                  <div className="h-[15px]" />
                )}
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
