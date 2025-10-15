'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { CompareForm, type CompareInput } from '../../components/compare/CompareForm'
import { MetricsChart } from '../../components/compare/MetricsChart'
import { ConfidenceBadges } from '../../components/compare/Badges'
import { EvidenceAccordion } from '../../components/compare/EvidenceAccordion'
import { RecommendationPanel } from '../../components/compare/RecommendationPanel'
import { ChartTypeSwitch } from '../../components/compare/ChartTypeSwitch'
import { ThemeToggle } from '../../components/compare/ThemeToggle'
import { HistoryPanel, pushHistory } from '../../components/compare/HistoryPanel'

type BackendResponse = any

export default function ComparePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<BackendResponse | null>(null)
  const [chartType, setChartType] = useState<'bar' | 'radar'>('bar')
  const backend = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001').replace(/\/$/, '')

  const onRun = async (input: CompareInput) => {
    setLoading(true)
    setError(null)
    try {
      const metrics = input.metrics.split(',').map(s => s.trim()).filter(Boolean)
      const body: any = {
        options: [input.optionA.trim(), input.optionB.trim()],
        metrics,
        context: input.context.trim(),
      }
      const res = await fetch(`${backend}/api/compare`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = await res.json()
      setResult(data)
      try {
        pushHistory({ optionA: input.optionA.trim(), optionB: input.optionB.trim(), metrics, context: input.context.trim(), ts: Date.now() })
      } catch {}
    } catch (err: any) {
      setError(err?.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const validatorScore: number = useMemo(() => {
    return Number(result?.results?.validator?.validation_report?.score || 0)
  }, [result])

  const tableRows = useMemo(() => {
    const rows = result?.results?.metric_analyst?.metrics || result?.analysis?.table || []
    return Array.isArray(rows) ? rows : []
  }, [result])

  const options = result?.options || []
  const optionA = options[0] || 'Option A'
  const optionB = options[1] || 'Option B'
  const evidence = result?.results?.researcher?.evidence || []
  const synth = result?.results?.synthesizer || {}

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">PMArchitect — AI-driven metric comparison for anyone building or evaluating technology.</h1>
      </div>

      <div className="flex items-center justify-between">
        <HistoryPanel onSelect={(h) => onRun({ optionA: h.optionA, optionB: h.optionB, metrics: h.metrics.join(', '), context: h.context })} />
        <div className="flex items-center gap-3">
          <ChartTypeSwitch type={chartType} onChange={setChartType} />
          <ThemeToggle />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 border rounded p-4 bg-white/50">
          <CompareForm onSubmit={onRun} loading={loading} />
          {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
          {result && (
            <button
              disabled={loading}
              onClick={() => onRun({
                optionA,
                optionB,
                metrics: (result.metrics || []).join(', '),
                context: result.analysis?.notes || ''
              })}
              className="mt-4 text-sm px-3 py-2 rounded bg-gray-800 text-white disabled:opacity-50"
            >
              🔄 Re-Run Analysis
            </button>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          {result && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-lg font-medium">Results</div>
                <ConfidenceBadges score={validatorScore} />
              </div>

              {tableRows.length > 0 && (
                <MetricsChart optionA={optionA} optionB={optionB} rows={tableRows} type={chartType} />
              )}

              <RecommendationPanel
                recommendation={synth.recommendation || synth.summary || ''}
                tradeoffs={synth.tradeoffs || []}
                nextSteps={synth.next_steps || []}
              />

              <EvidenceAccordion evidence={evidence} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}


