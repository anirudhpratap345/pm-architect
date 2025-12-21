"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DecisionBrief from "@/components/DecisionBrief"
import ShareButtons from "@/components/ShareButtons"
import { ArrowLeft, Eye, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface SharedComparisonPageProps {
  params: Promise<{ id: string }>
}

interface ComparisonData {
  query: string
  option_a: string
  option_b: string
  tech_category: string
  brief: string
  slider_data?: any
  value_metrics?: any
  created_at: string
  view_count: number
}

export default function SharedComparisonPage({ params }: SharedComparisonPageProps) {
  const router = useRouter()
  const { id } = use(params)
  const [comparison, setComparison] = useState<ComparisonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchComparison()
  }, [id])

  async function fetchComparison() {
    try {
      setLoading(true)
      setError(null)
      
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"
      const res = await fetch(`${apiBaseUrl}/api/comparison/${id}`)
      
      if (!res.ok) {
        if (res.status === 404) {
          setError("Comparison not found")
        } else {
          throw new Error(`HTTP ${res.status}`)
        }
        return
      }
      
      const json = await res.json()
      setComparison(json)
    } catch (e: any) {
      setError(e?.message || "Failed to load comparison")
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mb-4"></div>
          <div className="text-slate-300 text-lg">Loading comparison...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !comparison) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="bg-red-900/30 border border-red-800/50 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-2">Comparison Not Found</h2>
            <p className="text-slate-300 mb-6">
              {error || "This comparison doesn't exist or has been removed."}
            </p>
            <button
              onClick={() => router.push("/compare")}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Back to Compare
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Format created date
  const createdDate = comparison.created_at ? new Date(comparison.created_at) : null
  const timeAgo = createdDate ? formatDistanceToNow(createdDate, { addSuffix: true }) : null
  const formattedDate = createdDate ? createdDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) : null

  // Get share URL
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/c/${id}`
    : `https://pmarchitect.ai/c/${id}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/compare")}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Back</span>
            </button>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Eye size={16} />
                <span>{comparison.view_count} {comparison.view_count === 1 ? 'view' : 'views'}</span>
              </div>
              {timeAgo && (
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Calendar size={16} />
                  <span className="hidden sm:inline">{timeAgo}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-medium border border-blue-600/30">
              {comparison.tech_category.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
            {comparison.option_a} vs {comparison.option_b}
          </h1>
          <p className="text-slate-400 text-lg">{comparison.query}</p>
          {formattedDate && (
            <p className="text-slate-500 text-sm mt-2">Created {formattedDate}</p>
          )}
        </div>

        {/* Decision Brief */}
        <div className="mb-6">
          <DecisionBrief
            brief={comparison.brief}
            sliderData={comparison.slider_data}
            valueMetrics={comparison.value_metrics}
            query={comparison.query}
          />
        </div>

        {/* Share Buttons */}
        <div className="mb-8">
          <ShareButtons
            url={shareUrl}
            text={`Check out this comparison: ${comparison.option_a} vs ${comparison.option_b} - ${comparison.query}`}
            comparisonId={id}
          />
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg border border-green-600/30 p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            Want your own comparison?
          </h3>
          <p className="text-slate-300 mb-6">
            Get instant, AI-powered tech stack recommendations in seconds
          </p>
          <button
            onClick={() => router.push("/compare")}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Compare Something Else →
          </button>
        </div>
      </div>
    </div>
  )
}

