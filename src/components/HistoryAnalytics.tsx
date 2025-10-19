"use client"

import { useMemo } from "react"
import type { HistoryItem } from "./DecisionHistoryCard"

interface HistoryAnalyticsProps {
  items: HistoryItem[]
}

interface AnalyticsData {
  total: number
  highConfidence: number
  mediumConfidence: number
  lowConfidence: number
  recentCount: number // last 7 days
}

function computeAnalytics(items: HistoryItem[]): AnalyticsData {
  const now = Date.now()
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000

  const total = items.length
  let highConfidence = 0
  let mediumConfidence = 0
  let lowConfidence = 0
  let recentCount = 0

  for (const item of items) {
    const conf = String(item.confidence || "medium").toLowerCase()
    if (conf === "high") highConfidence++
    else if (conf === "medium") mediumConfidence++
    else lowConfidence++

    if (item.timestamp && item.timestamp * 1000 >= sevenDaysAgo) {
      recentCount++
    }
  }

  return { total, highConfidence, mediumConfidence, lowConfidence, recentCount }
}

export default function HistoryAnalytics({ items }: HistoryAnalyticsProps) {
  const stats = useMemo(() => computeAnalytics(items), [items])

  if (stats.total === 0) return null

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Analytics Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Decisions */}
        <div className="bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-500">Total</div>
            <div className="text-2xl">📊</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-xs text-gray-400 mt-1">comparisons</div>
        </div>

        {/* High Confidence */}
        <div className="bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-500">High</div>
            <div className="text-2xl">✅</div>
          </div>
          <div className="text-3xl font-bold text-green-600">{stats.highConfidence}</div>
          <div className="text-xs text-gray-400 mt-1">confidence</div>
        </div>

        {/* Medium Confidence */}
        <div className="bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-500">Medium</div>
            <div className="text-2xl">➖</div>
          </div>
          <div className="text-3xl font-bold text-amber-600">{stats.mediumConfidence}</div>
          <div className="text-xs text-gray-400 mt-1">confidence</div>
        </div>

        {/* Low Confidence */}
        <div className="bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-500">Low</div>
            <div className="text-2xl">⚠️</div>
          </div>
          <div className="text-3xl font-bold text-red-600">{stats.lowConfidence}</div>
          <div className="text-xs text-gray-400 mt-1">confidence</div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-500">Recent</div>
            <div className="text-2xl">🔥</div>
          </div>
          <div className="text-3xl font-bold text-blue-600">{stats.recentCount}</div>
          <div className="text-xs text-gray-400 mt-1">last 7 days</div>
        </div>
      </div>
    </div>
  )
}

