"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Search,
} from "lucide-react";

interface FilterSection {
  title: string;
  filterKey: "priceRange" | "evidenceLevel" | "safetyRank";
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
    title: "エビデンスランク",
    filterKey: "evidenceLevel",
    options: [
      { label: "S（最高品質）", value: "S" },
      { label: "A（高品質）", value: "A" },
      { label: "B（中品質）", value: "B" },
      { label: "C（低品質）", value: "C" },
    ],
  },
  {
    title: "安全性ランク",
    filterKey: "safetyRank",
    options: [
      { label: "S（90点以上）", value: "90+" },
      { label: "A（80点以上）", value: "80+" },
      { label: "B（70点以上）", value: "70+" },
      { label: "C（60点以上）", value: "60+" },
    ],
  },
];

interface FilterSidebarProps {
  onFilterChange?: (filters: {
    searchQuery?: string;
    priceRange?: string | null;
    evidenceLevel?: string | null;
    safetyRank?: string | null;
  }) => void;
  onClearFilters?: () => void;
  activeFilters?: {
    searchQuery?: string;
    priceRange?: string | null;
    evidenceLevel?: string | null;
    safetyRank?: string | null;
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
  const [searchQuery, setSearchQuery] = useState(
    activeFilters.searchQuery || "",
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
    filterKey: "priceRange" | "evidenceLevel" | "safetyRank",
    value: string,
  ) => {
    if (!onFilterChange) return;

    const currentValue = activeFilters[filterKey];
    const newValue = currentValue === value ? null : value;

    onFilterChange({
      [filterKey]: newValue,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onFilterChange) {
      onFilterChange({ searchQuery: query });
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    if (onClearFilters) {
      onClearFilters();
    }
  };

  const activeFilterCount =
    Object.entries(activeFilters).filter(
      ([key, value]) =>
        key !== "searchQuery" && value !== null && value !== undefined,
    ).length + (activeFilters.searchQuery ? 1 : 0);

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

      {/* 検索窓 */}
      <div className="p-5 border-b border-white/20">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="商品名で検索..."
            className="w-full pl-10 pr-4 py-2.5 glass-blue rounded-lg text-sm font-light placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
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
