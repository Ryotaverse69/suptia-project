"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Search,
  Check,
  X,
} from "lucide-react";
import { TierRank } from "@/lib/tier-colors";
import { BadgeType } from "@/lib/badges";

interface FilterSection {
  title: string;
  filterKey: "priceRange" | "evidenceLevel" | "ecSite" | "badges";
  options: { label: string; value: string; count?: number; icon?: string }[];
}

const filterSections: FilterSection[] = [
  {
    title: "Tierランク",
    filterKey: "evidenceLevel",
    options: [
      { label: "S+", value: "S+" },
      { label: "S", value: "S" },
      { label: "A", value: "A" },
      { label: "B", value: "B" },
      { label: "C", value: "C" },
      { label: "D", value: "D" },
    ],
  },
  {
    title: "特徴・バッジ",
    filterKey: "badges",
    options: [
      { label: "5冠達成", value: "perfect", icon: "🏆" },
      { label: "最適価格", value: "lowest-price", icon: "💰" },
      { label: "高含有", value: "highest-content", icon: "📊" },
      { label: "高コスパ", value: "best-value", icon: "💡" },
      { label: "高エビデンス", value: "evidence-s", icon: "🔬" },
      { label: "高安全性", value: "high-safety", icon: "🛡️" },
    ],
  },
  {
    title: "価格帯",
    filterKey: "priceRange",
    options: [
      { label: "〜¥2,000", value: "0-2000" },
      { label: "¥2,000〜5,000", value: "2000-5000" },
      { label: "¥5,000〜10,000", value: "5000-10000" },
      { label: "¥10,000〜", value: "10000+" },
    ],
  },
  {
    title: "購入サイト",
    filterKey: "ecSite",
    options: [
      { label: "Amazon", value: "amazon", icon: "📦" },
      { label: "楽天", value: "rakuten", icon: "🛍️" },
      { label: "Yahoo!", value: "yahoo", icon: "🟣" },
      { label: "iHerb", value: "iherb", icon: "🌿" },
    ],
  },
];

interface FilterSidebarProps {
  onFilterChange?: (filters: {
    searchQuery?: string;
    priceRange?: string | null;
    evidenceLevel?: string | null;
    ecSite?: string | null;
    badges?: string[];
  }) => void;
  onClearFilters?: () => void;
  activeFilters?: {
    searchQuery?: string;
    priceRange?: string | null;
    evidenceLevel?: string | null;
    ecSite?: string | null;
    badges?: string[];
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
    filterKey: "priceRange" | "evidenceLevel" | "ecSite" | "badges",
    value: string,
  ) => {
    if (!onFilterChange) return;

    if (filterKey === "badges") {
      const currentBadges = activeFilters.badges || [];
      let newBadges: string[];

      if (value === "perfect") {
        newBadges = currentBadges.includes("perfect") ? [] : ["perfect"];
      } else {
        if (currentBadges.includes("perfect")) {
          return;
        }
        if (currentBadges.includes(value)) {
          newBadges = currentBadges.filter((b) => b !== value);
        } else {
          newBadges = [...currentBadges, value];
        }
      }
      onFilterChange({ badges: newBadges });
    } else {
      const currentValue = activeFilters[filterKey];
      const newValue = currentValue === value ? null : value;
      onFilterChange({ [filterKey]: newValue });
    }
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
    Object.entries(activeFilters).filter(([key, value]) => {
      if (key === "searchQuery") return false;
      if (key === "badges") return Array.isArray(value) && value.length > 0;
      return value !== null && value !== undefined;
    }).length + (activeFilters.searchQuery ? 1 : 0);

  // ランク別のスタイル定義
  const rankStyles: Record<TierRank, string> = {
    "S+": "border-purple-500 text-purple-600 bg-purple-50",
    S: "border-indigo-500 text-indigo-600 bg-indigo-50",
    A: "border-blue-500 text-blue-600 bg-blue-50",
    B: "border-emerald-500 text-emerald-600 bg-emerald-50",
    C: "border-yellow-500 text-yellow-600 bg-yellow-50",
    D: "border-slate-400 text-slate-500 bg-slate-50",
  };

  const activeRankStyles: Record<TierRank, string> = {
    "S+": "bg-gradient-to-br from-purple-600 to-pink-600 text-white border-transparent shadow-md shadow-purple-200",
    S: "bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-transparent shadow-md shadow-indigo-200",
    A: "bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-transparent shadow-md shadow-blue-200",
    B: "bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-transparent shadow-md shadow-emerald-200",
    C: "bg-gradient-to-br from-yellow-400 to-orange-400 text-white border-transparent shadow-md shadow-yellow-200",
    D: "bg-slate-500 text-white border-transparent shadow-md shadow-slate-200",
  };

  return (
    <div className="w-full lg:w-72 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl shadow-slate-200/50 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-20">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-bold flex items-center gap-2 text-slate-800">
            <SlidersHorizontal size={18} className="text-slate-400" />
            絞り込み
          </h2>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs font-medium text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 px-2 py-1 rounded-full hover:bg-red-50"
            >
              <X size={12} />
              クリア
            </button>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="p-5 border-b border-slate-100 bg-white/40">
        <div className="relative group">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="キーワードで検索"
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Filter Sections */}
      <div className="divide-y divide-slate-100">
        {filterSections.map((section) => {
          const isExpanded = expandedSections.has(section.title);

          return (
            <div key={section.title} className="p-5">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between mb-4 group"
              >
                <h3 className="font-bold text-sm text-slate-700 group-hover:text-blue-600 transition-colors">
                  {section.title}
                </h3>
                <div className={`p-1 rounded-full bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all ${isExpanded ? 'rotate-180' : ''}`}>
                  <ChevronDown size={14} />
                </div>
              </button>

              {isExpanded && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                  {section.title === "Tierランク" ? (
                    <div className="grid grid-cols-3 gap-2">
                      {section.options.map((option) => {
                        const isSelected =
                          activeFilters[section.filterKey] === option.value;
                        const rank = option.value as TierRank;

                        return (
                          <button
                            key={option.value}
                            onClick={() =>
                              handleFilterToggle(section.filterKey, option.value)
                            }
                            className={`
                              relative h-12 rounded-xl font-black text-lg transition-all duration-300 flex items-center justify-center border-2
                              ${isSelected
                                ? activeRankStyles[rank] + " scale-105 z-10"
                                : rankStyles[rank] + " hover:scale-105 opacity-80 hover:opacity-100"
                              }
                            `}
                          >
                            {option.value}
                            {isSelected && (
                              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center border border-slate-100">
                                <Check size={12} className="text-blue-600 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {section.options.map((option) => {
                        const isSelected =
                          section.filterKey === "badges"
                            ? (activeFilters.badges || []).includes(option.value)
                            : activeFilters[section.filterKey] === option.value;

                        const isPerfect = option.value === "perfect";

                        return (
                          <button
                            key={option.value}
                            onClick={() =>
                              handleFilterToggle(section.filterKey, option.value)
                            }
                            className={`
                              px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 border
                              ${isSelected
                                ? isPerfect
                                  ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white border-transparent shadow-md shadow-orange-200"
                                  : "bg-slate-800 text-white border-slate-800 shadow-md shadow-slate-200"
                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                              }
                            `}
                          >
                            {option.icon && <span>{option.icon}</span>}
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
