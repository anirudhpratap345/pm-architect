'use client'

import React from 'react'
import type { ComparisonResultProps } from './ComparisonResult.types'
import { normalizeComparison } from '@/lib/normalizeComparison'
import dynamic from 'next/dynamic'
import MetricTable from './MetricTable'
import ConfidenceBadge from './ConfidenceBadge'
import EvidenceAccordion from './EvidenceAccordion'
import ReRunButton from './ReRunButton'

const PerformanceBar = dynamic(() => import('./PerformanceBar').then(m => m.PerformanceBar), { ssr: false })
const BalanceRadar = dynamic(() => import('./BalanceRadar').then(m => m.BalanceRadar), { ssr: false })

export default function ComparisonResult({ rawJson, onRefetch }: ComparisonResultProps & { onRefetch?: () => void }) {
  const { titleLeft, titleRight, metricsArray, radarArray, confidence, validation, evidence } = normalizeComparison(rawJson)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="text-lg font-semibold text-gray-900">{titleLeft} vs {titleRight}</div>
          <ConfidenceBadge confidence={confidence || 'medium'} validation={validation} />
        </div>
        {onRefetch ? <ReRunButton onRefetch={onRefetch} /> : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <MetricTable metrics={metricsArray} />
        </div>
        <div className="space-y-4">
          <div className="h-64"><PerformanceBar data={metricsArray} /></div>
          <div className="h-64"><BalanceRadar data={metricsArray} /></div>
        </div>
      </div>

      <div>
        <EvidenceAccordion evidence={evidence || []} />
      </div>
    </div>
  )
}


