"use client";

import { useState } from "react";
import { parseProductInfo } from "@/lib/product-parser";

/**
 * 複数ECサイトの価格比較コンポーネント
 *
 * 「案A: 全体統合（最安値優先）」を実装
 * - 全てのECサイト・店舗を混ぜて最安値順に表示
 * - 楽天市場内の各店舗、Yahoo!ショッピング内の店舗も個別表示
 * - 単品とセット商品を分離表示
 * - 単位価格（¥/個）を表示
 */

interface PriceData {
  source: string;
  shopName?: string; // 店舗名（旧フィールド、下位互換のため保持）
  storeName?: string; // 店舗名（新フィールド）
  productName?: string; // 商品名（数量検出用）
  amount: number;
  currency: string;
  url: string;
  fetchedAt: string;
  confidence?: number;
  quantity?: number; // セット数量
  unitPrice?: number; // 単位価格
}

interface PriceComparisonProps {
  priceData?: PriceData[];
  className?: string;
}

export function PriceComparison({
  priceData,
  className = "",
}: PriceComparisonProps) {
  const [showBulkPrices, setShowBulkPrices] = useState(false);

  if (!priceData || priceData.length === 0) {
    return null;
  }

  // 価格データを処理（数量・店舗名・単位価格を追加）
  const processedPrices = priceData.map((price) => {
    // 既に処理済みの場合はそのまま使用
    if (price.quantity && price.unitPrice && price.storeName) {
      return price;
    }

    // 商品名から情報を抽出
    const productName = price.productName || "";
    const parsed = parseProductInfo(productName, price.source, price.amount);

    return {
      ...price,
      quantity: price.quantity || parsed.quantity,
      unitPrice: price.unitPrice || parsed.unitPrice,
      storeName: price.storeName || price.shopName || parsed.storeName,
      isBulk: parsed.isBulk,
    };
  });

  // 単品とセット商品に分離
  const singlePrices = processedPrices.filter((p) => (p.quantity || 1) === 1);
  const bulkPrices = processedPrices.filter((p) => (p.quantity || 1) > 1);

  // 表示する価格リスト
  const displayPrices = showBulkPrices
    ? [...singlePrices, ...bulkPrices]
    : singlePrices;

  // 最安値を見つける（単位価格ベース）
  const minUnitPrice = Math.min(
    ...displayPrices.map((p) => p.unitPrice || p.amount),
  );

  // ソース名を日本語に変換
  const getSourceName = (source: string) => {
    const sourceNames: Record<string, string> = {
      rakuten: "楽天市場",
      yahoo: "Yahoo!ショッピング",
      amazon: "Amazon",
      iherb: "iHerb",
    };
    return sourceNames[source] || source;
  };

  // ソースアイコン（色）を取得
  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      rakuten: "bg-red-50 border-red-200 text-red-700",
      yahoo: "bg-purple-50 border-purple-200 text-purple-700",
      amazon: "bg-orange-50 border-orange-200 text-orange-700",
      iherb: "bg-green-50 border-green-200 text-green-700",
    };
    return colors[source] || "bg-gray-50 border-gray-200 text-gray-700";
  };

  // 価格を単位価格の安い順にソート
  const sortedPrices = [...displayPrices].sort(
    (a, b) => (a.unitPrice || a.amount) - (b.unitPrice || b.amount),
  );

  // 最終更新日時を計算
  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      return `${days}日前`;
    } else if (hours > 0) {
      return `${hours}時間前`;
    } else {
      return `${minutes}分前`;
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">💰 価格比較（最安値順）</h2>

        {/* セット商品表示トグル */}
        {bulkPrices.length > 0 && (
          <button
            onClick={() => setShowBulkPrices(!showBulkPrices)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {showBulkPrices
              ? `単品のみ表示 (${singlePrices.length}件)`
              : `セット商品も表示 (+${bulkPrices.length}件)`}
          </button>
        )}
      </div>

      <div className="mb-4 space-y-2">
        <p className="text-sm text-gray-600">
          複数のECサイト・店舗から最安値を比較できます
        </p>
        {showBulkPrices && bulkPrices.length > 0 && (
          <p className="text-sm text-blue-600">
            💡 セット商品は単位価格（¥/個）で比較しています
          </p>
        )}
      </div>

      <div className="space-y-3">
        {sortedPrices.map((price, index) => {
          const unitPrice = price.unitPrice || price.amount;
          const isLowest = unitPrice === minUnitPrice;
          const isCheapest = index === 0;
          const quantity = price.quantity || 1;
          const isBulk = quantity > 1;

          return (
            <a
              key={`${price.source}-${index}`}
              href={price.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                block p-4 rounded-lg border-2 transition-all hover:shadow-md
                ${
                  isLowest
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`
                      px-3 py-1 text-xs font-semibold rounded-full border
                      ${getSourceColor(price.source)}
                    `}
                    >
                      {getSourceName(price.source)}
                    </span>
                    {isCheapest && (
                      <span className="px-2 py-1 text-xs font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                        🏆 最安値
                      </span>
                    )}
                    {isBulk && (
                      <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                        {quantity}個セット
                      </span>
                    )}
                  </div>

                  {/* 店舗名表示 */}
                  {price.storeName && (
                    <div className="mb-1 text-sm font-medium text-gray-700">
                      {price.storeName}
                    </div>
                  )}

                  <div className="flex items-baseline gap-3">
                    {/* 総額表示 */}
                    <span className="text-2xl font-bold text-gray-900">
                      ¥{price.amount.toLocaleString()}
                    </span>

                    {/* 単位価格表示（セット商品の場合） */}
                    {isBulk && (
                      <span className="text-lg text-gray-600">
                        (¥{unitPrice.toLocaleString()}/個)
                      </span>
                    )}

                    <span className="text-sm text-gray-500">
                      ({price.currency})
                    </span>
                  </div>

                  <div className="mt-1 text-xs text-gray-500">
                    最終更新: {getTimeSince(price.fetchedAt)}
                    {price.confidence && (
                      <span className="ml-2">
                        信頼度: {(price.confidence * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 ml-4">
                  <span className="text-blue-600 font-medium text-sm">
                    購入ページへ →
                  </span>
                </div>
              </div>

              {!isLowest && sortedPrices[0] && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    最安値との差額: +¥
                    {(
                      unitPrice -
                      (sortedPrices[0].unitPrice || sortedPrices[0].amount)
                    ).toLocaleString()}
                    {isBulk && "/個"}
                  </span>
                </div>
              )}
            </a>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          💡 価格は定期的に更新されますが、購入時に変動している場合があります。
        </p>
      </div>
    </div>
  );
}
