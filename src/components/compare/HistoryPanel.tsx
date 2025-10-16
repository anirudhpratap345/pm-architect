'use client'

import { useEffect, useState } from 'react'

type HistoryItem = { optionA: string; optionB: string; metrics: string[]; context: string; ts: number }

export function HistoryPanel({ onSelect }: { onSelect: (h: HistoryItem) => void }) {
  const [items, setItems] = useState<HistoryItem[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pmarch_history')
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  if (items.length === 0) return null
  return (
    <div className="border rounded p-3 bg-white/60">
      <div className="text-sm font-medium mb-2">Recent Comparisons</div>
      <ul className="space-y-2 text-sm">
        {items.slice(0, 6).map((h, i) => (
          <li key={i} className="flex items-center justify-between">
            <button className="underline text-left" onClick={() => onSelect(h)}>
              {h.optionA} vs {h.optionB} · {h.metrics.join(', ')}
            </button>
            <span className="text-xs text-gray-500">{new Date(h.ts).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function pushHistory(item: HistoryItem) {
  try {
    const raw = localStorage.getItem('pmarch_history')
    const arr: HistoryItem[] = raw ? JSON.parse(raw) : []
    const key = `${item.optionA}|${item.optionB}|${item.metrics.join(',')}|${item.context}`
    const dedup = arr.filter(x => `${x.optionA}|${x.optionB}|${x.metrics.join(',')}|${x.context}` !== key)
    dedup.unshift(item)
    localStorage.setItem('pmarch_history', JSON.stringify(dedup.slice(0, 20)))
  } catch {}
}


