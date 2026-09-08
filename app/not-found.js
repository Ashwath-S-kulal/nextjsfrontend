import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-4 text-center">
      <span className="font-mono text-sm text-zinc-500 tracking-widest uppercase mb-2">404 ERROR</span>
      <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-4">Page Not Found</h1>
      <p className="text-zinc-400 text-sm max-w-md mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-full font-mono text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-colors"
      >
        Return to Home →
      </Link>
    </div>
  );
}
