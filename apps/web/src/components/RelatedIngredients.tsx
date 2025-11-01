/**
 * 関連成分ガイド記事リンク表示コンポーネント
 * 商品に関連する成分ガイド記事へのリンクを表示
 */

import { BookOpen, Award, ArrowRight } from "lucide-react";
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
  // slug（記事）がある成分のみフィルター
  const relatedArticles = ingredients
    .filter((item) => item.ingredient?.slug?.current)
    .map((item) => item.ingredient!);

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl shadow-sm p-6 ${className}`}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <BookOpen size={24} className="text-primary" />
        関連する成分ガイド
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        この商品に含まれる成分について詳しく知りたい方はこちら
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedArticles.map((ingredient) => (
          <Link
            key={ingredient._id}
            href={`/ingredients/${ingredient.slug!.current}`}
            className="group border-2 border-gray-200 rounded-lg p-4 transition-all hover:border-primary hover:shadow-md"
          >
            <div className="flex flex-col gap-3">
              {/* 成分名 */}
              <div>
                <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1 group-hover:text-primary transition-colors">
                  {ingredient.name}
                </h3>
                <p className="text-xs text-gray-500">{ingredient.nameEn}</p>
              </div>

              {/* カテゴリとエビデンスレベル */}
              <div className="flex flex-wrap items-center gap-2">
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
                    {ingredient.evidenceLevel}
                  </span>
                )}
              </div>

              {/* リンク */}
              <div className="flex items-center gap-1 text-xs text-primary font-medium mt-auto">
                詳しく見る
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
