"use client";

import { useEffect, useMemo, useState } from "react";
import DecisionBrief from "@/components/DecisionBrief";
import ShareButtons from "@/components/ShareButtons";
import PromptBox from "@/components/compare/PromptBox";
import CategoriesBar from "@/components/compare/CategoriesBar";
import OptionSelector from "@/components/compare/OptionSelector";
import { fetchCategories, type Category } from "@/lib/catalog";

export default function ComparePage() {
  const [prompt, setPrompt] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [briefData, setBriefData] = useState<{ brief: string; slider_data?: any; value_metrics?: any; query?: string; comparison_id?: string; share_url?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useMultiAgent, setUseMultiAgent] = useState(true); // Toggle for new vs old endpoint

  // Catalog data
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
    
    // Handle "Compare something else" button click
    const handleCompareAnother = () => {
      setPrompt("")
      setOptionA("")
      setOptionB("")
      setBriefData(null)
      setError(null)
    }
    
    window.addEventListener('compare-another', handleCompareAnother)
    return () => window.removeEventListener('compare-another', handleCompareAnother)
  }, []);

  const canRun = useMemo(
    () => useMultiAgent ? !!prompt : (!!prompt && !!optionA && !!optionB),
    [prompt, optionA, optionB, useMultiAgent]
  );

  const handleCompare = async () => {
    if (useMultiAgent) {
      if (!prompt) {
        setError("Please enter a comparison query.");
        return;
      }
    } else {
      if (!prompt || !optionA || !optionB) {
        setError("Please fill in all fields before comparing.");
        return;
      }
    }

    setError(null);
    setLoading(true);
    try {
      const endpoint = useMultiAgent 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"}/api/compare`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/api/orchestrator/compare`;
      
      const body = useMultiAgent
        ? JSON.stringify({ query: prompt })
        : JSON.stringify({
            query: prompt,
            options: [optionA, optionB],
            metrics: [],
            context: {},
          });

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Request failed");
      }
      
      const json = await res.json();
      
      if (useMultiAgent) {
        // New multi-agent endpoint returns { brief, slider_data, value_metrics, query, comparison_id, share_url }
        setBriefData({
          brief: json.brief,
          slider_data: json.slider_data,
          value_metrics: json.value_metrics,
          query: json.query || prompt,
          comparison_id: json.comparison_id,
          share_url: json.share_url,
        });
      } else {
        // Old endpoint - convert to brief format (for backward compatibility)
        setBriefData({
          brief: json.summary || "Comparison completed. Please use the new multi-agent endpoint for Decision Briefs.",
          query: prompt,
        });
      }
    } catch (e: any) {
      setError(e.message || "Error connecting to backend. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10 sm:py-12 bg-gradient-to-b from-slate-950 to-slate-900 text-gray-100">
      <h1 className="text-3xl sm:text-4xl font-semibold mb-6 sm:mb-8 text-center tracking-tight">
        Compare Anything
      </h1>

      <div className="mx-auto max-w-6xl space-y-6">
        {/* Mode Toggle */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={() => setUseMultiAgent(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              useMultiAgent
                ? "bg-green-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            🚀 Multi-Agent (Decision Brief)
          </button>
          <button
            onClick={() => setUseMultiAgent(false)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !useMultiAgent
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            📊 Legacy (Metrics)
          </button>
        </div>

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

        {/* Option Selectors - only show for legacy mode */}
        {!useMultiAgent && (
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
        )}

        {/* Run Comparison Button */}
        <button
          onClick={handleCompare}
          disabled={loading || !canRun}
          className="w-full bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg font-medium disabled:opacity-50 transition-all shadow-sm"
        >
          {loading ? "Generating Decision Brief…" : useMultiAgent ? "Get Decision Brief" : "Run Comparison"}
        </button>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        {/* Results Area */}
        <div className="mt-8">
          {briefData ? (
            <>
              <DecisionBrief
                brief={briefData.brief}
                sliderData={briefData.slider_data}
                valueMetrics={briefData.value_metrics}
                query={briefData.query}
              />
              
              {/* Share Buttons */}
              {briefData.comparison_id && briefData.share_url && (
                <div className="max-w-4xl mx-auto mt-6">
                  <ShareButtons
                    url={briefData.share_url}
                    text={`I just compared ${briefData.query} with PM Architect — this saved me hours of research!`}
                    comparisonId={briefData.comparison_id}
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-400 mt-8 text-center">
              {useMultiAgent
                ? "Enter a comparison query above and click 'Get Decision Brief' to see your personalized recommendation."
                : "Enter a prompt, select two options above, and click 'Run Comparison' to see results."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
