/**
 * MCTオイル比較記事ページ - Apple HIG Design
 * 中鎖脂肪酸サプリの形態・原料・品質による比較
 */

import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  Brain,
  Flame,
  Activity,
  Heart,
} from "lucide-react";
import {
  appleWebColors,
  systemColors,
  liquidGlassClasses,
  typography,
} from "@/lib/design-system";
import { getArticleOGImage } from "@/lib/og-image";
import { ArticleEyecatch } from "@/components/articles/ArticleEyecatch";
import { sanity } from "@/lib/sanity.client";

// 商品の型定義
interface MCTProduct {
  _id: string;
  name: string;
  slug: { current: string };
  brand?: string;
  price?: number;
  pricePerDay?: number;
  amazonUrl?: string;
  rakutenUrl?: string;
  yahooUrl?: string;
  iherbUrl?: string;
  ecRating?: number;
  images?: { asset?: { url?: string } }[];
  badges?: string[];
  nutritionFacts?: Record<string, unknown>;
  servingsPerContainer?: number;
  category?: string;
  tags?: string[];
}

// 記事データ
const ARTICLE_DATA = {
  slug: "mct-oil-comparison",
  title:
    "【2025年最新】MCTオイルおすすめ比較｜C8・C10比率とケトン体生成効率で徹底分析",
  description:
    "MCTオイルをC8/C10比率・原料・品質で徹底比較。ケトジェニックダイエット、認知機能、エネルギー補給に最適な選び方を解説。",
  category: "脂肪酸",
  categoryColor: systemColors.green,
  publishedAt: "2025-01-19",
  updatedAt: "2025-01-19",
  readTime: "6分",
  tags: ["MCTオイル", "C8", "C10", "ケトン体", "ダイエット"],
};

export const metadata: Metadata = {
  title: `${ARTICLE_DATA.title} - サプティア`,
  description: ARTICLE_DATA.description,
  keywords: ARTICLE_DATA.tags,
  openGraph: {
    title: ARTICLE_DATA.title,
    description: ARTICLE_DATA.description,
    type: "article",
    publishedTime: ARTICLE_DATA.publishedAt,
    modifiedTime: ARTICLE_DATA.updatedAt,
    url: `https://suptia.com/articles/${ARTICLE_DATA.slug}`,
    images: [
      {
        url: `https://suptia.com${getArticleOGImage(ARTICLE_DATA.slug)}`,
        width: 1200,
        height: 630,
        alt: ARTICLE_DATA.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ARTICLE_DATA.title,
    description: ARTICLE_DATA.description,
  },
  alternates: {
    canonical: `https://suptia.com/articles/${ARTICLE_DATA.slug}`,
  },
};

// MCTオイル関連商品を取得するクエリ
const MCT_PRODUCTS_QUERY = `*[_type == "product" && (
  name match "*MCT*" ||
  name match "*中鎖脂肪酸*" ||
  tags[]->name match "*MCT*"
)] | order(ecRating desc)[0...6] {
  _id,
  name,
  slug,
  brand,
  price,
  pricePerDay,
  amazonUrl,
  rakutenUrl,
  yahooUrl,
  iherbUrl,
  ecRating,
  images,
  badges,
  nutritionFacts,
  servingsPerContainer,
  "category": category->name,
  "tags": tags[]->name
}`;

// MCTオイルの形態比較データ
const MCT_TYPES = [
  {
    name: "C8（カプリル酸）100%",
    description: "最もケトン体生成効率が高い純粋C8",
    absorption: 98,
    ketonePower: 100,
    color: systemColors.green,
    pros: ["最速のケトン体生成", "エネルギー効率最高", "消化吸収が最も速い"],
    cons: ["価格が最も高い", "単独では栄養バランスに欠ける"],
    bestFor: "ケトジェニック上級者・認知機能重視",
  },
  {
    name: "C8/C10ブレンド",
    description: "C8とC10を最適比率で配合（通常60:40）",
    absorption: 92,
    ketonePower: 85,
    color: systemColors.blue,
    pros: [
      "バランスの良いケトン体生成",
      "コスパが良い",
      "持続的なエネルギー供給",
    ],
    cons: ["C8単体よりケトン体生成は劣る"],
    bestFor: "ケトジェニック初心者・日常使い",
  },
  {
    name: "C10（カプリン酸）リッチ",
    description: "C10を多く含む配合",
    absorption: 88,
    ketonePower: 70,
    color: systemColors.cyan,
    pros: ["価格が手頃", "抗菌・抗真菌作用", "脳への効果（てんかん研究あり）"],
    cons: ["ケトン体生成はC8に劣る", "消化に時間がかかる"],
    bestFor: "コスパ重視・抗菌効果期待",
  },
  {
    name: "ココナッツ由来MCT",
    description: "ココナッツオイルからC8/C10を抽出",
    absorption: 90,
    ketonePower: 75,
    color: systemColors.orange,
    pros: ["天然由来で安心感", "環境負荷が比較的少ない", "品質が安定"],
    cons: ["パーム由来より高価な場合あり"],
    bestFor: "天然志向・品質重視",
  },
  {
    name: "パーム由来MCT",
    description: "パームカーネルオイルから抽出",
    absorption: 90,
    ketonePower: 75,
    color: "#6B7280",
    pros: ["大量生産でコストが低い", "安定供給"],
    cons: ["環境問題への懸念", "品質のばらつき"],
    bestFor: "コスパ最優先",
  },
  {
    name: "MCTパウダー",
    description: "粉末化されたMCT（アカシア繊維等でコーティング）",
    absorption: 80,
    ketonePower: 65,
    color: systemColors.purple,
    pros: [
      "持ち運びに便利",
      "料理に混ぜやすい",
      "消化器への刺激が少ない",
      "食物繊維も摂取可能",
    ],
    cons: ["オイルより含有量が少ない", "添加物が含まれる場合あり"],
    bestFor: "外出時・消化器が敏感な方",
  },
];

// 目的別おすすめ
const PURPOSE_RECOMMENDATIONS = [
  {
    icon: Brain,
    purpose: "認知機能・集中力向上",
    description: "脳のエネルギー源としてケトン体を活用",
    recommended: "C8（カプリル酸）100%",
    reason:
      "C8は最も速くケトン体に変換され、脳に効率的にエネルギーを供給。朝食時や仕事前の摂取が効果的。",
    dosage: "朝15ml（約105kcal）",
  },
  {
    icon: Flame,
    purpose: "ケトジェニックダイエット",
    description: "糖質制限と組み合わせて脂肪燃焼を促進",
    recommended: "C8/C10ブレンド（60:40）",
    reason:
      "ケトン体生成と持続的エネルギー供給のバランスが良い。コーヒーに入れるバターコーヒーが人気。",
    dosage: "1日15-30ml（2-3回に分けて）",
  },
  {
    icon: Zap,
    purpose: "運動前のエネルギー補給",
    description: "持久系スポーツ・筋トレ前のエネルギー源",
    recommended: "C8/C10ブレンド",
    reason:
      "糖質とは異なる経路でエネルギーを生成。グリコーゲンを温存しながら持久力をサポート。",
    dosage: "運動30-60分前に10-15ml",
  },
  {
    icon: Activity,
    purpose: "消化器への負担を抑えたい",
    description: "MCT初心者・お腹が弱い方",
    recommended: "MCTパウダー",
    reason:
      "パウダー化により消化器への刺激が緩和。食物繊維との組み合わせで腸内環境にも配慮。",
    dosage: "5gから始めて徐々に増量",
  },
  {
    icon: Heart,
    purpose: "環境・品質を重視",
    description: "サステナブルで高品質なMCTを選びたい",
    recommended: "ココナッツ由来・認証取得品",
    reason:
      "RSPO認証や有機認証のココナッツ由来MCTは環境負荷が少なく、品質も安定している。",
    dosage: "用途に応じて調整",
  },
];

// 選び方チェックリスト
const SELECTION_CHECKLIST = [
  {
    title: "C8/C10比率を確認",
    description:
      "ケトン体生成効率重視ならC8比率高め、コスパ重視ならC8/C10ブレンドを選択",
  },
  {
    title: "原料の由来を確認",
    description:
      "ココナッツ由来かパーム由来か。環境配慮・品質安定性ならココナッツ由来が安心",
  },
  {
    title: "添加物の有無",
    description: "純粋なMCTオイルは添加物不要。パウダーは乳化剤等の成分を確認",
  },
  {
    title: "容器の品質",
    description:
      "遮光瓶か、プラスチックか。酸化防止のため遮光性・密閉性の高い容器が望ましい",
  },
  {
    title: "第三者機関のテスト",
    description:
      "重金属・残留溶媒・微生物検査済みかどうか。GMP認証工場製造だと安心",
  },
  {
    title: "コスパの計算",
    description:
      "100mlあたりの価格とC8含有量で比較。純度の高いC8は高価だがケトン効率も高い",
  },
];

// 摂取量ガイド
const DOSAGE_GUIDE = {
  beginner: {
    label: "初心者（導入期）",
    daily: "5-10ml/日",
    notes:
      "最初の1-2週間は少量から開始。消化器系の不調（お腹のゆるみ）が起きやすいため、朝食と一緒に5mlから始める",
  },
  intermediate: {
    label: "中級者（適応期）",
    daily: "15-30ml/日",
    notes:
      "体が慣れてきたら徐々に増量。2-3回に分けて摂取することで消化器への負担を軽減",
  },
  advanced: {
    label: "上級者（ケトジェニック）",
    daily: "30-45ml/日",
    notes:
      "厳格な糖質制限と併用。ケトン体濃度をモニタリングしながら調整。過剰摂取は逆効果の場合も",
  },
};

// 注意点
const CAUTIONS = [
  {
    type: "warning",
    title: "消化器系の副作用",
    content:
      "MCTは急速に消化されるため、初期は下痢・胃もたれ・腹痛が起きやすい。少量から開始し、食事と一緒に摂取することで軽減できる。",
  },
  {
    type: "warning",
    title: "カロリー過剰に注意",
    content:
      "MCTオイルは1mlあたり約7kcal。30mlで約210kcal。ダイエット目的の場合、他の脂質と置き換えるのが基本。追加摂取はカロリー過剰に。",
  },
  {
    type: "info",
    title: "加熱調理には不向き",
    content:
      "MCTオイルの発煙点は約160℃と低く、高温調理には適さない。サラダ・スムージー・コーヒーなど非加熱での使用が推奨。",
  },
  {
    type: "warning",
    title: "糖尿病・肝疾患の方",
    content:
      "ケトン体が過剰に生成されるリスクがある。特に1型糖尿病の方はケトアシドーシスの危険があるため、医師に相談必須。",
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
];

export default async function MCTOilComparisonPage() {
  // Sanityから商品データを取得
  let products: MCTProduct[] = [];
  try {
    products = await sanity.fetch(MCT_PRODUCTS_QUERY);
  } catch (error) {
    console.error("Failed to fetch MCT products:", error);
  }

  // コスパ計算を追加
  const productsWithCost = products.map((product) => {
    let costPerDay = 0;
    if (product.pricePerDay) {
      costPerDay = product.pricePerDay;
    } else if (product.price && product.servingsPerContainer) {
      costPerDay = product.price / product.servingsPerContainer;
    }
    return {
      ...product,
      costPerDay,
    };
  });

  // JSON-LD構造化データ
  const jsonLd = {
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
      "@id": `https://suptia.com/articles/${ARTICLE_DATA.slug}`,
    },
    image: `https://suptia.com${getArticleOGImage(ARTICLE_DATA.slug)}`,
  };

  const faqJsonLd = {
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
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main
        className="min-h-screen"
        style={{
          backgroundColor: appleWebColors.pageBackground,
        }}
      >
        {/* ヘッダー */}
        <header className="pt-8 pb-6 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-[15px] mb-6 transition-opacity hover:opacity-70"
              style={{ color: systemColors.blue }}
            >
              <ArrowLeft size={16} />
              記事一覧に戻る
            </Link>

            {/* アイキャッチ画像 */}
            <div className="mb-6 rounded-[16px] overflow-hidden">
              <ArticleEyecatch
                src={getArticleOGImage(ARTICLE_DATA.slug)}
                alt={ARTICLE_DATA.title}
              />
            </div>

            <div className="flex items-center gap-3 mb-4">
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
                className="flex items-center gap-1 text-[12px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                <Clock size={12} />
                {ARTICLE_DATA.readTime}で読める
              </span>
              <span
                className="text-[12px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                更新: {ARTICLE_DATA.updatedAt}
              </span>
            </div>

            <h1
              className="text-[28px] md:text-[36px] font-bold leading-[1.2] tracking-[-0.02em] mb-4"
              style={{ color: appleWebColors.textPrimary }}
            >
              {ARTICLE_DATA.title}
            </h1>

            <p
              className="text-[17px] leading-[1.6]"
              style={{ color: appleWebColors.textSecondary }}
            >
              {ARTICLE_DATA.description}
            </p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
          {/* 導入セクション */}
          <section className="mb-12">
            <div
              className={`${liquidGlassClasses.light} rounded-[16px] p-6 border`}
              style={{ borderColor: appleWebColors.borderSubtle }}
            >
              <h2 className={`${typography.headline} mb-4`}>
                MCTオイルとは？なぜ注目されている？
              </h2>
              <div
                className="space-y-3 text-[15px] leading-[1.7]"
                style={{ color: appleWebColors.textSecondary }}
              >
                <p>
                  <strong style={{ color: appleWebColors.textPrimary }}>
                    MCT（中鎖脂肪酸）
                  </strong>
                  は、炭素数6-12の脂肪酸の総称です。一般的な油脂（長鎖脂肪酸）と異なり、
                  <strong style={{ color: appleWebColors.textPrimary }}>
                    肝臓で直接代謝されてケトン体
                  </strong>
                  に変換されるため、素早くエネルギーとして利用できます。
                </p>
                <p>
                  特に
                  <strong style={{ color: appleWebColors.textPrimary }}>
                    C8（カプリル酸）
                  </strong>
                  と
                  <strong style={{ color: appleWebColors.textPrimary }}>
                    C10（カプリン酸）
                  </strong>
                  がケトン体生成効率が高く、MCTオイルの主成分として使用されています。
                </p>
                <p>
                  ケトジェニックダイエット、認知機能サポート、持久系スポーツなど様々な目的で活用されていますが、
                  製品によってC8/C10比率や原料が異なるため、目的に合った選択が重要です。
                </p>
              </div>
            </div>
          </section>

          {/* MCTオイルの形態比較 */}
          <section className="mb-12">
            <h2 className={`${typography.title2} mb-6`}>
              MCTオイルの形態・原料比較
            </h2>

            <div className="grid gap-4">
              {MCT_TYPES.map((type) => (
                <div
                  key={type.name}
                  className={`${liquidGlassClasses.light} rounded-[16px] p-5 border`}
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3
                        className="text-[17px] font-semibold mb-1"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {type.name}
                      </h3>
                      <p
                        className="text-[14px]"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        {type.description}
                      </p>
                    </div>
                    <div
                      className="px-3 py-1 rounded-full text-[12px] font-medium"
                      style={{
                        backgroundColor: type.color + "15",
                        color: type.color,
                      }}
                    >
                      {type.bestFor}
                    </div>
                  </div>

                  {/* ケトン体生成効率バー */}
                  <div className="mb-4">
                    <div className="flex justify-between text-[12px] mb-1">
                      <span style={{ color: appleWebColors.textSecondary }}>
                        ケトン体生成効率
                      </span>
                      <span style={{ color: type.color }}>
                        {type.ketonePower}%
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{
                        backgroundColor: appleWebColors.sectionBackground,
                      }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${type.ketonePower}%`,
                          backgroundColor: type.color,
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p
                        className="text-[12px] font-medium mb-2"
                        style={{ color: systemColors.green }}
                      >
                        メリット
                      </p>
                      <ul className="space-y-1">
                        {type.pros.map((pro, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-[13px]"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <CheckCircle
                              size={14}
                              className="mt-0.5 flex-shrink-0"
                              style={{ color: systemColors.green }}
                            />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p
                        className="text-[12px] font-medium mb-2"
                        style={{ color: systemColors.orange }}
                      >
                        デメリット
                      </p>
                      <ul className="space-y-1">
                        {type.cons.map((con, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-[13px]"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <AlertTriangle
                              size={14}
                              className="mt-0.5 flex-shrink-0"
                              style={{ color: systemColors.orange }}
                            />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 目的別おすすめ */}
          <section className="mb-12">
            <h2 className={`${typography.title2} mb-6`}>
              目的別おすすめMCTオイル
            </h2>

            <div className="grid gap-4">
              {PURPOSE_RECOMMENDATIONS.map((rec) => {
                const IconComponent = rec.icon;
                return (
                  <div
                    key={rec.purpose}
                    className={`${liquidGlassClasses.light} rounded-[16px] p-5 border`}
                    style={{ borderColor: appleWebColors.borderSubtle }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: systemColors.green + "15" }}
                      >
                        <IconComponent
                          size={24}
                          style={{ color: systemColors.green }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3
                          className="text-[17px] font-semibold mb-1"
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
                          className="inline-block px-3 py-1 rounded-full text-[13px] font-medium mb-2"
                          style={{
                            backgroundColor: systemColors.green + "15",
                            color: systemColors.green,
                          }}
                        >
                          おすすめ: {rec.recommended}
                        </div>
                        <p
                          className="text-[14px] leading-[1.6] mb-2"
                          style={{ color: appleWebColors.textSecondary }}
                        >
                          {rec.reason}
                        </p>
                        <p
                          className="text-[13px]"
                          style={{ color: appleWebColors.textTertiary }}
                        >
                          推奨摂取量: {rec.dosage}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 選び方チェックリスト */}
          <section className="mb-12">
            <h2 className={`${typography.title2} mb-6`}>
              MCTオイル選びのチェックリスト
            </h2>

            <div
              className={`${liquidGlassClasses.light} rounded-[16px] p-6 border`}
              style={{ borderColor: appleWebColors.borderSubtle }}
            >
              <div className="space-y-4">
                {SELECTION_CHECKLIST.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[13px] font-semibold"
                      style={{
                        backgroundColor: systemColors.green + "15",
                        color: systemColors.green,
                      }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h4
                        className="text-[15px] font-medium mb-1"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {item.title}
                      </h4>
                      <p
                        className="text-[14px]"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 摂取量ガイド */}
          <section className="mb-12">
            <h2 className={`${typography.title2} mb-6`}>
              MCTオイル摂取量の目安
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(DOSAGE_GUIDE).map(([key, guide]) => (
                <div
                  key={key}
                  className={`${liquidGlassClasses.light} rounded-[16px] p-5 border`}
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  <h3
                    className="text-[15px] font-semibold mb-2"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    {guide.label}
                  </h3>
                  <p
                    className="text-[24px] font-bold mb-3"
                    style={{ color: systemColors.green }}
                  >
                    {guide.daily}
                  </p>
                  <p
                    className="text-[13px] leading-[1.6]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    {guide.notes}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 関連商品 */}
          {productsWithCost.length > 0 && (
            <section className="mb-12">
              <h2 className={`${typography.title2} mb-6`}>MCTオイル関連商品</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productsWithCost.slice(0, 6).map((product) => (
                  <Link
                    key={product._id}
                    href={`/products/${product.slug.current}`}
                    className={`${liquidGlassClasses.light} rounded-[16px] p-4 border transition-all hover:shadow-lg hover:-translate-y-0.5`}
                    style={{ borderColor: appleWebColors.borderSubtle }}
                  >
                    <h3
                      className="font-bold text-[14px] mb-2 line-clamp-2"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {product.name}
                    </h3>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px]">
                      {product.price && (
                        <span style={{ color: appleWebColors.textSecondary }}>
                          ¥{product.price.toLocaleString()}
                        </span>
                      )}
                      {product.costPerDay > 0 && (
                        <span style={{ color: systemColors.green }}>
                          1日¥{product.costPerDay.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link
                  href="/search?q=MCT"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[14px] font-medium transition-opacity hover:opacity-80"
                  style={{
                    backgroundColor: systemColors.green + "15",
                    color: systemColors.green,
                  }}
                >
                  MCTオイル商品をもっと見る
                </Link>
              </div>
            </section>
          )}

          {/* 注意点 */}
          <section className="mb-12">
            <h2 className={`${typography.title2} mb-6`}>MCTオイルの注意点</h2>

            <div className="space-y-4">
              {CAUTIONS.map((caution, index) => (
                <div
                  key={index}
                  className={`${liquidGlassClasses.light} rounded-[16px] p-5 border`}
                  style={{
                    borderColor:
                      caution.type === "warning"
                        ? systemColors.orange + "30"
                        : systemColors.blue + "30",
                  }}
                >
                  <div className="flex items-start gap-3">
                    {caution.type === "warning" ? (
                      <AlertTriangle
                        size={20}
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: systemColors.orange }}
                      />
                    ) : (
                      <Info
                        size={20}
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: systemColors.blue }}
                      />
                    )}
                    <div>
                      <h4
                        className="text-[15px] font-medium mb-1"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {caution.title}
                      </h4>
                      <p
                        className="text-[14px] leading-[1.6]"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        {caution.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className={`${typography.title2} mb-6`}>
              MCTオイルに関するよくある質問
            </h2>

            <div className="space-y-4">
              {FAQS.map((faq, index) => (
                <div
                  key={index}
                  className={`${liquidGlassClasses.light} rounded-[16px] p-5 border`}
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  <h3
                    className="text-[16px] font-semibold mb-3"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    Q. {faq.question}
                  </h3>
                  <p
                    className="text-[14px] leading-[1.7]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    A. {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* まとめ */}
          <section className="mb-12">
            <div
              className={`${liquidGlassClasses.light} rounded-[16px] p-6 border`}
              style={{
                borderColor: systemColors.green + "30",
                backgroundColor: systemColors.green + "08",
              }}
            >
              <h2 className={`${typography.title2} mb-4`}>まとめ</h2>
              <div
                className="space-y-3 text-[15px] leading-[1.7]"
                style={{ color: appleWebColors.textSecondary }}
              >
                <p>
                  MCTオイル選びで最も重要なのは
                  <strong style={{ color: appleWebColors.textPrimary }}>
                    C8/C10比率と使用目的のマッチング
                  </strong>
                  です。ケトン体生成効率を最優先するならC8（カプリル酸）100%、
                  コスパと効果のバランスを取るならC8/C10ブレンドがおすすめです。
                </p>
                <p>
                  初めてMCTオイルを試す方は、
                  <strong style={{ color: appleWebColors.textPrimary }}>
                    少量（5ml）から開始
                  </strong>
                  し、消化器系の反応を確認しながら徐々に増量してください。
                  パウダータイプは消化器への刺激が少なく、初心者にも適しています。
                </p>
                <p>
                  環境配慮を重視する場合は、ココナッツ由来でRSPO認証を取得した製品を選ぶとよいでしょう。
                  サプティアでは、成分量・コスパ・品質を総合的に評価したMCTオイル製品を掲載しています。
                </p>
              </div>
            </div>
          </section>

          {/* 関連記事リンク */}
          <section>
            <h2 className={`${typography.title2} mb-6`}>関連記事</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/articles/omega3-comparison"
                className={`${liquidGlassClasses.light} rounded-[16px] p-5 border transition-all hover:shadow-lg hover:-translate-y-1`}
                style={{ borderColor: appleWebColors.borderSubtle }}
              >
                <span
                  className="text-[12px] font-medium"
                  style={{ color: systemColors.cyan }}
                >
                  脂肪酸
                </span>
                <h3
                  className="text-[15px] font-semibold mt-1"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  オメガ3（フィッシュオイル）比較
                </h3>
              </Link>
              <Link
                href="/articles/creatine-comparison"
                className={`${liquidGlassClasses.light} rounded-[16px] p-5 border transition-all hover:shadow-lg hover:-translate-y-1`}
                style={{ borderColor: appleWebColors.borderSubtle }}
              >
                <span
                  className="text-[12px] font-medium"
                  style={{ color: systemColors.red }}
                >
                  スポーツ
                </span>
                <h3
                  className="text-[15px] font-semibold mt-1"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  クレアチン比較
                </h3>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
