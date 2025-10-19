"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ComparisonResult from "@/components/ComparisonResult"

interface DecisionDetailPageProps {
  params: Promise<{ id: string }>
}

export default function DecisionDetailPage({ params }: DecisionDetailPageProps) {
  const router = useRouter()
  const { id } = use(params)
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/history/${id}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (!cancelled) setData(json)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load decision')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [id])

  if (loading) return <div className="mx-auto max-w-6xl px-6 py-10">Loading…</div>
  if (error) return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">{error}</div>
      <button onClick={() => router.push('/decisions')} className="mt-4 text-blue-600 hover:underline">← Back to History</button>
    </div>
  )
  if (!data) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-8 space-y-4">
        <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-md p-3">
          This decision is from the new history system.
        </div>
        <ComparisonResult rawJson={data} />
      </div>
    </div>
  )
}