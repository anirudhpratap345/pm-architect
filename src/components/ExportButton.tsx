"use client"

import { useState } from "react"
import type { HistoryItem } from "./DecisionHistoryCard"
import { exportAsJSON, exportAsCSV } from "@/lib/exportUtils"

interface ExportButtonProps {
  items: HistoryItem[]
}

export default function ExportButton({ items }: ExportButtonProps) {
  const [showMenu, setShowMenu] = useState(false)

  const handleExportJSON = () => {
    exportAsJSON(items)
    setShowMenu(false)
  }

  const handleExportCSV = () => {
    exportAsCSV(items)
    setShowMenu(false)
  }

  if (items.length === 0) return null

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
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
        Export History
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-20">
            <div className="py-1">
              <button
                onClick={handleExportJSON}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <span className="text-lg">📄</span>
                Export as JSON
              </button>
              <button
                onClick={handleExportCSV}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <span className="text-lg">📊</span>
                Export as CSV
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

