'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useScrollFade } from '@/hooks/useScrollFade'

const insights = [
  {
    icon: '🧠',
    title: 'Deep Reasoning',
    desc: 'Our AI understands not just metrics — but why one option outperforms another.',
  },
  {
    icon: '📚',
    title: 'Context Awareness',
    desc: 'Every result adapts to your input scenario — scale, cost, or environment.',
    },
  {
    icon: '🔍',
    title: 'Transparent Evidence',
    desc: 'Each comparison includes sourced insights and reasoning traces from our research agent.',
  },
]

export default function IntelligentInsights() {
  const reduce = useReducedMotion()
  const { ref, opacity, y } = useScrollFade()
  return (
    <motion.section ref={ref as any} style={{ opacity, y }} className="py-24 bg-gradient-to-b from-gray-950 via-black to-gray-900 transition-colors duration-700">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-3xl sm:text-4xl font-semibold" style={{color: 'var(--color-foreground)'}}>
            Intelligent Insights, Powered by AI Agents
          </h2>
          <p className="mt-4 text-base sm:text-lg" style={{color: 'var(--color-text-secondary)'}}>
            Every comparison is powered by our multi-agent intelligence layer — combining research, analytics, and synthesis to provide you with trustworthy, data-backed insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-4">
          {insights.map((ins, idx) => (
            <motion.div
              key={ins.title}
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
              whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={reduce ? { duration: 0 } : { delay: idx * 0.08, duration: 0.45, ease: 'easeOut' }}
              whileHover={reduce ? undefined : { y: -5 }}
              className="bg-white/5 backdrop-blur-md rounded-xl p-6 border"
              style={{ borderColor: 'var(--color-divider)', boxShadow: '0 0 15px rgba(59,130,246,0.2)' }}
            >
              <div className="text-2xl" aria-hidden>{ins.icon}</div>
              <div className="mt-2 text-xl font-semibold" style={{color: 'var(--color-foreground)'}}>{ins.title}</div>
              <p className="mt-2 text-sm" style={{color: 'var(--color-text-secondary)'}}>{ins.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}


