/**
 * コスパ詳細表示コンポーネント
 * 成分量あたりの価格を詳しく分析
 */

import { Calculator, TrendingDown, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CostEffectivenessDetailProps {
  currentProduct: {
    name: string;
    slug?: { current: string };
    imageUrl?: string;
    priceJPY: number;
    ingredientAmount: number; // mg
    servingsPerDay: number;
    servingsPerContainer: number;
  };
  similarProducts?: Array<{
    name: string;
    slug?: { current: string };
    imageUrl?: string;
    priceJPY: number;
    ingredientAmount: number;
    servingsPerDay: number;
    servingsPerContainer: number;
  }>;
  className?: string;
}

export function CostEffectivenessDetail({
  currentProduct,
  similarProducts = [],
  className = "",
}: CostEffectivenessDetailProps) {
  // コスパ計算関数
  const calculateCostPerMg = (product: typeof currentProduct) => {
    const totalIngredientMg =
      product.ingredientAmount * product.servingsPerContainer;
    return product.priceJPY / totalIngredientMg;
  };

  const calculateCostPerDay = (product: typeof currentProduct) => {
    const daysSupply = product.servingsPerContainer / product.servingsPerDay;
    return product.priceJPY / daysSupply;
  };

  // 現在の商品のコスパ
  const currentCostPerMg = calculateCostPerMg(currentProduct);
  const currentCostPerDay = calculateCostPerDay(currentProduct);
  const currentDailyIngredient =
    currentProduct.ingredientAmount * currentProduct.servingsPerDay;

  // 全商品のコスパを計算してソート
  const allProducts = [
    { ...currentProduct, isCurrent: true },
    ...similarProducts.map((p) => ({ ...p, isCurrent: false })),
  ].map((p) => ({
    ...p,
    costPerMg: calculateCostPerMg(p),
    costPerDay: calculateCostPerDay(p),
    dailyIngredient: p.ingredientAmount * p.servingsPerDay,
  }));

  const sortedByCostPerMg = [...allProducts].sort(
    (a, b) => a.costPerMg - b.costPerMg,
  );
  const isBestValue = sortedByCostPerMg[0].isCurrent;

  return (
    <div
      className={`bg-white border border-primary-200 rounded-xl shadow-sm p-6 ${className}`}
    >
      <h2 className="text-2xl font-bold text-primary-900 mb-4 flex items-center gap-2">
        <Calculator size={24} />
        コストパフォーマンス分析
      </h2>

      {/* ベストバリューバッジ */}
      {isBestValue && (
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-400 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800">
            <Award size={24} />
            <div>
              <p className="font-bold text-lg">💡 ベストバリュー</p>
              <p className="text-sm">
                同じ成分を含む商品の中で、最もコストパフォーマンスが優れています！
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 主要指標 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700 mb-1">1mgあたりの価格</p>
          <p className="text-2xl font-bold text-blue-900">
            ¥{currentCostPerMg.toFixed(2)}
          </p>
        </div>

        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs text-green-700 mb-1">1日あたりのコスト</p>
          <p className="text-2xl font-bold text-green-900">
            ¥{currentCostPerDay.toFixed(0)}
          </p>
        </div>

        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-xs text-purple-700 mb-1">1日あたりの成分量</p>
          <p className="text-2xl font-bold text-purple-900">
            {currentDailyIngredient}mg
          </p>
        </div>
      </div>

      {/* 詳細計算 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">計算の詳細</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>商品価格:</span>
            <span className="font-mono">
              ¥{currentProduct.priceJPY.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>総成分量:</span>
            <span className="font-mono">
              {currentProduct.ingredientAmount} mg ×{" "}
              {currentProduct.servingsPerContainer} 回 ={" "}
              {(
                currentProduct.ingredientAmount *
                currentProduct.servingsPerContainer
              ).toLocaleString()}
              mg
            </span>
          </div>
          <div className="flex justify-between">
            <span>供給日数:</span>
            <span className="font-mono">
              {currentProduct.servingsPerContainer} 回 ÷{" "}
              {currentProduct.servingsPerDay} 回/日 ={" "}
              {(
                currentProduct.servingsPerContainer /
                currentProduct.servingsPerDay
              ).toFixed(0)}{" "}
              日分
            </span>
          </div>
          <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between font-semibold">
            <span>1mgあたりの価格:</span>
            <span className="font-mono text-primary">
              ¥{currentCostPerMg.toFixed(3)}/mg
            </span>
          </div>
        </div>
      </div>

      {/* 比較の結果（比較セクションの上に表示） */}
      {sortedByCostPerMg.length > 1 && (
        <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-400 rounded-xl shadow-md">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 text-3xl">📊</div>
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-2">
                比較の結果
              </h3>
              <p className="text-base text-blue-800 leading-relaxed">
                {isBestValue
                  ? "この商品は最もコストパフォーマンスに優れています。同じ成分をより安く摂取できます。"
                  : `最もコスパの良い商品と比較すると、1mgあたり¥${(currentCostPerMg - sortedByCostPerMg[0].costPerMg).toFixed(2)}高くなります。`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 他商品との比較 */}
      {sortedByCostPerMg.length > 1 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            他商品との比較
          </h3>
          <div className="space-y-3">
            {sortedByCostPerMg.map((product, index) => {
              const savingsVsCurrent = product.isCurrent
                ? 0
                : ((product.costPerMg - currentCostPerMg) / currentCostPerMg) *
                  100;

              const productContent = (
                <>
                  <div className="flex items-start gap-3">
                    {/* 商品画像 */}
                    <div className="flex-shrink-0 w-16 h-16 relative rounded overflow-hidden bg-gray-100">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          sizes="64px"
                          className="object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <span className="text-2xl opacity-30">📦</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <span className="text-sm font-semibold flex-shrink-0">
                            {index + 1}位
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm break-words leading-tight mb-1">
                              {product.name}
                              {product.isCurrent && " (この商品)"}
                            </div>
                            {index === 0 && (
                              <span className="inline-block px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs font-bold rounded-full">
                                💡 最高コスパ
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-sm font-bold whitespace-nowrap flex-shrink-0">
                          ¥{product.costPerMg.toFixed(2)}/mg
                        </span>
                      </div>

                      {!product.isCurrent && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <TrendingDown size={14} />
                          <span>
                            {savingsVsCurrent > 0
                              ? `この商品より${savingsVsCurrent.toFixed(0)}%割高`
                              : `この商品より${Math.abs(savingsVsCurrent).toFixed(0)}%お得`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              );

              return (
                <div
                  key={product.name}
                  className={`rounded-lg border-2 ${
                    product.isCurrent
                      ? "border-primary bg-primary-50"
                      : index === 0
                        ? "border-yellow-400 bg-yellow-50"
                        : "border-gray-200 bg-gray-50"
                  }`}
                >
                  {!product.isCurrent && product.slug?.current ? (
                    <Link
                      href={`/products/${product.slug.current}`}
                      className="block p-4 hover:opacity-80 transition-opacity"
                    >
                      {productContent}
                    </Link>
                  ) : (
                    <div className="p-4">{productContent}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
