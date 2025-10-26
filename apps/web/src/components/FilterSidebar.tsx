"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";

interface FilterSection {
  title: string;
  filterKey: "priceRange" | "rating" | "safetyScore";
  options: { label: string; value: string; count?: number }[];
}

const filterSections: FilterSection[] = [
  {
    title: "価格帯",
    filterKey: "priceRange",
    options: [
      { label: "¥0 - ¥2,000", value: "0-2000" },
      { label: "¥2,000 - ¥5,000", value: "2000-5000" },
      { label: "¥5,000 - ¥10,000", value: "5000-10000" },
      { label: "¥10,000以上", value: "10000+" },
    ],
  },
  {
    title: "評価",
    filterKey: "rating",
    options: [
      { label: "⭐ 4.5以上", value: "4.5+" },
      { label: "⭐ 4.0以上", value: "4.0+" },
      { label: "⭐ 3.5以上", value: "3.5+" },
    ],
  },
  {
    title: "安全性スコア",
    filterKey: "safetyScore",
    options: [
      { label: "90点以上", value: "90+" },
      { label: "80点以上", value: "80+" },
      { label: "70点以上", value: "70+" },
    ],
  },
];

interface FilterSidebarProps {
  onFilterChange?: (filters: {
    priceRange?: string | null;
    rating?: string | null;
    safetyScore?: string | null;
  }) => void;
  onClearFilters?: () => void;
  activeFilters?: {
    priceRange?: string | null;
    rating?: string | null;
    safetyScore?: string | null;
  };
}

export function FilterSidebar({
  onFilterChange,
  onClearFilters,
  activeFilters = {},
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(filterSections.map((s) => s.title)),
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

  const handleFilterToggle = (
    filterKey: "priceRange" | "rating" | "safetyScore",
    value: string,
  ) => {
    if (!onFilterChange) return;

    const currentValue = activeFilters[filterKey];
    const newValue = currentValue === value ? null : value;

    onFilterChange({
      [filterKey]: newValue,
    });
  };

  const clearFilters = () => {
    if (onClearFilters) {
      onClearFilters();
    }
  };

  const activeFilterCount = Object.values(activeFilters).filter(
    (v) => v !== null && v !== undefined,
  ).length;

  return (
    <div className="w-full lg:w-72 glass rounded-2xl border border-white/30 shadow-glass">
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-light flex items-center gap-2 text-primary-900 tracking-wide">
            <SlidersHorizontal size={22} />
            フィルター
          </h2>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:text-primary-700 font-light transition-colors"
            >
              クリア
            </button>
          )}
        </div>
        {activeFilterCount > 0 && (
          <div className="mt-3 text-sm text-primary-700 font-light">
            {activeFilterCount}件のフィルター適用中
          </div>
        )}
      </div>

      <div className="divide-y divide-white/20">
        {filterSections.map((section) => {
          const isExpanded = expandedSections.has(section.title);

          return (
            <div key={section.title} className="p-5">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between mb-4 hover:text-primary transition-colors font-light"
              >
                <h3 className="font-light text-sm tracking-wide">
                  {section.title}
                </h3>
                {isExpanded ? (
                  <ChevronUp size={18} className="opacity-60" />
                ) : (
                  <ChevronDown size={18} className="opacity-60" />
                )}
              </button>

              {isExpanded && (
                <div className="space-y-3">
                  {section.options.map((option) => {
                    const isChecked =
                      activeFilters[section.filterKey] === option.value;

                    return (
                      <label
                        key={option.value}
                        className="flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() =>
                              handleFilterToggle(
                                section.filterKey,
                                option.value,
                              )
                            }
                            className="rounded border-primary-300 text-primary focus:ring-primary/50 focus:ring-offset-0"
                          />
                          <span className="text-sm text-primary-800 group-hover:text-primary-900 font-light transition-colors">
                            {option.label}
                          </span>
                        </div>
                        {option.count !== undefined && (
                          <span className="text-xs text-primary-500 font-light px-2 py-0.5 glass-blue rounded-full">
                            {option.count}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
