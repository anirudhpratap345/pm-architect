'use client'

import { motion } from 'framer-motion'
import { useScrollFade } from '@/hooks/useScrollFade'
import Link from 'next/link'

export default function FinalCTA() {
  const { ref, opacity, y } = useScrollFade()
  return (
    <motion.section ref={ref as any} style={{ opacity, y }} className="py-32 text-center bg-gradient-to-b from-gray-900 via-black to-gray-950 transition-colors duration-700">
      <motion.h2
        className="text-4xl md:text-5xl font-semibold text-white mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        Decide Smarter. Build Faster.
      </motion.h2>
      <motion.p
        className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Compare technologies intelligently — powered by AI that reasons, validates, and recommends.
      </motion.p>
      <div className="flex justify-center gap-4">
        <Link href="/compare" className="px-6 py-3 rounded-xl font-medium transition" style={{ background: '#3B82F6', color: '#fff' }}>
          Try a Comparison
        </Link>
        <Link href="#product" className="px-6 py-3 rounded-xl font-medium border border-white/20 backdrop-blur-md hover:bg-white/5 transition text-white">
          Explore How It Works
        </Link>
      </div>
    </motion.section>
  )
}


