"use client";
import { useEffect, useMemo, useState } from "react";

function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    function onScroll() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 0;
      setProgress(pct);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: `${progress}%`, height: 3, background: "var(--color-accent)", zIndex: 60, transition: "width 120ms ease-out" }} />
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return false;
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  }, []);

  return (
    <>
      {!prefersReducedMotion && <ScrollProgressBar />}
      {children}
    </>
  );
} 