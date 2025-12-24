/**
 * 推薦理由可視化カード
 *
 * 設計原則:
 * - 理由を説明する - 推薦には必ず根拠を提示
 * - 重み付けを見せる - ユーザーが選んでいる感覚を作る
 *
 * 5つの柱:
 * 💰 価格 | 📊 成分量 | 💡 コスパ | 🔬 エビデンス | 🛡️ 安全性
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  ProductSummary,
  RecommendationWeights,
} from "@/lib/concierge/types";

interface RecommendationCardProps {
  product: ProductSummary;
  weights?: RecommendationWeights;
  rank?: number;
  className?: string;
}

export function RecommendationCard({
  product,
  weights,
  rank,
  className,
}: RecommendationCardProps) {
  const scores = product.scores;

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700",
        "overflow-hidden hover:shadow-md transition-shadow",
        className,
      )}
    >
      {/* ヘッダー */}
      <div className="flex items-start gap-4 p-4">
        {/* ランク */}
        {rank && (
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white",
              rank === 1
                ? "bg-yellow-500"
                : rank === 2
                  ? "bg-gray-400"
                  : rank === 3
                    ? "bg-amber-600"
                    : "bg-gray-300",
            )}
          >
            {rank}
          </div>
        )}

        {/* 商品画像 */}
        {product.imageUrl && (
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={64}
              height={64}
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* 商品情報 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
            {product.name}
          </h3>
          {product.price && (
            <p className="mt-1 text-lg font-bold text-primary-600 dark:text-primary-400">
              ¥{product.price.toLocaleString()}
            </p>
          )}
          {product.source && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {product.source}
            </p>
          )}
        </div>
      </div>

      {/* 5つの柱スコア */}
      {scores && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              5つの柱スコア
            </span>
            <button
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="スコアについて"
            >
              <Info className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>

          <div className="space-y-2">
            <ScoreBar
              icon="💰"
              label="価格"
              score={scores.price}
              weight={weights?.price}
            />
            <ScoreBar
              icon="📊"
              label="成分量"
              score={scores.amount}
              weight={weights?.amount}
            />
            <ScoreBar
              icon="💡"
              label="コスパ"
              score={scores.costPerformance}
              weight={weights?.costPerformance}
            />
            <ScoreBar
              icon="🔬"
              label="エビデンス"
              score={scores.evidence}
              weight={weights?.evidence}
            />
            <ScoreBar
              icon="🛡️"
              label="安全性"
              score={scores.safety}
              weight={weights?.safety}
            />
          </div>

          {/* 総合スコア */}
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                総合スコア
              </span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${scores.total}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {scores.total}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* フッター */}
      <div className="px-4 pb-4">
        <Link
          href={`/products/${product.id}`}
          className={cn(
            "flex items-center justify-center gap-2 w-full py-2 rounded-lg",
            "bg-gray-100 dark:bg-gray-700",
            "hover:bg-gray-200 dark:hover:bg-gray-600",
            "text-sm font-medium text-gray-700 dark:text-gray-300",
            "transition-colors",
          )}
        >
          詳細を見る
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

/**
 * スコアバー
 */
function ScoreBar({
  icon,
  label,
  score,
  weight,
}: {
  icon: string;
  label: string;
  score: number;
  weight?: number;
}) {
  const isHighlighted = weight && weight > 1.2;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{icon}</span>
      <span
        className={cn(
          "w-16 text-xs",
          isHighlighted
            ? "font-medium text-primary-600 dark:text-primary-400"
            : "text-gray-500 dark:text-gray-400",
        )}
      >
        {label}
        {isHighlighted && " ★"}
      </span>
      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full",
            score >= 80
              ? "bg-green-500"
              : score >= 60
                ? "bg-yellow-500"
                : score >= 40
                  ? "bg-orange-500"
                  : "bg-red-500",
          )}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="w-8 text-right text-xs font-medium text-gray-700 dark:text-gray-300">
        {score}
      </span>
    </div>
  );
}
