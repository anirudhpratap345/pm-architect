'use client'

import { useState } from 'react'

type EvidenceItem = { metric: string; summary: string; source?: string }

export function EvidenceAccordion({ evidence }: { evidence: EvidenceItem[] }) {
  const [open, setOpen] = useState(false)
  if (!evidence || evidence.length === 0) return null
  return (
    <div className="border rounded">
      <button type="button" onClick={() => setOpen(v => !v)} className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100">
        {open ? 'Hide Detailed Evidence' : 'Show Detailed Evidence'}
      </button>
      {open && (
        <div className="p-3 space-y-2">
          {evidence.map((ev, idx) => (
            <div key={idx} className="border rounded p-2 bg-white">
              <div className="text-sm font-semibold capitalize">{ev.metric}</div>
              <div className="text-sm text-gray-800">{ev.summary}</div>
              {ev.source && (
                <a className="text-xs text-blue-700 underline" href={ev.source} target="_blank" rel="noreferrer">Source</a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


