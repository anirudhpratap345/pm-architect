"use client"

import Link from "next/link"
import ConfidenceBadge from "./ConfidenceBadge"

export type HistoryItem = {
  id: string
  left: string
  right: string
  confidence?: string
  timestamp?: number
}

function formatTs(ts?: number) {
  if (!ts) return ""
  try {
    return new Date(ts * 1000).toLocaleString()
  } catch {
    return ""
  }
}

export default function DecisionHistoryCard({ item }: { item: HistoryItem }) {
  return (
    <Link href={`/decision-detail/${item.id}`} className="block rounded-lg border bg-white hover:shadow-md transition p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-gray-500">Saved {formatTs(item.timestamp)}</div>
          <div className="text-base font-semibold text-gray-900">{item.left} vs {item.right}</div>
          <div className="mt-2 flex items-center gap-2">
            <ConfidenceBadge confidence={String(item.confidence || 'medium')} />
            {/* Quick metric preview if exists */}
            <span className="text-xs text-gray-500">
              {/* This is a lightweight hint; the full metrics are in detail view */}
              View metrics →
            </span>
          </div>
        </div>
        <div className="text-gray-400">→</div>
      </div>
    </Link>
  )
}


