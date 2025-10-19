"use client"

interface HistoryFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  confidenceFilter: string
  onConfidenceChange: (confidence: string) => void
  sortOrder: string
  onSortChange: (order: string) => void
  totalCount: number
  filteredCount: number
}

export default function HistoryFilters({
  searchTerm,
  onSearchChange,
  confidenceFilter,
  onConfidenceChange,
  sortOrder,
  onSortChange,
  totalCount,
  filteredCount,
}: HistoryFiltersProps) {
  return (
    <div className="bg-white rounded-lg border p-4 mb-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="md:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search comparisons..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Confidence Filter */}
        <div>
          <label htmlFor="confidence" className="block text-sm font-medium text-gray-700 mb-1">
            Confidence
          </label>
          <select
            id="confidence"
            value={confidenceFilter}
            onChange={(e) => onConfidenceChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="high-conf">High Confidence</option>
            <option value="low-conf">Low Confidence</option>
          </select>
        </div>
      </div>

      {/* Results Counter */}
      {(searchTerm || confidenceFilter !== "all") && (
        <div className="mt-3 text-sm text-gray-600">
          Showing {filteredCount} of {totalCount} comparisons
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              className="ml-2 text-blue-600 hover:underline"
            >
              Clear search
            </button>
          )}
          {confidenceFilter !== "all" && (
            <button
              onClick={() => onConfidenceChange("all")}
              className="ml-2 text-blue-600 hover:underline"
            >
              Clear filter
            </button>
          )}
        </div>
      )}
    </div>
  )
}

