import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { headers } from "next/headers";
import { sanity } from "@/lib/sanity.client";
import {
  Filter,
  BookOpen,
  TrendingUp,
  Shield,
  ChevronRight,
  Pill,
  Beaker,
} from "lucide-react";
import { IngredientSearch } from "@/components/IngredientSearch";
import { CategoryNav } from "@/components/CategoryNav";
import { generateBreadcrumbStructuredData } from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/runtimeConfig";
import { ComplianceBadge } from "@/components/ComplianceBadge";
import {
  systemColors,
  appleWebColors,
  tierColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";
import { getIngredientOGImage } from "@/lib/og-image";

// キャッシュ無効化（常に最新データを取得）
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  safetyScore?: number; // 安全性スコア（0-100）
  coverImage?: {
    asset: {
      url: string;
    };
  };
  sampleImageUrl?: string; // 関連商品の画像URL
}

// カテゴリーの表示順序（スキーマ準拠の7カテゴリ）
const categoryOrder = [
  "ビタミン",
  "ミネラル",
  "アミノ酸",
  "脂肪酸",
  "ハーブ",
  "プロバイオティクス",
  "その他",
];

async function getIngredients(): Promise<Ingredient[]> {
  const query = `*[_type == "ingredient"] | order(category asc, name asc){
    name,
    nameEn,
    slug,
    category,
    description,
    evidenceLevel,
    safetyScore,
    "coverImage": coverImage{
      "asset": asset->{
        url
      }
    },
    "sampleImageUrl": *[_type == "product" && availability == "in-stock" && references(^._id) && defined(externalImageUrl)][0].externalImageUrl
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

  // 動的にカテゴリーを抽出
  const uniqueCategories = Array.from(
    new Set(ingredients.map((ing) => ing.category).filter(Boolean)),
  );

  // カテゴリーを表示順序でソート（未定義のものは最後）
  const sortedCategories = uniqueCategories.sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  // カテゴリー別に成分を整理
  const ingredientsByCategory = sortedCategories.map((category) => ({
    category,
    ingredients: ingredients.filter((ing) => ing.category === category),
  }));

  // 構造化データの生成
  const siteUrl = getSiteUrl();
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "ホーム", url: `${siteUrl}/` },
    { name: "成分ガイド", url: `${siteUrl}/ingredients` },
  ]);

  const headersList = await headers();
  const nonce = headersList.get("x-nonce") || undefined;

  return (
    <>
      {/* JSON-LD構造化データ: Breadcrumb */}
      <script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      <div
        className="min-h-screen"
        style={{
          backgroundColor: appleWebColors.pageBackground,
          fontFamily: fontStack,
        }}
      >
        {/* パンくずリスト */}
        <div
          className={`border-b ${liquidGlassClasses.light}`}
          style={{ borderColor: appleWebColors.borderSubtle }}
        >
          <div className="mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-4 max-w-[1200px]">
            <nav
              className="flex items-center gap-2 text-[14px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              <Link
                href="/"
                className="hover:opacity-70 transition-opacity"
                style={{ color: appleWebColors.blue }}
              >
                ホーム
              </Link>
              <ChevronRight size={16} />
              <span
                className="font-medium"
                style={{ color: appleWebColors.textPrimary }}
              >
                成分ガイド
              </span>
            </nav>
          </div>
        </div>

        {/* ヒーローセクション */}
        <div
          style={{
            background: `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.indigo} 100%)`,
          }}
        >
          <div className="mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-16 max-w-[1200px]">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                >
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-[34px] md:text-[48px] font-bold text-white leading-tight tracking-[-0.015em]">
                  成分ガイド
                </h1>
              </div>
              <p
                className="text-[17px] md:text-[20px] mb-8 leading-relaxed"
                style={{ color: "rgba(255, 255, 255, 0.85)" }}
              >
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
        <div
          className={`border-b ${liquidGlassClasses.light}`}
          style={{ borderColor: appleWebColors.borderSubtle }}
        >
          <div className="mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-8 max-w-[1200px]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${systemColors.blue}15` }}
                >
                  <Pill style={{ color: systemColors.blue }} size={24} />
                </div>
                <div>
                  <div
                    className="text-[22px] font-bold"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    {ingredients.length}+
                  </div>
                  <div
                    className="text-[14px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    解説済み成分
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${systemColors.green}15` }}
                >
                  <Shield style={{ color: systemColors.green }} size={24} />
                </div>
                <div>
                  <div
                    className="text-[22px] font-bold"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    科学的根拠
                  </div>
                  <div
                    className="text-[14px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    エビデンスベースの情報
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${systemColors.indigo}15` }}
                >
                  <TrendingUp
                    style={{ color: systemColors.indigo }}
                    size={24}
                  />
                </div>
                <div>
                  <div
                    className="text-[22px] font-bold"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    定期更新
                  </div>
                  <div
                    className="text-[14px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    最新の研究を反映
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Info Banner */}
        <div
          className={`border-b ${liquidGlassClasses.light}`}
          style={{ borderColor: appleWebColors.borderSubtle }}
        >
          <div className="mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-4 max-w-[1200px]">
            <div
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-[16px] p-4 border"
              style={{
                backgroundColor: `${systemColors.green}08`,
                borderColor: `${systemColors.green}20`,
              }}
            >
              <div className="flex items-center gap-3">
                <ComplianceBadge variant="compact" />
                <p
                  className="text-[14px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  すべての成分情報は薬機法に準拠して解説されています
                </p>
              </div>
              <Link
                href="/why-suptia"
                className="text-[14px] font-medium whitespace-nowrap hover:opacity-70 transition-opacity"
                style={{ color: appleWebColors.blue }}
              >
                AI検索との違いを見る →
              </Link>
            </div>
          </div>
        </div>

        {/* カテゴリーナビゲーション（折りたたみ式） */}
        {sortedCategories.length > 0 && (
          <CategoryNav
            categories={sortedCategories.map((category) => ({
              name: category,
              count: ingredients.filter((ing) => ing.category === category)
                .length,
            }))}
          />
        )}

        {/* メインコンテンツ */}
        <div className="mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-12 max-w-[1200px]">
          {ingredients.length === 0 ? (
            <div className="text-center py-16">
              <p style={{ color: appleWebColors.textSecondary }}>
                成分データを読み込み中...
                <br />
                Sanity Studioで成分を追加してください。
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2
                  className="text-[28px] md:text-[32px] font-bold leading-tight tracking-[-0.015em] mb-2"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  カテゴリー別成分一覧
                </h2>
                <p
                  className="text-[15px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  気になる成分をクリックして、詳しい情報をご覧ください
                </p>
              </div>

              {/* カテゴリー別成分リスト */}
              <div className="space-y-12">
                {ingredientsByCategory.map(
                  ({ category, ingredients }) =>
                    ingredients.length > 0 && (
                      <section
                        key={category}
                        id={`category-${category}`}
                        className="scroll-mt-20"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{
                              backgroundColor: `${systemColors.blue}15`,
                            }}
                          >
                            <Filter
                              style={{ color: systemColors.blue }}
                              size={20}
                            />
                          </div>
                          <h3
                            className="text-[22px] font-bold"
                            style={{ color: appleWebColors.textPrimary }}
                          >
                            {category}
                          </h3>
                          <span
                            className="text-[13px] font-medium px-3 py-1 rounded-full"
                            style={{
                              backgroundColor: appleWebColors.sectionBackground,
                              color: appleWebColors.textSecondary,
                            }}
                          >
                            {ingredients.length}件
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                          {ingredients
                            .filter(
                              (ingredient) =>
                                ingredient.slug && ingredient.slug.current,
                            )
                            .map((ingredient) => (
                              <Link
                                key={ingredient.slug.current}
                                href={`/ingredients/${ingredient.slug.current}`}
                                className={`group rounded-[16px] overflow-hidden border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${liquidGlassClasses.light}`}
                                style={{
                                  borderColor: appleWebColors.borderSubtle,
                                }}
                              >
                                {/* アイキャッチ画像 */}
                                <div
                                  className="relative h-40 overflow-hidden"
                                  style={{
                                    backgroundColor: `${systemColors.blue}10`,
                                  }}
                                >
                                  <Image
                                    src={getIngredientOGImage(
                                      ingredient.slug.current,
                                    )}
                                    alt={ingredient.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  />
                                  {/* ランクバッジ - 画像上に表示 */}
                                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                                    {/* エビデンスランクバッジ */}
                                    {ingredient.evidenceLevel &&
                                      (() => {
                                        const level =
                                          ingredient.evidenceLevel as
                                            | "S"
                                            | "A"
                                            | "B"
                                            | "C"
                                            | "D";
                                        const tierColor = tierColors[level];
                                        if (!tierColor) return null;
                                        return (
                                          <div
                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-white shadow-sm"
                                            style={{ background: tierColor.bg }}
                                          >
                                            <BookOpen size={11} />
                                            <span className="text-[10px] font-bold">
                                              {level}
                                            </span>
                                          </div>
                                        );
                                      })()}

                                    {/* 安全性ランクバッジ */}
                                    {ingredient.safetyScore !== undefined &&
                                      (() => {
                                        const score = ingredient.safetyScore;
                                        const getSafetyRank = (
                                          score: number,
                                        ): "S" | "A" | "B" | "C" | "D" => {
                                          if (score >= 90) return "S";
                                          if (score >= 80) return "A";
                                          if (score >= 70) return "B";
                                          if (score >= 60) return "C";
                                          return "D";
                                        };
                                        const grade = getSafetyRank(score);
                                        const tierColor = tierColors[grade];
                                        return (
                                          <div
                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-white shadow-sm"
                                            style={{ background: tierColor.bg }}
                                          >
                                            <Shield size={11} />
                                            <span className="text-[10px] font-bold">
                                              {grade}
                                            </span>
                                          </div>
                                        );
                                      })()}
                                  </div>
                                </div>

                                {/* コンテンツ */}
                                <div className="p-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                      <h4
                                        className="text-[17px] font-semibold group-hover:opacity-70 transition-opacity mb-0.5"
                                        style={{
                                          color: appleWebColors.textPrimary,
                                        }}
                                      >
                                        {ingredient.name}
                                      </h4>
                                      <p
                                        className="text-[12px]"
                                        style={{
                                          color: appleWebColors.textTertiary,
                                        }}
                                      >
                                        {ingredient.nameEn}
                                      </p>
                                    </div>
                                    <ChevronRight
                                      className="group-hover:translate-x-1 transition-all flex-shrink-0 mt-1"
                                      size={18}
                                      style={{
                                        color: appleWebColors.textTertiary,
                                      }}
                                    />
                                  </div>

                                  <p
                                    className="text-[13px] line-clamp-2"
                                    style={{
                                      color: appleWebColors.textSecondary,
                                    }}
                                  >
                                    {ingredient.description}
                                  </p>
                                </div>
                              </Link>
                            ))}
                        </div>
                      </section>
                    ),
                )}
              </div>

              {/* 全成分アルファベット順（オプション） */}
              <section
                className="mt-16 pt-12 border-t"
                style={{ borderColor: appleWebColors.borderSubtle }}
              >
                <h3
                  className="text-[22px] font-bold mb-6"
                  style={{ color: appleWebColors.textPrimary }}
                >
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
                        className={`px-4 py-3 rounded-xl border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${liquidGlassClasses.light}`}
                        style={{ borderColor: appleWebColors.borderSubtle }}
                      >
                        <div
                          className="text-[15px] font-medium"
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          {ingredient.name}
                        </div>
                        <div
                          className="text-[12px]"
                          style={{ color: appleWebColors.textSecondary }}
                        >
                          {ingredient.nameEn}
                        </div>
                      </Link>
                    ))}
                </div>
              </section>
            </>
          )}

          {/* CTA */}
          <div
            className={`mt-16 p-8 rounded-[20px] border ${liquidGlassClasses.light}`}
            style={{
              background: `linear-gradient(135deg, ${systemColors.blue}08 0%, ${systemColors.green}08 100%)`,
              borderColor: appleWebColors.borderSubtle,
            }}
          >
            <div className="max-w-2xl mx-auto text-center">
              <h3
                className="text-[22px] font-bold mb-3"
                style={{ color: appleWebColors.textPrimary }}
              >
                あなたに最適なサプリメントを見つけよう
              </h3>
              <p
                className="text-[15px] mb-6"
                style={{ color: appleWebColors.textSecondary }}
              >
                成分の知識を活かして、科学的根拠に基づいたサプリメント選びを始めましょう
              </p>
              <Link
                href="/"
                className="inline-block px-8 py-4 rounded-full text-[15px] font-semibold text-white transition-all duration-300 min-h-[44px]"
                style={{ backgroundColor: systemColors.blue }}
              >
                サプリメントを探す
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
