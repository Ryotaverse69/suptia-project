"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { X } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { TierRank } from "@/lib/tier-colors";

interface Brand {
  _id: string;
  name: string;
  country?: string;
}

interface ProductFiltersProps {
  brands: Brand[];
  categories?: string[]; // 成分カテゴリ一覧（オプション）
  currentParams: {
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    minScore?: string;
    minTierRank?: string; // 最低Tierランク（S/A/B/C/D）
    ecSites?: string; // カンマ区切りのECサイト
    category?: string; // 成分カテゴリフィルター
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

export function ProductFilters({
  brands,
  categories = [],
  currentParams,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedBrand, setSelectedBrand] = useState(currentParams.brand || "");
  const [selectedCategory, setSelectedCategory] = useState(
    currentParams.category || "",
  );

  // 価格帯スライダー用のstate（最小: 0円、最大: 10000円）
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(currentParams.minPrice) || 0,
    Number(currentParams.maxPrice) || 10000,
  ]);
  const MAX_PRICE = 10000;
  const [minScore, setMinScore] = useState(currentParams.minScore || "");

  // 最低Tierランクフィルター
  const [minTierRank, setMinTierRank] = useState(
    currentParams.minTierRank || "",
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

    if (selectedCategory) {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }

    // 価格範囲フィルター（デフォルト値と異なる場合のみ設定）
    if (priceRange[0] > 0) {
      params.set("minPrice", priceRange[0].toString());
    } else {
      params.delete("minPrice");
    }

    if (priceRange[1] < MAX_PRICE) {
      params.set("maxPrice", priceRange[1].toString());
    } else {
      params.delete("maxPrice");
    }

    if (minScore) {
      params.set("minScore", minScore);
    } else {
      params.delete("minScore");
    }

    // 最低Tierランクフィルター
    if (minTierRank) {
      params.set("minTierRank", minTierRank);
    } else {
      params.delete("minTierRank");
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
    selectedCategory,
    priceRange,
    minScore,
    minTierRank,
    selectedECSites,
    searchParams,
    router,
    MAX_PRICE,
  ]);

  // フィルターをリセット
  const resetFilters = useCallback(() => {
    setSelectedBrand("");
    setSelectedCategory("");
    setPriceRange([0, MAX_PRICE]);
    setMinScore("");
    setMinTierRank("");
    setSelectedECSites(new Set());

    // ソート条件のみ保持
    const currentSort = searchParams.get("sort");
    if (currentSort) {
      router.push(`/products?sort=${currentSort}`);
    } else {
      router.push("/products");
    }
  }, [searchParams, router, MAX_PRICE]);

  // ランク別の色（ツヤツヤグラデーション付き）
  const rankColors: Record<TierRank, string> = {
    "S+": "bg-gradient-to-br from-purple-500/80 via-pink-500/70 to-yellow-500/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
    S: "bg-gradient-to-br from-purple-500/80 via-purple-500/70 to-purple-600/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
    A: "bg-gradient-to-br from-blue-500/80 via-blue-500/70 to-blue-600/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
    B: "bg-gradient-to-br from-green-500/80 via-green-500/70 to-green-600/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
    C: "bg-gradient-to-br from-yellow-500/80 via-yellow-500/70 to-yellow-600/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
    D: "bg-gradient-to-br from-gray-400/80 via-gray-400/70 to-gray-500/60 backdrop-blur-sm border-2 border-white/60 shadow-lg",
  };

  // ランク別のテキスト色（ツヤツヤ感のため濃く）
  const rankTextColors: Record<TierRank, string> = {
    "S+": "text-purple-800",
    S: "text-purple-800",
    A: "text-blue-800",
    B: "text-green-800",
    C: "text-yellow-800",
    D: "text-gray-800",
  };

  // ガラス光沢シャドウ（ツヤツヤ感強化）
  const glassTextShadow = {
    textShadow:
      "0 2px 0 rgba(255,255,255,1), 0 3px 2px rgba(255,255,255,0.8), 0 4px 6px rgba(0,0,0,0.2), 0 6px 12px rgba(0,0,0,0.15), 0 0 30px rgba(255,255,255,0.8), 0 0 50px rgba(255,255,255,0.4)",
  } as React.CSSProperties;

  // Tierランク選択肢
  const tierRanks: TierRank[] = ["S+", "S", "A", "B", "C", "D"];

  const hasActiveFilters =
    selectedBrand ||
    selectedCategory ||
    priceRange[0] > 0 ||
    priceRange[1] < MAX_PRICE ||
    minScore ||
    minTierRank ||
    selectedECSites.size > 0;

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
    <div className="space-y-6 bg-gradient-to-br from-primary-50/50 to-white p-6 rounded-xl shadow-sm border border-primary-100">
      {/* フィルターヘッダー */}
      <div className="pb-4 border-b border-primary-200">
        <h3 className="text-lg font-bold text-primary-900 flex items-center gap-2">
          <span className="text-2xl">🔍</span>
          絞り込み検索
        </h3>
        <p className="text-xs text-primary-600 mt-1">
          条件を選択して最適な商品を見つけましょう
        </p>
      </div>

      {/* ブランド選択 */}
      <div className="bg-white p-4 rounded-lg border border-primary-100 shadow-sm hover:shadow-md transition-shadow">
        <label className="block text-sm font-semibold text-primary-900 mb-3 flex items-center gap-2">
          <span className="text-lg">🏢</span>
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

      {/* 成分カテゴリ選択 */}
      {categories.length > 0 && (
        <div className="bg-white p-4 rounded-lg border border-primary-100 shadow-sm hover:shadow-md transition-shadow">
          <label className="block text-sm font-semibold text-primary-900 mb-3 flex items-center gap-2">
            <span className="text-lg">🧪</span>
            成分カテゴリ
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">全てのカテゴリ</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 価格帯スライダー */}
      <div className="bg-white p-4 rounded-lg border border-primary-100 shadow-sm hover:shadow-md transition-shadow">
        <label className="block text-sm font-semibold text-primary-900 mb-3 flex items-center gap-2">
          <span className="text-lg">💰</span>
          価格帯
        </label>
        <div className="space-y-4">
          {/* 価格範囲表示 */}
          <div className="flex items-center justify-between px-2">
            <div className="text-sm font-semibold text-primary-700">
              ¥{priceRange[0].toLocaleString()}
            </div>
            <div className="text-xs text-primary-600">〜</div>
            <div className="text-sm font-semibold text-primary-700">
              ¥{priceRange[1].toLocaleString()}
            </div>
          </div>

          {/* 最小価格スライダー */}
          <div>
            <label className="text-xs text-primary-600 mb-1 block">
              最低価格
            </label>
            <input
              type="range"
              min="0"
              max={MAX_PRICE}
              step="100"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([
                  Math.min(Number(e.target.value), priceRange[1] - 100),
                  priceRange[1],
                ])
              }
              className="w-full h-2 bg-primary-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* 最大価格スライダー */}
          <div>
            <label className="text-xs text-primary-600 mb-1 block">
              最高価格
            </label>
            <input
              type="range"
              min="0"
              max={MAX_PRICE}
              step="100"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([
                  priceRange[0],
                  Math.max(Number(e.target.value), priceRange[0] + 100),
                ])
              }
              className="w-full h-2 bg-primary-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* クイック選択ボタン */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPriceRange([0, 2000])}
              className="px-3 py-1.5 text-xs font-medium bg-primary-100 text-primary hover:bg-primary-200 rounded-md transition-colors"
            >
              〜¥2,000
            </button>
            <button
              type="button"
              onClick={() => setPriceRange([2000, 5000])}
              className="px-3 py-1.5 text-xs font-medium bg-primary-100 text-primary hover:bg-primary-200 rounded-md transition-colors"
            >
              ¥2,000〜5,000
            </button>
            <button
              type="button"
              onClick={() => setPriceRange([5000, MAX_PRICE])}
              className="px-3 py-1.5 text-xs font-medium bg-primary-100 text-primary hover:bg-primary-200 rounded-md transition-colors"
            >
              ¥5,000〜
            </button>
          </div>
        </div>
      </div>

      {/* 総合スコア */}
      <div className="bg-white p-4 rounded-lg border border-primary-100 shadow-sm hover:shadow-md transition-shadow">
        <label className="block text-sm font-semibold text-primary-900 mb-3 flex items-center gap-2">
          <span className="text-lg">⭐</span>
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

      {/* Tierランクフィルター */}
      <div className="bg-white p-4 rounded-lg border border-primary-100 shadow-sm hover:shadow-md transition-shadow">
        <label className="block text-sm font-semibold text-primary-900 mb-3 flex items-center gap-2">
          <span className="text-lg">🏆</span>
          最低Tierランク
        </label>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {tierRanks.map((rank) => {
            const isSelected = minTierRank === rank;
            return (
              <button
                key={rank}
                type="button"
                onClick={() => setMinTierRank(isSelected ? "" : rank)}
                className={`relative overflow-hidden transition-all duration-200 ${
                  isSelected
                    ? "scale-105 ring-2 ring-primary ring-offset-2"
                    : "hover:scale-105"
                }`}
              >
                <div className="relative w-full h-12">
                  <div
                    className={`absolute inset-0 flex items-center justify-center rounded font-black text-base ${rankColors[rank]} ${rankTextColors[rank]}`}
                  >
                    <span style={glassTextShadow}>{rank}</span>
                  </div>
                  {/* キラキラハイライト（複数レイヤー） */}
                  <div className="absolute inset-0 rounded bg-gradient-to-br from-white/50 via-white/10 to-transparent pointer-events-none"></div>
                  <div className="absolute inset-0 rounded bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none"></div>
                  {/* 選択済みインジケーター */}
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
        <p className="text-xs text-primary-600 mt-2">
          {minTierRank
            ? `${minTierRank}ランク以上の商品を表示`
            : "タップして最低ランクを選択"}
        </p>
      </div>

      {/* ECサイトフィルター */}
      <div className="bg-white p-4 rounded-lg border border-primary-100 shadow-sm hover:shadow-md transition-shadow">
        <label className="block text-sm font-semibold text-primary-900 mb-3 flex items-center gap-2">
          <span className="text-lg">🛒</span>
          販売サイトで絞り込み
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
      <div className="space-y-3 pt-6 border-t-2 border-primary-200">
        <button
          onClick={applyFilters}
          className="w-full px-4 py-3.5 bg-gradient-to-r from-primary to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02]"
        >
          ✨ フィルターを適用
        </button>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="w-full px-4 py-2.5 bg-white border-2 border-primary-200 text-primary hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow"
          >
            <X size={18} />
            すべてリセット
          </button>
        )}
      </div>

      {/* アクティブなフィルター表示 */}
      {hasActiveFilters && (
        <div className="bg-primary-50/50 p-4 rounded-lg border border-primary-200">
          <p className="text-sm font-bold text-primary-900 mb-3 flex items-center gap-2">
            <span className="text-lg">📌</span>
            適用中のフィルター
          </p>
          <div className="space-y-2 text-sm text-primary-700">
            {selectedBrand && (
              <div>
                ブランド: {brands.find((b) => b._id === selectedBrand)?.name}
              </div>
            )}
            {selectedCategory && <div>成分カテゴリ: {selectedCategory}</div>}
            {(priceRange[0] > 0 || priceRange[1] < MAX_PRICE) && (
              <div>
                価格帯: ¥{priceRange[0].toLocaleString()} 〜 ¥
                {priceRange[1].toLocaleString()}
              </div>
            )}
            {minScore && <div>最低スコア: {minScore}以上</div>}
            {minTierRank && <div>最低Tierランク: {minTierRank}ランク以上</div>}
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
