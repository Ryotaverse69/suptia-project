/**
 * 記事一覧ページ - Apple HIG Design
 */

import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import {
  appleWebColors,
  systemColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";
import { getArticleOGImage } from "@/lib/og-image";
import { ArticleEyecatch } from "@/components/articles/ArticleEyecatch";

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
  {
    slug: "vitamin-d-comparison",
    title:
      "【2025年最新】ビタミンDサプリおすすめ比較｜吸収率・安全性で徹底分析",
    description:
      "ビタミンDサプリをD2/D3の違い・吸収率・安全性・コスパで徹底比較。日本人の8割が不足と言われるビタミンD、最適な選び方を解説。",
    category: "ビタミン",
    categoryColor: systemColors.yellow,
    publishedAt: "2025-01-18",
    readTime: "5分",
    featured: false,
    tags: ["ビタミンD", "D3", "骨", "免疫"],
  },
  {
    slug: "protein-comparison",
    title:
      "【2025年最新】プロテインおすすめ比較｜種類・コスパ・目的別で徹底分析",
    description:
      "プロテインをホエイ・カゼイン・ソイなど種類別に比較。WPC/WPI/WPHの違い、目的別の選び方、コスパランキングを解説。",
    category: "アミノ酸・タンパク質",
    categoryColor: systemColors.blue,
    publishedAt: "2025-01-19",
    readTime: "7分",
    featured: false,
    tags: ["プロテイン", "ホエイ", "WPC", "WPI", "筋トレ"],
  },
  {
    slug: "omega3-comparison",
    title:
      "【2025年最新】オメガ3（フィッシュオイル）おすすめ比較｜EPA・DHA含有量で徹底分析",
    description:
      "オメガ3サプリをEPA/DHA比率・純度・酸化防止で徹底比較。魚油・クリルオイル・藻類由来の違い、効果的な選び方を解説。",
    category: "脂肪酸",
    categoryColor: systemColors.cyan,
    publishedAt: "2025-01-19",
    readTime: "6分",
    featured: false,
    tags: ["オメガ3", "EPA", "DHA", "フィッシュオイル"],
  },
  {
    slug: "magnesium-comparison",
    title:
      "【2025年最新】マグネシウムサプリおすすめ比較｜形態別の吸収率で徹底分析",
    description:
      "マグネシウムサプリを形態（グリシン酸・クエン酸・酸化物）別に比較。吸収率・目的別の選び方・副作用を解説。",
    category: "ミネラル",
    categoryColor: systemColors.purple,
    publishedAt: "2025-01-19",
    readTime: "6分",
    featured: false,
    tags: ["マグネシウム", "グリシン酸", "睡眠", "筋肉"],
  },
  {
    slug: "iron-comparison",
    title:
      "【2025年最新】鉄分サプリおすすめ比較｜ヘム鉄・非ヘム鉄・キレート鉄の違い",
    description:
      "鉄分サプリをヘム鉄・非ヘム鉄・キレート鉄で比較。吸収率・副作用・コスパを徹底分析。女性・妊婦・アスリート向けの選び方。",
    category: "ミネラル",
    categoryColor: systemColors.red,
    publishedAt: "2025-01-19",
    readTime: "6分",
    featured: false,
    tags: ["鉄分", "ヘム鉄", "貧血", "女性"],
  },
  {
    slug: "zinc-comparison",
    title:
      "【2025年最新】亜鉛サプリおすすめ比較｜形態別の吸収率・効果で徹底分析",
    description:
      "亜鉛サプリをピコリン酸・グルコン酸・クエン酸など形態別に比較。免疫・男性機能・味覚への効果と選び方を解説。",
    category: "ミネラル",
    categoryColor: systemColors.indigo,
    publishedAt: "2025-01-19",
    readTime: "6分",
    featured: false,
    tags: ["亜鉛", "ピコリン酸亜鉛", "免疫", "男性機能"],
  },
  {
    slug: "vitamin-b-comparison",
    title:
      "【2025年最新】ビタミンB群サプリおすすめ比較｜8種のBビタミンを徹底分析",
    description:
      "ビタミンB群サプリをB1・B2・B6・B12・葉酸など8種の含有量で比較。疲労回復・代謝サポート・美容への効果と選び方を解説。",
    category: "ビタミン",
    categoryColor: systemColors.yellow,
    publishedAt: "2025-01-19",
    readTime: "7分",
    featured: false,
    tags: ["ビタミンB", "B12", "葉酸", "疲労回復"],
  },
  {
    slug: "collagen-comparison",
    title:
      "【2025年最新】コラーゲンサプリおすすめ比較｜種類・原料・吸収率で徹底分析",
    description:
      "コラーゲンサプリをI型・II型・III型、魚由来・豚由来・ペプチドなど形態別に比較。美肌・関節・髪への効果と選び方を解説。",
    category: "アミノ酸・タンパク質",
    categoryColor: systemColors.pink,
    publishedAt: "2025-01-19",
    readTime: "6分",
    featured: false,
    tags: ["コラーゲン", "ペプチド", "美肌", "関節"],
  },
  {
    slug: "probiotics-comparison",
    title:
      "【2025年最新】乳酸菌・プロバイオティクスおすすめ比較｜菌株・CFU数で徹底分析",
    description:
      "乳酸菌サプリをラクトバチルス・ビフィズス菌など菌株別に比較。腸内環境・免疫・メンタルへの効果と選び方を解説。",
    category: "プロバイオティクス",
    categoryColor: systemColors.green,
    publishedAt: "2025-01-19",
    readTime: "6分",
    featured: false,
    tags: ["乳酸菌", "プロバイオティクス", "腸内環境", "免疫"],
  },
  {
    slug: "nmn-comparison",
    title:
      "【2025年最新】NMNサプリおすすめ比較｜純度・吸収率・コスパで徹底分析",
    description:
      "NMNサプリを純度・製法・吸収率・コスパで徹底比較。エイジングケア・NAD+産生への効果と選び方を解説。",
    category: "エイジングケア",
    categoryColor: systemColors.purple,
    publishedAt: "2025-01-19",
    readTime: "6分",
    featured: false,
    tags: ["NMN", "NAD+", "エイジングケア", "長寿"],
  },
  {
    slug: "ashwagandha-comparison",
    title:
      "【2025年最新】アシュワガンダおすすめ比較｜KSM-66・Sensoril等の規格で徹底分析",
    description:
      "アシュワガンダをKSM-66®・Sensoril®・Shoden®など規格別に比較。ストレス軽減・睡眠改善・筋力への効果と選び方を解説。",
    category: "ハーブ・アダプトゲン",
    categoryColor: systemColors.teal,
    publishedAt: "2025-01-19",
    readTime: "6分",
    featured: false,
    tags: ["アシュワガンダ", "KSM-66", "ストレス", "アダプトゲン"],
  },
  {
    slug: "creatine-comparison",
    title: "【2025年最新】クレアチンおすすめ比較｜形態・純度・コスパで徹底分析",
    description:
      "クレアチンをモノハイドレート・HCl・バッファードなど形態別に比較。筋力向上・パフォーマンス・認知機能への効果と選び方を解説。",
    category: "スポーツ",
    categoryColor: systemColors.red,
    publishedAt: "2025-01-19",
    readTime: "6分",
    featured: false,
    tags: ["クレアチン", "モノハイドレート", "筋トレ", "パフォーマンス"],
  },
  {
    slug: "mct-oil-comparison",
    title:
      "【2025年最新】MCTオイルおすすめ比較｜C8・C10比率とケトン体生成効率で徹底分析",
    description:
      "MCTオイルをC8/C10比率・原料・品質で徹底比較。ケトジェニックダイエット、認知機能、エネルギー補給に最適な選び方を解説。",
    category: "脂肪酸",
    categoryColor: systemColors.green,
    publishedAt: "2025-01-19",
    readTime: "6分",
    featured: false,
    tags: ["MCTオイル", "C8", "ケトン体", "ダイエット"],
  },
];

export default function ArticlesPage() {
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
        {/* 記事一覧 */}
        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-5">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className={`${liquidGlassClasses.light} rounded-[20px] overflow-hidden block border transition-all hover:shadow-lg hover:-translate-y-1`}
                style={{ borderColor: appleWebColors.borderSubtle }}
              >
                {/* アイキャッチ画像 */}
                <div className="w-full aspect-[1.91/1]">
                  <ArticleEyecatch
                    src={getArticleOGImage(article.slug)}
                    alt={article.title}
                    size="medium"
                  />
                </div>

                {/* コンテンツ */}
                <div className="p-5">
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
                </div>
              </Link>
            ))}
          </div>
        </section>

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
