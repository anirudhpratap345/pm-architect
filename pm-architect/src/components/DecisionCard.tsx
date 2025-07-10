import React from "react";
import { Decision } from "@/types/decision";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
// If you don't have react-icons installed, replace the icon with a span: <span className="text-sky-500 text-xl">→</span>
// import { HiOutlineArrowNarrowRight } from "react-icons/hi";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "model-selection": <span className="text-pink-400 text-2xl">🧠</span>,
  "infrastructure": <span className="text-purple-400 text-2xl">⚙️</span>,
  "architecture": <span className="text-blue-400 text-2xl">🏗️</span>,
  "feature-priority": <span className="text-green-400 text-2xl">⭐</span>,
  "technology-stack": <span className="text-yellow-400 text-2xl">🧩</span>,
};

const STATUS_COLORS: Record<string, string> = {
  "pending": "bg-yellow-100 text-yellow-700",
  "in-progress": "bg-blue-100 text-blue-700",
  "completed": "bg-green-100 text-green-700",
  "archived": "bg-gray-200 text-gray-700",
  "open": "bg-blue-100 text-blue-700",
  "resolved": "bg-green-100 text-green-700",
};

const PRIORITY_COLORS: Record<string, string> = {
  "low": "bg-gray-100 text-gray-600",
  "medium": "bg-yellow-100 text-yellow-700",
  "high": "bg-orange-100 text-orange-700",
  "critical": "bg-red-100 text-red-700",
};

export default function DecisionCard({ decision }: { decision: Decision }) {
  return (
    <Link
      href={`/decision/${decision.id}`}
      className="block bg-[#18181b] rounded-2xl shadow-lg border border-gray-800 p-6 transition hover:scale-[1.02] hover:shadow-2xl cursor-pointer mb-8 group"
      tabIndex={0}
      aria-label={`View details for ${decision.title}`}
    >
      {/* Title Row */}
      <div className="flex items-center gap-3 mb-2">
        {CATEGORY_ICONS[decision.category] || <span className="text-gray-400 text-2xl">📄</span>}
        <h2 className="font-bold text-lg sm:text-xl text-white flex-1 truncate">{decision.title}</h2>
        <span className={`ml-2 px-3 py-1 rounded text-xs font-medium ${STATUS_COLORS[decision.status] || "bg-gray-200 text-gray-700"}`}>{decision.status.replace(/-/g, ' ')}</span>
        <span className={`ml-2 px-3 py-1 rounded text-xs font-medium ${PRIORITY_COLORS[decision.priority] || "bg-gray-100 text-gray-600"}`}>{decision.priority}</span>
      </div>
      {/* Meta Row */}
      <div className="flex flex-wrap items-center gap-4 text-gray-400 text-xs mb-2">
        <span className="capitalize">{decision.category.replace(/-/g, ' ')}</span>
        <span>Updated {formatDate(typeof decision.updatedAt === 'string' ? decision.updatedAt : decision.updatedAt.toISOString())}</span>
        <span>{decision.options?.length || 0} options</span>
        <span>{decision.tradeoffs?.length || 0} tradeoffs</span>
      </div>
      {/* Description */}
      <div className="text-gray-200 text-sm mb-2 line-clamp-3">{decision.context}</div>
      {/* Constraints */}
      <div className="text-xs text-gray-400 mb-2">
        <span className="font-medium text-gray-500">Constraints:</span> {decision.constraints?.length || 0} constraint{decision.constraints?.length === 1 ? '' : 's'}
      </div>
      {/* Tags */}
      {decision.tags && decision.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {decision.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full bg-sky-900 text-sky-200 text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>
      )}
      {/* Right Arrow Icon */}
      <div className="flex justify-end mt-2">
        <span className="text-sky-500 text-xl group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </Link>
  );
} 