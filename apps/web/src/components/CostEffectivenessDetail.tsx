/**
 * コスパ詳細表示コンポーネント
 * 成分量あたりの価格を詳しく分析
 */

import { Calculator, TrendingDown, Award } from "lucide-react";

interface CostEffectivenessDetailProps {
  currentProduct: {
    name: string;
    priceJPY: number;
    ingredientAmount: number; // mg
    servingsPerDay: number;
    servingsPerContainer: number;
  };
  similarProducts?: Array<{
    name: string;
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

              return (
                <div
                  key={product.name}
                  className={`p-4 rounded-lg border-2 ${
                    product.isCurrent
                      ? "border-primary bg-primary-50"
                      : index === 0
                        ? "border-yellow-400 bg-yellow-50"
                        : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        {index + 1}位
                      </span>
                      <span className="text-sm">
                        {product.name}
                        {product.isCurrent && " (この商品)"}
                      </span>
                      {index === 0 && (
                        <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs font-bold rounded-full">
                          💡 最高コスパ
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-bold">
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
              );
            })}
          </div>
        </div>
      )}

      {/* まとめ */}
      <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
        <p className="text-sm text-primary-800">
          <strong>💡 ポイント:</strong>{" "}
          {isBestValue
            ? "この商品は最もコストパフォーマンスに優れています。同じ成分をより安く摂取できます。"
            : `最もコスパの良い商品と比較すると、1mgあたり¥${(currentCostPerMg - sortedByCostPerMg[0].costPerMg).toFixed(2)}高くなります。`}
        </p>
      </div>
    </div>
  );
}
