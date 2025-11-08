"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { fetchTechs, type Tech } from "@/lib/catalog";

interface OptionSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  category: string | null;
  placeholder?: string;
}

export default function OptionSelector({
  label,
  value,
  onChange,
  category,
  placeholder = "Type or select a tech...",
}: OptionSelectorProps) {
  const [suggestions, setSuggestions] = useState<Tech[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const justSelectedRef = useRef(false);

  // Debounced search (250ms)
  useEffect(() => {
    // Don't fetch if we just selected from dropdown
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }

    const timer = setTimeout(async () => {
      // Fetch suggestions when user types
      if (value && value.length > 0 && showSuggestions) {
        setLoading(true);
        try {
          const techs = await fetchTechs({
            category: category || undefined,
            search: value || undefined,
            limit: 10,
          });
          setSuggestions(techs);
        } catch (err) {
          console.error("Failed to fetch techs:", err);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else if (!value && showSuggestions) {
        // Show all techs in category when field is empty but focused
        setLoading(true);
        try {
          const techs = await fetchTechs({
            category: category || undefined,
            limit: 10,
          });
          setSuggestions(techs);
        } catch {
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [value, category, showSuggestions]);

  const handleSelect = useCallback((tech: Tech) => {
    justSelectedRef.current = true;
    onChange(tech.name);
    setSuggestions([]);
    setShowSuggestions(false);
  }, [onChange]);

  return (
    <div className="relative w-full">
      <label className="block text-sm text-slate-400 mb-2">{label}</label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            justSelectedRef.current = false;
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            setShowSuggestions(true);
          }}
          onBlur={() => {
            // Delay to allow click on suggestions
            setTimeout(() => setShowSuggestions(false), 150);
          }}
          placeholder={placeholder}
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          className="w-full pl-10 pr-10 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100 placeholder:text-slate-500 shadow-sm"
        />
        {value && (
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              onChange("");
              setSuggestions([]);
              setShowSuggestions(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            role="listbox"
            className="absolute z-10 w-full mt-2 bg-slate-900 border border-slate-800 rounded-lg shadow-lg max-h-64 overflow-y-auto"
          >
            {loading && (
              <div className="p-3 text-sm text-slate-400">Loading...</div>
            )}
            {!loading && suggestions.length === 0 && (
              <div className="p-3 text-sm text-slate-400">No results</div>
            )}
            {!loading && suggestions.length > 0 && (
              suggestions.map((tech) => (
                <button
                  key={tech.id}
                  role="option"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(tech);
                  }}
                  className="w-full text-left p-3 hover:bg-slate-800 border-b border-slate-800 last:border-b-0 transition-colors"
                >
                  <div className="font-medium text-slate-100">{tech.name}</div>
                  {tech.short_desc && (
                    <div className="text-xs text-slate-400 mt-1">{tech.short_desc}</div>
                  )}
                  <div className="text-xs text-slate-500 mt-1">
                    {tech.categories.join(", ")}
                  </div>
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
