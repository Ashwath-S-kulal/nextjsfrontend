/**
 * app/api/chat/route.js
 *
 * Server-side API route. Handles chat requests from the AskAshwathAI
 * component. Uses Google Gemini (free-tier flash model) with a strict
 * portfolio-only system instruction.
 *
 * The GEMINI_API_KEY is read from the server environment and is NEVER
 * exposed to the browser.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildSystemInstruction } from '@/lib/portfolioContext';
import { NextResponse } from 'next/server';

// ── Constants (free-tier optimised) ────────────────────────────────
const MODEL_NAME = 'gemini-3.5-flash-lite'; // fast, free-tier flash model
const MAX_OUTPUT_TOKENS = 256;               // enforce short concise answers
const MAX_MESSAGE_LENGTH = 800;             // chars per user message
const MAX_HISTORY_PAIRS = 8;               // max back-and-forth pairs sent
const MAX_HISTORY_CHARS = 4000;            // total history character budget

// Simple in-process rate limiter (best-effort; resets on cold start)
const rateLimitMap = new Map(); // ip -> { count, resetAt }
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 15;  // per window per IP

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  entry.count += 1;
  return true;
}

// Keep the map from growing unboundedly
function pruneLimitMap() {
  const now = Date.now();
  for (const [key, val] of rateLimitMap) {
    if (now > val.resetAt) rateLimitMap.delete(key);
  }
}

export async function POST(request) {
  // ── Rate limiting ─────────────────────────────────────────────────
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  pruneLimitMap();
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment before trying again.' },
      { status: 429 }
    );
  }

  // ── Parse & validate body ─────────────────────────────────────────
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request format.' },
      { status: 400 }
    );
  }

  const { message, history } = body;

  // Validate message
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json(
      { error: 'Message cannot be empty.' },
      { status: 400 }
    );
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: 'Message is too long. Please keep it under 800 characters.' },
      { status: 400 }
    );
  }

  // Validate & sanitise history
  const rawHistory = Array.isArray(history) ? history : [];

  // Take only recent pairs and enforce character budget
  let sanitisedHistory = rawHistory
    .filter(
      (h) =>
        h &&
        (h.role === 'user' || h.role === 'model') &&
        Array.isArray(h.parts) &&
        h.parts.length > 0 &&
        typeof h.parts[0]?.text === 'string'
    )
    .slice(-MAX_HISTORY_PAIRS * 2); // each pair = user + model turn

  // Trim history if it exceeds character budget
  let historyChars = sanitisedHistory.reduce(
    (acc, h) => acc + (h.parts[0]?.text?.length || 0),
    0
  );
  while (historyChars > MAX_HISTORY_CHARS && sanitisedHistory.length > 0) {
    const removed = sanitisedHistory.shift();
    historyChars -= removed.parts[0]?.text?.length || 0;
  }

  // ── API key check ─────────────────────────────────────────────────
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.error('[AskAshwathAI] GEMINI_API_KEY is not set.');
    return NextResponse.json(
      {
        error:
          "Sorry, I'm having trouble responding right now. Please try again in a moment.",
      },
      { status: 503 }
    );
  }

  // ── Gemini call ───────────────────────────────────────────────────
  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: buildSystemInstruction(),
      generationConfig: {
        maxOutputTokens: MAX_OUTPUT_TOKENS,
        temperature: 0.4,  // slightly creative but mostly factual
        topP: 0.9,
      },
    });

    const chat = model.startChat({ history: sanitisedHistory });
    const result = await chat.sendMessage(message.trim());
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('[AskAshwathAI] Gemini API error:', err?.message || err);

    return NextResponse.json(
      {
        error:
          "Sorry, I'm having trouble responding right now. Please try again in a moment.",
      },
      { status: 502 }
    );
  }
}
