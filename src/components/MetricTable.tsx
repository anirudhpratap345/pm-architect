import React from 'react'
import type { MetricRow } from './ComparisonResult.types'

function formatDelta(delta: number): { text: string; className: string } {
  const n = Number.isFinite(delta) ? Math.round(delta * 10) / 10 : 0
  if (n > 0) return { text: `▲ +${n}%`, className: 'text-green-600' }
  if (n < 0) return { text: `▼ ${Math.abs(n)}%`, className: 'text-red-600' }
  return { text: '—', className: 'text-gray-500' }
}

export default function MetricTable({ metrics }: { metrics: MetricRow[] }) {
  return (
    <div className="overflow-x-auto border rounded-md bg-white">
      <table className="min-w-full text-sm" aria-label="Comparison metrics table">
        <caption className="sr-only">Comparison metrics</caption>
        <thead className="bg-gray-100 text-gray-800">
          <tr>
            <th scope="col" className="px-3 py-2 text-left font-semibold">Metric</th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">A</th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">B</th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">Δ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {metrics.map(row => {
            const d = formatDelta(Number.isFinite(row.delta) ? row.delta : 0)
            return (
              <tr key={row.metric} className="hover:bg-gray-50">
                <th scope="row" className="px-3 py-2 text-left font-medium text-gray-900">{row.metric}</th>
                <td className="px-3 py-2 text-right tabular-nums text-gray-900">{row.A}</td>
                <td className="px-3 py-2 text-right tabular-nums text-gray-900">{row.B}</td>
                <td className={`px-3 py-2 text-right tabular-nums ${d.className}`}>{d.text}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}


