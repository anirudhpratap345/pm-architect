"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

interface MetricData {
  name: string;
  A: number;
  B: number;
  delta: string;
  explanation?: string;
  A_reason?: string;
  B_reason?: string;
}

interface ComparisonMetricRowProps {
  metric: MetricData;
  leftName: string;
  rightName: string;
}

export default function ComparisonMetricRow({
  metric,
  leftName,
  rightName,
}: ComparisonMetricRowProps) {
  const [expanded, setExpanded] = useState(false);

  const hasDetails = metric.explanation || metric.A_reason || metric.B_reason;

  return (
    <div className="border-b border-slate-800 py-4">
      <div className="flex items-start gap-4">
        {/* Metric Name and Explanation */}
        <div className="flex-1">
          <div className="text-sm font-medium text-slate-300 mb-2">
            {metric.name}
          </div>
          
          {/* General Explanation - Always visible if exists */}
          {metric.explanation && (
            <div className="flex items-start gap-2 p-2 rounded-md bg-slate-800/50 mb-3">
              <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm text-slate-200">{metric.explanation}</div>
                {hasDetails && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-xs text-indigo-300 mt-1 hover:underline flex items-center gap-1"
                  >
                    {expanded ? (
                      <>
                        <ChevronUp className="w-3 h-3" />
                        Hide tech-specific details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" />
                        Show tech-specific details
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Tech-specific reasons - Expandable */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                {metric.A_reason && (
                  <div className="bg-slate-900/40 p-3 rounded border-l-2 border-indigo-500">
                    <div className="text-xs text-slate-400 mb-1 font-medium">
                      {leftName}
                    </div>
                    <div className="text-sm text-slate-200">{metric.A_reason}</div>
                  </div>
                )}
                {metric.B_reason && (
                  <div className="bg-slate-900/40 p-3 rounded border-l-2 border-purple-500">
                    <div className="text-xs text-slate-400 mb-1 font-medium">
                      {rightName}
                    </div>
                    <div className="text-sm text-slate-200">{metric.B_reason}</div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scores Side-by-Side */}
        <div className="flex gap-6">
          {/* Option A Score */}
          <div className="w-24 text-center">
            <div className="text-xs text-slate-400 mb-1">{leftName}</div>
            <div className="text-2xl font-semibold text-slate-100">
              {metric.A}
            </div>
          </div>

          {/* Delta */}
          <div className="w-20 text-center flex items-center justify-center">
            <div className={`text-sm font-medium ${
              metric.delta.startsWith('+') ? 'text-green-400' : 
              metric.delta.startsWith('-') ? 'text-red-400' : 
              'text-slate-400'
            }`}>
              {metric.delta}
            </div>
          </div>

          {/* Option B Score */}
          <div className="w-24 text-center">
            <div className="text-xs text-slate-400 mb-1">{rightName}</div>
            <div className="text-2xl font-semibold text-slate-100">
              {metric.B}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

