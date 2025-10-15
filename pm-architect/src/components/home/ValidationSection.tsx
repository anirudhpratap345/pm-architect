'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useScrollFade } from '@/hooks/useScrollFade'
import ConfidenceBadge from '@/components/ui/ConfidenceBadge'

export default function ValidationSection() {
  const reduce = useReducedMotion()
  const { ref, opacity, y } = useScrollFade()
  return (
    <motion.section ref={ref as any} style={{ opacity, y }} className="py-24 bg-gradient-to-b from-black via-gray-900 to-black transition-colors duration-700">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold" style={{color: 'var(--color-foreground)'}}>Validated for Confidence</h2>
        <p className="mt-3 text-base sm:text-lg" style={{color: 'var(--color-text-secondary)'}}>
          Every output is validated by a dedicated AI Validator Agent — checking consistency, accuracy, and alignment before recommendations are shown.
        </p>

        <motion.div
          className="bg-white/5 backdrop-blur-md rounded-2xl p-8 max-w-3xl mx-auto text-center mt-8 border"
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={reduce ? { duration: 0 } : { duration: 0.6, ease: 'easeOut' }}
          style={{ borderColor: 'var(--color-divider)' }}
        >
          <div className="flex justify-center gap-4 items-center mb-5">
            <ConfidenceBadge score={0.92} />
            <h4 className="text-xl font-semibold" style={{color: 'var(--color-foreground)'}}>High Confidence</h4>
          </div>
          <p className="text-lg" style={{color: '#D0D0D0'}}>
            Our validator confirms that this analysis meets reliability standards with a <span className="font-semibold" style={{color: 'var(--color-foreground)'}}>0.92 confidence score</span>.
          </p>
        </motion.div>

        <p className="mt-4 text-sm" style={{color: 'var(--color-text-secondary)'}}>
          PMArchitect’s validation layer ensures every recommendation you see has been verified for factual and logical consistency.
        </p>
      </div>
    </motion.section>
  )
}


