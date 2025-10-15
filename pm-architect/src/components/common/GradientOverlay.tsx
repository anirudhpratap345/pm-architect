'use client'

import { motion } from 'framer-motion'

export default function GradientOverlay() {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-[#0A0A0A] via-[#0E0E0E] to-[#000]"
      style={{
        opacity: 0.4,
        backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(59,130,246,0.05), transparent 60%)'
      }}
      aria-hidden="true"
    />
  )
}


