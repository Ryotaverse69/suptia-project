import { Metadata } from "next";
import Link from "next/link";
import {
  Pill,
  Droplets,
  FlaskConical,
  Candy,
  Package,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Zap,
  Shield,
  Beaker,
  ChevronRight,
  Info,
  CircleDot,
  Sparkles,
  Layers,
  TrendingUp,
  Wallet,
  Briefcase,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

export const metadata: Metadata = {
  title:
    "サプリメント形状ガイド | カプセル・錠剤・粉末の違いを徹底比較 | サプティア",
  description:
    "ハードカプセル、ソフトジェル、錠剤、粉末、液体、グミなどサプリメントの形状別にメリット・デメリット、添加物、吸収率を科学的根拠に基づいて解説。あなたに最適な形状を見つけましょう。",
  keywords: [
    "サプリメント形状",
    "カプセル",
    "ソフトジェル",
    "錠剤",
    "タブレット",
    "粉末サプリ",
    "液体サプリ",
    "グミサプリ",
    "吸収率",
    "バイオアベイラビリティ",
  ],
  openGraph: {
    title: "サプリメント形状ガイド | サプティア",
    description:
      "カプセル・錠剤・粉末など形状別にメリット・デメリット、吸収率を比較",
    type: "website",
  },
  alternates: {
    canonical: "https://suptia.com/guide/supplement-forms",
  },
};

// アイコンマッピング
const formIcons: Record<string, LucideIcon> = {
  "hard-capsule": Pill,
  softgel: CircleDot,
  tablet: Layers,
  powder: Sparkles,
  liquid: Droplets,
  gummy: Candy,
  sublingual: Zap,
};

// サプリメント形状データ
const supplementForms = [
  {
    id: "hard-capsule",
    name: "ハードカプセル",
    nameEn: "Hard Capsule",
    color: systemColors.blue,
    description: "粉末や顆粒を詰めた2ピース構造のカプセル。最も一般的な形状。",
    absorptionRate: "中〜高",
    absorptionTime: "20〜30分",
    costEfficiency: "中",
    pros: [
      "味や匂いを完全に隠せる",
      "植物性カプセル（HPMC）も選べる",
      "分解して中身だけ摂取も可能",
      "製造コストが比較的安い",
      "酸素や光から成分を保護",
    ],
    cons: [
      "飲み込みが苦手な人には不向き",
      "カプセル素材分のコストがかかる",
      "高温多湿で変形の可能性",
      "油溶性成分には不向き",
    ],
    commonAdditives: [
      { name: "ゼラチン", grade: "safe", note: "動物由来のカプセル素材" },
      {
        name: "HPMC（ヒプロメロース）",
        grade: "safe",
        note: "植物由来のカプセル素材",
      },
      { name: "セルロース", grade: "safe", note: "増量剤" },
      { name: "ステアリン酸マグネシウム", grade: "safe", note: "滑沢剤" },
      { name: "二酸化ケイ素", grade: "safe", note: "流動性向上" },
    ],
    bestFor: ["ビタミンB群", "ハーブ系", "プロバイオティクス", "アミノ酸"],
    notRecommendedFor: ["油溶性ビタミン（カプセル内で酸化リスク）"],
    absorptionNote: "胃で溶解後、小腸で吸収。空腹時の方が吸収が早い。",
  },
  {
    id: "softgel",
    name: "ソフトジェル",
    nameEn: "Softgel",
    color: systemColors.purple,
    description:
      "液体や油を封入したゼラチン製の柔らかいカプセル。油溶性成分に最適。",
    absorptionRate: "高",
    absorptionTime: "15〜25分",
    costEfficiency: "低〜中",
    pros: [
      "油溶性成分の吸収率が高い",
      "成分の酸化を防ぐ密閉性",
      "正確な用量を保証",
      "飲み込みやすい形状",
      "味や匂いを完全に隠せる",
    ],
    cons: [
      "製造コストが高い",
      "ベジタリアン向け製品が少ない",
      "高温で溶ける可能性",
      "製造に専門設備が必要",
    ],
    commonAdditives: [
      { name: "ゼラチン", grade: "safe", note: "カプセル外皮" },
      { name: "グリセリン", grade: "safe", note: "可塑剤" },
      { name: "レシチン", grade: "safe", note: "乳化剤" },
      {
        name: "トコフェロール",
        grade: "safe",
        note: "酸化防止剤（ビタミンE）",
      },
      { name: "ミツロウ", grade: "safe", note: "増粘剤" },
    ],
    bestFor: [
      "オメガ3（EPA/DHA）",
      "ビタミンD",
      "ビタミンE",
      "CoQ10",
      "ルテイン",
    ],
    notRecommendedFor: ["水溶性ビタミン（コストメリットなし）"],
    absorptionNote:
      "油溶性成分は食事と一緒に摂取すると吸収率が2〜3倍向上することも。",
  },
  {
    id: "tablet",
    name: "錠剤（タブレット）",
    nameEn: "Tablet",
    color: systemColors.green,
    description: "粉末を圧縮して固めた形状。大量生産に適し、コスパが良い。",
    absorptionRate: "低〜中",
    absorptionTime: "30〜45分",
    costEfficiency: "高",
    pros: [
      "製造コストが最も安い",
      "長期保存に適している",
      "1粒に多くの成分を配合可能",
      "持ち運びしやすい",
      "添加物を最小限にできる",
    ],
    cons: [
      "溶解に時間がかかる",
      "飲み込みにくい（特に大きいもの）",
      "製造時の熱で成分劣化の可能性",
      "コーティング剤が必要な場合も",
    ],
    commonAdditives: [
      { name: "セルロース", grade: "safe", note: "結合剤" },
      { name: "ステアリン酸", grade: "safe", note: "滑沢剤" },
      { name: "クロスカルメロース", grade: "safe", note: "崩壊剤" },
      { name: "シェラック", grade: "safe", note: "コーティング剤" },
      { name: "二酸化チタン", grade: "avoid", note: "白色着色料（EU禁止）" },
    ],
    bestFor: ["マルチビタミン", "ミネラル", "カルシウム", "マグネシウム"],
    notRecommendedFor: ["熱に弱い成分", "プロバイオティクス"],
    absorptionNote:
      "崩壊→溶解→吸収のステップが必要。食後に摂取すると胃酸で溶解しやすい。",
  },
  {
    id: "powder",
    name: "粉末・パウダー",
    nameEn: "Powder",
    color: systemColors.orange,
    description: "カプセルや錠剤の形状を取らない粉末状。用量調整が容易。",
    absorptionRate: "高",
    absorptionTime: "10〜20分",
    costEfficiency: "高",
    pros: [
      "吸収が最も早い",
      "用量を自由に調整可能",
      "カプセル・錠剤より添加物が少ない",
      "飲み込みが苦手な人に最適",
      "コストパフォーマンスが良い",
    ],
    cons: [
      "味が気になる場合がある",
      "携帯性が低い",
      "水や飲み物に溶かす手間",
      "酸化しやすい（開封後）",
      "正確な計量が必要",
    ],
    commonAdditives: [
      { name: "マルトデキストリン", grade: "safe", note: "増量剤・流動性向上" },
      { name: "クエン酸", grade: "safe", note: "pH調整・風味" },
      { name: "天然香料", grade: "safe", note: "風味付け" },
      { name: "ステビア", grade: "safe", note: "甘味料" },
    ],
    bestFor: ["プロテイン", "クレアチン", "BCAA", "コラーゲン", "グルタミン"],
    notRecommendedFor: ["味が苦い成分", "携帯が必要な場合"],
    absorptionNote:
      "既に溶解状態のため、胃での分解プロセスをスキップ。最速で吸収される。",
  },
  {
    id: "liquid",
    name: "液体・ドリンク",
    nameEn: "Liquid",
    color: systemColors.cyan,
    description: "液体状のサプリメント。吸収率が高く、飲みやすい。",
    absorptionRate: "最高",
    absorptionTime: "5〜15分",
    costEfficiency: "低",
    pros: [
      "吸収率が最も高い（98%以上も）",
      "嚥下困難な方にも適している",
      "子供や高齢者に飲ませやすい",
      "用量調整が容易",
      "即効性がある",
    ],
    cons: [
      "保存料が必要な場合が多い",
      "重いため送料が高い",
      "開封後の消費期限が短い",
      "携帯性が低い",
      "味の調整が必要",
    ],
    commonAdditives: [
      { name: "グリセリン", grade: "safe", note: "保湿・溶剤" },
      { name: "ソルビン酸K", grade: "safe", note: "保存料" },
      { name: "クエン酸", grade: "safe", note: "pH調整" },
      { name: "天然香料", grade: "safe", note: "風味付け" },
      { name: "キサンタンガム", grade: "safe", note: "増粘剤" },
    ],
    bestFor: [
      "鉄分",
      "ビタミンB12",
      "マグネシウム",
      "子供用サプリ",
      "高齢者向け",
    ],
    notRecommendedFor: ["長期保存が必要な場合", "携帯用"],
    absorptionNote: "消化プロセスが不要なため、直接吸収。空腹時で最大効果。",
  },
  {
    id: "gummy",
    name: "グミ・チュアブル",
    nameEn: "Gummy / Chewable",
    color: systemColors.pink,
    description: "噛んで食べるタイプ。美味しく続けやすいが、成分量に制限あり。",
    absorptionRate: "中",
    absorptionTime: "20〜30分",
    costEfficiency: "低",
    pros: [
      "美味しく続けやすい",
      "水なしで摂取可能",
      "子供でも摂取しやすい",
      "カプセルが苦手な人に最適",
      "口腔内で一部吸収開始",
    ],
    cons: [
      "1粒あたりの成分量が少ない",
      "砂糖や甘味料が多い",
      "虫歯のリスク",
      "高温で溶ける",
      "製造コストが高い",
    ],
    commonAdditives: [
      { name: "ペクチン", grade: "safe", note: "ゲル化剤" },
      { name: "クエン酸", grade: "safe", note: "酸味料" },
      { name: "天然着色料", grade: "safe", note: "着色" },
      { name: "スクロース", grade: "caution", note: "砂糖" },
      { name: "赤色40号", grade: "avoid", note: "合成着色料" },
    ],
    bestFor: ["ビタミンC", "ビタミンD", "亜鉛", "エルダーベリー", "子供用"],
    notRecommendedFor: ["高用量が必要な成分", "糖質制限中の方"],
    absorptionNote:
      "咀嚼により口腔内で一部吸収開始。ただし1粒の成分量は少なめ。",
  },
  {
    id: "sublingual",
    name: "舌下錠・スプレー",
    nameEn: "Sublingual",
    color: systemColors.indigo,
    description: "舌の下で溶かすタイプ。消化器を経由せず直接血流に入る。",
    absorptionRate: "最高",
    absorptionTime: "1〜5分",
    costEfficiency: "中",
    pros: [
      "吸収が極めて早い",
      "肝臓の初回通過効果を回避",
      "消化器への負担なし",
      "バイオアベイラビリティが高い",
      "即効性がある",
    ],
    cons: [
      "対応できる成分が限られる",
      "味が直接感じられる",
      "用量が限られる",
      "製品の選択肢が少ない",
    ],
    commonAdditives: [
      { name: "マンニトール", grade: "safe", note: "甘味料・増量剤" },
      { name: "クエン酸", grade: "safe", note: "pH調整" },
      { name: "天然香料", grade: "safe", note: "風味付け" },
      { name: "ステビア", grade: "safe", note: "甘味料" },
    ],
    bestFor: ["ビタミンB12", "メラトニン", "CBD", "ビタミンD3"],
    notRecommendedFor: ["味が苦い成分", "高用量が必要な成分"],
    absorptionNote:
      "舌下の粘膜から直接血流に吸収。胃酸で分解されやすい成分に最適。",
  },
];

// 比較表データ（数値ベース）
const comparisonData = [
  {
    form: "ハードカプセル",
    formShort: "カプセル",
    color: systemColors.blue,
    absorption: 3,
    rate: 3,
    cost: 3,
    portability: 4,
    ease: 3,
    highlight: "バランス型",
  },
  {
    form: "ソフトジェル",
    formShort: "ソフトジェル",
    color: systemColors.purple,
    absorption: 4,
    rate: 4,
    cost: 2,
    portability: 3,
    ease: 4,
    highlight: "油溶性成分向け",
  },
  {
    form: "錠剤",
    formShort: "錠剤",
    color: systemColors.green,
    absorption: 2,
    rate: 2,
    cost: 5,
    portability: 5,
    ease: 2,
    highlight: "コスパ重視",
  },
  {
    form: "粉末",
    formShort: "粉末",
    color: systemColors.orange,
    absorption: 4,
    rate: 4,
    cost: 4,
    portability: 2,
    ease: 3,
    highlight: "用量調整向け",
  },
  {
    form: "液体",
    formShort: "液体",
    color: systemColors.cyan,
    absorption: 5,
    rate: 5,
    cost: 1,
    portability: 1,
    ease: 4,
    highlight: "高吸収率",
  },
  {
    form: "グミ",
    formShort: "グミ",
    color: systemColors.pink,
    absorption: 3,
    rate: 3,
    cost: 2,
    portability: 3,
    ease: 5,
    highlight: "継続しやすい",
  },
  {
    form: "舌下",
    formShort: "舌下",
    color: systemColors.indigo,
    absorption: 5,
    rate: 5,
    cost: 3,
    portability: 4,
    ease: 3,
    highlight: "即効性重視",
  },
];

// 評価項目の定義
const ratingCategories = [
  { key: "absorption", label: "吸収速度" },
  { key: "rate", label: "吸収率" },
  { key: "cost", label: "コスパ" },
  { key: "portability", label: "携帯性" },
  { key: "ease", label: "継続性" },
] as const;

// レーティングバーコンポーネント
function RatingBar({
  value,
  color,
  maxValue = 5,
}: {
  value: number;
  color: string;
  maxValue?: number;
}) {
  const percentage = (value / maxValue) * 100;
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-2 rounded-full flex-1 overflow-hidden"
        style={{ backgroundColor: `${color}20` }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <span className="text-[12px] font-bold w-6 text-right" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

// 構造化データ
function generateStructuredData() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "サプリメントのカプセルと錠剤、どちらが吸収率が高いですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "一般的にカプセル（特にソフトジェル）の方が錠剤より吸収率が高いです。錠剤は圧縮されているため溶解に時間がかかり、吸収開始まで30〜45分かかることがあります。一方、カプセルは15〜30分で溶解し始めます。",
        },
      },
      {
        "@type": "Question",
        name: "粉末サプリメントのメリットは何ですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "粉末サプリメントの主なメリットは、吸収が最も早いこと（10〜20分）、用量を自由に調整できること、カプセルや錠剤より添加物が少ないこと、コストパフォーマンスが良いことです。特にプロテインやアミノ酸に適しています。",
        },
      },
      {
        "@type": "Question",
        name: "オメガ3（EPA/DHA）はどの形状がおすすめですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "オメガ3などの油溶性成分にはソフトジェルが最適です。液体を密閉できるため酸化を防ぎ、油溶性成分の吸収率も高くなります。食事と一緒に摂取すると吸収率がさらに向上します。",
        },
      },
      {
        "@type": "Question",
        name: "子供や高齢者に適したサプリメントの形状は？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "飲み込みが難しい子供や高齢者には、液体サプリメント、グミ、またはチュアブル錠がおすすめです。液体は吸収率も高く、用量調整も容易です。グミは美味しく続けやすいですが、1粒あたりの成分量が少ない点に注意が必要です。",
        },
      },
      {
        "@type": "Question",
        name: "サプリメントの添加物で注意すべきものは？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "二酸化チタン（EU禁止の白色着色料）、合成着色料（赤色40号、黄色5号など）、一部の人工甘味料は注意が必要です。一方、セルロース、ステアリン酸マグネシウム、ゼラチンなどは安全性が確立されています。",
        },
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "サプリメント形状ガイド：カプセル・錠剤・粉末の違いを徹底比較",
    description:
      "サプリメントの形状別にメリット・デメリット、添加物、吸収率を科学的根拠に基づいて解説",
    author: {
      "@type": "Organization",
      name: "サプティア",
      url: "https://suptia.com",
    },
    publisher: {
      "@type": "Organization",
      name: "サプティア",
      url: "https://suptia.com",
    },
    mainEntityOfPage: "https://suptia.com/guide/supplement-forms",
  };

  return [faqSchema, articleSchema];
}

export default function SupplementFormsGuidePage() {
  const structuredData = generateStructuredData();

  return (
    <>
      {/* 構造化データ */}
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div
        className="min-h-screen"
        style={{
          backgroundColor: appleWebColors.pageBackground,
          fontFamily: fontStack,
        }}
      >
        {/* Hero Section */}
        <section
          className="py-16 sm:py-20 lg:py-24 border-b"
          style={{
            background: `linear-gradient(135deg, ${systemColors.blue}08 0%, rgba(255, 255, 255, 0.9) 50%, ${systemColors.purple}08 100%)`,
            borderColor: appleWebColors.borderSubtle,
          }}
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="text-center">
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6"
                style={{
                  backgroundColor: `${systemColors.blue}15`,
                  border: `1px solid ${systemColors.blue}30`,
                }}
              >
                <Pill size={16} style={{ color: systemColors.blue }} />
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: systemColors.blue }}
                >
                  形状ガイド
                </span>
              </div>

              <h1
                className="text-[34px] sm:text-[40px] lg:text-[48px] font-bold leading-tight tracking-[-0.015em] mb-4"
                style={{ color: appleWebColors.textPrimary }}
              >
                サプリメント形状ガイド
              </h1>

              <p
                className="text-[17px] sm:text-[20px] max-w-3xl mx-auto leading-relaxed mb-10 hero-description"
                style={{ color: appleWebColors.textSecondary }}
              >
                カプセル、錠剤、粉末、液体...
                <br className="hidden sm:block" />
                あなたに最適な形状を見つけましょう。
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-4">
                <div
                  className={`rounded-[16px] px-6 py-4 border ${liquidGlassClasses.light}`}
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  <div
                    className="text-[28px] font-bold"
                    style={{ color: systemColors.blue }}
                  >
                    {supplementForms.length}
                  </div>
                  <div
                    className="text-[13px] font-medium"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    種類の形状
                  </div>
                </div>
                <div
                  className={`rounded-[16px] px-6 py-4 border ${liquidGlassClasses.light}`}
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  <div
                    className="text-[28px] font-bold"
                    style={{ color: systemColors.purple }}
                  >
                    5分〜45分
                  </div>
                  <div
                    className="text-[13px] font-medium"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    吸収時間の幅
                  </div>
                </div>
                <div
                  className={`rounded-[16px] px-6 py-4 border ${liquidGlassClasses.light}`}
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  <div
                    className="text-[28px] font-bold"
                    style={{ color: systemColors.green }}
                  >
                    最大3倍
                  </div>
                  <div
                    className="text-[13px] font-medium"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    吸収率の差
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Points */}
        <section className="py-8 px-6 lg:px-12">
          <div className="mx-auto max-w-4xl">
            <div
              className="rounded-[20px] p-6 border"
              style={{
                backgroundColor: `${systemColors.green}08`,
                borderColor: `${systemColors.green}30`,
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-[12px] flex-shrink-0"
                  style={{ backgroundColor: `${systemColors.green}15` }}
                >
                  <Info size={24} style={{ color: systemColors.green }} />
                </div>
                <div>
                  <h2
                    className="text-[17px] font-bold mb-3"
                    style={{ color: systemColors.green }}
                  >
                    形状選びのポイント
                  </h2>
                  <ul className="space-y-2">
                    {[
                      "油溶性成分（オメガ3、ビタミンD等）はソフトジェルが最適",
                      "吸収速度を重視するなら液体・舌下・粉末を選ぶ",
                      "続けやすさ重視ならグミやチュアブル",
                      "コスパ重視なら錠剤や粉末がおすすめ",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ChevronRight
                          size={16}
                          className="mt-0.5 flex-shrink-0"
                          style={{ color: systemColors.green }}
                        />
                        <span
                          className="text-[15px] leading-relaxed"
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-12 px-6 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-10">
              <h2
                className="text-[28px] sm:text-[34px] font-bold tracking-[-0.015em] mb-4"
                style={{ color: appleWebColors.textPrimary }}
              >
                形状別比較
              </h2>
              <p
                className="text-[17px] max-w-2xl mx-auto"
                style={{ color: appleWebColors.textSecondary }}
              >
                各形状の特徴を視覚的に比較できます
              </p>
            </div>

            {/* カード形式の比較表 */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {comparisonData.map((item) => (
                <div
                  key={item.form}
                  className={`rounded-[20px] p-5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${liquidGlassClasses.light}`}
                  style={{
                    borderColor: appleWebColors.borderSubtle,
                  }}
                >
                  {/* ヘッダー */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-[12px] flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <Pill size={24} style={{ color: item.color }} />
                    </div>
                    <div>
                      <h3
                        className="font-bold text-[16px]"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {item.form}
                      </h3>
                      <span
                        className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${item.color}15`,
                          color: item.color,
                        }}
                      >
                        {item.highlight}
                      </span>
                    </div>
                  </div>

                  {/* レーティング */}
                  <div className="space-y-3">
                    {ratingCategories.map((cat) => (
                      <div key={cat.key}>
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className="text-[12px]"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            {cat.label}
                          </span>
                        </div>
                        <RatingBar value={item[cat.key]} color={item.color} />
                      </div>
                    ))}
                  </div>

                  {/* 総合スコア */}
                  <div
                    className="mt-4 pt-4 border-t flex items-center justify-between"
                    style={{ borderColor: appleWebColors.borderSubtle }}
                  >
                    <span
                      className="text-[12px] font-medium"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      総合スコア
                    </span>
                    <div className="flex items-center gap-1">
                      <span
                        className="text-[20px] font-bold"
                        style={{ color: item.color }}
                      >
                        {item.absorption +
                          item.rate +
                          item.cost +
                          item.portability +
                          item.ease}
                      </span>
                      <span
                        className="text-[12px]"
                        style={{ color: appleWebColors.textTertiary }}
                      >
                        /25
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ランキング形式のサマリー */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {[
                {
                  label: "吸収速度",
                  key: "absorption" as const,
                  Icon: Zap,
                  winners: ["液体", "舌下"],
                },
                {
                  label: "吸収率",
                  key: "rate" as const,
                  Icon: TrendingUp,
                  winners: ["液体", "舌下"],
                },
                {
                  label: "コスパ",
                  key: "cost" as const,
                  Icon: Wallet,
                  winners: ["錠剤"],
                },
                {
                  label: "携帯性",
                  key: "portability" as const,
                  Icon: Briefcase,
                  winners: ["錠剤"],
                },
                {
                  label: "続けやすさ",
                  key: "ease" as const,
                  Icon: RefreshCw,
                  winners: ["グミ"],
                },
              ].map((category) => {
                const topForms = comparisonData
                  .filter((f) => category.winners.includes(f.form))
                  .slice(0, 2);
                return (
                  <div
                    key={category.key}
                    className={`rounded-[16px] p-4 border text-center ${liquidGlassClasses.light}`}
                    style={{ borderColor: appleWebColors.borderSubtle }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2"
                      style={{ backgroundColor: `${systemColors.blue}10` }}
                    >
                      <category.Icon
                        size={20}
                        style={{ color: systemColors.blue }}
                      />
                    </div>
                    <h4
                      className="text-[13px] font-semibold mb-3"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {category.label}
                    </h4>
                    <div className="flex justify-center gap-2">
                      {topForms.map((form, idx) => (
                        <div
                          key={form.form}
                          className="flex items-center gap-1"
                        >
                          {idx === 0 && (
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                              style={{
                                backgroundColor: "#FFD700",
                                color: "#7B5800",
                              }}
                            >
                              1
                            </div>
                          )}
                          <span
                            className="text-[12px] font-medium px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: `${form.color}15`,
                              color: form.color,
                            }}
                          >
                            {form.form}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Form Details */}
        <section
          className="py-16 sm:py-20 px-6 lg:px-12"
          style={{ backgroundColor: appleWebColors.sectionBackground }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2
                className="text-[28px] sm:text-[34px] font-bold tracking-[-0.015em] mb-4"
                style={{ color: appleWebColors.textPrimary }}
              >
                形状別詳細ガイド
              </h2>
              <p
                className="text-[17px] max-w-2xl mx-auto"
                style={{ color: appleWebColors.textSecondary }}
              >
                各形状のメリット・デメリット、添加物、おすすめ成分を詳しく解説
              </p>
            </div>

            <div className="space-y-8">
              {supplementForms.map((form) => (
                <div
                  key={form.id}
                  id={form.id}
                  className={`rounded-[24px] p-6 sm:p-8 border ${liquidGlassClasses.light}`}
                  style={{ borderColor: appleWebColors.borderSubtle }}
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                    <div
                      className="w-16 h-16 rounded-[16px] flex items-center justify-center"
                      style={{ backgroundColor: `${form.color}15` }}
                    >
                      {(() => {
                        const IconComponent = formIcons[form.id];
                        return IconComponent ? (
                          <IconComponent
                            size={32}
                            style={{ color: form.color }}
                          />
                        ) : (
                          <Pill size={32} style={{ color: form.color }} />
                        );
                      })()}
                    </div>
                    <div className="flex-1">
                      <h3
                        className="text-[24px] font-bold mb-1"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {form.name}
                      </h3>
                      <p
                        className="text-[14px]"
                        style={{ color: appleWebColors.textTertiary }}
                      >
                        {form.nameEn}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div
                        className="rounded-[12px] px-4 py-2 text-center"
                        style={{ backgroundColor: `${form.color}10` }}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <Zap size={14} style={{ color: form.color }} />
                          <span
                            className="text-[12px] font-medium"
                            style={{ color: form.color }}
                          >
                            吸収率
                          </span>
                        </div>
                        <span
                          className="text-[15px] font-bold"
                          style={{ color: form.color }}
                        >
                          {form.absorptionRate}
                        </span>
                      </div>
                      <div
                        className="rounded-[12px] px-4 py-2 text-center"
                        style={{ backgroundColor: `${form.color}10` }}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <Clock size={14} style={{ color: form.color }} />
                          <span
                            className="text-[12px] font-medium"
                            style={{ color: form.color }}
                          >
                            吸収時間
                          </span>
                        </div>
                        <span
                          className="text-[15px] font-bold"
                          style={{ color: form.color }}
                        >
                          {form.absorptionTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p
                    className="text-[16px] leading-relaxed mb-6"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    {form.description}
                  </p>

                  {/* Pros & Cons */}
                  <div className="grid sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4
                        className="flex items-center gap-2 text-[15px] font-semibold mb-3"
                        style={{ color: systemColors.green }}
                      >
                        <CheckCircle2 size={18} />
                        メリット
                      </h4>
                      <ul className="space-y-2">
                        {form.pros.map((pro, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-[14px]"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <span style={{ color: systemColors.green }}>✓</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4
                        className="flex items-center gap-2 text-[15px] font-semibold mb-3"
                        style={{ color: systemColors.red }}
                      >
                        <XCircle size={18} />
                        デメリット
                      </h4>
                      <ul className="space-y-2">
                        {form.cons.map((con, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-[14px]"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <span style={{ color: systemColors.red }}>✗</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Additives */}
                  <div className="mb-6">
                    <h4
                      className="flex items-center gap-2 text-[15px] font-semibold mb-3"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      <Beaker
                        size={18}
                        style={{ color: systemColors.purple }}
                      />
                      主な添加物
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {form.commonAdditives.map((additive, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px]"
                          style={{
                            backgroundColor:
                              additive.grade === "safe"
                                ? `${systemColors.green}10`
                                : additive.grade === "caution"
                                  ? `${systemColors.orange}10`
                                  : `${systemColors.red}10`,
                            color:
                              additive.grade === "safe"
                                ? systemColors.green
                                : additive.grade === "caution"
                                  ? systemColors.orange
                                  : systemColors.red,
                          }}
                          title={additive.note}
                        >
                          {additive.grade === "safe" && "✓"}
                          {additive.grade === "caution" && "!"}
                          {additive.grade === "avoid" && "✗"}
                          {additive.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Best For & Not Recommended */}
                  <div className="grid sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4
                        className="text-[14px] font-semibold mb-2"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        おすすめの成分
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {form.bestFor.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-full text-[12px]"
                            style={{
                              backgroundColor: `${form.color}10`,
                              color: form.color,
                            }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4
                        className="text-[14px] font-semibold mb-2"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        不向きなケース
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {form.notRecommendedFor.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-full text-[12px]"
                            style={{
                              backgroundColor: appleWebColors.sectionBackground,
                              color: appleWebColors.textSecondary,
                            }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Absorption Note */}
                  <div
                    className="rounded-[12px] p-4"
                    style={{ backgroundColor: `${form.color}08` }}
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle
                        size={18}
                        style={{ color: form.color }}
                        className="mt-0.5"
                      />
                      <div>
                        <span
                          className="text-[13px] font-semibold"
                          style={{ color: form.color }}
                        >
                          吸収のポイント
                        </span>
                        <p
                          className="text-[14px] mt-1"
                          style={{ color: appleWebColors.textSecondary }}
                        >
                          {form.absorptionNote}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 px-6 lg:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <div
              className="rounded-[24px] p-8 sm:p-12 border"
              style={{
                background: `linear-gradient(135deg, ${systemColors.blue}10 0%, ${systemColors.purple}10 100%)`,
                borderColor: appleWebColors.borderSubtle,
              }}
            >
              <h2
                className="text-[24px] sm:text-[28px] font-bold mb-4"
                style={{ color: appleWebColors.textPrimary }}
              >
                添加物についてもっと詳しく
              </h2>
              <p
                className="text-[17px] mb-8 max-w-2xl mx-auto leading-relaxed"
                style={{ color: appleWebColors.textSecondary }}
              >
                各形状で使われる添加物の安全性を詳しく知りたい方は、
                添加物ガイドをご確認ください。
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/guide/additives"
                  className="group flex items-center gap-2 rounded-full px-8 py-4 font-semibold text-white transition-all hover:scale-[1.02] min-h-[48px]"
                  style={{
                    background: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.blue} 100%)`,
                    boxShadow: `0 4px 16px ${systemColors.purple}40`,
                  }}
                >
                  添加物ガイドを見る
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  href="/guide/dangerous-ingredients"
                  className={`group flex items-center gap-2 rounded-full px-8 py-4 font-semibold transition-all hover:scale-[1.02] min-h-[48px] border ${liquidGlassClasses.light}`}
                  style={{
                    borderColor: appleWebColors.borderSubtle,
                    color: appleWebColors.textPrimary,
                  }}
                >
                  危険成分ガイドを見る
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
