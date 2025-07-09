import { mockDecisions } from "@/data/mock-decisions";
import { Decision } from "@/types/decision";
import DecisionCard from "@/components/DecisionCard";

export default function DashboardPage() {
  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-semibold mb-6">Decision Dashboard</h1>
      <div className="space-y-4">
        {mockDecisions.map((decision: Decision) => (
          <DecisionCard key={decision.id} decision={decision} />
        ))}
      </div>
    </main>
  );
} 