"use client";

import React from "react";
import { fetchCategories, fetchTechs, type Tech } from "@/lib/options";

export default function OptionsDemoPage() {
  const [categories, setCategories] = React.useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");
  const [search, setSearch] = React.useState<string>("");
  const [techs, setTechs] = React.useState<Tech[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const loadTechs = React.useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchTechs({
        category: selectedCategory || undefined,
        search: search || undefined,
      });
      setTechs(data);
    } catch (e) {
      setError("Failed to load techs");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, search]);

  React.useEffect(() => {
    loadTechs();
  }, [loadTechs]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Options Demo</h1>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <select
          className="bg-slate-900 border border-slate-700 rounded px-3 py-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2"
          placeholder="Search by name or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded px-4 py-2"
          onClick={loadTechs}
        >
          Refresh
        </button>
      </div>

      {loading && <div className="text-slate-400">Loading...</div>}
      {error && <div className="text-red-400">{error}</div>}

      <ul className="divide-y divide-slate-800 rounded border border-slate-800">
        {techs.map((t) => (
          <li key={t.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-sm text-slate-400">{t.short_desc}</div>
              </div>
              <div className="text-xs text-slate-400">
                {t.categories.join(", ")}
              </div>
            </div>
          </li>
        ))}
        {!loading && techs.length === 0 && (
          <li className="p-4 text-slate-400">No results</li>
        )}
      </ul>
    </div>
  );
}


