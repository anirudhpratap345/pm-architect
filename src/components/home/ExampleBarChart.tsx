'use client'

import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts'

export default function ExampleBarChart({ data }: { data: Array<Record<string, number | string>> }) {
  return (
    <div className="w-full h-[300px] sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 16, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="metric" tick={{ fill: '#A0A0A0', fontSize: 12 }} stroke="rgba(255,255,255,0.1)" />
          <YAxis domain={[0, 10]} tick={{ fill: '#A0A0A0', fontSize: 12 }} stroke="rgba(255,255,255,0.1)" />
          <Tooltip contentStyle={{ background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.08)', color: '#FFFFFF', fontSize: 12 }} />
          <Legend wrapperStyle={{ color: '#A0A0A0' }} />
          <Bar dataKey="Redis" fill="#3B82F6" radius={[4,4,0,0]} />
          <Bar dataKey="Memcached" fill="#7aa2f7" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}


