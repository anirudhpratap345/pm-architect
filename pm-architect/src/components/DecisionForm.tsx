"use client";
import { useState, FormEvent } from "react";

const CONSTRAINTS = [
  "Latency < 200ms",
  "Max $10/day",
  "Open-source only",
  "Privacy-safe",
];
const METRICS = [
  "Accuracy",
  "Latency",
  "Interpretability",
  "Cost",
]; 

type DecisionFormData = {
  title: string;
  description: string;
  options: string;
  constraints: string[];
  metrics: string[];
  stakeholders: string;
  deadline: string;
};

export default function DecisionForm() {
  const [form, setForm] = useState<DecisionFormData>({
    title: "",
    description: "",
    options: "",
    constraints: [],
    metrics: [],
    stakeholders: "",
    deadline: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.log({
      ...form,
      options: form.options.split(",").map((s) => s.trim()).filter(Boolean),
      stakeholders: form.stakeholders.split(",").map((s) => s.trim()).filter(Boolean),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-4">
        <label htmlFor="title" className="block font-medium mb-1">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className="w-full rounded border border-gray-700 bg-[#18181b] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Choosing GPT-4 vs Claude for summarization"
          value={form.title}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block font-medium mb-1">Description / Context</label>
        <textarea
          id="description"
          name="description"
          className="w-full rounded border border-gray-700 bg-[#18181b] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="This decision is for our new summarization engine…"
          rows={4}
          value={form.description}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="options" className="block font-medium mb-1">Options to Compare</label>
        <input
          id="options"
          name="options"
          type="text"
          className="w-full rounded border border-gray-700 bg-[#18181b] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="GPT-4, Claude 3, Mistral"
          value={form.options}
          onChange={handleChange}
        />
        <span className="text-xs text-gray-400">Comma-separated</span>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Constraints</label>
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
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Important Metrics</label>
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
      </div>
      <div className="mb-4">
        <label htmlFor="stakeholders" className="block font-medium mb-1">Stakeholders</label>
        <input
          id="stakeholders"
          name="stakeholders"
          type="text"
          className="w-full rounded border border-gray-700 bg-[#18181b] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="alex@meta.com, john@meta.com"
          value={form.stakeholders}
          onChange={handleChange}
        />
        <span className="text-xs text-gray-400">Comma-separated emails or names</span>
      </div>
      <div className="mb-4">
        <label htmlFor="deadline" className="block font-medium mb-1">Deadline</label>
        <input
          id="deadline"
          name="deadline"
          type="date"
          className="w-full rounded border border-gray-700 bg-[#18181b] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          value={form.deadline}
          onChange={handleChange}
        />
      </div>
      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition font-semibold mt-2"
      >
        Submit
      </button>
    </form>
  );
} 