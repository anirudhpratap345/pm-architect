"use client"
import React from 'react'
import type { MetricRow } from './ComparisonResult.types'
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend } from 'recharts'

export function BalanceRadar({ data }: { data: MetricRow[] }) {
  return (
    <div className="w-full h-64 border rounded-md p-2 bg-white">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <Legend />
          <Radar name="A" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.4} />
          <Radar name="B" dataKey="B" stroke="#22c55e" fill="#22c55e" fillOpacity={0.4} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}


