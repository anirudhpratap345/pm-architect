import { useEffect, useState, useCallback } from 'react'

type UseComparisonState<T = any> = {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

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

export default function useComparison(initialInput: any): UseComparisonState {
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const postCompare = useCallback(async (body: any) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body ?? {})
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData(json)
    } catch (e: any) {
      setError(e?.message || 'Unknown error')
      setData(SAMPLE_JSON as any)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    postCompare(initialInput)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const refetch = useCallback(async () => {
    await postCompare(initialInput)
  }, [postCompare, initialInput])

  return { data, loading, error, refetch }
}


