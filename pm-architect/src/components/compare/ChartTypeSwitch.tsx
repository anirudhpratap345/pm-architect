'use client'

export function ChartTypeSwitch({ type, onChange }: { type: 'bar' | 'radar'; onChange: (t: 'bar' | 'radar') => void }) {
  return (
    <div className="inline-flex rounded border overflow-hidden">
      <button onClick={() => onChange('bar')} className={`px-3 py-1 text-sm ${type === 'bar' ? 'bg-gray-800 text-white' : 'bg-white'}`}>Bar</button>
      <button onClick={() => onChange('radar')} className={`px-3 py-1 text-sm ${type === 'radar' ? 'bg-gray-800 text-white' : 'bg-white'}`}>Radar</button>
    </div>
  )
}


