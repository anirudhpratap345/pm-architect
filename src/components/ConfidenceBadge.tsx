"use client"
import React from 'react'

function styleFor(confidence: string) {
  const c = (confidence || '').toLowerCase()
  if (c === 'high') return { cls: 'bg-green-100 text-green-700', text: 'High confidence', short: '✅ High' }
  if (c === 'medium') return { cls: 'bg-amber-100 text-amber-700', text: 'Medium confidence', short: '➖ Medium' }
  return { cls: 'bg-red-100 text-red-700', text: 'Low confidence', short: '⚠️ Low' }
}

export default function ConfidenceBadge({ confidence, validation }: { confidence: string; validation?: string }) {
  const { cls, text, short } = styleFor(confidence)
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${cls}`}>{text}</span>
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-medium ${cls}`}>{short}</span>
      {validation ? (
        <span className="inline-flex items-center rounded-full px-2 py-1 text-[10px] font-medium bg-gray-100 text-gray-700">
          {validation}
        </span>
      ) : null}
    </div>
  )
}


