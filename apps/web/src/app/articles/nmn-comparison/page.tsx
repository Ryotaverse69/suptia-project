/**
 * NMN比較記事ページ
 * 統一テンプレート（15セクション）に準拠
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
  Clock,
  ExternalLink,
  Zap,
  Brain,
  Dumbbell,
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

// ===== データ構造 =====

// 目次データ
const SECTIONS = [
  { id: "types", label: "種類と特徴" },
  { id: "purpose", label: "目的別おすすめ" },
  { id: "products", label: "おすすめ商品ランキング" },
  { id: "checklist", label: "選び方チェックリスト" },
  { id: "dosage", label: "摂取量・タイミング" },
  { id: "cautions", label: "注意点・副作用" },
  { id: "faq", label: "よくある質問" },
  { id: "related", label: "関連成分" },
];

// この記事でわかること
const LEARNING_POINTS = [
  "NMNがなぜ「若返り物質」として注目されているか",
  "純度・形態（腸溶性・リポソーム等）による効果の違い",
  "コスパの良いNMNサプリの選び方（mg単価比較）",
  "効果を感じるまでの期間と適切な摂取量",
  "偽物・低品質品を避けるためのチェックポイント",
];

// 結論ファースト（迷ったらこれ）
const QUICK_RECOMMENDATIONS = [
  {
    label: "効果重視なら",
    text: "純度99%以上のβ-NMN。COA（分析証明書）付き。",
  },
  { label: "吸収率重視なら", text: "リポソームNMN or 腸溶性カプセル。" },
  { label: "コスパ重視なら", text: "mg単価で比較。純度95%以上なら十分。" },
  { label: "摂取量の目安", text: "250〜500mg/日。朝の摂取がおすすめ。" },
];

// 関連成分
const RELATED_INGREDIENTS = [
  {
    name: "レスベラトロール",
    slug: "resveratrol",
    emoji: "🍇",
    reason: "サーチュイン活性化に相乗効果",
  },
  {
    name: "コエンザイムQ10",
    slug: "coq10",
    emoji: "⚡",
    reason: "ミトコンドリア機能を強化",
  },
  {
    name: "ビタミンD",
    slug: "vitamin-d",
    emoji: "☀️",
    reason: "代謝・免疫機能をサポート",
  },
  {
    name: "オメガ3",
    slug: "omega-3",
    emoji: "🐟",
    reason: "脳・心臓の健康をサポート",
  },
];

const ARTICLE_DATA = {
  title: "【2025年最新】NMNサプリおすすめ比較｜純度・価格・効果で徹底分析",
  description:
    "NMN（ニコチンアミドモノヌクレオチド）サプリを純度・価格・形態で徹底比較。若返り・アンチエイジング成分として注目のNMNの選び方を解説。",
  publishedAt: "2025-01-19",
  updatedAt: new Date().toISOString().split("T")[0],
  ingredientName: "NMN",
  ingredientSlug: "nmn",
};

const ogImageUrl = getArticleOGImage("nmn-comparison");
const ogImage = generateOGImageMeta(
  ogImageUrl,
  "NMNサプリメント比較 - サプティア",
);

export const metadata: Metadata = {
  title: ARTICLE_DATA.title,
  description: ARTICLE_DATA.description,
  keywords: [
    "NMN",
    "サプリメント",
    "おすすめ",
    "比較",
    "2025",
    "アンチエイジング",
    "NAD+",
    "若返り",
    "ニコチンアミドモノヌクレオチド",
    "長寿",
  ],
  openGraph: {
    title: ARTICLE_DATA.title,
    description: ARTICLE_DATA.description,
    type: "article",
    publishedTime: ARTICLE_DATA.publishedAt,
    modifiedTime: ARTICLE_DATA.updatedAt,
    url: "https://suptia.com/articles/nmn-comparison",
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
    canonical: "https://suptia.com/articles/nmn-comparison",
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

async function getNMNProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && availability == "in-stock" && (
    name match "*NMN*" ||
    name match "*ニコチンアミドモノヌクレオチド*"
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
    console.error("Failed to fetch NMN products:", error);
    return [];
  }
}

// NMNの形態データ
const NMN_TYPES = [
  {
    name: "高純度NMN（99%以上）",
    nameEn: "High Purity NMN",
    purity: "◎ 99%以上",
    price: "△ 高価",
    stability: "◎ 安定",
    best: "効果を最大化したい方",
    description:
      "純度99%以上の高品質NMN。不純物が少なく、効果的に体内で利用される。第三者機関の検査証明がある製品が安心。",
    color: systemColors.purple,
  },
  {
    name: "β-NMN（β型異性体）",
    nameEn: "β-NMN",
    purity: "◎ 生理活性型",
    price: "△ やや高価",
    stability: "◎ 安定",
    best: "科学的根拠を重視する方",
    description:
      "NMNにはα型とβ型があり、生体で活性を持つのはβ型。高品質な製品はβ-NMNを使用。",
    color: systemColors.blue,
  },
  {
    name: "腸溶性カプセル",
    nameEn: "Enteric Coated",
    purity: "○ 製品による",
    price: "○ 中程度",
    stability: "◎ 胃酸から保護",
    best: "吸収率を高めたい方",
    description:
      "胃酸で分解されずに腸まで届くコーティング。NMNの安定性を高め、吸収効率を向上。",
    color: systemColors.green,
  },
  {
    name: "リポソームNMN",
    nameEn: "Liposomal NMN",
    purity: "○ 製品による",
    price: "△ 高価",
    stability: "◎ 高い",
    best: "吸収率最重視の方",
    description:
      "リン脂質で包み込むことで吸収率を大幅に向上。血中濃度が高くなりやすい最新技術。",
    color: systemColors.cyan,
  },
  {
    name: "舌下錠・パウダー",
    nameEn: "Sublingual / Powder",
    purity: "○ 製品による",
    price: "○ 中程度",
    stability: "△ 湿気に弱い",
    best: "即効性を求める方",
    description:
      "舌下から直接吸収することで、消化器系を通さず血中に入る。即効性が期待できるが保存に注意。",
    color: systemColors.orange,
  },
  {
    name: "一般カプセル・錠剤",
    nameEn: "Standard Capsule",
    purity: "△〜○ 製品による",
    price: "◎ 安価",
    stability: "○ 普通",
    best: "コスパ重視の方",
    description:
      "最も一般的な形態。価格は安いが、胃酸で一部分解される可能性。純度の確認が重要。",
    color: "#6B7280",
  },
];

// 目的別おすすめ
const PURPOSE_RECOMMENDATIONS = [
  {
    purpose: "本格的なアンチエイジング",
    icon: Heart,
    description: "NAD+レベルを効率的に上げたい、若返りを本気で目指す",
    recommendation: "高純度β-NMN（99%以上）250〜500mg/日",
    reason:
      "純度とβ型であることを確認。第三者機関の検査証明がある製品が信頼できる。",
    tips: "レスベラトロールとの併用でサーチュイン活性化に相乗効果。",
  },
  {
    purpose: "コスパ重視で始めたい",
    icon: Zap,
    description: "まずは試してみたい、予算を抑えたい",
    recommendation: "一般カプセル（純度95%以上）125〜250mg/日",
    reason:
      "純度95%以上であれば効果は期待できる。腸溶性でなくても一定量は吸収される。",
    tips: "半年〜1年続けるつもりでコスパを計算。mg単価で比較を。",
  },
  {
    purpose: "吸収率を最大化したい",
    icon: Target,
    description: "効率的に体内に取り込みたい",
    recommendation: "リポソームNMN or 腸溶性カプセル",
    reason:
      "リポソーム技術や腸溶性コーティングで、吸収率が通常の数倍に向上するとされる。",
    tips: "価格は高いが、同じmgでもより多く体内で利用される。",
  },
  {
    purpose: "エネルギー・活力向上",
    icon: Dumbbell,
    description: "疲れにくい体、運動パフォーマンス向上",
    recommendation: "NMN 250mg + コエンザイムQ10",
    reason:
      "NMNはNAD+を増やしミトコンドリア機能を向上。CoQ10との併用でエネルギー産生を強化。",
    tips: "運動前に摂取すると効果を感じやすいという報告も。",
  },
  {
    purpose: "認知機能・脳の健康",
    icon: Brain,
    description: "集中力、記憶力、脳のアンチエイジング",
    recommendation: "NMN 250mg + オメガ3",
    reason:
      "NAD+は脳の神経細胞のエネルギー代謝に重要。オメガ3は脳の構成成分であり相乗効果。",
    tips: "朝の摂取が脳のパフォーマンスに効果的という説も。",
  },
];

// 選び方チェックリスト
const SELECTION_CHECKLIST = [
  {
    item: "純度を確認（99%以上推奨）",
    description:
      "純度99%以上が理想。最低でも95%以上。第三者機関の分析証明書（COA）があると安心。",
    important: true,
  },
  {
    item: "β-NMNであることを確認",
    description:
      "生理活性を持つのはβ型。「β-NMN」「β-Nicotinamide Mononucleotide」の表記を確認。",
    important: true,
  },
  {
    item: "mg単価を計算",
    description:
      "価格÷総mg数で1mgあたりの価格を計算。カプセル数でなくmg単価で比較することが重要。",
    important: true,
  },
  {
    item: "製造・品質管理を確認",
    description: "GMP認証工場、第三者検査、重金属検査などの品質保証があるか。",
    important: false,
  },
  {
    item: "保存方法を確認",
    description:
      "NMNは湿気に弱い。冷暗所保存、乾燥剤入り、遮光ボトルなど品質維持の工夫があるか。",
    important: false,
  },
];

// 摂取量ガイド
const DOSAGE_GUIDE = [
  {
    purpose: "初心者・お試し",
    amount: "125〜250mg/日",
    frequency: "1日1回（朝）",
    note: "2〜4週間で体調の変化を観察",
  },
  {
    purpose: "一般的なアンチエイジング",
    amount: "250〜500mg/日",
    frequency: "1日1〜2回",
    note: "多くの研究で使用される一般的な量",
  },
  {
    purpose: "本格的な若返り目的",
    amount: "500〜1000mg/日",
    frequency: "1日2回に分けて",
    note: "高用量。レスベラトロールとの併用も",
  },
  {
    purpose: "運動・エネルギー目的",
    amount: "250〜500mg/日",
    frequency: "運動前30〜60分",
    note: "運動パフォーマンス向上を狙う場合",
  },
  {
    purpose: "60歳以上の方",
    amount: "250〜500mg/日",
    frequency: "1日1〜2回",
    note: "NAD+低下が顕著な年代。継続が重要",
  },
];

// 注意点・副作用
const CAUTIONS = [
  {
    title: "長期安全性データは限定的",
    description:
      "NMNは比較的新しいサプリメント。動物実験では安全性が示されているが、人間での長期データは蓄積中。",
    severity: "info",
  },
  {
    title: "偽物・低品質品に注意",
    description:
      "急成長市場のため、偽物や純度の低い製品も出回っている。信頼できるブランドと第三者検査を重視。",
    severity: "warning",
  },
  {
    title: "妊娠・授乳中は避ける",
    description:
      "安全性データがないため、妊娠中・授乳中・妊娠希望の方は摂取を避けることを推奨。",
    severity: "warning",
  },
  {
    title: "既存の持病がある方",
    description:
      "がん治療中、糖尿病、その他の持病がある方は、医師に相談の上で使用を検討。",
    severity: "warning",
  },
  {
    title: "保存方法に注意",
    description:
      "NMNは湿気で分解されやすい。開封後は乾燥剤と一緒に冷暗所で保存。長期間の常温放置は避ける。",
    severity: "info",
  },
];

// FAQ
const FAQS = [
  {
    question: "NMNとは何ですか？なぜ注目されている？",
    answer:
      "NMN（ニコチンアミドモノヌクレオチド）は、体内でNAD+（ニコチンアミドアデニンジヌクレオチド）に変換される物質です。NAD+は全ての細胞のエネルギー代謝に必須で、加齢とともに減少します。ハーバード大学のデビッド・シンクレア教授らの研究で、NMN投与によりマウスの老化現象が改善されたことから「若返り物質」として世界的に注目されています。",
  },
  {
    question: "NMNとNRはどちらが良いですか？",
    answer:
      "NMN（ニコチンアミドモノヌクレオチド）とNR（ニコチンアミドリボシド）はどちらもNAD+の前駆体で、同様の効果が期待できます。NMNの方が分子量が大きく、細胞への取り込みには専用の輸送体が必要という説がありましたが、2020年にNMN専用の輸送体（Slc12a8）が発見され、NMNも効率的に吸収されることがわかりました。価格と入手しやすさで選んでも問題ありません。",
  },
  {
    question: "NMNはいつ飲むのが効果的？",
    answer:
      "一般的には朝の摂取が推奨されます。NAD+は概日リズム（体内時計）と密接に関連しており、朝にNAD+レベルを上げることで1日のエネルギー代謝が活性化するとされています。夜に摂取すると眠れなくなるという報告もあるため、夕方以降は避けた方が無難です。食事と一緒でも空腹時でも効果に大きな差はないとされています。",
  },
  {
    question: "NMNで本当に若返りますか？",
    answer:
      "動物実験では、NMN投与により筋力・持久力の向上、血管機能の改善、インスリン感受性の改善、認知機能の維持など、多くの老化指標が改善しています。人間での臨床試験も進んでおり、筋力・歩行速度の改善、血糖コントロールの改善などが報告されています。ただし、「見た目が若返る」という直接的なエビデンスはまだ限定的であり、期待しすぎは禁物です。",
  },
  {
    question: "NMNの効果はどのくらいで感じますか？",
    answer:
      "個人差が大きいですが、エネルギーレベルの向上や睡眠の質の改善は2〜4週間で感じる人もいます。代謝や体組成の変化は2〜3ヶ月、より長期的な効果は半年〜1年の継続が必要とされています。年齢が高いほど（NAD+の低下が顕著なほど）効果を感じやすい傾向があります。若い人（20〜30代）は変化を感じにくいかもしれません。",
  },
  {
    question: "NMNは安全ですか？副作用は？",
    answer:
      "これまでの臨床試験では、1日250〜1000mgの範囲で深刻な副作用は報告されていません。軽微な消化器症状（胃のむかつき、下痢）が一部で報告されていますが、多くは一時的です。ただし、長期（5年以上）の安全性データはまだ蓄積中であり、妊娠中・授乳中・持病がある方は医師に相談することをお勧めします。",
  },
  {
    question: "NMNと一緒に摂ると良い成分は？",
    answer:
      "【レスベラトロール】サーチュイン（長寿遺伝子）活性化に相乗効果。【コエンザイムQ10】ミトコンドリア機能サポート。【ビタミンD】代謝・免疫サポート。【TMG（トリメチルグリシン）】高用量NMN摂取時のメチル基補給。【ケルセチン】細胞の老化（セネセンス）対策。シンクレア教授は自身でNMN+レスベラトロールを摂取していると公言しています。",
  },
];

export default async function NMNComparisonPage() {
  const products = await getNMNProducts();

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
            <span style={{ color: appleWebColors.textSecondary }}>NMN比較</span>
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
                backgroundColor: systemColors.purple + "15",
                color: systemColors.purple,
              }}
            >
              アンチエイジング
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
                      backgroundColor: systemColors.purple + "20",
                      color: systemColors.purple,
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
          style={{ borderColor: systemColors.purple + "30" }}
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
                  style={{ color: systemColors.purple }}
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
            background: `linear-gradient(135deg, ${systemColors.purple}15, ${systemColors.blue}15)`,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: systemColors.purple }}
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
                    {" → "}
                    {rec.text}
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
            NMNサプリの種類と選び方
          </h2>
          <p
            className="text-[15px] leading-[1.7] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            NMNサプリは純度・形態によって効果と価格が大きく異なります。
            偽物や低品質品も出回っているため、選び方を知ることが重要です。
          </p>

          <div className="space-y-4">
            {NMN_TYPES.map((type) => (
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
                      純度: {type.purity}
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
                      安定性: {type.stability}
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
            目的別｜あなたに合ったNMNはこれ
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
                      style={{ backgroundColor: systemColors.purple + "15" }}
                    >
                      <Icon size={20} style={{ color: systemColors.purple }} />
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
                          style={{ color: systemColors.purple }}
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
        <section id="products" className="mb-12 scroll-mt-20">
          <h2
            className={`${typography.title2} mb-2`}
            style={{ color: appleWebColors.textPrimary }}
          >
            コスパランキングTOP3｜NMNサプリ
          </h2>
          <p
            className="text-[15px] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            1日あたりのコストで比較した、最もお得なNMNサプリメントです。
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
                現在、NMNサプリメントの商品データを準備中です。
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
                        ? systemColors.purple
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
                            backgroundColor: systemColors.purple + "20",
                            color: systemColors.purple,
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
            NMNは目的に応じて摂取量を調整できます。まずは少量から始めて、体調を見ながら増量するのがおすすめです。
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
                    タイミング
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
                      style={{ color: systemColors.purple }}
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
            NMNは比較的安全性が高いとされていますが、以下の点に注意してください。
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
        <section id="related" className="mb-12 scroll-mt-20">
          <h2
            className={`${typography.title2} mb-6`}
            style={{ color: appleWebColors.textPrimary }}
          >
            NMNと一緒に摂りたい成分
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
            background: `linear-gradient(135deg, ${systemColors.purple}, ${systemColors.blue})`,
          }}
        >
          <h2 className={`${typography.title2} mb-4`}>
            NMNサプリをもっと詳しく比較
          </h2>
          <p className="text-[15px] opacity-90 mb-6">
            サプティアでは、5つの評価軸で商品を比較できます
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products?q=NMN"
              className="inline-flex items-center justify-center gap-2 bg-white font-bold px-6 py-3 rounded-[12px] transition-colors hover:bg-gray-100"
              style={{ color: systemColors.purple }}
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
