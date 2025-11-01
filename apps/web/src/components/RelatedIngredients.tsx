/**
 * 関連成分ガイド記事リンク表示コンポーネント
 * 商品に含まれる成分の一覧とガイド記事へのリンクを表示
 */

import { BookOpen, Award, FlaskConical } from "lucide-react";
import Link from "next/link";

interface Ingredient {
  _id: string;
  name: string;
  nameEn: string;
  slug?: { current: string };
  category?: string;
  evidenceLevel?: "S" | "A" | "B" | "C" | "D";
}

interface RelatedIngredientsProps {
  ingredients: Array<{
    amountMgPerServing: number;
    ingredient?: Ingredient;
  }>;
  className?: string;
}

// エビデンスレベルのバッジ色
const evidenceLevelColors = {
  S: "bg-purple-100 text-purple-800 border-purple-300",
  A: "bg-blue-100 text-blue-800 border-blue-300",
  B: "bg-green-100 text-green-800 border-green-300",
  C: "bg-yellow-100 text-yellow-800 border-yellow-300",
  D: "bg-gray-100 text-gray-800 border-gray-300",
};

export function RelatedIngredients({
  ingredients,
  className = "",
}: RelatedIngredientsProps) {
  // ingredient情報がある成分のみフィルター
  const validIngredients = ingredients.filter((item) => item.ingredient);

  if (validIngredients.length === 0) {
    return null;
  }

  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl shadow-sm p-6 ${className}`}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <BookOpen size={24} className="text-primary" />
        配合成分ガイド
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        この商品に含まれる成分の詳細情報を確認できます
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {validIngredients.map((item) => {
          const ingredient = item.ingredient!;
          const hasSlug = ingredient.slug?.current;

          const cardContent = (
            <div className="flex items-start gap-4 p-4">
              {/* アイコン */}
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                <FlaskConical size={24} className="text-primary" />
              </div>

              {/* 成分情報 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1">
                      {ingredient.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {ingredient.nameEn}
                    </p>
                  </div>

                  {/* 成分量 */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-bold text-primary">
                      {item.amountMgPerServing}mg
                    </p>
                    <p className="text-xs text-gray-500">1回あたり</p>
                  </div>
                </div>

                {/* カテゴリとエビデンスレベル */}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {ingredient.category && (
                    <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {ingredient.category}
                    </span>
                  )}
                  {ingredient.evidenceLevel && (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 border text-xs rounded-full font-semibold ${
                        evidenceLevelColors[ingredient.evidenceLevel]
                      }`}
                    >
                      <Award size={12} />
                      エビデンス {ingredient.evidenceLevel}
                    </span>
                  )}
                </div>

                {/* リンク矢印（リンクがある場合のみ） */}
                {hasSlug && (
                  <div className="mt-2 text-xs text-primary font-medium flex items-center gap-1">
                    詳細を見る
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          );

          // リンクがある場合はLinkでラップ、ない場合はそのまま表示
          return (
            <div
              key={ingredient._id}
              className={`border-2 rounded-lg transition-all ${
                hasSlug
                  ? "border-gray-200 hover:border-primary hover:shadow-md cursor-pointer"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              {hasSlug && ingredient.slug?.current ? (
                <Link
                  href={`/ingredients/${ingredient.slug.current}`}
                  className="block"
                >
                  {cardContent}
                </Link>
              ) : (
                cardContent
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
