"use client";

import { useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { TierRank } from "@/lib/tier-colors";
import { fontStack } from "@/lib/design-system";

// 人気の成分（アイコンなし、クリーンなデザイン）
const popularIngredients = [
  { label: "ビタミンC", value: "ビタミンC（アスコルビン酸）" },
  { label: "ビタミンD", value: "ビタミンD" },
  { label: "マグネシウム", value: "マグネシウム" },
  { label: "カルシウム", value: "カルシウム" },
  { label: "オメガ3", value: "オメガ3脂肪酸（EPA・DHA）" },
  { label: "亜鉛", value: "亜鉛" },
  { label: "葉酸", value: "葉酸" },
  { label: "鉄分", value: "鉄分" },
  { label: "NMN", value: "NMN" },
  { label: "コラーゲン", value: "コラーゲン" },
];

// 特徴バッジ（アイコンなし）
const badgeOptions = [
  { label: "5冠達成", value: "perfect" },
  { label: "最適価格", value: "lowest-price" },
  { label: "高含有", value: "highest-content" },
  { label: "高コスパ", value: "best-value" },
  { label: "高エビデンス", value: "evidence-s" },
  { label: "高安全性", value: "high-safety" },
];

// 剤形（形状）定義
const formOptions = [
  { label: "カプセル", value: "capsule" },
  { label: "タブレット", value: "tablet" },
  { label: "ソフトジェル", value: "softgel" },
  { label: "パウダー", value: "powder" },
  { label: "リキッド", value: "liquid" },
  { label: "グミ", value: "gummy" },
  { label: "形状不明", value: "unknown" },
];

interface FilterSection {
  title: string;
  filterKey:
    | "priceRange"
    | "evidenceLevel"
    | "ecSite"
    | "badges"
    | "ingredient"
    | "formType";
  options: { label: string; value: string; count?: number }[];
}

interface FilterSidebarProps {
  onFilterChange?: (filters: {
    searchQuery?: string;
    priceRange?: string | null;
    evidenceLevel?: string | null;
    ecSite?: string | null;
    badges?: string[];
    ingredient?: string | null;
    formType?: string | null;
  }) => void;
  onClearFilters?: () => void;
  activeFilters?: {
    searchQuery?: string;
    priceRange?: string | null;
    evidenceLevel?: string | null;
    ecSite?: string | null;
    badges?: string[];
    ingredient?: string | null;
    formType?: string | null;
  };
  filterCounts?: {
    ingredients: Record<string, number>;
    sources: Record<string, number>;
    priceRanges: Record<string, number>;
    tiers: Record<string, number>;
    forms: Record<string, number>;
  };
}

export function FilterSidebar({
  onFilterChange,
  onClearFilters,
  activeFilters = {},
  filterCounts,
}: FilterSidebarProps) {
  // フィルターセクションの定義
  const filterSections: FilterSection[] = [
    {
      title: "成分",
      filterKey: "ingredient",
      options: popularIngredients.map((ing) => ({
        ...ing,
        count: filterCounts?.ingredients[ing.value],
      })),
    },
    {
      title: "Tier",
      filterKey: "evidenceLevel",
      options: [
        { label: "S+", value: "S+", count: filterCounts?.tiers["S+"] },
        { label: "S", value: "S", count: filterCounts?.tiers["S"] },
        { label: "A", value: "A", count: filterCounts?.tiers["A"] },
        { label: "B", value: "B", count: filterCounts?.tiers["B"] },
        { label: "C", value: "C", count: filterCounts?.tiers["C"] },
        { label: "D", value: "D", count: filterCounts?.tiers["D"] },
      ],
    },
    {
      title: "特徴",
      filterKey: "badges",
      options: badgeOptions,
    },
    {
      title: "価格帯",
      filterKey: "priceRange",
      options: [
        {
          label: "〜¥2,000",
          value: "0-2000",
          count: filterCounts?.priceRanges["0-2000"],
        },
        {
          label: "¥2,000〜5,000",
          value: "2000-5000",
          count: filterCounts?.priceRanges["2000-5000"],
        },
        {
          label: "¥5,000〜10,000",
          value: "5000-10000",
          count: filterCounts?.priceRanges["5000-10000"],
        },
        {
          label: "¥10,000〜",
          value: "10000+",
          count: filterCounts?.priceRanges["10000+"],
        },
      ],
    },
    {
      title: "剤形",
      filterKey: "formType",
      options: formOptions.map((form) => ({
        ...form,
        count: filterCounts?.forms[form.value],
      })),
    },
    {
      title: "購入サイト",
      filterKey: "ecSite",
      options: [
        {
          label: "Amazon",
          value: "amazon",
          count: filterCounts?.sources["amazon"],
        },
        {
          label: "楽天市場",
          value: "rakuten",
          count: filterCounts?.sources["rakuten"],
        },
        {
          label: "Yahoo!",
          value: "yahoo",
          count: filterCounts?.sources["yahoo"],
        },
      ],
    },
  ];

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
    filterKey:
      | "priceRange"
      | "evidenceLevel"
      | "ecSite"
      | "badges"
      | "ingredient"
      | "formType",
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

  const clearSearch = () => {
    setSearchQuery("");
    if (onFilterChange) {
      onFilterChange({ searchQuery: "" });
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

  // Tier colors - minimal and sophisticated
  const getTierColor = (tier: TierRank) => {
    const colors: Record<TierRank, string> = {
      "S+": "#D4AF37",
      S: "#22C55E",
      A: "#6366F1",
      B: "#3B82F6",
      C: "#F59E0B",
      D: "#9CA3AF",
    };
    return colors[tier] || colors.D;
  };

  return (
    <div
      className="w-full lg:w-[280px] rounded-2xl overflow-hidden"
      style={{
        fontFamily: fontStack,
        backgroundColor: "#FAFAFA",
        border: "1px solid rgba(0, 0, 0, 0.06)",
      }}
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between">
        <h2
          className="text-[15px] font-semibold tracking-[-0.01em]"
          style={{ color: "#1D1D1F" }}
        >
          フィルター
        </h2>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-[13px] font-medium transition-opacity hover:opacity-70"
            style={{ color: "#007AFF" }}
          >
            すべてクリア
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-5 pb-4">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "#8E8E93" }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="検索"
            className="w-full pl-9 pr-9 py-2 rounded-lg text-[14px] transition-all duration-150 outline-none"
            style={{
              backgroundColor: "#FFFFFF",
              color: "#1D1D1F",
              border: "1px solid rgba(0, 0, 0, 0.08)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#007AFF";
              e.target.style.boxShadow = "0 0 0 3px rgba(0, 122, 255, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(0, 0, 0, 0.08)";
              e.target.style.boxShadow = "none";
            }}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={14} style={{ color: "#8E8E93" }} />
            </button>
          )}
        </div>
      </div>

      {/* Sections */}
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {filterSections.map((section) => {
          const isExpanded = expandedSections.has(section.title);

          return (
            <div
              key={section.title}
              className="border-t"
              style={{ borderColor: "rgba(0, 0, 0, 0.06)" }}
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full px-5 py-3 flex items-center justify-between transition-colors hover:bg-white/50"
              >
                <span
                  className="text-[13px] font-medium"
                  style={{ color: "#1D1D1F" }}
                >
                  {section.title}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  style={{ color: "#8E8E93" }}
                />
              </button>

              {/* Section Content */}
              {isExpanded && (
                <div className="px-5 pb-4">
                  {section.title === "Tier" ? (
                    // Tier Rank - Horizontal compact design
                    <div className="flex gap-1.5">
                      {section.options.map((option) => {
                        const isSelected =
                          activeFilters.evidenceLevel === option.value;
                        const rank = option.value as TierRank;
                        const color = getTierColor(rank);
                        const hasProducts = option.count && option.count > 0;

                        return (
                          <button
                            key={option.value}
                            onClick={() =>
                              handleFilterToggle("evidenceLevel", option.value)
                            }
                            disabled={!hasProducts}
                            className="flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all duration-150 disabled:opacity-25 disabled:cursor-not-allowed"
                            style={{
                              backgroundColor: isSelected
                                ? color
                                : "transparent",
                              color: isSelected ? "#FFFFFF" : color,
                              border: `1.5px solid ${isSelected ? color : "rgba(0, 0, 0, 0.08)"}`,
                            }}
                          >
                            {option.value}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    // Standard list layout
                    <div className="space-y-1">
                      {section.options.map((option) => {
                        const isSelected =
                          section.filterKey === "badges"
                            ? (activeFilters.badges || []).includes(
                                option.value,
                              )
                            : section.filterKey === "ingredient"
                              ? activeFilters.ingredient === option.value
                              : section.filterKey === "formType"
                                ? activeFilters.formType === option.value
                                : activeFilters[section.filterKey] ===
                                  option.value;

                        const hasProducts =
                          section.filterKey === "badges" ||
                          (option.count !== undefined
                            ? option.count > 0
                            : true);

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
                            disabled={!hasProducts}
                            className="w-full px-3 py-2 rounded-lg text-[13px] text-left transition-all duration-150 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-between group"
                            style={{
                              backgroundColor: isSelected
                                ? isPerfect
                                  ? "#D4AF37"
                                  : "#007AFF"
                                : "transparent",
                              color: isSelected ? "#FFFFFF" : "#1D1D1F",
                            }}
                          >
                            <span className={isSelected ? "font-medium" : ""}>
                              {option.label}
                            </span>
                            {option.count !== undefined && option.count > 0 && (
                              <span
                                className="text-[11px] tabular-nums"
                                style={{
                                  color: isSelected
                                    ? "rgba(255,255,255,0.7)"
                                    : "#8E8E93",
                                }}
                              >
                                {option.count}
                              </span>
                            )}
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

      {/* Active Filter Count */}
      {activeFilterCount > 0 && (
        <div
          className="px-5 py-3 border-t"
          style={{ borderColor: "rgba(0, 0, 0, 0.06)" }}
        >
          <p className="text-[12px]" style={{ color: "#8E8E93" }}>
            {activeFilterCount}件の条件で絞り込み中
          </p>
        </div>
      )}
    </div>
  );
}
