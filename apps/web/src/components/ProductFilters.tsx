"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { X } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { BADGE_DEFINITIONS, BadgeType } from "@/lib/badges";

interface Brand {
  _id: string;
  name: string;
  country?: string;
}

interface ProductFiltersProps {
  brands: Brand[];
  currentParams: {
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    minScore?: string;
    badges?: string; // カンマ区切りのバッジタイプ
    ecSites?: string; // カンマ区切りのECサイト
    sort?: string;
  };
}

// ECサイト定義
const EC_SITES = [
  { id: "rakuten", name: "楽天市場", icon: "🛍️" },
  { id: "yahoo", name: "Yahoo!ショッピング", icon: "🟣" },
  { id: "amazon", name: "Amazon", icon: "📦" },
  { id: "iherb", name: "iHerb", icon: "🌿" },
] as const;

export function ProductFilters({ brands, currentParams }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedBrand, setSelectedBrand] = useState(currentParams.brand || "");
  const [minPrice, setMinPrice] = useState(currentParams.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(currentParams.maxPrice || "");
  const [minScore, setMinScore] = useState(currentParams.minScore || "");

  // 称号フィルター（複数選択可能）
  const [selectedBadges, setSelectedBadges] = useState<Set<BadgeType>>(
    new Set(
      currentParams.badges
        ? (currentParams.badges.split(",") as BadgeType[])
        : [],
    ),
  );

  // ECサイトフィルター（複数選択可能）
  const [selectedECSites, setSelectedECSites] = useState<Set<string>>(
    new Set(currentParams.ecSites ? currentParams.ecSites.split(",") : []),
  );

  // フィルターを適用
  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    // フィルター条件を設定
    if (selectedBrand) {
      params.set("brand", selectedBrand);
    } else {
      params.delete("brand");
    }

    if (minPrice) {
      params.set("minPrice", minPrice);
    } else {
      params.delete("minPrice");
    }

    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    } else {
      params.delete("maxPrice");
    }

    if (minScore) {
      params.set("minScore", minScore);
    } else {
      params.delete("minScore");
    }

    // 称号フィルター
    if (selectedBadges.size > 0) {
      params.set("badges", Array.from(selectedBadges).join(","));
    } else {
      params.delete("badges");
    }

    // ECサイトフィルター
    if (selectedECSites.size > 0) {
      params.set("ecSites", Array.from(selectedECSites).join(","));
    } else {
      params.delete("ecSites");
    }

    // ソート条件は保持
    const currentSort = searchParams.get("sort");
    if (currentSort) {
      params.set("sort", currentSort);
    }

    router.push(`/products?${params.toString()}`);
  }, [
    selectedBrand,
    minPrice,
    maxPrice,
    minScore,
    selectedBadges,
    selectedECSites,
    searchParams,
    router,
  ]);

  // フィルターをリセット
  const resetFilters = useCallback(() => {
    setSelectedBrand("");
    setMinPrice("");
    setMaxPrice("");
    setMinScore("");
    setSelectedBadges(new Set());
    setSelectedECSites(new Set());

    // ソート条件のみ保持
    const currentSort = searchParams.get("sort");
    if (currentSort) {
      router.push(`/products?sort=${currentSort}`);
    } else {
      router.push("/products");
    }
  }, [searchParams, router]);

  const hasActiveFilters =
    selectedBrand ||
    minPrice ||
    maxPrice ||
    minScore ||
    selectedBadges.size > 0 ||
    selectedECSites.size > 0;

  // 称号トグル処理
  const toggleBadge = (badgeType: BadgeType) => {
    const newSet = new Set(selectedBadges);
    if (newSet.has(badgeType)) {
      newSet.delete(badgeType);
    } else {
      newSet.add(badgeType);
    }
    setSelectedBadges(newSet);
  };

  // ECサイトトグル処理
  const toggleECSite = (siteId: string) => {
    const newSet = new Set(selectedECSites);
    if (newSet.has(siteId)) {
      newSet.delete(siteId);
    } else {
      newSet.add(siteId);
    }
    setSelectedECSites(newSet);
  };

  return (
    <div className="space-y-6">
      {/* ブランド選択 */}
      <div>
        <label className="block text-sm font-semibold text-primary-900 mb-2">
          ブランド
        </label>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">全てのブランド</option>
          {brands.map((brand) => (
            <option key={brand._id} value={brand._id}>
              {brand.name}
              {brand.country && ` (${brand.country === "JP" ? "🇯🇵" : "🇺🇸"})`}
            </option>
          ))}
        </select>
      </div>

      {/* 価格帯 */}
      <div>
        <label className="block text-sm font-semibold text-primary-900 mb-2">
          価格帯
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="最小"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="px-4 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            min="0"
          />
          <input
            type="number"
            placeholder="最大"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="px-4 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            min="0"
          />
        </div>
        <p className="text-xs text-primary-600 mt-1">円（税込）</p>
      </div>

      {/* 総合スコア */}
      <div>
        <label className="block text-sm font-semibold text-primary-900 mb-2">
          最低総合スコア
        </label>
        <select
          value={minScore}
          onChange={(e) => setMinScore(e.target.value)}
          className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">指定なし</option>
          <option value="90">90以上（優良）</option>
          <option value="80">80以上（良好）</option>
          <option value="70">70以上（標準）</option>
          <option value="60">60以上（最低限）</option>
        </select>
      </div>

      {/* 称号フィルター */}
      <div>
        <label className="block text-sm font-semibold text-primary-900 mb-3">
          🏆 称号で絞り込み
        </label>
        <div className="space-y-2">
          {Object.entries(BADGE_DEFINITIONS).map(([type, badge]) => (
            <label
              key={type}
              className="flex items-center gap-2 cursor-pointer hover:bg-primary-50 p-2 rounded-lg transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedBadges.has(type as BadgeType)}
                onChange={() => toggleBadge(type as BadgeType)}
                className="rounded border-primary-300 text-primary focus:ring-primary focus:ring-offset-0"
              />
              <span className="text-lg">{badge.icon}</span>
              <span className="text-sm text-primary-900">{badge.label}</span>
            </label>
          ))}
        </div>
        {selectedBadges.size > 0 && (
          <p className="text-xs text-primary-600 mt-2">
            {selectedBadges.size}つの称号で絞り込み中
          </p>
        )}
      </div>

      {/* ECサイトフィルター */}
      <div>
        <label className="block text-sm font-semibold text-primary-900 mb-3">
          🛒 販売サイトで絞り込み
        </label>
        <div className="space-y-2">
          {EC_SITES.map((site) => (
            <label
              key={site.id}
              className="flex items-center gap-2 cursor-pointer hover:bg-primary-50 p-2 rounded-lg transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedECSites.has(site.id)}
                onChange={() => toggleECSite(site.id)}
                className="rounded border-primary-300 text-primary focus:ring-primary focus:ring-offset-0"
              />
              <span className="text-lg">{site.icon}</span>
              <span className="text-sm text-primary-900">{site.name}</span>
            </label>
          ))}
        </div>
        {selectedECSites.size > 0 && (
          <p className="text-xs text-primary-600 mt-2">
            {selectedECSites.size}つのサイトで絞り込み中
          </p>
        )}
      </div>

      {/* ボタン */}
      <div className="space-y-2 pt-4 border-t border-primary-200">
        <button
          onClick={applyFilters}
          className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
        >
          フィルターを適用
        </button>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="w-full px-4 py-2 bg-primary-100 text-primary hover:bg-primary-200 transition-colors rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <X size={16} />
            リセット
          </button>
        )}
      </div>

      {/* アクティブなフィルター表示 */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-primary-200">
          <p className="text-xs font-semibold text-primary-700 mb-2">
            適用中のフィルター
          </p>
          <div className="space-y-1 text-xs text-primary-600">
            {selectedBrand && (
              <div>
                ブランド: {brands.find((b) => b._id === selectedBrand)?.name}
              </div>
            )}
            {minPrice && <div>最低価格: {formatPrice(Number(minPrice))}</div>}
            {maxPrice && <div>最高価格: {formatPrice(Number(maxPrice))}</div>}
            {minScore && <div>最低スコア: {minScore}以上</div>}
            {selectedBadges.size > 0 && (
              <div>
                称号:{" "}
                {Array.from(selectedBadges)
                  .map((b) => BADGE_DEFINITIONS[b].label)
                  .join(", ")}
              </div>
            )}
            {selectedECSites.size > 0 && (
              <div>
                販売サイト:{" "}
                {Array.from(selectedECSites)
                  .map((s) => EC_SITES.find((site) => site.id === s)?.name)
                  .join(", ")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
