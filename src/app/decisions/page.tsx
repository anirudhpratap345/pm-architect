"use client"

import { useEffect, useState } from "react"
import DecisionHistoryCard, { HistoryItem } from "@/components/DecisionHistoryCard"

export default function DecisionsPage() {
  const [items, setItems] = useState<HistoryItem[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch("/api/history")
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (!cancelled) {
          setItems(Array.isArray(json.items) ? json.items : [])
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load history")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  if (loading) return <div className="mx-auto max-w-6xl px-6 py-10">Loading…</div>
  if (error) return <div className="mx-auto max-w-6xl px-6 py-10 text-red-600">{error}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Decision History</h1>
        {items && items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((it) => (
              <DecisionHistoryCard key={it.id} item={it as HistoryItem} />)
            )}
          </div>
        ) : (
          <div className="text-gray-600">No decisions yet. Run a comparison to get started.</div>
        )}
      </div>
    </div>
  )
}


