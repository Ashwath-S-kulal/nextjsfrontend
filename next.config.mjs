/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,

  // NOTE: 'output: export' was removed to enable Next.js API routes (required
  // for server-side Gemini API calls). Deploy to Vercel or any Node.js host.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;