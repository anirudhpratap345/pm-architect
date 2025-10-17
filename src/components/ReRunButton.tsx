"use client"
import React from 'react'

export default function ReRunButton({ onRefetch }: { onRefetch: () => void }) {
  return (
    <button
      type="button"
      aria-label="Re-run analysis"
      title="Re-run analysis"
      onClick={onRefetch}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
    >
      ↻ Re-run
    </button>
  )
}


