'use client'

export function RecommendationPanel({ recommendation, tradeoffs, nextSteps }: { recommendation: string; tradeoffs: string[]; nextSteps: string[] }) {
  return (
    <div className="border rounded p-4 bg-white">
      <div className="text-lg font-semibold mb-2">{recommendation || '—'}</div>
      {tradeoffs?.length > 0 && (
        <div className="mb-3">
          <div className="font-medium mb-1">Tradeoffs</div>
          <ul className="list-disc ml-6 text-sm">
            {tradeoffs.map((t, i) => (<li key={i}>{t}</li>))}
          </ul>
        </div>
      )}
      {nextSteps?.length > 0 && (
        <div>
          <div className="font-medium mb-1">Next Steps</div>
          <ul className="list-disc ml-6 text-sm">
            {nextSteps.map((s, i) => (<li key={i}>{s}</li>))}
          </ul>
        </div>
      )}
    </div>
  )
}


