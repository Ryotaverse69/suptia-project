"use client";

import { useState } from "react";
import { ChevronDown, SlidersHorizontal, Search, Check, X } from "lucide-react";
import { TierRank } from "@/lib/tier-colors";
import { BadgeType } from "@/lib/badges";
import {
  systemColors,
  appleWebColors,
  tierColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

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

  // Apple HIG式ランクスタイル定義
  const getTierGradient = (tier: TierRank): string => {
    const gradients: Record<TierRank, string> = {
      "S+": tierColors["S+"].bg, // Already a gradient
      S: `linear-gradient(135deg, ${tierColors.S.border} 0%, ${systemColors.teal} 100%)`,
      A: `linear-gradient(135deg, ${tierColors.A.border} 0%, ${systemColors.indigo} 100%)`,
      B: `linear-gradient(135deg, ${tierColors.B.border} 0%, ${systemColors.blue} 100%)`,
      C: `linear-gradient(135deg, ${tierColors.C.border} 0%, ${systemColors.yellow} 100%)`,
      D: `linear-gradient(135deg, ${tierColors.D.border} 0%, ${systemColors.gray[2]} 100%)`,
    };
    return gradients[tier] || gradients.D;
  };

  // Get tier text color for unselected state
  const getTierTextColor = (tier: TierRank): string => {
    return tierColors[tier].border;
  };

  return (
    <div
      className={`w-full lg:w-72 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide ${liquidGlassClasses.light}`}
      style={{
        fontFamily: fontStack,
      }}
    >
      {/* Header */}
      <div
        className="p-5 border-b sticky top-0 z-20 backdrop-blur-[20px] backdrop-saturate-[180%] border-white/80"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <div className="flex items-center justify-between">
          <h2
            className="text-[15px] font-semibold flex items-center gap-2"
            style={{ color: appleWebColors.textPrimary }}
          >
            <SlidersHorizontal
              size={18}
              style={{ color: appleWebColors.textSecondary }}
            />
            絞り込み
          </h2>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-[13px] font-medium transition-all duration-300 flex items-center gap-1 px-2.5 py-1.5 rounded-full min-h-[32px]"
              style={{
                color: systemColors.pink,
                backgroundColor: `${systemColors.pink}10`,
              }}
            >
              <X size={12} />
              クリア
            </button>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="p-5 border-b border-white/80">
        <div className="relative group">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: appleWebColors.textTertiary }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="キーワードで検索"
            className="w-full pl-10 pr-4 py-3 rounded-xl text-[15px] transition-all border min-h-[44px]"
            style={{
              backgroundColor: appleWebColors.sectionBackground,
              borderColor: appleWebColors.borderSubtle,
              color: appleWebColors.textPrimary,
            }}
          />
        </div>
      </div>

      {/* Filter Sections */}
      <div>
        {filterSections.map((section) => {
          const isExpanded = expandedSections.has(section.title);

          return (
            <div key={section.title} className="p-5 border-b border-white/80">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between mb-4 group min-h-[36px]"
              >
                <h3
                  className="text-[14px] font-semibold transition-colors"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  {section.title}
                </h3>
                <div
                  className={`p-1.5 rounded-full transition-all duration-300 ${isExpanded ? "rotate-180" : ""}`}
                  style={{
                    backgroundColor: appleWebColors.sectionBackground,
                    color: appleWebColors.textSecondary,
                  }}
                >
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
                              handleFilterToggle(
                                section.filterKey,
                                option.value,
                              )
                            }
                            className="relative h-11 rounded-xl font-bold text-[15px] transition-all duration-300 flex items-center justify-center min-h-[44px]"
                            style={{
                              background: isSelected
                                ? getTierGradient(rank)
                                : appleWebColors.sectionBackground,
                              color: isSelected
                                ? "white"
                                : getTierTextColor(rank),
                              boxShadow: isSelected
                                ? "0 4px 12px rgba(0, 0, 0, 0.15)"
                                : "none",
                            }}
                          >
                            {option.value}
                            {isSelected && (
                              <div
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full shadow-sm flex items-center justify-center"
                                style={{
                                  backgroundColor: "white",
                                  border: `1px solid ${appleWebColors.borderSubtle}`,
                                }}
                              >
                                <Check
                                  size={12}
                                  className="stroke-[3]"
                                  style={{ color: systemColors.blue }}
                                />
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
                            ? (activeFilters.badges || []).includes(
                                option.value,
                              )
                            : activeFilters[section.filterKey] === option.value;

                        const isPerfect = option.value === "perfect";

                        return (
                          <button
                            key={option.value}
                            onClick={() =>
                              handleFilterToggle(
                                section.filterKey,
                                option.value,
                              )
                            }
                            className="px-3 py-2 rounded-xl text-[13px] font-semibold transition-all duration-300 flex items-center gap-1.5 min-h-[36px]"
                            style={{
                              background: isSelected
                                ? isPerfect
                                  ? `linear-gradient(135deg, ${systemColors.yellow} 0%, ${systemColors.orange} 100%)`
                                  : systemColors.blue
                                : appleWebColors.sectionBackground,
                              color: isSelected
                                ? "white"
                                : appleWebColors.textSecondary,
                              boxShadow: isSelected
                                ? "0 4px 12px rgba(0, 0, 0, 0.15)"
                                : "none",
                            }}
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
