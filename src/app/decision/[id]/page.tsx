"use client";
import { Decision } from "@/types/decision";
import { formatDate } from "@/lib/utils";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { use, useState, useEffect } from "react";
import Comments from "@/components/Comments";
import { decisionsApi, handleApiError } from "@/lib/api";

interface DecisionDetailPageProps {
  params: Promise<{ id: string }>;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "open", label: "Open" },
  { value: "resolved", label: "Resolved" },
];

export default function DecisionDetailPage({ params }: DecisionDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Decision["status"]>('open');
  const [statusUpdated, setStatusUpdated] = useState(false);

  // Fetch decision data
  useEffect(() => {
    fetchDecision();
  }, [id]);

  const fetchDecision = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await decisionsApi.getById(id);
      
      if (response.error) {
        setError(handleApiError(response.error, 'Failed to load decision'));
        return;
      }
      
      if (response.data) {
        setDecision(response.data);
        setStatus(response.data.status);
      }
    } catch (err) {
      setError('Failed to load decision');
      console.error('Error fetching decision:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Decision["status"];
    setStatus(newStatus);
    setStatusUpdated(true);

    try {
      const response = await decisionsApi.update(id, { status: newStatus });
      
      if (response.error) {
        setError(handleApiError(response.error, 'Failed to update status'));
        setStatus(decision?.status || 'open'); // Revert on error
      } else {
        // Update local state
        setDecision(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      setError('Failed to update status');
      setStatus(decision?.status || 'open'); // Revert on error
      console.error('Error updating status:', err);
    }

    setTimeout(() => setStatusUpdated(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this decision? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await decisionsApi.delete(id);
      
      if (response.error) {
        setError(handleApiError(response.error, 'Failed to delete decision'));
        return;
      }
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to delete decision');
      console.error('Error deleting decision:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <div className="text-gray-400">Loading decision...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <button
            onClick={fetchDecision}
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded font-semibold transition mr-2"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!decision) {
    return notFound();
  }

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      {/* Header with Edit and Delete buttons */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold">{decision.title}</h1>
        <div className="flex gap-2">
          <Link
            href={`/decision/${decision.id}/edit`}
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded font-semibold text-sm transition"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold text-sm transition"
          >
            Delete
          </button>
        </div>
      </div>
      
      <p className="text-sm text-gray-500 mb-2">
        {formatDate(new Date(decision.createdAt).toISOString())}
      </p>
      
      {/* Status Badge and Dropdown */}
      <div className="flex items-center mb-4 gap-2 flex-wrap">
        <span className="inline-block px-3 py-1 rounded bg-blue-100 text-blue-700 text-sm font-medium">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        <select
          value={status}
          onChange={handleStatusChange}
          className="border border-gray-300 rounded px-2 py-1 text-sm ml-2 bg-[#18181b] text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {statusUpdated && (
          <p className="text-green-600 text-sm ml-2">
            ✅ Status updated to {status.charAt(0).toUpperCase() + status.slice(1)}
          </p>
        )}
      </div>
      
      <p className="text-xs text-gray-400 mt-1 mb-2">
        Last updated: {formatDate(new Date(decision.updatedAt).toISOString())}
      </p>

      {/* Context/Description */}
      <div className="border-t pt-6 mt-6">
        <h2 className="text-lg font-semibold mb-2">Context / Description</h2>
        <p className="text-gray-200">{decision.context}</p>
      </div>

      {/* Options Compared */}
      <div className="border-t pt-6 mt-6">
        <h2 className="text-lg font-semibold mb-2">Options Compared</h2>
        <div className="flex flex-col gap-6">
          {decision.options?.map((opt: any, index: number) => (
            <div key={index} className="bg-[#18181b] rounded-xl p-4 shadow flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="font-semibold text-white text-base mb-1">{opt.name || opt}</div>
                {opt.description && (
                  <div className="text-gray-300 mb-2 text-sm">{opt.description}</div>
                )}
                {opt.pros && opt.cons && (
                  <div className="flex flex-wrap gap-4 mb-2">
                    {/* Pros */}
                    <div>
                      <div className="font-medium text-green-400 flex items-center gap-1 mb-1">
                        <span>✔</span> Pros
                      </div>
                      <ul className="list-disc list-inside text-gray-200 text-sm">
                        {opt.pros.map((p: string, i: number) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                    {/* Cons */}
                    <div>
                      <div className="font-medium text-red-400 flex items-center gap-1 mb-1">
                        <span>✖</span> Cons
                      </div>
                      <ul className="list-disc list-inside text-gray-400 text-sm">
                        {opt.cons.map((c: string, i: number) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              {opt.estimatedCost !== undefined || opt.estimatedTime || opt.riskLevel ? (
                <div className="flex flex-col gap-2 min-w-[140px]">
                  {opt.estimatedCost !== undefined && (
                    <span className="inline-block bg-gray-800 text-gray-200 px-3 py-1 rounded text-xs font-medium">
                      Est. Cost: ${opt.estimatedCost.toLocaleString()}
                    </span>
                  )}
                  {opt.estimatedTime && (
                    <span className="inline-block bg-gray-800 text-gray-200 px-3 py-1 rounded text-xs font-medium">
                      Est. Time: {opt.estimatedTime}
                    </span>
                  )}
                  {opt.riskLevel && (
                    <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                      opt.riskLevel === "high"
                        ? "bg-red-900 text-red-200"
                        : opt.riskLevel === "medium"
                        ? "bg-yellow-900 text-yellow-200"
                        : "bg-green-900 text-green-200"
                    }`}>
                      Risk: {opt.riskLevel.charAt(0).toUpperCase() + opt.riskLevel.slice(1)}
                    </span>
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Constraints */}
      {decision.constraints && decision.constraints.length > 0 && (
        <div className="border-t pt-6 mt-6">
          <h2 className="text-lg font-semibold mb-2">Constraints</h2>
          <ul className="list-disc list-inside text-gray-300">
            {decision.constraints.map((c: string, index: number) => (
              <li key={index}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Timeline */}
      <div className="border-t pt-6 mt-6">
        <h2 className="text-lg font-semibold mb-2">Timeline</h2>
        <ul className="text-gray-300">
          <li>Created: {formatDate(new Date(decision.createdAt).toISOString())}</li>
          <li>Updated: {formatDate(new Date(decision.updatedAt).toISOString())}</li>
        </ul>
      </div>

      {/* Comments Section */}
      <div className="border-t pt-6 mt-6">
        <Comments decisionId={decision.id} />
      </div>
    </main>
  );
} 