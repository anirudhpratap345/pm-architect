"use client";
import { mockDecisions } from "@/data/mock-decisions";
import { Decision } from "@/types/decision";
import DecisionCard from "@/components/DecisionCard";
import TagFilter from "@/components/TagFilter";
import { useState } from "react";

export default function DashboardPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredDecisions = selectedTags.length === 0
    ? mockDecisions
    : mockDecisions.filter((decision: Decision) =>
        decision.tags?.some((tag) => selectedTags.includes(tag))
      );

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-semibold mb-6">Decision Dashboard</h1>
      <TagFilter selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
      <div className="space-y-4">
        {filteredDecisions.map((decision: Decision) => (
          <DecisionCard key={decision.id} decision={decision} />
        ))}
        {filteredDecisions.length === 0 && (
          <div className="text-gray-400 text-center py-12">No decisions match the selected tags.</div>
        )}
      </div>
    </main>
  );
} 