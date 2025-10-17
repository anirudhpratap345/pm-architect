export type MetricRow = { metric: string; A: number; B: number; delta: number }
export type NormalizedComparison = {
  titleLeft: string
  titleRight: string
  metricsArray: MetricRow[]
  radarArray: { metric: string; A: number; B: number }[]
  confidence: string
  validation?: string
  evidence: string[]
}

export function normalizeComparison(rawJson: any): NormalizedComparison {
  const json = rawJson || {}
  const titleLeft = json.left ?? json.optionA ?? 'Option A'
  const titleRight = json.right ?? json.optionB ?? 'Option B'

  const metricsArray: { metric: string; A: number; B: number; delta: number }[] = []
  const radarArray: { metric: string; A: number; B: number }[] = []

  const metrics = json.metrics ?? {}
  for (const key of Object.keys(metrics)) {
    const row = metrics[key] || {}
    const A = Number(row.A ?? 0)
    const B = Number(row.B ?? 0)
    let deltaVal: number = 0
    if (row.delta !== undefined && row.delta !== null) {
      if (typeof row.delta === 'string') {
        const cleaned = row.delta.replace('%', '').trim()
        const parsed = Number(cleaned)
        deltaVal = Number.isFinite(parsed) ? parsed : 0
      } else {
        deltaVal = Number(row.delta)
      }
    } else {
      deltaVal = A !== 0 ? ((B - A) / Math.abs(A)) * 100 : 0
    }
    const delta = Number.isFinite(deltaVal) ? deltaVal : 0
    metricsArray.push({ metric: key, A, B, delta })
    radarArray.push({ metric: key, A, B })
  }

  return {
    titleLeft,
    titleRight,
    metricsArray,
    radarArray,
    confidence: String(json.confidence || 'medium'),
    validation: json.validation,
    evidence: Array.isArray(json.evidence) ? json.evidence : (json.evidence ? [String(json.evidence)] : []),
  }
}


