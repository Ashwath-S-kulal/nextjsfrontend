  import AnimatedBackground from '@/components/AnimatedBackground';
  import CustomCursor from '@/components/CustomCursor';
  import Navbar from '@/components/Navbar';
  import Hero from '@/components/Hero';
  import About from '@/components/About';
  import Skills from '@/components/Skills';
  import Freelance from '@/components/Freelance';
  import Projects from '@/components/Projects';
  import Education from '@/components/Education';
  import Contact from '@/components/Contact';
  import Footer from '@/components/Footer';

  export default function Home() {
    return (
      <main className="relative min-h-screen bg-bg text-text-primary selection:bg-accent-cyan selection:text-black overflow-x-hidden">
        {/* Dynamic Background Effects */}
        <AnimatedBackground />

        {/* Desktop Custom Follower Cursor */}
        <CustomCursor />

        {/* Sticky Dock Navbar */}
        <Navbar />

        {/* Main Content Sections */}
        <div className="relative z-10">
          <Hero />
          <About />
          <Skills />
          <Freelance />
          <Projects />
          <Education />
          <Contact />
          <Footer />
        </div>
      </main>
    );
  }
