export type MetricRow = {
  metric: string
  A: number
  B: number
  delta: number
}

export interface ComparisonResultProps {
  titleLeft: string
  titleRight: string
  metricsArray: MetricRow[]
  radarArray: { metric: string; A: number; B: number }[]
  confidence?: 'low' | 'medium' | 'high'
  validation?: string
  evidence?: string[]
  comparisonId?: string
}


