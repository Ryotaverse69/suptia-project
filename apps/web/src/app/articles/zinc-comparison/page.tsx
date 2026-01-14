/**
 * 亜鉛比較記事ページ
 * SEO最適化された比較コンテンツ
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
  Calculator,
  ExternalLink,
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
  title: "【2025年最新】亜鉛サプリおすすめ比較｜形態別の吸収率・効果で徹底分析",
  description:
    "亜鉛サプリをグルコン酸・ピコリン酸・クエン酸など形態別に比較。吸収率・効果・副作用を徹底分析。免疫・男性機能・美肌への効果的な選び方。",
  publishedAt: "2025-01-19",
  updatedAt: new Date().toISOString().split("T")[0],
  ingredientName: "亜鉛",
  ingredientSlug: "zinc",
};

const ogImageUrl = getArticleOGImage("zinc-comparison");
const ogImage = generateOGImageMeta(
  ogImageUrl,
  "亜鉛サプリメント比較 - サプティア",
);

export const metadata: Metadata = {
  title: ARTICLE_DATA.title,
  description: ARTICLE_DATA.description,
  keywords: [
    "亜鉛",
    "サプリメント",
    "おすすめ",
    "比較",
    "2025",
    "吸収率",
    "グルコン酸亜鉛",
    "ピコリン酸亜鉛",
    "免疫",
    "男性機能",
  ],
  openGraph: {
    title: ARTICLE_DATA.title,
    description: ARTICLE_DATA.description,
    type: "article",
    publishedTime: ARTICLE_DATA.publishedAt,
    modifiedTime: ARTICLE_DATA.updatedAt,
    url: "https://suptia.com/articles/zinc-comparison",
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
    canonical: "https://suptia.com/articles/zinc-comparison",
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

async function getZincProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && availability == "in-stock" && references(*[_type == "ingredient" && slug.current == "zinc"]._id)] | order(priceJPY asc)[0...20]{
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
    console.error("Failed to fetch zinc products:", error);
    return [];
  }
}

// 亜鉛の種類データ
const ZINC_TYPES = [
  {
    name: "ピコリン酸亜鉛",
    nameEn: "Zinc Picolinate",
    absorption: "◎ 最高",
    price: "△ やや高い",
    sideEffect: "◎ 少ない",
    best: "吸収率を最重視する方",
    description:
      "ピコリン酸と結合した形態。研究で最も吸収率が高いとされる。やや高価だが効率的。",
    color: systemColors.purple,
  },
  {
    name: "グルコン酸亜鉛",
    nameEn: "Zinc Gluconate",
    absorption: "○ 良好",
    price: "◎ 安い",
    sideEffect: "○ 中程度",
    best: "コスパ重視・一般的な補給",
    description:
      "最も一般的な形態。吸収率はピコリン酸に劣るが安価で手に入りやすい。風邪予防によく使用。",
    color: systemColors.blue,
  },
  {
    name: "クエン酸亜鉛",
    nameEn: "Zinc Citrate",
    absorption: "○ 良好",
    price: "○ 中程度",
    sideEffect: "◎ 少ない",
    best: "胃が弱い方・バランス重視",
    description:
      "グルコン酸と同等の吸収率。胃への負担が少なく、空腹時でも摂取しやすい。",
    color: systemColors.green,
  },
  {
    name: "酢酸亜鉛",
    nameEn: "Zinc Acetate",
    absorption: "○ 良好",
    price: "○ 中程度",
    sideEffect: "○ 中程度",
    best: "風邪・のど飴タイプ",
    description:
      "トローチやのど飴によく使用。風邪の期間短縮に関する研究が多い。口内で溶かして摂取。",
    color: systemColors.orange,
  },
  {
    name: "硫酸亜鉛",
    nameEn: "Zinc Sulfate",
    absorption: "△ 中程度",
    price: "◎ 最安",
    sideEffect: "△ やや多い",
    best: "コスト最優先の方",
    description:
      "最も安価だが、胃腸障害が起きやすい。食事と一緒に摂取することで副作用を軽減。",
    color: "#6B7280",
  },
  {
    name: "オロト酸亜鉛",
    nameEn: "Zinc Orotate",
    absorption: "◎ 高い",
    price: "△ 高い",
    sideEffect: "◎ 少ない",
    best: "スポーツ・回復目的",
    description:
      "オロト酸と結合。細胞への取り込みが良いとされ、運動後の回復やアスリートに人気。",
    color: systemColors.cyan,
  },
];

// 目的別おすすめ
const PURPOSE_RECOMMENDATIONS = [
  {
    purpose: "免疫力を高めたい",
    icon: Shield,
    emoji: "🛡️",
    description: "風邪をひきにくくしたい、体調を崩しやすい",
    recommendation: "グルコン酸亜鉛 or 酢酸亜鉛",
    reason:
      "風邪の予防・期間短縮に関する研究が最も多い形態。酢酸亜鉛はトローチで局所作用も期待。",
    tips: "ビタミンCとの併用で相乗効果。風邪のひき始めに増量も効果的。",
  },
  {
    purpose: "男性機能・テストステロン",
    icon: Dumbbell,
    emoji: "💪",
    description: "筋力アップ、精力増強、ホルモンバランス",
    recommendation: "ピコリン酸亜鉛",
    reason:
      "亜鉛は男性ホルモン生成に必須。吸収率の高いピコリン酸で効率的に補給。",
    tips: "マグネシウム・ビタミンD3との組み合わせでさらに効果的。",
  },
  {
    purpose: "肌・髪・爪の健康",
    icon: Heart,
    emoji: "✨",
    description: "ニキビ対策、髪のボリューム、爪の強化",
    recommendation: "クエン酸亜鉛 or ピコリン酸亜鉛",
    reason:
      "亜鉛は皮膚のターンオーバー、コラーゲン合成に関与。吸収が良く胃に優しい形態がおすすめ。",
    tips: "ビオチン・ビタミンCと併用で美容効果アップ。",
  },
  {
    purpose: "味覚障害の改善",
    icon: Zap,
    emoji: "👅",
    description: "味がわからない、食欲がない",
    recommendation: "ピコリン酸亜鉛",
    reason:
      "味覚細胞の再生に亜鉛が必須。吸収率の高い形態で効率的に補給。医師への相談も推奨。",
    tips: "2〜3ヶ月の継続で改善が見られることが多い。",
  },
  {
    purpose: "スポーツ・筋トレ",
    icon: Dumbbell,
    emoji: "🏋️",
    description: "運動後の回復、パフォーマンス向上",
    recommendation: "オロト酸亜鉛",
    reason:
      "細胞への取り込みが良く、運動後の回復をサポート。アスリートに人気の形態。",
    tips: "運動後30分以内に摂取すると効果的。マグネシウムとの併用も。",
  },
];

// 選び方チェックリスト
const SELECTION_CHECKLIST = [
  {
    item: "亜鉛の形態を確認",
    description:
      "ピコリン酸・グルコン酸・クエン酸など。吸収率と価格のバランスで選択。",
    important: true,
  },
  {
    item: "含有量をチェック",
    description:
      "1日の推奨量は男性11mg、女性8mg。上限は40mg。目的に応じて15〜30mgが一般的。",
    important: true,
  },
  {
    item: "銅とのバランスを確認",
    description:
      "長期の高用量亜鉛は銅の吸収を阻害。銅を含む製品か、銅を別途摂取を検討。",
    important: true,
  },
  {
    item: "添加物・品質認証を確認",
    description:
      "GMP認証、第三者機関テスト済みなど。信頼できるブランドを選択。",
    important: false,
  },
  {
    item: "飲みやすさ・形状を確認",
    description:
      "錠剤・カプセル・トローチ・グミなど。特に風邪対策ならトローチも有効。",
    important: false,
  },
];

// 摂取量ガイド
const DOSAGE_GUIDE = [
  {
    purpose: "一般的な健康維持",
    amount: "10〜15mg/日",
    frequency: "1日1回",
    note: "食事と一緒に摂取。空腹時は避ける",
  },
  {
    purpose: "免疫強化・風邪予防",
    amount: "15〜25mg/日",
    frequency: "1日1〜2回",
    note: "風邪のひき始めに短期間増量も",
  },
  {
    purpose: "男性機能・筋力増強",
    amount: "25〜30mg/日",
    frequency: "1日1〜2回",
    note: "マグネシウム・D3と併用で効果的",
  },
  {
    purpose: "味覚障害の改善",
    amount: "15〜30mg/日",
    frequency: "1日1〜2回",
    note: "2〜3ヶ月継続。医師への相談も推奨",
  },
  {
    purpose: "美肌・ニキビ対策",
    amount: "15〜25mg/日",
    frequency: "1日1回",
    note: "ビタミンCとの併用で効果的",
  },
];

// 注意点・副作用
const CAUTIONS = [
  {
    title: "銅欠乏症に注意",
    description:
      "1日50mg以上を長期摂取すると銅の吸収を阻害。銅を含む製品を選ぶか、銅を別途摂取を。",
    severity: "warning",
  },
  {
    title: "空腹時の摂取は避ける",
    description:
      "胃腸障害（吐き気、腹痛）の原因に。必ず食事と一緒に摂取することを推奨。",
    severity: "warning",
  },
  {
    title: "鉄・カルシウムとの相互作用",
    description:
      "高用量の亜鉛は鉄・カルシウムの吸収を阻害する可能性。摂取時間をずらすのが理想的。",
    severity: "info",
  },
  {
    title: "抗生物質との相互作用",
    description:
      "テトラサイクリン系・キノロン系抗生物質の吸収を阻害。2時間以上間隔をあける。",
    severity: "warning",
  },
  {
    title: "過剰摂取の症状",
    description: "吐き気、嘔吐、下痢、頭痛など。1日40mgを超えないよう注意。",
    severity: "warning",
  },
];

// FAQ
const FAQS = [
  {
    question: "亜鉛は1日どのくらい摂取すればいいですか？",
    answer:
      "厚生労働省の推奨量は成人男性で11mg、成人女性で8mgです。サプリメントでは一般的に15〜30mgが使用されます。上限摂取量は40mg/日で、これを超えると銅の吸収阻害や胃腸障害のリスクが高まります。特に長期間の高用量摂取は銅欠乏症を引き起こす可能性があるため、1〜2mgの銅を含む製品を選ぶか、銅を別途摂取することをお勧めします。",
  },
  {
    question: "亜鉛サプリを飲むタイミングは？",
    answer:
      "食事と一緒に摂取するのがベストです。空腹時に摂取すると胃腸障害（吐き気、腹痛）を起こすことがあります。特に硫酸亜鉛は胃への刺激が強いため、必ず食後に摂取してください。ピコリン酸亜鉛やクエン酸亜鉛は比較的胃に優しいですが、それでも食事と一緒が安心です。朝食後または夕食後が一般的なタイミングです。",
  },
  {
    question: "亜鉛で男性機能は本当に改善しますか？",
    answer:
      "亜鉛は男性ホルモン（テストステロン）の生成に必要な必須ミネラルです。亜鉛が不足している場合は、補給によってテストステロンレベルの改善、精子の質・量の向上が報告されています。ただし、すでに十分な亜鉛を摂取している場合は追加効果は限定的です。効果を実感するまで2〜3ヶ月程度の継続が必要な場合が多いです。",
  },
  {
    question: "亜鉛は風邪に効きますか？",
    answer:
      "複数の研究で、風邪のひき始め（24時間以内）に亜鉛を摂取すると、風邪の期間が1〜2日短縮されることが示されています。特に酢酸亜鉛やグルコン酸亜鉛のトローチ（のど飴タイプ）が効果的とされています。予防効果については結果が一貫していませんが、免疫機能のサポートには寄与します。ビタミンCとの併用で相乗効果が期待できます。",
  },
  {
    question: "亜鉛を摂りすぎるとどうなりますか？",
    answer:
      "短期的には吐き気、嘔吐、下痢、腹痛、頭痛などの症状が現れます。長期的な過剰摂取（1日50mg以上を数週間以上）では、銅の吸収阻害による銅欠乏症（貧血、神経障害、免疫機能低下）のリスクがあります。また、HDLコレステロール（善玉コレステロール）の低下も報告されています。1日40mg以下を守り、長期摂取の場合は銅を一緒に摂取してください。",
  },
  {
    question: "ピコリン酸亜鉛とグルコン酸亜鉛の違いは？",
    answer:
      "主な違いは吸収率と価格です。ピコリン酸亜鉛は研究で最も吸収率が高いとされ、体内での利用効率が良いですが、やや高価です。グルコン酸亜鉛は最も一般的で安価ですが、吸収率はピコリン酸に劣ります。風邪予防にはグルコン酸、効率的な補給や男性機能目的にはピコリン酸という選び方が合理的です。",
  },
  {
    question: "亜鉛はニキビに効果がありますか？",
    answer:
      "亜鉛はいくつかの研究で炎症性ニキビに対する効果が示されています。亜鉛は皮脂の分泌調整、抗炎症作用、傷の治癒促進に関与します。1日30mg程度を2〜3ヶ月継続することで改善が見られることがあります。ただし、重度のニキビには皮膚科医の診察が必要です。外用の亜鉛製剤と内服を併用するとより効果的な場合があります。",
  },
];

export default async function ZincComparisonPage() {
  const products = await getZincProducts();

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

      const zincIngredient = product.ingredients?.find((i) =>
        i.ingredient?.name?.includes("亜鉛"),
      );
      const mgPerServing = zincIngredient?.amountMgPerServing || 0;
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
      {/* パンくずリスト */}
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
              亜鉛比較
            </span>
          </nav>
        </div>
      </div>

      {/* ヘッダー */}
      <header className="pt-8 pb-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="px-3 py-1 text-[12px] font-medium rounded-full"
              style={{
                backgroundColor: systemColors.cyan + "15",
                color: systemColors.cyan,
              }}
            >
              ミネラル
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
          style={{ borderColor: systemColors.cyan + "30" }}
        >
          <h2
            className={`${typography.title3} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            この記事でわかること
          </h2>
          <ul className="space-y-3">
            {[
              "亜鉛サプリの形態と吸収率の違い（ピコリン酸・グルコン酸・クエン酸など）",
              "目的別（免疫・男性機能・美肌・味覚）の最適な選び方",
              "コスパランキングTOP3と本当のmg単価",
              "効果的な摂取タイミングと注意すべき相互作用",
              "銅欠乏症を防ぐための正しい摂取法",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2
                  size={20}
                  className="shrink-0 mt-0.5"
                  style={{ color: systemColors.cyan }}
                />
                <span style={{ color: appleWebColors.textPrimary }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* 目次 */}
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
                      backgroundColor: systemColors.cyan + "20",
                      color: systemColors.cyan,
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

        {/* 結論ファースト */}
        <section
          className="mb-12 rounded-[20px] p-6 md:p-8"
          style={{
            background: `linear-gradient(135deg, ${systemColors.cyan}15, ${systemColors.blue}15)`,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: systemColors.cyan }}
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
                  <strong>吸収率重視なら</strong>
                  →ピコリン酸亜鉛。研究で最も吸収率が高い。
                </li>
                <li style={{ color: appleWebColors.textPrimary }}>
                  <strong>コスパ重視なら</strong>
                  →グルコン酸亜鉛。安価で効果は十分。
                </li>
                <li style={{ color: appleWebColors.textPrimary }}>
                  <strong>風邪対策なら</strong>
                  →酢酸亜鉛トローチ。局所作用も期待。
                </li>
                <li style={{ color: appleWebColors.textPrimary }}>
                  <strong>胃が弱いなら</strong>
                  →クエン酸亜鉛。胃への刺激が少ない。
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 亜鉛の種類比較 */}
        <section id="types" className="mb-12 scroll-mt-20">
          <h2
            className={`${typography.title2} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            亜鉛サプリの種類と選び方
          </h2>
          <p
            className="text-[15px] leading-[1.7] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            亜鉛サプリには様々な形態があり、吸収率・価格・副作用が異なります。
            「亜鉛○○mg配合」と書いてあっても、形態によって実際に体に吸収される量は大きく違います。
          </p>

          <div className="space-y-4">
            {ZINC_TYPES.map((type) => (
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
                      副作用: {type.sideEffect}
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
        <section id="purpose" className="mb-12 scroll-mt-20">
          <h2
            className={`${typography.title2} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            目的別｜あなたに合った亜鉛はこれ
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
                          style={{ color: systemColors.cyan }}
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

        {/* コスパランキング */}
        <section id="products" className="mb-12 scroll-mt-20">
          <h2
            className={`${typography.title2} mb-2`}
            style={{ color: appleWebColors.textPrimary }}
          >
            コスパランキングTOP3｜亜鉛サプリ
          </h2>
          <p
            className="text-[15px] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            1日あたりのコストで比較した、最もお得な亜鉛サプリメントです。
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
                現在、亜鉛サプリメントの商品データを準備中です。
              </p>
            </div>
          )}
        </section>

        {/* 選び方チェックリスト */}
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
                        ? systemColors.cyan
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
                            backgroundColor: systemColors.cyan + "20",
                            color: systemColors.cyan,
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

        {/* 摂取量ガイド */}
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
            亜鉛は過剰摂取による副作用もあるため、目的に応じた適切な量を守ることが大切です。
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
                      style={{ color: systemColors.cyan }}
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

        {/* 注意点・副作用 */}
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
            亜鉛は適量なら安全ですが、過剰摂取や他の栄養素との相互作用には注意が必要です。
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

        {/* FAQ */}
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

        {/* 関連成分 */}
        <section className="mb-12">
          <h2
            className={`${typography.title2} mb-6`}
            style={{ color: appleWebColors.textPrimary }}
          >
            亜鉛と一緒に摂りたい成分
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                name: "マグネシウム",
                slug: "magnesium",
                emoji: "💫",
                reason: "ZMA配合で筋肉・睡眠をサポート",
              },
              {
                name: "ビタミンD",
                slug: "vitamin-d",
                emoji: "☀️",
                reason: "男性ホルモン生成に相乗効果",
              },
              {
                name: "ビタミンC",
                slug: "vitamin-c",
                emoji: "🍊",
                reason: "免疫機能をダブルでサポート",
              },
              {
                name: "銅",
                slug: "copper",
                emoji: "🔶",
                reason: "長期亜鉛摂取時のバランスに必須",
              },
            ].map((ingredient) => (
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

        {/* CTA */}
        <section
          className="rounded-[20px] p-8 text-center text-white"
          style={{
            background: `linear-gradient(135deg, ${systemColors.cyan}, ${systemColors.blue})`,
          }}
        >
          <h2 className={`${typography.title2} mb-4`}>
            亜鉛サプリをもっと詳しく比較
          </h2>
          <p className="text-[15px] opacity-90 mb-6">
            サプティアでは、5つの評価軸で商品を比較できます
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products?ingredient=zinc"
              className="inline-flex items-center justify-center gap-2 bg-white font-bold px-6 py-3 rounded-[12px] transition-colors hover:bg-gray-100"
              style={{ color: systemColors.cyan }}
            >
              全商品を見る
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/ingredients/zinc"
              className="inline-flex items-center justify-center gap-2 bg-white/20 font-medium px-6 py-3 rounded-[12px] transition-colors hover:bg-white/30"
            >
              亜鉛成分ガイド
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
