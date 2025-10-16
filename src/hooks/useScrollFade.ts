"use client";

import { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";

export function useScrollFade() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [20, 0, -20]);

  return { ref, opacity, y };
}


