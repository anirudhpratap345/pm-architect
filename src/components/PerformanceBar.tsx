"use client"
import React from 'react'
import type { MetricRow } from './ComparisonResult.types'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'

export function PerformanceBar({ data }: { data: MetricRow[] }) {
  return (
    <div className="w-full h-64 border rounded-md p-2 bg-white">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="metric" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="A" fill="#2563eb" name="A" />
          <Bar dataKey="B" fill="#22c55e" name="B" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}


