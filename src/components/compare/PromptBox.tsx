"use client";

import React from "react";

interface PromptBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function PromptBox({
  value,
  onChange,
  placeholder = "Describe what to compare (e.g., Firebase vs Supabase for MVP, low infra cost)",
}: PromptBoxProps) {
  const count = value.length;
  return (
    <div className="w-full">
      <label className="block text-sm text-slate-400 mb-2">
        Comparison Prompt
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y text-slate-100 placeholder:text-slate-500 shadow-sm"
      />
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-slate-500">
          Provide context about your use case, requirements, or constraints
        </p>
        <span className="text-[11px] text-slate-500">{count}/500</span>
      </div>
    </div>
  );
}

