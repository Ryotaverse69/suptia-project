"use client";

import { TierRank } from "@/lib/tier-colors";

import { useState } from "react";
import { parseProductInfo } from "@/lib/product-parser";
import {
  ExternalLink,
  Database,
  Filter,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";

interface PriceData {
  source: string;
  shopName?: string;
  storeName?: string;
  productName?: string;
  itemCode?: string;
  amount: number;
  currency: string;
  url: string;
  fetchedAt: string;
  confidence?: number;
  quantity?: number;
  unitPrice?: number;
  shippingFee?: number;
  pointRate?: number;
  isFreeShipping?: boolean;
  effectivePrice?: number;
  pointAmount?: number;
  stockStatus?: "in_stock" | "low_stock" | "out_of_stock" | "unknown";
}

interface PriceComparisonProps {
  priceData?: PriceData[];
  priceRank?: TierRank;
  className?: string;
}

/**
 * 複数ECサイトの価格比較コンポーネント
 * Customer-Centric Style (Readable & Actionable)
 */
export function PriceComparison({
  priceData,
  priceRank,
  className = "",
}: PriceComparisonProps) {
  const [showBulkPrices, setShowBulkPrices] = useState(true);

  const hasData = priceData && priceData.length > 0;

  // ランク情報の定義 (Clean Style)
  const rankInfo: Record<
    string,
    {
      color: string;
      textColor: string;
      label: string;
    }
  > = {
    "S+": {
      color: "bg-purple-100 border-purple-200",
      textColor: "text-purple-700",
      label: "神コスパ",
    },
    S: {
      color: "bg-purple-50 border-purple-100",
      textColor: "text-purple-700",
      label: "最安値級",
    },
    A: {
      color: "bg-blue-100",
      textColor: "text-blue-700",
      label: "お買い得",
    },
    B: {
      color: "bg-emerald-100",
      textColor: "text-emerald-700",
      label: "標準価格",
    },
    C: {
      color: "bg-amber-100",
      textColor: "text-amber-700",
      label: "やや高め",
    },
    D: {
      color: "bg-rose-100",
      textColor: "text-rose-700",
      label: "割高",
    },
  };

  const currentRankInfo = priceRank ? rankInfo[priceRank] : null;

  if (!hasData) {
    return (
      <div
        className={`bg-slate-50 border border-slate-200 rounded-xl p-8 text-center ${className}`}
      >
        <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-200 rounded-full mb-4">
          <Database className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-700 mb-2">
          購入リンクを準備中
        </h3>
        <p className="text-sm text-slate-500">
          各ECサイトの価格情報を取得しています。
          <br />
          商品名で直接検索することもできます。
        </p>
      </div>
    );
  }

  // データ処理
  const processedPrices = priceData.map((price) => {
    const productName = price.productName || "";
    const parsed = parseProductInfo(
      productName,
      price.source,
      price.amount,
      price.itemCode,
    );

    const finalQuantity = price.quantity || parsed.quantity;
    const finalUnitPrice = price.unitPrice || parsed.unitPrice;
    const isBulk = finalQuantity > 1;

    return {
      ...price,
      quantity: finalQuantity,
      unitPrice: finalUnitPrice,
      storeName: price.storeName || price.shopName || parsed.storeName,
      isBulk: isBulk,
    };
  });

  const singlePrices = processedPrices.filter((p) => (p.quantity || 1) === 1);
  const bulkPrices = processedPrices.filter((p) => (p.quantity || 1) > 1);

  const displayPrices = showBulkPrices
    ? [...singlePrices, ...bulkPrices]
    : singlePrices;

  const minUnitPrice = Math.min(
    ...displayPrices.map((p) => p.unitPrice || p.amount),
  );

  const sortedPrices = [...displayPrices].sort(
    (a, b) => (a.unitPrice || a.amount) - (b.unitPrice || b.amount),
  );

  const getSourceName = (source: string) => {
    const sourceNames: Record<string, string> = {
      rakuten: "楽天市場",
      yahoo: "Yahoo!ショッピング",
      amazon: "Amazon",
      iherb: "iHerb",
    };
    return sourceNames[source] || source.toUpperCase();
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="bg-white p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">最安値チェック</h2>
            <p className="text-xs text-slate-500">
              各ショップの価格を比較
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentRankInfo && (
            <div
              className={`px-3 py-1 rounded-full border border-transparent ${currentRankInfo.color}`}
            >
              <span
                className={`text-xs font-bold ${currentRankInfo.textColor}`}
              >
                {currentRankInfo.label}
              </span>
            </div>
          )}

          {bulkPrices.length > 0 && (
            <button
              onClick={() => setShowBulkPrices(!showBulkPrices)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all
                ${
                  showBulkPrices
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                }
              `}
            >
              <Filter className="w-3 h-3" />
              {showBulkPrices ? "まとめ買いも表示" : "単品のみ表示"}
            </button>
          )}
        </div>
      </div>

      {/* Data List */}
      <div className="divide-y divide-slate-100">
        {sortedPrices.map((price, index) => {
          const unitPrice = price.unitPrice || price.amount;
          const isLowest = unitPrice === minUnitPrice;
          const quantity = price.quantity || 1;
          const isBulk = quantity > 1;

          return (
            <a
              key={`${price.source}-${index}`}
              href={price.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                block p-4 transition-all hover:bg-white hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] hover:-translate-y-1 relative group rounded-xl border border-transparent hover:border-blue-200 mb-2
                ${isLowest ? "bg-blue-50/40" : ""}
              `}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                {/* Shop Info */}
                <div className="flex items-start gap-4 sm:w-1/3">
                  <div
                    className={`
                    flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold shadow-sm
                    ${index === 0 ? "bg-amber-100 text-amber-700 ring-2 ring-amber-200" : "bg-slate-100 text-slate-500"}
                  `}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                        {getSourceName(price.source)}
                      </span>
                      {isLowest && (
                        <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-sm">
                          最安値
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 flex flex-wrap gap-2">
                      {price.storeName && (
                        <span className="truncate max-w-[180px]">
                          {price.storeName}
                        </span>
                      )}
                      {isBulk && (
                        <span className="text-blue-600 font-bold bg-blue-50 px-1.5 rounded">
                          {quantity}個セット
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price Info */}
                <div className="flex flex-col sm:items-end sm:w-1/3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors">
                      ¥{price.amount.toLocaleString()}
                    </span>
                    {isBulk && (
                      <span className="text-xs text-slate-500 font-medium">
                        (単価: ¥{unitPrice.toLocaleString()})
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Arrow (Visual Cue) */}
                <div className="sm:w-1/4 flex justify-end items-center">
                  <div className="relative group">
                    {/* Magic Border Container */}
                    <div
                      className={`
                      relative overflow-hidden rounded-lg p-[2px] transition-all duration-300
                      ${isLowest ? "shadow-[0_0_15px_rgba(244,63,94,0.4)]" : "hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"}
                    `}
                    >
                      {/* Rotating Gradient Border */}
                      <div
                        className={`
                        absolute inset-[-100%] w-[300%] h-[300%] animate-border-spin
                        ${
                          isLowest
                            ? "bg-[conic-gradient(from_90deg_at_50%_50%,#ffe4e6_0%,#f43f5e_50%,#ffe4e6_100%)]"
                            : "bg-[conic-gradient(from_90deg_at_50%_50%,#bfdbfe_0%,#2563eb_50%,#bfdbfe_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        }
                      `}
                      />

                      {/* Button Content (Mask) */}
                      <div
                        className={`
                        relative flex items-center gap-1 text-sm font-bold px-4 py-1.5 rounded-[6px] bg-white transition-all
                        ${isLowest ? "text-rose-500" : "text-slate-400 group-hover:text-blue-600"}
                      `}
                      >
                        <span className="relative z-10 flex items-center gap-1">
                          サイトへ
                          <ExternalLink className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Footer */}
      <div className="bg-amber-50 p-3 border-t border-amber-200">
        <div className="flex items-start gap-2 justify-center">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            送料は各ショップ・配送先により異なります。購入前に各サイトで送料をご確認ください。
          </p>
        </div>
      </div>
    </div>
  );
}
