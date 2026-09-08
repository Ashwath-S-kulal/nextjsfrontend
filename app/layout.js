import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { portfolio } from '@/data/portfolio';
import AskAshwathAI from '@/components/AskAshwathAI';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: `${portfolio.name}`,
  description: `${portfolio.name} is a Computer Science Engineer and Full Stack Developer specialized in React, Next.js, Node.js, and AI-powered web ecosystems.`,
  keywords: [
    'Ashwath S',
    'Full Stack Developer',
    'MERN Stack',
    'Computer Science Engineer',
  ],
  authors: [{ name: portfolio.name }],
  creator: portfolio.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ashwaths-dev.web.app',
    title: `${portfolio.name} — ${portfolio.title}`,
    description: portfolio.bio,
    siteName: `${portfolio.name} Portfolio`,
    images: [
      {
        url: `/images/pto.png`,
        width: 1200,
        height: 630,
        alt: `${portfolio.name} - Portfolio`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="/images/pto.png" />
      </head>
      <body className="bg-bg text-text-secondary antialiased selection:bg-accent-cyan selection:text-black">
        {children}
        {/* Floating AI chatbot — portfolio-only, server-side Gemini API */}
        <AskAshwathAI />
      </body>
    </html>
  );
}
