"use client";

import { useState } from "react";
import { ProductListItem } from "./ProductListItem";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProductListProps {
  products: any[];
  initialDisplayCount?: number;
}

export function ProductList({
  products,
  initialDisplayCount = 10,
}: ProductListProps) {
  const [displayCount, setDisplayCount] = useState(initialDisplayCount);
  const [isExpanded, setIsExpanded] = useState(false);

  const hasMore = products.length > displayCount;
  const displayedProducts = products.slice(0, displayCount);

  const handleShowMore = () => {
    setDisplayCount(products.length);
    setIsExpanded(true);
  };

  const handleShowLess = () => {
    setDisplayCount(initialDisplayCount);
    setIsExpanded(false);
    // スクロールをリストの先頭に戻す
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8">
      {/* 商品リスト */}
      <div className="flex flex-col gap-2 sm:gap-3">
        {displayedProducts.map((product, index) => (
          <ProductListItem key={index} product={product} />
        ))}
      </div>

      {/* もっと見る / 閉じる ボタン */}
      {products.length > initialDisplayCount && (
        <div className="flex justify-center pt-4 sm:pt-6">
          {!isExpanded ? (
            <button
              onClick={handleShowMore}
              className="group relative inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg sm:rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span className="text-sm sm:text-base">
                もっと見る（残り{products.length - displayCount}件）
              </span>
              <ChevronDown
                size={20}
                className="group-hover:translate-y-0.5 transition-transform"
              />
            </button>
          ) : (
            <button
              onClick={handleShowLess}
              className="group relative inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <span className="text-sm sm:text-base">閉じる</span>
              <ChevronUp
                size={20}
                className="group-hover:-translate-y-0.5 transition-transform"
              />
            </button>
          )}
        </div>
      )}

      {/* 全件数表示 */}
      <div className="text-center pt-2">
        <p className="text-xs sm:text-sm text-gray-600">
          {displayedProducts.length}件 / 全{products.length}件を表示中
        </p>
      </div>
    </div>
  );
}
