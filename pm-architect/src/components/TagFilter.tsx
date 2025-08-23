"use client";

interface TagFilterProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags: string[];
}

const TAGS = [
  "CNN",
  "Transformer",
  "LLM",
  "GNN",
  "Latency-sensitive",
  "Cost-sensitive",
  "Explainability",
  "Analytics",
  "Microservices",
  "Monolith",
  "AI Assistant",
  "DeepFM",
  "ClickHouse",
  "PostgreSQL"
];

export default function TagFilter({ selectedTags, onTagsChange, availableTags }: TagFilterProps) {
  function toggleTag(tag: string) {
    onTagsChange(
      selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag]
    );
  }

  // Use available tags if provided, otherwise fall back to default tags
  const displayTags = availableTags.length > 0 ? availableTags : TAGS;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {displayTags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => toggleTag(tag)}
          className={`px-4 py-1 rounded-full border text-sm font-medium transition
            ${selectedTags.includes(tag)
              ? "bg-sky-500 text-white border-sky-500 shadow"
              : "bg-[#18181b] text-gray-300 border-gray-700 hover:bg-gray-800"}
          `}
        >
          {tag}
        </button>
      ))}
    </div>
  );
} 