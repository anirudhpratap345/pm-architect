import type { HistoryItem } from "@/components/DecisionHistoryCard"

/**
 * Export history items as JSON file
 */
export function exportAsJSON(items: HistoryItem[], filename = "pm-architect-history.json") {
  const dataStr = JSON.stringify(items, null, 2)
  downloadFile(dataStr, filename, "application/json")
}

/**
 * Export history items as CSV file
 */
export function exportAsCSV(items: HistoryItem[], filename = "pm-architect-history.csv") {
  if (items.length === 0) {
    alert("No data to export")
    return
  }

  // CSV headers
  const headers = ["ID", "Left Option", "Right Option", "Confidence", "Timestamp", "Date"]
  
  // CSV rows
  const rows = items.map((item) => {
    const date = item.timestamp ? new Date(item.timestamp * 1000).toLocaleString() : ""
    return [
      item.id,
      escapeCSV(item.left || ""),
      escapeCSV(item.right || ""),
      item.confidence || "medium",
      item.timestamp || "",
      date,
    ]
  })

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n")

  downloadFile(csvContent, filename, "text/csv")
}

/**
 * Export a single comparison as JSON
 */
export function exportSingleAsJSON(item: any, filename?: string) {
  const name = filename || `comparison-${item.left}-vs-${item.right}.json`.replace(/\s+/g, "-")
  const dataStr = JSON.stringify(item, null, 2)
  downloadFile(dataStr, name, "application/json")
}

/**
 * Helper: Escape CSV field (handle commas, quotes, newlines)
 */
function escapeCSV(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`
  }
  return field
}

/**
 * Helper: Trigger browser download
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

