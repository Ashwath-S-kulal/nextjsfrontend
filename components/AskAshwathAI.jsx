'use client';


import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

// ── Suggested questions ───────────────────────────────────────────
const SUGGESTED_QUESTIONS = [
  'Who is Ashwath?',
  "What are Ashwath's skills?",
  'Tell me about his projects',
  'What technologies does he use?',
  'What is his education?',
  'How can I contact Ashwath?',
];

// ── Initial greeting ──────────────────────────────────────────────
const INITIAL_MESSAGE = {
  role: 'model',
  parts: [
    {
      text: "Hi! I'm Ashwath's portfolio assistant \n Ask me anything about Ashwath — his skills, projects, education, or experience.",
    },
  ],
};

// ── Typing animation ──────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-white/35"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -5, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ── Helper to format inline markdown like [link](url), raw URLs, **bold**, `code`, *italic* ──
function formatInline(str, baseKey = 'inline') {
  if (!str) return null;

  // Match markdown links, bold, code, italic, and raw URLs
  const tokenRegex = /(\[[^\]]+\]\((?:https?:\/\/[^\s)]+|mailto:[^\s)]+)\)|\*\*.*?\*\*|`.*?`|\*.*?\*|https?:\/\/[^\s<>)"]+)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(str.substring(lastIndex, match.index));
    }
    const token = match[0];
    const key = `${baseKey}-${match.index}`;

    if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
      const linkMatch = token.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)$/);
      if (linkMatch) {
        const [, linkText, href] = linkMatch;
        parts.push(
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 font-medium text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-400/50 hover:decoration-cyan-300 transition-colors cursor-pointer group"
          >
            <span>{linkText}</span>
            <ExternalLink className="w-3 h-3 inline-block shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
          </a>
        );
      } else {
        parts.push(token);
      }
    } else if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
      parts.push(
        <strong key={key} className="font-semibold text-white/95">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
      parts.push(
        <code key={key} className="px-1.5 py-0.5 rounded bg-white/[0.08] font-mono text-[13px] text-white/90">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
      parts.push(
        <em key={key} className="italic text-white/85">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('http://') || token.startsWith('https://')) {
      parts.push(
        <a
          key={key}
          href={token}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 font-medium text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-400/50 hover:decoration-cyan-300 transition-colors break-all cursor-pointer group"
        >
          <span>{token}</span>
          <ExternalLink className="w-3 h-3 inline-block shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
        </a>
      );
    } else {
      parts.push(token);
    }
    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < str.length) {
    parts.push(str.substring(lastIndex));
  }

  return parts.length > 0 ? parts : str;
}

// ── Formatted Model Message with clean indentation & custom bullets ──
function FormattedModelMessage({ text }) {
  if (!text) return null;

  const lines = text.split(/\r?\n/);
  const elements = [];
  let currentList = null; // { type: 'bullet' | 'numbered', items: [] }

  const flushList = () => {
    if (currentList) {
      elements.push(currentList);
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Check for bullet list item: starts with -, *, or •
    const bulletMatch = rawLine.match(/^(\s*)([-*•])\s+(.*)$/);
    // Check for numbered list item: starts with 1. or 1)
    const numberMatch = rawLine.match(/^(\s*)(\d+)[.)]\s+(.*)$/);

    if (bulletMatch) {
      const isSub = bulletMatch[1].length >= 2;
      if (!currentList || currentList.type !== 'bullet') {
        flushList();
        currentList = { type: 'bullet', items: [] };
      }
      currentList.items.push({ text: bulletMatch[3], isSub });
    } else if (numberMatch) {
      if (!currentList || currentList.type !== 'numbered') {
        flushList();
        currentList = { type: 'numbered', items: [] };
      }
      currentList.items.push({ num: numberMatch[2], text: numberMatch[3] });
    } else {
      flushList();
      elements.push({ type: 'paragraph', text: trimmed });
    }
  }
  flushList();

  return (
    <div className="space-y-2.5 text-[14.5px] leading-relaxed text-text-secondary">
      {elements.map((el, idx) => {
        if (el.type === 'paragraph') {
          return (
            <p key={idx} className="leading-relaxed">
              {formatInline(el.text, `p-${idx}`)}
            </p>
          );
        }

        if (el.type === 'bullet') {
          return (
            <ul key={idx} className="space-y-2 my-1.5 pl-1">
              {el.items.map((item, itemIdx) => (
                <li
                  key={itemIdx}
                  className={`flex items-start gap-2.5 ${item.isSub ? 'pl-5' : 'pl-1'}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/45 mt-2 shrink-0" />
                  <span className="flex-1 leading-relaxed text-[14px]">
                    {formatInline(item.text, `b-${idx}-${itemIdx}`)}
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        if (el.type === 'numbered') {
          return (
            <ol key={idx} className="space-y-2 my-1.5 pl-1">
              {el.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2.5 pl-1">
                  <span className="font-mono text-xs text-white/50 mt-0.5 shrink-0 min-w-[16px]">
                    {item.num}.
                  </span>
                  <span className="flex-1 leading-relaxed text-[14px]">
                    {formatInline(item.text, `n-${idx}-${itemIdx}`)}
                  </span>
                </li>
              ))}
            </ol>
          );
        }

        return null;
      })}
    </div>
  );
}

// ── Chat bubble ───────────────────────────────────────────────────
function ChatBubble({ role, text, isNew }) {
  const isUser = role === 'user';
  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: 16, scale: 0.96 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center border ${
        isUser
          ? 'bg-white/[0.08] border-white/[0.15]'
          : 'bg-white/[0.04] border-white/[0.08]'
      }`}>
        {isUser
          ? <User className="w-4 h-4 text-white/65" />
          : <Bot className="w-4 h-4 text-white/55" />
        }
      </div>

      {/* Bubble */}
      <div className={`max-w-[85%] sm:max-w-[72%] px-5 py-3.5 rounded-2xl break-words ${
        isUser
          ? 'bg-white/[0.09] border border-white/[0.13] text-white/90 rounded-br-sm text-[15px] leading-relaxed whitespace-pre-wrap'
          : 'bg-white/[0.04] border border-white/[0.08] text-text-secondary rounded-bl-sm shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
      }`}>
        {isUser ? (
          <div className="whitespace-pre-wrap leading-relaxed">{text}</div>
        ) : (
          <FormattedModelMessage text={text} />
        )}
      </div>
    </motion.div>
  );
}

// ── Hanging Bot Trigger Component (Movement & Physics) ─────────────
function HangingBot({ onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      key="hanging-bot"
      initial={{ y: -190, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        rotate: [-4.5, 4.5, -4.5],
      }}
      exit={{
        y: -190,
        opacity: 0,
        transition: { duration: 0.35, ease: 'easeInOut' },
      }}
      transition={{
        y: { type: 'spring', stiffness: 140, damping: 13 },
        opacity: { duration: 0.4 },
        rotate: {
          repeat: Infinity,
          duration: 3.8,
          ease: 'easeInOut',
        },
      }}
      style={{ transformOrigin: 'top center' }}
      className="fixed top-0 right-8 sm:right-8 md:right-12 z-[9990] flex flex-col items-center select-none cursor-pointer group pointer-events-auto"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label="Open Ashwath AI Chatbot"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Ceiling Mount */}
      <div className="w-3.5 h-1.5 rounded-b-md bg-zinc-700/90 border-x border-b border-white/20 shadow-sm" />

      {/* Hanging Cable / Wire with animated energy pulse */}
      <div className="w-[1.5px] h-16 sm:h-20 bg-gradient-to-b from-white/20 via-white/40 to-white/70 relative">
        <motion.div
          className="w-1.5 h-1.5 -left-[2px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] absolute"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Wire Hook Ring */}
      <div className="w-3 h-3 rounded-full border-2 border-white/40 -mb-1 bg-transparent" />

      {/* Bot Antenna */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <span className="w-2.5 h-2.5 rounded-full bg-white block shadow-[0_0_8px_rgba(255,255,255,0.85)]" />
          <span className="animate-ping absolute -inset-0.5 rounded-full bg-white opacity-50" />
        </div>
        <div className="w-1 h-2 bg-zinc-500 -mt-0.5" />
      </div>

      {/* Bot Body Chassis - Sleek Blackish Dark Cyber Look */}
      <motion.div
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        className="relative flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-[#18181c] via-[#0e0e11] to-[#050507] border border-white/15 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.9),0_0_15px_rgba(255,255,255,0.05)] group-hover:border-white/35 group-hover:shadow-[0_12px_35px_rgba(0,0,0,0.95),0_0_20px_rgba(255,255,255,0.12)] transition-all duration-300"
      >
        {/* Glow backdrop inside body */}
        <div className="absolute inset-0 rounded-2xl bg-white/[0.03] blur-sm pointer-events-none" />

        {/* Side Ear Bolts */}
        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-4 rounded-l-md bg-zinc-800 border-l border-y border-white/20" />
        <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-4 rounded-r-md bg-zinc-800 border-r border-y border-white/20" />

        {/* Visor Screen */}
        <div className="relative w-full h-7 rounded-xl bg-black border border-white/20 flex items-center justify-center gap-2 overflow-hidden shadow-inner">
          {/* Subtle visor scanlines */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:100%_3px] pointer-events-none" />

          {/* Animated Blinking Eyes */}
          <motion.div
            className={`w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)] z-10 transition-all ${
              isHovered ? 'scale-125 bg-zinc-100 shadow-[0_0_12px_rgba(255,255,255,1)]' : ''
            }`}
            animate={
              isHovered
                ? { scaleY: [1, 0.2, 1] }
                : {
                    scaleY: [1, 1, 0.1, 1, 1],
                    scaleX: [1, 1, 1.2, 1, 1],
                  }
            }
            transition={{
              duration: isHovered ? 0.6 : 3.4,
              repeat: Infinity,
              times: isHovered ? undefined : [0, 0.9, 0.93, 0.96, 1],
            }}
          />
          <motion.div
            className={`w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)] z-10 transition-all ${
              isHovered ? 'scale-125 bg-zinc-100 shadow-[0_0_12px_rgba(255,255,255,1)]' : ''
            }`}
            animate={
              isHovered
                ? { scaleY: [1, 0.2, 1] }
                : {
                    scaleY: [1, 1, 0.1, 1, 1],
                    scaleX: [1, 1, 1.2, 1, 1],
                  }
            }
            transition={{
              duration: isHovered ? 0.6 : 3.4,
              repeat: Infinity,
              times: isHovered ? undefined : [0, 0.9, 0.93, 0.96, 1],
            }}
          />
        </div>

        {/* Bottom Propulsion Thruster */}
        <div className="absolute -bottom-1.5 flex items-center gap-1">
          <motion.span
            animate={{ opacity: [0.4, 0.9, 0.4], height: [3, 5, 3] }}
            transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
            className="w-2 rounded-b-full bg-white/70 shadow-[0_0_6px_rgba(255,255,255,0.6)]"
          />
        </div>
      </motion.div>

      {/* Floating Tooltip / Speech Bubble */}
      <motion.div
        initial={{ opacity: 0, x: 8 }}
        animate={{
          opacity: isHovered ? 1 : 0.85,
          x: isHovered ? 0 : 2,
        }}
        className="absolute top-24 sm:top-28 right-full mr-2.5 pointer-events-none transition-all duration-200 hidden sm:flex items-center"
      >
        <div className="relative px-3 py-1.5 rounded-xl bg-[#0a0a0d]/95 border border-white/20 text-white shadow-[0_6px_25px_rgba(0,0,0,0.85)] backdrop-blur-md flex items-center gap-1.5 whitespace-nowrap">
          <span className="font-heading text-[11px] font-medium tracking-wide text-white/90">
            ASK AI!
          </span>
          {/* Arrow */}
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-[#0a0a0d] border-t border-r border-white/20 rotate-45" />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function AskAshwathAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasOpened, setHasOpened] = useState(false);
  const [blockingModals, setBlockingModals] = useState({});

  // Listen for modals (e.g. ProjectModal, Freelance screenshot lightbox) requesting to hide the hanging bot
  useEffect(() => {
    const handleToggle = (e) => {
      const { id, open } = e.detail || {};
      if (!id) return;
      setBlockingModals((prev) => {
        if (open) {
          if (prev[id]) return prev;
          return { ...prev, [id]: true };
        } else {
          if (!prev[id]) return prev;
          const next = { ...prev };
          delete next[id];
          return next;
        }
      });
    };

    window.addEventListener('toggle-hanging-bot', handleToggle);
    return () => {
      window.removeEventListener('toggle-hanging-bot', handleToggle);
    };
  }, []);

  const isBlocked = Object.keys(blockingModals).length > 0;

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  // Auto-scroll
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [history, isLoading, isOpen, scrollToBottom]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 500);
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Send message
  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading) return;

    setInput('');
    setError(null);

    const userTurn = { role: 'user', parts: [{ text: trimmed }] };
    setHistory(prev => [...prev, userTurn]);
    setIsLoading(true);

    const historyForServer = [...history, userTurn]
      .filter(h => h !== INITIAL_MESSAGE)
      .slice(0, -1);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history: historyForServer }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Something went wrong.');
      setHistory(prev => [...prev, { role: 'model', parts: [{ text: data.reply }] }]);
    } catch (err) {
      setError(err?.message || "Sorry, I'm having trouble responding right now. Please try again.");
      setHistory(prev => prev.filter(h => h !== userTurn));
    } finally {
      setIsLoading(false);
    }
  }, [input, history, isLoading]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleOpen = () => { setHasOpened(true); setIsOpen(true); };
  const handleClose = () => setIsOpen(false);

  // Global events & Cmd+K / Ctrl+K shortcut listener
  useEffect(() => {
    const handleOpenEvent = (e) => {
      setHasOpened(true);
      setIsOpen(true);
      const initialQuestion = e?.detail?.question;
      if (initialQuestion) {
        setTimeout(() => {
          sendMessage(initialQuestion);
        }, 120);
      }
    };
    const handleCloseEvent = () => setIsOpen(false);

    window.addEventListener('open-ask-ai', handleOpenEvent);
    window.addEventListener('close-modals', handleCloseEvent);

    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) setHasOpened(true);
          return !prev;
        });
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      window.removeEventListener('open-ask-ai', handleOpenEvent);
      window.removeEventListener('close-modals', handleCloseEvent);
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [sendMessage]);

  const hasSentMessage = history.some(h => h.role === 'user');

  return (
    <>
      {/* ── Fullscreen overlay ──────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="fullscreen"
            id="ask-ashwath-ai-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Ask Ashwath AI"
            /* Expand smoothly from bottom-center */
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28, mass: 0.9 }}
            style={{
              transformOrigin: 'center bottom',
              background: '#050505',
            }}
            className="fixed inset-0 z-[9999] flex flex-col"
          >
            {/* Subtle background grid matching portfolio */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />
            {/* Ambient glow top-left */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

            {/* ── Top header bar ─────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex-shrink-0 flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/[0.07]"
            >
              {/* Left: Back + branding */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleClose}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-text-muted hover:text-white hover:bg-white/[0.05] border border-transparent hover:border-white/10 transition-all group"
                  aria-label="Close chat"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                  <span className="font-mono text-xs tracking-wider hidden sm:inline">BACK</span>
                </button>

                <div className="h-5 w-px bg-white/[0.08]" />

              </div>

              {/* Right: Status pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.07]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="font-mono text-[10px] text-text-muted tracking-widest">ONLINE</span>
              </div>
            </motion.div>

            {/* ── Chat area ──────────────────────────────────────── */}
            <div className="relative z-10 flex-1 flex flex-col min-h-0">
              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto"
                style={{ overscrollBehavior: 'contain' }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="max-w-3xl mx-auto px-4 sm:px-8 py-8 space-y-5"
                >
                  {history.map((h, i) => (
                    <ChatBubble
                      key={i}
                      role={h.role}
                      text={h.parts[0]?.text || ''}
                      isNew={i === history.length - 1 && i > 0}
                    />
                  ))}

                  {/* Loading */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-end gap-3"
                    >
                      <div className="flex-shrink-0 w-9 h-9 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white/55" />
                      </div>
                      <div className="px-5 py-3.5 rounded-2xl rounded-bl-sm bg-white/[0.04] border border-white/[0.08]">
                        <TypingDots />
                      </div>
                    </motion.div>
                  )}

                  {/* Error */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="px-5 py-3 rounded-2xl bg-red-500/[0.08] border border-red-500/[0.15] text-sm text-red-400/80 font-mono text-center max-w-md mx-auto"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </motion.div>
              </div>

              {/* ── Suggested questions ─────────────────────────── */}
              <AnimatePresence>
                {!hasSentMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: 0.35, duration: 0.35 }}
                    className="flex-shrink-0 max-w-3xl w-full mx-auto px-4 sm:px-8 pb-4"
                  >
                    <p className="font-mono text-[10px] text-text-muted tracking-widest uppercase mb-3">
                      // Suggested questions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => sendMessage(q)}
                          disabled={isLoading}
                          className="px-4 py-2 rounded-full font-mono text-xs text-text-secondary bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Input bar ────────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex-shrink-0 border-t border-white/[0.07] bg-[#050505]"
              >
                <div className="max-w-3xl mx-auto px-4 sm:px-8 py-4">
                  <div className="flex items-center gap-3 px-5 py-2 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus-within:border-white/[0.20] focus-within:bg-white/[0.05] transition-all duration-200">
                    <input
                      ref={inputRef}
                      id="ask-ashwath-input"
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask anything about Ashwath…"
                      maxLength={800}
                      disabled={isLoading}
                      autoComplete="off"
                      className="flex-1 bg-transparent text-[15px] text-white/90 placeholder:text-text-muted outline-none font-body disabled:opacity-50"
                      aria-label="Type your question"
                    />
                    <motion.button
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || isLoading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.88 }}
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.07] border border-white/[0.12] text-white/65 hover:text-white hover:bg-white/[0.15] hover:border-white/30 transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <p className="mt-2 text-center font-mono text-[9px] text-white/12 tracking-widest select-none uppercase">
                    Only answers questions about Ashwath S Kulal
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hanging Bot Trigger on Screen ── */}
      <AnimatePresence>
        {!isOpen && !isBlocked && <HangingBot onClick={handleOpen} />}
      </AnimatePresence>
    </>
  );
}
