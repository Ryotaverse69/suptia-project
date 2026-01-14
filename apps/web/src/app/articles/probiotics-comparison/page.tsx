/**
 * 乳酸菌・プロバイオティクス比較記事ページ
 * SEO最適化された比較コンテンツ
 * 統一テンプレート準拠（15セクション構成）
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

const ARTICLE_DATA = {
  title:
    "【2025年最新】乳酸菌・プロバイオティクスおすすめ比較｜菌種・CFU・効果で徹底分析",
  description:
    "乳酸菌・プロバイオティクスを菌種（ラクトバチルス・ビフィズス菌等）・CFU・効果で徹底比較。腸活・免疫・メンタルへの効果的な選び方。",
  publishedAt: "2025-01-19",
  updatedAt: new Date().toISOString().split("T")[0],
  ingredientName: "プロバイオティクス",
  ingredientSlug: "probiotics",
};

const ogImageUrl = getArticleOGImage("probiotics-comparison");
const ogImage = generateOGImageMeta(
  ogImageUrl,
  "乳酸菌・プロバイオティクス比較 - サプティア",
);

export const metadata: Metadata = {
  title: ARTICLE_DATA.title,
  description: ARTICLE_DATA.description,
  keywords: [
    "乳酸菌",
    "プロバイオティクス",
    "サプリメント",
    "おすすめ",
    "比較",
    "2025",
    "ビフィズス菌",
    "ラクトバチルス",
    "腸活",
    "腸内フローラ",
  ],
  openGraph: {
    title: ARTICLE_DATA.title,
    description: ARTICLE_DATA.description,
    type: "article",
    publishedTime: ARTICLE_DATA.publishedAt,
    modifiedTime: ARTICLE_DATA.updatedAt,
    url: "https://suptia.com/articles/probiotics-comparison",
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
    canonical: "https://suptia.com/articles/probiotics-comparison",
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

async function getProbioticsProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && availability == "in-stock" && (
    name match "*乳酸菌*" ||
    name match "*プロバイオティクス*" ||
    name match "*ビフィズス*" ||
    name match "*Probiotic*" ||
    name match "*Lactobacillus*"
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
    console.error("Failed to fetch probiotics products:", error);
    return [];
  }
}

// この記事でわかること
const LEARNING_POINTS = [
  "主要な菌種（ラクトバチルス・ビフィズス菌等）の違いと効果",
  "CFU（菌数）の目安と選び方のポイント",
  "目的別（便秘・免疫・メンタル・女性の健康）の最適な菌種",
  "プロバイオティクスとプレバイオティクスの違い",
  "効果を最大化する摂取方法と保存の注意点",
];

// 結論ファースト
const QUICK_RECOMMENDATIONS = [
  {
    label: "初心者・総合的な腸活なら",
    recommendation: "マルチストレイン（複数菌種）100億CFU以上",
  },
  {
    label: "便秘対策なら",
    recommendation: "ビフィズス菌（B. longum, B. lactis）200億CFU以上",
  },
  {
    label: "免疫強化なら",
    recommendation: "ラクトバチルス（L. rhamnosus GG）",
  },
  {
    label: "抗生物質服用中なら",
    recommendation: "サッカロマイセス・ブラウディ",
  },
];

// 菌種データ
const PROBIOTICS_TYPES = [
  {
    name: "ラクトバチルス（乳酸桿菌）",
    nameEn: "Lactobacillus",
    location: "小腸",
    benefit: "消化・免疫・女性の健康",
    strains: "L. acidophilus, L. rhamnosus, L. plantarum等",
    description:
      "最も研究が進んだ菌種。乳酸を産生して悪玉菌を抑制。免疫力向上、アレルギー軽減の研究あり。",
    best: "消化器系・免疫強化・女性（膣内環境）",
    color: systemColors.green,
  },
  {
    name: "ビフィドバクテリウム（ビフィズス菌）",
    nameEn: "Bifidobacterium",
    location: "大腸",
    benefit: "便通・免疫・栄養吸収",
    strains: "B. longum, B. lactis, B. bifidum等",
    description:
      "大腸に多く存在。短鎖脂肪酸を産生して腸内環境を改善。加齢とともに減少するため補給が重要。",
    best: "便秘・大腸の健康・高齢者",
    color: systemColors.blue,
  },
  {
    name: "サッカロマイセス（酵母菌）",
    nameEn: "Saccharomyces boulardii",
    location: "消化管全体",
    benefit: "下痢予防・抗生物質対策",
    strains: "S. boulardii",
    description:
      "唯一のプロバイオティクス酵母。抗生物質による下痢予防に効果。胃酸に強く生きて届きやすい。",
    best: "旅行者下痢・抗生物質服用中",
    color: systemColors.orange,
  },
  {
    name: "ストレプトコッカス",
    nameEn: "Streptococcus thermophilus",
    location: "小腸",
    benefit: "乳糖消化・免疫",
    strains: "S. thermophilus",
    description:
      "ヨーグルト製造に使用される菌。乳糖不耐症の改善、免疫調整作用が研究されている。",
    best: "乳糖不耐症・ヨーグルト製品",
    color: systemColors.purple,
  },
  {
    name: "バチルス（芽胞形成菌）",
    nameEn: "Bacillus",
    location: "消化管全体",
    benefit: "安定性・免疫",
    strains: "B. coagulans, B. subtilis",
    description:
      "芽胞を形成し、熱・酸に強い。常温保存可能で、生きて腸まで届きやすい。",
    best: "保存性重視・旅行時",
    color: systemColors.cyan,
  },
  {
    name: "マルチストレイン（複数菌種）",
    nameEn: "Multi-Strain",
    location: "消化管全体",
    benefit: "総合的な腸内環境改善",
    strains: "複数の菌種・株を配合",
    description:
      "複数の菌種を組み合わせることで、相乗効果が期待できる。最も一般的なサプリ形態。",
    best: "初めての方・総合的な腸活",
    color: systemColors.pink,
  },
];

// 目的別おすすめ
const PURPOSE_RECOMMENDATIONS = [
  {
    purpose: "便秘改善・お通じ対策",
    icon: Heart,
    description: "便秘気味、お腹が張る、便の状態が悪い",
    recommendation: "ビフィズス菌（B. longum, B. lactis）+ 食物繊維",
    reason:
      "ビフィズス菌は大腸で短鎖脂肪酸を産生し、腸の蠕動運動を促進。プレバイオティクス（食物繊維）との併用で効果アップ。",
    tips: "100億CFU以上を目安に。水分と食物繊維も十分に摂取を。",
  },
  {
    purpose: "免疫力強化",
    icon: Shield,
    description: "風邪をひきやすい、アレルギー対策、感染症予防",
    recommendation: "L. rhamnosus GG + B. lactis BB-12",
    reason:
      "免疫細胞の約70%は腸に存在。ラクトバチルスは免疫調整作用が研究で示されている。",
    tips: "ビタミンD・亜鉛との併用で免疫サポート強化。",
  },
  {
    purpose: "メンタル・ストレス対策",
    icon: Brain,
    description: "不安、ストレス、気分の落ち込み",
    recommendation: "L. helveticus + B. longum（Psychobiotics）",
    reason:
      "腸脳相関により、腸内環境がメンタルに影響。サイコバイオティクスと呼ばれる菌種が研究されている。",
    tips: "オメガ3・マグネシウムとの併用でさらに効果的。",
  },
  {
    purpose: "抗生物質との併用・下痢予防",
    icon: Shield,
    description: "抗生物質を服用中、旅行者下痢の予防",
    recommendation: "サッカロマイセス・ブラウディ（S. boulardii）",
    reason:
      "抗生物質に影響されにくい酵母菌。抗生物質関連下痢（AAD）の予防に効果が示されている。",
    tips: "抗生物質と2時間以上間隔をあけて服用。",
  },
  {
    purpose: "女性の健康・膣内環境",
    icon: Heart,
    description: "カンジダ対策、膣内環境の改善",
    recommendation: "L. rhamnosus GR-1 + L. reuteri RC-14",
    reason:
      "膣内環境に良い影響を与える特定の菌株。カンジダや細菌性膣症の予防に研究あり。",
    tips: "経口摂取でも膣内環境に影響するという研究あり。",
  },
];

// 選び方チェックリスト
const SELECTION_CHECKLIST = [
  {
    item: "CFU（菌数）を確認",
    description:
      "最低10億CFU以上、一般的には100〜500億CFU。「製造時」でなく「賞味期限時」の保証が重要。",
    important: true,
  },
  {
    item: "菌種・株の明記を確認",
    description:
      "「乳酸菌」だけでなく、具体的な菌株（例: L. rhamnosus GG）が明記されている製品を選ぶ。",
    important: true,
  },
  {
    item: "生菌が腸まで届くか",
    description:
      "腸溶性カプセル、芽胞形成菌、胃酸耐性コーティングなど、生きて届く工夫があるか。",
    important: true,
  },
  {
    item: "保存方法を確認",
    description:
      "要冷蔵か常温保存可能か。芽胞形成菌や特殊コーティングは常温でも安定。",
    important: false,
  },
  {
    item: "プレバイオティクスの有無",
    description:
      "FOS、イヌリン、GOS等のプレバイオティクス（善玉菌のエサ）配合だと効果的。",
    important: false,
  },
];

// 摂取量ガイド
const DOSAGE_GUIDE = [
  {
    purpose: "一般的な腸活・健康維持",
    amount: "100〜500億CFU/日",
    frequency: "1日1回",
    note: "食前または食事と一緒に摂取",
  },
  {
    purpose: "便秘改善・消化器症状",
    amount: "200〜500億CFU/日",
    frequency: "1日1〜2回",
    note: "効果を感じるまで2〜4週間",
  },
  {
    purpose: "抗生物質服用中",
    amount: "100〜250億CFU/日",
    frequency: "1日1〜2回",
    note: "抗生物質と2時間以上間隔をあける",
  },
  {
    purpose: "免疫強化",
    amount: "100〜300億CFU/日",
    frequency: "1日1回",
    note: "風邪シーズン前から継続が効果的",
  },
  {
    purpose: "初めての方",
    amount: "50〜100億CFU/日",
    frequency: "1日1回",
    note: "少量から始めて徐々に増やす",
  },
];

// 注意点・副作用
const CAUTIONS = [
  {
    title: "初期にガス・膨満感が出ることも",
    description:
      "腸内環境が変化する過程で、一時的にガスやお腹の張りが増えることがある。1〜2週間で落ち着くことが多い。",
    severity: "info",
  },
  {
    title: "免疫抑制状態の方は注意",
    description:
      "重度の免疫不全、がん治療中、臓器移植後などの方は、感染リスクがあるため医師に相談を。",
    severity: "warning",
  },
  {
    title: "乳製品アレルギーの方",
    description:
      "一部の製品は乳由来成分を含む場合がある。アレルギー表示を必ず確認。乳フリーの製品もあり。",
    severity: "warning",
  },
  {
    title: "抗生物質との相互作用",
    description:
      "抗生物質はプロバイオティクスも殺すことがある。2時間以上間隔をあけるか、S. boulardiiを選ぶ。",
    severity: "info",
  },
  {
    title: "保存方法に注意",
    description:
      "多くのプロバイオティクスは要冷蔵。高温・湿気で菌が死滅する。保存方法を必ず確認。",
    severity: "info",
  },
];

// FAQ
const FAQS = [
  {
    question: "プロバイオティクスとプレバイオティクスの違いは？",
    answer:
      "プロバイオティクスは生きた善玉菌そのもの（乳酸菌、ビフィズス菌など）。プレバイオティクスは善玉菌のエサとなる食物繊維やオリゴ糖（イヌリン、FOS、GOSなど）です。両方を組み合わせた製品は「シンバイオティクス」と呼ばれ、相乗効果が期待できます。プレバイオティクスは既存の善玉菌を育て、プロバイオティクスは新たな善玉菌を補給するという違いがあります。",
  },
  {
    question: "CFU（菌数）は多いほど良いですか？",
    answer:
      "必ずしもそうではありません。菌種・株によって効果的な量は異なり、研究で効果が示された量が重要です。一般的には100〜500億CFUで十分な効果が期待できます。むしろ、菌数よりも「製造時」ではなく「賞味期限時」に保証された数値か、生きて腸まで届く工夫があるかの方が重要です。極端に多い（1兆CFU等）製品が必ずしも良いわけではありません。",
  },
  {
    question: "プロバイオティクスはいつ飲むのが効果的？",
    answer:
      "製品によって推奨が異なりますが、一般的には食前30分または食事と一緒が推奨されます。食事の脂質が胃酸から菌を守る効果があるという説もあります。空腹時に飲むと胃酸で菌が死にやすいという研究もありますが、腸溶性カプセルや胃酸耐性のある菌種（芽胞形成菌）なら空腹時でも問題ありません。最も大切なのは継続することなので、習慣にしやすい時間帯に。",
  },
  {
    question: "乳酸菌サプリとヨーグルト、どちらが良い？",
    answer:
      "どちらにもメリットがあります。ヨーグルトは食品として栄養素（カルシウム、タンパク質）も摂取でき、日常的に続けやすい。一方、サプリメントは菌種・株が明確で、高濃度（数百億CFU）を摂取でき、乳製品不使用の製品もあります。コスト面ではサプリの方が菌数あたりでは安いことが多いです。目的や生活スタイルに合わせて選びましょう。",
  },
  {
    question: "プロバイオティクスは毎日飲む必要がありますか？",
    answer:
      "基本的に毎日の摂取が推奨されます。プロバイオティクスの菌は腸内に定着しにくく、継続的に補給することで効果を維持します。多くの研究では2〜4週間の継続で効果が現れ始め、8〜12週間で安定した効果が得られています。ただし、特定の目的（旅行中の下痢予防など）なら期間限定でも意味があります。",
  },
  {
    question: "プロバイオティクスで効果がない場合は？",
    answer:
      "いくつかの理由が考えられます。(1)菌種が自分に合っていない：人によって効果的な菌種は異なるため、別の菌種を試す。(2)CFUが足りない：100億CFU以上に増量。(3)生きて届いていない：腸溶性カプセルや胃酸耐性のある製品に変更。(4)期間が短い：最低4週間は継続。(5)生活習慣の問題：食物繊維不足、ストレス、睡眠不足は腸内環境に悪影響。(6)より深刻な問題：改善しない場合は医師に相談を。",
  },
  {
    question: "プロバイオティクスは冷蔵保存が必要？",
    answer:
      "製品によります。多くの乳酸菌・ビフィズス菌製品は要冷蔵（2〜8度C）で、高温や湿気で菌が死滅します。一方、芽胞形成菌（バチルス属）や特殊な乾燥技術・コーティングを施した製品は常温保存可能です。旅行時や持ち運びには常温保存可能な製品が便利。購入時と保存時の温度管理が効果に直結するため、保存方法は必ず確認してください。",
  },
];

// 関連成分
const RELATED_INGREDIENTS = [
  {
    name: "食物繊維（プレバイオティクス）",
    slug: "fiber",
    emoji: "🌾",
    reason: "善玉菌のエサとなり相乗効果",
  },
  {
    name: "ビタミンD",
    slug: "vitamin-d",
    emoji: "☀️",
    reason: "腸管免疫をサポート",
  },
  {
    name: "亜鉛",
    slug: "zinc",
    emoji: "⚡",
    reason: "腸管バリア機能を強化",
  },
  {
    name: "オメガ3",
    slug: "omega-3",
    emoji: "🐟",
    reason: "腸内の炎症を抑える",
  },
];

export default async function ProbioticsComparisonPage() {
  const products = await getProbioticsProducts();

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
              乳酸菌・プロバイオティクス比較
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
                backgroundColor: systemColors.green + "15",
                color: systemColors.green,
              }}
            >
              腸活
            </span>
            <span
              className="px-3 py-1 text-[12px] font-medium rounded-full"
              style={{
                backgroundColor: systemColors.blue + "15",
                color: systemColors.blue,
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
                      backgroundColor: systemColors.green + "20",
                      color: systemColors.green,
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
          style={{ borderColor: systemColors.green + "30" }}
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
                  style={{ color: systemColors.green }}
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
            background: `linear-gradient(135deg, ${systemColors.green}15, ${systemColors.blue}15)`,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: systemColors.green }}
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
                    <strong>{rec.label}</strong>
                    <span className="ml-1">→{rec.recommendation}</span>
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
            プロバイオティクスの菌種と選び方
          </h2>
          <p
            className="text-[15px] leading-[1.7] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            「乳酸菌」と一口に言っても、様々な菌種があり、それぞれ効果が異なります。
            目的に合った菌種を選ぶことで、効果を最大化できます。
          </p>

          <div className="space-y-4">
            {PROBIOTICS_TYPES.map((type) => (
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
                      className="text-[14px] leading-[1.6] mb-2"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      {type.description}
                    </p>
                    <div className="flex flex-wrap gap-2 text-[13px]">
                      <span
                        className="px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: appleWebColors.sectionBackground,
                          color: appleWebColors.textSecondary,
                        }}
                      >
                        主な場所: {type.location}
                      </span>
                      <span
                        className="px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: appleWebColors.sectionBackground,
                          color: appleWebColors.textSecondary,
                        }}
                      >
                        効果: {type.benefit}
                      </span>
                    </div>
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
            目的別｜あなたに合ったプロバイオティクスはこれ
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
                      style={{ backgroundColor: systemColors.green + "20" }}
                    >
                      <Icon size={20} style={{ color: systemColors.green }} />
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
                          style={{ color: systemColors.green }}
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
            コスパランキングTOP3｜プロバイオティクスサプリ
          </h2>
          <p
            className="text-[15px] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            1日あたりのコストで比較した、最もお得なプロバイオティクスサプリメントです。
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
                現在、プロバイオティクスサプリメントの商品データを準備中です。
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
                        ? systemColors.green
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
                            backgroundColor: systemColors.green + "20",
                            color: systemColors.green,
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
            CFU（菌数）は製品によって大きく異なります。目的に応じた適切な量を選びましょう。
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
                      style={{ color: systemColors.green }}
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
            プロバイオティクスは一般的に安全ですが、一部の方は注意が必要です。
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
            プロバイオティクスと一緒に摂りたい成分
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
            background: `linear-gradient(135deg, ${systemColors.green}, ${systemColors.blue})`,
          }}
        >
          <h2 className={`${typography.title2} mb-4`}>
            プロバイオティクスサプリをもっと詳しく比較
          </h2>
          <p className="text-[15px] opacity-90 mb-6">
            サプティアでは、5つの評価軸で商品を比較できます
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products?q=乳酸菌"
              className="inline-flex items-center justify-center gap-2 bg-white font-bold px-6 py-3 rounded-[12px] transition-colors hover:bg-gray-100"
              style={{ color: systemColors.green }}
            >
              全商品を見る
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/ingredients"
              className="inline-flex items-center justify-center gap-2 bg-white/20 font-medium px-6 py-3 rounded-[12px] transition-colors hover:bg-white/30"
            >
              成分ガイド一覧
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
