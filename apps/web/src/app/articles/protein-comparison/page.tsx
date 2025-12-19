/**
 * プロテイン比較記事ページ
 * SEO最適化された比較コンテンツ - 顧客目線で価値ある情報を提供
 */

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { sanity } from "@/lib/sanity.client";
import { calculateEffectiveCostPerDay } from "@/lib/cost";
import {
  ArrowRight,
  Award,
  Shield,
  TrendingUp,
  DollarSign,
  FlaskConical,
  CheckCircle2,
  ExternalLink,
  Calculator,
  AlertTriangle,
  Lightbulb,
  Target,
  Clock,
  Zap,
  Heart,
  Dumbbell,
  Scale,
  BadgeCheck,
  XCircle,
  Info,
} from "lucide-react";
import {
  appleWebColors,
  systemColors,
  fontStack,
  liquidGlassClasses,
  typography,
} from "@/lib/design-system";
import { getArticleOGImage, generateOGImageMeta } from "@/lib/og-image";
import { ArticleEyecatch } from "@/components/articles/ArticleEyecatch";

export const revalidate = 86400; // 24時間キャッシュ

const ARTICLE_DATA = {
  title: "【2025年最新】プロテインおすすめ比較｜種類・コスパ・目的別で徹底分析",
  description:
    "プロテインをホエイ・カゼイン・ソイなど種類別に比較。WPC/WPI/WPHの違い、目的別の選び方、コスパランキングを解説。",
  publishedAt: "2025-01-19",
  updatedAt: new Date().toISOString().split("T")[0],
  ingredientName: "プロテイン",
  ingredientSlug: "protein",
};

// OGP画像を取得
const ogImageUrl = getArticleOGImage("protein-comparison");
const ogImage = generateOGImageMeta(ogImageUrl, "プロテイン比較 - Suptia");

export const metadata: Metadata = {
  title: ARTICLE_DATA.title,
  description: ARTICLE_DATA.description,
  keywords: [
    "プロテイン",
    "おすすめ",
    "比較",
    "ホエイ",
    "カゼイン",
    "ソイ",
    "WPC",
    "WPI",
    "2025",
    "ランキング",
    "筋トレ",
    "ダイエット",
  ],
  openGraph: {
    title: ARTICLE_DATA.title,
    description: ARTICLE_DATA.description,
    type: "article",
    publishedTime: ARTICLE_DATA.publishedAt,
    modifiedTime: ARTICLE_DATA.updatedAt,
    url: "https://suptia.com/articles/protein-comparison",
    siteName: "サプティア",
    locale: "ja_JP",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: ARTICLE_DATA.title,
    description: ARTICLE_DATA.description,
    images: [ogImageUrl],
  },
  alternates: {
    canonical: "https://suptia.com/articles/protein-comparison",
  },
};

interface Product {
  _id: string;
  name: string;
  priceJPY: number;
  servingsPerContainer: number;
  servingsPerDay: number;
  externalImageUrl?: string;
  slug: { current: string };
  source?: string;
  tierRatings?: {
    priceRank?: string;
    costEffectivenessRank?: string;
    overallRank?: string;
  };
  badges?: string[];
  ingredients?: Array<{
    amountMgPerServing: number;
    ingredient?: { name: string };
  }>;
}

async function getProteinProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && availability == "in-stock" && (name match "プロテイン*" || name match "*protein*" || name match "*Protein*")] | order(priceJPY asc)[0...20]{
    _id,
    name,
    priceJPY,
    servingsPerContainer,
    servingsPerDay,
    externalImageUrl,
    slug,
    source,
    tierRatings,
    badges,
    ingredients[]{
      amountMgPerServing,
      ingredient->{ name }
    }
  }`;

  try {
    const products = await sanity.fetch(query);
    return products || [];
  } catch (error) {
    console.error("Failed to fetch protein products:", error);
    return [];
  }
}

// プロテインの種類データ
const PROTEIN_TYPES = [
  {
    name: "ホエイプロテイン（WPC）",
    nameEn: "Whey Protein Concentrate",
    absorption: "◎ 速い",
    price: "◎ 安い",
    proteinContent: "70-80%",
    best: "コスパ重視・初心者",
    description: "最も一般的なプロテイン。乳糖を含むため、お腹が弱い人は注意。",
    color: systemColors.blue,
  },
  {
    name: "ホエイプロテイン（WPI）",
    nameEn: "Whey Protein Isolate",
    absorption: "◎ 速い",
    price: "○ やや高め",
    proteinContent: "90%以上",
    best: "乳糖不耐症・減量中",
    description: "乳糖・脂肪を除去。お腹に優しく、タンパク質含有率が高い。",
    color: systemColors.cyan,
  },
  {
    name: "ホエイプロテイン（WPH）",
    nameEn: "Whey Protein Hydrolysate",
    absorption: "◎◎ 最速",
    price: "△ 高い",
    proteinContent: "90%以上",
    best: "トレーニング直後重視",
    description: "加水分解済みで消化吸収が最も速い。胃腸への負担も最小限。",
    color: systemColors.purple,
  },
  {
    name: "カゼインプロテイン",
    nameEn: "Casein Protein",
    absorption: "△ ゆっくり",
    price: "○ 中程度",
    proteinContent: "80-85%",
    best: "就寝前・長時間の栄養補給",
    description: "6-8時間かけてゆっくり吸収。就寝前や間食に最適。",
    color: systemColors.indigo,
  },
  {
    name: "ソイプロテイン",
    nameEn: "Soy Protein",
    absorption: "○ 普通",
    price: "◎ 安い",
    proteinContent: "80-90%",
    best: "植物性希望・女性",
    description: "大豆由来でイソフラボン含有。ヴィーガン対応。吸収は中程度。",
    color: systemColors.green,
  },
  {
    name: "ピープロテイン",
    nameEn: "Pea Protein",
    absorption: "○ 普通",
    price: "○ 中程度",
    proteinContent: "80-85%",
    best: "アレルギー対応・環境配慮",
    description: "えんどう豆由来。アレルゲンフリーで消化に優しい。",
    color: systemColors.mint,
  },
];

// 目的別おすすめ
const PURPOSE_RECOMMENDATIONS = [
  {
    purpose: "筋肥大・バルクアップ",
    icon: Dumbbell,
    recommended: "WPC または WPI",
    timing: "トレーニング後30分以内",
    amount: "体重×1.6-2.2g/日",
    tips: "糖質と一緒に摂ると吸収率UP。トレーニング後のゴールデンタイムを逃さない。",
    color: systemColors.orange,
  },
  {
    purpose: "ダイエット・減量",
    icon: Scale,
    recommended: "WPI または ソイ",
    timing: "食事の置き換え・間食",
    amount: "体重×1.2-1.6g/日",
    tips: "低脂肪・低糖質のWPIか、腹持ちの良いソイがおすすめ。",
    color: systemColors.green,
  },
  {
    purpose: "健康維持・美容",
    icon: Heart,
    recommended: "ソイ または コラーゲン配合",
    timing: "朝食時・就寝前",
    amount: "体重×1.0-1.2g/日",
    tips: "イソフラボンやコラーゲンで美容効果も。継続しやすい味を選ぶ。",
    color: systemColors.pink,
  },
  {
    purpose: "持久系スポーツ",
    icon: Zap,
    recommended: "WPC + カゼイン",
    timing: "運動前後・就寝前",
    amount: "体重×1.4-1.8g/日",
    tips: "即効性と持続性のバランス。長時間の運動には持続型を。",
    color: systemColors.cyan,
  },
];

// 選び方チェックリスト
const SELECTION_CHECKLIST = [
  {
    category: "タンパク質含有率",
    items: [
      "1食あたりのタンパク質量を確認（20g以上が目安）",
      "タンパク質含有率80%以上が高品質の証",
      "100gあたりの価格で比較するとコスパが分かりやすい",
    ],
  },
  {
    category: "原材料・品質",
    items: [
      "人工甘味料の有無（アセスルファムK、スクラロースなど）",
      "グラスフェッド（牧草飼育）かどうか",
      "第三者機関の認証（Informed Sport等）",
    ],
  },
  {
    category: "目的との相性",
    items: [
      "筋トレ後：吸収の速いホエイ",
      "就寝前：ゆっくり吸収のカゼイン",
      "減量中：低脂肪・低糖質のWPI",
    ],
  },
  {
    category: "続けやすさ",
    items: [
      "味のバリエーション（飽きない工夫）",
      "溶けやすさ（ダマにならないか）",
      "1kgあたりの価格と月額コスト",
    ],
  },
];

// 摂取量ガイド
const DOSAGE_GUIDE = {
  recommended: "体重1kgあたり1.2-2.2g（目的による）",
  timing: "トレーニング後30分以内が最も効果的",
  frequency: "1日2-3回に分けて摂取",
  notes: [
    "一度に吸収できるのは約30-40g程度",
    "食事からのタンパク質も含めて計算",
    "腎臓に問題がある方は医師に相談",
  ],
};

// 注意点・副作用
const CAUTIONS = [
  {
    title: "過剰摂取に注意",
    description:
      "タンパク質の過剰摂取は腎臓に負担。体重×2.2g/日を超えないように。",
    severity: "medium",
  },
  {
    title: "乳糖不耐症",
    description: "WPCは乳糖を含むため、お腹がゆるくなる場合はWPIを選択。",
    severity: "low",
  },
  {
    title: "アレルギー",
    description:
      "乳製品・大豆アレルギーの方は原材料を確認。ピープロテインが代替になる。",
    severity: "high",
  },
  {
    title: "人工甘味料",
    description:
      "長期摂取の影響を懸念する場合はノンフレーバーや天然甘味料使用を選択。",
    severity: "low",
  },
];

// FAQ
const FAQS = [
  {
    question: "プロテインを飲むと太りますか？",
    answer:
      "プロテイン自体は低カロリー（1杯約100-120kcal）で、太る原因にはなりません。ただし、総摂取カロリーが消費カロリーを上回れば体重は増えます。プロテインを飲む分、他の食事を調整することが大切です。",
  },
  {
    question: "女性がプロテインを飲んでもムキムキになりませんか？",
    answer:
      "女性は男性ホルモンが少ないため、プロテインを飲むだけでムキムキにはなりません。むしろ、適度なタンパク質摂取は引き締まった体づくりや美肌・美髪に効果的です。",
  },
  {
    question: "WPCとWPIどちらを選ぶべき？",
    answer:
      "コスパ重視ならWPC、お腹が弱い方や減量中はWPIがおすすめ。WPIは乳糖がほぼ除去されているため、牛乳でお腹がゴロゴロする方でも安心です。",
  },
  {
    question: "プロテインの賞味期限と保存方法は？",
    answer:
      "未開封で1-2年、開封後は2-3ヶ月が目安です。高温多湿を避け、密閉して保存。湿気を吸うと品質が劣化するため、乾燥剤を入れるのもおすすめです。",
  },
  {
    question: "運動しない日もプロテインは必要？",
    answer:
      "筋肉の回復・維持には運動しない日もタンパク質が必要です。ただし、運動量に応じて摂取量を調整（運動日より少なめ）するのが理想的です。",
  },
];

export default async function ProteinComparisonPage() {
  const products = await getProteinProducts();

  // 構造化データ
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: ARTICLE_DATA.title,
    description: ARTICLE_DATA.description,
    datePublished: ARTICLE_DATA.publishedAt,
    dateModified: ARTICLE_DATA.updatedAt,
    author: {
      "@type": "Organization",
      name: "サプティア編集部",
      url: "https://suptia.com",
    },
    publisher: {
      "@type": "Organization",
      name: "サプティア",
      logo: {
        "@type": "ImageObject",
        url: "https://suptia.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://suptia.com/articles/protein-comparison",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />

      <main
        className="min-h-screen"
        style={{
          backgroundColor: appleWebColors.pageBackground,
          fontFamily: fontStack,
        }}
      >
        {/* ヒーローセクション */}
        <section
          className="relative py-16 md:py-24"
          style={{
            background: `linear-gradient(135deg, ${systemColors.blue}08 0%, ${systemColors.purple}08 100%)`,
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {/* パンくず */}
            <nav className="mb-8">
              <ol
                className="flex items-center gap-2 text-[14px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                <li>
                  <Link
                    href="/"
                    className="hover:opacity-70 transition-opacity"
                    style={{ color: systemColors.blue }}
                  >
                    ホーム
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link
                    href="/articles"
                    className="hover:opacity-70 transition-opacity"
                    style={{ color: systemColors.blue }}
                  >
                    記事
                  </Link>
                </li>
                <li>/</li>
                <li style={{ color: appleWebColors.textPrimary }}>
                  プロテイン比較
                </li>
              </ol>
            </nav>

            {/* アイキャッチ画像 */}
            <div className="mb-8">
              <ArticleEyecatch
                src={ogImageUrl}
                alt={ARTICLE_DATA.title}
                size="large"
              />
            </div>

            {/* タイトル */}
            <div className="text-center">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{
                  backgroundColor: systemColors.blue + "15",
                  color: systemColors.blue,
                }}
              >
                <Dumbbell size={16} />
                <span className="text-[14px] font-medium">プロテイン比較</span>
              </div>

              <h1
                className={`${typography.title1} md:text-[40px] mb-4`}
                style={{ color: appleWebColors.textPrimary }}
              >
                {ARTICLE_DATA.title}
              </h1>

              <p
                className={`${typography.body} max-w-2xl mx-auto mb-6`}
                style={{ color: appleWebColors.textSecondary }}
              >
                {ARTICLE_DATA.description}
              </p>

              <div
                className={`flex items-center justify-center gap-4 ${typography.footnote}`}
                style={{ color: appleWebColors.textTertiary }}
              >
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {ARTICLE_DATA.publishedAt}
                </span>
                <span>·</span>
                <span>読了時間: 7分</span>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          {/* 目次 */}
          <nav
            className={`${liquidGlassClasses.light} rounded-[20px] p-6 mb-12 border`}
            style={{ borderColor: appleWebColors.borderSubtle }}
          >
            <h2
              className={`${typography.title3} mb-4`}
              style={{ color: appleWebColors.textPrimary }}
            >
              目次
            </h2>
            <ol
              className="space-y-2 text-[15px]"
              style={{ color: systemColors.blue }}
            >
              <li>
                <a href="#types" className="hover:opacity-70">
                  1. プロテインの種類と特徴
                </a>
              </li>
              <li>
                <a href="#purpose" className="hover:opacity-70">
                  2. 目的別おすすめプロテイン
                </a>
              </li>
              <li>
                <a href="#products" className="hover:opacity-70">
                  3. おすすめ商品ランキング
                </a>
              </li>
              <li>
                <a href="#checklist" className="hover:opacity-70">
                  4. 選び方チェックリスト
                </a>
              </li>
              <li>
                <a href="#dosage" className="hover:opacity-70">
                  5. 摂取量・タイミング
                </a>
              </li>
              <li>
                <a href="#cautions" className="hover:opacity-70">
                  6. 注意点・副作用
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:opacity-70">
                  7. よくある質問
                </a>
              </li>
            </ol>
          </nav>

          {/* セクション1: 種類と特徴 */}
          <section id="types" className="mb-16 scroll-mt-8">
            <h2
              className={`${typography.title2} mb-6`}
              style={{ color: appleWebColors.textPrimary }}
            >
              <FlaskConical
                className="inline mr-2"
                size={24}
                style={{ color: systemColors.blue }}
              />
              プロテインの種類と特徴
            </h2>

            <p
              className={`${typography.body} mb-8`}
              style={{ color: appleWebColors.textSecondary }}
            >
              プロテインは原料や製法によって特性が異なります。
              目的や体質に合わせて最適な種類を選びましょう。
            </p>

            <div className="grid gap-4">
              {PROTEIN_TYPES.map((type) => (
                <div
                  key={type.name}
                  className={`${liquidGlassClasses.light} rounded-[16px] p-5 border`}
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <h3
                        className="text-[17px] font-semibold mb-1"
                        style={{ color: type.color }}
                      >
                        {type.name}
                      </h3>
                      <p
                        className="text-[13px] mb-2"
                        style={{ color: appleWebColors.textTertiary }}
                      >
                        {type.nameEn}
                      </p>
                      <p
                        className="text-[14px]"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        {type.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      <span
                        className="px-3 py-1 rounded-full text-[12px] font-medium"
                        style={{
                          backgroundColor: systemColors.cyan + "15",
                          color: systemColors.cyan,
                        }}
                      >
                        吸収: {type.absorption}
                      </span>
                      <span
                        className="px-3 py-1 rounded-full text-[12px] font-medium"
                        style={{
                          backgroundColor: systemColors.green + "15",
                          color: systemColors.green,
                        }}
                      >
                        価格: {type.price}
                      </span>
                      <span
                        className="px-3 py-1 rounded-full text-[12px] font-medium"
                        style={{
                          backgroundColor: systemColors.purple + "15",
                          color: systemColors.purple,
                        }}
                      >
                        含有率: {type.proteinContent}
                      </span>
                    </div>
                  </div>
                  <div
                    className="mt-3 pt-3 border-t"
                    style={{ borderColor: appleWebColors.borderSubtle }}
                  >
                    <span
                      className="text-[13px]"
                      style={{ color: appleWebColors.textTertiary }}
                    >
                      おすすめ:
                    </span>
                    <span
                      className="text-[13px] font-medium ml-1"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {type.best}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* セクション2: 目的別おすすめ */}
          <section id="purpose" className="mb-16 scroll-mt-8">
            <h2
              className={`${typography.title2} mb-6`}
              style={{ color: appleWebColors.textPrimary }}
            >
              <Target
                className="inline mr-2"
                size={24}
                style={{ color: systemColors.orange }}
              />
              目的別おすすめプロテイン
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {PURPOSE_RECOMMENDATIONS.map((rec) => (
                <div
                  key={rec.purpose}
                  className={`${liquidGlassClasses.light} rounded-[16px] p-5 border`}
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: rec.color + "15" }}
                    >
                      <rec.icon size={20} style={{ color: rec.color }} />
                    </div>
                    <h3
                      className="text-[17px] font-semibold"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {rec.purpose}
                    </h3>
                  </div>

                  <div className="space-y-2 text-[14px]">
                    <div
                      className="flex justify-between"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      <span>おすすめ種類</span>
                      <span
                        className="font-medium"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {rec.recommended}
                      </span>
                    </div>
                    <div
                      className="flex justify-between"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      <span>摂取タイミング</span>
                      <span
                        className="font-medium"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {rec.timing}
                      </span>
                    </div>
                    <div
                      className="flex justify-between"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      <span>目安摂取量</span>
                      <span
                        className="font-medium"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {rec.amount}
                      </span>
                    </div>
                  </div>

                  <div
                    className="mt-4 pt-3 border-t flex items-start gap-2"
                    style={{ borderColor: appleWebColors.borderSubtle }}
                  >
                    <Lightbulb
                      size={14}
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: systemColors.yellow }}
                    />
                    <p
                      className="text-[13px]"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      {rec.tips}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* セクション3: 商品ランキング */}
          <section id="products" className="mb-16 scroll-mt-8">
            <h2
              className={`${typography.title2} mb-6`}
              style={{ color: appleWebColors.textPrimary }}
            >
              <Award
                className="inline mr-2"
                size={24}
                style={{ color: systemColors.yellow }}
              />
              おすすめ商品ランキング
            </h2>

            {products.length > 0 ? (
              <div className="space-y-4">
                {products.slice(0, 10).map((product, index) => (
                  <div
                    key={product._id}
                    className={`${liquidGlassClasses.light} rounded-[16px] p-5 border`}
                    style={{ borderColor: appleWebColors.borderSubtle }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white flex-shrink-0"
                        style={{
                          backgroundColor:
                            index === 0
                              ? systemColors.yellow
                              : index === 1
                                ? "#94a3b8"
                                : index === 2
                                  ? "#cd7f32"
                                  : systemColors.blue,
                        }}
                      >
                        {index + 1}
                      </div>

                      {product.externalImageUrl && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image
                            src={product.externalImageUrl}
                            alt={product.name}
                            width={64}
                            height={64}
                            className="object-contain w-full h-full"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-[15px] font-semibold mb-1 line-clamp-2"
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          {product.name}
                        </h3>
                        <div
                          className="flex flex-wrap items-center gap-3 text-[13px]"
                          style={{ color: appleWebColors.textSecondary }}
                        >
                          <span className="font-medium">
                            ¥{product.priceJPY?.toLocaleString()}
                          </span>
                          {product.servingsPerContainer &&
                            product.servingsPerDay && (
                              <span>
                                1日あたり ¥
                                {Math.round(
                                  calculateEffectiveCostPerDay({
                                    priceJPY: product.priceJPY,
                                    servingsPerContainer:
                                      product.servingsPerContainer,
                                    servingsPerDay: product.servingsPerDay,
                                  }),
                                )}
                              </span>
                            )}
                        </div>
                      </div>

                      <Link
                        href={`/products/${product.slug?.current}`}
                        className="px-4 py-2 rounded-lg text-[13px] font-medium text-white flex-shrink-0"
                        style={{ backgroundColor: systemColors.blue }}
                      >
                        詳細
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`${liquidGlassClasses.light} rounded-[16px] p-8 text-center border`}
                style={{ borderColor: appleWebColors.borderSubtle }}
              >
                <p style={{ color: appleWebColors.textSecondary }}>
                  商品データを読み込み中...
                </p>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link
                href="/search?ingredient=protein"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[15px] font-medium text-white"
                style={{ backgroundColor: systemColors.blue }}
              >
                すべてのプロテインを見る
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>

          {/* セクション4: 選び方チェックリスト */}
          <section id="checklist" className="mb-16 scroll-mt-8">
            <h2
              className={`${typography.title2} mb-6`}
              style={{ color: appleWebColors.textPrimary }}
            >
              <CheckCircle2
                className="inline mr-2"
                size={24}
                style={{ color: systemColors.green }}
              />
              選び方チェックリスト
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {SELECTION_CHECKLIST.map((section) => (
                <div
                  key={section.category}
                  className={`${liquidGlassClasses.light} rounded-[16px] p-5 border`}
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  <h3
                    className="text-[15px] font-semibold mb-3"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    {section.category}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2
                          size={16}
                          className="flex-shrink-0 mt-0.5"
                          style={{ color: systemColors.green }}
                        />
                        <span
                          className="text-[14px]"
                          style={{ color: appleWebColors.textSecondary }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* セクション5: 摂取量・タイミング */}
          <section id="dosage" className="mb-16 scroll-mt-8">
            <h2
              className={`${typography.title2} mb-6`}
              style={{ color: appleWebColors.textPrimary }}
            >
              <Calculator
                className="inline mr-2"
                size={24}
                style={{ color: systemColors.purple }}
              />
              摂取量・タイミング
            </h2>

            <div
              className={`${liquidGlassClasses.light} rounded-[20px] p-6 border`}
              style={{ borderColor: appleWebColors.borderSubtle }}
            >
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div
                    className="text-[24px] font-bold mb-1"
                    style={{ color: systemColors.blue }}
                  >
                    {DOSAGE_GUIDE.recommended}
                  </div>
                  <div
                    className="text-[13px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    1日の推奨摂取量
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="text-[24px] font-bold mb-1"
                    style={{ color: systemColors.orange }}
                  >
                    {DOSAGE_GUIDE.timing}
                  </div>
                  <div
                    className="text-[13px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    ベストタイミング
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="text-[24px] font-bold mb-1"
                    style={{ color: systemColors.green }}
                  >
                    {DOSAGE_GUIDE.frequency}
                  </div>
                  <div
                    className="text-[13px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    摂取頻度
                  </div>
                </div>
              </div>

              <div
                className="pt-4 border-t"
                style={{ borderColor: appleWebColors.borderSubtle }}
              >
                <h4
                  className="text-[14px] font-medium mb-2"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  補足事項
                </h4>
                <ul className="space-y-1">
                  {DOSAGE_GUIDE.notes.map((note, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-[14px]"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      <Info
                        size={14}
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: systemColors.blue }}
                      />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* セクション6: 注意点・副作用 */}
          <section id="cautions" className="mb-16 scroll-mt-8">
            <h2
              className={`${typography.title2} mb-6`}
              style={{ color: appleWebColors.textPrimary }}
            >
              <AlertTriangle
                className="inline mr-2"
                size={24}
                style={{ color: systemColors.orange }}
              />
              注意点・副作用
            </h2>

            <div className="space-y-4">
              {CAUTIONS.map((caution) => (
                <div
                  key={caution.title}
                  className={`${liquidGlassClasses.light} rounded-[16px] p-5 border-l-4`}
                  style={{
                    borderColor:
                      caution.severity === "high"
                        ? systemColors.red
                        : caution.severity === "medium"
                          ? systemColors.orange
                          : systemColors.yellow,
                    backgroundColor:
                      caution.severity === "high"
                        ? systemColors.red + "08"
                        : caution.severity === "medium"
                          ? systemColors.orange + "08"
                          : systemColors.yellow + "08",
                  }}
                >
                  <div className="flex items-start gap-3">
                    {caution.severity === "high" ? (
                      <XCircle
                        size={20}
                        className="flex-shrink-0"
                        style={{ color: systemColors.red }}
                      />
                    ) : (
                      <AlertTriangle
                        size={20}
                        className="flex-shrink-0"
                        style={{
                          color:
                            caution.severity === "medium"
                              ? systemColors.orange
                              : systemColors.yellow,
                        }}
                      />
                    )}
                    <div>
                      <h3
                        className="text-[15px] font-semibold mb-1"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {caution.title}
                      </h3>
                      <p
                        className="text-[14px]"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        {caution.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* セクション7: FAQ */}
          <section id="faq" className="mb-16 scroll-mt-8">
            <h2
              className={`${typography.title2} mb-6`}
              style={{ color: appleWebColors.textPrimary }}
            >
              <Info
                className="inline mr-2"
                size={24}
                style={{ color: systemColors.blue }}
              />
              よくある質問
            </h2>

            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className={`${liquidGlassClasses.light} rounded-[16px] p-5 border`}
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  <h3
                    className="text-[15px] font-semibold mb-2"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    Q. {faq.question}
                  </h3>
                  <p
                    className="text-[14px] leading-relaxed"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    A. {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section
            className={`${liquidGlassClasses.light} rounded-[20px] p-8 text-center border`}
            style={{
              borderColor: appleWebColors.borderSubtle,
              background: `linear-gradient(135deg, ${systemColors.blue}08 0%, ${systemColors.purple}08 100%)`,
            }}
          >
            <h2
              className={`${typography.title2} mb-3`}
              style={{ color: appleWebColors.textPrimary }}
            >
              あなたに最適なプロテインを見つけよう
            </h2>
            <p
              className={`${typography.body} mb-6`}
              style={{ color: appleWebColors.textSecondary }}
            >
              サプティアなら価格・成分・コスパを比較して、
              <br className="hidden md:block" />
              最適なプロテインが見つかります
            </p>
            <Link
              href="/ingredients/protein"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-[15px] font-semibold text-white"
              style={{ backgroundColor: systemColors.blue }}
            >
              プロテイン成分ガイドを見る
              <ArrowRight size={16} />
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
