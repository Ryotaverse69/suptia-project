/**
 * MCTオイル比較記事ページ
 * SEO最適化された比較コンテンツ - 統一テンプレート v2
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
  Brain,
  Flame,
  Activity,
  Heart,
  BadgeCheck,
  Info,
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
  "MCTオイルの形態と種類の違い（C8・C10・ブレンド・パウダー）",
  "目的別（ケトジェニック・認知機能・運動）の最適な選び方",
  "コスパランキングTOP3と本当のml単価",
  "効果的な摂取タイミングと初心者向けの始め方",
  "消化器トラブルを防ぐための正しい摂取法",
];

// 結論ファースト
const QUICK_RECOMMENDATIONS = [
  {
    label: "ケトン体効率重視なら",
    recommendation: "C8（カプリル酸）100%。最速でケトン体に変換。",
  },
  {
    label: "コスパ重視なら",
    recommendation: "C8/C10ブレンド（60:40）。バランスが良い。",
  },
  {
    label: "初心者なら",
    recommendation: "MCTパウダー。消化器への刺激が少ない。",
  },
  {
    label: "環境配慮なら",
    recommendation: "ココナッツ由来・認証取得品。",
  },
];

// 関連成分
const RELATED_INGREDIENTS = [
  {
    name: "オメガ3（フィッシュオイル）",
    slug: "omega-3",
    emoji: "🐟",
    reason: "脂質バランスで脳機能をサポート",
  },
  {
    name: "ココナッツオイル",
    slug: "coconut-oil",
    emoji: "🥥",
    reason: "MCTを含む天然オイル",
  },
  {
    name: "クレアチン",
    slug: "creatine",
    emoji: "💪",
    reason: "運動パフォーマンス向上に相乗効果",
  },
  {
    name: "カフェイン",
    slug: "caffeine",
    emoji: "☕",
    reason: "バターコーヒーで認知機能サポート",
  },
];

const ARTICLE_DATA = {
  title:
    "【2026年最新】MCTオイルおすすめ比較｜C8・C10比率とケトン体生成効率で徹底分析",
  description:
    "MCTオイルをC8/C10比率・原料・品質で徹底比較。ケトジェニックダイエット、認知機能、エネルギー補給に最適な選び方を解説。",
  publishedAt: "2025-01-19",
  updatedAt: new Date().toISOString().split("T")[0],
  ingredientName: "MCTオイル",
  ingredientSlug: "mct-oil",
};

const ogImageUrl = getArticleOGImage("mct-oil-comparison");
const ogImage = generateOGImageMeta(ogImageUrl, "MCTオイル比較 - サプティア");

export const metadata: Metadata = {
  title: ARTICLE_DATA.title,
  description: ARTICLE_DATA.description,
  keywords: [
    "MCTオイル",
    "C8",
    "カプリル酸",
    "C10",
    "カプリン酸",
    "ケトン体",
    "ケトジェニック",
    "バターコーヒー",
    "中鎖脂肪酸",
    "ダイエット",
  ],
  openGraph: {
    title: ARTICLE_DATA.title,
    description: ARTICLE_DATA.description,
    type: "article",
    publishedTime: ARTICLE_DATA.publishedAt,
    modifiedTime: ARTICLE_DATA.updatedAt,
    url: "https://suptia.com/articles/mct-oil-comparison",
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
    canonical: "https://suptia.com/articles/mct-oil-comparison",
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

async function getMCTProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && availability == "in-stock" && (
    name match "*MCT*" ||
    name match "*中鎖脂肪酸*"
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
    console.error("Failed to fetch MCT products:", error);
    return [];
  }
}

// MCTオイルの種類データ
const MCT_TYPES = [
  {
    name: "C8（カプリル酸）100%",
    nameEn: "Pure C8 (Caprylic Acid)",
    absorption: "◎ 最高",
    ketonePower: "◎ 最高",
    price: "△ 高い",
    best: "ケトジェニック上級者",
    description:
      "最もケトン体生成効率が高い純粋C8。肝臓でほぼ100%ケトン体に変換され、脳のエネルギー源として最適。",
    color: systemColors.green,
  },
  {
    name: "C8/C10ブレンド",
    nameEn: "C8/C10 Blend (60:40)",
    absorption: "○ 良好",
    ketonePower: "○ 良好",
    price: "○ 中程度",
    best: "初心者・日常使い",
    description:
      "C8とC10を最適比率で配合。ケトン体生成と持続的エネルギー供給のバランスが良く、コスパも良好。",
    color: systemColors.blue,
  },
  {
    name: "C10（カプリン酸）リッチ",
    nameEn: "C10 Rich (Capric Acid)",
    absorption: "○ 良好",
    ketonePower: "△ 中程度",
    price: "◎ 安い",
    best: "コスパ重視・抗菌効果",
    description:
      "C10を多く含む配合。ケトン体生成はC8に劣るが、抗菌・抗真菌作用が報告されている。価格が手頃。",
    color: systemColors.cyan,
  },
  {
    name: "ココナッツ由来MCT",
    nameEn: "Coconut-Derived MCT",
    absorption: "○ 良好",
    ketonePower: "○ 良好",
    price: "○ 中程度",
    best: "天然志向・品質重視",
    description:
      "ココナッツオイルからC8/C10を抽出。天然由来で安心感があり、環境負荷も比較的少ない。",
    color: systemColors.orange,
  },
  {
    name: "パーム由来MCT",
    nameEn: "Palm-Derived MCT",
    absorption: "○ 良好",
    ketonePower: "○ 良好",
    price: "◎ 最安",
    best: "コスパ最優先",
    description:
      "パームカーネルオイルから抽出。大量生産でコストが低いが、環境問題への懸念がある。",
    color: "#6B7280",
  },
  {
    name: "MCTパウダー",
    nameEn: "MCT Powder",
    absorption: "△ 中程度",
    ketonePower: "△ 中程度",
    price: "△ やや高い",
    best: "初心者・外出時",
    description:
      "粉末化されたMCT。持ち運びに便利で消化器への刺激が少ない。食物繊維も摂取可能。",
    color: systemColors.purple,
  },
];

// 目的別おすすめ
const PURPOSE_RECOMMENDATIONS = [
  {
    purpose: "認知機能・集中力向上",
    icon: Brain,
    description: "脳のエネルギー源としてケトン体を活用",
    recommendation: "C8（カプリル酸）100%",
    reason:
      "C8は最も速くケトン体に変換され、脳に効率的にエネルギーを供給。朝食時や仕事前の摂取が効果的。",
    tips: "コーヒーに15ml入れて朝に摂取。糖質を控えるとより効果的。",
  },
  {
    purpose: "ケトジェニックダイエット",
    icon: Flame,
    description: "糖質制限と組み合わせて脂肪燃焼を促進",
    recommendation: "C8/C10ブレンド（60:40）",
    reason:
      "ケトン体生成と持続的エネルギー供給のバランスが良い。バターコーヒーが人気。",
    tips: "他の脂質と「置き換え」が基本。追加摂取はカロリー過剰に。",
  },
  {
    purpose: "運動前のエネルギー補給",
    icon: Zap,
    description: "持久系スポーツ・筋トレ前のエネルギー源",
    recommendation: "C8/C10ブレンド",
    reason:
      "糖質とは異なる経路でエネルギーを生成。グリコーゲンを温存しながら持久力をサポート。",
    tips: "運動30-60分前に10-15ml。空腹時は避ける。",
  },
  {
    purpose: "消化器への負担を抑えたい",
    icon: Activity,
    description: "MCT初心者・お腹が弱い方",
    recommendation: "MCTパウダー",
    reason:
      "パウダー化により消化器への刺激が緩和。食物繊維との組み合わせで腸内環境にも配慮。",
    tips: "5gから始めて徐々に増量。プロテインに混ぜても良い。",
  },
  {
    purpose: "環境・品質を重視",
    icon: Heart,
    description: "サステナブルで高品質なMCTを選びたい",
    recommendation: "ココナッツ由来・認証取得品",
    reason:
      "RSPO認証や有機認証のココナッツ由来MCTは環境負荷が少なく、品質も安定。",
    tips: "遮光瓶入り・第三者機関テスト済みを選ぶ。",
  },
];

// 選び方チェックリスト
const SELECTION_CHECKLIST = [
  {
    item: "C8/C10比率を確認",
    description:
      "ケトン体生成効率重視ならC8比率高め、コスパ重視ならC8/C10ブレンドを選択。",
    important: true,
  },
  {
    item: "原料の由来を確認",
    description:
      "ココナッツ由来かパーム由来か。環境配慮・品質安定性ならココナッツ由来が安心。",
    important: true,
  },
  {
    item: "添加物の有無",
    description:
      "純粋なMCTオイルは添加物不要。パウダーは乳化剤等の成分を確認。",
    important: false,
  },
  {
    item: "容器の品質",
    description:
      "遮光瓶か、プラスチックか。酸化防止のため遮光性・密閉性の高い容器が望ましい。",
    important: false,
  },
  {
    item: "第三者機関のテスト",
    description:
      "重金属・残留溶媒・微生物検査済みかどうか。GMP認証工場製造だと安心。",
    important: true,
  },
];

// 摂取量ガイド
const DOSAGE_GUIDE = [
  {
    purpose: "初心者（導入期）",
    amount: "5-10ml/日",
    frequency: "朝1回",
    note: "少量から開始。食事と一緒に摂取して様子を見る",
  },
  {
    purpose: "中級者（適応期）",
    amount: "15-30ml/日",
    frequency: "2-3回に分けて",
    note: "体が慣れてきたら徐々に増量",
  },
  {
    purpose: "ケトジェニック上級者",
    amount: "30-45ml/日",
    frequency: "朝・昼・夕",
    note: "糖質制限と併用。ケトン体濃度をモニタリング",
  },
  {
    purpose: "運動パフォーマンス",
    amount: "10-15ml",
    frequency: "運動30-60分前",
    note: "空腹時は避ける。持久系に効果的",
  },
  {
    purpose: "認知機能サポート",
    amount: "15ml",
    frequency: "朝1回",
    note: "コーヒーに入れて。糖質を控えると効果的",
  },
];

// 注意点・副作用
const CAUTIONS = [
  {
    title: "消化器系の副作用",
    description:
      "MCTは急速に消化されるため、初期は下痢・胃もたれ・腹痛が起きやすい。少量から開始し、食事と一緒に摂取。",
    severity: "warning",
  },
  {
    title: "カロリー過剰に注意",
    description:
      "MCTオイルは1mlあたり約7kcal。30mlで約210kcal。ダイエット目的なら他の脂質と「置き換え」が基本。",
    severity: "warning",
  },
  {
    title: "加熱調理には不向き",
    description:
      "MCTオイルの発煙点は約160℃と低く、高温調理には適さない。サラダ・スムージー・コーヒーなど非加熱で使用。",
    severity: "info",
  },
  {
    title: "糖尿病・肝疾患の方は注意",
    description:
      "ケトン体が過剰に生成されるリスクがある。特に1型糖尿病の方はケトアシドーシスの危険があるため医師に相談必須。",
    severity: "warning",
  },
  {
    title: "空腹時の摂取は避ける",
    description:
      "空腹時に摂取すると消化器トラブルを起こしやすい。必ず食事と一緒に摂取することを推奨。",
    severity: "warning",
  },
];

// FAQ
const FAQS = [
  {
    question: "MCTオイルとココナッツオイルの違いは？",
    answer:
      "ココナッツオイルは約55-65%がMCT（C8, C10, C12）で、残りは長鎖脂肪酸です。MCTオイルはC8とC10だけを抽出・濃縮した製品で、ケトン体生成効率が大幅に高くなります。C12（ラウリン酸）はMCTに分類されることもありますが、代謝経路は長鎖脂肪酸に近いです。",
  },
  {
    question: "バターコーヒー（完全無欠コーヒー）のMCT量は？",
    answer:
      "一般的なレシピではMCTオイル15-30ml（大さじ1-2）とグラスフェッドバター15-30gをコーヒーに入れてブレンドします。初めての場合はMCT 5-10mlから開始し、お腹の調子を見ながら増量してください。",
  },
  {
    question: "MCTオイルはいつ飲むのが効果的？",
    answer:
      "目的により異なります。認知機能向上なら朝食時、運動パフォーマンスなら運動30-60分前、ダイエット目的なら食事と一緒に。空腹時の摂取は消化器トラブルを起こしやすいため、食事と一緒がおすすめです。",
  },
  {
    question: "MCTパウダーとオイル、どちらが良い？",
    answer:
      "MCT含有量はオイルの方が高く、コスパも良好です。ただし、パウダーは持ち運びに便利で、消化器への刺激が少ないメリットがあります。旅行時や外出時、MCT初心者にはパウダーが適しています。",
  },
  {
    question: "C8とC10、どちらを選ぶべき？",
    answer:
      "ケトン体生成効率を最優先するならC8（カプリル酸）100%。C8は肝臓でほぼ100%ケトン体に変換されます。コスパと効果のバランスを取るならC8/C10ブレンド（60:40程度）がおすすめ。C10は抗菌作用も報告されています。",
  },
  {
    question: "MCTオイルでダイエットできる？",
    answer:
      "MCT単独での減量効果は限定的です。糖質制限（ケトジェニック）と組み合わせることで脂肪燃焼を促進する可能性があります。ただしMCT自体はカロリーがあるため、他の脂質と「置き換え」が基本。追加摂取はカロリー過剰で逆効果になります。",
  },
  {
    question: "MCTオイルの保存方法は？",
    answer:
      "直射日光を避け、常温で保存してください。冷蔵保存は不要ですが、開封後は早めに使い切ることをおすすめします。遮光瓶入りの製品は酸化しにくいです。",
  },
];

export default async function MCTOilComparisonPage() {
  const products = await getMCTProducts();

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
              MCTオイル比較
            </span>
          </nav>
        </div>
      </div>

      {/* 2. ヘッダー（ヒーローセクション） */}
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
              脂肪酸
            </span>
            <span
              className="px-3 py-1 text-[12px] font-medium rounded-full"
              style={{
                backgroundColor: systemColors.cyan + "15",
                color: systemColors.cyan,
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
            background: `linear-gradient(135deg, ${systemColors.green}15, ${systemColors.cyan}15)`,
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
                    {" → "}
                    {rec.recommendation}
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
            MCTオイルの種類と選び方
          </h2>
          <p
            className="text-[15px] leading-[1.7] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            MCTオイルには様々な形態があり、C8/C10比率・原料・形状が異なります。
            「MCTオイル」と書いてあっても、ケトン体生成効率やコスパは大きく違います。
          </p>

          <div className="space-y-4">
            {MCT_TYPES.map((type) => (
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
                      ケトン効率: {type.ketonePower}
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
            目的別｜あなたに合ったMCTオイルはこれ
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
                      className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: systemColors.green + "15" }}
                    >
                      <Icon size={24} style={{ color: systemColors.green }} />
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
            コスパランキングTOP3｜MCTオイル
          </h2>
          <p
            className="text-[15px] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            1日あたりのコストで比較した、最もお得なMCTオイル製品です。
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
                現在、MCTオイル製品の商品データを準備中です。
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
            MCTオイルは消化器への負担があるため、少量から始めて徐々に増量することが大切です。
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
            MCTオイルは適量なら安全ですが、消化器系への影響や持病との相互作用に注意が必要です。
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
            MCTオイルと一緒に摂りたい成分
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
            background: `linear-gradient(135deg, ${systemColors.green}, ${systemColors.cyan})`,
          }}
        >
          <h2 className={`${typography.title2} mb-4`}>
            MCTオイルをもっと詳しく比較
          </h2>
          <p className="text-[15px] opacity-90 mb-6">
            サプティアでは、5つの評価軸で商品を比較できます
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/search?q=MCT"
              className="inline-flex items-center justify-center gap-2 bg-white font-bold px-6 py-3 rounded-[12px] transition-colors hover:bg-gray-100"
              style={{ color: systemColors.green }}
            >
              全商品を見る
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/articles"
              className="inline-flex items-center justify-center gap-2 bg-white/20 font-medium px-6 py-3 rounded-[12px] transition-colors hover:bg-white/30"
            >
              他の比較記事を見る
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
