/**
 * ビタミンD比較記事ページ
 * SEO最適化された比較コンテンツ - 統一テンプレート準拠
 */

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { sanity } from "@/lib/sanity.client";
import { calculateEffectiveCostPerDay } from "@/lib/cost";
import {
  ArrowRight,
  Shield,
  DollarSign,
  FlaskConical,
  CheckCircle2,
  ExternalLink,
  Calculator,
  AlertTriangle,
  Lightbulb,
  Target,
  Heart,
  Sun,
  Bone,
  BadgeCheck,
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

export const revalidate = 86400;

const ARTICLE_DATA = {
  title: "【2026年最新】ビタミンDサプリおすすめ比較｜吸収率・安全性で徹底分析",
  description:
    "ビタミンDサプリメントをD2/D3の違い・吸収率・安全性・コスパで徹底比較。日本人の8割が不足と言われるビタミンD、最適な選び方を解説。",
  publishedAt: "2025-01-18",
  updatedAt: new Date().toISOString().split("T")[0],
  ingredientName: "ビタミンD",
  ingredientSlug: "vitamin-d",
};

const ogImageUrl = getArticleOGImage("vitamin-d-comparison");
const ogImage = generateOGImageMeta(
  ogImageUrl,
  "ビタミンDサプリメント比較 - サプティア",
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
    "2026",
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

// この記事でわかること
const LEARNING_POINTS = [
  "ビタミンD2とD3の違い、選び方のポイント",
  "日本人の8割が不足している理由と対策",
  "骨・免疫・メンタルなど目的別のおすすめ商品",
  "適切な摂取量と過剰摂取のリスク",
  "血液検査で確認すべき数値の目安",
];

// 結論ファースト
const QUICK_RECOMMENDATIONS = [
  {
    label: "効果重視なら",
    text: "ビタミンD3（コレカルシフェロール）。D2より効率的。",
  },
  {
    label: "骨の健康重視なら",
    text: "D3+K2配合タイプ。カルシウムを骨に届ける。",
  },
  { label: "ヴィーガンなら", text: "苔類由来D3またはD2。植物性で安心。" },
  {
    label: "用量の目安",
    text: "1000〜2000IU/日が一般的。欠乏時は医師に相談。",
  },
];

// 目次用セクションデータ
const SECTIONS = [
  { id: "learning-points", title: "この記事でわかること" },
  { id: "quick-recommendations", title: "結論ファースト" },
  { id: "types", title: "種類と特徴" },
  { id: "purpose-recommendations", title: "目的別おすすめ" },
  { id: "ranking", title: "おすすめ商品ランキング" },
  { id: "checklist", title: "選び方チェックリスト" },
  { id: "dosage", title: "摂取量・タイミング" },
  { id: "cautions", title: "注意点・副作用" },
  { id: "faq", title: "よくある質問" },
  { id: "related", title: "関連成分" },
];

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
    emoji: "🦴",
    description: "骨密度を維持したい、閉経後の女性",
    recommendation: "D3+K2タイプ",
    reason:
      "カルシウムを骨に届けるK2との組み合わせが最適。閉経後女性に特におすすめ。",
    tips: "カルシウムも一緒に摂取すると効果的。",
  },
  {
    purpose: "免疫力サポート",
    icon: Shield,
    emoji: "🛡️",
    description: "風邪やインフルエンザ予防、日照不足",
    recommendation: "D3 1000-2000IU",
    reason: "免疫細胞の正常な機能に必要。風邪やインフルエンザ予防に。",
    tips: "亜鉛・ビタミンCとの併用で相乗効果。",
  },
  {
    purpose: "気分・メンタル",
    icon: Sun,
    emoji: "☀️",
    description: "冬季うつ対策、気分の安定",
    recommendation: "D3 2000-4000IU",
    reason: "セロトニン生成をサポート。冬季うつ対策や日照不足の方に。",
    tips: "朝食後の摂取がおすすめ。",
  },
  {
    purpose: "ヴィーガン対応",
    icon: Heart,
    emoji: "🌱",
    description: "動物性原料を避けたい方",
    recommendation: "D2または苔類由来D3",
    reason: "動物性原料不使用。苔類由来のヴィーガンD3が効果的。",
    tips: "D2の場合は少し多めに摂取を。",
  },
  {
    purpose: "コスパ重視",
    icon: DollarSign,
    emoji: "💰",
    description: "長期継続で費用を抑えたい",
    recommendation: "高用量D3（5000IU）",
    reason: "週1-2回の服用で1日コストを抑える。1日あたり5円以下も可能。",
    tips: "血液検査で適正量を確認すると安心。",
  },
];

// 購入前チェックリスト
const SELECTION_CHECKLIST = [
  {
    item: "D3かD2か確認",
    description: "効果重視ならD3、ヴィーガンならD2（または苔類D3）を選択。",
    important: true,
  },
  {
    item: "用量（IU）を確認",
    description:
      "一般的な維持量は1000-2000IU/日。欠乏時は医師と相談の上4000IU以上も。",
    important: true,
  },
  {
    item: "油脂との組み合わせ",
    description:
      "脂溶性ビタミンのため、食事と一緒または油脂配合製品を選ぶと吸収率UP。",
    important: false,
  },
  {
    item: "K2配合の有無",
    description: "骨の健康重視ならK2配合製品がおすすめ。単独でも問題なし。",
    important: false,
  },
  {
    item: "第三者検査の有無",
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
    frequency: "1日1回",
    note: "厚労省目安量。日光浴も併用推奨",
  },
  {
    purpose: "欠乏予防",
    amount: "1000-2000IU",
    frequency: "1日1回",
    note: "血中25(OH)D 30ng/mL以上を目指す",
  },
  {
    purpose: "免疫サポート",
    amount: "2000-4000IU",
    frequency: "1日1回",
    note: "冬季や日照不足時",
  },
  {
    purpose: "骨密度維持",
    amount: "1000-2000IU + K2",
    frequency: "1日1回",
    note: "閉経後女性、高齢者におすすめ",
  },
  {
    purpose: "欠乏症治療",
    amount: "4000-10000IU",
    frequency: "医師の指示",
    note: "必ず血液検査で確認を",
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

// 関連成分
const RELATED_INGREDIENTS = [
  {
    name: "ビタミンK2",
    slug: "vitamin-k",
    emoji: "💜",
    reason: "カルシウムを骨に届ける相乗効果",
  },
  {
    name: "カルシウム",
    slug: "calcium",
    emoji: "🦴",
    reason: "ビタミンDが吸収を促進",
  },
  {
    name: "マグネシウム",
    slug: "magnesium",
    emoji: "💎",
    reason: "ビタミンDの活性化に必要",
  },
  {
    name: "亜鉛",
    slug: "zinc",
    emoji: "🔶",
    reason: "免疫機能をダブルでサポート",
  },
];

export default async function VitaminDComparisonPage() {
  const products = await getVitaminDProducts();

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

      const vitaminDIngredient = product.ingredients?.find(
        (i) =>
          i.ingredient?.name?.includes("ビタミンD") ||
          i.ingredient?.name?.includes("Vitamin D"),
      );
      const amountPerServing = vitaminDIngredient?.amountMgPerServing || 0;
      const amountIU =
        amountPerServing < 1 ? amountPerServing * 40 : amountPerServing;
      const pricePerIU =
        amountIU > 0
          ? product.priceJPY / (amountIU * product.servingsPerContainer)
          : 0;

      return {
        ...product,
        effectiveCostPerDay,
        amountIU,
        pricePerIU,
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
              ビタミンD比較
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
                backgroundColor: systemColors.yellow + "15",
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
          <h2
            className={`${typography.title3} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            目次
          </h2>
          <nav>
            <ol className="space-y-2">
              {SECTIONS.map((section, i) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex items-center gap-3 text-[15px] hover:opacity-70 transition-opacity"
                    style={{ color: systemColors.blue }}
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-medium"
                      style={{
                        backgroundColor: systemColors.orange + "15",
                        color: systemColors.orange,
                      }}
                    >
                      {i + 1}
                    </span>
                    {section.title}
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

        {/* 5. 結論ファースト */}
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
                {QUICK_RECOMMENDATIONS.map((rec, i) => (
                  <li key={i} style={{ color: appleWebColors.textPrimary }}>
                    <strong>{rec.label}</strong>→{rec.text}
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
            ビタミンDサプリの種類と選び方
          </h2>
          <p
            className="text-[15px] leading-[1.7] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            ビタミンDサプリは大きく5つのタイプに分かれます。それぞれの特徴を理解して、あなたに合ったものを選びましょう。
          </p>

          <div className="space-y-4">
            {VITAMIN_D_TYPES.map((type) => (
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

        {/* 7. 目的別おすすめ */}
        <section id="purpose-recommendations" className="mb-12">
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
            コスパランキングTOP3｜ビタミンDサプリ
          </h2>
          <p
            className="text-[15px] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            1日あたりのコストで比較した、最もお得なビタミンDサプリメントです。
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
                    {product.amountIU > 0 && (
                      <span style={{ color: appleWebColors.textSecondary }}>
                        含有量:{" "}
                        <span className="font-bold">
                          {product.amountIU.toFixed(0)}IU
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
                現在、ビタミンDサプリメントの商品データを準備中です。
              </p>
            </div>
          )}
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
            ビタミンDは脂溶性のため過剰摂取に注意が必要です。目的に応じた適切な量を守りましょう。
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
            ビタミンDは脂溶性ビタミンのため、過剰摂取には注意が必要です。以下の点を理解した上で適切に摂取しましょう。
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
        <section id="related" className="mb-12">
          <h2
            className={`${typography.title2} mb-6`}
            style={{ color: appleWebColors.textPrimary }}
          >
            ビタミンDと一緒に摂りたい成分
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
            ビタミンDサプリをもっと詳しく比較
          </h2>
          <p className="text-[15px] opacity-90 mb-6">
            サプティアでは、5つの評価軸で商品を比較できます
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products?ingredient=vitamin-d"
              className="inline-flex items-center justify-center gap-2 bg-white font-bold px-6 py-3 rounded-[12px] transition-colors hover:bg-gray-100"
              style={{ color: systemColors.orange }}
            >
              全商品を見る
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/ingredients/vitamin-d"
              className="inline-flex items-center justify-center gap-2 bg-white/20 font-medium px-6 py-3 rounded-[12px] transition-colors hover:bg-white/30"
            >
              ビタミンD成分ガイド
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
