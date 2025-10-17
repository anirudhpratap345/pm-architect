'use client'

import { useEffect, useState } from 'react'
import ComparisonResult from '@/components/ComparisonResult'

const SAMPLE_JSON = {
  id: 'cmp_01',
  left: 'Gemini 2.5',
  right: 'GPT-4o',
  metrics: {
    accuracy: { A: 91.2, B: 89.4, delta: 1.8 },
    latency: { A: 1.3, B: 1.1, delta: -15 },
    cost_efficiency: { A: 0.9, B: 1.2, delta: 33 }
  },
  confidence: 'high',
  validation: 're-evaluated',
  evidence: [
    'Model A better on factual grounding.',
    'Model B more consistent on creative examples.'
  ],
  comparisonId: 'cmp_01'
}

export default function ComparePage() {
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/compare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: 'React vs Vue' })
        })
        if (!res.ok) throw new Error('request failed')
        const json = await res.json()
        if (mounted) setData(json)
      } catch {
        if (mounted) setData(SAMPLE_JSON)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  if (loading) return <div className="mx-auto max-w-5xl px-6 py-8">Loading…</div>
  if (!data) return <div className="mx-auto max-w-5xl px-6 py-8">No data.</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <ComparisonResult rawJson={data} />
      </div>
    </div>
  )
}


