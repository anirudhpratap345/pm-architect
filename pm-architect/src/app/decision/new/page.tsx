"use client";

import DecisionForm from "@/components/DecisionForm";
import TradeoffCard from "@/components/TradeoffCard";
import { suggestTradeoffs } from "@/lib/tradeoffs";
import { useState } from "react";

export default function DecisionNewPage() {
  const [tradeoffSuggestions, setTradeoffSuggestions] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (formData: any) => {
    const suggestions = suggestTradeoffs(formData);
    setTradeoffSuggestions(suggestions);
    setSubmitted(true);
  };

  return (
    <div>
      <DecisionForm onSubmit={handleSubmit} />
      {submitted && tradeoffSuggestions.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-white mb-4">Tradeoff Suggestions</h2>
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
      )}
    </div>
  );
} 