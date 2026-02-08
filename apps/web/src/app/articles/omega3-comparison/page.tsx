/**
 * オメガ3（フィッシュオイル）比較記事ページ
 * SEO最適化された比較コンテンツ
 * 統一テンプレート v2.0
 */

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { sanity } from "@/lib/sanity.client";
import { calculateEffectiveCostPerDay } from "@/lib/cost";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Target,
  Clock,
  Heart,
  Shield,
  BadgeCheck,
  Info,
  ExternalLink,
  Brain,
  Eye,
  Fish,
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
    "【2026年最新】オメガ3（フィッシュオイル）おすすめ比較｜EPA・DHA含有量で徹底分析",
  description:
    "オメガ3サプリをEPA/DHA比率・純度・酸化防止で徹底比較。魚油・クリルオイル・藻類由来の違い、効果的な選び方を解説。",
  publishedAt: "2025-01-19",
  updatedAt: new Date().toISOString().split("T")[0],
  ingredientName: "オメガ3脂肪酸",
  ingredientSlug: "omega-3",
};

const ogImageUrl = getArticleOGImage("omega3-comparison");
const ogImage = generateOGImageMeta(ogImageUrl, "オメガ3比較 - サプティア");

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
    "2026",
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

// この記事でわかること
const LEARNING_POINTS = [
  "オメガ3サプリの形態と吸収率の違い（魚油・クリルオイル・藻類由来など）",
  "目的別（心血管・脳・目・妊娠中）の最適な選び方",
  "コスパランキングTOP3とEPA+DHA1000mgあたりの価格",
  "効果的な摂取タイミングと酸化を防ぐ保存方法",
  "EPAとDHAの違いと最適なバランス",
];

// 結論ファースト
const QUICK_RECOMMENDATIONS = [
  {
    label: "コスパ重視なら",
    recommendation: "フィッシュオイル（魚油）",
    reason: "安価で効率的にEPA・DHAを摂取可能。",
  },
  {
    label: "吸収率重視なら",
    recommendation: "クリルオイル",
    reason: "リン脂質結合型で吸収率が高い。",
  },
  {
    label: "心血管ケアなら",
    recommendation: "EPA特化型",
    reason: "中性脂肪の低下に効果的。",
  },
  {
    label: "脳・目の健康なら",
    recommendation: "DHA特化型",
    reason: "認知機能と視力のサポートに。",
  },
  {
    label: "ヴィーガンなら",
    recommendation: "藻類由来DHA",
    reason: "植物由来で魚を使わずDHA摂取可能。",
  },
];

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
    emoji: "❤️",
    description: "中性脂肪が気になる、動脈硬化予防",
    recommendation: "高濃度EPA/DHA または EPA特化型",
    reason:
      "EPAは中性脂肪の低下に効果的。アメリカ心臓協会も推奨。食事と一緒に摂ると吸収UP。",
    tips: "EPA+DHA 2000-4000mg/日が目安。医師への相談も推奨。",
  },
  {
    purpose: "脳・認知機能",
    icon: Brain,
    emoji: "🧠",
    description: "集中力向上、記憶力サポート、認知症予防",
    recommendation: "DHA特化型 または クリルオイル",
    reason:
      "DHAは脳の構成成分の約20%を占める。アスタキサンチン入りのクリルオイルも効果的。",
    tips: "DHA 500-1000mg/日が目安。長期継続が重要。",
  },
  {
    purpose: "目の健康",
    icon: Eye,
    emoji: "👁️",
    description: "ドライアイ、眼精疲労、視力サポート",
    recommendation: "DHA特化型",
    reason: "DHAは網膜の主要構成成分。視覚機能の維持に重要な役割。",
    tips: "DHA 500mg以上/日。ルテイン・ゼアキサンチンとの併用も効果的。",
  },
  {
    purpose: "妊娠・授乳中",
    icon: Heart,
    emoji: "🤰",
    description: "胎児の脳発達、母乳の質向上",
    recommendation: "藻類由来DHA または 高純度魚油",
    reason: "DHAは胎児の脳・神経発達に必須。水銀リスクの低い製品を選択。",
    tips: "DHA 200-300mg/日。藻類由来なら水銀の心配なし。",
  },
  {
    purpose: "炎症・関節ケア",
    icon: Shield,
    emoji: "🛡️",
    description: "関節痛、慢性炎症、運動後の回復",
    recommendation: "EPA特化型 または 高濃度魚油",
    reason: "EPAは抗炎症作用が強い。関節リウマチにも研究エビデンスあり。",
    tips: "EPA 1500-3000mg/日。継続摂取で効果を実感。",
  },
];

// 選び方チェックリスト
const SELECTION_CHECKLIST = [
  {
    item: "EPA・DHA含有量を確認",
    description:
      "「オメガ3」ではなく「EPA+DHA」の合計量で比較。1日分で1000mg以上が目安。",
    important: true,
  },
  {
    item: "形態（TG型/EE型）を確認",
    description:
      "トリグリセリド型（TG型）は吸収率が高い。エチルエステル型（EE型）は安価だが吸収率はやや劣る。",
    important: true,
  },
  {
    item: "品質認証を確認",
    description:
      "IFOS認証、分子蒸留で重金属・PCB除去済み、第三者機関テストなど。",
    important: true,
  },
  {
    item: "酸化防止対策を確認",
    description:
      "ビタミンE配合、窒素充填、遮光ボトルなど。酸化した魚油は逆効果。",
    important: false,
  },
  {
    item: "エンテリックコーティングの有無",
    description: "胃で溶けず腸で吸収される設計。魚臭さ・げっぷを軽減。",
    important: false,
  },
];

// 摂取量ガイド
const DOSAGE_GUIDE = [
  {
    purpose: "一般的な健康維持",
    amount: "EPA+DHA 1000mg/日",
    frequency: "1日1〜2回",
    note: "食事と一緒に摂取すると吸収UP",
  },
  {
    purpose: "心血管ケア",
    amount: "EPA+DHA 2000-4000mg/日",
    frequency: "1日2〜3回に分けて",
    note: "高用量は医師に相談を推奨",
  },
  {
    purpose: "脳・認知機能",
    amount: "DHA 500-1000mg/日",
    frequency: "1日1〜2回",
    note: "長期継続が重要。3ヶ月以上で効果実感",
  },
  {
    purpose: "妊娠・授乳中",
    amount: "DHA 200-300mg/日",
    frequency: "1日1回",
    note: "高純度製品または藻類由来を選択",
  },
  {
    purpose: "炎症・関節ケア",
    amount: "EPA 1500-3000mg/日",
    frequency: "1日2〜3回に分けて",
    note: "抗炎症効果を重視するならEPA多めを",
  },
];

// 注意点・副作用
const CAUTIONS = [
  {
    title: "血液凝固への影響",
    description:
      "高用量（3000mg以上/日）は出血時間を延長する可能性。抗凝固薬服用中は医師に相談。手術前は中断が必要な場合も。",
    severity: "warning",
  },
  {
    title: "魚アレルギー",
    description:
      "魚由来製品はアレルギー反応の可能性。魚アレルギーの方は藻類由来DHAを選択。",
    severity: "warning",
  },
  {
    title: "酸化・品質劣化",
    description:
      "開封後は冷蔵庫保存し、2〜3ヶ月以内に使い切る。異臭がする場合は酸化の可能性。酸化した魚油は有害。",
    severity: "warning",
  },
  {
    title: "魚臭さ・げっぷ",
    description:
      "エンテリックコーティング製品を選ぶか、冷凍して摂取すると軽減。食事と一緒に摂取も有効。",
    severity: "info",
  },
  {
    title: "医薬品との相互作用",
    description:
      "血圧降下薬、血糖降下薬との併用で効果が増強される可能性。服用中の方は医師に相談。",
    severity: "info",
  },
];

// FAQ
const FAQS = [
  {
    question: "EPAとDHAどちらを重視すべき？",
    answer:
      "目的により異なります。中性脂肪・炎症対策ならEPAを重視、脳・目の健康ならDHAを重視してください。一般的な健康維持なら両方バランスよく含む製品がおすすめです。EPA:DHA = 3:2や2:1など、様々な比率の製品があります。",
  },
  {
    question: "魚を食べていればサプリは不要？",
    answer:
      "週に2〜3回、サバ・イワシ・サンマなど脂ののった青魚を食べていれば、基本的な量は摂取できます。ただし、魚を食べる機会が少ない方、心血管ケアなど特定の健康目的がある方はサプリでの補給が有効です。",
  },
  {
    question: "クリルオイルと魚油どちらが良い？",
    answer:
      "クリルオイルは吸収率が高く、抗酸化成分（アスタキサンチン）も含みますが、価格は高め。コスパ重視なら高純度の魚油、吸収率・抗酸化重視ならクリルオイルがおすすめです。効果の体感は個人差があります。",
  },
  {
    question: "妊娠中でも摂取できる？",
    answer:
      "DHAは胎児の脳発達に非常に重要です。ただし、大型魚由来の製品は水銀リスクがあるため、高純度製品（分子蒸留済み）や藻類由来DHAを選んでください。摂取量は医師と相談することをおすすめします。",
  },
  {
    question: "オメガ3は酸化しやすい？保存方法は？",
    answer:
      "非常に酸化しやすい脂質です。開封後は冷蔵庫で保存し、2〜3ヶ月以内に使い切りましょう。酸化すると効果が減少するだけでなく、むしろ有害になる可能性があります。異臭がする場合は廃棄してください。",
  },
  {
    question: "いつ飲むのがベスト？",
    answer:
      "食事と一緒に摂取するのが最も効果的です。脂質と一緒に摂ることで吸収率が向上します。特に朝食や夕食など、ある程度脂質を含む食事と一緒に摂るのがおすすめです。空腹時は吸収が落ち、胃に負担がかかることも。",
  },
  {
    question: "子どもでも飲んで大丈夫？",
    answer:
      "DHAは子どもの脳発達にも重要です。子ども向けのグミタイプや低用量製品が販売されています。大人向けの高用量製品は避け、年齢に応じた製品を選んでください。気になる場合は小児科医に相談を。",
  },
];

// 関連成分
const RELATED_INGREDIENTS = [
  {
    name: "ビタミンD",
    slug: "vitamin-d",
    emoji: "☀️",
    reason: "魚油に天然含有。骨・免疫をWサポート",
  },
  {
    name: "ビタミンE",
    slug: "vitamin-e",
    emoji: "🌾",
    reason: "オメガ3の酸化を防ぐ抗酸化成分",
  },
  {
    name: "CoQ10",
    slug: "coq10",
    emoji: "⚡",
    reason: "心臓の健康を相乗サポート",
  },
  {
    name: "アスタキサンチン",
    slug: "astaxanthin",
    emoji: "🦐",
    reason: "クリルオイルに含有。強力な抗酸化",
  },
];

export default async function Omega3ComparisonPage() {
  const products = await getOmega3Products();

  const productsWithCost = products
    .filter(
      (p) =>
        p.priceJPY > 0 && p.servingsPerContainer > 0 && p.servingsPerDay > 0,
    )
    .map((product) => {
      const effectiveCostPerDay = calculateEffectiveCostPerDay({
        priceJPY: product.priceJPY,
        servingsPerContainer: product.servingsPerContainer,
        servingsPerDay: product.servingsPerDay,
      });

      const omega3Ingredient = product.ingredients?.find(
        (i) =>
          i.ingredient?.name?.includes("オメガ") ||
          i.ingredient?.name?.includes("EPA") ||
          i.ingredient?.name?.includes("DHA"),
      );
      const mgPerServing = omega3Ingredient?.amountMgPerServing || 0;
      const pricePerMg =
        mgPerServing > 0
          ? product.priceJPY / (mgPerServing * product.servingsPerContainer)
          : 0;

      return {
        ...product,
        effectiveCostPerDay,
        mgPerServing,
        pricePerMg,
      };
    })
    .sort((a, b) => a.effectiveCostPerDay - b.effectiveCostPerDay);

  const top3Products = productsWithCost.slice(0, 3);

  return (
    <article
      className="min-h-screen"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
      {/* 1. パンくずリスト（sticky） */}
      <div
        className={`sticky top-0 z-10 border-b ${liquidGlassClasses.light}`}
        style={{ borderColor: appleWebColors.borderSubtle }}
      >
        <div className="mx-auto px-4 sm:px-6 py-3 max-w-4xl">
          <nav className="flex items-center gap-2 text-[13px]">
            <Link
              href="/"
              className="hover:opacity-70 transition-opacity"
              style={{ color: systemColors.blue }}
            >
              ホーム
            </Link>
            <span style={{ color: appleWebColors.textSecondary }}>/</span>
            <Link
              href="/articles"
              className="hover:opacity-70 transition-opacity"
              style={{ color: systemColors.blue }}
            >
              記事一覧
            </Link>
            <span style={{ color: appleWebColors.textSecondary }}>/</span>
            <span style={{ color: appleWebColors.textSecondary }}>
              オメガ3比較
            </span>
          </nav>
        </div>
      </div>

      {/* 2. ヒーローセクション */}
      <header className="pt-8 pb-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="px-3 py-1 text-[12px] font-medium rounded-full"
              style={{
                backgroundColor: systemColors.blue + "15",
                color: systemColors.blue,
              }}
            >
              <Fish size={12} className="inline mr-1" />
              脂肪酸
            </span>
            <span
              className="px-3 py-1 text-[12px] font-medium rounded-full"
              style={{
                backgroundColor: systemColors.green + "15",
                color: systemColors.green,
              }}
            >
              {products.length}商品を比較
            </span>
          </div>

          <h1
            className={`${typography.title1} md:${typography.largeTitle} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            {ARTICLE_DATA.title}
          </h1>

          <p
            className={`${typography.body} mb-6`}
            style={{ color: appleWebColors.textSecondary }}
          >
            {ARTICLE_DATA.description}
          </p>

          <div
            className={`flex items-center gap-4 ${typography.footnote}`}
            style={{ color: appleWebColors.textSecondary }}
          >
            <time dateTime={ARTICLE_DATA.publishedAt}>
              公開: {ARTICLE_DATA.publishedAt}
            </time>
            <time dateTime={ARTICLE_DATA.updatedAt}>
              更新: {ARTICLE_DATA.updatedAt}
            </time>
          </div>

          <ArticleEyecatch
            src={ogImageUrl}
            alt={`${ARTICLE_DATA.title} - アイキャッチ画像`}
          />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        {/* 3. 目次 */}
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
              <a href="#learning-points" className="hover:opacity-70">
                1. この記事でわかること
              </a>
            </li>
            <li>
              <a href="#quick-recommendation" className="hover:opacity-70">
                2. 結論ファースト（迷ったらこれ）
              </a>
            </li>
            <li>
              <a href="#types" className="hover:opacity-70">
                3. 種類と特徴
              </a>
            </li>
            <li>
              <a href="#purpose" className="hover:opacity-70">
                4. 目的別おすすめ
              </a>
            </li>
            <li>
              <a href="#ranking" className="hover:opacity-70">
                5. おすすめ商品ランキング
              </a>
            </li>
            <li>
              <a href="#checklist" className="hover:opacity-70">
                6. 選び方チェックリスト
              </a>
            </li>
            <li>
              <a href="#dosage" className="hover:opacity-70">
                7. 摂取量・タイミング
              </a>
            </li>
            <li>
              <a href="#cautions" className="hover:opacity-70">
                8. 注意点・副作用
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:opacity-70">
                9. よくある質問（FAQ）
              </a>
            </li>
            <li>
              <a href="#related" className="hover:opacity-70">
                10. 関連成分
              </a>
            </li>
          </ol>
        </nav>

        {/* 4. この記事でわかること */}
        <section
          id="learning-points"
          className={`${liquidGlassClasses.light} rounded-[20px] p-6 mb-12 border scroll-mt-20`}
          style={{ borderColor: systemColors.blue + "30" }}
        >
          <h2
            className={`${typography.title3} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            この記事でわかること
          </h2>
          <ul className="space-y-3">
            {LEARNING_POINTS.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2
                  size={20}
                  className="shrink-0 mt-0.5"
                  style={{ color: systemColors.blue }}
                />
                <span style={{ color: appleWebColors.textPrimary }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* 5. 結論ファースト */}
        <section
          id="quick-recommendation"
          className="mb-12 rounded-[20px] p-6 md:p-8 scroll-mt-20"
          style={{
            background: `linear-gradient(135deg, ${systemColors.blue}15, ${systemColors.cyan}15)`,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: systemColors.blue }}
            >
              <Lightbulb size={24} className="text-white" />
            </div>
            <div>
              <h2
                className={`${typography.title3} mb-3`}
                style={{ color: appleWebColors.textPrimary }}
              >
                結論：迷ったらこれを選べ
              </h2>
              <ul className="space-y-2 text-[15px]">
                {QUICK_RECOMMENDATIONS.map((rec, i) => (
                  <li key={i} style={{ color: appleWebColors.textPrimary }}>
                    <strong>{rec.label}</strong>→{rec.recommendation}。
                    {rec.reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 6. 種類と特徴 */}
        <section id="types" className="mb-12 scroll-mt-20">
          <h2
            className={`${typography.title2} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            オメガ3サプリの種類と選び方
          </h2>
          <p
            className="text-[15px] leading-[1.7] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            オメガ3脂肪酸には様々な形態があり、原料や製法によって吸収率・価格・特性が異なります。
            「オメガ3配合」と書いてあっても、EPA・DHAの実際の含有量は製品によって大きく違います。
          </p>

          <div className="space-y-4">
            {OMEGA3_TYPES.map((type) => (
              <div
                key={type.name}
                className={`${liquidGlassClasses.light} rounded-[16px] p-5 border-l-4`}
                style={{ borderLeftColor: type.color }}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <h3
                      className="font-bold text-[17px] mb-1"
                      style={{ color: appleWebColors.textPrimary }}
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
                      className="text-[14px] leading-[1.6]"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      {type.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 md:flex-col md:gap-1 md:text-right">
                    <span
                      className="text-[13px] px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: appleWebColors.sectionBackground,
                        color: appleWebColors.textSecondary,
                      }}
                    >
                      吸収: {type.absorption}
                    </span>
                    <span
                      className="text-[13px] px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: appleWebColors.sectionBackground,
                        color: appleWebColors.textSecondary,
                      }}
                    >
                      価格: {type.price}
                    </span>
                    <span
                      className="text-[13px] px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: appleWebColors.sectionBackground,
                        color: appleWebColors.textSecondary,
                      }}
                    >
                      純度: {type.purity}
                    </span>
                  </div>
                </div>
                <div
                  className="mt-3 pt-3 border-t text-[13px]"
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  <span style={{ color: type.color }}>
                    <Target size={14} className="inline mr-1" />
                    おすすめ: {type.best}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. 目的別おすすめ */}
        <section id="purpose" className="mb-12 scroll-mt-20">
          <h2
            className={`${typography.title2} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            目的別｜あなたに合ったオメガ3はこれ
          </h2>
          <p
            className="text-[15px] leading-[1.7] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            「結局どれを買えばいいの？」という方のために、目的別におすすめをまとめました。
          </p>

          <div className="space-y-4">
            {PURPOSE_RECOMMENDATIONS.map((rec) => {
              const Icon = rec.icon;
              return (
                <div
                  key={rec.purpose}
                  className={`${liquidGlassClasses.light} rounded-[20px] p-5 border`}
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{rec.emoji}</span>
                    <div className="flex-1">
                      <h3
                        className="font-bold text-[17px] mb-1"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {rec.purpose}
                      </h3>
                      <p
                        className="text-[14px] mb-3"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        {rec.description}
                      </p>
                      <div
                        className="bg-white/50 rounded-[12px] p-4"
                        style={{ borderColor: appleWebColors.borderSubtle }}
                      >
                        <p
                          className="font-bold text-[15px] mb-2"
                          style={{ color: systemColors.blue }}
                        >
                          → {rec.recommendation}
                        </p>
                        <p
                          className="text-[14px] mb-2"
                          style={{ color: appleWebColors.textSecondary }}
                        >
                          {rec.reason}
                        </p>
                        <p
                          className="text-[13px] flex items-center gap-1"
                          style={{ color: appleWebColors.textTertiary }}
                        >
                          <Lightbulb size={14} />
                          {rec.tips}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 8. コスパランキング */}
        <section id="ranking" className="mb-12 scroll-mt-20">
          <h2
            className={`${typography.title2} mb-2`}
            style={{ color: appleWebColors.textPrimary }}
          >
            コスパランキングTOP3｜オメガ3サプリ
          </h2>
          <p
            className="text-[15px] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            1日あたりのコストで比較した、最もお得なオメガ3サプリメントです。
          </p>

          <div className="space-y-4">
            {top3Products.map((product, index) => (
              <Link
                key={product._id}
                href={`/products/${product.slug.current}`}
                className={`${liquidGlassClasses.light} rounded-[20px] p-5 flex gap-4 border transition-all hover:shadow-lg hover:-translate-y-0.5`}
                style={{ borderColor: appleWebColors.borderSubtle }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-white"
                  style={{
                    background:
                      index === 0
                        ? "linear-gradient(135deg, #FFD700, #FFA500)"
                        : index === 1
                          ? "linear-gradient(135deg, #C0C0C0, #A0A0A0)"
                          : "linear-gradient(135deg, #CD7F32, #8B4513)",
                  }}
                >
                  {index + 1}
                </div>

                {product.externalImageUrl && (
                  <div className="w-20 h-20 relative shrink-0 bg-white rounded-[12px] overflow-hidden">
                    <Image
                      src={product.externalImageUrl}
                      alt={product.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3
                    className="font-bold text-[15px] mb-1 line-clamp-2"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    {product.name}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
                    <span style={{ color: appleWebColors.textSecondary }}>
                      価格:{" "}
                      <span
                        className="font-bold"
                        style={{ color: systemColors.blue }}
                      >
                        ¥{product.priceJPY.toLocaleString()}
                      </span>
                    </span>
                    <span style={{ color: appleWebColors.textSecondary }}>
                      1日:{" "}
                      <span
                        className="font-bold"
                        style={{ color: systemColors.green }}
                      >
                        ¥{product.effectiveCostPerDay.toFixed(1)}
                      </span>
                    </span>
                    {product.mgPerServing > 0 && (
                      <span style={{ color: appleWebColors.textSecondary }}>
                        含有量:{" "}
                        <span className="font-bold">
                          {product.mgPerServing}mg
                        </span>
                      </span>
                    )}
                  </div>
                  {product.tierRatings?.overallRank && (
                    <span
                      className="inline-block mt-2 px-2 py-0.5 text-[11px] font-bold rounded"
                      style={{
                        backgroundColor:
                          product.tierRatings.overallRank === "S+"
                            ? "#FFD700"
                            : product.tierRatings.overallRank === "S"
                              ? "#AF52DE"
                              : product.tierRatings.overallRank === "A"
                                ? "#007AFF"
                                : "#34C759",
                        color: "white",
                      }}
                    >
                      {product.tierRatings.overallRank}ランク
                    </span>
                  )}
                </div>

                <ArrowRight
                  size={20}
                  className="shrink-0 self-center"
                  style={{ color: appleWebColors.textSecondary }}
                />
              </Link>
            ))}
          </div>

          {products.length === 0 && (
            <div
              className={`${liquidGlassClasses.light} rounded-[16px] p-8 text-center`}
            >
              <p style={{ color: appleWebColors.textSecondary }}>
                現在、オメガ3サプリメントの商品データを準備中です。
              </p>
            </div>
          )}
        </section>

        {/* 9. 選び方チェックリスト */}
        <section id="checklist" className="mb-12 scroll-mt-20">
          <h2
            className={`${typography.title2} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            購入前チェックリスト
          </h2>
          <div
            className={`${liquidGlassClasses.light} rounded-[20px] p-6 border`}
            style={{ borderColor: appleWebColors.borderSubtle }}
          >
            <div className="space-y-4">
              {SELECTION_CHECKLIST.map((check, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      backgroundColor: check.important
                        ? systemColors.blue
                        : appleWebColors.sectionBackground,
                    }}
                  >
                    {check.important ? (
                      <BadgeCheck size={14} className="text-white" />
                    ) : (
                      <CheckCircle2
                        size={14}
                        style={{ color: appleWebColors.textTertiary }}
                      />
                    )}
                  </div>
                  <div>
                    <h3
                      className="font-bold text-[15px]"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {check.item}
                      {check.important && (
                        <span
                          className="ml-2 text-[11px] px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: systemColors.blue + "20",
                            color: systemColors.blue,
                          }}
                        >
                          重要
                        </span>
                      )}
                    </h3>
                    <p
                      className="text-[14px]"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      {check.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. 摂取量ガイド */}
        <section id="dosage" className="mb-12 scroll-mt-20">
          <h2
            className={`${typography.title2} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            目的別｜摂取量の目安
          </h2>
          <p
            className="text-[15px] leading-[1.7] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            オメガ3は目的に応じて適切な量を摂取することが大切です。高用量摂取は医師への相談を推奨します。
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr
                  className="border-b"
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  <th
                    className="text-left py-3 px-4 font-bold"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    目的
                  </th>
                  <th
                    className="text-left py-3 px-4 font-bold"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    1日の目安
                  </th>
                  <th
                    className="text-left py-3 px-4 font-bold"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    回数
                  </th>
                  <th
                    className="text-left py-3 px-4 font-bold"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    備考
                  </th>
                </tr>
              </thead>
              <tbody>
                {DOSAGE_GUIDE.map((guide, index) => (
                  <tr
                    key={index}
                    className="border-b"
                    style={{ borderColor: appleWebColors.borderSubtle }}
                  >
                    <td
                      className="py-3 px-4"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {guide.purpose}
                    </td>
                    <td
                      className="py-3 px-4 font-bold"
                      style={{ color: systemColors.blue }}
                    >
                      {guide.amount}
                    </td>
                    <td
                      className="py-3 px-4"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      {guide.frequency}
                    </td>
                    <td
                      className="py-3 px-4 text-[13px]"
                      style={{ color: appleWebColors.textTertiary }}
                    >
                      {guide.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 11. 注意点・副作用 */}
        <section id="cautions" className="mb-12 scroll-mt-20">
          <h2
            className={`${typography.title2} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            注意点・副作用
          </h2>
          <p
            className="text-[15px] leading-[1.7] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            オメガ3は適量なら安全ですが、高用量摂取や特定の条件では注意が必要です。
          </p>

          <div className="space-y-3">
            {CAUTIONS.map((caution, index) => (
              <div
                key={index}
                className={`rounded-[12px] p-4 flex items-start gap-3`}
                style={{
                  backgroundColor:
                    caution.severity === "warning"
                      ? systemColors.orange + "15"
                      : systemColors.blue + "15",
                }}
              >
                {caution.severity === "warning" ? (
                  <AlertTriangle
                    size={20}
                    className="shrink-0 mt-0.5"
                    style={{ color: systemColors.orange }}
                  />
                ) : (
                  <Info
                    size={20}
                    className="shrink-0 mt-0.5"
                    style={{ color: systemColors.blue }}
                  />
                )}
                <div>
                  <h3
                    className="font-bold text-[15px]"
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
            ))}
          </div>
        </section>

        {/* 12. FAQ */}
        <section id="faq" className="mb-12 scroll-mt-20">
          <h2
            className={`${typography.title2} mb-6`}
            style={{ color: appleWebColors.textPrimary }}
          >
            よくある質問
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className={`${liquidGlassClasses.light} rounded-[16px] p-5 border`}
                style={{ borderColor: appleWebColors.borderSubtle }}
              >
                <h3
                  className="font-bold text-[15px] mb-3"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  Q. {faq.question}
                </h3>
                <p
                  className="text-[14px] leading-[1.8]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  A. {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 13. 関連成分 */}
        <section id="related" className="mb-12 scroll-mt-20">
          <h2
            className={`${typography.title2} mb-6`}
            style={{ color: appleWebColors.textPrimary }}
          >
            オメガ3と一緒に摂りたい成分
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {RELATED_INGREDIENTS.map((ingredient) => (
              <Link
                key={ingredient.slug}
                href={`/ingredients/${ingredient.slug}`}
                className={`${liquidGlassClasses.light} rounded-[16px] p-4 flex items-center gap-4 border transition-all hover:shadow-md`}
                style={{ borderColor: appleWebColors.borderSubtle }}
              >
                <span className="text-2xl">{ingredient.emoji}</span>
                <div className="flex-1">
                  <h3
                    className="font-bold text-[15px]"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    {ingredient.name}
                  </h3>
                  <p
                    className="text-[13px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    {ingredient.reason}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  style={{ color: appleWebColors.textSecondary }}
                />
              </Link>
            ))}
          </div>
        </section>

        {/* 14. CTA */}
        <section
          className="rounded-[20px] p-8 text-center text-white"
          style={{
            background: `linear-gradient(135deg, ${systemColors.blue}, ${systemColors.cyan})`,
          }}
        >
          <h2 className={`${typography.title2} mb-4`}>
            オメガ3サプリをもっと詳しく比較
          </h2>
          <p className="text-[15px] opacity-90 mb-6">
            サプティアでは、5つの評価軸で商品を比較できます
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products?ingredient=omega-3"
              className="inline-flex items-center justify-center gap-2 bg-white font-bold px-6 py-3 rounded-[12px] transition-colors hover:bg-gray-100"
              style={{ color: systemColors.blue }}
            >
              全商品を見る
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/ingredients/omega-3"
              className="inline-flex items-center justify-center gap-2 bg-white/20 font-medium px-6 py-3 rounded-[12px] transition-colors hover:bg-white/30"
            >
              オメガ3成分ガイド
              <ExternalLink size={16} />
            </Link>
          </div>
        </section>
      </div>

      {/* 構造化データ: Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
              "@id": `https://suptia.com/articles/${ARTICLE_DATA.ingredientSlug}-comparison`,
            },
          }),
        }}
      />

      {/* 構造化データ: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "ホーム",
                item: "https://suptia.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "記事一覧",
                item: "https://suptia.com/articles",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: `${ARTICLE_DATA.ingredientName}サプリ比較`,
              },
            ],
          }),
        }}
      />

      {/* 構造化データ: ItemList（商品ランキング） */}
      {top3Products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: `${ARTICLE_DATA.ingredientName}サプリ コスパランキング`,
              itemListElement: top3Products.map((product, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Product",
                  name: product.name,
                  url: `https://suptia.com/products/${product.slug.current}`,
                  offers: {
                    "@type": "Offer",
                    price: product.priceJPY,
                    priceCurrency: "JPY",
                  },
                },
              })),
            }),
          }}
        />
      )}

      {/* 構造化データ: FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
          }),
        }}
      />
    </article>
  );
}
