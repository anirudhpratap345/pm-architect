'use client'

import { motion, useReducedMotion } from 'framer-motion'

const nodes = [
  { key: 'research', label: 'Research' },
  { key: 'analyze', label: 'Analyze' },
  { key: 'validate', label: 'Validate' },
]

export default function AgentFlow() {
  const reduce = useReducedMotion()
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <h3 className="text-2xl sm:text-3xl font-semibold text-center mb-8" style={{color: 'var(--color-foreground)'}}>
          How PMArchitect Thinks.
        </h3>

        <div className="relative card-surface p-6">
          {/* Line (SVG) */}
          <div className="w-full h-24">
            <svg viewBox="0 0 100 40" width="100%" height="100%" preserveAspectRatio="none" aria-hidden>
              <motion.path
                d="M 10 20 L 90 20"
                fill="none"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="2"
                initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
                whileInView={reduce ? { pathLength: 1 } : { pathLength: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={reduce ? { duration: 0 } : { duration: 1.2, ease: 'easeOut' }}
              />
            </svg>
          </div>

          {/* Nodes */}
          <div className="relative h-0">
            {/* Positioning container overlay */}
            <div className="absolute inset-0 -mt-24">
              <div className="relative h-24">
                {nodes.map((n, idx) => (
                  <div
                    key={n.key}
                    className="absolute top-1/2 -translate-y-1/2 text-center"
                    style={{ left: `${10 + idx * 40}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <motion.div
                      initial={reduce ? { opacity: 0.6 } : { opacity: 0.5, scale: 0.9 }}
                      whileInView={reduce ? { opacity: 0.9 } : { opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={reduce ? { duration: 0 } : { duration: 0.6, delay: idx * 0.25, ease: 'easeOut' }}
                      className="w-5 h-5 rounded-full"
                      style={{ background: 'var(--color-accent)', boxShadow: '0 0 18px rgba(59,130,246,0.5)' }}
                    />
                    <div className="mt-2 text-xs sm:text-sm" style={{color: 'var(--color-text-secondary)'}}>{n.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


