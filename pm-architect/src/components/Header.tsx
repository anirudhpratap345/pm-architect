"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full">
      <motion.nav
        role="navigation"
        aria-label="Main Navigation"
        initial={reduce ? undefined : { opacity: 0, y: -16 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={reduce ? undefined : { duration: 0.5, ease: "easeOut" }}
        className={`transition-all duration-300 ${scrolled ? "bg-black/60 backdrop-blur-md border-b border-white/10" : "bg-transparent"}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-extrabold text-2xl tracking-tight" style={{color: 'var(--color-foreground)'}}>PM</span>
            <span className="hidden sm:inline font-semibold text-lg" style={{color: 'var(--color-text-secondary)'}}>Architect.ai</span>
            <span className="ml-2 text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded-lg hidden sm:inline">beta</span>
          </Link>
        </div>

        {/* Single CTA */}
        <motion.div className="flex items-center gap-4" animate={reduce ? undefined : { opacity: 1 }}>
          {/* Optional About placeholder if needed in future */}
          {/* <Link href="/about" className="text-gray-400 hover:text-white transition hidden sm:inline">About</Link> */}
          <Link href="/compare" className="px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-black outline-none" style={{ background: '#3B82F6', color: '#FFFFFF' }}>
            Try a Comparison
          </Link>
        </motion.div>
        </div>
      </motion.nav>
    </header>
  );
}