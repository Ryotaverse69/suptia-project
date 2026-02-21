/**
 * マグネシウム比較記事ページ
 * SEO最適化された比較コンテンツ
 * 統一テンプレート v2.0 - 15セクション構成
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
  Moon,
  Activity,
  FlaskConical,
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
    "【2026年最新】マグネシウムサプリおすすめ比較｜形態別の吸収率で徹底分析",
  description:
    "マグネシウムサプリを形態（グリシン酸・クエン酸・酸化物）別に比較。吸収率・目的別の選び方・副作用を解説。",
  publishedAt: "2025-01-19",
  updatedAt: new Date().toISOString().split("T")[0],
  ingredientName: "マグネシウム",
  ingredientSlug: "magnesium",
};

const ogImageUrl = getArticleOGImage("magnesium-comparison");
const ogImage = generateOGImageMeta(
  ogImageUrl,
  "マグネシウム比較 - サプティア",
);

export const metadata: Metadata = {
  title: ARTICLE_DATA.title,
  description: ARTICLE_DATA.description,
  keywords: [
    "マグネシウム",
    "サプリメント",
    "比較",
    "グリシン酸",
    "クエン酸",
    "酸化マグネシウム",
    "吸収率",
    "睡眠",
    "筋肉",
    "2026",
  ],
  openGraph: {
    title: ARTICLE_DATA.title,
    description: ARTICLE_DATA.description,
    type: "article",
    publishedTime: ARTICLE_DATA.publishedAt,
    modifiedTime: ARTICLE_DATA.updatedAt,
    url: "https://suptia.com/articles/magnesium-comparison",
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
    canonical: "https://suptia.com/articles/magnesium-comparison",
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

async function getMagnesiumProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && availability == "in-stock" && references(*[_type == "ingredient" && slug.current == "magnesium"]._id)] | order(priceJPY asc)[0...20]{
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
    console.error("Failed to fetch magnesium products:", error);
    return [];
  }
}

// この記事でわかること
const LEARNING_POINTS = [
  "マグネシウムサプリの形態と吸収率の違い（グリシン酸・クエン酸・酸化物など）",
  "目的別（睡眠・筋肉・認知機能・心臓）の最適な選び方",
  "コスパランキングTOP3と1日あたりのコスト比較",
  "効果的な摂取タイミングと注意すべき副作用",
  "薬との相互作用や腎機能への影響について",
];

// 結論ファースト
const QUICK_RECOMMENDATIONS = [
  {
    condition: "睡眠・リラックス重視なら",
    recommendation:
      "グリシン酸マグネシウム。グリシン自体にもリラックス効果あり。",
  },
  {
    condition: "コスパ重視なら",
    recommendation: "酸化マグネシウム。ただし吸収率は低め。",
  },
  {
    condition: "バランス重視なら",
    recommendation: "クエン酸マグネシウム。吸収率と価格のバランスが良い。",
  },
  {
    condition: "認知機能サポートなら",
    recommendation: "スレオン酸マグネシウム。脳への到達性が高い。",
  },
  {
    condition: "心臓・血圧が気になるなら",
    recommendation: "タウリン酸マグネシウム。タウリンとの相乗効果。",
  },
];

// マグネシウムの形態データ
const MAGNESIUM_TYPES = [
  {
    name: "グリシン酸マグネシウム",
    nameEn: "Magnesium Glycinate",
    absorption: "◎ 高い",
    price: "△ やや高め",
    stomach: "◎ 優しい",
    best: "睡眠・リラックス重視",
    description:
      "アミノ酸グリシンと結合。吸収率が高く、リラックス効果も。就寝前に最適。",
    color: systemColors.purple,
  },
  {
    name: "クエン酸マグネシウム",
    nameEn: "Magnesium Citrate",
    absorption: "◎ 高い",
    price: "○ 中程度",
    stomach: "○ 普通",
    best: "バランス重視・便秘気味の方",
    description: "吸収率が高く、軽い緩下作用あり。便秘気味の方にも適している。",
    color: systemColors.orange,
  },
  {
    name: "酸化マグネシウム",
    nameEn: "Magnesium Oxide",
    absorption: "△ 低い",
    price: "◎ 安い",
    stomach: "△ 下剤作用あり",
    best: "便秘対策・コスパ重視",
    description:
      "マグネシウム含有率は高いが吸収率は低め。便秘薬としても使用される。",
    color: "#6B7280",
  },
  {
    name: "リンゴ酸マグネシウム",
    nameEn: "Magnesium Malate",
    absorption: "○ 良好",
    price: "○ 中程度",
    stomach: "◎ 優しい",
    best: "エネルギー・筋肉疲労",
    description:
      "リンゴ酸はエネルギー産生に関与。筋肉疲労や線維筋痛症の方に人気。",
    color: systemColors.green,
  },
  {
    name: "スレオン酸マグネシウム",
    nameEn: "Magnesium L-Threonate",
    absorption: "◎ 高い（脳へ）",
    price: "× 高い",
    stomach: "◎ 優しい",
    best: "認知機能・脳の健康",
    description:
      "血液脳関門を通過できる唯一の形態。認知機能サポートに注目されている。",
    color: systemColors.indigo,
  },
  {
    name: "タウリン酸マグネシウム",
    nameEn: "Magnesium Taurate",
    absorption: "◎ 高い",
    price: "△ やや高め",
    stomach: "◎ 優しい",
    best: "心臓・血圧が気になる方",
    description:
      "タウリンは心臓の健康に重要。心血管系のサポートを期待する方向け。",
    color: systemColors.red,
  },
];

// 目的別おすすめ
const PURPOSE_RECOMMENDATIONS = [
  {
    purpose: "睡眠・リラックス",
    icon: Moon,
    emoji: "🌙",
    description: "寝つきが悪い、リラックスしたい",
    recommendation: "グリシン酸マグネシウム",
    reason:
      "グリシン自体にもリラックス効果あり。就寝前の摂取で睡眠の質をサポート。",
    tips: "就寝30分〜1時間前に200-400mg。カフェインとの併用は避ける。",
  },
  {
    purpose: "筋肉けいれん・こむら返り",
    icon: Activity,
    emoji: "💪",
    description: "足がつる、筋肉の張りが気になる",
    recommendation: "クエン酸 または リンゴ酸マグネシウム",
    reason: "吸収率が高く、筋肉の正常な機能をサポート。運動後の回復にも。",
    tips: "運動後・就寝前に300-400mg。カリウムやビタミンB6との併用も効果的。",
  },
  {
    purpose: "認知機能・集中力",
    icon: Brain,
    emoji: "🧠",
    description: "記憶力、集中力を維持したい",
    recommendation: "スレオン酸マグネシウム",
    reason: "血液脳関門を通過できる唯一の形態。脳内マグネシウム濃度を高める。",
    tips: "朝または昼に製品指示量。高価だが長期継続で効果を実感。",
  },
  {
    purpose: "心臓・血圧",
    icon: Heart,
    emoji: "❤️",
    description: "心臓の健康、血圧が気になる",
    recommendation: "タウリン酸マグネシウム",
    reason: "タウリンは心臓の健康に重要。心血管系をダブルでサポート。",
    tips: "朝晩2回に分けて300-400mg。降圧薬服用中は医師に相談。",
  },
  {
    purpose: "便秘対策",
    icon: Zap,
    emoji: "💫",
    description: "お通じを改善したい",
    recommendation: "酸化マグネシウム または クエン酸マグネシウム",
    reason: "酸化物は強い緩下作用、クエン酸は穏やかな効果。目的に応じて選択。",
    tips: "夜就寝前に摂取。水分を多めに。効きすぎる場合は量を調整。",
  },
];

// 選び方チェックリスト
const SELECTION_CHECKLIST = [
  {
    item: "マグネシウムの形態を確認",
    description:
      "グリシン酸・クエン酸・酸化物など。目的と吸収率を考慮して選択。",
    important: true,
  },
  {
    item: "元素マグネシウム量をチェック",
    description:
      "化合物全体量ではなく「元素マグネシウム量」を確認。1日300-400mgが目安。",
    important: true,
  },
  {
    item: "胃腸への影響を考慮",
    description:
      "酸化マグネシウムは下剤作用が強い。胃が弱い方はグリシン酸やタウリン酸を。",
    important: true,
  },
  {
    item: "品質認証を確認",
    description:
      "GMP認証、第三者機関テスト済みなど。信頼できるブランドを選択。",
    important: false,
  },
  {
    item: "添加物・カプセルの素材を確認",
    description:
      "不要な添加物や着色料の有無。ベジタリアン対応が必要な場合はカプセルも確認。",
    important: false,
  },
];

// 摂取量ガイド
const DOSAGE_GUIDE = [
  {
    purpose: "一般的な健康維持",
    amount: "200〜300mg/日",
    frequency: "1日1〜2回",
    note: "食事と一緒に。空腹時は避ける",
  },
  {
    purpose: "睡眠サポート",
    amount: "300〜400mg/日",
    frequency: "就寝前1回",
    note: "グリシン酸がおすすめ。30分〜1時間前に",
  },
  {
    purpose: "筋肉けいれん対策",
    amount: "300〜400mg/日",
    frequency: "1日2回に分けて",
    note: "運動後と就寝前。カリウムも一緒に",
  },
  {
    purpose: "便秘対策（酸化物）",
    amount: "250〜500mg/日",
    frequency: "就寝前1回",
    note: "水分を多めに。効きすぎたら減量",
  },
  {
    purpose: "心臓・血圧サポート",
    amount: "300〜400mg/日",
    frequency: "朝晩2回に分けて",
    note: "タウリン酸がおすすめ。薬との併用は医師に相談",
  },
];

// 注意点・副作用
const CAUTIONS = [
  {
    title: "腎機能障害の方は要注意",
    description:
      "腎機能が低下している方はマグネシウムの排泄が困難。高マグネシウム血症のリスクがあるため、必ず医師に相談。",
    severity: "warning",
  },
  {
    title: "下痢・軟便に注意",
    description:
      "特に酸化マグネシウムで起こりやすい。症状が出たら用量を減らすか、吸収率の高い形態に変更を。",
    severity: "warning",
  },
  {
    title: "抗生物質との相互作用",
    description:
      "テトラサイクリン系・キノロン系抗生物質、骨粗鬆症薬の吸収を妨げる可能性。2時間以上間隔をあける。",
    severity: "warning",
  },
  {
    title: "過剰摂取に注意",
    description:
      "サプリメントからは1日350mgを超えないこと（厚生労働省基準）。下痢、吐き気、低血圧の恐れ。",
    severity: "info",
  },
  {
    title: "カルシウムとの同時摂取",
    description:
      "高用量のカルシウムはマグネシウムの吸収を阻害する可能性。時間をずらして摂取が理想的。",
    severity: "info",
  },
];

// FAQ
const FAQS = [
  {
    question: "マグネシウムはいつ飲むのが効果的？",
    answer:
      "目的により異なります。睡眠改善なら就寝30分〜1時間前、筋肉けいれん対策なら運動後や就寝前、一般的な補給なら食事と一緒に。空腹時は胃腸への刺激が強いので避けましょう。分割して摂取すると吸収効率が上がります。",
  },
  {
    question: "酸化マグネシウムと他の形態の違いは？",
    answer:
      "酸化マグネシウムはマグネシウム含有率は高い（60%）ですが、吸収率は4%程度と低いです。便秘対策には有効ですが、マグネシウム補給目的なら吸収率の高いグリシン酸やクエン酸がおすすめです。価格は最も安いので、コスパ重視で下剤作用も気にならない方には選択肢になります。",
  },
  {
    question: "マグネシウムとカルシウムは一緒に摂るべき？",
    answer:
      "以前は2:1の比率が推奨されていましたが、現在は個別に適量を摂ることが重要とされています。高用量のカルシウムはマグネシウムの吸収を阻害する可能性があるため、同時摂取は避け、時間をずらすのが理想的です。",
  },
  {
    question: "マグネシウム不足のサインは？",
    answer:
      "筋肉のけいれん・こむら返り、疲労感、不眠、イライラ、頭痛、食欲不振などが代表的です。日本人の多くはマグネシウム摂取が不足気味と言われています。加工食品中心の食生活、ストレス、アルコール摂取が多い方は特に注意。",
  },
  {
    question: "食事からマグネシウムを摂るには？",
    answer:
      "ナッツ類（アーモンド、カシューナッツ）、緑黄色野菜（ほうれん草）、豆類、全粒穀物、カカオ、海藻類などに豊富です。ただし、加工食品中心の食生活では不足しがちで、精製・加工により失われやすいミネラルです。",
  },
  {
    question: "グリシン酸マグネシウムが睡眠に良い理由は？",
    answer:
      "グリシン酸マグネシウムは、マグネシウム自体のリラックス効果に加え、グリシンというアミノ酸も含まれています。グリシンは体温を下げ、睡眠の質を高める効果が研究で示されています。吸収率も高く、胃腸への負担も少ないため、就寝前の摂取に最適です。",
  },
  {
    question: "スレオン酸マグネシウムは本当に脳に届く？",
    answer:
      "スレオン酸マグネシウム（Magtein）は、MITの研究者が開発した形態で、血液脳関門を通過できることが研究で示されています。脳内のマグネシウム濃度を効率的に高め、認知機能や記憶力をサポートする可能性があります。ただし、他の形態より高価です。",
  },
  {
    question: "マグネシウムサプリはAmazonで購入できますか？",
    answer:
      "はい、Amazonで多数のマグネシウムサプリが販売されています。サプティア（suptia.com）では楽天・Yahoo!・Amazonの価格を一括比較できるため、最安値のショップを簡単に見つけられます。価格は毎日自動更新されており、常に最新の情報を確認できます。",
  },
  {
    question: "マグネシウムサプリで最もコスパが良いのはどれですか？",
    answer:
      "コスパは「1日あたりのコスト（¥/日）」と「成分量あたりの価格（¥/mg）」で評価するのがポイントです。サプティアでは476商品以上のデータベースから、これらの指標を自動計算して比較しています。セール時期（Amazonの新生活セールやプライムデーなど）を活用するとさらにお得に購入できます。",
  },
];

// 関連成分
const RELATED_INGREDIENTS = [
  {
    name: "ビタミンD",
    slug: "vitamin-d",
    emoji: "☀️",
    reason: "マグネシウムの吸収・代謝に必要",
  },
  {
    name: "ビタミンB6",
    slug: "vitamin-b6",
    emoji: "🔶",
    reason: "マグネシウムの細胞内取り込みをサポート",
  },
  {
    name: "カリウム",
    slug: "potassium",
    emoji: "🍌",
    reason: "筋肉の正常な機能に相乗効果",
  },
  {
    name: "亜鉛",
    slug: "zinc",
    emoji: "💪",
    reason: "ZMA配合で睡眠・筋肉をサポート",
  },
];

export default async function MagnesiumComparisonPage() {
  const products = await getMagnesiumProducts();

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

      const mgIngredient = product.ingredients?.find((i) =>
        i.ingredient?.name?.includes("マグネシウム"),
      );
      const mgPerServing = mgIngredient?.amountMgPerServing || 0;
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
      {/* 1. パンくずリスト (sticky) */}
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
              マグネシウム比較
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
                backgroundColor: systemColors.purple + "15",
                color: systemColors.purple,
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
              公開:{" "}
              {new Date(
                ARTICLE_DATA.publishedAt + "T00:00:00",
              ).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <time
              dateTime={ARTICLE_DATA.updatedAt}
              className="font-medium"
              style={{ color: systemColors.green }}
            >
              ✓ 最終更新:{" "}
              {new Date(
                ARTICLE_DATA.updatedAt + "T00:00:00",
              ).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
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
                3. マグネシウムの種類と特徴
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
          className={`${liquidGlassClasses.light} rounded-[20px] p-6 mb-12 border scroll-mt-20`}
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

        {/* 5. 結論ファースト */}
        <section
          id="conclusion"
          className="mb-12 rounded-[20px] p-6 md:p-8 scroll-mt-20"
          style={{
            background: `linear-gradient(135deg, ${systemColors.purple}15, ${systemColors.indigo}15)`,
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
                    <strong>{rec.condition}</strong>
                    <span style={{ color: appleWebColors.textSecondary }}>
                      {" "}
                      → {rec.recommendation}
                    </span>
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
            マグネシウムサプリの種類と選び方
          </h2>
          <p
            className="text-[15px] leading-[1.7] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            マグネシウムは結合している物質によって吸収率や効果が大きく異なります。
            「マグネシウム○○mg配合」と書いてあっても、形態によって実際に体に吸収される量は違います。
          </p>

          <div className="space-y-4">
            {MAGNESIUM_TYPES.map((type) => (
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
                      胃腸: {type.stomach}
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
            目的別｜あなたに合ったマグネシウムはこれ
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
                          style={{ color: systemColors.purple }}
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
        <section id="ranking" className="mb-12 scroll-mt-20">
          <h2
            className={`${typography.title2} mb-2`}
            style={{ color: appleWebColors.textPrimary }}
          >
            コスパランキングTOP3｜マグネシウムサプリ
          </h2>
          <p
            className="text-[15px] mb-6"
            style={{ color: appleWebColors.textSecondary }}
          >
            1日あたりのコストで比較した、最もお得なマグネシウムサプリメントです。
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
                現在、マグネシウムサプリメントの商品データを準備中です。
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/products?ingredient=magnesium"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[15px] font-medium text-white"
              style={{ backgroundColor: systemColors.blue }}
            >
              すべてのマグネシウム製品を見る
              <ArrowRight size={16} />
            </Link>
          </div>
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
            マグネシウムは過剰摂取による副作用もあるため、目的に応じた適切な量を守ることが大切です。
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
            マグネシウムは適量なら安全ですが、過剰摂取や特定の健康状態では注意が必要です。
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
            マグネシウムと一緒に摂りたい成分
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
            background: `linear-gradient(135deg, ${systemColors.purple}, ${systemColors.indigo})`,
          }}
        >
          <h2 className={`${typography.title2} mb-4`}>
            マグネシウムサプリをもっと詳しく比較
          </h2>
          <p className="text-[15px] opacity-90 mb-6">
            サプティアでは、5つの評価軸で商品を比較できます
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products?ingredient=magnesium"
              className="inline-flex items-center justify-center gap-2 bg-white font-bold px-6 py-3 rounded-[12px] transition-colors hover:bg-gray-100"
              style={{ color: systemColors.purple }}
            >
              全商品を見る
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/ingredients/magnesium"
              className="inline-flex items-center justify-center gap-2 bg-white/20 font-medium px-6 py-3 rounded-[12px] transition-colors hover:bg-white/30"
            >
              マグネシウム成分ガイド
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
