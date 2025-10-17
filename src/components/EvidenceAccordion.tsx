"use client"
import React, { useId, useState } from 'react'
import { motion } from 'framer-motion'

export default function EvidenceAccordion({ evidence }: { evidence: string[] }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <div className="border rounded-md bg-white" role="region" aria-labelledby={`${panelId}-label`}>
      <button
        type="button"
        className="w-full flex items-center justify-between px-3 py-2 text-left bg-gray-50 hover:bg-gray-100"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(v => !v)}
      >
        <span id={`${panelId}-label`} className="font-medium text-gray-900">Evidence</span>
        <span className="text-sm text-gray-600">{open ? 'Hide' : 'Show'}</span>
      </button>
      <motion.div
        id={panelId}
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden px-3 bg-white"
      >
        <ul className="list-disc pl-5 py-2 space-y-1">
          {evidence?.map((item, idx) => (
            <li key={idx} className="text-sm text-gray-900">
              {item}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  )
}


