'use client'

import { useState } from 'react'
import ComparisonResult from '@/components/ComparisonResult'

export default function ComparePage() {
  const [query, setQuery] = useState('')
  const [optionA, setOptionA] = useState('')
  const [optionB, setOptionB] = useState('')
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCompare = async () => {
    if (!query || !optionA || !optionB) {
      setError('Please fill in all fields before comparing.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/orchestrator/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          options: [optionA, optionB],
          metrics: [],
          context: {}
        })
      })
      if (!res.ok) throw new Error('Request failed')
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError('Error connecting to backend. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-6 py-12 flex flex-col items-center bg-gradient-to-b from-slate-950 to-slate-900 text-gray-100">
      <h1 className="text-3xl font-semibold mb-6">Compare Anything</h1>
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        <input
          type="text"
          placeholder="Describe what to compare (e.g., Firebase vs Supabase for MVP)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Option A"
            value={optionA}
            onChange={(e) => setOptionA(e.target.value)}
            className="px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Option B"
            value={optionB}
            onChange={(e) => setOptionB(e.target.value)}
            className="px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleCompare}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg font-medium disabled:opacity-50 transition-all"
        >
          {loading ? 'Analyzing…' : 'Run Comparison'}
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      <div className="mt-12 w-full max-w-5xl">
        {data ? (
          <ComparisonResult rawJson={data} />
        ) : (
          <p className="text-gray-400 mt-8 text-center">
            Enter two options above and click "Run Comparison" to see results.
          </p>
        )}
      </div>
    </div>
  )
}

