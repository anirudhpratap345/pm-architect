import { normalizeComparison } from './normalizeComparison'

const SAMPLE_JSON = {
  id: 'cmp_01',
  left: 'Gemini 2.5',
  right: 'GPT-4o',
  metrics: {
    accuracy: { A: 91.2, B: 89.4, delta: 1.8 },
    latency: { A: 1.3, B: 1.1, delta: -15 },
    cost_efficiency: { A: 0.9, B: 1.2, delta: 33 }
  },
  confidence: 'high',
  validation: 're-evaluated',
  evidence: [
    'Model A better on factual grounding.',
    'Model B more consistent on creative examples.'
  ],
  comparisonId: 'cmp_01'
}

describe('normalizeComparison', () => {
  it('returns metrics array for sample json', () => {
    const res = normalizeComparison(SAMPLE_JSON)
    expect(Array.isArray(res.metricsArray)).toBe(true)
    expect(res.metricsArray.length).toBeGreaterThan(0)
    expect(res.titleLeft).toBe('Gemini 2.5')
    expect(res.titleRight).toBe('GPT-4o')
  })
})


