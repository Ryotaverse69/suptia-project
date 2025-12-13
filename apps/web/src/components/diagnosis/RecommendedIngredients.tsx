import Link from "next/link";
import { Heart, Award, CheckCircle } from "lucide-react";
import type { HealthGoal } from "@/lib/recommendation-engine";
import { getRecommendedIngredients } from "@/lib/goal-ingredient-mapping";

interface RecommendedIngredientsProps {
  goals: HealthGoal[];
}

/**
 * エビデンスレベルのバッジカラー
 */
function getEvidenceBadgeColor(level: string): string {
  switch (level) {
    case "S":
      return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white";
    case "A":
      return "bg-gradient-to-r from-green-400 to-emerald-500 text-white";
    case "B":
      return "bg-gradient-to-r from-blue-400 to-cyan-500 text-white";
    case "C":
      return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
    case "D":
      return "bg-gradient-to-r from-gray-300 to-gray-400 text-white";
    default:
      return "bg-gray-200 text-gray-700";
  }
}

/**
 * 診断結果画面に表示する推奨成分セクション
 */
export function RecommendedIngredients({ goals }: RecommendedIngredientsProps) {
  const recommendedIngredients = getRecommendedIngredients(goals);

  if (recommendedIngredients.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 sm:p-8 border border-blue-200 shadow-lg">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-2.5">
          <Heart className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            あなたにぴったりの成分
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            健康目標に基づいて、科学的根拠のある成分を推奨します
          </p>
        </div>
      </div>

      {/* 推奨成分リスト */}
      <div className="space-y-3">
        {recommendedIngredients.map((ingredient, index) => (
          <div
            key={ingredient.name + index}
            className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-300 group"
          >
            <div className="flex items-start gap-4">
              {/* アイコン */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Award className="text-white" size={20} />
                </div>
              </div>

              {/* 成分情報 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    {ingredient.name}
                  </h3>
                  <span className="text-xs sm:text-sm text-gray-500 font-medium">
                    ({ingredient.nameEn})
                  </span>

                  {/* エビデンスレベルバッジ */}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${getEvidenceBadgeColor(ingredient.evidenceLevel)}`}
                  >
                    {ingredient.evidenceLevel}
                  </span>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  {ingredient.reason}
                </p>

                {/* 詳細リンク */}
                {ingredient.slug && (
                  <Link
                    href={`/ingredients/${ingredient.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium group/link"
                  >
                    <CheckCircle size={16} />
                    <span className="group-hover/link:underline">
                      {ingredient.name}の詳細を見る
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 注釈 */}
      <div className="mt-6 p-4 bg-blue-100/50 rounded-lg border border-blue-200">
        <div className="flex gap-2">
          <CheckCircle
            className="flex-shrink-0 text-blue-600 mt-0.5"
            size={16}
          />
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            <strong>エビデンスレベル:</strong> S = 最高レベルの科学的根拠、A =
            高い信頼性、B = 中程度の信頼性、C = 限定的な根拠、D = 初期段階の研究
          </p>
        </div>
      </div>
    </div>
  );
}
