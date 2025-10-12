"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { X } from "lucide-react";

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
    sort?: string;
  };
}

export function ProductFilters({ brands, currentParams }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedBrand, setSelectedBrand] = useState(currentParams.brand || "");
  const [minPrice, setMinPrice] = useState(currentParams.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(currentParams.maxPrice || "");
  const [minScore, setMinScore] = useState(currentParams.minScore || "");

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

    // ソート条件は保持
    const currentSort = searchParams.get("sort");
    if (currentSort) {
      params.set("sort", currentSort);
    }

    router.push(`/products?${params.toString()}`);
  }, [selectedBrand, minPrice, maxPrice, minScore, searchParams, router]);

  // フィルターをリセット
  const resetFilters = useCallback(() => {
    setSelectedBrand("");
    setMinPrice("");
    setMaxPrice("");
    setMinScore("");

    // ソート条件のみ保持
    const currentSort = searchParams.get("sort");
    if (currentSort) {
      router.push(`/products?sort=${currentSort}`);
    } else {
      router.push("/products");
    }
  }, [searchParams, router]);

  const hasActiveFilters = selectedBrand || minPrice || maxPrice || minScore;

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
            {minPrice && (
              <div>最低価格: ¥{Number(minPrice).toLocaleString()}</div>
            )}
            {maxPrice && (
              <div>最高価格: ¥{Number(maxPrice).toLocaleString()}</div>
            )}
            {minScore && <div>最低スコア: {minScore}以上</div>}
          </div>
        </div>
      )}
    </div>
  );
}
