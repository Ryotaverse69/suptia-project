/**
 * 記事一覧ページ - Apple HIG Design
 */

import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, TrendingUp, Clock } from "lucide-react";
import {
  appleWebColors,
  systemColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

export const metadata: Metadata = {
  title: "サプリメント比較記事｜科学的根拠に基づく選び方ガイド - サプティア",
  description:
    "サプリメントの比較記事・選び方ガイドを掲載。ビタミン、ミネラル、プロテインなど成分別の比較や、コスパランキング、安全性評価など科学的根拠に基づいた情報をお届けします。",
  keywords: [
    "サプリメント",
    "比較",
    "記事",
    "選び方",
    "おすすめ",
    "ランキング",
    "コスパ",
  ],
  openGraph: {
    title: "サプリメント比較記事 - サプティア",
    description: "科学的根拠に基づくサプリメント比較記事・選び方ガイド",
    type: "website",
    url: "https://suptia.com/articles",
  },
  alternates: {
    canonical: "https://suptia.com/articles",
  },
};

// 記事データ
const articles = [
  {
    slug: "vitamin-c-comparison",
    title: "【2025年最新】ビタミンCサプリおすすめ比較｜コスパ・品質で徹底分析",
    description:
      "ビタミンCサプリメントを価格・成分量・コスパ・安全性で徹底比較。mg単価から見た本当のコスパランキング。",
    category: "ビタミン",
    categoryColor: systemColors.orange,
    publishedAt: "2025-01-15",
    readTime: "5分",
    featured: true,
    tags: ["ビタミンC", "比較", "コスパ"],
  },
  // 今後追加する記事
  // {
  //   slug: "vitamin-d-comparison",
  //   title: "【2025年】ビタミンDサプリ比較｜吸収率・価格で選ぶおすすめ",
  //   description: "ビタミンDサプリを吸収率、価格、安全性で比較。日本人に不足しがちなビタミンDの効果的な摂取方法も解説。",
  //   category: "ビタミン",
  //   categoryColor: systemColors.yellow,
  //   publishedAt: "2025-01-20",
  //   readTime: "5分",
  //   featured: false,
  //   tags: ["ビタミンD", "比較", "骨"],
  // },
];

export default function ArticlesPage() {
  const featuredArticle = articles.find((a) => a.featured);
  const otherArticles = articles.filter((a) => !a.featured);

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
      {/* ヘッダー */}
      <section className="pt-16 pb-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              backgroundColor: systemColors.blue + "15",
              color: systemColors.blue,
            }}
          >
            <BookOpen size={16} />
            <span className="text-[14px] font-medium">比較記事</span>
          </div>

          <h1
            className="text-[32px] md:text-[48px] font-bold leading-[1.1] tracking-[-0.02em] mb-4"
            style={{ color: appleWebColors.textPrimary }}
          >
            サプリメント比較記事
          </h1>

          <p
            className="text-[17px] md:text-[19px] leading-[1.5] max-w-2xl mx-auto"
            style={{ color: appleWebColors.textSecondary }}
          >
            科学的根拠に基づいた比較・分析で、
            <br className="hidden md:block" />
            最適なサプリメント選びをサポートします。
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        {/* 注目記事 */}
        {featuredArticle && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={20} style={{ color: systemColors.orange }} />
              <h2
                className="text-[20px] font-bold"
                style={{ color: appleWebColors.textPrimary }}
              >
                注目の記事
              </h2>
            </div>

            <Link
              href={`/articles/${featuredArticle.slug}`}
              className={`${liquidGlassClasses.light} rounded-[24px] p-6 md:p-8 block border transition-all hover:shadow-xl hover:-translate-y-1`}
              style={{ borderColor: appleWebColors.borderSubtle }}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* アイコン */}
                <div
                  className="w-20 h-20 md:w-24 md:h-24 rounded-[20px] flex items-center justify-center shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${systemColors.orange}, ${systemColors.yellow})`,
                  }}
                >
                  <span className="text-4xl md:text-5xl">🍊</span>
                </div>

                {/* コンテンツ */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="px-3 py-1 text-[12px] font-medium rounded-full"
                      style={{
                        backgroundColor: featuredArticle.categoryColor + "15",
                        color: featuredArticle.categoryColor,
                      }}
                    >
                      {featuredArticle.category}
                    </span>
                    <span
                      className="flex items-center gap-1 text-[12px]"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      <Clock size={12} />
                      {featuredArticle.readTime}
                    </span>
                  </div>

                  <h3
                    className="text-[20px] md:text-[24px] font-bold leading-[1.3] mb-2"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    {featuredArticle.title}
                  </h3>

                  <p
                    className="text-[15px] leading-[1.6] mb-4"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    {featuredArticle.description}
                  </p>

                  <div className="flex items-center gap-2">
                    <span
                      className="font-medium text-[15px]"
                      style={{ color: systemColors.blue }}
                    >
                      記事を読む
                    </span>
                    <ArrowRight
                      size={16}
                      style={{ color: systemColors.blue }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* その他の記事 */}
        {otherArticles.length > 0 && (
          <section className="mb-12">
            <h2
              className="text-[20px] font-bold mb-6"
              style={{ color: appleWebColors.textPrimary }}
            >
              すべての記事
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {otherArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className={`${liquidGlassClasses.light} rounded-[20px] p-5 block border transition-all hover:shadow-lg hover:-translate-y-0.5`}
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="px-3 py-1 text-[12px] font-medium rounded-full"
                      style={{
                        backgroundColor: article.categoryColor + "15",
                        color: article.categoryColor,
                      }}
                    >
                      {article.category}
                    </span>
                    <span
                      className="flex items-center gap-1 text-[12px]"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      <Clock size={12} />
                      {article.readTime}
                    </span>
                  </div>

                  <h3
                    className="text-[17px] font-bold leading-[1.3] mb-2"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    {article.title}
                  </h3>

                  <p
                    className="text-[14px] leading-[1.5] line-clamp-2"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    {article.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 記事がまだ少ない場合の説明 */}
        {articles.length < 3 && (
          <section
            className={`${liquidGlassClasses.light} rounded-[20px] p-8 text-center border`}
            style={{ borderColor: appleWebColors.borderSubtle }}
          >
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: systemColors.blue + "15" }}
            >
              <BookOpen size={28} style={{ color: systemColors.blue }} />
            </div>
            <h3
              className="text-[20px] font-bold mb-2"
              style={{ color: appleWebColors.textPrimary }}
            >
              新しい記事を準備中
            </h3>
            <p
              className="text-[15px] mb-6"
              style={{ color: appleWebColors.textSecondary }}
            >
              ビタミンD、プロテイン、オメガ3など
              <br />
              様々な成分の比較記事を順次公開予定です。
            </p>
            <Link
              href="/ingredients"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-[12px] font-medium text-white"
              style={{ backgroundColor: systemColors.blue }}
            >
              成分ガイドを見る
              <ArrowRight size={16} />
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
