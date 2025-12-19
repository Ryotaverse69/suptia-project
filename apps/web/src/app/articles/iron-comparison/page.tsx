/**
 * 鉄分比較記事ページ
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
  Droplets,
  Activity,
  BadgeCheck,
  XCircle,
  Info,
  Users,
  Baby,
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
    "【2025年最新】鉄分サプリおすすめ比較｜ヘム鉄・非ヘム鉄・キレート鉄の違い",
  description:
    "鉄分サプリをヘム鉄・非ヘム鉄・キレート鉄で比較。吸収率・副作用・コスパを徹底分析。女性・妊婦・アスリート向けの選び方。",
  publishedAt: "2025-01-19",
  updatedAt: new Date().toISOString().split("T")[0],
  ingredientName: "鉄",
  ingredientSlug: "iron",
};

const ogImageUrl = getArticleOGImage("iron-comparison");
const ogImage = generateOGImageMeta(ogImageUrl, "鉄分サプリ比較 - Suptia");

export const metadata: Metadata = {
  title: ARTICLE_DATA.title,
  description: ARTICLE_DATA.description,
  keywords: [
    "鉄分",
    "サプリメント",
    "ヘム鉄",
    "非ヘム鉄",
    "キレート鉄",
    "貧血",
    "女性",
    "妊娠",
    "吸収率",
    "2025",
  ],
  openGraph: {
    title: ARTICLE_DATA.title,
    description: ARTICLE_DATA.description,
    type: "article",
    publishedTime: ARTICLE_DATA.publishedAt,
    modifiedTime: ARTICLE_DATA.updatedAt,
    url: "https://suptia.com/articles/iron-comparison",
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
    canonical: "https://suptia.com/articles/iron-comparison",
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

async function getIronProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && availability == "in-stock" && references(*[_type == "ingredient" && slug.current == "iron"]._id)] | order(priceJPY asc)[0...20]{
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
    console.error("Failed to fetch iron products:", error);
    return [];
  }
}

// 鉄分の種類データ
const IRON_TYPES = [
  {
    name: "ヘム鉄",
    nameEn: "Heme Iron",
    absorption: "◎ 高い（15-35%）",
    price: "△ やや高め",
    sideEffect: "◎ 少ない",
    best: "胃腸が弱い方・副作用を避けたい方",
    description:
      "動物性食品由来の鉄。吸収率が高く、胃腸への刺激が少ない。便秘・吐き気が起きにくい。",
    color: systemColors.red,
  },
  {
    name: "非ヘム鉄（硫酸鉄）",
    nameEn: "Ferrous Sulfate",
    absorption: "△ 低い（2-20%）",
    price: "◎ 安い",
    sideEffect: "△ 多い",
    best: "コスパ重視・副作用に耐えられる方",
    description:
      "最も一般的な鉄剤。吸収率は低いが安価。胃腸障害（便秘・吐き気）が起きやすい。",
    color: "#6B7280",
  },
  {
    name: "クエン酸第一鉄",
    nameEn: "Ferrous Citrate",
    absorption: "○ 中程度",
    price: "○ 中程度",
    sideEffect: "○ 中程度",
    best: "バランス重視の方",
    description:
      "硫酸鉄より吸収率が良く、胃腸への刺激も抑えめ。日本で広く使われている。",
    color: systemColors.orange,
  },
  {
    name: "キレート鉄（ビスグリシン酸鉄）",
    nameEn: "Iron Bisglycinate",
    absorption: "◎ 高い",
    price: "△ やや高め",
    sideEffect: "◎ 少ない",
    best: "吸収率・副作用両方を重視",
    description:
      "アミノ酸とキレート結合。非ヘム鉄だが吸収率が高く、胃腸への刺激も少ない。",
    color: systemColors.green,
  },
  {
    name: "ピロリン酸第二鉄",
    nameEn: "Ferric Pyrophosphate",
    absorption: "○ 中程度",
    price: "○ 中程度",
    sideEffect: "◎ 少ない",
    best: "食品添加・マイルドな補給",
    description:
      "味や色への影響が少なく食品添加に使用される。胃腸に優しいが吸収率はやや劣る。",
    color: systemColors.cyan,
  },
  {
    name: "リポソーム鉄",
    nameEn: "Liposomal Iron",
    absorption: "◎ 高い",
    price: "× 高い",
    sideEffect: "◎ 少ない",
    best: "最新技術で副作用ゼロを目指す方",
    description:
      "リン脂質で包んだ鉄。胃を通過して腸で吸収されるため、副作用がほぼない。高価格。",
    color: systemColors.purple,
  },
];

// 目的別おすすめ
const PURPOSE_RECOMMENDATIONS = [
  {
    purpose: "貧血対策（女性）",
    icon: Users,
    recommended: "ヘム鉄 または キレート鉄",
    dosage: "10-15mg/日",
    timing: "空腹時または食間",
    tips: "ビタミンCと一緒に摂ると吸収UP。コーヒー・お茶は避ける。",
    color: systemColors.pink,
  },
  {
    purpose: "妊娠中・授乳中",
    icon: Baby,
    recommended: "ヘム鉄 または リポソーム鉄",
    dosage: "妊娠中期以降 21.5mg/日",
    timing: "食事と一緒に",
    tips: "つわり中は副作用の少ない形態を。葉酸との併用推奨。",
    color: systemColors.purple,
  },
  {
    purpose: "アスリート・運動習慣",
    icon: Activity,
    recommended: "キレート鉄 または ヘム鉄",
    dosage: "15-20mg/日",
    timing: "トレーニング後",
    tips: "激しい運動は鉄を消耗。定期的な血液検査で確認を。",
    color: systemColors.orange,
  },
  {
    purpose: "ヴィーガン・ベジタリアン",
    icon: Heart,
    recommended: "キレート鉄 + ビタミンC",
    dosage: "18mg/日（推奨量の1.8倍）",
    timing: "食間",
    tips: "植物性鉄は吸収率が低い。ビタミンCで吸収を大幅UP。",
    color: systemColors.green,
  },
];

// 選び方チェックリスト
const SELECTION_CHECKLIST = [
  {
    category: "形態（吸収率vs副作用）",
    items: [
      "胃腸が弱い → ヘム鉄・キレート鉄・リポソーム鉄",
      "コスパ重視 → 硫酸鉄・クエン酸鉄",
      "吸収率重視 → ヘム鉄・キレート鉄",
    ],
  },
  {
    category: "含有量の確認",
    items: [
      "「元素鉄量」を確認（化合物量ではない）",
      "1日の推奨量: 女性10.5-11mg、男性7.5mg",
      "過剰摂取に注意（上限40mg/日）",
    ],
  },
  {
    category: "相性の良い成分",
    items: [
      "ビタミンC: 吸収を2-3倍に高める",
      "ビタミンB12・葉酸: 赤血球生成に必須",
      "銅: 鉄の代謝を助ける",
    ],
  },
  {
    category: "避けるべき組み合わせ",
    items: [
      "カルシウム: 鉄の吸収を阻害（時間をずらす）",
      "コーヒー・紅茶: タンニンが吸収を妨げる",
      "制酸剤: 胃酸低下で吸収率DOWN",
    ],
  },
];

// 摂取量ガイド
const DOSAGE_GUIDE = {
  recommended: "成人女性 10.5mg/日、男性 7.5mg/日",
  timing: "空腹時が最も吸収率が高い",
  frequency: "1日1回（高用量は分割）",
  notes: [
    "上限量: 40mg/日（サプリメントから）",
    "妊娠中期以降: 21.5mg/日が目安",
    "鉄欠乏が確認されてから摂取（過剰摂取は有害）",
  ],
};

// 注意点
const CAUTIONS = [
  {
    title: "過剰摂取のリスク",
    description:
      "鉄は体内に蓄積する。過剰摂取は肝臓・心臓にダメージ。血液検査で確認してから摂取を。",
    severity: "high",
  },
  {
    title: "胃腸障害",
    description:
      "便秘・吐き気・胃痛が起きやすい。特に硫酸鉄で顕著。ヘム鉄やキレート鉄に変更を。",
    severity: "medium",
  },
  {
    title: "便の色の変化",
    description:
      "鉄サプリで便が黒くなるのは正常。ただし、タール便（真っ黒で粘り気がある）は出血の可能性あり。",
    severity: "low",
  },
  {
    title: "ヘモクロマトーシス",
    description:
      "遺伝性の鉄過剰症。鉄サプリは禁忌。家族歴がある場合は必ず検査を。",
    severity: "high",
  },
];

// FAQ
const FAQS = [
  {
    question: "ヘム鉄と非ヘム鉄、どちらを選ぶべき？",
    answer:
      "副作用を避けたいならヘム鉄がおすすめ。吸収率が高く（15-35%）、胃腸への刺激も少ないです。コスパ重視なら非ヘム鉄ですが、便秘・吐き気が起きやすいことを覚悟してください。",
  },
  {
    question: "鉄サプリはいつ飲むのが効果的？",
    answer:
      "空腹時が最も吸収率が高いですが、胃腸障害が起きやすい方は食事と一緒に。コーヒー・紅茶・牛乳と一緒に摂ると吸収が阻害されるので、1-2時間空けましょう。",
  },
  {
    question: "ビタミンCと一緒に摂るべき？",
    answer:
      "非ヘム鉄の場合は必須です。ビタミンCは非ヘム鉄の吸収を2-3倍に高めます。ヘム鉄は食事の影響を受けにくいですが、ビタミンCと一緒でも問題ありません。",
  },
  {
    question: "貧血でなくても鉄サプリを飲んでいい？",
    answer:
      "鉄は不足していなければ摂取すべきではありません。過剰な鉄は酸化ストレスを増加させ、肝臓・心臓にダメージを与えます。血液検査でフェリチン値を確認してから摂取してください。",
  },
  {
    question: "鉄サプリで便秘になるのを防ぐには？",
    answer:
      "ヘム鉄・キレート鉄・リポソーム鉄は便秘になりにくいです。硫酸鉄で便秘が起きる場合は、形態を変えるか、マグネシウムを併用するのも効果的です。水分と食物繊維も重要です。",
  },
];

export default async function IronComparisonPage() {
  const products = await getIronProducts();

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
      "@id": "https://suptia.com/articles/iron-comparison",
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
            background: `linear-gradient(135deg, ${systemColors.red}08 0%, ${systemColors.orange}08 100%)`,
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
                <li style={{ color: appleWebColors.textPrimary }}>鉄分比較</li>
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
                  backgroundColor: systemColors.red + "15",
                  color: systemColors.red,
                }}
              >
                <Droplets size={16} />
                <span className="text-[14px] font-medium">鉄分比較</span>
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
                  1. 鉄分の種類と特徴
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
              鉄分の種類と特徴
            </h2>

            <p
              className={`${typography.body} mb-8`}
              style={{ color: appleWebColors.textSecondary }}
            >
              鉄分サプリは形態によって吸収率と副作用が大きく異なります。
              自分に合った形態を選ぶことが継続のカギです。
            </p>

            <div className="grid gap-4">
              {IRON_TYPES.map((type) => (
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
                        副作用: {type.sideEffect}
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
                    <div style={{ color: appleWebColors.textSecondary }}>
                      <span>タイミング: </span>
                      <span
                        className="font-medium"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {rec.timing}
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
                href="/search?ingredient=iron"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[15px] font-medium text-white"
                style={{ backgroundColor: systemColors.blue }}
              >
                すべての鉄分サプリを見る
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
                    className="text-[18px] font-bold mb-1"
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
                    className="text-[18px] font-bold mb-1"
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
                    className="text-[18px] font-bold mb-1"
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
              background: `linear-gradient(135deg, ${systemColors.red}08 0%, ${systemColors.orange}08 100%)`,
            }}
          >
            <h2
              className={`${typography.title2} mb-3`}
              style={{ color: appleWebColors.textPrimary }}
            >
              あなたに最適な鉄分サプリを見つけよう
            </h2>
            <p
              className={`${typography.body} mb-6`}
              style={{ color: appleWebColors.textSecondary }}
            >
              形態別の吸収率、副作用、価格を比較して最適な製品を選びましょう
            </p>
            <Link
              href="/ingredients/iron"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-[15px] font-semibold text-white"
              style={{ backgroundColor: systemColors.blue }}
            >
              鉄成分ガイドを見る
              <ArrowRight size={16} />
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
