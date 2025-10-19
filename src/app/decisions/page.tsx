"use client"

import { useEffect, useState, useMemo } from "react"
import DecisionHistoryCard, { HistoryItem } from "@/components/DecisionHistoryCard"
import HistoryAnalytics from "@/components/HistoryAnalytics"
import HistoryFilters from "@/components/HistoryFilters"
import ExportButton from "@/components/ExportButton"
import Pagination from "@/components/Pagination"
import ImportButton from "@/components/ImportButton"

export default function DecisionsPage() {
  const [items, setItems] = useState<HistoryItem[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [confidenceFilter, setConfidenceFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")
  const [page, setPage] = useState(1)
  const pageSize = 9

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

  // Filter and sort items
  const filteredItems = useMemo(() => {
    if (!items) return []

    let filtered = [...items]

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.left?.toLowerCase().includes(term) ||
          item.right?.toLowerCase().includes(term)
      )
    }

    // Apply confidence filter
    if (confidenceFilter !== "all") {
      filtered = filtered.filter(
        (item) => String(item.confidence || "medium").toLowerCase() === confidenceFilter
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case "oldest":
          return (a.timestamp || 0) - (b.timestamp || 0)
        case "high-conf": {
          const confOrder = { high: 3, medium: 2, low: 1 }
          const aConf = String(a.confidence || "medium").toLowerCase() as keyof typeof confOrder
          const bConf = String(b.confidence || "medium").toLowerCase() as keyof typeof confOrder
          return (confOrder[bConf] || 2) - (confOrder[aConf] || 2)
        }
        case "low-conf": {
          const confOrder = { high: 3, medium: 2, low: 1 }
          const aConf = String(a.confidence || "medium").toLowerCase() as keyof typeof confOrder
          const bConf = String(b.confidence || "medium").toLowerCase() as keyof typeof confOrder
          return (confOrder[aConf] || 2) - (confOrder[bConf] || 2)
        }
        case "newest":
        default:
          return (b.timestamp || 0) - (a.timestamp || 0)
      }
    })

    return filtered
  }, [items, searchTerm, confidenceFilter, sortOrder])

  // Paginated items
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredItems.slice(start, start + pageSize)
  }, [filteredItems, page])

  if (loading) return <div className="mx-auto max-w-6xl px-6 py-10">Loading…</div>
  if (error) return <div className="mx-auto max-w-6xl px-6 py-10 text-red-600">{error}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header with Export/Import */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Decision History</h1>
          <div className="flex items-center gap-3">
            <ImportButton onImported={async () => {
              setLoading(true)
              try {
                const res = await fetch('/api/history')
                const json = await res.json()
                setItems(Array.isArray(json.items) ? json.items : [])
                setPage(1)
              } finally {
                setLoading(false)
              }
            }} />
            {items && items.length > 0 && (
              <>
                <button
                  onClick={async () => {
                    if (!confirm('Clear ALL history? This cannot be undone.')) return
                    await fetch('/api/history', { method: 'DELETE' })
                    // Refetch
                    setLoading(true)
                    try {
                      const res = await fetch('/api/history')
                      const json = await res.json()
                      setItems(Array.isArray(json.items) ? json.items : [])
                      setPage(1)
                    } finally {
                      setLoading(false)
                    }
                  }}
                  className="px-3 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  Clear All
                </button>
                <ExportButton items={filteredItems} />
              </>
            )}
          </div>
        </div>
        
        {/* Analytics Panel */}
        {items && items.length > 0 && <HistoryAnalytics items={items} />}
        
        {/* Filters */}
        {items && items.length > 0 && (
          <HistoryFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            confidenceFilter={confidenceFilter}
            onConfidenceChange={setConfidenceFilter}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            totalCount={items.length}
            filteredCount={filteredItems.length}
          />
        )}
        
        {paginatedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedItems.map((it) => (
              <DecisionHistoryCard key={it.id} item={it} />
            ))}
          </div>
        ) : items && items.length > 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-600 mb-2">No matches found</div>
            <button
              onClick={() => {
                setSearchTerm("")
                setConfidenceFilter("all")
              }}
              className="text-blue-600 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="text-gray-600">No decisions yet. Run a comparison to get started.</div>
        )}

        {/* Pagination */}
        {filteredItems.length > 0 && (
          <Pagination
            page={page}
            pageSize={pageSize}
            total={filteredItems.length}
            onPageChange={(p) => setPage(p)}
          />
        )}
      </div>
    </div>
  )
}


