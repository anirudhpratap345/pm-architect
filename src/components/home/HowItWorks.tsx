'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useScrollFade } from '@/hooks/useScrollFade'

const steps = [
  {
    id: 1,
    title: 'Research',
    desc: 'The Researcher Agent gathers verified data about each option from trusted sources.',
    icon: '🔍',
  },
  {
    id: 2,
    title: 'Analyze',
    desc: 'The Metric Analyst compares key factors — cost, performance, scalability, and reliability.',
    icon: '📊',
  },
  {
    id: 3,
    title: 'Recommend',
    desc: 'The Synthesizer Agent summarizes insights and provides clear, actionable recommendations.',
    icon: '🤖',
  },
]

export default function HowItWorks() {
  const reduce = useReducedMotion()
  const { ref, opacity, y } = useScrollFade()
  return (
    <motion.section ref={ref as any} style={{ opacity, y }} className="relative py-24 bg-gradient-to-b from-gray-900 via-black to-gray-950 transition-colors duration-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-semibold" style={{color: 'var(--color-foreground)'}}>How It Works</h2>
          <p className="mt-3 text-base sm:text-lg" style={{color: 'var(--color-text-secondary)'}}>
            PMArchitect uses a multi-agent AI system to research, analyze, and recommend the best technology for your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.id}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={reduce ? { duration: 0 } : { delay: i * 0.06, duration: 0.4, ease: 'easeOut' }}
              whileHover={reduce ? undefined : { scale: 1.03 }}
              className="card-surface p-6 border divider"
              style={{ borderColor: 'var(--color-divider)' }}
            >
              <div className="text-sm tracking-wider mb-2" style={{color: 'var(--color-text-secondary)'}}>STEP {s.id}</div>
              <div className="text-2xl mb-2" style={{color: 'var(--color-foreground)'}}>
                <span className="mr-2" aria-hidden>{s.icon}</span>{s.title}
              </div>
              <p className="text-sm leading-relaxed" style={{color: 'var(--color-text-secondary)'}}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}


