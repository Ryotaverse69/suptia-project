/**
 * マグネシウム比較記事ページ
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
  Moon,
  BadgeCheck,
  XCircle,
  Info,
  Sparkles,
  Activity,
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
    "【2025年最新】マグネシウムサプリおすすめ比較｜形態別の吸収率で徹底分析",
  description:
    "マグネシウムサプリを形態（グリシン酸・クエン酸・酸化物）別に比較。吸収率・目的別の選び方・副作用を解説。",
  publishedAt: "2025-01-19",
  updatedAt: new Date().toISOString().split("T")[0],
  ingredientName: "マグネシウム",
  ingredientSlug: "magnesium",
};

const ogImageUrl = getArticleOGImage("magnesium-comparison");
const ogImage = generateOGImageMeta(ogImageUrl, "マグネシウム比較 - Suptia");

export const metadata: Metadata = {
  title: ARTICLE_DATA.title,
  description: ARTICLE_DATA.description,
  keywords: [
    "マグネシウム",
    "サプリメント",
    "比較",
    "グリシン酸",
    "クエン酸",
    "酸化マグネシウム",
    "吸収率",
    "睡眠",
    "筋肉",
    "2025",
  ],
  openGraph: {
    title: ARTICLE_DATA.title,
    description: ARTICLE_DATA.description,
    type: "article",
    publishedTime: ARTICLE_DATA.publishedAt,
    modifiedTime: ARTICLE_DATA.updatedAt,
    url: "https://suptia.com/articles/magnesium-comparison",
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
    canonical: "https://suptia.com/articles/magnesium-comparison",
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

async function getMagnesiumProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && availability == "in-stock" && references(*[_type == "ingredient" && slug.current == "magnesium"]._id)] | order(priceJPY asc)[0...20]{
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
    console.error("Failed to fetch magnesium products:", error);
    return [];
  }
}

// マグネシウムの形態データ
const MAGNESIUM_TYPES = [
  {
    name: "グリシン酸マグネシウム",
    nameEn: "Magnesium Glycinate",
    absorption: "◎ 高い",
    price: "△ やや高め",
    stomach: "◎ 優しい",
    best: "睡眠・リラックス重視",
    description:
      "アミノ酸グリシンと結合。吸収率が高く、リラックス効果も。就寝前に最適。",
    color: systemColors.purple,
  },
  {
    name: "クエン酸マグネシウム",
    nameEn: "Magnesium Citrate",
    absorption: "◎ 高い",
    price: "○ 中程度",
    stomach: "○ 普通",
    best: "バランス重視・便秘気味の方",
    description: "吸収率が高く、軽い緩下作用あり。便秘気味の方にも適している。",
    color: systemColors.orange,
  },
  {
    name: "酸化マグネシウム",
    nameEn: "Magnesium Oxide",
    absorption: "△ 低い",
    price: "◎ 安い",
    stomach: "△ 下剤作用あり",
    best: "便秘対策・コスパ重視",
    description:
      "マグネシウム含有率は高いが吸収率は低め。便秘薬としても使用される。",
    color: "#6B7280",
  },
  {
    name: "リンゴ酸マグネシウム",
    nameEn: "Magnesium Malate",
    absorption: "○ 良好",
    price: "○ 中程度",
    stomach: "◎ 優しい",
    best: "エネルギー・筋肉疲労",
    description:
      "リンゴ酸はエネルギー産生に関与。筋肉疲労や線維筋痛症の方に人気。",
    color: systemColors.green,
  },
  {
    name: "スレオン酸マグネシウム",
    nameEn: "Magnesium L-Threonate",
    absorption: "◎ 高い（脳へ）",
    price: "× 高い",
    stomach: "◎ 優しい",
    best: "認知機能・脳の健康",
    description:
      "血液脳関門を通過できる唯一の形態。認知機能サポートに注目されている。",
    color: systemColors.indigo,
  },
  {
    name: "タウリン酸マグネシウム",
    nameEn: "Magnesium Taurate",
    absorption: "◎ 高い",
    price: "△ やや高め",
    stomach: "◎ 優しい",
    best: "心臓・血圧が気になる方",
    description:
      "タウリンは心臓の健康に重要。心血管系のサポートを期待する方向け。",
    color: systemColors.red,
  },
];

// 目的別おすすめ
const PURPOSE_RECOMMENDATIONS = [
  {
    purpose: "睡眠・リラックス",
    icon: Moon,
    recommended: "グリシン酸マグネシウム",
    timing: "就寝30分〜1時間前",
    dosage: "200-400mg/日",
    tips: "グリシン自体にもリラックス効果あり。カフェインとの併用は避ける。",
    color: systemColors.purple,
  },
  {
    purpose: "筋肉けいれん・こむら返り",
    icon: Activity,
    recommended: "クエン酸 または リンゴ酸",
    timing: "運動後・就寝前",
    dosage: "300-400mg/日",
    tips: "カリウムやビタミンB6との併用で効果UP。脱水にも注意。",
    color: systemColors.orange,
  },
  {
    purpose: "認知機能・集中力",
    icon: Brain,
    recommended: "スレオン酸マグネシウム",
    timing: "朝または昼",
    dosage: "製品指示に従う（144mg程度）",
    tips: "高価だが脳への到達性が高い。長期継続で効果を実感。",
    color: systemColors.indigo,
  },
  {
    purpose: "心臓・血圧",
    icon: Heart,
    recommended: "タウリン酸マグネシウム",
    timing: "朝晩2回に分けて",
    dosage: "300-400mg/日",
    tips: "タウリンとの相乗効果。降圧薬服用中は医師に相談。",
    color: systemColors.red,
  },
];

// 選び方チェックリスト
const SELECTION_CHECKLIST = [
  {
    category: "形態（吸収率）",
    items: [
      "目的に合った形態を選ぶ（上記参照）",
      "吸収率重視ならグリシン酸・クエン酸",
      "コスパ重視なら酸化マグネシウム（吸収率は低い）",
    ],
  },
  {
    category: "含有量",
    items: [
      "「元素マグネシウム量」を確認（化合物全体量ではない）",
      "1日300-400mgが一般的な目安",
      "分割摂取のため1回100-200mgが理想",
    ],
  },
  {
    category: "胃腸への影響",
    items: [
      "酸化マグネシウムは下剤作用が強い",
      "グリシン酸・タウリン酸は胃に優しい",
      "便秘気味ならクエン酸が一石二鳥",
    ],
  },
  {
    category: "品質・添加物",
    items: [
      "第三者機関の品質テスト",
      "不要な添加物・着色料の有無",
      "GMP認証施設での製造",
    ],
  },
];

// 摂取量ガイド
const DOSAGE_GUIDE = {
  recommended: "300-400mg/日（元素マグネシウム）",
  timing: "食事と一緒に（空腹時は避ける）",
  frequency: "2-3回に分けて摂取が理想",
  notes: [
    "日本人の推奨量: 男性340mg、女性270mg",
    "上限量: 350mg/日（サプリメントから）",
    "食事からの摂取量も考慮して調整",
  ],
};

// 注意点
const CAUTIONS = [
  {
    title: "腎機能障害",
    description:
      "腎機能が低下している方はマグネシウムの排泄が困難。必ず医師に相談。",
    severity: "high",
  },
  {
    title: "下痢・軟便",
    description:
      "特に酸化マグネシウムで起こりやすい。用量を減らすか形態を変更。",
    severity: "medium",
  },
  {
    title: "薬との相互作用",
    description:
      "抗生物質・骨粗鬆症薬などの吸収を妨げる可能性。2時間以上あける。",
    severity: "medium",
  },
  {
    title: "過剰摂取",
    description:
      "サプリからは350mg/日を超えないこと。下痢、吐き気、低血圧の恐れ。",
    severity: "medium",
  },
];

// FAQ
const FAQS = [
  {
    question: "マグネシウムはいつ飲むのが効果的？",
    answer:
      "目的により異なります。睡眠改善なら就寝前、筋肉けいれん対策なら運動後や就寝前、一般的な補給なら食事と一緒に。空腹時は胃腸への刺激が強いので避けましょう。",
  },
  {
    question: "酸化マグネシウムと他の形態の違いは？",
    answer:
      "酸化マグネシウムはマグネシウム含有率は高い（60%）ですが、吸収率は4%程度と低いです。便秘対策には有効ですが、マグネシウム補給目的なら吸収率の高い形態がおすすめです。",
  },
  {
    question: "マグネシウムとカルシウムは一緒に摂るべき？",
    answer:
      "以前は2:1の比率が推奨されていましたが、現在は個別に適量を摂ることが重要とされています。ただし、同時摂取は互いの吸収を妨げる可能性があるため、時間をずらすのが理想的です。",
  },
  {
    question: "マグネシウム不足のサインは？",
    answer:
      "筋肉のけいれん・こむら返り、疲労感、不眠、イライラ、頭痛などが代表的です。日本人の多くはマグネシウム摂取が不足気味と言われています。",
  },
  {
    question: "食事からマグネシウムを摂るには？",
    answer:
      "ナッツ類（アーモンド、カシューナッツ）、緑黄色野菜（ほうれん草）、豆類、全粒穀物、カカオなどに豊富です。ただし、加工食品中心の食生活では不足しがちです。",
  },
];

export default async function MagnesiumComparisonPage() {
  const products = await getMagnesiumProducts();

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
      "@id": "https://suptia.com/articles/magnesium-comparison",
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
            background: `linear-gradient(135deg, ${systemColors.purple}08 0%, ${systemColors.indigo}08 100%)`,
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
                  マグネシウム比較
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
                  backgroundColor: systemColors.purple + "15",
                  color: systemColors.purple,
                }}
              >
                <Sparkles size={16} />
                <span className="text-[14px] font-medium">
                  マグネシウム比較
                </span>
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
                  1. マグネシウムの形態と特徴
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

          {/* セクション1: 形態と特徴 */}
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
              マグネシウムの形態と特徴
            </h2>

            <p
              className={`${typography.body} mb-8`}
              style={{ color: appleWebColors.textSecondary }}
            >
              マグネシウムは結合している物質によって吸収率や効果が大きく異なります。
              目的に合った形態を選ぶことが重要です。
            </p>

            <div className="grid gap-4">
              {MAGNESIUM_TYPES.map((type) => (
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
                          backgroundColor: systemColors.orange + "15",
                          color: systemColors.orange,
                        }}
                      >
                        胃腸: {type.stomach}
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
                      <span>タイミング: </span>
                      <span
                        className="font-medium"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {rec.timing}
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
                href="/search?ingredient=magnesium"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[15px] font-medium text-white"
                style={{ backgroundColor: systemColors.blue }}
              >
                すべてのマグネシウム製品を見る
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
                        : systemColors.orange,
                    backgroundColor:
                      caution.severity === "high"
                        ? systemColors.red + "08"
                        : systemColors.orange + "08",
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
                            : systemColors.orange,
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
              background: `linear-gradient(135deg, ${systemColors.purple}08 0%, ${systemColors.indigo}08 100%)`,
            }}
          >
            <h2
              className={`${typography.title2} mb-3`}
              style={{ color: appleWebColors.textPrimary }}
            >
              あなたに最適なマグネシウムを見つけよう
            </h2>
            <p
              className={`${typography.body} mb-6`}
              style={{ color: appleWebColors.textSecondary }}
            >
              形態別の吸収率、価格、品質を比較して最適な製品を選びましょう
            </p>
            <Link
              href="/ingredients/magnesium"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-[15px] font-semibold text-white"
              style={{ backgroundColor: systemColors.blue }}
            >
              マグネシウム成分ガイドを見る
              <ArrowRight size={16} />
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
