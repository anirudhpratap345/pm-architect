"use client"

import { useEffect, useMemo, useState } from "react"
import type { HistoryItem } from "@/components/DecisionHistoryCard"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

export default function AnalyticsPage() {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/history')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (!cancelled) setItems(Array.isArray(json.items) ? json.items : [])
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load history')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const it of items) {
      const a = (it.left || '').toString().trim()
      const b = (it.right || '').toString().trim()
      if (a) map.set(a, (map.get(a) || 0) + 1)
      if (b) map.set(b, (map.get(b) || 0) + 1)
    }
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((x, y) => y.count - x.count)
      .slice(0, 12)
  }, [items])

  if (loading) return <div className="mx-auto max-w-6xl px-6 py-10">Loading…</div>
  if (error) return <div className="mx-auto max-w-6xl px-6 py-10 text-red-600">{error}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Analytics Overview</h1>

        {counts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border p-4">
              <div className="text-sm text-gray-500 mb-2">Top Models/Frameworks (by occurrence)</div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={counts} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-25} textAnchor="end" height={60} interval={0} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2563eb" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <div className="text-sm text-gray-500 mb-2">Summary</div>
              <ul className="divide-y divide-gray-200">
                {counts.map(row => (
                  <li key={row.name} className="flex items-center justify-between py-2">
                    <span className="text-gray-900">{row.name}</span>
                    <span className="text-gray-600">{row.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-gray-600">No data yet. Run a comparison to get started.</div>
        )}
      </div>
    </div>
  )
}


