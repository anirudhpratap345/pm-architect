'use client'

import React, { useState, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// @ts-ignore - type definitions may be incomplete
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ValueMetrics {
  time_saved_hours: number
  money_saved: number
  resources_consulted: {
    reddit_threads: number
    youtube_videos: number
    documentation_pages: number
    stackoverflow_posts: number
  }
  confidence: {
    score: number
    level: string
    explanation: string
    factors: string[]
  }
  completion_time_seconds: number
}

interface DecisionBriefProps {
  brief: string
  sliderData?: {
    users_levels?: number[]
    costs_a?: number[]
    costs_b?: number[]
  }
  valueMetrics?: ValueMetrics
  query?: string
}

function ValueSection({ metrics }: { metrics: ValueMetrics }) {
  const router = useRouter()
  
  const totalResources = metrics.resources_consulted.reddit_threads + 
                        metrics.resources_consulted.youtube_videos + 
                        metrics.resources_consulted.documentation_pages
  
  return (
    <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-green-900/40 via-emerald-900/30 to-teal-900/20 border-2 border-green-800/50 shadow-xl">
      <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-green-400">
        ⏱️ This comparison just saved you:
      </h3>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Time Saved */}
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center shadow-lg border border-green-800/30">
          <div className="text-4xl sm:text-5xl font-bold text-green-400 mb-1">
            {metrics.time_saved_hours}h
          </div>
          <div className="text-sm text-slate-300">Research Time</div>
        </div>
        
        {/* Money Saved */}
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center shadow-lg border border-green-800/30">
          <div className="text-4xl sm:text-5xl font-bold text-green-400 mb-1">
            ${metrics.money_saved.toLocaleString()}
          </div>
          <div className="text-sm text-slate-300">Year 1 Savings</div>
        </div>
        
        {/* Resources Saved */}
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center shadow-lg border border-green-800/30">
          <div className="text-4xl sm:text-5xl font-bold text-green-400 mb-1">
            {totalResources}
          </div>
          <div className="text-sm text-slate-300">Resources Analyzed</div>
        </div>
        
        {/* Completion Time */}
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center shadow-lg border border-green-800/30">
          <div className="text-4xl sm:text-5xl font-bold text-green-400 mb-1">
            {metrics.completion_time_seconds}s
          </div>
          <div className="text-sm text-slate-300">To Decision</div>
        </div>
      </div>
      
      {/* Confidence Level */}
      <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl mb-6 shadow-lg border border-green-800/30">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-slate-200 text-lg">
            📊 Confidence Level:
          </span>
          <span className="text-xl font-bold text-green-400">
            {metrics.confidence.level} ({metrics.confidence.score}/100)
          </span>
        </div>
        <p className="text-sm text-slate-300 italic mb-3">
          {metrics.confidence.explanation}
        </p>
        <div className="text-sm text-slate-400 space-y-1">
          <div className="font-medium mb-2">Based on:</div>
          {metrics.confidence.factors.map((factor, idx) => (
            <div key={idx}>• {factor}</div>
          ))}
        </div>
      </div>
      
      {/* Resources Breakdown */}
      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl mb-6 shadow-lg border border-green-800/30">
        <div className="text-sm text-slate-300 space-y-1">
          <div>• {metrics.resources_consulted.reddit_threads} Reddit threads avoided</div>
          <div>• {metrics.resources_consulted.youtube_videos} YouTube videos skipped</div>
          <div>• {metrics.resources_consulted.documentation_pages} documentation pages synthesized</div>
          <div>• {metrics.resources_consulted.stackoverflow_posts} Stack Overflow posts analyzed</div>
        </div>
      </div>
      
      {/* Time Comparison */}
      <div className="text-center mb-6">
        <p className="text-slate-200 text-lg">
          <span className="font-bold text-green-400">{metrics.completion_time_seconds} seconds</span>
          {' '}to decision vs{' '}
          <span className="font-bold text-slate-400">{metrics.time_saved_hours} hours</span>
          {' '}manually
        </p>
      </div>
      
      {/* CTA Button */}
      <div className="text-center">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            const event = new CustomEvent('compare-another')
            window.dispatchEvent(event)
          }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105 text-lg"
        >
          💬 Compare Something Else →
        </button>
      </div>
    </div>
  )
}

export default function DecisionBrief({ brief, sliderData, valueMetrics, query }: DecisionBriefProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['verdict', 'why']))
  const [sliderValue, setSliderValue] = useState(0)

  // Extract value section from brief
  const { mainBrief, valueSection } = useMemo(() => {
    const valueMarker = '---\n\n⏱️'
    const valueIndex = brief.indexOf(valueMarker)
    
    if (valueIndex > 0) {
      return {
        mainBrief: brief.substring(0, valueIndex).trim(),
        valueSection: brief.substring(valueIndex).trim()
      }
    }
    
    return {
      mainBrief: brief,
      valueSection: null
    }
  }, [brief])

  // Extract winner from brief
  const winner = useMemo(() => {
    const verdictMatch = brief.match(/# The Verdict\s*🎯\s*Pick\s+(\w+)/i)
    if (verdictMatch) return verdictMatch[1]
    return null
  }, [brief])

  // Extract cost data from brief
  const costData = useMemo(() => {
    const moneyMatch = brief.match(/# The Money[\s\S]*?💰[^$]*?\$([0-9,]+)[^$]*?\$([0-9,]+)/i)
    if (moneyMatch) {
      return {
        winnerCost: parseInt(moneyMatch[1].replace(/,/g, '')),
        loserCost: parseInt(moneyMatch[2].replace(/,/g, ''))
      }
    }
    return null
  }, [brief])

  // Calculate costs based on slider
  const currentCosts = useMemo(() => {
    if (!sliderData?.users_levels || !sliderData?.costs_a || !sliderData?.costs_b) {
      return costData
    }

    const levels = sliderData.users_levels
    const costsA = sliderData.costs_a
    const costsB = sliderData.costs_b

    if (sliderValue >= levels.length) {
      return {
        winnerCost: costsA[costsA.length - 1] || costData?.winnerCost,
        loserCost: costsB[costsB.length - 1] || costData?.loserCost
      }
    }

    return {
      winnerCost: costsA[sliderValue] || costData?.winnerCost,
      loserCost: costsB[sliderValue] || costData?.loserCost
    }
  }, [sliderValue, sliderData, costData])

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(section)) {
        next.delete(section)
      } else {
        next.add(section)
      }
      return next
    })
  }

  const isSectionExpanded = (section: string) => expandedSections.has(section)

  // Custom renderer for markdown components
  const components = {
    h1: ({ children, ...props }: any) => {
      const text = String(children)
      if (text.includes('The Verdict')) {
        return (
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-green-400" {...props}>
            {children}
          </h1>
        )
      }
      return <h1 className="text-2xl sm:text-3xl font-bold mt-8 mb-4 text-slate-200" {...props}>{children}</h1>
    },
    h2: ({ children, ...props }: any) => (
      <h2 className="text-xl sm:text-2xl font-semibold mt-6 mb-3 text-slate-200" {...props}>{children}</h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 className="text-lg sm:text-xl font-medium mt-4 mb-2 text-slate-300" {...props}>{children}</h3>
    ),
    p: ({ children, ...props }: any) => (
      <p className="text-slate-300 leading-relaxed mb-4" {...props}>{children}</p>
    ),
    ul: ({ children, ...props }: any) => (
      <ul className="list-disc list-inside mb-4 space-y-2 text-slate-300" {...props}>{children}</ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 text-slate-300" {...props}>{children}</ol>
    ),
    li: ({ children, ...props }: any) => (
      <li className="ml-4" {...props}>{children}</li>
    ),
    strong: ({ children, ...props }: any) => {
      const text = String(children)
      if (winner && text.includes(winner)) {
        return <strong className="text-green-400 font-bold" {...props}>{children}</strong>
      }
      return <strong className="text-slate-200 font-semibold" {...props}>{children}</strong>
    },
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '')
      const codeString = String(children).replace(/\n$/, '')
      const codeId = `code-${Math.random().toString(36).substr(2, 9)}`

      if (!inline && match) {
        return (
          <div className="relative my-4 group">
            <button
              onClick={() => copyCode(codeString, codeId)}
              className="absolute top-2 right-2 z-10 p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors opacity-0 group-hover:opacity-100"
              title="Copy code"
            >
              {copiedCode === codeId ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-slate-300" />
              )}
            </button>
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              className="rounded-lg"
              {...props}
            >
              {codeString}
            </SyntaxHighlighter>
          </div>
        )
      }

      return (
        <code className="px-1.5 py-0.5 bg-slate-800 rounded text-sm text-slate-200" {...props}>
          {children}
        </code>
      )
    },
    blockquote: ({ children, ...props }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-slate-400" {...props}>
        {children}
      </blockquote>
    ),
  }

  // Parse brief into sections for collapsible functionality
  const sections = useMemo(() => {
    const sectionRegex = /#\s+([^\n]+)/g
    const sections: Array<{ title: string; content: string; id: string }> = []
    let lastIndex = 0
    let match

    while ((match = sectionRegex.exec(brief)) !== null) {
      if (lastIndex < match.index) {
        const prevSection = sections[sections.length - 1]
        if (prevSection) {
          prevSection.content = brief.substring(lastIndex, match.index).trim()
        }
      }
      
      const title = match[1]
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      sections.push({ title, content: '', id })
      lastIndex = match.index + match[0].length
    }

    // Add remaining content to last section
    if (sections.length > 0 && lastIndex < brief.length) {
      sections[sections.length - 1].content = brief.substring(lastIndex).trim()
    }

    return sections
  }, [brief])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-900/60 rounded-lg border border-slate-800 p-6 sm:p-8">
        {/* Cost Slider */}
        {sliderData?.users_levels && sliderData.users_levels.length > 0 && (
          <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Monthly Active Users: {sliderData.users_levels[sliderValue]?.toLocaleString() || 'N/A'}
            </label>
            <input
              type="range"
              min="0"
              max={sliderData.users_levels.length - 1}
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            {currentCosts && (
              <div className="mt-3 text-sm text-slate-400">
                Estimated Year 1 Cost: <span className="text-green-400 font-semibold">${currentCosts.winnerCost?.toLocaleString()}</span> vs <span className="text-slate-300">${currentCosts.loserCost?.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}

        {/* Markdown Content */}
        <div className="prose prose-invert prose-slate max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={components as any}
          >
            {mainBrief}
          </ReactMarkdown>
        </div>

        {/* Value Delivered Section */}
        {valueMetrics && <ValueSection metrics={valueMetrics} />}

        {/* Feedback Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-700 flex flex-wrap gap-3">
          <button
            onClick={() => {/* TODO: Implement feedback */}}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            👍 Helpful
          </button>
          <button
            onClick={() => {/* TODO: Implement feedback */}}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-medium transition-colors"
          >
            👎 Not helpful
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(brief)
              setCopiedCode('full-brief')
              setTimeout(() => setCopiedCode(null), 2000)
            }}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            {copiedCode === 'full-brief' ? (
              <>
                <Check className="w-4 h-4" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Brief
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .decision-brief {
          color: #e2e8f0;
        }
        .decision-brief h1 {
          font-size: 2rem;
          line-height: 1.2;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .decision-brief h1:first-child {
          margin-top: 0;
        }
        .decision-brief h2 {
          font-size: 1.5rem;
          line-height: 1.3;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .decision-brief h3 {
          font-size: 1.25rem;
          line-height: 1.4;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .decision-brief p {
          margin-bottom: 1rem;
        }
        .decision-brief ul, .decision-brief ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .decision-brief li {
          margin-bottom: 0.5rem;
        }
        .decision-brief code {
          font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
          font-size: 0.9em;
        }
        .decision-brief pre {
          margin: 1rem 0;
          border-radius: 0.5rem;
          overflow-x: auto;
        }
        .decision-brief blockquote {
          margin: 1rem 0;
        }
        .decision-brief a {
          color: #60a5fa;
          text-decoration: underline;
        }
        .decision-brief a:hover {
          color: #93c5fd;
        }
        @media (max-width: 640px) {
          .decision-brief h1 {
            font-size: 1.75rem;
          }
          .decision-brief h2 {
            font-size: 1.25rem;
          }
          .decision-brief h3 {
            font-size: 1.125rem;
          }
          .decision-brief pre {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  )
}

