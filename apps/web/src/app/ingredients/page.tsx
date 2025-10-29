import { Metadata } from "next";
import Link from "next/link";
import { sanity } from "@/lib/sanity.client";
import {
  Search,
  Filter,
  BookOpen,
  TrendingUp,
  Shield,
  ChevronRight,
  Pill,
} from "lucide-react";
import { IngredientSearch } from "@/components/IngredientSearch";

export const metadata: Metadata = {
  title: "成分ガイド｜サプリメント成分の効果と科学的根拠 - サプティア",
  description:
    "サプリメントに含まれる成分の効果、推奨摂取量、副作用、科学的根拠を詳しく解説。ビタミン、ミネラル、オメガ3など、あなたに最適なサプリメント選びをサポートします。",
  keywords: [
    "サプリメント",
    "成分",
    "ビタミン",
    "ミネラル",
    "効果",
    "摂取量",
    "科学的根拠",
    "栄養素",
  ],
  openGraph: {
    title: "成分ガイド - サプティア",
    description:
      "サプリメント成分の効果と科学的根拠を徹底解説。あなたに最適なサプリメント選びをサポートします。",
    type: "website",
    url: "https://suptia.com/ingredients",
  },
  twitter: {
    card: "summary_large_image",
    title: "成分ガイド - サプティア",
    description: "サプリメント成分の効果と科学的根拠を徹底解説",
  },
  alternates: {
    canonical: "https://suptia.com/ingredients",
  },
};

interface Ingredient {
  name: string;
  nameEn: string;
  slug: {
    current: string;
  };
  category: string;
  description: string;
  evidenceLevel: string;
}

// カテゴリー一覧
const ingredientCategories = [
  "ビタミン",
  "ミネラル",
  "脂肪酸",
  "アミノ酸",
  "プロバイオティクス",
  "ハーブ",
  "その他",
] as const;

async function getIngredients(): Promise<Ingredient[]> {
  const query = `*[_type == "ingredient"] | order(category asc, name asc){
    name,
    nameEn,
    slug,
    category,
    description,
    evidenceLevel
  }`;

  try {
    const ingredients = await sanity.fetch(query);
    return ingredients || [];
  } catch (error) {
    console.error("Failed to fetch ingredients:", error);
    return [];
  }
}

export default async function IngredientsPage() {
  const ingredients = await getIngredients();

  // カテゴリー別に成分を整理
  const ingredientsByCategory = ingredientCategories.map((category) => ({
    category,
    ingredients: ingredients.filter((ing) => ing.category === category),
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* パンくずリスト */}
      <div className="bg-white border-b border-primary-200">
        <div className="mx-auto px-6 lg:px-12 xl:px-16 py-4 max-w-[1200px]">
          <nav className="flex items-center gap-2 text-sm text-primary-700">
            <Link href="/" className="hover:text-primary">
              ホーム
            </Link>
            <ChevronRight size={16} />
            <span className="text-primary-900 font-medium">成分ガイド</span>
          </nav>
        </div>
      </div>

      {/* ヒーローセクション */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="mx-auto px-6 lg:px-12 xl:px-16 py-16 max-w-[1200px]">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <BookOpen size={32} />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">成分ガイド</h1>
            </div>
            <p className="text-xl text-primary-100 mb-8">
              サプリメントに含まれる成分の効果、推奨摂取量、科学的根拠を徹底解説。
              <br />
              あなたに最適なサプリメント選びをサポートします。
            </p>

            {/* 検索バー */}
            <IngredientSearch />
          </div>
        </div>
      </div>

      {/* 統計情報 */}
      <div className="bg-white border-b border-primary-200">
        <div className="mx-auto px-6 lg:px-12 xl:px-16 py-8 max-w-[1200px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Pill className="text-primary" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-900">
                  {ingredients.length}+
                </div>
                <div className="text-sm text-primary-700">解説済み成分</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent-mint/20 rounded-lg">
                <Shield className="text-accent-mint" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-900">
                  科学的根拠
                </div>
                <div className="text-sm text-primary-700">
                  エビデンスベースの情報
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent-purple/20 rounded-lg">
                <TrendingUp className="text-accent-purple" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-900">
                  定期更新
                </div>
                <div className="text-sm text-primary-700">最新の研究を反映</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="mx-auto px-6 lg:px-12 xl:px-16 py-12 max-w-[1200px]">
        {ingredients.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-primary-700">
              成分データを読み込み中...
              <br />
              Sanity Studioで成分を追加してください。
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-primary-900 mb-2">
                カテゴリー別成分一覧
              </h2>
              <p className="text-primary-700">
                気になる成分をクリックして、詳しい情報をご覧ください
              </p>
            </div>

            {/* カテゴリー別成分リスト */}
            <div className="space-y-12">
              {ingredientsByCategory.map(
                ({ category, ingredients }) =>
                  ingredients.length > 0 && (
                    <section key={category}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <Filter className="text-primary" size={20} />
                        </div>
                        <h3 className="text-2xl font-bold text-primary-900">
                          {category}
                        </h3>
                        <span className="text-sm text-primary-600 bg-primary-100 px-3 py-1 rounded-full">
                          {ingredients.length}件
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ingredients.map((ingredient) => (
                          <Link
                            key={ingredient.slug.current}
                            href={`/ingredients/${ingredient.slug.current}`}
                            className="group bg-white border border-primary-200 rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="text-lg font-bold text-primary-900 group-hover:text-primary transition-colors mb-1">
                                  {ingredient.name}
                                </h4>
                                <p className="text-sm text-primary-600">
                                  {ingredient.nameEn}
                                </p>
                              </div>
                              <ChevronRight className="text-primary-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                            </div>

                            <p className="text-sm text-primary-700 line-clamp-2 mb-4">
                              {ingredient.description}
                            </p>

                            <div className="flex items-center gap-2">
                              <div className="inline-flex items-center gap-1 px-3 py-1 bg-accent-mint/10 border border-accent-mint/30 rounded-full">
                                <Shield
                                  className="text-accent-mint"
                                  size={14}
                                />
                                <span className="text-xs font-medium text-primary-900">
                                  根拠レベル: {ingredient.evidenceLevel}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </section>
                  ),
              )}
            </div>

            {/* 全成分アルファベット順（オプション） */}
            <section className="mt-16 pt-12 border-t border-primary-200">
              <h3 className="text-2xl font-bold text-primary-900 mb-6">
                全成分一覧（アルファベット順）
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {[...ingredients]
                  .filter((ingredient) => ingredient.slug?.current)
                  .sort((a, b) =>
                    (a.slug?.current || "").localeCompare(
                      b.slug?.current || "",
                    ),
                  )
                  .map((ingredient) => (
                    <Link
                      key={ingredient.slug.current}
                      href={`/ingredients/${ingredient.slug.current}`}
                      className="px-4 py-3 bg-white border border-primary-200 rounded-lg hover:border-primary hover:bg-primary-50 transition-colors text-sm"
                    >
                      <div className="font-medium text-primary-900">
                        {ingredient.name}
                      </div>
                      <div className="text-xs text-primary-600">
                        {ingredient.nameEn}
                      </div>
                    </Link>
                  ))}
              </div>
            </section>
          </>
        )}

        {/* CTA */}
        <div className="mt-16 p-8 bg-gradient-to-br from-primary-50 to-accent-mint/10 border border-primary-200 rounded-xl">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-primary-900 mb-3">
              あなたに最適なサプリメントを見つけよう
            </h3>
            <p className="text-primary-700 mb-6">
              成分の知識を活かして、科学的根拠に基づいたサプリメント選びを始めましょう
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              サプリメントを探す
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
