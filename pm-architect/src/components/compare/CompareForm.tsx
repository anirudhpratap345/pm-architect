'use client'

import { useState } from 'react'

export type CompareInput = {
  optionA: string
  optionB: string
  metrics: string
  context: string
}

export function CompareForm({ onSubmit, loading }: { onSubmit: (input: CompareInput) => void; loading: boolean }) {
  const [optionA, setOptionA] = useState('Redis')
  const [optionB, setOptionB] = useState('Memcached')
  const [metrics, setMetrics] = useState('latency, cost, scalability, maintenance')
  const [context, setContext] = useState('Used for a SaaS caching system with 2000 RPS and 50GB dataset hosted on Render.')

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        onSubmit({ optionA, optionB, metrics, context })
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Option A</label>
          <input className="w-full border rounded p-2" value={optionA} onChange={e => setOptionA(e.target.value)} placeholder="Enter first option" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Option B</label>
          <input className="w-full border rounded p-2" value={optionB} onChange={e => setOptionB(e.target.value)} placeholder="Enter second option" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Select metrics to evaluate (e.g., cost, latency, scalability)</label>
        <input className="w-full border rounded p-2" value={metrics} onChange={e => setMetrics(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Context (optional)</label>
        <textarea className="w-full border rounded p-2" rows={3} value={context} onChange={e => setContext(e.target.value)} />
      </div>
      <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50" disabled={loading}>
        {loading ? 'Running…' : 'Run Comparison'}
      </button>
    </form>
  )
}


