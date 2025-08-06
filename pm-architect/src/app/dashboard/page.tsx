"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Decision } from "@/types/decision";
import DecisionCard from "@/components/DecisionCard";
import TagFilter from "@/components/TagFilter";
import { decisionsApi, handleApiError } from "@/lib/api";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Fetch decisions from API
  useEffect(() => {
    if (status === "authenticated" && session) {
      fetchDecisions();
    }
  }, [status, session]);

  const fetchDecisions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await decisionsApi.getAll({
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      });

      if (response.error) {
        setError(handleApiError(response.error, 'Failed to load decisions'));
      } else if (response.data) {
        setDecisions(response.data);
      }
    } catch (err) {
      setError('Failed to load decisions');
      console.error('Error fetching decisions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refetch decisions when tags change
  useEffect(() => {
    if (status === "authenticated") {
      fetchDecisions();
    }
  }, [selectedTags]);

  if (status === "loading" || loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <div className="text-gray-400">Loading decisions...</div>
        </div>
      </div>
    );
  }

  if (!session) return null;

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <button
            onClick={fetchDecisions}
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded font-semibold transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const filteredDecisions = selectedTags.length === 0
    ? decisions
    : decisions.filter((decision: Decision) =>
        decision.tags?.some((tag) => selectedTags.includes(tag))
      );

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Decision Dashboard</h1>
        <button
          onClick={() => router.push('/decision/new')}
          className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded font-semibold transition"
        >
          New Decision
        </button>
      </div>
      
      <TagFilter selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
      
      <div className="space-y-4 mt-6">
        {filteredDecisions.length > 0 ? (
          filteredDecisions.map((decision: Decision) => (
            <DecisionCard key={decision.id} decision={decision} />
          ))
        ) : (
          <div className="text-center py-12">
            {decisions.length === 0 ? (
              <div>
                <div className="text-gray-400 mb-4">No decisions yet.</div>
                <button
                  onClick={() => router.push('/decision/new')}
                  className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded font-semibold transition"
                >
                  Create Your First Decision
                </button>
              </div>
            ) : (
              <div className="text-gray-400">No decisions match the selected tags.</div>
            )}
          </div>
        )}
      </div>
    </main>
  );
} 