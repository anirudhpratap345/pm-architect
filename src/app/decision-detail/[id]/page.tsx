"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ComparisonResult from "@/components/ComparisonResult"
import { formatDistanceToNow } from "date-fns"
import { exportSingleAsJSON } from "@/lib/exportUtils"

interface DecisionDetailPageProps {
  params: Promise<{ id: string }>
}

export default function DecisionDetailPage({ params }: DecisionDetailPageProps) {
  const router = useRouter()
  const { id } = use(params)
  const [decision, setDecision] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchDecision()
  }, [id])

  async function fetchDecision() {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/history/${id}`)
      if (!res.ok) {
        if (res.status === 404) {
          setError("Decision not found")
        } else {
          throw new Error(`HTTP ${res.status}`)
        }
        return
      }
      const json = await res.json()
      setDecision(json)
    } catch (e: any) {
      setError(e?.message || "Failed to load decision")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    try {
      setDeleting(true)
      const res = await fetch(`/api/history/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      router.push("/decisions")
    } catch (e: any) {
      alert(`Failed to delete: ${e?.message || "Unknown error"}`)
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading decision...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
          <button
            onClick={() => router.push("/decisions")}
            className="mt-4 text-blue-600 hover:underline"
          >
            ← Back to History
          </button>
        </div>
      </div>
    )
  }

  if (!decision) return null

  const timestamp = decision.timestamp ? new Date(decision.timestamp * 1000) : null
  const timeAgo = timestamp ? formatDistanceToNow(timestamp, { addSuffix: true }) : "Unknown"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <button
              onClick={() => router.push("/decisions")}
              className="text-blue-600 hover:underline mb-2 inline-block"
            >
              ← Back to History
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {decision.left} vs {decision.right}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Saved {timeAgo}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => exportSingleAsJSON(decision)}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleting}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        {/* Comparison Result */}
        <ComparisonResult rawJson={decision} />

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete this decision?
              </h3>
              <p className="text-gray-600 mb-6">
                This action cannot be undone. The comparison will be permanently removed from
                history.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

