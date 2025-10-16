"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Decision } from "@/types/decision";
import DecisionCard from "@/components/DecisionCard";
import TagFilter from "@/components/TagFilter";
import DashboardAnalytics from "@/components/DashboardAnalytics";
import { decisionsApi, handleApiError } from "@/lib/api";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    loadDecisions();
  }, [session, status, router]);

  const loadDecisions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await decisionsApi.getAll();
      
      if (response.error) {
        setError(handleApiError(response.error, 'Failed to load decisions'));
      } else if (response.data) {
        setDecisions(response.data);
      }
    } catch (error) {
      setError('Failed to load decisions');
      console.error('Error loading decisions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDecisions = selectedTags.length === 0
    ? decisions
    : decisions.filter(decision => 
        decision.tags.some(tag => selectedTags.includes(tag))
      );

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {session.user?.name || session.user?.email}! Here's an overview of your decisions.
          </p>
        </div>

        {/* Analytics Section */}
        <div className="mb-8">
          <DashboardAnalytics decisions={decisions} />
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex-1">
            <TagFilter
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              availableTags={Array.from(new Set(decisions.flatMap(d => d.tags)))}
            />
          </div>
          <button
            onClick={() => router.push("/decision/new")}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Decision
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading decisions</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={loadDecisions}
                    className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Decisions Grid */}
        {filteredDecisions.length === 0 ? (
          <div className="text-center py-12">
            {decisions.length === 0 ? (
              // No decisions at all
              <div>
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No decisions yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first decision.</p>
                <div className="mt-6">
                  <button
                    onClick={() => router.push("/decision/new")}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create Decision
                  </button>
                </div>
              </div>
            ) : (
              // No decisions match the filter
              <div>
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No decisions match your filters</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your tag selection or clear all filters.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setSelectedTags([])}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDecisions.map((decision) => (
              <DecisionCard key={decision.id} decision={decision} />
            ))}
          </div>
        )}

        {/* Results Summary */}
        {filteredDecisions.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Showing {filteredDecisions.length} of {decisions.length} decisions
            {selectedTags.length > 0 && (
              <span> matching your filters</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 