"use client";

import { useEffect, useMemo, useState } from "react";
import ComparisonResult from "@/components/ComparisonResult";
import PromptBox from "@/components/compare/PromptBox";
import CategoriesBar from "@/components/compare/CategoriesBar";
import OptionSelector from "@/components/compare/OptionSelector";
import ComparisonMetricRow from "@/components/compare/ComparisonMetricRow";
import { fetchCategories, type Category } from "@/lib/catalog";

export default function ComparePage() {
  const [prompt, setPrompt] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Catalog data
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const canRun = useMemo(
    () => !!prompt && !!optionA && !!optionB,
    [prompt, optionA, optionB]
  );

  const handleCompare = async () => {
    if (!prompt || !optionA || !optionB) {
      setError("Please fill in all fields before comparing.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/api/orchestrator/compare`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: prompt,
            options: [optionA, optionB],
            metrics: [],
            context: {},
          }),
        }
      );
      if (!res.ok) throw new Error("Request failed");
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError("Error connecting to backend. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Convert metrics object to array format for new component
  const metricsArray = useMemo(() => {
    if (!data?.metrics) return [];
    
    // Handle both array and object formats
    if (Array.isArray(data.metrics)) {
      return data.metrics;
    }
    
    // Convert object format to array
    return Object.entries(data.metrics).map(([name, values]: [string, any]) => ({
      name,
      A: values.A || 0,
      B: values.B || 0,
      delta: values.delta || "0%",
      explanation: values.explanation,
      A_reason: values.A_reason,
      B_reason: values.B_reason,
    }));
  }, [data]);

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10 sm:py-12 bg-gradient-to-b from-slate-950 to-slate-900 text-gray-100">
      <h1 className="text-3xl sm:text-4xl font-semibold mb-6 sm:mb-8 text-center tracking-tight">Compare Anything</h1>

      <div className="mx-auto max-w-6xl space-y-6">
        {/* Prompt Box */}
        <PromptBox value={prompt} onChange={setPrompt} />

        {/* Categories Bar */}
        <div className="pt-2">
          <CategoriesBar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Option Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <OptionSelector
            label="Option A"
            value={optionA}
            onChange={setOptionA}
            category={selectedCategory}
          />
          <OptionSelector
            label="Option B"
            value={optionB}
            onChange={setOptionB}
            category={selectedCategory}
          />
        </div>

        {/* Run Comparison Button */}
        <button
          onClick={handleCompare}
          disabled={loading || !canRun}
          className="w-full bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg font-medium disabled:opacity-50 transition-all shadow-sm"
        >
          {loading ? "Analyzing…" : "Run Comparison"}
        </button>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        {/* Results Area */}
        <div className="mt-8">
          {data ? (
            <div className="space-y-6">
              {/* Show existing ComparisonResult for backward compatibility */}
              <div className="rounded-lg border border-slate-800 bg-slate-900/40">
                <ComparisonResult rawJson={data} />
              </div>

              {/* Enhanced detailed metrics using orchestrator data only */}
              {metricsArray.length > 0 && (
                <div className="mt-6 bg-slate-900/60 rounded-lg p-4 sm:p-6 border border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                    <h2 className="text-xl font-semibold text-slate-200">
                      Detailed Metrics
                    </h2>
                    <div className="flex gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                        <span>{data.left || optionA}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span>{data.right || optionB}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-slate-800">
                    {metricsArray.map((metric: any, idx: number) => (
                      <ComparisonMetricRow
                        key={metric.name || idx}
                        metric={metric}
                        leftName={data.left || optionA}
                        rightName={data.right || optionB}
                      />
                    ))}
                  </div>

                  {/* Summary Section */}
                  {data.summary && (
                    <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="text-sm font-medium text-slate-300 mb-2">
                        Recommendation
                      </div>
                      <div className="text-sm text-slate-200">{data.summary}</div>
                      {data.confidence && (
                        <div className="mt-2 text-xs text-slate-400">
                          Confidence: <span className="text-slate-300 font-medium">{data.confidence}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400 mt-8 text-center">
              Enter a prompt, select two options above, and click "Run Comparison" to see
              results.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
