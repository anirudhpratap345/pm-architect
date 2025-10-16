"use client";

import React from "react";

interface TradeoffCardProps {
  title: string;
  context: string;
  options: { name: string; pros: string[]; cons: string[] }[];
  recommendation: string;
}

export default function TradeoffCard({ title, context, options, recommendation }: TradeoffCardProps) {
  return (
    <div className="bg-[#18181b] rounded-2xl shadow-lg border border-gray-800 p-6 mb-6">
      <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
      <p className="text-gray-300 text-sm mb-4">{context}</p>
      <div className="flex flex-col gap-4 mb-4">
        {options.map((opt) => (
          <div key={opt.name} className="bg-[#23232a] rounded-xl p-4">
            <div className="font-semibold text-sky-400 mb-1">{opt.name}</div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <div className="font-medium text-green-400 flex items-center gap-1 mb-1">
                  <span>✔</span> Pros
                </div>
                <ul className="list-disc list-inside text-gray-200 text-sm">
                  {opt.pros.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-medium text-red-400 flex items-center gap-1 mb-1">
                  <span>✖</span> Cons
                </div>
                <ul className="list-disc list-inside text-gray-400 text-sm">
                  {opt.cons.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-700 pt-4 mt-4">
        <div className="font-semibold text-sky-400 mb-1">Recommendation</div>
        <p className="text-gray-200 text-sm">{recommendation}</p>
      </div>
    </div>
  );
} 