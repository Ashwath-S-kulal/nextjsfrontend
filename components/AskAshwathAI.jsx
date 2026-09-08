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

// ── Helper to format inline markdown like **bold**, `code`, *italic* ──
function formatInline(str, baseKey = 'inline') {
  if (!str) return null;

  // Split tokens: **bold**, `code`, *italic*
  const tokenRegex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(str.substring(lastIndex, match.index));
    }
    const token = match[0];
    const key = `${baseKey}-${match.index}`;

    if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
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

// ── Main component ────────────────────────────────────────────────
export default function AskAshwathAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasOpened, setHasOpened] = useState(false);

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
            /* Expand from the exact bottom-right corner where the button is */
            initial={{ opacity: 0, scale: 0.04, borderRadius: '50%' }}
            animate={{ opacity: 1, scale: 1, borderRadius: '0%' }}
            exit={{ opacity: 0, scale: 0.04, borderRadius: '50%' }}
            transition={{ type: 'spring', stiffness: 220, damping: 28, mass: 1 }}
            style={{
              transformOrigin: 'calc(100% - 40px) calc(100% - 40px)',
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

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.10] flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white/65" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#050505]">
                      <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-70" />
                    </span>
                  </div>
                  <div>
                    <p className="font-heading text-sm font-bold text-white/90 leading-none">Ask Ashwath AI</p>
                    <p className="font-mono text-[10px] text-text-muted mt-0.5 tracking-wide">Portfolio assistant</p>
                  </div>
                </div>
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
                  <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus-within:border-white/[0.20] focus-within:bg-white/[0.05] transition-all duration-200">
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
                    Only answers questions about Ashwath S Kulal · Powered by Google Gemini
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating trigger button ─────────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="fab"
            id="ask-ashwath-ai-btn"
            onClick={handleOpen}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="fixed bottom-6 right-6 z-[9998] w-14 h-14 rounded-2xl flex items-center justify-center border border-white/[0.12] bg-[#111114] hover:bg-[#1c1c21] hover:border-white/25 transition-colors shadow-[0_8px_32px_rgba(0,0,0,0.8)]"
            aria-label="Open Ask Ashwath AI"
            aria-controls="ask-ashwath-ai-panel"
          >
            <MessageCircle className="w-5 h-5 text-white/80" />

            {/* Sparkle badge */}
            {!hasOpened && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.8, type: 'spring', stiffness: 500, damping: 18 }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-md"
              >
                <Sparkles className="w-3 h-3 text-black" />
              </motion.span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
