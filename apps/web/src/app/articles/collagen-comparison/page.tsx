/**
 * コラーゲン比較記事ページ
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
  Heart,
  Shield,
  BadgeCheck,
  Info,
  Sparkles,
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

const ARTICLE_DATA = {
  title:
    "【2025年最新】コラーゲンサプリおすすめ比較｜タイプ・分子量・吸収率で徹底分析",
  description:
    "コラーゲンサプリをI型・II型・III型、分子量（ペプチド・低分子）、原料（魚・豚・鶏）で徹底比較。美肌・関節・髪への効果的な選び方。",
  publishedAt: "2025-01-19",
  updatedAt: new Date().toISOString().split("T")[0],
  ingredientName: "コラーゲン",
  ingredientSlug: "collagen",
};

const ogImageUrl = getArticleOGImage("collagen-comparison");
const ogImage = generateOGImageMeta(
  ogImageUrl,
  "コラーゲンサプリメント比較 - Suptia",
);

export const metadata: Metadata = {
  title: ARTICLE_DATA.title,
  description: ARTICLE_DATA.description,
  keywords: [
    "コラーゲン",
    "サプリメント",
    "おすすめ",
    "比較",
    "2025",
    "低分子",
    "ペプチド",
    "美肌",
    "関節",
    "マリンコラーゲン",
  ],
  openGraph: {
    title: ARTICLE_DATA.title,
    description: ARTICLE_DATA.description,
    type: "article",
    publishedTime: ARTICLE_DATA.publishedAt,
    modifiedTime: ARTICLE_DATA.updatedAt,
    url: "https://suptia.com/articles/collagen-comparison",
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
    canonical: "https://suptia.com/articles/collagen-comparison",
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

async function getCollagenProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && availability == "in-stock" && (
    name match "*コラーゲン*" ||
    name match "*Collagen*" ||
    name match "*collagen*"
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
    console.error("Failed to fetch collagen products:", error);
    return [];
  }
}

// コラーゲンの種類データ
const COLLAGEN_TYPES = [
  {
    name: "I型コラーゲン",
    nameEn: "Type I Collagen",
    source: "魚（マリン）・豚・牛",
    benefit: "肌・髪・爪・骨",
    description:
      "体内コラーゲンの約90%を占める。肌のハリ・弾力、骨の強度に関与。美容目的なら最も重要。",
    best: "美肌・アンチエイジング目的",
    color: systemColors.pink,
  },
  {
    name: "II型コラーゲン",
    nameEn: "Type II Collagen",
    source: "鶏軟骨",
    benefit: "関節・軟骨",
    description:
      "軟骨の主成分。関節の柔軟性・クッション性を維持。変形性関節症への効果が研究されている。",
    best: "関節痛・膝の悩みがある方",
    color: systemColors.blue,
  },
  {
    name: "III型コラーゲン",
    nameEn: "Type III Collagen",
    source: "豚・牛",
    benefit: "肌・血管・臓器",
    description:
      "肌の柔らかさ、血管の弾力性に関与。I型と一緒に存在することが多い。エイジングケアに重要。",
    best: "肌の弾力・血管ケア目的",
    color: systemColors.purple,
  },
  {
    name: "マリンコラーゲン（魚由来）",
    nameEn: "Marine Collagen",
    source: "魚の皮・鱗",
    benefit: "肌・髪・爪",
    description:
      "分子が小さく吸収率が高いとされる。豚・牛より臭みが少ない。主にI型コラーゲン。",
    best: "吸収率重視・豚牛アレルギーの方",
    color: systemColors.cyan,
  },
  {
    name: "豚由来コラーゲン",
    nameEn: "Porcine Collagen",
    source: "豚皮",
    benefit: "肌・髪・爪",
    description:
      "ヒトとの相性が良く、最も一般的な原料。I型・III型を含む。コスパが良い。",
    best: "コスパ重視・幅広い効果を期待",
    color: systemColors.orange,
  },
  {
    name: "低分子コラーゲンペプチド",
    nameEn: "Collagen Peptide",
    source: "各種原料を酵素分解",
    benefit: "全身",
    description:
      "分子量を小さくして吸収率を高めた形態。3000ダルトン以下が目安。現在の主流。",
    best: "効率的な吸収を求める方（全員におすすめ）",
    color: systemColors.green,
  },
];

// 目的別おすすめ
const PURPOSE_RECOMMENDATIONS = [
  {
    purpose: "美肌・シワ・たるみ対策",
    icon: Sparkles,
    emoji: "✨",
    description: "肌のハリ・弾力を取り戻したい、若々しい肌を維持したい",
    recommendation: "低分子マリンコラーゲンペプチド（I型）",
    reason:
      "I型コラーゲンが肌の真皮層を構成。低分子（3000ダルトン以下）で吸収率アップ。",
    tips: "ビタミンCを一緒に摂ると、体内でのコラーゲン合成が促進される。",
  },
  {
    purpose: "関節痛・膝の悩み",
    icon: Shield,
    emoji: "🦴",
    description: "膝が痛い、関節の動きが悪い、運動後に違和感",
    recommendation: "II型コラーゲン（非変性）",
    reason:
      "軟骨の主成分で、関節の柔軟性を維持。非変性タイプは構造を保ったまま吸収される。",
    tips: "グルコサミン・コンドロイチンとの併用でさらに効果的。",
  },
  {
    purpose: "髪のボリューム・ツヤ",
    icon: Heart,
    emoji: "💇",
    description: "髪が細くなった、パサつく、抜け毛が気になる",
    recommendation: "低分子コラーゲンペプチド + ビオチン",
    reason:
      "コラーゲンは毛髪の土台となる頭皮の真皮層を構成。ビオチンと併用で相乗効果。",
    tips: "亜鉛・鉄分・ビタミンCも一緒に摂ると効果的。",
  },
  {
    purpose: "爪の強化",
    icon: Shield,
    emoji: "💅",
    description: "爪が割れやすい、二枚爪、縦すじが気になる",
    recommendation: "コラーゲンペプチド + ビオチン + ケイ素",
    reason:
      "爪の成分の一部はコラーゲン。ケラチン生成にビオチン、爪の強度にケイ素が関与。",
    tips: "効果を実感するまで3〜6ヶ月かかることも。継続が大切。",
  },
  {
    purpose: "総合的なエイジングケア",
    icon: Heart,
    emoji: "🌟",
    description: "肌・髪・爪・関節をトータルでケアしたい",
    recommendation: "マルチコラーゲン（I・II・III型含有）",
    reason: "複数のタイプを含む製品で、全身のコラーゲン補給を効率的に。",
    tips: "ヒアルロン酸・エラスチン配合の製品ならさらに美容効果アップ。",
  },
];

// 選び方チェックリスト
const SELECTION_CHECKLIST = [
  {
    item: "分子量（ダルトン）を確認",
    description:
      "低分子（3000ダルトン以下）が吸収されやすい。「コラーゲンペプチド」と表記されているものが目安。",
    important: true,
  },
  {
    item: "コラーゲンのタイプを確認",
    description:
      "美肌ならI型、関節ならII型。目的に合ったタイプを選択。マルチタイプもおすすめ。",
    important: true,
  },
  {
    item: "原料（魚・豚・鶏）を確認",
    description:
      "アレルギーがなければどれでもOK。臭いが気になるなら魚由来。コスパなら豚由来。",
    important: false,
  },
  {
    item: "1日の摂取量を確認",
    description:
      "美容目的なら5000〜10000mg/日が一般的。含有量が少ない製品は効果を感じにくい。",
    important: true,
  },
  {
    item: "相乗成分の有無を確認",
    description:
      "ビタミンC、ヒアルロン酸、エラスチン、セラミドなど配合だと効果的。",
    important: false,
  },
];

// 摂取量ガイド
const DOSAGE_GUIDE = [
  {
    purpose: "美肌・一般的な美容",
    amount: "5000〜10000mg/日",
    frequency: "1日1〜2回",
    note: "ビタミンCと一緒に摂取が効果的",
  },
  {
    purpose: "関節サポート（II型）",
    amount: "40mg/日（非変性II型）",
    frequency: "1日1回",
    note: "空腹時の摂取が推奨される製品も",
  },
  {
    purpose: "髪・爪の強化",
    amount: "5000〜10000mg/日",
    frequency: "1日1〜2回",
    note: "効果実感まで3〜6ヶ月継続",
  },
  {
    purpose: "アスリート・運動者",
    amount: "10000〜15000mg/日",
    frequency: "1日2〜3回に分けて",
    note: "運動後の摂取がおすすめ",
  },
  {
    purpose: "エイジングケア（50代以上）",
    amount: "5000〜10000mg/日",
    frequency: "1日1〜2回",
    note: "継続が大切。最低3ヶ月は続ける",
  },
];

// 注意点・副作用
const CAUTIONS = [
  {
    title: "アレルギーに注意",
    description:
      "魚介類・豚・牛・鶏にアレルギーがある方は、原料を必ず確認。マリンコラーゲンは魚アレルギーの方はNG。",
    severity: "warning",
  },
  {
    title: "即効性はない",
    description:
      "コラーゲンは継続摂取で効果を発揮。最低3ヶ月、できれば6ヶ月は続けないと効果を実感しにくい。",
    severity: "info",
  },
  {
    title: "品質の差が大きい",
    description:
      "安価な製品は分子量が大きく吸収されにくいことも。「ペプチド」「低分子」の表記を確認。",
    severity: "info",
  },
  {
    title: "カロリーに注意",
    description:
      "コラーゲンはタンパク質なのでカロリーがある。ドリンクタイプは糖分も含むことが多い。",
    severity: "info",
  },
  {
    title: "妊娠・授乳中の方",
    description:
      "基本的に安全だが、高用量摂取の安全性データは限定的。心配なら医師に相談を。",
    severity: "warning",
  },
];

// FAQ
const FAQS = [
  {
    question: "コラーゲンを飲んでも意味がないと聞きましたが？",
    answer:
      "「コラーゲンを食べても分解されるから意味がない」という説がありましたが、最近の研究では否定されています。コラーゲンペプチドは分解されてアミノ酸になりますが、その一部は「コラーゲン由来ペプチド」として血中に残り、肌や関節のコラーゲン合成を促進するシグナルになることがわかっています。複数の臨床試験で、肌の弾力性改善、シワ減少、関節痛軽減の効果が報告されています。",
  },
  {
    question: "コラーゲンはいつ飲むのが効果的？",
    answer:
      "空腹時または就寝前がおすすめです。空腹時は他の食品のタンパク質と競合しにくく、吸収が良いとされています。就寝前は成長ホルモンの分泌と合わせて効果的という説もあります。ただし、食後でも十分効果は期待できるので、自分が続けやすいタイミングで問題ありません。ビタミンCを一緒に摂ると体内でのコラーゲン合成が促進されます。",
  },
  {
    question: "マリンコラーゲンと豚コラーゲンの違いは？",
    answer:
      "主な違いは分子量、吸収率、臭い、価格です。マリンコラーゲン（魚由来）は分子量が小さく吸収されやすい、臭いが少ないとされますが、やや高価です。豚コラーゲンはヒトとの相性が良く、I型・III型を含み、コスパが良いです。効果に大きな差はないので、アレルギーがなければ価格や形状の好みで選んでOKです。",
  },
  {
    question: "コラーゲンドリンクとサプリメントどちらがいい？",
    answer:
      "効果に大きな差はありません。ドリンクタイプは吸収が早い、飲みやすいというメリットがありますが、糖分が多い、価格が高い、冷蔵保存が必要な場合があるというデメリットも。錠剤・カプセル・粉末タイプはコスパが良く、持ち運びしやすいですが、飲む量が多くなることも。続けやすさを最優先に選びましょう。",
  },
  {
    question: "コラーゲンサプリはどのくらいで効果を感じますか？",
    answer:
      "個人差がありますが、肌のハリ・弾力は8〜12週間、関節の違和感は12〜24週間程度で変化を感じる人が多いです。髪・爪は成長サイクルが長いため、3〜6ヶ月以上かかることも。即効性を期待せず、最低3ヶ月は継続することをおすすめします。効果を感じない場合は、摂取量が足りない（5000mg未満）可能性もあります。",
  },
  {
    question: "II型コラーゲンは他のコラーゲンと何が違う？",
    answer:
      "II型コラーゲンは軟骨に特化したタイプで、関節サポートが目的の場合に選びます。特に「非変性II型コラーゲン（UC-II等）」は、40mg/日という少量でも効果があるとされています。これは構造を壊さずに摂取することで、免疫システムに働きかけて関節の炎症を抑える作用があるためです。美肌目的ならI型、関節目的ならII型と使い分けましょう。",
  },
  {
    question: "コラーゲンと一緒に摂ると良い成分は？",
    answer:
      "【ビタミンC】体内でのコラーゲン合成に必須。一緒に摂ることで効果倍増。【ヒアルロン酸】肌の保水力をサポート。【エラスチン】肌の弾力性をサポート。【セラミド】肌のバリア機能をサポート。【ビオチン・亜鉛】髪・爪の健康に。【グルコサミン・コンドロイチン】関節サポートに相乗効果。目的に応じて組み合わせると効果的です。",
  },
];

export default async function CollagenComparisonPage() {
  const products = await getCollagenProducts();

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
              コラーゲン比較
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
                backgroundColor: systemColors.pink + "15",
                color: systemColors.pink,
              }}
            >
              美容成分
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
          style={{ borderColor: systemColors.pink + "30" }}
        >
          <h2
            className={`${typography.title3} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            この記事でわかること
          </h2>
          <ul className="space-y-3">
            {[
              "コラーゲンのタイプ（I型・II型・III型）と効果の違い",
              "分子量（ペプチド・低分子）と吸収率の関係",
              "魚・豚・鶏由来コラーゲンの特徴",
              "目的別（美肌・関節・髪・爪）の最適な選び方",
              "効果を実感するための摂取量と期間",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2
                  size={20}
                  className="shrink-0 mt-0.5"
                  style={{ color: systemColors.pink }}
                />
                <span style={{ color: appleWebColors.textPrimary }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* 結論ファースト */}
        <section
          className="mb-12 rounded-[20px] p-6 md:p-8"
          style={{
            background: `linear-gradient(135deg, ${systemColors.pink}15, ${systemColors.purple}15)`,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: systemColors.pink }}
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
                  <strong>美肌目的なら</strong>
                  →低分子マリンコラーゲンペプチド（I型）5000〜10000mg
                </li>
                <li style={{ color: appleWebColors.textPrimary }}>
                  <strong>関節サポートなら</strong>
                  →非変性II型コラーゲン 40mg
                </li>
                <li style={{ color: appleWebColors.textPrimary }}>
                  <strong>コスパ重視なら</strong>
                  →豚由来コラーゲンペプチド。効果は十分。
                </li>
                <li style={{ color: appleWebColors.textPrimary }}>
                  <strong>必ずビタミンCと一緒に！</strong>
                  コラーゲン合成に必須。
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* コラーゲンの種類比較 */}
        <section className="mb-12">
          <h2
            className={`${typography.title2} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            コラーゲンの種類と選び方
          </h2>
          <p
            className="text-[15px] leading-[1.7] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            「コラーゲン」と一口に言っても、タイプや原料によって効果が異なります。
            目的に合った種類を選ぶことで、効果を最大化できます。
          </p>

          <div className="space-y-4">
            {COLLAGEN_TYPES.map((type) => (
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
                        原料: {type.source}
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

        {/* 目的別おすすめ */}
        <section className="mb-12">
          <h2
            className={`${typography.title2} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            目的別｜あなたに合ったコラーゲンはこれ
          </h2>

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
                          style={{ color: systemColors.pink }}
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
        <section className="mb-12">
          <h2
            className={`${typography.title2} mb-2`}
            style={{ color: appleWebColors.textPrimary }}
          >
            コスパランキングTOP3｜コラーゲンサプリ
          </h2>
          <p
            className="text-[15px] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            1日あたりのコストで比較した、最もお得なコラーゲンサプリメントです。
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
                現在、コラーゲンサプリメントの商品データを準備中です。
              </p>
            </div>
          )}
        </section>

        {/* 選び方チェックリスト */}
        <section className="mb-12">
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
                        ? systemColors.pink
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
                            backgroundColor: systemColors.pink + "20",
                            color: systemColors.pink,
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
        <section className="mb-12">
          <h2
            className={`${typography.title2} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            目的別｜摂取量の目安
          </h2>

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
                      style={{ color: systemColors.pink }}
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
        <section className="mb-12">
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

        {/* FAQ */}
        <section className="mb-12">
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
            コラーゲンと一緒に摂りたい成分
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                name: "ビタミンC",
                slug: "vitamin-c",
                emoji: "🍊",
                reason: "コラーゲン合成に必須。一緒に摂ると効果倍増",
              },
              {
                name: "ヒアルロン酸",
                slug: "hyaluronic-acid",
                emoji: "💧",
                reason: "肌の保水力をサポート",
              },
              {
                name: "ビオチン",
                slug: "biotin",
                emoji: "💇",
                reason: "髪・爪の健康をサポート",
              },
              {
                name: "亜鉛",
                slug: "zinc",
                emoji: "✨",
                reason: "肌のターンオーバーをサポート",
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
            background: `linear-gradient(135deg, ${systemColors.pink}, ${systemColors.purple})`,
          }}
        >
          <h2 className={`${typography.title2} mb-4`}>
            コラーゲンサプリをもっと詳しく比較
          </h2>
          <p className="text-[15px] opacity-90 mb-6">
            Suptiaでは、5つの評価軸で商品を比較できます
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products?q=コラーゲン"
              className="inline-flex items-center justify-center gap-2 bg-white font-bold px-6 py-3 rounded-[12px] transition-colors hover:bg-gray-100"
              style={{ color: systemColors.pink }}
            >
              全商品を見る
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/ingredients/collagen"
              className="inline-flex items-center justify-center gap-2 bg-white/20 font-medium px-6 py-3 rounded-[12px] transition-colors hover:bg-white/30"
            >
              コラーゲン成分ガイド
              <ExternalLink size={16} />
            </Link>
          </div>
        </section>
      </div>

      {/* 構造化データ */}
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
              "@id": "https://suptia.com/articles/collagen-comparison",
            },
          }),
        }}
      />

      {/* FAQ構造化データ */}
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
