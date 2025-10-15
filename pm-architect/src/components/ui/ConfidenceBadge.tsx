'use client'

import { motion, useReducedMotion } from 'framer-motion'

export default function ConfidenceBadge({ score }: { score: number }) {
  const reduce = useReducedMotion()
  const clamped = Math.max(0, Math.min(1, isFinite(score) ? score : 0))
  const radius = 40
  const strokeWidth = 6
  const size = 100
  const center = size / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - clamped)
  const color = clamped >= 0.8 ? '#10B981' : '#FBBF24'

  return (
    <div className="inline-block" aria-label={`Confidence ${Math.round(clamped * 100)} percent`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated ring */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={reduce ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={reduce ? { duration: 0 } : { duration: 0.6, ease: 'easeOut' }}
          style={{ filter: clamped >= 0.8 ? 'drop-shadow(0 0 10px rgba(16,185,129,0.35))' : 'drop-shadow(0 0 10px rgba(251,191,36,0.25))' }}
        />
        {/* Center label */}
        <text x={center} y={center} textAnchor="middle" dominantBaseline="central" fontSize="16" fill="#FFFFFF" fontWeight={600}>
          {Math.round(clamped * 100)}%
        </text>
      </svg>
    </div>
  )
}


