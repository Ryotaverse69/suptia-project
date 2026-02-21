/**
 * クレアチン比較記事ページ
 * SEO最適化された比較コンテンツ（統一テンプレート準拠）
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
  Heart,
  Shield,
  BadgeCheck,
  Info,
  Brain,
  Dumbbell,
  ExternalLink,
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

// 目次データ
const SECTIONS = [
  { id: "types", label: "種類と特徴" },
  { id: "purpose", label: "目的別おすすめ" },
  { id: "products", label: "おすすめ商品ランキング" },
  { id: "checklist", label: "選び方チェックリスト" },
  { id: "dosage", label: "摂取量・タイミング" },
  { id: "cautions", label: "注意点・副作用" },
  { id: "faq", label: "よくある質問" },
];

// この記事でわかること
const LEARNING_POINTS = [
  "クレアチンの種類（モノハイドレート・HCl・バッファード）の違い",
  "ローディングは必要か？最適な摂取方法",
  "筋力・パワーだけでなく認知機能への効果",
  "女性・高齢者・ベジタリアンへの効果",
  "腎臓への影響など安全性の真実",
];

// 結論ファースト
const QUICK_RECOMMENDATIONS = [
  {
    label: "基本はモノハイドレート",
    detail: "最も研究が多く、安価で効果確実。5g/日で十分。",
  },
  {
    label: "溶けやすさ重視なら",
    detail: "マイクロナイズド（微粉末）。効果は同じ。",
  },
  {
    label: "胃腸が気になるなら",
    detail: "クレアチンHCl。少量で効果、負担少ない。",
  },
  {
    label: "ローディングは不要",
    detail: "3〜4週間で同じ効果に到達。",
  },
];

// 関連成分
const RELATED_INGREDIENTS = [
  {
    name: "プロテイン",
    slug: "protein",
    emoji: "💪",
    reason: "筋肉合成に相乗効果",
  },
  {
    name: "ベータアラニン",
    slug: "beta-alanine",
    emoji: "⚡",
    reason: "持久力向上に相乗効果",
  },
  {
    name: "オメガ3",
    slug: "omega-3",
    emoji: "🐟",
    reason: "炎症抑制・回復促進",
  },
  {
    name: "ビタミンD",
    slug: "vitamin-d",
    emoji: "☀️",
    reason: "筋力・パフォーマンス向上",
  },
];

const ARTICLE_DATA = {
  title:
    "【2026年最新】クレアチンサプリおすすめ比較｜モノハイドレート・HClの違い",
  description:
    "クレアチンサプリをモノハイドレート・HCl・バッファードなど形態別に比較。筋力・パワー・認知機能への効果と、ローディング不要の選び方を解説。",
  publishedAt: "2025-01-19",
  updatedAt: new Date().toISOString().split("T")[0],
  ingredientName: "クレアチン",
  ingredientSlug: "creatine",
};

const ogImageUrl = getArticleOGImage("creatine-comparison");
const ogImage = generateOGImageMeta(
  ogImageUrl,
  "クレアチンサプリメント比較 - サプティア",
);

export const metadata: Metadata = {
  title: ARTICLE_DATA.title,
  description: ARTICLE_DATA.description,
  keywords: [
    "クレアチン",
    "サプリメント",
    "おすすめ",
    "比較",
    "2026",
    "モノハイドレート",
    "筋トレ",
    "筋力",
    "パワー",
    "認知機能",
  ],
  openGraph: {
    title: ARTICLE_DATA.title,
    description: ARTICLE_DATA.description,
    type: "article",
    publishedTime: ARTICLE_DATA.publishedAt,
    modifiedTime: ARTICLE_DATA.updatedAt,
    url: "https://suptia.com/articles/creatine-comparison",
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
    canonical: "https://suptia.com/articles/creatine-comparison",
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
}

async function getCreatineProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && availability == "in-stock" && (
    name match "*クレアチン*" ||
    name match "*Creatine*" ||
    name match "*creatine*"
  )] | order(priceJPY asc)[0...20]{
    _id,
    name,
    priceJPY,
    servingsPerContainer,
    servingsPerDay,
    externalImageUrl,
    slug,
    source,
    tierRatings,
    badges
  }`;

  try {
    const products = await sanity.fetch(query);
    return products || [];
  } catch (error) {
    console.error("Failed to fetch creatine products:", error);
    return [];
  }
}

// クレアチンの種類データ
const CREATINE_TYPES = [
  {
    name: "クレアチンモノハイドレート",
    nameEn: "Creatine Monohydrate",
    research: "◎ 最多（数百の研究）",
    price: "◎ 最安",
    absorption: "○ 良好",
    best: "コスパ最優先・初心者（全員におすすめ）",
    description:
      "最も研究が多く、効果が実証されている標準形態。安価で効果確実。特にこだわりがなければこれで十分。",
    color: systemColors.blue,
  },
  {
    name: "微粉末（マイクロナイズド）",
    nameEn: "Micronized Creatine",
    research: "◎ モノハイドレートと同等",
    price: "○ やや高い",
    absorption: "◎ 溶けやすい",
    best: "溶けやすさ重視・プロテインに混ぜたい",
    description:
      "モノハイドレートを微粉末化して溶けやすくしたもの。効果は同じで、ドリンクに混ぜやすい。",
    color: systemColors.cyan,
  },
  {
    name: "クレアチンHCl",
    nameEn: "Creatine Hydrochloride",
    research: "○ 比較的多い",
    price: "△ やや高い",
    absorption: "◎ 高い",
    best: "少量で効果を得たい・胃腸が弱い",
    description:
      "塩酸と結合させて溶解性・吸収性を高めた形態。少量で効果があり、ローディング不要という主張も。",
    color: systemColors.green,
  },
  {
    name: "バッファードクレアチン",
    nameEn: "Buffered Creatine (Kre-Alkalyn)",
    research: "△ 限定的",
    price: "△ やや高い",
    absorption: "○ 良好",
    best: "胃腸への負担を減らしたい",
    description:
      "pHを調整してクレアチニンへの分解を防ぐという主張。胃への刺激が少ないが、優位性は科学的に未確定。",
    color: systemColors.purple,
  },
  {
    name: "クレアチンエチルエステル",
    nameEn: "Creatine Ethyl Ester",
    research: "△ 限定的・否定的",
    price: "△ やや高い",
    absorption: "△ 研究では劣る",
    best: "おすすめしない",
    description:
      "吸収率向上を謳うが、研究ではモノハイドレートより劣る結果が多い。価格も高いためおすすめしない。",
    color: "#6B7280",
  },
  {
    name: "クレアルカリン（Kre-Alkalyn）",
    nameEn: "Kre-Alkalyn",
    research: "△ 限定的",
    price: "△ 高い",
    absorption: "○ 良好",
    best: "ブランド志向・少量摂取希望",
    description:
      "特許取得のpH調整クレアチン。ローディング不要・少量で効果を主張。科学的優位性は議論あり。",
    color: systemColors.orange,
  },
];

// 目的別おすすめ
const PURPOSE_RECOMMENDATIONS = [
  {
    purpose: "筋力・筋肉量アップ",
    icon: Dumbbell,
    emoji: "muscle",
    description: "筋トレ効果を最大化したい、ベンチプレスを伸ばしたい",
    recommendation: "クレアチンモノハイドレート 5g/日",
    reason:
      "数百の研究で筋力・筋肉量の増加が実証されている。特にウエイトトレーニングとの組み合わせで効果大。",
    tips: "プロテインと一緒に摂取可能。毎日継続が大切。",
  },
  {
    purpose: "瞬発力・パワー向上",
    icon: Shield,
    emoji: "zap",
    description: "スポーツのパフォーマンス向上、スプリント、ジャンプ力",
    recommendation: "クレアチンモノハイドレート 5g/日",
    reason:
      "ATP再合成を促進し、短時間の高強度運動でのパワー出力を向上。スプリント、ジャンプ、投擲などに効果的。",
    tips: "試合・練習の30分前に摂取する方法も。",
  },
  {
    purpose: "認知機能・脳のエネルギー",
    icon: Brain,
    emoji: "brain",
    description: "集中力、記憶力、睡眠不足時のパフォーマンス",
    recommendation: "クレアチンモノハイドレート 5g/日",
    reason:
      "脳もATPを大量に消費。睡眠不足やストレス下での認知機能改善、高齢者の記憶力維持に関する研究あり。",
    tips: "ベジタリアンは効果を感じやすい（食事からの摂取が少ないため）。",
  },
  {
    purpose: "胃腸への負担を減らしたい",
    icon: Heart,
    emoji: "pill",
    description: "モノハイドレートでお腹が張る、下痢になる",
    recommendation: "クレアチンHCl 1.5〜3g/日",
    reason:
      "少量で効果があり、胃腸への負担が少ないとされる。溶解性が高く、水分保持による体重増加も少ない。",
    tips: "食後に摂取するとさらに胃腸への負担軽減。",
  },
  {
    purpose: "ベジタリアン・ヴィーガン",
    icon: Shield,
    emoji: "leaf",
    description: "肉・魚を食べない、クレアチンが不足している",
    recommendation: "クレアチンモノハイドレート 3〜5g/日",
    reason:
      "クレアチンは主に肉・魚に含まれるため、菜食者は体内レベルが低い傾向。サプリで補給する意義が大きい。",
    tips: "認知機能向上効果も菜食者でより顕著という研究あり。",
  },
];

// 選び方チェックリスト
const SELECTION_CHECKLIST = [
  {
    item: "モノハイドレートを選ぶ",
    description:
      "最も研究が多く、効果が確実で安価。特別な理由がない限り、モノハイドレートで十分。",
    important: true,
  },
  {
    item: "純度を確認",
    description:
      "Creapure などの品質保証ブランド、または純度99%以上の表記があると安心。",
    important: true,
  },
  {
    item: "g単価で比較",
    description:
      "クレアチンは1日5g使用するため、総グラム数÷価格でコスパを計算。",
    important: false,
  },
  {
    item: "添加物を確認",
    description:
      "純粋なクレアチンパウダーが最もコスパ良好。フレーバー付きは割高。",
    important: false,
  },
  {
    item: "溶けやすさを確認",
    description:
      "マイクロナイズド（微粉末）は溶けやすい。通常品は少しダマになりやすい。",
    important: false,
  },
];

// 摂取量ガイド
const DOSAGE_GUIDE = [
  {
    purpose: "ローディングあり（早く効果を得たい）",
    amount: "20g/日→5g/日維持",
    frequency: "最初1週間4回に分けて→1日1回",
    note: "1週間で体内を飽和させてから維持量へ",
  },
  {
    purpose: "ローディングなし（推奨）",
    amount: "3〜5g/日",
    frequency: "1日1回",
    note: "3〜4週間で体内レベルが飽和。これで十分",
  },
  {
    purpose: "認知機能目的",
    amount: "3〜5g/日",
    frequency: "1日1回",
    note: "朝の摂取がおすすめ",
  },
  {
    purpose: "高齢者・女性",
    amount: "3g/日",
    frequency: "1日1回",
    note: "少なめでも効果あり。継続が大切",
  },
  {
    purpose: "クレアチンHCl使用時",
    amount: "1.5〜3g/日",
    frequency: "1日1回",
    note: "少量で効果。ローディング不要",
  },
];

// 注意点・副作用
const CAUTIONS = [
  {
    title: "水分摂取を増やす",
    description:
      "クレアチンは筋肉に水分を引き込む。脱水を防ぐため、水分摂取を通常より増やすことを推奨。",
    severity: "info",
  },
  {
    title: "体重が増えることがある",
    description:
      "筋肉内の水分貯留により1〜2kg程度体重が増えることがある。これは脂肪ではなく、効果の証拠。",
    severity: "info",
  },
  {
    title: "腎臓に問題がある方は注意",
    description:
      "健康な人では腎臓への悪影響は確認されていないが、既存の腎臓疾患がある方は医師に相談を。",
    severity: "warning",
  },
  {
    title: "一部で胃腸障害",
    description:
      "特にローディング時に下痢・腹部膨満を感じる人も。分割摂取または少量から始めると軽減される。",
    severity: "info",
  },
  {
    title: "カフェインとの相互作用は？",
    description:
      "かつてカフェインがクレアチン効果を打ち消すとされたが、最近の研究では問題ないという結果が多い。",
    severity: "info",
  },
];

// FAQ
const FAQS = [
  {
    question: "クレアチンのローディングは必要ですか？",
    answer:
      "必須ではありません。ローディング（1週間20g/日→5g/日維持）を行うと体内クレアチン濃度が早く飽和しますが、ローディングなしで5g/日を継続しても、3〜4週間で同じレベルに達します。早く効果を得たいならローディング、胃腸への負担を避けたいなら最初から5g/日を継続がおすすめです。",
  },
  {
    question: "クレアチンはいつ飲むのが効果的？",
    answer:
      "タイミングの影響は小さいですが、運動後に摂取した方が筋肉への取り込みがわずかに良いという研究があります。また、炭水化物やプロテインと一緒に摂取すると、インスリン分泌により吸収が促進されます。実際には、毎日継続することが最も重要なので、自分が続けやすいタイミングで問題ありません。",
  },
  {
    question: "クレアチンモノハイドレートとHClの違いは？",
    answer:
      "モノハイドレートは最も研究が多く、効果が確実で安価。HClは塩酸と結合させて溶解性・吸収性を高めた形態で、少量（1.5〜3g）で効果があり、ローディング不要、胃腸への負担が少ないとされます。ただし、HClがモノハイドレートより優れているという直接比較研究は限定的。コスパ重視ならモノハイドレート、胃腸が気になるならHClという選び方が合理的です。",
  },
  {
    question: "クレアチンは筋トレしない人にも効果がある？",
    answer:
      "はい、あります。クレアチンは認知機能（特に睡眠不足やストレス下）、高齢者の筋力維持、ベジタリアンの認知機能改善など、運動以外での効果も研究されています。脳はエネルギー消費が大きく、クレアチンは脳内のATP再合成にも関与します。ただし、効果を最大化するには運動との組み合わせがベストです。",
  },
  {
    question: "クレアチンは女性でも摂取して良い？",
    answer:
      "はい、女性にも安全で効果的です。筋力・パワー向上は男女共通の効果です。水分貯留による体重増加（1〜2kg程度）を嫌う人もいますが、これは脂肪ではなく筋肉内の水分であり、むしろ筋肉のボリューム感が増すポジティブな効果とも言えます。女性は3g/日程度から始めるのも一案です。",
  },
  {
    question: "クレアチンは腎臓に悪い？",
    answer:
      "健康な人では、推奨量（3〜5g/日）の長期摂取で腎臓への悪影響は確認されていません。複数の長期研究で安全性が示されています。ただし、既存の腎臓疾患がある方は、クレアチニン値の変動に影響する可能性があるため、医師に相談してから使用してください。",
  },
  {
    question: "クレアチンを摂取すると抜け毛が増える？",
    answer:
      "2009年の1つの研究で、クレアチン摂取によりDHT（ジヒドロテストステロン）が増加したという報告があり、DHTは男性型脱毛症に関連することから「クレアチン=抜け毛」という説が広まりました。しかし、この研究は追試で再現されておらず、多くの専門家は因果関係に懐疑的です。気になる方は医師に相談を。",
  },
  {
    question: "クレアチンサプリはAmazonで購入できますか？",
    answer:
      "はい、Amazonで多数のクレアチンサプリが販売されています。サプティア（suptia.com）では楽天・Yahoo!・Amazonの価格を一括比較できるため、最安値のショップを簡単に見つけられます。価格は毎日自動更新されており、常に最新の情報を確認できます。",
  },
  {
    question: "クレアチンサプリで最もコスパが良いのはどれですか？",
    answer:
      "コスパは「1日あたりのコスト（¥/日）」と「成分量あたりの価格（¥/g）」で評価するのがポイントです。サプティアでは476商品以上のデータベースから、これらの指標を自動計算して比較しています。セール時期（Amazonの新生活セールやプライムデーなど）を活用するとさらにお得に購入できます。",
  },
];

// 絵文字マッピング関数
function getEmojiIcon(emojiKey: string): string {
  const emojiMap: Record<string, string> = {
    muscle: "",
    zap: "",
    brain: "",
    pill: "",
    leaf: "",
    fish: "",
    sun: "",
  };
  return emojiMap[emojiKey] || "";
}

export default async function CreatineComparisonPage() {
  const products = await getCreatineProducts();

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

      return {
        ...product,
        effectiveCostPerDay,
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
      {/* 1. [sticky] パンくずナビ */}
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
              クレアチン比較
            </span>
          </nav>
        </div>
      </div>

      {/* 2. ヒーローセクション（タイトル + アイキャッチ） */}
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
              スポーツサプリ
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
              公開:{" "}
              {new Date(
                ARTICLE_DATA.publishedAt + "T00:00:00",
              ).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <time
              dateTime={ARTICLE_DATA.updatedAt}
              className="font-medium"
              style={{ color: systemColors.green }}
            >
              ✓ 最終更新:{" "}
              {new Date(
                ARTICLE_DATA.updatedAt + "T00:00:00",
              ).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
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
          aria-label="目次"
        >
          <h2
            className={`${typography.title3} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            目次
          </h2>
          <ol className="space-y-2">
            {SECTIONS.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="flex items-center gap-3 py-2 px-3 rounded-[12px] transition-colors hover:bg-black/5"
                  style={{ color: systemColors.blue }}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold"
                    style={{
                      backgroundColor: systemColors.blue + "20",
                      color: systemColors.blue,
                    }}
                  >
                    {index + 1}
                  </span>
                  <span className="text-[15px]">{section.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* 4. この記事でわかること */}
        <section
          className={`${liquidGlassClasses.light} rounded-[20px] p-6 mb-12 border`}
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

        {/* 5. 結論ファースト（迷ったらこれ） */}
        <section
          className="mb-12 rounded-[20px] p-6 md:p-8"
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
                    <strong>{rec.label}</strong> →{rec.detail}
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
            クレアチンサプリの種類と選び方
          </h2>
          <p
            className="text-[15px] leading-[1.7] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            クレアチンには様々な形態がありますが、科学的に最も研究されているのはモノハイドレートです。
            高価な形態が必ずしも優れているわけではありません。
          </p>

          <div className="space-y-4">
            {CREATINE_TYPES.map((type) => (
              <div
                key={type.name}
                className={`${liquidGlassClasses.light} rounded-[16px] p-5 border-l-4`}
                style={{ borderLeftColor: type.color }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
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
                      研究: {type.research}
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
                      吸収: {type.absorption}
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
            目的別｜あなたに合ったクレアチンはこれ
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
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: systemColors.blue + "15" }}
                    >
                      <Icon size={20} style={{ color: systemColors.blue }} />
                    </div>
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

        {/* 8. おすすめ商品ランキング */}
        <section id="products" className="mb-12 scroll-mt-20">
          <h2
            className={`${typography.title2} mb-2`}
            style={{ color: appleWebColors.textPrimary }}
          >
            コスパランキングTOP3｜クレアチンサプリ
          </h2>
          <p
            className="text-[15px] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            1日あたりのコストで比較した、最もお得なクレアチンサプリメントです。
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
                現在、クレアチンサプリメントの商品データを準備中です。
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

        {/* 10. 摂取量・タイミング */}
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
            クレアチンは毎日継続摂取することで体内レベルが飽和し、効果を発揮します。
          </p>

          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[480px] text-[14px]">
              <thead>
                <tr
                  className="border-b"
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  <th
                    className="text-left py-3 px-4 font-bold"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    方法
                  </th>
                  <th
                    className="text-left py-3 px-4 font-bold"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    摂取量
                  </th>
                  <th
                    className="text-left py-3 px-4 font-bold"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    頻度
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
            クレアチンは最も安全性が研究されているサプリメントの一つですが、いくつかの注意点があります。
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

        {/* 12. よくある質問（FAQ） */}
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
        <section className="mb-12">
          <h2
            className={`${typography.title2} mb-6`}
            style={{ color: appleWebColors.textPrimary }}
          >
            クレアチンと一緒に摂りたい成分
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
            クレアチンサプリをもっと詳しく比較
          </h2>
          <p className="text-[15px] opacity-90 mb-6">
            サプティアでは、5つの評価軸で商品を比較できます
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products?q=クレアチン"
              className="inline-flex items-center justify-center gap-2 bg-white font-bold px-6 py-3 rounded-[12px] transition-colors hover:bg-gray-100"
              style={{ color: systemColors.blue }}
            >
              全商品を見る
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/ingredients/creatine"
              className="inline-flex items-center justify-center gap-2 bg-white/20 font-medium px-6 py-3 rounded-[12px] transition-colors hover:bg-white/30"
            >
              クレアチン成分ガイド
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
