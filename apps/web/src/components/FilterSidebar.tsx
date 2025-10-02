"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";

interface FilterSection {
  title: string;
  options: { label: string; value: string; count?: number }[];
}

const filterSections: FilterSection[] = [
  {
    title: "価格帯",
    options: [
      { label: "¥0 - ¥2,000", value: "0-2000", count: 45 },
      { label: "¥2,000 - ¥5,000", value: "2000-5000", count: 78 },
      { label: "¥5,000 - ¥10,000", value: "5000-10000", count: 32 },
      { label: "¥10,000以上", value: "10000+", count: 15 },
    ],
  },
  {
    title: "評価",
    options: [
      { label: "⭐ 4.5以上", value: "4.5+", count: 56 },
      { label: "⭐ 4.0以上", value: "4.0+", count: 89 },
      { label: "⭐ 3.5以上", value: "3.5+", count: 124 },
    ],
  },
  {
    title: "カテゴリー",
    options: [
      { label: "ビタミン・ミネラル", value: "vitamins", count: 67 },
      { label: "プロテイン", value: "protein", count: 43 },
      { label: "オメガ3・脂肪酸", value: "omega3", count: 28 },
      { label: "プロバイオティクス", value: "probiotics", count: 34 },
      { label: "アミノ酸", value: "amino", count: 21 },
    ],
  },
  {
    title: "安全性スコア",
    options: [
      { label: "90点以上", value: "90+", count: 92 },
      { label: "80点以上", value: "80+", count: 145 },
      { label: "70点以上", value: "70+", count: 170 },
    ],
  },
];

export function FilterSidebar() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(filterSections.map((s) => s.title)),
  );
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(
    new Set(),
  );

  const toggleSection = (title: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedSections(newExpanded);
  };

  const toggleFilter = (value: string) => {
    const newFilters = new Set(selectedFilters);
    if (newFilters.has(value)) {
      newFilters.delete(value);
    } else {
      newFilters.add(value);
    }
    setSelectedFilters(newFilters);
  };

  const clearFilters = () => {
    setSelectedFilters(new Set());
  };

  return (
    <div className="w-full lg:w-72 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <SlidersHorizontal size={20} />
            フィルター
          </h2>
          {selectedFilters.size > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              クリア
            </button>
          )}
        </div>
        {selectedFilters.size > 0 && (
          <div className="mt-2 text-sm text-gray-600">
            {selectedFilters.size}件のフィルター適用中
          </div>
        )}
      </div>

      <div className="divide-y divide-gray-200">
        {filterSections.map((section) => {
          const isExpanded = expandedSections.has(section.title);

          return (
            <div key={section.title} className="p-4">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between mb-3 hover:text-blue-600 transition-colors"
              >
                <h3 className="font-semibold text-sm">{section.title}</h3>
                {isExpanded ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

              {isExpanded && (
                <div className="space-y-2">
                  {section.options.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedFilters.has(option.value)}
                          onChange={() => toggleFilter(option.value)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">
                          {option.label}
                        </span>
                      </div>
                      {option.count !== undefined && (
                        <span className="text-xs text-gray-500">
                          {option.count}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
