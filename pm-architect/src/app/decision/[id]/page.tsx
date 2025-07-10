"use client";
import { mockDecisions } from "@/data/mock-decisions";
import { Decision } from "@/types/decision";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { use, useState } from "react";

interface DecisionDetailPageProps {
  params: Promise<{ id: string }>;
}

const staticComments = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    date: "2024-02-01",
    text: "Great breakdown of the tradeoffs! I think the risk is worth it for the performance gains."
  },
  {
    id: 2,
    name: "Priya Patel",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    date: "2024-02-02",
    text: "Can we get more details on the cost estimates for the Transformer option?"
  }
];

export default function DecisionDetailPage({ params }: DecisionDetailPageProps) {
  const { id } = use(params);
  const decision = mockDecisions.find((d) => d.id === id);
  if (!decision) return notFound();

  // Comment form state
  const [comment, setComment] = useState("");
  function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (comment.trim()) {
      // In real app, submit to backend
      console.log({ comment });
      setComment("");
    }
  }

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      {/* Edit Button */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold">{decision.title}</h1>
        <Link
          href={`/decision/${decision.id}/edit`}
          className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded font-semibold text-sm transition"
        >
          Edit
        </Link>
      </div>
      <p className="text-sm text-gray-500 mb-2">{formatDate(decision.createdAt)}</p>
      {/* Status Badge */}
      <span className="inline-block px-3 py-1 rounded bg-blue-100 text-blue-700 text-sm font-medium mb-4">
        {decision.status}
      </span>

      {/* Context/Description */}
      <div className="border-t pt-6 mt-6">
        <h2 className="text-lg font-semibold mb-2">Context / Description</h2>
        <p className="text-gray-200">{decision.context}</p>
      </div>

      {/* Options Compared */}
      <div className="border-t pt-6 mt-6">
        <h2 className="text-lg font-semibold mb-2">Options Compared</h2>
        <div className="flex flex-col gap-6">
          {decision.options?.map((opt) => (
            <div key={opt.id} className="bg-[#18181b] rounded-xl p-4 shadow flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="font-semibold text-white text-base mb-1">{opt.name}</div>
                <div className="text-gray-300 mb-2 text-sm">{opt.description}</div>
                <div className="flex flex-wrap gap-4 mb-2">
                  {/* Pros */}
                  <div>
                    <div className="font-medium text-green-400 flex items-center gap-1 mb-1">
                      <span>✔</span> Pros
                    </div>
                    <ul className="list-disc list-inside text-gray-200 text-sm">
                      {opt.pros.map((p, i) => (
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
                      {opt.cons.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
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
                <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                  opt.riskLevel === "high"
                    ? "bg-red-900 text-red-200"
                    : opt.riskLevel === "medium"
                    ? "bg-yellow-900 text-yellow-200"
                    : "bg-green-900 text-green-200"
                }`}>
                  Risk: {opt.riskLevel.charAt(0).toUpperCase() + opt.riskLevel.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Constraints */}
      <div className="border-t pt-6 mt-6">
        <h2 className="text-lg font-semibold mb-2">Constraints</h2>
        <ul className="list-disc list-inside text-gray-300">
          {decision.constraints?.map((c: string) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>

      {/* Tradeoffs */}
      <div className="border-t pt-6 mt-6">
        <h2 className="text-lg font-semibold mb-2">Tradeoffs</h2>
        <div className="flex flex-col gap-4">
          {decision.tradeoffs?.map((t) => (
            <div key={t.id} className="bg-[#18181b] rounded-xl p-4 shadow flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="font-semibold text-white text-base mb-1">{t.title}</div>
                <div className="text-gray-300 text-sm mb-1">{t.description}</div>
              </div>
              <div className="flex flex-col gap-2 min-w-[120px]">
                <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                  t.impact === "positive"
                    ? "bg-green-900 text-green-200"
                    : t.impact === "negative"
                    ? "bg-red-900 text-red-200"
                    : "bg-gray-800 text-gray-200"
                }`}>
                  Impact: {t.impact.charAt(0).toUpperCase() + t.impact.slice(1)}
                </span>
                <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                  t.magnitude === "high"
                    ? "bg-sky-900 text-sky-200"
                    : t.magnitude === "medium"
                    ? "bg-yellow-900 text-yellow-200"
                    : "bg-gray-800 text-gray-200"
                }`}>
                  Magnitude: {t.magnitude.charAt(0).toUpperCase() + t.magnitude.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="border-t pt-6 mt-6">
        <h2 className="text-lg font-semibold mb-2">Timeline</h2>
        <ul className="text-gray-300">
          <li>Created: {formatDate(decision.createdAt)}</li>
          {decision.deadline && <li>Deadline: {formatDate(decision.deadline)}</li>}
        </ul>
      </div>

      {/* Comments Section */}
      <div className="border-t pt-6 mt-6">
        <h2 className="text-lg font-semibold mb-2">Comments</h2>
        <div className="flex flex-col gap-4 mb-4">
          {staticComments.map((c) => (
            <div key={c.id} className="flex items-start gap-3">
              <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full border-2 border-sky-500" />
              <div>
                <div className="font-semibold text-white text-sm">{c.name}</div>
                <div className="text-xs text-gray-400 mb-1">{formatDate(c.date)}</div>
                <div className="text-gray-200 text-sm">{c.text}</div>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2">
          <textarea
            className="w-full rounded border border-gray-700 bg-[#18181b] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            rows={3}
            placeholder="Add a comment..."
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <button
            type="submit"
            className="self-end bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded font-semibold text-sm transition"
          >
            Post Comment
          </button>
        </form>
      </div>
    </main>
  );
} 