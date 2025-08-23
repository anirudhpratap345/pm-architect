"use client";

import { useRouter } from "next/navigation";
import DecisionForm from "@/components/DecisionForm";
import TradeoffCard from "@/components/TradeoffCard";
import { suggestTradeoffs } from "@/lib/tradeoffs";
import { decisionsApi, handleApiError, showSuccessMessage, showErrorMessage } from "@/lib/api";
import { useState } from "react";

export default function DecisionNewPage() {
  const router = useRouter();
  const [tradeoffSuggestions, setTradeoffSuggestions] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: any) => {
    try {
      setLoading(true);
      setError(null);

      // Create the decision in the database
      const response = await decisionsApi.create({
        title: formData.title,
        description: formData.description,
        context: formData.description,
        options: formData.options,
        constraints: formData.constraints,
        metrics: formData.metrics,
        stakeholders: formData.stakeholders,
        deadline: formData.deadline || null,
        tags: [], // You can add tag selection later
        priority: formData.priority || 'medium',
      });

      if (response.error) {
        setError(handleApiError(response.error, 'Failed to create decision'));
        return;
      }

      // Show success message
      showSuccessMessage('Decision created successfully!');

      // Generate tradeoff suggestions
      const suggestions = suggestTradeoffs(formData);
      setTradeoffSuggestions(suggestions);
      setSubmitted(true);

      // Redirect to the new decision after a short delay
      setTimeout(() => {
        router.push(`/decision/${response.data.id}`);
      }, 2000);

    } catch (err) {
      setError('Failed to create decision');
      showErrorMessage('Failed to create decision');
      console.error('Error creating decision:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Decision</h1>
        <p className="text-gray-400">Document and analyze your next important decision</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
          <div className="text-red-400 font-medium">Error</div>
          <div className="text-red-300">{error}</div>
        </div>
      )}

      <DecisionForm onSubmit={handleSubmit} />

      {loading && (
        <div className="mt-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <div className="text-gray-400">Creating decision...</div>
        </div>
      )}

      {submitted && tradeoffSuggestions.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-white mb-4">Tradeoff Suggestions</h2>
          <div className="space-y-4">
            {tradeoffSuggestions.map((s, i) => (
              <TradeoffCard
                key={i}
                title={s.title}
                context={s.context}
                options={s.options}
                recommendation={s.recommendation}
              />
            ))}
          </div>
          <div className="mt-6 text-center">
            <div className="text-green-400 mb-2">✅ Decision created successfully!</div>
            <div className="text-gray-400">Redirecting to your decision...</div>
          </div>
        </div>
      )}
    </div>
  );
} 