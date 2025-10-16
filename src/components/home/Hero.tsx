'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Hero() {
  const reduce = useReducedMotion()
  const router = useRouter()
  const [demoText, setDemoText] = useState('Compare Redis vs Memcached')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<null | {
    a: string
    b: string
    metrics: Array<{ metric: string; a: string | number; b: string | number; analysis: string }>
    summary: string
  }>(null)

  function parseAB(input: string): { a: string; b: string } {
    const m = input.split(/\s+vs\s+/i)
    if (m.length === 2) return { a: m[0].trim() || 'Option A', b: m[1].trim() || 'Option B' }
    return { a: 'Option A', b: 'Option B' }
  }

  async function runDemo(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    await new Promise(r => setTimeout(r, 1100))
    const { a, b } = parseAB(demoText)
    // Mocked, frontend-only summary
    const mock = {
      a,
      b,
      metrics: [
        { metric: 'latency', a: '1–3ms', b: '4–7ms', analysis: `${a} is generally faster under in-memory read-heavy loads.` },
        { metric: 'cost', a: '$$ (managed)', b: '$ (simple)', analysis: `${b} can be cheaper at small scale due to a simpler feature set.` },
        { metric: 'scalability', a: 9, b: 7.5, analysis: `${a} clusters scale horizontally with predictable performance.` },
      ],
      summary: `${a} excels at latency and scale; ${b} is attractive for cost at lighter workloads.`,
    }
    setResult(mock)
    setLoading(false)
  }

  function goFull() {
    const { a, b } = parseAB(demoText)
    const params = new URLSearchParams({ A: a, B: b, metrics: 'latency,cost,scalability' })
    router.push(`/compare?${params.toString()}`)
  }
  return (
    <section className="relative overflow-hidden">
      {/* Animated soft gradient background */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.div
          className="absolute -inset-1"
          initial={{ scale: 1.01, rotate: 0 }}
          animate={reduce ? { opacity: 0.6 } : { scale: 1, rotate: 360, opacity: 1 }}
          transition={reduce ? { duration: 0 } : { repeat: Infinity, duration: 90, ease: 'linear' }}
          style={{
            background:
              'radial-gradient(40% 40% at 20% 20%, rgba(24,160,251,0.25) 0%, rgba(24,160,251,0.06) 40%, rgba(10,10,12,0) 70%), radial-gradient(45% 45% at 80% 10%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 35%, rgba(10,10,12,0) 70%)',
            filter: 'blur(30px)'
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,12,0)_0%,rgba(10,10,12,0.6)_40%,rgba(10,10,12,1)_100%)]" />
      </motion.div>

      <div className="mx-auto max-w-5xl px-6 pt-28 pb-24 text-center">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ color: 'var(--color-foreground)' }}
        >
          AI-driven metric comparison for anyone building or evaluating technology
        </motion.h1>

        <motion.p
          className="mt-6 text-lg sm:text-xl max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          style={{ color: 'rgba(243,243,243,0.8)' }}
        >
          Compare tools, models, and architectures with clear metrics, evidence, and concise recommendations — built for developers, founders, analysts, and students.
        </motion.p>

        {/* Inline demo input */}
        <form onSubmit={runDemo} className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 items-stretch justify-center">
          <input
            aria-label="Inline comparison input"
            placeholder="Compare Redis vs Memcached"
            className="flex-1 rounded-md px-3 py-2 text-sm bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[--color-accent]"
            value={demoText}
            onChange={e => setDemoText(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-md font-medium"
            style={{ background: 'var(--color-accent)', color: '#0a0a0c' }}
            disabled={loading}
          >
            {loading ? 'Running…' : 'Run Demo'}
          </button>
        </form>

        {/* Demo output */}
        <div className="mt-6 max-w-2xl mx-auto text-left" role="status" aria-live="polite">
          {loading && (
            <div className="card-surface p-4">
              <motion.span
                initial={{ opacity: 0.5 }}
                animate={reduce ? { opacity: 0.8 } : { opacity: [0.5, 1, 0.5] }}
                transition={reduce ? { duration: 0 } : { repeat: Infinity, duration: 1.2 }}
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Analyzing…
              </motion.span>
            </div>
          )}
          {!loading && result && (
            <div className="card-surface p-4">
              <pre className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--color-foreground)' }}>
{`{
  "options": ["${result.a}", "${result.b}"],
  "metrics": [
    { "metric": "${result.metrics[0].metric}", "${result.a}": "${result.metrics[0].a}", "${result.b}": "${result.metrics[0].b}", "analysis": "${result.metrics[0].analysis}" },
    { "metric": "${result.metrics[1].metric}", "${result.a}": "${result.metrics[1].a}", "${result.b}": "${result.metrics[1].b}", "analysis": "${result.metrics[1].analysis}" },
    { "metric": "${result.metrics[2].metric}", "${result.a}": "${result.metrics[2].a}", "${result.b}": "${result.metrics[2].b}", "analysis": "${result.metrics[2].analysis}" }
  ],
  "summary": "${result.summary}"
}`}
              </pre>
              <div className="mt-3 flex items-center gap-3">
                <button onClick={goFull} className="px-3 py-2 rounded-md text-sm font-medium" style={{ background: 'var(--color-accent)', color: '#0a0a0c' }}>
                  Try Full Comparison
                </button>
              </div>
            </div>
          )}
        </div>

        <motion.div
          className="mt-10 flex items-center justify-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link
            href="/compare"
            className="px-6 py-3 rounded-md font-medium shadow-lg transition-colors"
            style={{ background: 'var(--color-accent)', color: '#0a0a0c' }}
          >
            Try a Comparison
          </Link>
        </motion.div>
      </div>
    </section>
  )
}


