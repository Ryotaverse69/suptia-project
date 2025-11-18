"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Search,
} from "lucide-react";
import { TierRank } from "@/lib/tier-colors";
import { BadgeType, BADGE_DEFINITIONS } from "@/lib/badges";

interface FilterSection {
  title: string;
  filterKey: "priceRange" | "evidenceLevel" | "ecSite" | "badges";
  options: { label: string; value: string; count?: number; icon?: string }[];
}

const filterSections: FilterSection[] = [
  {
    title: "称号バッジ",
    filterKey: "badges",
    options: [
      { label: "5冠達成", value: "perfect", icon: "🏆" },
      { label: "最適価格", value: "lowest-price", icon: "💰" },
      { label: "高含有リード", value: "highest-content", icon: "📊" },
      { label: "高効率モデル", value: "best-value", icon: "💡" },
      { label: "高エビデンス", value: "evidence-s", icon: "🔬" },
      { label: "高安全性", value: "high-safety", icon: "🛡️" },
    ],
  },
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
    title: "価格帯",
    filterKey: "priceRange",
    options: [
      { label: "〜¥2K", value: "0-2000" },
      { label: "¥2-5K", value: "2000-5000" },
      { label: "¥5-10K", value: "5000-10000" },
      { label: "¥10K〜", value: "10000+" },
    ],
  },
  {
    title: "購入先",
    filterKey: "ecSite",
    options: [
      { label: "楽天", value: "rakuten", icon: "🛍️" },
      { label: "Yahoo!", value: "yahoo", icon: "🟣" },
      { label: "Amazon", value: "amazon", icon: "📦" },
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

    // バッジフィルターの場合は複数選択対応
    if (filterKey === "badges") {
      const currentBadges = activeFilters.badges || [];
      let newBadges: string[];

      // 5冠達成が選択された場合
      if (value === "perfect") {
        // 既に選択されている場合は解除、そうでない場合は5冠達成のみ選択
        newBadges = currentBadges.includes("perfect") ? [] : ["perfect"];
      } else {
        // 5冠達成が選択されている場合は何もしない
        if (currentBadges.includes("perfect")) {
          return;
        }

        // 通常のバッジの場合はトグル
        if (currentBadges.includes(value)) {
          newBadges = currentBadges.filter((b) => b !== value);
        } else {
          newBadges = [...currentBadges, value];
        }
      }

      onFilterChange({ badges: newBadges });
    } else {
      // その他のフィルターは単一選択
      const currentValue = activeFilters[filterKey];
      const newValue = currentValue === value ? null : value;

      onFilterChange({
        [filterKey]: newValue,
      });
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

  // ランク別の色（ツヤツヤグラデーション付き）
  const rankColors: Record<TierRank, string> = {
    "S+": "bg-gradient-to-br from-purple-500/80 via-pink-500/70 to-yellow-500/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
    S: "bg-gradient-to-br from-purple-500/80 via-purple-500/70 to-purple-600/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
    A: "bg-gradient-to-br from-blue-500/80 via-blue-500/70 to-blue-600/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
    B: "bg-gradient-to-br from-green-500/80 via-green-500/70 to-green-600/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
    C: "bg-gradient-to-br from-yellow-500/80 via-yellow-500/70 to-yellow-600/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
    D: "bg-gradient-to-br from-gray-400/80 via-gray-400/70 to-gray-500/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
  };

  // ランク別のテキスト色
  const rankTextColors: Record<TierRank, string> = {
    "S+": "text-purple-800",
    S: "text-purple-800",
    A: "text-blue-800",
    B: "text-green-800",
    C: "text-yellow-800",
    D: "text-gray-800",
  };

  // ガラス光沢シャドウ
  const glassTextShadow = {
    textShadow:
      "0 2px 0 rgba(255,255,255,1), 0 3px 2px rgba(255,255,255,0.8), 0 4px 6px rgba(0,0,0,0.2), 0 6px 12px rgba(0,0,0,0.15), 0 0 30px rgba(255,255,255,0.8), 0 0 50px rgba(255,255,255,0.4)",
  } as React.CSSProperties;

  return (
    <div className="w-full lg:w-72 glass rounded-2xl border border-white/30 shadow-glass max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
      <div className="p-6 border-b border-white/20 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
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
      <div className="p-5 border-b border-white/20 sticky top-[88px] bg-white/95 backdrop-blur-sm z-10">
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
                <>
                  {section.title === "Tierランク" ? (
                    // ツヤツヤグラデーションボタン（Tierランク専用）
                    <div className="grid grid-cols-3 gap-2">
                      {section.options.map((option) => {
                        const isSelected =
                          activeFilters[section.filterKey] === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              handleFilterToggle(
                                section.filterKey,
                                option.value,
                              )
                            }
                            className={`relative overflow-hidden transition-all duration-200 ${
                              isSelected
                                ? "scale-105 ring-2 ring-primary ring-offset-2"
                                : "hover:scale-105"
                            }`}
                          >
                            <div className="relative w-full h-10">
                              <div
                                className={`absolute inset-0 flex items-center justify-center rounded font-black text-sm ${rankColors[option.value as TierRank]} ${rankTextColors[option.value as TierRank]}`}
                              >
                                <span style={glassTextShadow}>
                                  {option.value}
                                </span>
                              </div>
                              {/* キラキラハイライト（複数レイヤー） */}
                              <div className="absolute inset-0 rounded bg-gradient-to-br from-white/50 via-white/10 to-transparent pointer-events-none"></div>
                              <div className="absolute inset-0 rounded bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none"></div>
                              {/* 選択マーク */}
                              {isSelected && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs">
                                  ✓
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : section.title === "称号バッジ" ? (
                    // 称号バッジ専用（縦並びリスト、複数選択可能）
                    <div className="space-y-2">
                      {section.options.map((option) => {
                        const activeBadges = activeFilters.badges || [];
                        const isSelected = activeBadges.includes(option.value);
                        const isPerfect = option.value === "perfect";
                        const perfectSelected =
                          activeBadges.includes("perfect");
                        const isDisabled = !isPerfect && perfectSelected;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              handleFilterToggle(
                                section.filterKey,
                                option.value,
                              )
                            }
                            disabled={isDisabled}
                            className={`relative w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                              isDisabled
                                ? "opacity-40 cursor-not-allowed"
                                : isPerfect
                                  ? isSelected
                                    ? "bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white shadow-lg scale-105"
                                    : "bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 text-purple-700 hover:from-purple-200 hover:via-pink-200 hover:to-yellow-200"
                                  : isSelected
                                    ? "bg-primary text-white shadow-md scale-105"
                                    : "bg-white/80 text-primary-700 hover:bg-white hover:shadow-sm"
                            } border ${isSelected ? "border-primary" : "border-primary-200"}`}
                          >
                            <div className="flex items-center gap-2">
                              {option.icon && (
                                <span className="text-base">{option.icon}</span>
                              )}
                              <span className="flex-1 text-left">
                                {option.label}
                              </span>
                              {/* 選択マーク */}
                              {isSelected && (
                                <span
                                  className={`text-xs ${isPerfect ? "text-white" : "text-primary"}`}
                                >
                                  ✓
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    // 価格帯・購入先（シンプルなボタンデザイン）
                    <div className="grid grid-cols-2 gap-2">
                      {section.options.map((option) => {
                        const isSelected =
                          activeFilters[section.filterKey] === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              handleFilterToggle(
                                section.filterKey,
                                option.value,
                              )
                            }
                            className={`relative px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                              isSelected
                                ? "bg-primary text-white shadow-md scale-105"
                                : "bg-white/80 text-primary-700 hover:bg-white hover:shadow-sm"
                            } border ${isSelected ? "border-primary" : "border-primary-200"}`}
                          >
                            <div className="flex items-center justify-center gap-1.5">
                              {option.icon && (
                                <span className="text-sm">{option.icon}</span>
                              )}
                              <span>{option.label}</span>
                            </div>
                            {/* 選択マーク */}
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                <span className="text-primary text-xs">✓</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
