'use client'

import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'

type MetricRow = { metric: string; optionA_value?: string; optionB_value?: string; scoreA?: number; scoreB?: number; analysis?: string; confidence?: number }

export function MetricsChart({ optionA, optionB, rows, type = 'bar' }: { optionA: string; optionB: string; rows: MetricRow[]; type?: 'bar' | 'radar' }) {
  const data = rows.map(r => ({
    metric: r.metric,
    [optionA]: typeof r.scoreA === 'number' ? r.scoreA : undefined,
    [optionB]: typeof r.scoreB === 'number' ? r.scoreB : undefined,
    analysis: r.analysis || '',
    confidence: typeof r.confidence === 'number' ? r.confidence : undefined,
  }))
  return (
    <div className="w-full h-80 border rounded bg-white">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'bar' ? (
          <BarChart data={data} margin={{ top: 16, right: 16, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="metric" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value: any, name: string, props: any) => [value, name]} labelFormatter={(label) => label} contentStyle={{ fontSize: 12 }} />
            <Legend />
            <Bar dataKey={optionA} fill="#3b82f6" />
            <Bar dataKey={optionB} fill="#10b981" />
          </BarChart>
        ) : (
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 10]} />
            <Radar name={optionA} dataKey={optionA} stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            <Radar name={optionB} dataKey={optionB} stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            <Legend />
          </RadarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}


