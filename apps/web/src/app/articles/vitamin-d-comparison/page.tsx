/**
 * ビタミンD比較記事ページ
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
  Sun,
  Bone,
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
  title: "【2025年最新】ビタミンDサプリおすすめ比較｜吸収率・安全性で徹底分析",
  description:
    "ビタミンDサプリメントをD2/D3の違い・吸収率・安全性・コスパで徹底比較。日本人の8割が不足と言われるビタミンD、最適な選び方を解説。",
  publishedAt: "2025-01-18",
  updatedAt: new Date().toISOString().split("T")[0],
  ingredientName: "ビタミンD",
  ingredientSlug: "vitamin-d",
};

// OGP画像を取得
const ogImageUrl = getArticleOGImage("vitamin-d-comparison");
const ogImage = generateOGImageMeta(
  ogImageUrl,
  "ビタミンDサプリメント比較 - Suptia",
);

export const metadata: Metadata = {
  title: ARTICLE_DATA.title,
  description: ARTICLE_DATA.description,
  keywords: [
    "ビタミンD",
    "サプリメント",
    "おすすめ",
    "比較",
    "D3",
    "コレカルシフェロール",
    "2025",
    "ランキング",
    "骨",
    "免疫",
    "日光",
  ],
  openGraph: {
    title: ARTICLE_DATA.title,
    description: ARTICLE_DATA.description,
    type: "article",
    publishedTime: ARTICLE_DATA.publishedAt,
    modifiedTime: ARTICLE_DATA.updatedAt,
    url: "https://suptia.com/articles/vitamin-d-comparison",
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
    canonical: "https://suptia.com/articles/vitamin-d-comparison",
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

async function getVitaminDProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && availability == "in-stock" && references(*[_type == "ingredient" && slug.current == "vitamin-d"]._id)] | order(priceJPY asc)[0...20]{
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
    console.error("Failed to fetch vitamin D products:", error);
    return [];
  }
}

// ビタミンDの種類データ
const VITAMIN_D_TYPES = [
  {
    name: "ビタミンD3（コレカルシフェロール）",
    nameEn: "Cholecalciferol",
    absorption: "◎ 高い",
    price: "○ 手頃",
    source: "動物由来",
    best: "効果を重視する方",
    description:
      "人間の体内で生成されるのと同じ形態。D2より血中濃度を効率よく上げられる。",
    color: systemColors.orange,
  },
  {
    name: "ビタミンD2（エルゴカルシフェロール）",
    nameEn: "Ergocalciferol",
    absorption: "○ 普通",
    price: "○ 手頃",
    source: "植物由来",
    best: "ヴィーガンの方",
    description:
      "キノコなど植物由来。D3より効果は劣るが、動物性原料を避けたい方に。",
    color: systemColors.green,
  },
  {
    name: "ビタミンD3+K2",
    nameEn: "D3 + K2",
    absorption: "◎ 高い",
    price: "△ やや高め",
    source: "動物由来",
    best: "骨の健康重視の方",
    description:
      "K2がカルシウムの骨への沈着を促進。相乗効果で骨密度維持をサポート。",
    color: systemColors.purple,
  },
  {
    name: "リキッドタイプ",
    nameEn: "Liquid D3",
    absorption: "◎ 高い",
    price: "△ やや高め",
    source: "動物由来",
    best: "錠剤が苦手な方",
    description:
      "オイルベースで吸収率が高い。用量調整も容易。子供や高齢者にも。",
    color: systemColors.cyan,
  },
  {
    name: "高用量タイプ（5000IU以上）",
    nameEn: "High Dose D3",
    absorption: "◎ 高い",
    price: "◎ コスパ良",
    source: "動物由来",
    best: "重度の欠乏症の方",
    description:
      "週1回の服用でも効果的。ただし過剰摂取リスクあり、血液検査推奨。",
    color: systemColors.red,
  },
];

// 目的別おすすめ
const PURPOSE_RECOMMENDATIONS = [
  {
    purpose: "骨の健康維持",
    icon: Bone,
    color: systemColors.purple,
    recommendation: "D3+K2タイプ",
    reason:
      "カルシウムを骨に届けるK2との組み合わせが最適。閉経後女性に特におすすめ。",
    products: ["D3+K2配合タイプ"],
  },
  {
    purpose: "免疫力サポート",
    icon: Shield,
    color: systemColors.blue,
    recommendation: "D3 1000-2000IU",
    reason: "免疫細胞の正常な機能に必要。風邪やインフルエンザ予防に。",
    products: ["標準用量D3"],
  },
  {
    purpose: "気分・メンタル",
    icon: Sun,
    color: systemColors.yellow,
    recommendation: "D3 2000-4000IU",
    reason: "セロトニン生成をサポート。冬季うつ対策や日照不足の方に。",
    products: ["中〜高用量D3"],
  },
  {
    purpose: "ヴィーガン対応",
    icon: Heart,
    color: systemColors.green,
    recommendation: "D2または苔類由来D3",
    reason: "動物性原料不使用。苔類由来のヴィーガンD3が効果的。",
    products: ["植物性D2", "苔類D3"],
  },
  {
    purpose: "コスパ重視",
    icon: DollarSign,
    color: systemColors.mint,
    recommendation: "高用量D3（5000IU）",
    reason: "週1-2回の服用で1日コストを抑える。1日あたり5円以下も可能。",
    products: ["高用量D3"],
  },
];

// 購入前チェックリスト
const SELECTION_CHECKLIST = [
  {
    title: "D3かD2か確認",
    description: "効果重視ならD3、ヴィーガンならD2（または苔類D3）を選択。",
    important: true,
  },
  {
    title: "用量（IU）を確認",
    description:
      "一般的な維持量は1000-2000IU/日。欠乏時は医師と相談の上4000IU以上も。",
    important: true,
  },
  {
    title: "油脂との組み合わせ",
    description:
      "脂溶性ビタミンのため、食事と一緒または油脂配合製品を選ぶと吸収率UP。",
    important: false,
  },
  {
    title: "K2配合の有無",
    description: "骨の健康重視ならK2配合製品がおすすめ。単独でも問題なし。",
    important: false,
  },
  {
    title: "第三者検査の有無",
    description:
      "高用量製品は特に品質管理が重要。GMP認証や第三者検査済みを推奨。",
    important: false,
  },
];

// 摂取量ガイド
const DOSAGE_GUIDE = [
  {
    purpose: "健康維持",
    amount: "600-1000IU",
    timing: "朝食後",
    note: "厚労省目安量。日光浴も併用推奨",
  },
  {
    purpose: "欠乏予防",
    amount: "1000-2000IU",
    timing: "食事と一緒",
    note: "血中25(OH)D 30ng/mL以上を目指す",
  },
  {
    purpose: "免疫サポート",
    amount: "2000-4000IU",
    timing: "朝食後",
    note: "冬季や日照不足時",
  },
  {
    purpose: "骨密度維持",
    amount: "1000-2000IU + K2",
    timing: "カルシウムと一緒",
    note: "閉経後女性、高齢者",
  },
  {
    purpose: "欠乏症治療",
    amount: "4000-10000IU",
    timing: "医師の指示",
    note: "必ず血液検査で確認",
  },
];

// 注意点
const CAUTIONS = [
  {
    title: "過剰摂取リスク",
    description:
      "脂溶性ビタミンのため体内に蓄積。10000IU/日を超える長期摂取は高カルシウム血症のリスク。",
    severity: "warning",
  },
  {
    title: "腎臓疾患がある方",
    description:
      "腎機能が低下しているとビタミンDの活性化に影響。摂取前に医師に相談を。",
    severity: "warning",
  },
  {
    title: "薬との相互作用",
    description:
      "ステロイド、抗てんかん薬、コレステロール薬などと相互作用の可能性。",
    severity: "info",
  },
  {
    title: "カルシウムとの関係",
    description:
      "ビタミンDはカルシウム吸収を高める。高カルシウム血症のリスクに注意。",
    severity: "info",
  },
  {
    title: "血液検査の推奨",
    description:
      "4000IU以上を長期摂取する場合は、25(OH)D血中濃度を定期的に測定することを推奨。",
    severity: "info",
  },
];

// FAQ
const FAQS = [
  {
    question: "ビタミンDはいつ飲むのが効果的？",
    answer:
      "脂溶性ビタミンのため、食事と一緒に摂取すると吸収率が高まります。特に朝食や昼食など、油脂を含む食事と一緒がおすすめです。夜の摂取は睡眠に影響する可能性があるため避ける方が良いでしょう。",
  },
  {
    question: "D2とD3、どちらを選ぶべき？",
    answer:
      "効果を重視するならD3（コレカルシフェロール）がおすすめです。D3はD2より血中ビタミンD濃度を効率的に上げることが研究で示されています。ただし、ヴィーガンの方はD2、または苔類由来のヴィーガンD3を選びましょう。",
  },
  {
    question: "日本人にビタミンDが不足しがちな理由は？",
    answer:
      "日本人の約8割がビタミンD不足と言われています。理由は、日焼け止めの使用、室内での生活時間の増加、魚の摂取量減少などです。特に冬季は日照時間が短く、皮膚でのビタミンD生成が難しくなります。",
  },
  {
    question: "ビタミンDの適正な血中濃度は？",
    answer:
      "血中25(OH)D濃度で30〜50ng/mL（75〜125nmol/L）が適正とされています。20ng/mL未満は欠乏、20〜30ng/mLは不足状態です。健康診断で測定できるので、サプリ摂取前後で確認することをおすすめします。",
  },
  {
    question: "ビタミンDとK2は一緒に摂るべき？",
    answer:
      "骨の健康を重視するなら、一緒に摂ることをおすすめします。ビタミンDがカルシウム吸収を促進し、K2がそのカルシウムを骨に届ける役割を果たします。ただし、K2なしでもビタミンD単独で十分な効果があります。",
  },
  {
    question: "どのくらいの期間で効果を実感できる？",
    answer:
      "血中ビタミンD濃度の上昇は2〜3ヶ月程度かかります。骨密度への効果は6ヶ月〜1年以上の継続が必要です。免疫機能や気分への効果は、個人差がありますが数週間〜数ヶ月で実感する方もいます。",
  },
  {
    question: "夏でもサプリは必要？",
    answer:
      "屋外活動が多く、日焼け止めを使わずに日光浴できるなら、夏は不要な場合もあります。ただし、日焼け止めを使用する方、室内で過ごすことが多い方は、夏でもサプリでの補給が推奨されます。血液検査で確認するのが確実です。",
  },
];

export default async function VitaminDComparisonPage() {
  const products = await getVitaminDProducts();

  // コスパ計算
  const productsWithCost = products.map((product) => {
    const vitaminDIngredient = product.ingredients?.find(
      (ing) =>
        ing.ingredient?.name?.includes("ビタミンD") ||
        ing.ingredient?.name?.includes("Vitamin D"),
    );
    const amountPerServing = vitaminDIngredient?.amountMgPerServing || 0;
    // ビタミンDはIU表記が多いため、mcgの場合は40倍してIUに変換
    const amountIU =
      amountPerServing < 1 ? amountPerServing * 40 : amountPerServing;
    const costPerDay = calculateEffectiveCostPerDay({
      priceJPY: product.priceJPY,
      servingsPerContainer: product.servingsPerContainer,
      servingsPerDay: product.servingsPerDay,
    });
    const costPerIU = amountIU > 0 ? costPerDay / amountIU : Infinity;

    return {
      ...product,
      amountPerServing: amountIU,
      costPerDay,
      costPerIU,
    };
  });

  // コスパ順にソート
  const sortedByCost = [...productsWithCost]
    .filter((p) => p.costPerIU < Infinity && p.costPerIU > 0)
    .sort((a, b) => a.costPerIU - b.costPerIU);

  const top3Products = sortedByCost.slice(0, 3);
  const otherProducts = sortedByCost.slice(3);

  // Schema.org構造化データ
  const faqSchema = {
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

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: ARTICLE_DATA.title,
    description: ARTICLE_DATA.description,
    datePublished: ARTICLE_DATA.publishedAt,
    dateModified: ARTICLE_DATA.updatedAt,
    author: {
      "@type": "Organization",
      name: "サプティア",
      url: "https://suptia.com",
    },
    publisher: {
      "@type": "Organization",
      name: "サプティア",
      url: "https://suptia.com",
    },
  };

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
      {/* 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* ヘッダー */}
      <header className="pt-8 pb-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="px-3 py-1 text-[12px] font-medium rounded-full"
              style={{
                backgroundColor: systemColors.yellow + "15",
                color: systemColors.orange,
              }}
            >
              比較記事
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
        {/* この記事でわかること */}
        <section
          className={`${liquidGlassClasses.light} rounded-[20px] p-6 mb-12 border`}
          style={{ borderColor: systemColors.orange + "30" }}
        >
          <h2
            className={`${typography.title3} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            この記事でわかること
          </h2>
          <ul className="space-y-3">
            {[
              "ビタミンD2とD3の違い、選び方のポイント",
              "日本人の8割が不足している理由と対策",
              "骨・免疫・メンタルなど目的別のおすすめ商品",
              "適切な摂取量と過剰摂取のリスク",
              "血液検査で確認すべき数値の目安",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2
                  size={20}
                  className="shrink-0 mt-0.5"
                  style={{ color: systemColors.orange }}
                />
                <span style={{ color: appleWebColors.textPrimary }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* 結論ファースト */}
        <section
          className="mb-12 rounded-[20px] p-6 md:p-8"
          style={{
            background: `linear-gradient(135deg, ${systemColors.orange}15, ${systemColors.yellow}15)`,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: systemColors.orange }}
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
                <li style={{ color: appleWebColors.textPrimary }}>
                  <strong>効果重視なら</strong>
                  →ビタミンD3（コレカルシフェロール）。D2より効率的。
                </li>
                <li style={{ color: appleWebColors.textPrimary }}>
                  <strong>骨の健康重視なら</strong>
                  →D3+K2配合タイプ。カルシウムを骨に届ける。
                </li>
                <li style={{ color: appleWebColors.textPrimary }}>
                  <strong>ヴィーガンなら</strong>
                  →苔類由来D3またはD2。植物性で安心。
                </li>
                <li style={{ color: appleWebColors.textPrimary }}>
                  <strong>用量の目安</strong>
                  →1000〜2000IU/日が一般的。欠乏時は医師に相談。
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ビタミンDの種類比較 */}
        <section className="mb-12">
          <h2
            className={`${typography.title2} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            ビタミンDサプリの種類と選び方
          </h2>
          <p
            className="text-[15px] leading-[1.7] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            ビタミンDサプリは大きく5つのタイプに分かれます。それぞれの特徴を理解して、あなたに合ったものを選びましょう。
          </p>
          <div className="space-y-4">
            {VITAMIN_D_TYPES.map((type, index) => (
              <div
                key={index}
                className={`${liquidGlassClasses.light} rounded-[16px] p-5 border-l-4`}
                style={{ borderLeftColor: type.color }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="flex-1">
                    <h3
                      className="font-bold text-[17px] mb-1"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {type.name}
                    </h3>
                    <p
                      className="text-[13px] mb-2"
                      style={{ color: appleWebColors.textSecondary }}
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
                      原料: {type.source}
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

        {/* 目的別おすすめ */}
        <section className="mb-12">
          <h2
            className={`${typography.title2} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            目的別｜あなたに合ったビタミンDはこれ
          </h2>
          <p
            className="text-[15px] leading-[1.7] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            あなたの目的に合わせて、最適なビタミンDの種類と用量を選びましょう。
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {PURPOSE_RECOMMENDATIONS.map((rec, index) => {
              const Icon = rec.icon;
              return (
                <div
                  key={index}
                  className={`${liquidGlassClasses.light} rounded-[16px] p-5 border`}
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: rec.color + "20" }}
                    >
                      <Icon size={20} style={{ color: rec.color }} />
                    </div>
                    <h3
                      className="font-bold text-[17px]"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {rec.purpose}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <p
                      className="font-bold text-[15px]"
                      style={{ color: rec.color }}
                    >
                      → {rec.recommendation}
                    </p>
                    <p
                      className="text-[14px] leading-[1.6]"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      {rec.reason}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* コスパランキング */}
        <section className="mb-12">
          <h2
            className={`${typography.title2} mb-2`}
            style={{ color: appleWebColors.textPrimary }}
          >
            コスパランキングTOP3｜ビタミンDサプリ
          </h2>
          <p
            className="text-[15px] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            1日あたりのコストとIU単価で算出した、本当にお得なビタミンDサプリメント。
          </p>

          {top3Products.length > 0 ? (
            <div className="space-y-4">
              {top3Products.map((product, index) => (
                <div
                  key={product._id}
                  className={`${liquidGlassClasses.light} rounded-[20px] p-5 border transition-all hover:shadow-lg`}
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  <div className="flex items-start gap-4">
                    {/* ランキング */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-bold text-white text-[20px]"
                      style={{
                        background:
                          index === 0
                            ? "linear-gradient(135deg, #FFD700, #FFA500)"
                            : index === 1
                              ? "linear-gradient(135deg, #C0C0C0, #A8A8A8)"
                              : "linear-gradient(135deg, #CD7F32, #8B4513)",
                      }}
                    >
                      {index + 1}
                    </div>

                    {/* 商品画像 */}
                    {product.externalImageUrl && (
                      <div className="w-20 h-20 relative shrink-0 rounded-[12px] overflow-hidden bg-white">
                        <Image
                          src={product.externalImageUrl}
                          alt={product.name}
                          fill
                          className="object-contain p-1"
                          sizes="80px"
                        />
                      </div>
                    )}

                    {/* 商品情報 */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-bold text-[15px] mb-1 line-clamp-2"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {product.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span
                          className="text-[12px] px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: systemColors.orange + "15",
                            color: systemColors.orange,
                          }}
                        >
                          ¥{product.costPerDay.toFixed(1)}/日
                        </span>
                        <span
                          className="text-[12px] px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: systemColors.green + "15",
                            color: systemColors.green,
                          }}
                        >
                          {product.amountPerServing.toFixed(0)}IU/回
                        </span>
                      </div>
                      <p
                        className="text-[13px]"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        ¥{product.priceJPY.toLocaleString()} /{" "}
                        {product.servingsPerContainer}回分
                      </p>
                    </div>

                    {/* 詳細リンク */}
                    <Link
                      href={`/products/${product.slug.current}`}
                      className="shrink-0 p-2 rounded-full transition-colors"
                      style={{ backgroundColor: systemColors.orange + "10" }}
                    >
                      <ArrowRight
                        size={20}
                        style={{ color: systemColors.orange }}
                      />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`${liquidGlassClasses.light} rounded-[20px] p-8 text-center border`}
              style={{ borderColor: appleWebColors.borderSubtle }}
            >
              <p style={{ color: appleWebColors.textSecondary }}>
                現在、ビタミンDサプリのデータを取得中です。
              </p>
            </div>
          )}

          {/* 計算ツールへの誘導 */}
          <div
            className="mt-6 p-4 rounded-[12px] flex items-center justify-between"
            style={{ backgroundColor: systemColors.orange + "10" }}
          >
            <div className="flex items-center gap-3">
              <Calculator size={20} style={{ color: systemColors.orange }} />
              <span
                className="text-[14px]"
                style={{ color: appleWebColors.textPrimary }}
              >
                自分で計算したい方はこちら
              </span>
            </div>
            <Link
              href="/tools/mg-calculator"
              className="text-[14px] font-medium flex items-center gap-1"
              style={{ color: systemColors.orange }}
            >
              計算ツールへ
            </Link>
          </div>
        </section>

        {/* 選び方チェックリスト */}
        <section className="mb-12">
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
                        ? systemColors.orange
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
                      {check.title}
                    </h3>
                    <p
                      className="text-[14px] leading-[1.6]"
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

        {/* 摂取量ガイド */}
        <section className="mb-12">
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
            目的に応じた1日の摂取量目安です。高用量を長期摂取する場合は、血液検査での確認を推奨します。
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr
                  style={{
                    backgroundColor: appleWebColors.sectionBackground,
                  }}
                >
                  <th
                    className="text-left p-3 font-bold rounded-tl-[12px]"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    目的
                  </th>
                  <th
                    className="text-left p-3 font-bold"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    摂取量
                  </th>
                  <th
                    className="text-left p-3 font-bold"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    タイミング
                  </th>
                  <th
                    className="text-left p-3 font-bold rounded-tr-[12px]"
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
                      className="p-3 font-medium"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {guide.purpose}
                    </td>
                    <td className="p-3" style={{ color: systemColors.orange }}>
                      <strong>{guide.amount}</strong>
                    </td>
                    <td
                      className="p-3"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      {guide.timing}
                    </td>
                    <td
                      className="p-3"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      {guide.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 注意点・副作用 */}
        <section className="mb-12">
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
            ビタミンDは脂溶性ビタミンのため、過剰摂取には注意が必要です。以下の点を理解した上で適切に摂取しましょう。
          </p>
          <div className="space-y-3">
            {CAUTIONS.map((caution, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-[12px]"
                style={{
                  backgroundColor:
                    caution.severity === "warning"
                      ? systemColors.red + "08"
                      : systemColors.orange + "08",
                }}
              >
                {caution.severity === "warning" ? (
                  <AlertTriangle
                    size={20}
                    className="shrink-0 mt-0.5"
                    style={{ color: systemColors.red }}
                  />
                ) : (
                  <Info
                    size={20}
                    className="shrink-0 mt-0.5"
                    style={{ color: systemColors.orange }}
                  />
                )}
                <div>
                  <h3
                    className="font-bold text-[15px] mb-1"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    {caution.title}
                  </h3>
                  <p
                    className="text-[14px] leading-[1.6]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    {caution.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* その他の商品 */}
        {otherProducts.length > 0 && (
          <section className="mb-12">
            <h2
              className={`${typography.title2} mb-6`}
              style={{ color: appleWebColors.textPrimary }}
            >
              その他のビタミンDサプリ
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {otherProducts.slice(0, 6).map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product.slug.current}`}
                  className={`${liquidGlassClasses.light} rounded-[16px] p-4 border flex items-center gap-4 transition-all hover:shadow-md`}
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  {product.externalImageUrl && (
                    <div className="w-16 h-16 relative shrink-0 rounded-[8px] overflow-hidden bg-white">
                      <Image
                        src={product.externalImageUrl}
                        alt={product.name}
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-bold text-[14px] mb-1 line-clamp-2"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[12px]"
                        style={{ color: systemColors.orange }}
                      >
                        ¥{product.costPerDay.toFixed(1)}/日
                      </span>
                      <span
                        className="text-[12px]"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        ¥{product.priceJPY.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <ArrowRight
                    size={16}
                    style={{ color: appleWebColors.textTertiary }}
                  />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mb-12">
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
                  className="text-[14px] leading-[1.7]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 関連成分 */}
        <section className="mb-12">
          <h2
            className={`${typography.title2} mb-6`}
            style={{ color: appleWebColors.textPrimary }}
          >
            ビタミンDと一緒に摂りたい成分
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                name: "ビタミンK2",
                slug: "vitamin-k",
                description:
                  "カルシウムを骨に届ける。D3との相乗効果で骨密度維持。",
                color: systemColors.purple,
              },
              {
                name: "カルシウム",
                slug: "calcium",
                description: "ビタミンDが吸収を促進。骨と歯の健康に必須。",
                color: systemColors.cyan,
              },
              {
                name: "マグネシウム",
                slug: "magnesium",
                description:
                  "ビタミンDの活性化に必要。筋肉や神経機能にも重要。",
                color: systemColors.blue,
              },
              {
                name: "亜鉛",
                slug: "zinc",
                description: "免疫機能をサポート。ビタミンDと共に免疫力UP。",
                color: systemColors.green,
              },
            ].map((related) => (
              <Link
                key={related.slug}
                href={`/ingredients/${related.slug}`}
                className={`${liquidGlassClasses.light} rounded-[16px] p-5 border flex items-start gap-4 transition-all hover:shadow-md`}
                style={{ borderColor: appleWebColors.borderSubtle }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: related.color + "20" }}
                >
                  <FlaskConical size={20} style={{ color: related.color }} />
                </div>
                <div>
                  <h3
                    className="font-bold text-[15px] mb-1"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    {related.name}
                  </h3>
                  <p
                    className="text-[13px] leading-[1.5]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    {related.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="rounded-[20px] p-8 text-center text-white"
          style={{
            background: `linear-gradient(135deg, ${systemColors.orange}, ${systemColors.yellow})`,
          }}
        >
          <h2 className={`${typography.title2} mb-4`}>
            ビタミンDサプリをもっと詳しく比較
          </h2>
          <p className="text-[15px] opacity-90 mb-6">
            Suptiaでは、5つの評価軸で{products.length}商品以上を比較できます
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products?ingredient=vitamin-d"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-[12px] font-medium"
              style={{ color: systemColors.orange }}
            >
              ビタミンD商品一覧
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/ingredients/vitamin-d"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/20 rounded-[12px] font-medium text-white"
            >
              成分ガイドを見る
              <ExternalLink size={16} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
