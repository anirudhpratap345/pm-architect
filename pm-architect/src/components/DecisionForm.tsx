"use client";
import { useState, FormEvent } from "react";

const CONSTRAINTS = [
  "Latency < 200ms",
  "Max $10/day",
  "Open-source only",
  "Privacy-safe",
  "GDPR compliant",
  "Real-time processing",
  "Offline capability",
  "Multi-language support"
];

const METRICS = [
  "Accuracy",
  "Latency",
  "Cost",
  "Scalability",
  "Maintainability",
  "Security",
  "Performance",
  "User Experience"
]; 

type DecisionFormData = {
  title: string;
  description: string;
  options: string;
  constraints: string[];
  metrics: string[];
  stakeholders: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
};

type NormalizedDecisionFormData = {
  title: string;
  description: string;
  options: string[];
  constraints: string[];
  metrics: string[];
  stakeholders: string[];
  deadline: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
};

interface DecisionFormProps {
  onSubmit?: (data: NormalizedDecisionFormData) => void;
}

export default function DecisionForm({ onSubmit }: DecisionFormProps) {
  const [form, setForm] = useState<DecisionFormData>({
    title: "",
    description: "",
    options: "",
    constraints: [],
    metrics: [],
    stakeholders: "",
    deadline: "",
    priority: 'medium',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof DecisionFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value })); 
    
    // Clear error when user starts typing
    if (errors[name as keyof DecisionFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>, group: "constraints" | "metrics") {
    const { value, checked } = e.target;
    setForm((prev) => {
      const arr = prev[group];
      return {
        ...prev,
        [group]: checked ? [...arr, value] : arr.filter((v) => v !== value),
      };
    });
  }

  function validateForm(): boolean {
    const newErrors: Partial<Record<keyof DecisionFormData, string>> = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    } else if (form.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    } else if (form.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (!form.options.trim()) {
      newErrors.options = "At least one option is required";
    }

    if (form.constraints.length === 0) {
      newErrors.constraints = "At least one constraint is required";
    }

    if (form.metrics.length === 0) {
      newErrors.metrics = "At least one metric is required";
    }

    if (!form.stakeholders.trim()) {
      newErrors.stakeholders = "At least one stakeholder is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const normalized: NormalizedDecisionFormData = {
        title: form.title,
        description: form.description,
        options: form.options.split(",").map((s) => s.trim()).filter(Boolean),
        constraints: form.constraints,
        metrics: form.metrics,
        stakeholders: form.stakeholders.split(",").map((s) => s.trim()).filter(Boolean),
        deadline: form.deadline,
        priority: form.priority,
      };
      
      if (onSubmit) {
        await onSubmit(normalized);
      } else {
        console.log(normalized);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-4">
        <label htmlFor="title" className="block font-medium mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
            errors.title 
              ? 'border-red-500 bg-red-50 text-red-900' 
              : 'border-gray-700 bg-[#18181b] text-white'
          }`}
          placeholder="Choosing GPT-4 vs Claude for summarization"
          value={form.title}
          onChange={handleChange}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block font-medium mb-1">
          Description / Context <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
            errors.description 
              ? 'border-red-500 bg-red-50 text-red-900' 
              : 'border-gray-700 bg-[#18181b] text-white'
          }`}
          placeholder="This decision is for our new summarization engine…"
          rows={4}
          value={form.description}
          onChange={handleChange}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="options" className="block font-medium mb-1">
          Options to Compare <span className="text-red-500">*</span>
        </label>
        <input
          id="options"
          name="options"
          type="text"
          className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
            errors.options 
              ? 'border-red-500 bg-red-50 text-red-900' 
              : 'border-gray-700 bg-[#18181b] text-white'
          }`}
          placeholder="GPT-4, Claude 3, Mistral"
          value={form.options}
          onChange={handleChange}
        />
        <span className="text-xs text-gray-400">Comma-separated</span>
        {errors.options && (
          <p className="text-red-500 text-sm mt-1">{errors.options}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">
          Constraints <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-4">
          {CONSTRAINTS.map((c) => (
            <label key={c} className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                value={c}
                checked={form.constraints.includes(c)}
                onChange={(e) => handleCheckboxChange(e, "constraints")}
                className="accent-sky-500"
              />
              {c}
            </label>
          ))}
        </div>
        {errors.constraints && (
          <p className="text-red-500 text-sm mt-1">{errors.constraints}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">
          Important Metrics <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-4">
          {METRICS.map((m) => (
            <label key={m} className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                value={m}
                checked={form.metrics.includes(m)}
                onChange={(e) => handleCheckboxChange(e, "metrics")}
                className="accent-sky-500"
              />
              {m}
            </label>
          ))}
        </div>
        {errors.metrics && (
          <p className="text-red-500 text-sm mt-1">{errors.metrics}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="stakeholders" className="block font-medium mb-1">
          Stakeholders <span className="text-red-500">*</span>
        </label>
        <input
          id="stakeholders"
          name="stakeholders"
          type="text"
          className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
            errors.stakeholders 
              ? 'border-red-500 bg-red-50 text-red-900' 
              : 'border-gray-700 bg-[#18181b] text-white'
          }`}
          placeholder="alex@meta.com, john@meta.com"
          value={form.stakeholders}
          onChange={handleChange}
        />
        <span className="text-xs text-gray-400">Comma-separated emails or names</span>
        {errors.stakeholders && (
          <p className="text-red-500 text-sm mt-1">{errors.stakeholders}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="priority" className="block font-medium mb-1">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full rounded border border-gray-700 bg-[#18181b] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div>
          <label htmlFor="deadline" className="block font-medium mb-1">
            Deadline
          </label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            className="w-full rounded border border-gray-700 bg-[#18181b] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={form.deadline}
            onChange={handleChange}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-sky-500 hover:bg-sky-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded font-semibold transition w-full"
      >
        {isSubmitting ? 'Creating Decision...' : 'Create Decision'}
      </button>
    </form>
  );
} 