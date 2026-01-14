/**
 * 鉄分比較記事ページ
 * 統一テンプレート対応版（15セクション構成）
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
  Dumbbell,
  Users,
  Baby,
  Leaf,
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
    "【2025年最新】鉄分サプリおすすめ比較｜ヘム鉄・非ヘム鉄・キレート鉄の違い",
  description:
    "鉄分サプリをヘム鉄・非ヘム鉄・キレート鉄で比較。吸収率・副作用・コスパを徹底分析。女性・妊婦・アスリート向けの選び方。",
  publishedAt: "2025-01-19",
  updatedAt: new Date().toISOString().split("T")[0],
  ingredientName: "鉄",
  ingredientSlug: "iron",
};

const ogImageUrl = getArticleOGImage("iron-comparison");
const ogImage = generateOGImageMeta(ogImageUrl, "鉄分サプリ比較 - サプティア");

export const metadata: Metadata = {
  title: ARTICLE_DATA.title,
  description: ARTICLE_DATA.description,
  keywords: [
    "鉄分",
    "サプリメント",
    "ヘム鉄",
    "非ヘム鉄",
    "キレート鉄",
    "貧血",
    "女性",
    "妊娠",
    "吸収率",
    "2025",
  ],
  openGraph: {
    title: ARTICLE_DATA.title,
    description: ARTICLE_DATA.description,
    type: "article",
    publishedTime: ARTICLE_DATA.publishedAt,
    modifiedTime: ARTICLE_DATA.updatedAt,
    url: "https://suptia.com/articles/iron-comparison",
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
    canonical: "https://suptia.com/articles/iron-comparison",
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

async function getIronProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && availability == "in-stock" && references(*[_type == "ingredient" && slug.current == "iron"]._id)] | order(priceJPY asc)[0...20]{
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
    console.error("Failed to fetch iron products:", error);
    return [];
  }
}

// この記事でわかること
const LEARNING_POINTS = [
  "鉄分サプリの形態と吸収率の違い（ヘム鉄・非ヘム鉄・キレート鉄など）",
  "目的別（貧血対策・妊娠中・アスリート・ヴィーガン）の最適な選び方",
  "コスパランキングTOP3と副作用が少ない製品",
  "効果的な摂取タイミングと吸収を高める組み合わせ",
  "過剰摂取を防ぐための正しい摂取量と血液検査の重要性",
];

// 結論ファースト
const QUICK_RECOMMENDATIONS = [
  {
    label: "副作用を避けたいなら",
    value: "ヘム鉄。吸収率が高く胃腸に優しい。",
  },
  {
    label: "コスパ重視なら",
    value: "硫酸鉄・クエン酸鉄。ただし胃腸障害に注意。",
  },
  {
    label: "吸収率と副作用両方重視なら",
    value: "キレート鉄（ビスグリシン酸鉄）。",
  },
  { label: "妊娠中なら", value: "ヘム鉄 or リポソーム鉄。つわり中も安心。" },
];

// 関連成分
const RELATED_INGREDIENTS = [
  {
    name: "ビタミンC",
    slug: "vitamin-c",
    emoji: "🍊",
    reason: "非ヘム鉄の吸収を2-3倍に高める",
  },
  {
    name: "葉酸",
    slug: "folic-acid",
    emoji: "🌿",
    reason: "赤血球生成に必須のビタミン",
  },
  {
    name: "ビタミンB12",
    slug: "vitamin-b12",
    emoji: "🔴",
    reason: "貧血対策のトリオで相乗効果",
  },
  {
    name: "銅",
    slug: "copper",
    emoji: "🔶",
    reason: "鉄の代謝と赤血球形成を助ける",
  },
];

// 目次用セクションデータ
const SECTIONS = [
  { id: "learning", title: "この記事でわかること" },
  { id: "conclusion", title: "結論ファースト" },
  { id: "types", title: "種類と特徴" },
  { id: "purpose", title: "目的別おすすめ" },
  { id: "products", title: "おすすめ商品ランキング" },
  { id: "checklist", title: "選び方チェックリスト" },
  { id: "dosage", title: "摂取量・タイミング" },
  { id: "cautions", title: "注意点・副作用" },
  { id: "faq", title: "よくある質問" },
  { id: "related", title: "関連成分" },
];

// 鉄分の種類データ
const IRON_TYPES = [
  {
    name: "ヘム鉄",
    nameEn: "Heme Iron",
    absorption: "◎ 高い（15-35%）",
    price: "△ やや高め",
    sideEffect: "◎ 少ない",
    best: "胃腸が弱い方・副作用を避けたい方",
    description:
      "動物性食品由来の鉄。吸収率が高く、胃腸への刺激が少ない。便秘・吐き気が起きにくい。",
    color: systemColors.red,
  },
  {
    name: "非ヘム鉄（硫酸鉄）",
    nameEn: "Ferrous Sulfate",
    absorption: "△ 低い（2-20%）",
    price: "◎ 安い",
    sideEffect: "△ 多い",
    best: "コスパ重視・副作用に耐えられる方",
    description:
      "最も一般的な鉄剤。吸収率は低いが安価。胃腸障害（便秘・吐き気）が起きやすい。",
    color: "#6B7280",
  },
  {
    name: "クエン酸第一鉄",
    nameEn: "Ferrous Citrate",
    absorption: "○ 中程度",
    price: "○ 中程度",
    sideEffect: "○ 中程度",
    best: "バランス重視の方",
    description:
      "硫酸鉄より吸収率が良く、胃腸への刺激も抑えめ。日本で広く使われている。",
    color: systemColors.orange,
  },
  {
    name: "キレート鉄（ビスグリシン酸鉄）",
    nameEn: "Iron Bisglycinate",
    absorption: "◎ 高い",
    price: "△ やや高め",
    sideEffect: "◎ 少ない",
    best: "吸収率・副作用両方を重視",
    description:
      "アミノ酸とキレート結合。非ヘム鉄だが吸収率が高く、胃腸への刺激も少ない。",
    color: systemColors.green,
  },
  {
    name: "ピロリン酸第二鉄",
    nameEn: "Ferric Pyrophosphate",
    absorption: "○ 中程度",
    price: "○ 中程度",
    sideEffect: "◎ 少ない",
    best: "食品添加・マイルドな補給",
    description:
      "味や色への影響が少なく食品添加に使用される。胃腸に優しいが吸収率はやや劣る。",
    color: systemColors.cyan,
  },
  {
    name: "リポソーム鉄",
    nameEn: "Liposomal Iron",
    absorption: "◎ 高い",
    price: "× 高い",
    sideEffect: "◎ 少ない",
    best: "最新技術で副作用ゼロを目指す方",
    description:
      "リン脂質で包んだ鉄。胃を通過して腸で吸収されるため、副作用がほぼない。高価格。",
    color: systemColors.purple,
  },
];

// 目的別おすすめ
const PURPOSE_RECOMMENDATIONS = [
  {
    purpose: "貧血対策（女性）",
    icon: Users,
    emoji: "👩",
    description: "月経による鉄欠乏性貧血の改善",
    recommendation: "ヘム鉄 または キレート鉄",
    reason: "吸収率が高く、胃腸への副作用も少ない。継続しやすい形態がベスト。",
    tips: "ビタミンCと一緒に摂ると吸収UP。コーヒー・お茶は避ける。",
    dosage: "10-15mg/日",
  },
  {
    purpose: "妊娠中・授乳中",
    icon: Baby,
    emoji: "🤰",
    description: "胎児の発育と母体の健康維持",
    recommendation: "ヘム鉄 または リポソーム鉄",
    reason: "つわり中でも副作用が少なく、安心して続けられる。",
    tips: "葉酸との併用推奨。妊娠中期以降は需要が増加。",
    dosage: "妊娠中期以降 21.5mg/日",
  },
  {
    purpose: "アスリート・運動習慣",
    icon: Dumbbell,
    emoji: "🏃",
    description: "激しい運動による鉄消耗の補給",
    recommendation: "キレート鉄 または ヘム鉄",
    reason: "汗・溶血・消化管出血で鉄を失いやすい。効率的な補給が必要。",
    tips: "トレーニング後に摂取。定期的な血液検査で確認を。",
    dosage: "15-20mg/日",
  },
  {
    purpose: "ヴィーガン・ベジタリアン",
    icon: Leaf,
    emoji: "🥗",
    description: "植物性食事からの鉄不足対策",
    recommendation: "キレート鉄 + ビタミンC",
    reason: "植物性鉄（非ヘム鉄）は吸収率が低い。ビタミンCで大幅に吸収UP。",
    tips: "推奨量の1.8倍を目安に。植物性食品と一緒に摂取。",
    dosage: "18mg/日（推奨量の1.8倍）",
  },
];

// 選び方チェックリスト
const SELECTION_CHECKLIST = [
  {
    item: "鉄の形態を確認",
    description:
      "ヘム鉄・キレート鉄は吸収率◎・副作用◎。硫酸鉄・クエン酸鉄は安価だが副作用に注意。",
    important: true,
  },
  {
    item: "「元素鉄量」を確認",
    description:
      "化合物量ではなく元素鉄量を確認。女性10.5-11mg、男性7.5mg/日が目安。",
    important: true,
  },
  {
    item: "上限量を超えないか確認",
    description:
      "サプリメントからの上限は40mg/日。過剰摂取は肝臓・心臓にダメージ。",
    important: true,
  },
  {
    item: "相性の良い成分を確認",
    description:
      "ビタミンC配合なら吸収率アップ。銅・葉酸・B12との併用で相乗効果。",
    important: false,
  },
  {
    item: "飲みやすさ・形状を確認",
    description:
      "錠剤・カプセル・液体など。胃腸が弱い方は腸溶性カプセルも選択肢。",
    important: false,
  },
];

// 摂取量ガイド
const DOSAGE_GUIDE = [
  {
    purpose: "一般的な健康維持",
    amount: "7.5〜10.5mg/日",
    frequency: "1日1回",
    note: "食事で不足分を補う程度",
  },
  {
    purpose: "貧血対策（女性）",
    amount: "10〜15mg/日",
    frequency: "1日1回",
    note: "空腹時または食間。ビタミンCと一緒に",
  },
  {
    purpose: "妊娠中",
    amount: "21.5mg/日",
    frequency: "1日1〜2回",
    note: "中期以降に需要増。葉酸と併用",
  },
  {
    purpose: "アスリート",
    amount: "15〜20mg/日",
    frequency: "1日1回",
    note: "トレーニング後。定期的に血液検査",
  },
  {
    purpose: "ヴィーガン",
    amount: "18mg/日",
    frequency: "1日1回",
    note: "推奨量の1.8倍。ビタミンC必須",
  },
];

// 注意点・副作用
const CAUTIONS = [
  {
    title: "過剰摂取のリスク（最重要）",
    description:
      "鉄は体内に蓄積する唯一のミネラル。過剰摂取は肝臓・心臓にダメージ。血液検査でフェリチン値を確認してから摂取を。",
    severity: "critical",
  },
  {
    title: "胃腸障害",
    description:
      "便秘・吐き気・胃痛が起きやすい。特に硫酸鉄で顕著。ヘム鉄やキレート鉄に変更を検討。",
    severity: "warning",
  },
  {
    title: "便の色の変化",
    description:
      "鉄サプリで便が黒くなるのは正常。ただし、タール便（真っ黒で粘り気）は出血の可能性あり。",
    severity: "info",
  },
  {
    title: "ヘモクロマトーシス",
    description:
      "遺伝性の鉄過剰症。鉄サプリは禁忌。家族歴がある場合は必ず検査を。",
    severity: "critical",
  },
  {
    title: "薬との相互作用",
    description:
      "甲状腺薬・抗生物質・制酸剤と相互作用。2時間以上間隔をあける。",
    severity: "warning",
  },
];

// FAQ
const FAQS = [
  {
    question: "ヘム鉄と非ヘム鉄、どちらを選ぶべき？",
    answer:
      "副作用を避けたいならヘム鉄がおすすめ。吸収率が高く（15-35%）、胃腸への刺激も少ないです。コスパ重視なら非ヘム鉄ですが、便秘・吐き気が起きやすいことを覚悟してください。キレート鉄（ビスグリシン酸鉄）は非ヘム鉄ですが吸収率が高く、ヘム鉄と同等の効果が期待できます。",
  },
  {
    question: "鉄サプリはいつ飲むのが効果的？",
    answer:
      "空腹時が最も吸収率が高いですが、胃腸障害が起きやすい方は食事と一緒に。コーヒー・紅茶・牛乳と一緒に摂ると吸収が阻害されるので、1-2時間空けましょう。ビタミンCと一緒に摂ると吸収が2-3倍になります。",
  },
  {
    question: "ビタミンCと一緒に摂るべき？",
    answer:
      "非ヘム鉄の場合は必須です。ビタミンCは非ヘム鉄の吸収を2-3倍に高めます。ヘム鉄は食事の影響を受けにくいですが、ビタミンCと一緒でも問題ありません。100-200mgのビタミンCで十分効果があります。",
  },
  {
    question: "貧血でなくても鉄サプリを飲んでいい？",
    answer:
      "鉄は不足していなければ摂取すべきではありません。過剰な鉄は酸化ストレスを増加させ、肝臓・心臓にダメージを与えます。血液検査でフェリチン値を確認してから摂取してください。フェリチン30ng/mL未満なら鉄不足の可能性があります。",
  },
  {
    question: "鉄サプリで便秘になるのを防ぐには？",
    answer:
      "ヘム鉄・キレート鉄・リポソーム鉄は便秘になりにくいです。硫酸鉄で便秘が起きる場合は、形態を変えるか、マグネシウムを併用するのも効果的です。水分と食物繊維の摂取も重要です。",
  },
  {
    question: "妊娠中に鉄サプリを飲んでも大丈夫？",
    answer:
      "妊娠中は鉄の需要が増加するため、医師の指導のもとで摂取が推奨されます。妊娠中期以降は1日21.5mgが目安。つわりで胃腸が敏感な時期はヘム鉄やリポソーム鉄がおすすめです。葉酸との併用も重要です。",
  },
  {
    question: "鉄とカルシウムは一緒に飲んでいい？",
    answer:
      "カルシウムは鉄の吸収を阻害するため、同時摂取は避けてください。カルシウムサプリは朝、鉄サプリは夜など、2時間以上間隔をあけるのが理想的です。",
  },
];

export default async function IronComparisonPage() {
  const products = await getIronProducts();

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

      const ironIngredient = product.ingredients?.find((i) =>
        i.ingredient?.name?.includes("鉄"),
      );
      const mgPerServing = ironIngredient?.amountMgPerServing || 0;
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
      {/* 1. パンくずナビ（sticky） */}
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
              鉄分比較
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
                backgroundColor: systemColors.red + "15",
                color: systemColors.red,
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
          <ol className="space-y-2 text-[15px]">
            {SECTIONS.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="hover:opacity-70 transition-opacity"
                  style={{ color: systemColors.blue }}
                >
                  {index + 1}. {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* 4. この記事でわかること */}
        <section
          id="learning"
          className={`${liquidGlassClasses.light} rounded-[20px] p-6 mb-12 border scroll-mt-16`}
          style={{ borderColor: systemColors.red + "30" }}
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
                  style={{ color: systemColors.red }}
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
            background: `linear-gradient(135deg, ${systemColors.red}15, ${systemColors.orange}15)`,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: systemColors.red }}
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
                    <strong>{rec.label}</strong> → {rec.value}
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
            鉄分サプリの種類と選び方
          </h2>
          <p
            className="text-[15px] leading-[1.7] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            鉄分サプリは形態によって吸収率と副作用が大きく異なります。
            「鉄○○mg配合」と書いてあっても、形態によって実際に体に吸収される量は大きく違います。
          </p>

          <div className="space-y-4">
            {IRON_TYPES.map((type) => (
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

        {/* 7. 目的別おすすめ */}
        <section id="purpose" className="mb-12 scroll-mt-16">
          <h2
            className={`${typography.title2} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            目的別｜あなたに合った鉄分サプリはこれ
          </h2>
          <p
            className="text-[15px] leading-[1.7] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            「結局どれを買えばいいの？」という方のために、目的別におすすめをまとめました。
          </p>

          <div className="space-y-4">
            {PURPOSE_RECOMMENDATIONS.map((rec) => (
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
                        style={{ color: systemColors.red }}
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
                        className="text-[13px] mb-2"
                        style={{ color: appleWebColors.textTertiary }}
                      >
                        目安: {rec.dosage}
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
            ))}
          </div>
        </section>

        {/* 8. おすすめ商品ランキング */}
        <section id="products" className="mb-12 scroll-mt-16">
          <h2
            className={`${typography.title2} mb-2`}
            style={{ color: appleWebColors.textPrimary }}
          >
            コスパランキングTOP3｜鉄分サプリ
          </h2>
          <p
            className="text-[15px] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            1日あたりのコストで比較した、最もお得な鉄分サプリメントです。
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
                現在、鉄分サプリメントの商品データを準備中です。
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/products?ingredient=iron"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[15px] font-medium text-white"
              style={{ backgroundColor: systemColors.blue }}
            >
              すべての鉄分サプリを見る
              <ArrowRight size={16} />
            </Link>
          </div>
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
                        ? systemColors.red
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
                            backgroundColor: systemColors.red + "20",
                            color: systemColors.red,
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
            目的別｜摂取量の目安
          </h2>
          <p
            className="text-[15px] leading-[1.7] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            鉄は過剰摂取による副作用が深刻なため、目的に応じた適切な量を守ることが重要です。
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
                      style={{ color: systemColors.red }}
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
            鉄は体内に蓄積するため、過剰摂取には特に注意が必要です。必ず血液検査で確認してから摂取を。
          </p>

          <div className="space-y-3">
            {CAUTIONS.map((caution, index) => (
              <div
                key={index}
                className={`rounded-[12px] p-4 flex items-start gap-3`}
                style={{
                  backgroundColor:
                    caution.severity === "critical"
                      ? systemColors.red + "15"
                      : caution.severity === "warning"
                        ? systemColors.orange + "15"
                        : systemColors.blue + "15",
                }}
              >
                {caution.severity === "critical" ? (
                  <AlertTriangle
                    size={20}
                    className="shrink-0 mt-0.5"
                    style={{ color: systemColors.red }}
                  />
                ) : caution.severity === "warning" ? (
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
            鉄分と一緒に摂りたい成分
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
            background: `linear-gradient(135deg, ${systemColors.red}, ${systemColors.orange})`,
          }}
        >
          <h2 className={`${typography.title2} mb-4`}>
            鉄分サプリをもっと詳しく比較
          </h2>
          <p className="text-[15px] opacity-90 mb-6">
            サプティアでは、5つの評価軸で商品を比較できます
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products?ingredient=iron"
              className="inline-flex items-center justify-center gap-2 bg-white font-bold px-6 py-3 rounded-[12px] transition-colors hover:bg-gray-100"
              style={{ color: systemColors.red }}
            >
              全商品を見る
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/ingredients/iron"
              className="inline-flex items-center justify-center gap-2 bg-white/20 font-medium px-6 py-3 rounded-[12px] transition-colors hover:bg-white/30"
            >
              鉄成分ガイド
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
