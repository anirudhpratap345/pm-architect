"use client";

import React from "react";
import { motion } from "framer-motion";

interface Category {
  id: string;
  label: string;
  description?: string;
}

interface CategoriesBarProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoriesBar({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoriesBarProps) {
  return (
    <div className="w-full">
      <label className="block text-sm text-slate-400 mb-2">Categories</label>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory(null)}
          className={`text-sm px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
            selectedCategory === null
              ? "bg-indigo-600 text-white"
              : "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700"
          }`}
        >
          All
        </motion.button>
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectCategory(cat.id)}
            className={`text-sm px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
              selectedCategory === cat.id
                ? "bg-indigo-600 text-white"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700"
            }`}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

