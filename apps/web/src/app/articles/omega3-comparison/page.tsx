/**
 * オメガ3（フィッシュオイル）比較記事ページ
 * SEO最適化された比較コンテンツ
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
  Brain,
  Eye,
  BadgeCheck,
  XCircle,
  Info,
  Fish,
  Leaf,
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

export const revalidate = 86400;

const ARTICLE_DATA = {
  title:
    "【2025年最新】オメガ3（フィッシュオイル）おすすめ比較｜EPA・DHA含有量で徹底分析",
  description:
    "オメガ3サプリをEPA/DHA比率・純度・酸化防止で徹底比較。魚油・クリルオイル・藻類由来の違い、効果的な選び方を解説。",
  publishedAt: "2025-01-19",
  updatedAt: new Date().toISOString().split("T")[0],
  ingredientName: "オメガ3脂肪酸",
  ingredientSlug: "omega-3",
};

const ogImageUrl = getArticleOGImage("omega3-comparison");
const ogImage = generateOGImageMeta(ogImageUrl, "オメガ3比較 - Suptia");

export const metadata: Metadata = {
  title: ARTICLE_DATA.title,
  description: ARTICLE_DATA.description,
  keywords: [
    "オメガ3",
    "フィッシュオイル",
    "EPA",
    "DHA",
    "魚油",
    "クリルオイル",
    "サプリメント",
    "比較",
    "2025",
    "おすすめ",
  ],
  openGraph: {
    title: ARTICLE_DATA.title,
    description: ARTICLE_DATA.description,
    type: "article",
    publishedTime: ARTICLE_DATA.publishedAt,
    modifiedTime: ARTICLE_DATA.updatedAt,
    url: "https://suptia.com/articles/omega3-comparison",
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
    canonical: "https://suptia.com/articles/omega3-comparison",
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

async function getOmega3Products(): Promise<Product[]> {
  const query = `*[_type == "product" && availability == "in-stock" && references(*[_type == "ingredient" && (slug.current == "omega-3" || slug.current == "epa" || slug.current == "dha")]._id)] | order(priceJPY asc)[0...20]{
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
    console.error("Failed to fetch omega-3 products:", error);
    return [];
  }
}

// オメガ3の種類データ
const OMEGA3_TYPES = [
  {
    name: "フィッシュオイル（魚油）",
    nameEn: "Fish Oil",
    absorption: "○ 普通",
    price: "◎ 安い",
    purity: "70-90%",
    best: "コスパ重視の方",
    description:
      "最も一般的なオメガ3源。EPA・DHAを効率的に摂取できる。酸化しやすいのが難点。",
    color: systemColors.blue,
  },
  {
    name: "クリルオイル",
    nameEn: "Krill Oil",
    absorption: "◎ 高い",
    price: "△ やや高め",
    purity: "リン脂質結合型",
    best: "吸収率重視・抗酸化も欲しい方",
    description:
      "南極オキアミ由来。リン脂質結合型で吸収率が高く、アスタキサンチンも含む。",
    color: systemColors.red,
  },
  {
    name: "藻類由来DHA",
    nameEn: "Algae DHA",
    absorption: "○ 普通",
    price: "○ 中程度",
    purity: "高純度DHA",
    best: "ヴィーガン・魚アレルギーの方",
    description:
      "魚が食べる藻類から直接抽出。植物由来でDHAを摂取可能。EPAは少なめ。",
    color: systemColors.green,
  },
  {
    name: "高濃度EPA/DHA",
    nameEn: "Concentrated Fish Oil",
    absorption: "◎ 高い",
    price: "△ やや高め",
    purity: "90%以上",
    best: "効果重視・少ない粒数で摂りたい方",
    description:
      "分子蒸留で高純度化。少ない粒数で高用量摂取可能。魚臭さも少ない。",
    color: systemColors.purple,
  },
  {
    name: "EPA特化型",
    nameEn: "EPA-Focused",
    absorption: "○ 普通",
    price: "○ 中程度",
    purity: "EPA高配合",
    best: "中性脂肪・炎症対策の方",
    description:
      "EPAを多く含む製品。中性脂肪の低下や抗炎症作用を重視する方向け。",
    color: systemColors.cyan,
  },
  {
    name: "DHA特化型",
    nameEn: "DHA-Focused",
    absorption: "○ 普通",
    price: "○ 中程度",
    purity: "DHA高配合",
    best: "脳・目の健康重視の方",
    description:
      "DHAを多く含む製品。認知機能や視力のサポートを重視する方向け。",
    color: systemColors.indigo,
  },
];

// 目的別おすすめ
const PURPOSE_RECOMMENDATIONS = [
  {
    purpose: "心血管の健康",
    icon: Heart,
    recommended: "高濃度EPA/DHA または EPA特化型",
    dosage: "EPA+DHA 2000-4000mg/日",
    tips: "中性脂肪が気になる方はEPA多めを選択。食事と一緒に摂ると吸収UP。",
    color: systemColors.red,
  },
  {
    purpose: "脳・認知機能",
    icon: Brain,
    recommended: "DHA特化型 または クリルオイル",
    dosage: "DHA 500-1000mg/日",
    tips: "DHAは脳の構成成分。アスタキサンチン入りのクリルオイルも効果的。",
    color: systemColors.purple,
  },
  {
    purpose: "目の健康",
    icon: Eye,
    recommended: "DHA特化型",
    dosage: "DHA 500mg以上/日",
    tips: "DHAは網膜の主要構成成分。ルテインとの併用も効果的。",
    color: systemColors.cyan,
  },
  {
    purpose: "妊娠・授乳中",
    icon: Heart,
    recommended: "藻類由来DHA または 高純度魚油",
    dosage: "DHA 200-300mg/日",
    tips: "水銀リスクの低い製品を選択。藻類由来なら安心。",
    color: systemColors.pink,
  },
];

// 選び方チェックリスト
const SELECTION_CHECKLIST = [
  {
    category: "EPA・DHA含有量",
    items: [
      "1粒あたりのEPA・DHA量を確認（オメガ3総量ではない）",
      "1日分のEPA+DHA合計量が目安を満たすか",
      "EPA:DHA比率が目的に合っているか",
    ],
  },
  {
    category: "品質・安全性",
    items: [
      "分子蒸留で重金属・PCBを除去しているか",
      "IFOS認証など第三者機関の品質保証",
      "酸化防止対策（ビタミンE、窒素充填など）",
    ],
  },
  {
    category: "吸収率",
    items: [
      "トリグリセリド型（TG型）かエチルエステル型（EE型）か",
      "リン脂質結合型（クリルオイル）は吸収率が高い",
      "エンテリックコーティングで魚臭さと胃への負担を軽減",
    ],
  },
  {
    category: "コストパフォーマンス",
    items: [
      "EPA+DHA 1000mgあたりの価格で比較",
      "1日のコストを計算（継続しやすさ）",
      "大容量パックでコスト削減",
    ],
  },
];

// 摂取量ガイド
const DOSAGE_GUIDE = {
  recommended: "EPA+DHA 1000-3000mg/日",
  timing: "食事と一緒に（脂質があると吸収UP）",
  frequency: "1日1-3回に分けて摂取",
  notes: [
    "アメリカ心臓協会推奨: 心臓病リスク者は1000mg/日",
    "高用量（3000mg以上）は医師に相談",
    "手術前は出血リスクのため中断が必要な場合も",
  ],
};

// 注意点
const CAUTIONS = [
  {
    title: "血液凝固への影響",
    description:
      "高用量摂取は出血時間を延長する可能性。抗凝固薬服用中は医師に相談。",
    severity: "medium",
  },
  {
    title: "魚アレルギー",
    description:
      "魚由来製品はアレルギー反応の可能性。藻類由来を選択するか医師に相談。",
    severity: "high",
  },
  {
    title: "酸化・品質劣化",
    description:
      "開封後は冷蔵庫保存。異臭がする場合は酸化している可能性があり廃棄。",
    severity: "low",
  },
  {
    title: "魚臭さ・げっぷ",
    description:
      "エンテリックコーティング製品を選ぶか、冷凍して摂取すると軽減。",
    severity: "low",
  },
];

// FAQ
const FAQS = [
  {
    question: "EPAとDHAどちらを重視すべき？",
    answer:
      "目的により異なります。中性脂肪・炎症対策ならEPA、脳・目の健康ならDHAを重視。一般的な健康維持なら両方バランスよく含む製品がおすすめです。",
  },
  {
    question: "魚を食べていればサプリは不要？",
    answer:
      "週に2-3回脂ののった魚を食べていれば十分な可能性もあります。ただし、魚を食べる機会が少ない方や、特定の健康目的がある方はサプリが有効です。",
  },
  {
    question: "クリルオイルと魚油どちらが良い？",
    answer:
      "クリルオイルは吸収率が高く抗酸化成分も含みますが価格は高め。コスパ重視なら高純度の魚油、吸収率・抗酸化重視ならクリルオイルがおすすめです。",
  },
  {
    question: "妊娠中でも摂取できる？",
    answer:
      "DHAは胎児の脳発達に重要です。ただし、水銀リスクの低い高純度製品や藻類由来を選び、摂取量は医師と相談してください。",
  },
  {
    question: "オメガ3は酸化しやすい？保存方法は？",
    answer:
      "非常に酸化しやすい脂質です。開封後は冷蔵庫で保存し、2-3ヶ月以内に使い切りましょう。酸化すると効果が減少し、むしろ有害になる可能性もあります。",
  },
];

export default async function Omega3ComparisonPage() {
  const products = await getOmega3Products();

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
      "@id": "https://suptia.com/articles/omega3-comparison",
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
            background: `linear-gradient(135deg, ${systemColors.blue}08 0%, ${systemColors.cyan}08 100%)`,
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
                  <Link href="/" style={{ color: systemColors.blue }}>
                    ホーム
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/articles" style={{ color: systemColors.blue }}>
                    記事
                  </Link>
                </li>
                <li>/</li>
                <li style={{ color: appleWebColors.textPrimary }}>
                  オメガ3比較
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
                  backgroundColor: systemColors.cyan + "15",
                  color: systemColors.cyan,
                }}
              >
                <Fish size={16} />
                <span className="text-[14px] font-medium">オメガ3比較</span>
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
                <span>読了時間: 6分</span>
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
                  1. オメガ3の種類と特徴
                </a>
              </li>
              <li>
                <a href="#purpose" className="hover:opacity-70">
                  2. 目的別おすすめ
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
                  6. 注意点
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
              オメガ3の種類と特徴
            </h2>

            <p
              className={`${typography.body} mb-8`}
              style={{ color: appleWebColors.textSecondary }}
            >
              オメガ3脂肪酸には様々な形態があり、原料や製法によって吸収率や特性が異なります。
            </p>

            <div className="grid gap-4">
              {OMEGA3_TYPES.map((type) => (
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
                        純度: {type.purity}
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
              目的別おすすめ
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
                    <div style={{ color: appleWebColors.textSecondary }}>
                      <span>おすすめ: </span>
                      <span
                        className="font-medium"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {rec.recommended}
                      </span>
                    </div>
                    <div style={{ color: appleWebColors.textSecondary }}>
                      <span>目安: </span>
                      <span
                        className="font-medium"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {rec.dosage}
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
                href="/search?ingredient=omega-3"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[15px] font-medium text-white"
                style={{ backgroundColor: systemColors.blue }}
              >
                すべてのオメガ3製品を見る
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
                    className="text-[20px] font-bold mb-1"
                    style={{ color: systemColors.blue }}
                  >
                    {DOSAGE_GUIDE.recommended}
                  </div>
                  <div
                    className="text-[13px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    推奨摂取量
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="text-[20px] font-bold mb-1"
                    style={{ color: systemColors.orange }}
                  >
                    {DOSAGE_GUIDE.timing}
                  </div>
                  <div
                    className="text-[13px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    タイミング
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="text-[20px] font-bold mb-1"
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

          {/* セクション6: 注意点 */}
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
              注意点
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
                    <AlertTriangle
                      size={20}
                      className="flex-shrink-0"
                      style={{
                        color:
                          caution.severity === "high"
                            ? systemColors.red
                            : caution.severity === "medium"
                              ? systemColors.orange
                              : systemColors.yellow,
                      }}
                    />
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
              background: `linear-gradient(135deg, ${systemColors.blue}08 0%, ${systemColors.cyan}08 100%)`,
            }}
          >
            <h2
              className={`${typography.title2} mb-3`}
              style={{ color: appleWebColors.textPrimary }}
            >
              あなたに最適なオメガ3を見つけよう
            </h2>
            <p
              className={`${typography.body} mb-6`}
              style={{ color: appleWebColors.textSecondary }}
            >
              EPA・DHA含有量、価格、品質を比較して最適な製品を選びましょう
            </p>
            <Link
              href="/ingredients/omega-3"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-[15px] font-semibold text-white"
              style={{ backgroundColor: systemColors.blue }}
            >
              オメガ3成分ガイドを見る
              <ArrowRight size={16} />
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
