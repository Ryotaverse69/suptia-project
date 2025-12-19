/**
 * アシュワガンダ比較記事ページ
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
  Brain,
  Moon,
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
    "【2025年最新】アシュワガンダサプリおすすめ比較｜KSM-66・Sensorilの違い",
  description:
    "アシュワガンダサプリをKSM-66・Sensoril・一般抽出物で徹底比較。ストレス・睡眠・筋力への効果と、ウィザノライド含有量による選び方を解説。",
  publishedAt: "2025-01-19",
  updatedAt: new Date().toISOString().split("T")[0],
  ingredientName: "アシュワガンダ",
  ingredientSlug: "ashwagandha",
};

const ogImageUrl = getArticleOGImage("ashwagandha-comparison");
const ogImage = generateOGImageMeta(
  ogImageUrl,
  "アシュワガンダサプリメント比較 - Suptia",
);

export const metadata: Metadata = {
  title: ARTICLE_DATA.title,
  description: ARTICLE_DATA.description,
  keywords: [
    "アシュワガンダ",
    "サプリメント",
    "おすすめ",
    "比較",
    "2025",
    "KSM-66",
    "Sensoril",
    "ストレス",
    "睡眠",
    "アダプトゲン",
  ],
  openGraph: {
    title: ARTICLE_DATA.title,
    description: ARTICLE_DATA.description,
    type: "article",
    publishedTime: ARTICLE_DATA.publishedAt,
    modifiedTime: ARTICLE_DATA.updatedAt,
    url: "https://suptia.com/articles/ashwagandha-comparison",
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
    canonical: "https://suptia.com/articles/ashwagandha-comparison",
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

async function getAshwagandhaProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && availability == "in-stock" && (
    name match "*アシュワガンダ*" ||
    name match "*Ashwagandha*" ||
    name match "*ashwagandha*"
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
    console.error("Failed to fetch ashwagandha products:", error);
    return [];
  }
}

// アシュワガンダの種類データ
const ASHWAGANDHA_TYPES = [
  {
    name: "KSM-66®",
    nameEn: "KSM-66 Ashwagandha",
    extract: "根のみ抽出",
    withanolides: "5%以上",
    research: "◎ 最多（24以上の臨床試験）",
    best: "ストレス・筋力・男性機能",
    description:
      "根のみから抽出した高品質エキス。最も研究が多く、ストレス軽減・筋力向上・テストステロン増加など多数のエビデンス。",
    color: systemColors.orange,
  },
  {
    name: "Sensoril®",
    nameEn: "Sensoril Ashwagandha",
    extract: "根+葉抽出",
    withanolides: "10%以上",
    research: "○ 多い（複数の臨床試験）",
    best: "睡眠・リラックス・コルチゾール低下",
    description:
      "根と葉から抽出。ウィザノライド含有量が高く、特にコルチゾール低下・睡眠改善に強みを持つ。",
    color: systemColors.purple,
  },
  {
    name: "Shoden®",
    nameEn: "Shoden Ashwagandha",
    extract: "葉主体抽出",
    withanolides: "35%以上",
    research: "○ 新しいが有望",
    best: "超高濃度・少量で効果",
    description:
      "ウィザノライド濃度35%という超高濃度抽出物。少量で高い効果が期待できる最新技術。",
    color: systemColors.cyan,
  },
  {
    name: "一般抽出物",
    nameEn: "Standard Extract",
    extract: "様々",
    withanolides: "1.5〜5%",
    research: "△ 製品による",
    best: "コスパ重視・お試し",
    description:
      "ブランド抽出物でない一般的なアシュワガンダエキス。効果は期待できるが品質のばらつきあり。",
    color: "#6B7280",
  },
  {
    name: "フルスペクトラム（全草）",
    nameEn: "Full Spectrum",
    extract: "全草",
    withanolides: "低め",
    research: "△ 限定的",
    best: "伝統的なアーユルヴェーダ志向",
    description:
      "植物全体を使用した伝統的な形態。アーユルヴェーダに忠実だが、成分濃度は低め。",
    color: systemColors.green,
  },
];

// 目的別おすすめ
const PURPOSE_RECOMMENDATIONS = [
  {
    purpose: "ストレス・不安軽減",
    icon: Brain,
    emoji: "😌",
    description: "仕事のストレス、不安感、イライラを軽減したい",
    recommendation: "KSM-66® 300〜600mg/日 または Sensoril® 125〜250mg/日",
    reason:
      "どちらもコルチゾール（ストレスホルモン）を有意に低下させる臨床データあり。KSM-66は活力も維持したい人向け。",
    tips: "効果を感じるまで4〜8週間。マグネシウムとの併用で相乗効果。",
  },
  {
    purpose: "睡眠の質を改善したい",
    icon: Moon,
    emoji: "😴",
    description: "寝つきが悪い、睡眠が浅い、朝スッキリ起きられない",
    recommendation: "Sensoril® 125〜250mg/日（就寝前）",
    reason:
      "Sensorilは睡眠改善効果に関する研究が特に充実。GABAへの作用で深い睡眠をサポート。",
    tips: "就寝1〜2時間前に摂取。マグネシウム・L-テアニンとの併用も効果的。",
  },
  {
    purpose: "筋力・運動パフォーマンス",
    icon: Shield,
    emoji: "💪",
    description: "筋肉をつけたい、運動後の回復を早めたい",
    recommendation: "KSM-66® 300〜600mg/日",
    reason:
      "KSM-66は筋力・筋肉量増加、VO2max向上、回復促進に関する複数の臨床試験あり。",
    tips: "運動前または就寝前に摂取。プロテインとの併用で効果アップ。",
  },
  {
    purpose: "男性機能・テストステロン",
    icon: Shield,
    emoji: "🔥",
    description: "テストステロンを自然に上げたい、活力を取り戻したい",
    recommendation: "KSM-66® 600mg/日",
    reason:
      "KSM-66は複数の研究でテストステロン増加、精子の質改善が報告されている。",
    tips: "亜鉛・ビタミンDとの併用でさらに効果的。8〜12週間の継続を。",
  },
  {
    purpose: "認知機能・集中力",
    icon: Brain,
    emoji: "🧠",
    description: "集中力を高めたい、記憶力を改善したい",
    recommendation: "KSM-66® 300mg/日 または Shoden® 120mg/日",
    reason:
      "アシュワガンダは脳由来神経栄養因子（BDNF）を増加させる研究あり。認知機能改善効果も報告。",
    tips: "オメガ3・バコパとの併用で認知機能サポートを強化。",
  },
];

// 選び方チェックリスト
const SELECTION_CHECKLIST = [
  {
    item: "抽出物ブランドを確認",
    description:
      "KSM-66®、Sensoril®、Shoden®などの品質保証されたブランド抽出物がおすすめ。一般抽出物は品質にばらつき。",
    important: true,
  },
  {
    item: "ウィザノライド含有量を確認",
    description:
      "アシュワガンダの主要活性成分。KSM-66は5%以上、Sensorilは10%以上、Shodenは35%以上。",
    important: true,
  },
  {
    item: "目的に合った製品を選ぶ",
    description:
      "ストレス・筋力ならKSM-66、睡眠ならSensoril、高濃度希望ならShoden。",
    important: false,
  },
  {
    item: "添加物・品質認証を確認",
    description:
      "GMP認証、第三者検査、オーガニック認証など。信頼できるブランドを選択。",
    important: false,
  },
  {
    item: "用量を確認",
    description:
      "臨床試験で使用された用量（KSM-66: 300〜600mg、Sensoril: 125〜250mg）を参考に。",
    important: false,
  },
];

// 摂取量ガイド
const DOSAGE_GUIDE = [
  {
    purpose: "ストレス軽減（KSM-66）",
    amount: "300〜600mg/日",
    frequency: "1日1〜2回",
    note: "朝と夜、または朝に一度",
  },
  {
    purpose: "睡眠改善（Sensoril）",
    amount: "125〜250mg/日",
    frequency: "就寝1〜2時間前",
    note: "夜のみの摂取でOK",
  },
  {
    purpose: "筋力増強（KSM-66）",
    amount: "300〜600mg/日",
    frequency: "1日1〜2回",
    note: "運動日は運動前にも摂取",
  },
  {
    purpose: "高濃度（Shoden）",
    amount: "60〜120mg/日",
    frequency: "1日1回",
    note: "少量で高い効果。初めての方は少量から",
  },
  {
    purpose: "一般的な健康維持",
    amount: "300〜500mg/日",
    frequency: "1日1回",
    note: "継続が大切。4〜8週間で効果実感",
  },
];

// 注意点・副作用
const CAUTIONS = [
  {
    title: "甲状腺への影響",
    description:
      "アシュワガンダは甲状腺ホルモンを増加させる可能性。甲状腺機能亢進症の方、甲状腺薬を服用中の方は医師に相談を。",
    severity: "warning",
  },
  {
    title: "妊娠・授乳中は避ける",
    description:
      "伝統的に流産誘発作用があるとされ、安全性データが不十分。妊娠中・授乳中・妊娠希望の方は使用を避ける。",
    severity: "warning",
  },
  {
    title: "自己免疫疾患の方は注意",
    description:
      "免疫を活性化する作用があり、関節リウマチ、ループス、多発性硬化症などの方は医師に相談。",
    severity: "warning",
  },
  {
    title: "眠気が出ることも",
    description:
      "特に高用量やSensorilでは眠気が出ることがある。車の運転前は注意。日中の摂取量を調整。",
    severity: "info",
  },
  {
    title: "胃腸障害の可能性",
    description:
      "空腹時に摂取すると胃のむかつきを感じる人も。食後に摂取すると軽減される。",
    severity: "info",
  },
];

// FAQ
const FAQS = [
  {
    question: "KSM-66とSensorilの違いは？どちらを選ぶべき？",
    answer:
      "KSM-66は根のみから抽出、Sensorilは根と葉から抽出という違いがあります。KSM-66はストレス軽減に加え、筋力向上・テストステロン増加・認知機能改善など幅広い研究があり、活力を維持したい方向け。Sensorilはウィザノライド濃度が高く、特に睡眠改善・コルチゾール低下に強みがあり、リラックス・睡眠重視の方向けです。目的に合わせて選びましょう。",
  },
  {
    question: "アシュワガンダはいつ飲むのが効果的？",
    answer:
      "目的によって異なります。ストレス対策なら朝または朝夜2回に分けて。睡眠改善なら就寝1〜2時間前に摂取するのが効果的です。筋力目的なら運動前または就寝前が推奨されます。空腹時は胃が荒れやすいので、食後の摂取がおすすめです。一貫した時間に摂取することで、体内リズムに合わせた効果が期待できます。",
  },
  {
    question: "アシュワガンダの効果はどのくらいで感じますか？",
    answer:
      "ストレス軽減効果は早い人で2週間、一般的には4〜8週間で実感し始めます。睡眠改善は比較的早く、1〜2週間で変化を感じる人も。筋力・体組成の変化は8〜12週間の継続が必要です。テストステロンへの効果も8週間以上の継続で報告されています。即効性はないので、最低1〜2ヶ月は継続して評価してください。",
  },
  {
    question: "アシュワガンダは毎日飲んでも大丈夫？",
    answer:
      "はい、毎日の摂取が推奨されます。臨床試験でも8〜12週間の連続摂取で安全性が確認されています。ただし、長期間（1年以上）の連続摂取については、2〜3ヶ月摂取したら1ヶ月休むという「サイクル」を推奨する専門家もいます。これはアダプトゲン全般に言えることで、体の適応を維持するためです。",
  },
  {
    question: "アシュワガンダは女性でも効果がありますか？",
    answer:
      "はい、女性にも効果があります。ストレス軽減、睡眠改善、不安軽減の効果は男女共通です。また、女性特有の研究として、性機能改善、更年期症状の軽減なども報告されています。ただし、妊娠中・授乳中・妊娠希望の方は使用を避けてください。月経周期に影響する可能性があるという報告もあるため、気になる方は医師に相談を。",
  },
  {
    question: "アシュワガンダと一緒に摂ると良い成分は？",
    answer:
      "【マグネシウム】ストレス対策・睡眠改善に相乗効果。【L-テアニン】リラックス効果を高め、睡眠の質を向上。【ロディオラ】アダプトゲン同士で相乗効果。疲労対策に。【亜鉛・ビタミンD】テストステロン増加目的なら併用推奨。【バコパ】認知機能・記憶力目的なら相性が良い。目的に応じて組み合わせると効果的です。",
  },
  {
    question: "アシュワガンダはカフェインと一緒に飲んでも良い？",
    answer:
      "一緒に摂取しても基本的に問題ありませんが、アシュワガンダはリラックス・ストレス軽減効果があるのに対し、カフェインは覚醒・興奮作用があるため、効果が相殺される可能性があります。朝はカフェイン、夜はアシュワガンダと分けて摂取するのが理想的です。睡眠目的でアシュワガンダを摂る場合は、午後のカフェイン摂取を控えましょう。",
  },
];

export default async function AshwagandhaComparisonPage() {
  const products = await getAshwagandhaProducts();

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
              アシュワガンダ比較
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
                backgroundColor: systemColors.green + "15",
                color: systemColors.green,
              }}
            >
              アダプトゲン
            </span>
            <span
              className="px-3 py-1 text-[12px] font-medium rounded-full"
              style={{
                backgroundColor: systemColors.orange + "15",
                color: systemColors.orange,
              }}
            >
              トレンド成分
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
          style={{ borderColor: systemColors.orange + "30" }}
        >
          <h2
            className={`${typography.title3} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            この記事でわかること
          </h2>
          <ul className="space-y-3">
            {[
              "KSM-66・Sensoril・Shodenなど抽出物ブランドの違い",
              "ウィザノライド含有量と効果の関係",
              "目的別（ストレス・睡眠・筋力・男性機能）の選び方",
              "効果を感じるまでの期間と適切な摂取量",
              "甲状腺への影響など注意すべきポイント",
            ].map((item, i) => (
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

        {/* 結論ファースト */}
        <section
          className="mb-12 rounded-[20px] p-6 md:p-8"
          style={{
            background: `linear-gradient(135deg, ${systemColors.orange}15, ${systemColors.green}15)`,
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
                <li style={{ color: appleWebColors.textPrimary }}>
                  <strong>ストレス・筋力・活力なら</strong>
                  →KSM-66® 300〜600mg。最も研究が多い。
                </li>
                <li style={{ color: appleWebColors.textPrimary }}>
                  <strong>睡眠改善・リラックスなら</strong>
                  →Sensoril® 125〜250mg。就寝前に。
                </li>
                <li style={{ color: appleWebColors.textPrimary }}>
                  <strong>高濃度で少量希望なら</strong>
                  →Shoden® 60〜120mg。最新の高濃度抽出。
                </li>
                <li style={{ color: appleWebColors.textPrimary }}>
                  <strong>甲状腺に問題がある方</strong>
                  →使用前に医師に相談を。
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* アシュワガンダの種類比較 */}
        <section className="mb-12">
          <h2
            className={`${typography.title2} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            アシュワガンダサプリの種類と選び方
          </h2>
          <p
            className="text-[15px] leading-[1.7] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            アシュワガンダは抽出方法やブランドによって効果が異なります。
            品質が保証されたブランド抽出物を選ぶことで、確実な効果が期待できます。
          </p>

          <div className="space-y-4">
            {ASHWAGANDHA_TYPES.map((type) => (
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
                      抽出: {type.extract}
                    </span>
                    <span
                      className="text-[13px] px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: appleWebColors.sectionBackground,
                        color: appleWebColors.textSecondary,
                      }}
                    >
                      ウィザノライド: {type.withanolides}
                    </span>
                    <span
                      className="text-[13px] px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: appleWebColors.sectionBackground,
                        color: appleWebColors.textSecondary,
                      }}
                    >
                      研究: {type.research}
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
        <section className="mb-12">
          <h2
            className={`${typography.title2} mb-4`}
            style={{ color: appleWebColors.textPrimary }}
          >
            目的別｜あなたに合ったアシュワガンダはこれ
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

        {/* コスパランキング */}
        <section className="mb-12">
          <h2
            className={`${typography.title2} mb-2`}
            style={{ color: appleWebColors.textPrimary }}
          >
            コスパランキングTOP3｜アシュワガンダサプリ
          </h2>
          <p
            className="text-[15px] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            1日あたりのコストで比較した、最もお得なアシュワガンダサプリメントです。
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
                現在、アシュワガンダサプリメントの商品データを準備中です。
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
            アシュワガンダと一緒に摂りたい成分
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                name: "マグネシウム",
                slug: "magnesium",
                emoji: "💫",
                reason: "ストレス・睡眠改善に相乗効果",
              },
              {
                name: "L-テアニン",
                slug: "l-theanine",
                emoji: "🍵",
                reason: "リラックス効果を高める",
              },
              {
                name: "ロディオラ",
                slug: "rhodiola",
                emoji: "🌿",
                reason: "アダプトゲン同士で疲労対策",
              },
              {
                name: "亜鉛",
                slug: "zinc",
                emoji: "🛡️",
                reason: "テストステロンサポートに相乗効果",
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
            background: `linear-gradient(135deg, ${systemColors.orange}, ${systemColors.green})`,
          }}
        >
          <h2 className={`${typography.title2} mb-4`}>
            アシュワガンダサプリをもっと詳しく比較
          </h2>
          <p className="text-[15px] opacity-90 mb-6">
            Suptiaでは、5つの評価軸で商品を比較できます
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products?q=アシュワガンダ"
              className="inline-flex items-center justify-center gap-2 bg-white font-bold px-6 py-3 rounded-[12px] transition-colors hover:bg-gray-100"
              style={{ color: systemColors.orange }}
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
              "@id": "https://suptia.com/articles/ashwagandha-comparison",
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
