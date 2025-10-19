"use client"

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const canPrev = page > 1
  const canNext = page < pageCount

  if (total <= pageSize) return null

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-600">
        Page {page} of {pageCount} · {total} items
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => canPrev && onPageChange(page - 1)}
          disabled={!canPrev}
          className="px-3 py-1.5 rounded border bg-white disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => canNext && onPageChange(page + 1)}
          disabled={!canNext}
          className="px-3 py-1.5 rounded border bg-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}


