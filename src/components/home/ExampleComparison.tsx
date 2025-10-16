'use client'

import dynamic from 'next/dynamic'
import { motion, useReducedMotion } from 'framer-motion'
import { useScrollFade } from '@/hooks/useScrollFade'
const ExampleBarChart = dynamic(() => import('./ExampleBarChart'), { ssr: false })

const data = [
  { metric: 'Latency', Redis: 9.2, Memcached: 7.5 },
  { metric: 'Cost', Redis: 6.5, Memcached: 8.0 },
  { metric: 'Scalability', Redis: 9.0, Memcached: 7.8 },
  { metric: 'Maintenance', Redis: 8.5, Memcached: 8.2 },
]

export default function ExampleComparison() {
  const reduce = useReducedMotion()
  const { ref, opacity, y } = useScrollFade()
  return (
    <motion.section ref={ref as any} style={{ opacity, y }} className="py-24 bg-gradient-to-b from-black via-gray-900 to-black transition-colors duration-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-semibold" style={{color: 'var(--color-foreground)'}}>See It In Action</h2>
          <p className="mt-3 text-base sm:text-lg" style={{color: 'var(--color-text-secondary)'}}>
            Here’s how PMArchitect compares technologies — clear, visual, and data-backed.
          </p>
        </div>

        <div className="card-surface p-4">
          <ExampleBarChart data={data as any} />
        </div>

        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={reduce ? { duration: 0 } : { duration: 0.4, ease: 'easeOut' }}
          className="card-surface p-6 mt-6"
        >
          <p className="text-sm" style={{color: 'rgba(255,255,255,0.9)'}}>
            Based on AI analysis, Redis performs better overall for scalability and latency, while Memcached is more cost-efficient.
          </p>
        </motion.div>
      </div>
    </motion.section>
  )
}


