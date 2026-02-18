/**
 * プロテイン比較記事ページ
 * SEO最適化された比較コンテンツ - 統一テンプレート（15セクション構成）
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
  ExternalLink,
  Dumbbell,
  Scale,
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
  title: "【2026年最新】プロテインおすすめ比較｜種類・コスパ・目的別で徹底分析",
  description:
    "プロテインをホエイ・カゼイン・ソイなど種類別に比較。WPC/WPI/WPHの違い、目的別の選び方、コスパランキングを解説。",
  publishedAt: "2025-01-19",
  updatedAt: new Date().toISOString().split("T")[0],
  ingredientName: "プロテイン",
  ingredientSlug: "protein",
};

const ogImageUrl = getArticleOGImage("protein-comparison");
const ogImage = generateOGImageMeta(ogImageUrl, "プロテイン比較 - サプティア");

export const metadata: Metadata = {
  title: ARTICLE_DATA.title,
  description: ARTICLE_DATA.description,
  keywords: [
    "プロテイン",
    "おすすめ",
    "比較",
    "ホエイ",
    "カゼイン",
    "ソイ",
    "WPC",
    "WPI",
    "2026",
    "ランキング",
    "筋トレ",
    "ダイエット",
  ],
  openGraph: {
    title: ARTICLE_DATA.title,
    description: ARTICLE_DATA.description,
    type: "article",
    publishedTime: ARTICLE_DATA.publishedAt,
    modifiedTime: ARTICLE_DATA.updatedAt,
    url: "https://suptia.com/articles/protein-comparison",
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
    canonical: "https://suptia.com/articles/protein-comparison",
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

async function getProteinProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && availability == "in-stock" && (name match "プロテイン*" || name match "*protein*" || name match "*Protein*")] | order(priceJPY asc)[0...20]{
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
    console.error("Failed to fetch protein products:", error);
    return [];
  }
}

// この記事でわかること（5項目）
const LEARNING_POINTS = [
  "プロテインの種類（ホエイWPC/WPI/WPH・カゼイン・ソイ）の特徴と選び方",
  "目的別（筋肥大・ダイエット・美容・持久系）の最適なプロテイン",
  "コスパランキングTOP3と1日あたりのコスト比較",
  "効果的な摂取タイミングと1日の適正量",
  "乳糖不耐症やアレルギーがある方への対処法",
];

// 結論ファースト（迷ったらこれ）
const QUICK_RECOMMENDATIONS = [
  {
    condition: "コスパ重視・初心者なら",
    recommendation: "ホエイWPC",
    reason: "最も安価で効果は十分。まずはここから始めるのが王道。",
  },
  {
    condition: "お腹が弱い・減量中なら",
    recommendation: "ホエイWPI",
    reason: "乳糖カット・低脂肪。やや高いが胃腸トラブルを避けられる。",
  },
  {
    condition: "就寝前・長時間補給なら",
    recommendation: "カゼイン",
    reason: "6-8時間かけてゆっくり吸収。就寝中の筋分解を防ぐ。",
  },
  {
    condition: "植物性・女性なら",
    recommendation: "ソイプロテイン",
    reason: "イソフラボン含有。美容効果も期待でき、腹持ちも良い。",
  },
];

// プロテインの種類データ
const PROTEIN_TYPES = [
  {
    name: "ホエイプロテイン（WPC）",
    nameEn: "Whey Protein Concentrate",
    absorption: "速い",
    price: "安い",
    proteinContent: "70-80%",
    best: "コスパ重視・初心者",
    description:
      "最も一般的なプロテイン。乳糖を含むため、お腹が弱い人は注意。牛乳でお腹がゴロゴロする方はWPIを検討。",
    color: systemColors.blue,
  },
  {
    name: "ホエイプロテイン（WPI）",
    nameEn: "Whey Protein Isolate",
    absorption: "速い",
    price: "やや高め",
    proteinContent: "90%以上",
    best: "乳糖不耐症・減量中",
    description:
      "乳糖・脂肪を除去した高純度プロテイン。お腹に優しく、タンパク質含有率が高い。",
    color: systemColors.cyan,
  },
  {
    name: "ホエイプロテイン（WPH）",
    nameEn: "Whey Protein Hydrolysate",
    absorption: "最速",
    price: "高い",
    proteinContent: "90%以上",
    best: "トレーニング直後重視",
    description:
      "加水分解済みで消化吸収が最も速い。胃腸への負担も最小限。上級者やアスリート向け。",
    color: systemColors.purple,
  },
  {
    name: "カゼインプロテイン",
    nameEn: "Casein Protein",
    absorption: "ゆっくり",
    price: "中程度",
    proteinContent: "80-85%",
    best: "就寝前・長時間の栄養補給",
    description:
      "6-8時間かけてゆっくり吸収。就寝前や間食に最適。筋分解を長時間抑制。",
    color: systemColors.indigo,
  },
  {
    name: "ソイプロテイン",
    nameEn: "Soy Protein",
    absorption: "普通",
    price: "安い",
    proteinContent: "80-90%",
    best: "植物性希望・女性",
    description:
      "大豆由来でイソフラボン含有。ヴィーガン対応。腹持ちが良くダイエットにも。",
    color: systemColors.green,
  },
  {
    name: "ピープロテイン",
    nameEn: "Pea Protein",
    absorption: "普通",
    price: "中程度",
    proteinContent: "80-85%",
    best: "アレルギー対応・環境配慮",
    description:
      "えんどう豆由来。乳・大豆アレルギーの方でも安心。消化に優しく環境負荷も低い。",
    color: systemColors.mint,
  },
];

// 目的別おすすめ
const PURPOSE_RECOMMENDATIONS = [
  {
    purpose: "筋肥大・バルクアップ",
    icon: Dumbbell,
    emoji: "💪",
    description: "筋肉を大きくしたい、体重を増やしたい",
    recommendation: "ホエイWPC or WPI",
    reason:
      "吸収が速く、トレーニング後のゴールデンタイムに最適。コスパ重視ならWPC、お腹が弱いならWPI。",
    tips: "トレーニング後30分以内に摂取。体重×1.6-2.2gのタンパク質を目安に。",
  },
  {
    purpose: "ダイエット・減量",
    icon: Scale,
    emoji: "📉",
    description: "体脂肪を減らしたい、引き締めたい",
    recommendation: "ホエイWPI or ソイプロテイン",
    reason:
      "低脂肪・低糖質のWPIか、腹持ちの良いソイがおすすめ。食事置き換えにも。",
    tips: "食事の置き換えや間食に。1食あたり約100-120kcalで満足感が得られる。",
  },
  {
    purpose: "美容・健康維持",
    icon: Heart,
    emoji: "✨",
    description: "美肌、髪のツヤ、健康的な体づくり",
    recommendation: "ソイ or コラーゲン配合",
    reason: "イソフラボンやコラーゲンで美容効果も期待。女性に特におすすめ。",
    tips: "朝食時や就寝前に。継続しやすい味を選ぶのがポイント。",
  },
  {
    purpose: "持久系スポーツ",
    icon: Zap,
    emoji: "🏃",
    description: "マラソン、サイクリング、長時間の運動",
    recommendation: "ホエイWPC + カゼイン",
    reason:
      "即効性と持続性のバランス。運動前後はホエイ、就寝前はカゼインで使い分け。",
    tips: "長時間の運動前後にはBCAAとの併用も効果的。",
  },
  {
    purpose: "就寝前の補給",
    icon: Shield,
    emoji: "🌙",
    description: "寝ている間の筋分解を防ぎたい",
    recommendation: "カゼインプロテイン",
    reason: "6-8時間かけてゆっくり吸収。睡眠中もアミノ酸を供給し続ける。",
    tips: "就寝30分前を目安に。ホットミルクに混ぜると飲みやすい。",
  },
];

// 選び方チェックリスト
const SELECTION_CHECKLIST = [
  {
    item: "タンパク質含有率を確認",
    description:
      "1食あたり20g以上が目安。含有率80%以上が高品質の証。パッケージの成分表をチェック。",
    important: true,
  },
  {
    item: "原材料と製法を確認",
    description:
      "WPC/WPI/WPHの違いを理解。人工甘味料の有無、グラスフェッド（牧草飼育）かどうかも確認。",
    important: true,
  },
  {
    item: "目的との相性を確認",
    description:
      "筋トレ後は吸収の速いホエイ、就寝前はカゼイン、減量中はWPIなど目的に合わせて選択。",
    important: true,
  },
  {
    item: "1日あたりのコストを計算",
    description:
      "1kgあたりの価格だけでなく、1食あたり・1日あたりのコストで比較するとお得かどうかわかる。",
    important: false,
  },
  {
    item: "味と溶けやすさを確認",
    description:
      "継続のカギは味。口コミや小容量を試してから大容量を購入。ダマになりにくさも重要。",
    important: false,
  },
];

// 摂取量ガイド
const DOSAGE_GUIDE = [
  {
    purpose: "健康維持・一般",
    amount: "体重×1.0-1.2g/日",
    frequency: "1日1-2回",
    note: "朝食時や間食に。食事のタンパク質と合算で計算",
  },
  {
    purpose: "筋トレ・バルクアップ",
    amount: "体重×1.6-2.2g/日",
    frequency: "1日2-3回",
    note: "トレーニング後30分以内が最も効果的。1回30-40gまで",
  },
  {
    purpose: "ダイエット・減量",
    amount: "体重×1.2-1.6g/日",
    frequency: "1日2-3回",
    note: "食事置き換えや間食に。満腹感を利用してカロリー制限",
  },
  {
    purpose: "持久系スポーツ",
    amount: "体重×1.4-1.8g/日",
    frequency: "1日2-3回",
    note: "運動前後とリカバリー時。BCAAとの併用も効果的",
  },
  {
    purpose: "高齢者・リハビリ",
    amount: "体重×1.0-1.2g/日",
    frequency: "1日2-3回に分割",
    note: "一度に大量は避け、少量を複数回に分けて摂取",
  },
];

// 注意点・副作用
const CAUTIONS = [
  {
    title: "過剰摂取に注意",
    description:
      "タンパク質の過剰摂取（体重×2.2g以上）は腎臓に負担をかける可能性。適量を守って摂取を。",
    severity: "warning",
  },
  {
    title: "乳糖不耐症の方へ",
    description:
      "WPCは乳糖を含むため、お腹がゴロゴロする場合あり。WPIやソイ、ピープロテインを選択。",
    severity: "info",
  },
  {
    title: "アレルギーに注意",
    description:
      "乳製品アレルギーの方はホエイ・カゼイン不可。大豆アレルギーならソイ不可。ピープロテインが代替になる。",
    severity: "warning",
  },
  {
    title: "人工甘味料について",
    description:
      "長期摂取の影響を懸念する場合はノンフレーバーや天然甘味料（ステビア等）使用製品を選択。",
    severity: "info",
  },
  {
    title: "腎臓疾患がある方へ",
    description:
      "腎機能が低下している方はタンパク質摂取量を制限する必要あり。必ず医師に相談を。",
    severity: "warning",
  },
];

// FAQ
const FAQS = [
  {
    question: "プロテインを飲むと太りますか？",
    answer:
      "プロテイン自体は低カロリー（1杯約100-120kcal）で、太る原因にはなりません。ただし、総摂取カロリーが消費カロリーを上回れば体重は増えます。プロテインを飲む分、他の食事を調整するか、運動量を増やすことが大切です。むしろ、タンパク質は代謝を上げる効果があり、ダイエットの味方になります。",
  },
  {
    question: "女性がプロテインを飲んでもムキムキになりませんか？",
    answer:
      "女性は男性ホルモン（テストステロン）が少ないため、プロテインを飲むだけでムキムキにはなりません。ムキムキになるには非常にハードなトレーニングと厳密な食事管理が必要です。むしろ、適度なタンパク質摂取は引き締まった体づくりや美肌・美髪に効果的。ソイプロテインならイソフラボンによる美容効果も期待できます。",
  },
  {
    question: "WPCとWPIどちらを選ぶべき？",
    answer:
      "コスパ重視ならWPC、お腹が弱い方や減量中はWPIがおすすめです。WPCは乳糖を含むため、牛乳でお腹がゴロゴロする方は避けた方が無難。WPIは乳糖がほぼ除去されており、タンパク質含有率も90%以上と高いですが、価格はやや高めです。まずはWPCを試して、問題があればWPIに切り替えるのも一つの方法です。",
  },
  {
    question: "プロテインの賞味期限と保存方法は？",
    answer:
      "未開封で1-2年、開封後は2-3ヶ月が目安です。高温多湿を避け、密閉して冷暗所で保存してください。湿気を吸うと品質が劣化し、ダマになりやすくなります。特に夏場は注意が必要。開封後は乾燥剤を入れるか、密閉容器に移し替えるとより長持ちします。",
  },
  {
    question: "運動しない日もプロテインは必要？",
    answer:
      "筋肉の回復・維持には運動しない日もタンパク質が必要です。筋肉は休息日にも修復・成長しているため、プロテイン摂取は有効です。ただし、運動量に応じて摂取量を調整（運動日より少なめ）するのが理想的。1日のタンパク質目標量から食事分を引いた量をプロテインで補うイメージです。",
  },
  {
    question: "プロテインは毎日飲んでも大丈夫？",
    answer:
      "適量であれば毎日飲んでも問題ありません。プロテインは食品であり、肉や魚などと同じタンパク質源です。ただし、食事からのタンパク質も含めて1日の総摂取量を意識することが大切。体重×2.2g/日を超える過剰摂取は避け、バランスの良い食事を心がけてください。",
  },
  {
    question: "ホエイとソイ、どちらが筋肉に良い？",
    answer:
      "筋肉づくりの効率ではホエイが優れています。ホエイはロイシン（筋合成のスイッチ）含有量が高く、吸収も速いため、トレーニング後に最適。一方、ソイは吸収がやや遅く腹持ちが良いため、ダイエットや美容目的に向いています。筋肥大最優先ならホエイ、総合的な健康を考えるならソイも選択肢に入ります。",
  },
];

// 関連成分
const RELATED_INGREDIENTS = [
  {
    name: "BCAA",
    slug: "bcaa",
    emoji: "💪",
    reason: "筋分解抑制・トレーニング中の補給に",
  },
  {
    name: "クレアチン",
    slug: "creatine",
    emoji: "⚡",
    reason: "筋力・パワー向上に相乗効果",
  },
  {
    name: "グルタミン",
    slug: "glutamine",
    emoji: "🔄",
    reason: "リカバリー促進・免疫機能サポート",
  },
  {
    name: "マルチビタミン",
    slug: "multivitamin",
    emoji: "💊",
    reason: "タンパク質代謝にビタミンB群が必要",
  },
];

export default async function ProteinComparisonPage() {
  const products = await getProteinProducts();

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
              プロテイン比較
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
              プロテイン
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
              <a href="#learning" className="hover:opacity-70">
                1. この記事でわかること
              </a>
            </li>
            <li>
              <a href="#conclusion" className="hover:opacity-70">
                2. 結論ファースト（迷ったらこれ）
              </a>
            </li>
            <li>
              <a href="#types" className="hover:opacity-70">
                3. プロテインの種類と特徴
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
                9. よくある質問
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
          id="learning"
          className={`${liquidGlassClasses.light} rounded-[20px] p-6 mb-12 border scroll-mt-16`}
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
          id="conclusion"
          className="mb-12 rounded-[20px] p-6 md:p-8 scroll-mt-16"
          style={{
            background: `linear-gradient(135deg, ${systemColors.blue}15, ${systemColors.purple}15)`,
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
                    <strong>{rec.condition}</strong>
                    <span style={{ color: systemColors.blue }}>
                      {" "}
                      → {rec.recommendation}
                    </span>
                    <span style={{ color: appleWebColors.textSecondary }}>
                      {" "}
                      - {rec.reason}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 6. 種類と特徴 */}
        <section id="types" className="mb-12 scroll-mt-16">
          <h2
            className={`${typography.title2} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            プロテインの種類と特徴
          </h2>
          <p
            className="text-[15px] leading-[1.7] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            プロテインは原料や製法によって吸収速度・価格・効果が異なります。
            目的や体質に合わせて最適な種類を選びましょう。
          </p>

          <div className="space-y-4">
            {PROTEIN_TYPES.map((type) => (
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
                      含有率: {type.proteinContent}
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
        <section id="purpose" className="mb-12 scroll-mt-16">
          <h2
            className={`${typography.title2} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            目的別 - あなたに合ったプロテインはこれ
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

        {/* 8. おすすめ商品ランキング */}
        <section id="ranking" className="mb-12 scroll-mt-16">
          <h2
            className={`${typography.title2} mb-2`}
            style={{ color: appleWebColors.textPrimary }}
          >
            コスパランキングTOP3 - プロテイン
          </h2>
          <p
            className="text-[15px] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            1日あたりのコストで比較した、最もお得なプロテインです。
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
                現在、プロテインの商品データを準備中です。
              </p>
            </div>
          )}
        </section>

        {/* 9. 選び方チェックリスト */}
        <section id="checklist" className="mb-12 scroll-mt-16">
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
        <section id="dosage" className="mb-12 scroll-mt-16">
          <h2
            className={`${typography.title2} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            目的別 - 摂取量の目安
          </h2>
          <p
            className="text-[15px] leading-[1.7] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            タンパク質は目的に応じた適切な量を、分割して摂取することが効果的です。
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
        <section id="cautions" className="mb-12 scroll-mt-16">
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
            プロテインは適量なら安全な食品ですが、過剰摂取やアレルギーには注意が必要です。
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
        <section id="faq" className="mb-12 scroll-mt-16">
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
        <section id="related" className="mb-12 scroll-mt-16">
          <h2
            className={`${typography.title2} mb-6`}
            style={{ color: appleWebColors.textPrimary }}
          >
            プロテインと一緒に摂りたい成分
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
            background: `linear-gradient(135deg, ${systemColors.blue}, ${systemColors.purple})`,
          }}
        >
          <h2 className={`${typography.title2} mb-4`}>
            プロテインをもっと詳しく比較
          </h2>
          <p className="text-[15px] opacity-90 mb-6">
            サプティアでは、5つの評価軸で商品を比較できます
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products?ingredient=protein"
              className="inline-flex items-center justify-center gap-2 bg-white font-bold px-6 py-3 rounded-[12px] transition-colors hover:bg-gray-100"
              style={{ color: systemColors.blue }}
            >
              全商品を見る
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/ingredients/protein"
              className="inline-flex items-center justify-center gap-2 bg-white/20 font-medium px-6 py-3 rounded-[12px] transition-colors hover:bg-white/30"
            >
              プロテイン成分ガイド
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
