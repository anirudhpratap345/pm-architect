'use client'

export function ConfidenceBadges({ score }: { score: number }) {
  const high = score >= 0.8
  return (
    <div className="flex items-center gap-2">
      {high ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-800 px-3 py-1 text-sm">✅ High Confidence</span>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-800 px-3 py-1 text-sm">⚠️ Re-evaluated</span>
      )}
    </div>
  )
}


