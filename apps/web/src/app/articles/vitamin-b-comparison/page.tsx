/**
 * ビタミンB群比較記事ページ
 * SEO最適化された比較コンテンツ
 * 統一テンプレート v1.0
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
  Shield,
  BadgeCheck,
  Info,
  Brain,
  Battery,
  ExternalLink,
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

export const revalidate = 86400;

// ============================================
// 記事メタデータ
// ============================================
const ARTICLE_DATA = {
  title: "【2026年最新】ビタミンB群サプリおすすめ比較｜B1・B2・B6・B12の選び方",
  description:
    "ビタミンB群サプリを種類・配合量・コスパで徹底比較。B1・B2・B6・B12・葉酸・ナイアシンなど8種のBビタミンの違いと目的別の選び方を解説。",
  publishedAt: "2025-01-19",
  updatedAt: new Date().toISOString().split("T")[0],
  ingredientName: "ビタミンB群",
  ingredientSlug: "vitamin-b-complex",
  category: "ビタミン",
  categoryColor: systemColors.orange,
};

const ogImageUrl = getArticleOGImage("vitamin-b-comparison");
const ogImage = generateOGImageMeta(
  ogImageUrl,
  "ビタミンB群サプリメント比較 - サプティア",
);

export const metadata: Metadata = {
  title: ARTICLE_DATA.title,
  description: ARTICLE_DATA.description,
  keywords: [
    "ビタミンB群",
    "サプリメント",
    "おすすめ",
    "比較",
    "2026",
    "ビタミンB12",
    "葉酸",
    "ナイアシン",
    "疲労回復",
    "エネルギー",
  ],
  openGraph: {
    title: ARTICLE_DATA.title,
    description: ARTICLE_DATA.description,
    type: "article",
    publishedTime: ARTICLE_DATA.publishedAt,
    modifiedTime: ARTICLE_DATA.updatedAt,
    url: "https://suptia.com/articles/vitamin-b-comparison",
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
    canonical: "https://suptia.com/articles/vitamin-b-comparison",
  },
};

// ============================================
// 目次用セクションデータ
// ============================================
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

// ============================================
// この記事でわかること（5項目）
// ============================================
const LEARNING_POINTS = [
  "8種のビタミンB群それぞれの役割と不足症状",
  "活性型（コエンザイム型）と通常型の違い",
  "目的別（疲労回復・妊活・美容・メンタル）の選び方",
  "コスパランキングと効果的な摂取タイミング",
  "ベジタリアン・ヴィーガンが必ず摂るべきB群",
];

// ============================================
// 結論ファースト（3-5項目）
// ============================================
const QUICK_RECOMMENDATIONS = [
  {
    condition: "総合的な健康維持なら",
    recommendation: "B群コンプレックス。8種をバランスよく。",
  },
  {
    condition: "妊活・妊娠中なら",
    recommendation: "メチル葉酸400〜800μg。活性型が確実。",
  },
  {
    condition: "ベジタリアンなら",
    recommendation: "B12（メチルコバラミン）必須。舌下錠が効率的。",
  },
  {
    condition: "髪・肌・爪なら",
    recommendation: "ビオチン5000μg + B群コンプレックス。",
  },
];

// ============================================
// 関連成分（4種類）
// ============================================
const RELATED_INGREDIENTS = [
  {
    name: "マグネシウム",
    slug: "magnesium",
    emoji: "🔵",
    reason: "エネルギー代謝・ストレス対策に相乗効果",
  },
  {
    name: "ビタミンC",
    slug: "vitamin-c",
    emoji: "🍊",
    reason: "抗酸化作用・免疫機能をサポート",
  },
  {
    name: "鉄分",
    slug: "iron",
    emoji: "🔴",
    reason: "B12・葉酸と共に造血をサポート",
  },
  {
    name: "亜鉛",
    slug: "zinc",
    emoji: "🔶",
    reason: "免疫機能・代謝をサポート",
  },
];

// ============================================
// 商品型定義
// ============================================
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

async function getVitaminBProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && availability == "in-stock" && (
    name match "*ビタミンB*" ||
    name match "*B群*" ||
    name match "*B-Complex*" ||
    name match "*B complex*"
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
    console.error("Failed to fetch vitamin B products:", error);
    return [];
  }
}

// ============================================
// ビタミンB群の種類データ
// ============================================
const VITAMIN_B_TYPES = [
  {
    name: "ビタミンB1（チアミン）",
    nameEn: "Thiamine",
    function: "糖質代謝・神経機能",
    deficiency: "疲労、集中力低下、脚気",
    foodSource: "豚肉、玄米、大豆",
    best: "糖質をよく摂る方・疲れやすい方",
    color: systemColors.orange,
  },
  {
    name: "ビタミンB2（リボフラビン）",
    nameEn: "Riboflavin",
    function: "脂質代謝・皮膚粘膜",
    deficiency: "口内炎、口角炎、肌荒れ",
    foodSource: "レバー、卵、乳製品",
    best: "肌トラブルが気になる方",
    color: "#FFD60A",
  },
  {
    name: "ビタミンB6（ピリドキシン）",
    nameEn: "Pyridoxine",
    function: "タンパク質代謝・神経伝達物質",
    deficiency: "貧血、皮膚炎、抑うつ",
    foodSource: "マグロ、バナナ、鶏肉",
    best: "タンパク質を多く摂る方・PMS対策",
    color: systemColors.green,
  },
  {
    name: "ビタミンB12（コバラミン）",
    nameEn: "Cobalamin",
    function: "赤血球生成・神経機能",
    deficiency: "悪性貧血、しびれ、認知機能低下",
    foodSource: "貝類、レバー、魚",
    best: "ベジタリアン・高齢者・貧血気味の方",
    color: systemColors.red,
  },
  {
    name: "葉酸（B9）",
    nameEn: "Folic Acid / Folate",
    function: "DNA合成・細胞分裂",
    deficiency: "貧血、胎児の神経管欠損",
    foodSource: "緑黄色野菜、レバー",
    best: "妊娠希望・妊娠中の女性",
    color: systemColors.pink,
  },
  {
    name: "ナイアシン（B3）",
    nameEn: "Niacin",
    function: "エネルギー代謝・皮膚健康",
    deficiency: "ペラグラ、皮膚炎、下痢",
    foodSource: "鶏肉、マグロ、きのこ",
    best: "エネルギー代謝を高めたい方",
    color: systemColors.purple,
  },
  {
    name: "パントテン酸（B5）",
    nameEn: "Pantothenic Acid",
    function: "CoA合成・ホルモン産生",
    deficiency: "まれ（疲労、しびれ）",
    foodSource: "レバー、卵黄、アボカド",
    best: "ストレスが多い方",
    color: systemColors.blue,
  },
  {
    name: "ビオチン（B7）",
    nameEn: "Biotin",
    function: "糖新生・脂肪酸合成",
    deficiency: "脱毛、皮膚炎、爪の脆弱化",
    foodSource: "卵黄、レバー、ナッツ",
    best: "髪・爪の健康を気にする方",
    color: systemColors.cyan,
  },
];

// ============================================
// 目的別おすすめ
// ============================================
const PURPOSE_RECOMMENDATIONS = [
  {
    purpose: "疲労回復・エネルギー補給",
    icon: Battery,
    emoji: "1",
    description: "毎日疲れやすい、朝起きられない",
    recommendation: "B群コンプレックス（高含有）",
    reason:
      "B1・B2・B3がエネルギー代謝に必須。単体より複合型で相乗効果が期待できる。",
    tips: "活性型（コエンザイム型）だとさらに効率的に利用される。",
  },
  {
    purpose: "妊娠・妊活サポート",
    icon: Heart,
    emoji: "2",
    description: "妊娠希望、妊娠中、授乳中",
    recommendation: "葉酸（メチル葉酸）+ B12",
    reason:
      "葉酸は胎児の神経管閉鎖障害を予防。B12は葉酸の働きをサポート。妊娠前から摂取が推奨。",
    tips: "メチル葉酸（活性型）なら遺伝的に葉酸代謝が苦手な人にも効果的。",
  },
  {
    purpose: "メンタル・ストレス対策",
    icon: Brain,
    emoji: "3",
    description: "ストレスが多い、気分が落ち込む",
    recommendation: "B6 + B12 + 葉酸",
    reason:
      "セロトニン・ドーパミンなど神経伝達物質の合成にB群が必須。ホモシステイン低下効果も。",
    tips: "マグネシウムとの併用でさらにストレス対策効果アップ。",
  },
  {
    purpose: "髪・肌・爪の美容",
    icon: Heart,
    emoji: "4",
    description: "抜け毛、肌荒れ、爪が弱い",
    recommendation: "ビオチン + B2 + B6",
    reason:
      "ビオチンは髪・爪の主成分ケラチン生成をサポート。B2・B6は皮膚の健康維持に関与。",
    tips: "亜鉛・ビタミンCとの併用でさらに効果的。",
  },
  {
    purpose: "ベジタリアン・ヴィーガン",
    icon: Shield,
    emoji: "5",
    description: "動物性食品を控えている",
    recommendation: "ビタミンB12（メチルコバラミン）",
    reason:
      "B12は動物性食品にしか含まれないため、菜食者は必ずサプリで補給が必要。欠乏は神経障害のリスク。",
    tips: "舌下錠やスプレータイプだと吸収率が高い。",
  },
];

// ============================================
// 選び方チェックリスト
// ============================================
const SELECTION_CHECKLIST = [
  {
    item: "活性型（コエンザイム型）を確認",
    description:
      "メチルコバラミン、メチル葉酸、P-5-Pなど活性型は体内で変換不要で効率的。",
    important: true,
  },
  {
    item: "全8種のB群が含まれているか",
    description:
      "B群は相互に作用するため、複合型（コンプレックス）がおすすめ。単体は特定目的に。",
    important: true,
  },
  {
    item: "含有量を確認",
    description:
      "推奨量の100〜500%程度が一般的。ナイアシンは高用量でフラッシュ（ほてり）に注意。",
    important: false,
  },
  {
    item: "添加物・品質認証を確認",
    description:
      "GMP認証、第三者機関テスト済みなど。信頼できるブランドを選択。",
    important: false,
  },
  {
    item: "飲みやすさを確認",
    description:
      "B群は尿が黄色くなるのが正常。タイムリリース型なら1日1回で済む。",
    important: false,
  },
];

// ============================================
// 摂取量ガイド
// ============================================
const DOSAGE_GUIDE = [
  {
    purpose: "一般的な健康維持",
    amount: "推奨量の100〜200%",
    frequency: "1日1〜2回",
    note: "B群コンプレックスで総合的に補給",
  },
  {
    purpose: "疲労回復・高ストレス時",
    amount: "推奨量の300〜500%",
    frequency: "1日2回に分けて",
    note: "水溶性なので過剰分は排泄される",
  },
  {
    purpose: "妊娠希望・妊娠中（葉酸）",
    amount: "400〜800μg/日",
    frequency: "1日1回",
    note: "妊娠前3ヶ月から継続がベスト",
  },
  {
    purpose: "ベジタリアン（B12）",
    amount: "250〜1000μg/日",
    frequency: "1日1回または週数回高用量",
    note: "舌下錠・スプレーで吸収率アップ",
  },
  {
    purpose: "髪・肌・爪（ビオチン）",
    amount: "2500〜5000μg/日",
    frequency: "1日1回",
    note: "効果実感まで2〜3ヶ月かかることも",
  },
];

// ============================================
// 注意点・副作用
// ============================================
const CAUTIONS = [
  {
    title: "ナイアシンフラッシュ",
    description:
      "高用量のナイアシン（ニコチン酸）は顔面紅潮、ほてり、かゆみを起こすことがある。ナイアシンアミドなら起きにくい。",
    severity: "warning",
  },
  {
    title: "B6の過剰摂取",
    description:
      "長期間200mg/日以上で末梢神経障害の報告あり。上限摂取量は100mg/日。",
    severity: "warning",
  },
  {
    title: "尿の黄色化",
    description:
      "B2（リボフラビン）により尿が鮮やかな黄色になるが、これは正常で無害。過剰分が排泄されている証拠。",
    severity: "info",
  },
  {
    title: "葉酸とB12のバランス",
    description:
      "高用量の葉酸はB12欠乏を隠す可能性がある。特に高齢者は両方の摂取を推奨。",
    severity: "info",
  },
  {
    title: "薬との相互作用",
    description:
      "一部の抗てんかん薬、メトホルミン、制酸剤などはB群の吸収・代謝に影響。服薬中は医師に相談。",
    severity: "warning",
  },
];

// ============================================
// FAQ
// ============================================
const FAQS = [
  {
    question: "ビタミンB群は単体と複合型どちらがいいですか？",
    answer:
      "一般的には複合型（B-Complex）がおすすめです。8種のBビタミンは相互に作用し合うため、バランスよく摂取することで相乗効果が期待できます。ただし、妊娠中の葉酸補給、ベジタリアンのB12補給、特定の欠乏症治療など、明確な目的がある場合は単体の高用量が適切なこともあります。迷ったら複合型を選んでおけば間違いありません。",
  },
  {
    question: "活性型ビタミンB群とは何ですか？",
    answer:
      "活性型とは、体内で利用される形態のビタミンBのことです。通常のビタミンBは体内で酵素によって活性型に変換されてから使われますが、遺伝的に変換能力が低い人もいます。活性型の例：メチルコバラミン（B12）、メチル葉酸（B9）、P-5-P（B6）、リボフラビン-5-リン酸（B2）など。変換ステップが不要なため、より効率的に利用されます。",
  },
  {
    question: "ビタミンB群を飲むと尿が黄色くなるのはなぜ？",
    answer:
      "これはビタミンB2（リボフラビン）の色によるもので、全く問題ありません。むしろ、サプリメントが吸収されている証拠であり、過剰分が正常に排泄されていることを示しています。水溶性ビタミンは必要量を超えると尿として排出されます。尿の色が変わっても健康上の心配はありません。",
  },
  {
    question: "ビタミンB群はいつ飲むのが効果的？",
    answer:
      "食後に摂取するのがベストです。食事と一緒に摂ることで吸収率が高まり、胃への刺激も軽減されます。エネルギー代謝に関わるため、朝食後または昼食後がおすすめ。夜に高用量を摂ると、一部の人はエネルギーが出すぎて睡眠に影響することがあります。タイムリリース型なら1日1回朝に摂取すれば、1日を通じて安定した効果が期待できます。",
  },
  {
    question: "葉酸サプリはいつから飲み始めるべき？",
    answer:
      "妊娠を希望する場合、妊娠の少なくとも1〜3ヶ月前から摂取を開始することが推奨されています。胎児の神経管は妊娠初期（受精後28日頃まで）に形成されるため、妊娠がわかってからでは遅い場合があります。厚生労働省は妊娠可能な女性に1日400μgの葉酸サプリメント摂取を推奨しています。メチル葉酸（活性型）を選ぶとより確実です。",
  },
  {
    question: "ベジタリアン・ヴィーガンはどのB群が不足しやすい？",
    answer:
      "最も注意すべきはビタミンB12です。B12は動物性食品（肉、魚、卵、乳製品）にしか含まれないため、植物性のみの食事では必ず不足します。B12欠乏は貧血、神経障害、認知機能低下を引き起こす可能性があり、発症までに数年かかることもあるため気づきにくいです。ヴィーガンは必ずB12サプリメントを摂取してください。舌下錠やスプレータイプが吸収率が高くおすすめです。",
  },
  {
    question: "ビタミンB群は摂りすぎても大丈夫？",
    answer:
      "水溶性ビタミンなので基本的に過剰分は尿として排泄されますが、例外もあります。ビタミンB6は長期間200mg/日以上で末梢神経障害を起こす可能性があり、上限摂取量は100mg/日に設定されています。ナイアシン（ニコチン酸型）は高用量でフラッシュ反応や肝機能への影響が報告されています。一般的なB群サプリの用量なら心配ありませんが、メガドーズは避けましょう。",
  },
];

// ============================================
// メインコンポーネント
// ============================================
export default async function VitaminBComparisonPage() {
  const products = await getVitaminBProducts();

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
      {/* ============================================ */}
      {/* 1. [sticky] パンくずナビ */}
      {/* ============================================ */}
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
              ビタミンB群比較
            </span>
          </nav>
        </div>
      </div>

      {/* ============================================ */}
      {/* 2. ヒーローセクション（タイトル + アイキャッチ） */}
      {/* ============================================ */}
      <header className="pt-8 pb-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="px-3 py-1 text-[12px] font-medium rounded-full"
              style={{
                backgroundColor: ARTICLE_DATA.categoryColor + "15",
                color: ARTICLE_DATA.categoryColor,
              }}
            >
              {ARTICLE_DATA.category}
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
        {/* ============================================ */}
        {/* 3. 目次 */}
        {/* ============================================ */}
        <section
          className={`${liquidGlassClasses.light} rounded-[20px] p-6 mb-12 border`}
          style={{ borderColor: appleWebColors.borderSubtle }}
        >
          <div className="flex items-center gap-2 mb-4">
            <List size={20} style={{ color: ARTICLE_DATA.categoryColor }} />
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
                    className="flex items-center gap-3 text-[15px] hover:opacity-70 transition-opacity"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-medium"
                      style={{
                        backgroundColor: ARTICLE_DATA.categoryColor + "15",
                        color: ARTICLE_DATA.categoryColor,
                      }}
                    >
                      {index + 1}
                    </span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </section>

        {/* ============================================ */}
        {/* 4. この記事でわかること */}
        {/* ============================================ */}
        <section
          id="learning-points"
          className={`${liquidGlassClasses.light} rounded-[20px] p-6 mb-12 border`}
          style={{ borderColor: ARTICLE_DATA.categoryColor + "30" }}
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
                  style={{ color: ARTICLE_DATA.categoryColor }}
                />
                <span style={{ color: appleWebColors.textPrimary }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ============================================ */}
        {/* 5. 結論ファースト（迷ったらこれ） */}
        {/* ============================================ */}
        <section
          id="quick-recommendations"
          className="mb-12 rounded-[20px] p-6 md:p-8"
          style={{
            background: `linear-gradient(135deg, ${ARTICLE_DATA.categoryColor}15, ${systemColors.yellow}15)`,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: ARTICLE_DATA.categoryColor }}
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
                    <strong>{rec.condition}</strong>
                    {" -> "}
                    {rec.recommendation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* 6. 種類と特徴 */}
        {/* ============================================ */}
        <section id="types" className="mb-12">
          <h2
            className={`${typography.title2} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            8種のビタミンB群を徹底解説
          </h2>
          <p
            className="text-[15px] leading-[1.7] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            「ビタミンB群」は8種類の水溶性ビタミンの総称です。
            それぞれ異なる役割を持ち、相互に作用し合ってエネルギー代謝や神経機能をサポートします。
          </p>

          <div className="space-y-4">
            {VITAMIN_B_TYPES.map((type) => (
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
                    <div className="space-y-1 text-[14px]">
                      <p style={{ color: appleWebColors.textSecondary }}>
                        <strong>主な働き:</strong> {type.function}
                      </p>
                      <p style={{ color: appleWebColors.textSecondary }}>
                        <strong>不足すると:</strong> {type.deficiency}
                      </p>
                      <p style={{ color: appleWebColors.textSecondary }}>
                        <strong>食品:</strong> {type.foodSource}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="mt-3 pt-3 border-t text-[13px]"
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  <span style={{ color: type.color }}>
                    <Target size={14} className="inline mr-1" />
                    こんな人に: {type.best}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================ */}
        {/* 7. 目的別おすすめ */}
        {/* ============================================ */}
        <section id="purpose-recommendations" className="mb-12">
          <h2
            className={`${typography.title2} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            目的別｜あなたに合ったビタミンB群はこれ
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
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-bold"
                      style={{ backgroundColor: ARTICLE_DATA.categoryColor }}
                    >
                      {rec.emoji}
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
                          style={{ color: ARTICLE_DATA.categoryColor }}
                        >
                          {rec.recommendation}
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

        {/* ============================================ */}
        {/* 8. おすすめ商品ランキング */}
        {/* ============================================ */}
        <section id="ranking" className="mb-12">
          <h2
            className={`${typography.title2} mb-2`}
            style={{ color: appleWebColors.textPrimary }}
          >
            コスパランキングTOP3｜ビタミンB群サプリ
          </h2>
          <p
            className="text-[15px] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            1日あたりのコストで比較した、最もお得なビタミンB群サプリメントです。
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
                現在、ビタミンB群サプリメントの商品データを準備中です。
              </p>
            </div>
          )}
        </section>

        {/* ============================================ */}
        {/* 9. 選び方チェックリスト */}
        {/* ============================================ */}
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
                        ? ARTICLE_DATA.categoryColor
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
                            backgroundColor: ARTICLE_DATA.categoryColor + "20",
                            color: ARTICLE_DATA.categoryColor,
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

        {/* ============================================ */}
        {/* 10. 摂取量・タイミング */}
        {/* ============================================ */}
        <section id="dosage" className="mb-12">
          <h2
            className={`${typography.title2} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            目的別｜摂取量の目安
          </h2>

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
                      style={{ color: ARTICLE_DATA.categoryColor }}
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

        {/* ============================================ */}
        {/* 11. 注意点・副作用 */}
        {/* ============================================ */}
        <section id="cautions" className="mb-12">
          <h2
            className={`${typography.title2} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            注意点・副作用
          </h2>

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

        {/* ============================================ */}
        {/* 12. よくある質問（FAQ） */}
        {/* ============================================ */}
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

        {/* ============================================ */}
        {/* 13. 関連成分 */}
        {/* ============================================ */}
        <section id="related" className="mb-12">
          <h2
            className={`${typography.title2} mb-6`}
            style={{ color: appleWebColors.textPrimary }}
          >
            ビタミンB群と一緒に摂りたい成分
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

        {/* ============================================ */}
        {/* 14. CTA */}
        {/* ============================================ */}
        <section
          className="rounded-[20px] p-8 text-center text-white"
          style={{
            background: `linear-gradient(135deg, ${ARTICLE_DATA.categoryColor}, ${systemColors.yellow})`,
          }}
        >
          <h2 className={`${typography.title2} mb-4`}>
            ビタミンB群サプリをもっと詳しく比較
          </h2>
          <p className="text-[15px] opacity-90 mb-6">
            サプティアでは、5つの評価軸で商品を比較できます
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products?q=ビタミンB"
              className="inline-flex items-center justify-center gap-2 bg-white font-bold px-6 py-3 rounded-[12px] transition-colors hover:bg-gray-100"
              style={{ color: ARTICLE_DATA.categoryColor }}
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
