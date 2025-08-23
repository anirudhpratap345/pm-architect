"use client";

import { useRouter } from "next/navigation";
import { use, useState, useEffect } from "react";
import { Decision } from "@/types/decision";
import { decisionsApi, handleApiError } from "@/lib/api";

interface EditDecisionPageProps {
  params: Promise<{ id: string }>;
}

export default function EditDecisionPage({ params }: EditDecisionPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    context: "",
    options: "",
    constraints: [] as string[],
    metrics: [] as string[],
    stakeholders: "",
    priority: "medium" as "low" | "medium" | "high" | "critical",
    deadline: "",
    tags: [] as string[],
  });

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
        setFormData({
          title: response.data.title || "",
          context: response.data.context || "",
          options: Array.isArray(response.data.options) ? response.data.options.join(", ") : "",
          constraints: response.data.constraints || [],
          metrics: response.data.metrics || [],
          stakeholders: Array.isArray(response.data.stakeholders) ? response.data.stakeholders.join(", ") : "",
          priority: response.data.priority || "medium",
          deadline: response.data.deadline ? new Date(response.data.deadline).toISOString().split('T')[0] : "",
          tags: response.data.tags || [],
        });
      }
    } catch (err) {
      setError('Failed to load decision');
      console.error('Error fetching decision:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!decision) return;

    try {
      setSaving(true);
      setError(null);

      const updateData = {
        title: formData.title,
        context: formData.context,
        options: formData.options.split(",").map(s => s.trim()).filter(Boolean),
        constraints: formData.constraints,
        metrics: formData.metrics,
        stakeholders: formData.stakeholders.split(",").map(s => s.trim()).filter(Boolean),
        priority: formData.priority,
        deadline: formData.deadline ? new Date(formData.deadline) : null,
        tags: formData.tags,
      };

      const response = await decisionsApi.update(id, updateData);
      
      if (response.error) {
        setError(handleApiError(response.error, 'Failed to update decision'));
        return;
      }

      // Redirect to the updated decision
      router.push(`/decision/${id}`);
    } catch (err) {
      setError('Failed to update decision');
      console.error('Error updating decision:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (value: string, field: "constraints" | "metrics" | "tags") => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
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
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">Decision not found</div>
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

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Decision</h1>
        <p className="text-gray-400">Update your decision details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block font-medium mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleInputChange}
            className="w-full rounded border border-gray-700 bg-[#18181b] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label htmlFor="context" className="block font-medium mb-2">
            Context / Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="context"
            name="context"
            required
            rows={4}
            value={formData.context}
            onChange={handleInputChange}
            className="w-full rounded border border-gray-700 bg-[#18181b] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label htmlFor="options" className="block font-medium mb-2">
            Options to Compare <span className="text-red-500">*</span>
          </label>
          <input
            id="options"
            name="options"
            type="text"
            required
            value={formData.options}
            onChange={handleInputChange}
            className="w-full rounded border border-gray-700 bg-[#18181b] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="GPT-4, Claude 3, Mistral"
          />
          <p className="text-xs text-gray-400 mt-1">Comma-separated options</p>
        </div>

        <div>
          <label className="block font-medium mb-2">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full rounded border border-gray-700 bg-[#18181b] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div>
          <label htmlFor="deadline" className="block font-medium mb-2">
            Deadline
          </label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleInputChange}
            className="w-full rounded border border-gray-700 bg-[#18181b] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label htmlFor="stakeholders" className="block font-medium mb-2">
            Stakeholders <span className="text-red-500">*</span>
          </label>
          <input
            id="stakeholders"
            name="stakeholders"
            type="text"
            required
            value={formData.stakeholders}
            onChange={handleInputChange}
            className="w-full rounded border border-gray-700 bg-[#18181b] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="alex@company.com, sarah@company.com"
          />
          <p className="text-xs text-gray-400 mt-1">Comma-separated emails or names</p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-sky-500 hover:bg-sky-600 disabled:bg-gray-600 text-white px-6 py-2 rounded font-semibold transition"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/decision/${id}`)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded font-semibold transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
