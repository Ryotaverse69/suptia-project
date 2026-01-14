/**
 * ビタミンC比較記事ページ
 * SEO最適化された比較コンテンツ - 統一テンプレート版
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
  Zap,
  Heart,
  Leaf,
  BadgeCheck,
  Info,
  Calculator,
  ExternalLink,
  DollarSign,
  List,
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
  title: "【2025年最新】ビタミンCサプリおすすめ比較｜コスパ・品質で徹底分析",
  description:
    "ビタミンCサプリメントを価格・成分量・コスパ・安全性で徹底比較。mg単価から見た本当のコスパランキングと、目的別おすすめ商品を紹介。",
  publishedAt: "2025-01-15",
  updatedAt: new Date().toISOString().split("T")[0],
  ingredientName: "ビタミンC",
  ingredientSlug: "vitamin-c",
};

// OGP画像を取得
const ogImageUrl = getArticleOGImage("vitamin-c-comparison");
const ogImage = generateOGImageMeta(
  ogImageUrl,
  "ビタミンCサプリメント比較 - サプティア",
);

export const metadata: Metadata = {
  title: ARTICLE_DATA.title,
  description: ARTICLE_DATA.description,
  keywords: [
    "ビタミンC",
    "サプリメント",
    "おすすめ",
    "比較",
    "コスパ",
    "2025",
    "ランキング",
    "mg単価",
    "アスコルビン酸",
    "リポソーム",
    "タイムリリース",
  ],
  openGraph: {
    title: ARTICLE_DATA.title,
    description: ARTICLE_DATA.description,
    type: "article",
    publishedTime: ARTICLE_DATA.publishedAt,
    modifiedTime: ARTICLE_DATA.updatedAt,
    url: "https://suptia.com/articles/vitamin-c-comparison",
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
    canonical: "https://suptia.com/articles/vitamin-c-comparison",
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

async function getVitaminCProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && availability == "in-stock" && references(*[_type == "ingredient" && slug.current == "vitamin-c"]._id)] | order(priceJPY asc)[0...20]{
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
    console.error("Failed to fetch vitamin C products:", error);
    return [];
  }
}

// この記事でわかること
const LEARNING_POINTS = [
  "ビタミンCサプリの種類と特徴（アスコルビン酸・リポソーム・タイムリリースなど）",
  "あなたの目的に合った最適なビタミンCの選び方",
  "mg単価で見た本当のコスパランキングTOP3",
  "効果的な摂取方法と注意すべき副作用",
  "よくある疑問への科学的根拠に基づいた回答",
];

// 結論ファースト（迷ったらこれ）
const QUICK_RECOMMENDATIONS = [
  {
    condition: "コスパ重視なら",
    recommendation: "アスコルビン酸タイプ。効果は同じで最安。",
  },
  {
    condition: "胃が弱いなら",
    recommendation: "緩衝型（Buffered）。pHが調整済みで優しい。",
  },
  {
    condition: "本気で効果を求めるなら",
    recommendation: "リポソーム。吸収率が高く血中濃度が上がりやすい。",
  },
  {
    condition: "面倒くさがりなら",
    recommendation: "タイムリリース。1日1回でOK。",
  },
];

// 目次用セクションデータ
const SECTIONS = [
  { id: "learning-points", title: "この記事でわかること" },
  { id: "quick-recommendations", title: "結論ファースト" },
  { id: "types", title: "種類と特徴" },
  { id: "purpose-recommendations", title: "目的別おすすめ" },
  { id: "ranking", title: "コスパランキング" },
  { id: "checklist", title: "選び方チェックリスト" },
  { id: "dosage", title: "摂取量・タイミング" },
  { id: "cautions", title: "注意点・副作用" },
  { id: "faq", title: "よくある質問" },
  { id: "related-ingredients", title: "関連成分" },
];

// ビタミンCの種類データ
const VITAMIN_C_TYPES = [
  {
    name: "アスコルビン酸（合成）",
    nameEn: "Ascorbic Acid",
    absorption: "普通",
    price: "◎ 最安",
    stomach: "△ 刺激あり",
    best: "コスパ重視の方",
    description:
      "最も一般的で安価。化学構造は天然と同じ。空腹時に胃への刺激を感じる人も。",
    color: systemColors.green,
  },
  {
    name: "緩衝型ビタミンC",
    nameEn: "Buffered Vitamin C",
    absorption: "普通",
    price: "○ 手頃",
    stomach: "◎ 優しい",
    best: "胃が弱い方",
    description:
      "カルシウムやマグネシウムと結合。胃への刺激が少なく、空腹時でも摂取しやすい。",
    color: systemColors.blue,
  },
  {
    name: "リポソームビタミンC",
    nameEn: "Liposomal Vitamin C",
    absorption: "◎ 高い",
    price: "△ 高価",
    stomach: "◎ 優しい",
    best: "吸収率重視の方",
    description:
      "リン脂質で包むことで吸収率が向上。点滴に近い効果という研究も。価格は高め。",
    color: systemColors.purple,
  },
  {
    name: "タイムリリース",
    nameEn: "Time Release",
    absorption: "○ 持続的",
    price: "○ 手頃",
    stomach: "○ 普通",
    best: "1日1回で済ませたい方",
    description:
      "ゆっくり溶けて長時間効果が持続。1日に何度も飲むのが面倒な方におすすめ。",
    color: systemColors.orange,
  },
  {
    name: "天然由来（アセロラ等）",
    nameEn: "Natural Source",
    absorption: "○ 良好",
    price: "△ 高価",
    stomach: "○ 普通",
    best: "自然派志向の方",
    description:
      "フラボノイドなど共存成分を含む。吸収率向上の可能性があるが、mg単価は高い。",
    color: systemColors.pink,
  },
];

// 目的別おすすめ
const PURPOSE_RECOMMENDATIONS = [
  {
    purpose: "コスパ最優先",
    icon: DollarSign,
    emoji: "💰",
    description: "できるだけ安く、でも効果はしっかり欲しい",
    recommendation: "アスコルビン酸タイプ",
    reason:
      "mg単価が最も安く、効果は他のタイプと同等。特にこだわりがなければこれで十分。",
    tips: "食後に摂取すれば胃への刺激も軽減できます。",
  },
  {
    purpose: "胃が弱い・空腹時に飲みたい",
    icon: Heart,
    emoji: "💊",
    description: "胃もたれしやすい、薬が苦手",
    recommendation: "緩衝型またはリポソーム",
    reason: "pH調整されており胃への刺激が少ない。空腹時でも安心して摂取可能。",
    tips: "カルシウム・マグネシウム補給も同時にできる製品も。",
  },
  {
    purpose: "吸収率を最大化したい",
    icon: Zap,
    emoji: "⚡",
    description: "価格より効果を重視、高濃度を求める",
    recommendation: "リポソームビタミンC",
    reason:
      "研究では通常のビタミンCより2〜3倍の血中濃度を達成。点滴療法に近い効果の可能性。",
    tips: "美容目的や免疫強化を本気で目指す方に。",
  },
  {
    purpose: "飲む回数を減らしたい",
    icon: Clock,
    emoji: "⏰",
    description: "1日1回で済ませたい、飲み忘れが多い",
    recommendation: "タイムリリースタイプ",
    reason: "8〜12時間かけてゆっくり放出。1日1回の摂取でも血中濃度が安定。",
    tips: "朝食後に1回飲めばOK。忙しい方に最適。",
  },
  {
    purpose: "自然派・オーガニック志向",
    icon: Leaf,
    emoji: "🌿",
    description: "合成品は避けたい、自然由来にこだわる",
    recommendation: "アセロラ・カムカム由来",
    reason:
      "フラボノイドやポリフェノールなど共存成分を含み、相乗効果が期待できる。",
    tips: "含有量は少なめなので、高用量が必要な場合は他と併用を。",
  },
];

// 選び方チェックリスト
const SELECTION_CHECKLIST = [
  {
    item: "1日の摂取量を確認",
    description:
      "推奨量100mg〜上限2000mg。目的に応じて500〜1000mgが一般的。含有量÷価格でコスパを計算。",
    important: true,
  },
  {
    item: "ビタミンCの形態をチェック",
    description:
      "上記の種類比較を参考に、自分に合った形態を選択。迷ったらアスコルビン酸で十分。",
    important: true,
  },
  {
    item: "添加物・着色料を確認",
    description:
      "不要な添加物が多い製品は避ける。特にカプセルタイプは添加物が少ない傾向。",
    important: false,
  },
  {
    item: "製造国・品質認証を確認",
    description:
      "GMP認証、第三者機関のテスト済みなど。国内製造が必ずしも高品質とは限らない。",
    important: false,
  },
  {
    item: "飲みやすさ・形状を確認",
    description:
      "錠剤・カプセル・パウダー・グミなど。続けられる形状を選ぶのが大切。",
    important: false,
  },
];

// 摂取量ガイド
const DOSAGE_GUIDE = [
  {
    purpose: "一般的な健康維持",
    amount: "100〜200mg/日",
    frequency: "1日1〜2回",
    note: "食事からも摂取できるため、サプリは補助的に",
  },
  {
    purpose: "風邪予防・免疫強化",
    amount: "500〜1000mg/日",
    frequency: "1日2〜3回に分けて",
    note: "症状がある時は短期間増量も可",
  },
  {
    purpose: "美肌・コラーゲン生成",
    amount: "1000〜2000mg/日",
    frequency: "1日2〜3回に分けて",
    note: "ビタミンEとの併用で相乗効果",
  },
  {
    purpose: "喫煙者",
    amount: "500〜1000mg/日",
    frequency: "1日2〜3回に分けて",
    note: "喫煙でビタミンCが大量消費されるため多めに",
  },
  {
    purpose: "ストレスが多い時期",
    amount: "500〜1000mg/日",
    frequency: "1日2〜3回に分けて",
    note: "ストレスホルモン生成にビタミンCが使われる",
  },
];

// 注意点・副作用
const CAUTIONS = [
  {
    title: "過剰摂取に注意",
    description:
      "2000mg/日を超えると下痢、腹痛、吐き気のリスク。腎臓結石の可能性も指摘されている。",
    severity: "warning",
  },
  {
    title: "腎臓に問題がある方",
    description:
      "腎臓病がある方は医師に相談を。高用量のビタミンCは腎臓への負担になる可能性。",
    severity: "warning",
  },
  {
    title: "鉄過剰症の方",
    description:
      "ビタミンCは鉄の吸収を促進。ヘモクロマトーシスなど鉄過剰症の方は要注意。",
    severity: "warning",
  },
  {
    title: "検査前の中止",
    description:
      "血糖値や便潜血検査に影響する可能性。検査前は医師に相談の上、一時中止を。",
    severity: "info",
  },
  {
    title: "薬との相互作用",
    description:
      "一部の抗がん剤、血液凝固剤との相互作用の可能性。服薬中の方は医師・薬剤師に相談を。",
    severity: "warning",
  },
];

// 拡張FAQ
const FAQS = [
  {
    question: "ビタミンCサプリは1日どのくらい摂取すればいいですか？",
    answer:
      "厚生労働省の推奨量は成人で1日100mgですが、これは欠乏症を防ぐ最低限の量です。健康維持や美容目的であれば500〜1000mg、ストレスが多い方や喫煙者は1000mg程度の摂取が推奨されています。ただし、2000mg以上の過剰摂取は下痢などの副作用リスクがあるため注意が必要です。水溶性ビタミンなので、1日2〜3回に分けて摂取するのが効果的です。",
  },
  {
    question: "天然ビタミンCと合成ビタミンCの違いは？",
    answer:
      "化学構造は完全に同じなので、体内での基本的な作用に違いはありません。ただし、天然由来の製品（アセロラ、カムカム等）にはフラボノイドやポリフェノールなどの共存成分が含まれており、これらが吸収率を高めたり、相乗効果をもたらす可能性があります。コスパを重視するなら合成、自然派志向や相乗効果を期待するなら天然という選び方が合理的です。",
  },
  {
    question: "ビタミンCはいつ飲むのが効果的？",
    answer:
      "水溶性ビタミンで体内に蓄積されないため、1日2〜3回に分けて食後に摂取するのがベストです。一度に大量摂取しても吸収しきれず排泄されてしまいます。空腹時は胃への刺激が強くなる可能性があるので、食後がおすすめ。タイムリリースタイプなら1日1回でも血中濃度が安定します。",
  },
  {
    question: "ビタミンCと一緒に摂ると良い成分は？",
    answer:
      "【鉄分】ビタミンCが鉄の吸収を最大6倍促進。貧血気味の方は一緒に摂取を。【ビタミンE】互いの抗酸化作用を高め合う相乗効果。【コラーゲン】ビタミンCはコラーゲン合成に必須。美肌目的なら併用が効果的。【亜鉛】免疫機能を相互にサポート。風邪予防に効果的な組み合わせです。",
  },
  {
    question: "安いビタミンCサプリと高いものの違いは？",
    answer:
      "主な違いは1.形態（リポソームは高価）2.原料（天然由来は高価）3.添加物の質4.ブランド料金です。アスコルビン酸単体であれば、安価な製品でも効果は同等。ただし、吸収率を高めたリポソームや、胃に優しい緩衝型は価格に見合う価値があります。高いから良いとは限らないので、自分の目的に合った製品を選びましょう。",
  },
  {
    question: "ビタミンCは風邪に効きますか？",
    answer:
      "風邪を「予防」する効果は限定的という研究結果が多いですが、風邪の「期間を短縮」する効果は複数の研究で示されています。特に、日常的に1000mg以上摂取している人は、風邪の症状が軽くなる傾向があります。風邪をひいてから大量摂取しても効果は限定的なので、日頃からの継続摂取が大切です。",
  },
  {
    question: "ビタミンCを摂りすぎるとどうなりますか？",
    answer:
      "水溶性なので基本的に過剰分は尿として排泄されますが、2000mg/日を超えると下痢、腹痛、吐き気、胸やけなどの消化器症状が出ることがあります。長期的な高用量摂取は腎臓結石のリスクを高める可能性も指摘されています。健康な成人なら1000mg/日程度までが安心です。",
  },
];

// 関連成分
const RELATED_INGREDIENTS = [
  {
    name: "鉄分",
    slug: "iron",
    emoji: "🩸",
    reason: "ビタミンCが鉄の吸収を最大6倍促進",
  },
  {
    name: "ビタミンE",
    slug: "vitamin-e",
    emoji: "🌻",
    reason: "抗酸化作用の相乗効果で老化予防",
  },
  {
    name: "コラーゲン",
    slug: "collagen",
    emoji: "✨",
    reason: "ビタミンCがコラーゲン合成をサポート",
  },
  {
    name: "亜鉛",
    slug: "zinc",
    emoji: "🛡️",
    reason: "免疫機能をダブルでサポート",
  },
];

export default async function VitaminCComparisonPage() {
  const products = await getVitaminCProducts();

  // コスト計算を追加
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

      const vitaminCIngredient = product.ingredients?.find((i) =>
        i.ingredient?.name?.includes("ビタミンC"),
      );
      const mgPerServing = vitaminCIngredient?.amountMgPerServing || 0;
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
  const otherProducts = productsWithCost.slice(3);

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
              ビタミンC比較
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
                backgroundColor: systemColors.orange + "15",
                color: systemColors.orange,
              }}
            >
              ビタミン
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
        <section
          className={`${liquidGlassClasses.light} rounded-[20px] p-6 mb-12 border`}
          style={{ borderColor: appleWebColors.borderSubtle }}
        >
          <div className="flex items-center gap-2 mb-4">
            <List size={20} style={{ color: systemColors.blue }} />
            <h2
              className={`${typography.title3}`}
              style={{ color: appleWebColors.textPrimary }}
            >
              目次
            </h2>
          </div>
          <nav>
            <ol className="space-y-2">
              {SECTIONS.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex items-center gap-3 py-1 hover:opacity-70 transition-opacity"
                  >
                    <span
                      className="text-[13px] font-medium w-6 h-6 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: systemColors.blue + "15",
                        color: systemColors.blue,
                      }}
                    >
                      {index + 1}
                    </span>
                    <span
                      className="text-[14px]"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {section.title}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </section>

        {/* 4. この記事でわかること */}
        <section
          id="learning-points"
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
            {LEARNING_POINTS.map((item, i) => (
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

        {/* 5. 結論ファースト（迷ったらこれ） */}
        <section
          id="quick-recommendations"
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
                {QUICK_RECOMMENDATIONS.map((rec, index) => (
                  <li key={index} style={{ color: appleWebColors.textPrimary }}>
                    <strong>{rec.condition}</strong>
                    {" → "}
                    {rec.recommendation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 6. 種類と特徴 */}
        <section id="types" className="mb-12">
          <h2
            className={`${typography.title2} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            ビタミンCサプリの種類と選び方
          </h2>
          <p
            className="text-[15px] leading-[1.7] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            ビタミンCサプリには複数の種類があり、それぞれ特徴が異なります。
            「どれも同じ」と思って安いものを買うと、胃が痛くなったり、効果を感じにくかったりすることも。
            自分の目的に合った種類を選ぶことが大切です。
          </p>

          <div className="space-y-4">
            {VITAMIN_C_TYPES.map((type) => (
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
                      胃: {type.stomach}
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
        <section id="purpose-recommendations" className="mb-12">
          <h2
            className={`${typography.title2} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            目的別｜あなたに合ったビタミンCはこれ
          </h2>
          <p
            className="text-[15px] leading-[1.7] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            「結局どれを買えばいいの？」という方のために、目的別におすすめをまとめました。
          </p>

          <div className="space-y-4">
            {PURPOSE_RECOMMENDATIONS.map((rec) => {
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
                          style={{ color: systemColors.orange }}
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

        {/* 8. おすすめ商品ランキング */}
        <section id="ranking" className="mb-12">
          <h2
            className={`${typography.title2} mb-2`}
            style={{ color: appleWebColors.textPrimary }}
          >
            コスパランキングTOP3｜ビタミンCサプリ
          </h2>
          <p
            className="text-[15px] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            1日あたりのコストで比較した、最もお得なビタミンCサプリメントです。
            <strong>mg単価</strong>
            で計算しているので、含有量の違いを考慮した本当のコスパがわかります。
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
                現在、ビタミンCサプリメントの商品データを準備中です。
              </p>
            </div>
          )}

          <div
            className={`${liquidGlassClasses.light} rounded-[16px] p-4 mt-6 flex items-center gap-4 border`}
            style={{ borderColor: systemColors.orange + "30" }}
          >
            <div
              className="w-10 h-10 rounded-[12px] flex items-center justify-center"
              style={{ backgroundColor: systemColors.orange }}
            >
              <Calculator size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p
                className="font-bold text-[15px]"
                style={{ color: appleWebColors.textPrimary }}
              >
                自分でコスパを計算してみる
              </p>
              <p
                className="text-[13px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                お手持ちのサプリメントのmg単価を計算できます
              </p>
            </div>
            <Link
              href="/tools/mg-calculator"
              className="px-4 py-2 rounded-[10px] text-[13px] font-medium text-white"
              style={{ backgroundColor: systemColors.orange }}
            >
              計算ツールへ
            </Link>
          </div>
        </section>

        {/* 9. 選び方チェックリスト */}
        <section id="checklist" className="mb-12">
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
                      {check.item}
                      {check.important && (
                        <span
                          className="ml-2 text-[11px] px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: systemColors.orange + "20",
                            color: systemColors.orange,
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

        {/* 10. 摂取量・タイミング */}
        <section id="dosage" className="mb-12">
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
            ビタミンCは水溶性のため、一度に大量摂取しても吸収しきれません。
            目的に応じた適切な量を、複数回に分けて摂取するのが効果的です。
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
                      style={{ color: systemColors.orange }}
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
        <section id="cautions" className="mb-12">
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
            ビタミンCは安全性が高いサプリメントですが、過剰摂取や特定の条件下では注意が必要です。
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

        {/* その他の商品 */}
        {otherProducts.length > 0 && (
          <section className="mb-12">
            <h2
              className={`${typography.title2} mb-6`}
              style={{ color: appleWebColors.textPrimary }}
            >
              その他のビタミンCサプリ
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {otherProducts.slice(0, 6).map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product.slug.current}`}
                  className={`${liquidGlassClasses.light} rounded-[16px] p-4 border transition-all hover:shadow-md`}
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  <div className="flex gap-3">
                    {product.externalImageUrl && (
                      <div className="w-16 h-16 relative shrink-0 bg-white rounded-[10px] overflow-hidden">
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
                        className="font-bold text-[14px] mb-1 line-clamp-2"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {product.name}
                      </h3>
                      <p
                        className="text-[13px]"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        ¥{product.priceJPY.toLocaleString()} / 1日¥
                        {product.effectiveCostPerDay.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-6">
              <Link
                href="/products?ingredient=vitamin-c"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[12px] font-medium text-white"
                style={{ backgroundColor: systemColors.orange }}
              >
                全{products.length}商品を見る
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>
        )}

        {/* 12. よくある質問（FAQ） */}
        <section id="faq" className="mb-12">
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
        <section id="related-ingredients" className="mb-12">
          <h2
            className={`${typography.title2} mb-6`}
            style={{ color: appleWebColors.textPrimary }}
          >
            ビタミンCと一緒に摂りたい成分
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
            background: `linear-gradient(135deg, ${systemColors.orange}, ${systemColors.yellow})`,
          }}
        >
          <h2 className={`${typography.title2} mb-4`}>
            ビタミンCサプリをもっと詳しく比較
          </h2>
          <p className="text-[15px] opacity-90 mb-6">
            サプティアでは、5つの評価軸で{products.length}商品以上を比較できます
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products?ingredient=vitamin-c"
              className="inline-flex items-center justify-center gap-2 bg-white font-bold px-6 py-3 rounded-[12px] transition-colors hover:bg-gray-100"
              style={{ color: systemColors.orange }}
            >
              全商品を見る
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/ingredients/vitamin-c"
              className="inline-flex items-center justify-center gap-2 bg-white/20 font-medium px-6 py-3 rounded-[12px] transition-colors hover:bg-white/30"
            >
              ビタミンC成分ガイド
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
