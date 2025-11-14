/**
 * コスパ詳細表示コンポーネント
 * 成分量あたりの価格を詳しく分析
 */

import { Calculator, TrendingDown, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Tooltip } from "./ui/Tooltip";

interface Ingredient {
  name: string;
  amountMgPerServing: number;
  isPrimary?: boolean; // 主成分フラグ
}

interface CostEffectivenessDetailProps {
  currentProduct: {
    name: string;
    slug?: { current: string };
    imageUrl?: string;
    priceJPY: number;
    ingredientAmount: number; // mg（主成分のみ、後方互換性のため残す）
    servingsPerDay: number;
    servingsPerContainer: number;
    ingredients?: Ingredient[]; // 全成分情報（複合サプリ対応）
  };
  similarProducts?: Array<{
    name: string;
    slug?: { current: string };
    imageUrl?: string;
    priceJPY: number;
    ingredientAmount: number;
    servingsPerDay: number;
    servingsPerContainer: number;
    ingredients?: Ingredient[];
  }>;
  costEffectivenessRank?: "S" | "A" | "B" | "C" | "D";
  totalProductsInCategory?: number; // 同一成分カテゴリの商品総数
  className?: string;
}

export function CostEffectivenessDetail({
  currentProduct,
  similarProducts = [],
  costEffectivenessRank,
  totalProductsInCategory = 0,
  className = "",
}: CostEffectivenessDetailProps) {
  // ランク情報の定義
  const rankInfo: Record<
    string,
    {
      color: string;
      bgColor: string;
      borderColor: string;
      textColor: string;
      label: string;
      description: string;
    }
  > = {
    S: {
      color: "from-purple-600 to-purple-800",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-800",
      label: "ベストバリュー",
      description: "最もコストパフォーマンスに優れています",
    },
    A: {
      color: "from-blue-500 to-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      label: "優良コスパ",
      description: "非常に優れたコストパフォーマンスです",
    },
    B: {
      color: "from-green-500 to-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      label: "標準コスパ",
      description: "標準的なコストパフォーマンスです",
    },
    C: {
      color: "from-yellow-500 to-yellow-700",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800",
      label: "やや割高",
      description: "コストパフォーマンスはやや低めです",
    },
    D: {
      color: "from-red-500 to-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      label: "割高",
      description: "コストパフォーマンスは低めです",
    },
  };

  const currentRankInfo = costEffectivenessRank
    ? rankInfo[costEffectivenessRank]
    : null;

  // 複合サプリかどうかを判定
  const isMultiIngredient =
    currentProduct.ingredients && currentProduct.ingredients.length > 1;

  // 主成分を取得（isPrimary=trueまたは最初の成分）
  const primaryIngredient = isMultiIngredient
    ? currentProduct.ingredients?.find((ing) => ing.isPrimary) ||
      currentProduct.ingredients?.[0]
    : null;

  // 全成分の合計mg
  const totalAllIngredientsMg = isMultiIngredient
    ? currentProduct.ingredients?.reduce(
        (sum, ing) => sum + ing.amountMgPerServing,
        0,
      ) || currentProduct.ingredientAmount
    : currentProduct.ingredientAmount;

  // コスパ計算関数
  const calculateCostPerMg = (
    product: typeof currentProduct,
    useAllIngredients = false,
  ) => {
    let totalIngredientMg: number;

    if (useAllIngredients && product.ingredients) {
      // 全成分の合計mg
      const allIngredientsMg = product.ingredients.reduce(
        (sum, ing) => sum + ing.amountMgPerServing,
        0,
      );
      totalIngredientMg = allIngredientsMg * product.servingsPerContainer;
    } else {
      // 主成分のみ（従来通り）
      totalIngredientMg =
        product.ingredientAmount * product.servingsPerContainer;
    }

    return product.priceJPY / totalIngredientMg;
  };

  const calculateCostPerDay = (product: typeof currentProduct) => {
    const daysSupply = product.servingsPerContainer / product.servingsPerDay;
    return product.priceJPY / daysSupply;
  };

  // 現在の商品のコスパ
  const currentCostPerMg = calculateCostPerMg(currentProduct);
  const currentCostPerMgAllIngredients = isMultiIngredient
    ? calculateCostPerMg(currentProduct, true)
    : currentCostPerMg;
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

      {/* コスパランクの説明セクション */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Tooltip
            content={
              <div className="text-xs leading-relaxed">
                <p className="font-semibold mb-1">
                  💰 価格ランク vs 💡 コスパランク
                </p>
                <p className="mb-2">
                  <span className="font-semibold">価格ランク:</span>{" "}
                  支払う金額の安さを評価
                </p>
                <p>
                  <span className="font-semibold">コスパランク:</span>{" "}
                  1mgあたりの価格で成分効率を評価
                </p>
              </div>
            }
            icon
          />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900 mb-1">
              コスパランクとは？
            </h3>
            <p className="text-xs text-blue-800 leading-relaxed">
              成分量（mg）あたりの価格効率を、同じ成分を含む他商品と相対比較した評価です。
              価格が安くても成分量が少なければコスパは低くなります。
            </p>
          </div>
        </div>
      </div>

      {/* ランクバッジ */}
      {currentRankInfo && (
        <div
          className={`mb-4 p-4 rounded-xl bg-gradient-to-r ${currentRankInfo.color}`}
        >
          <div className="text-white flex items-center justify-between">
            <div>
              <p className="text-xl font-bold mb-1">
                {costEffectivenessRank}ランク
              </p>
              <p className="text-base opacity-90">{currentRankInfo.label}</p>
            </div>
            <Tooltip
              content={
                <div className="text-xs leading-relaxed">
                  <p className="font-semibold mb-1">ランク判定について</p>
                  {totalProductsInCategory > 0 ? (
                    <p>
                      同じ成分を含む{totalProductsInCategory}
                      商品中の相対評価です。
                      新商品の追加でランクが変動することがあります。
                    </p>
                  ) : (
                    <p>
                      同じ成分を含む商品の中での相対評価です。
                      商品数の変化でランクが変動することがあります。
                    </p>
                  )}
                </div>
              }
              icon
            />
          </div>
        </div>
      )}

      {/* ランク説明 */}
      {currentRankInfo && (
        <div
          className={`mb-6 p-4 rounded-lg ${currentRankInfo.bgColor} border ${currentRankInfo.borderColor}`}
        >
          <p className={`text-sm ${currentRankInfo.textColor}`}>
            {currentRankInfo.description}
          </p>
        </div>
      )}

      {/* 主要指標 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-1 mb-1">
            <p className="text-xs text-blue-700">
              1mgあたりの価格
              {isMultiIngredient && (
                <span className="text-[10px]">（主成分）</span>
              )}
            </p>
            {isMultiIngredient && (
              <Tooltip
                content={
                  <div className="text-xs">
                    主成分（
                    {primaryIngredient?.name || "最初の成分"}
                    ）のコストです
                  </div>
                }
                icon
              />
            )}
          </div>
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

      {/* 複合サプリの場合の追加情報 */}
      {isMultiIngredient && currentProduct.ingredients && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
          <h3 className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-1">
            複合サプリメントの詳細
            <Tooltip
              content={
                <div className="text-xs leading-relaxed">
                  <p>
                    この商品は複数の成分を含んでいます。
                    主成分と全成分でコストを分けて表示しています。
                  </p>
                </div>
              }
              icon
            />
          </h3>

          {/* 成分リスト */}
          <div className="mb-3 space-y-1">
            {currentProduct.ingredients.map((ing, index) => (
              <div
                key={index}
                className="text-xs text-purple-800 flex justify-between"
              >
                <span>
                  {ing.name}
                  {ing.isPrimary && (
                    <span className="ml-1 px-1.5 py-0.5 bg-purple-200 text-purple-900 rounded text-[10px] font-semibold">
                      主成分
                    </span>
                  )}
                </span>
                <span className="font-mono">
                  {ing.amountMgPerServing}mg / 回
                </span>
              </div>
            ))}
            <div className="border-t border-purple-300 pt-1 mt-1 flex justify-between font-semibold text-sm text-purple-900">
              <span>合計</span>
              <span className="font-mono">{totalAllIngredientsMg}mg / 回</span>
            </div>
          </div>

          {/* コスト比較 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white border border-purple-300 rounded">
              <p className="text-[10px] text-purple-700 mb-1">
                主成分あたりのコスト
              </p>
              <p className="text-lg font-bold text-purple-900">
                ¥{currentCostPerMg.toFixed(2)}/mg
              </p>
              <p className="text-[10px] text-purple-600 mt-0.5">
                {primaryIngredient?.name}のコスト
              </p>
            </div>

            <div className="p-3 bg-white border border-pink-300 rounded">
              <p className="text-[10px] text-pink-700 mb-1">
                全成分合計あたりのコスト
              </p>
              <p className="text-lg font-bold text-pink-900">
                ¥{currentCostPerMgAllIngredients.toFixed(2)}/mg
              </p>
              <p className="text-[10px] text-pink-600 mt-0.5">
                {currentProduct.ingredients.length}成分の合計コスト
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 詳細計算 */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-3">計算の詳細</h3>
        <div className="space-y-2 text-sm text-blue-800">
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
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-base font-semibold text-blue-900 mb-2">
            比較の結果
          </h3>
          <p className="text-sm text-blue-800 leading-relaxed">
            {isBestValue
              ? "この商品は最もコストパフォーマンスに優れています。同じ成分をより安く摂取できます。"
              : `最もコスパの良い商品と比較すると、1mgあたり¥${(currentCostPerMg - sortedByCostPerMg[0].costPerMg).toFixed(2)}高くなります。`}
          </p>
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
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
                                <Award size={12} />
                                最高コスパ
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
