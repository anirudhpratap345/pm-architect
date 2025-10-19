"use client"

import { useRef, useState } from "react"

export default function ImportButton({ onImported }: { onImported: () => Promise<void> | void }) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const file = files[0]
    try {
      setLoading(true)
      const text = await file.text()
      const json = JSON.parse(text)
      const items = Array.isArray(json) ? json : (json.items || [])
      if (!Array.isArray(items)) throw new Error('Invalid file format')
      const res = await fetch('/api/history/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      await onImported()
      alert('Import completed')
    } catch (e: any) {
      alert(`Import failed: ${e?.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="px-3 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
      >
        {loading ? 'Importing…' : 'Import JSON'}
      </button>
    </div>
  )
}


