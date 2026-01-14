import Link from "next/link";
import { Metadata } from "next";
import {
  Heart,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Pill,
  TestTube,
  Utensils,
  Clock,
  Activity,
  Brain,
  Bone,
  ArrowRight,
} from "lucide-react";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

export const metadata: Metadata = {
  title: "高齢者向けサプリメントガイド | サプティア",
  description:
    "加齢に伴う健康課題に対応するサプリメントを科学的根拠に基づいて解説。骨密度、認知機能、心血管の健康をサポートする成分をご紹介します。",
};

const recommendedIngredients = [
  {
    name: "ビタミンD",
    nameEn: "Vitamin D",
    slug: "vitamin-d",
    description:
      "骨密度維持と筋力低下予防に重要。高齢者は皮膚でのビタミンD合成能力が低下します。",
    dosage: "800〜1000IU/日",
    benefits: ["骨密度維持", "筋力維持", "転倒リスク低減"],
    category: "骨・筋肉",
  },
  {
    name: "カルシウム",
    nameEn: "Calcium",
    slug: "calcium",
    description:
      "骨粗しょう症予防に不可欠。ビタミンDと併用することで吸収率が向上します。",
    dosage: "1000〜1200mg/日",
    benefits: ["骨密度維持", "骨折予防", "骨粗しょう症予防"],
    category: "骨・筋肉",
  },
  {
    name: "オメガ3（EPA/DHA）",
    nameEn: "Omega-3 (EPA/DHA)",
    slug: "omega-3",
    description: "心血管の健康と認知機能の維持に重要。抗炎症作用もあります。",
    dosage: "1000〜2000mg/日",
    benefits: ["心血管保護", "認知機能維持", "抗炎症"],
    category: "心血管・脳",
  },
  {
    name: "ビタミンB12",
    nameEn: "Vitamin B12",
    slug: "vitamin-b12",
    description:
      "神経機能と造血に重要。高齢者は胃酸分泌低下により吸収が困難になります。",
    dosage: "2.4〜100μg/日",
    benefits: ["神経機能", "貧血予防", "認知機能維持"],
    category: "神経・血液",
  },
  {
    name: "コエンザイムQ10",
    nameEn: "CoQ10",
    slug: "coq10",
    description:
      "心臓の健康とエネルギー産生に重要。加齢とともに体内生成が減少します。",
    dosage: "100〜200mg/日",
    benefits: ["心機能サポート", "エネルギー産生", "抗酸化"],
    category: "心血管・エネルギー",
  },
  {
    name: "ビタミンK2",
    nameEn: "Vitamin K2",
    slug: "vitamin-k2",
    description: "カルシウムを骨に定着させる働きがあり、動脈石灰化を防ぎます。",
    dosage: "90〜180μg/日",
    benefits: ["骨密度向上", "血管の健康", "カルシウム代謝"],
    category: "骨・血管",
  },
];

const cautionIngredients = [
  {
    name: "高用量ビタミンA",
    slug: "vitamin-a",
    reason: "高齢者では骨折リスクを高める可能性。β-カロテンは安全。",
    maxDosage: "900μg/日以下",
    riskLevel: "高",
  },
  {
    name: "高用量鉄",
    slug: "iron",
    reason:
      "鉄欠乏性貧血と診断されていない限り、過剰摂取は酸化ストレスを増加させます。",
    maxDosage: "医師の指示がない限り避ける",
    riskLevel: "高",
  },
  {
    name: "ギンコビロバ（高用量）",
    slug: "ginkgo-biloba",
    reason: "抗凝固薬との相互作用リスク。出血傾向を高める可能性。",
    maxDosage: "医師に相談",
    riskLevel: "中",
  },
];

const tips = [
  {
    icon: Pill,
    title: "薬との相互作用に注意",
    description:
      "処方薬や市販薬との相互作用が起こりやすいため、必ず医師や薬剤師に相談してから使用を開始してください。",
    color: systemColors.blue,
  },
  {
    icon: TestTube,
    title: "定期的な血液検査",
    description:
      "ビタミンD、ビタミンB12、鉄などの血中濃度を定期的に検査し、不足や過剰を避けましょう。",
    color: systemColors.purple,
  },
  {
    icon: Utensils,
    title: "食事と併用",
    description:
      "脂溶性ビタミン（D、K）は食事と一緒に摂取すると吸収率が向上します。",
    color: systemColors.green,
  },
  {
    icon: Clock,
    title: "継続的な摂取",
    description:
      "サプリメントの効果は数週間から数ヶ月かけて現れます。短期間で判断せず継続しましょう。",
    color: systemColors.orange,
  },
];

const healthCategories = [
  {
    icon: Bone,
    name: "骨の健康",
    description: "骨密度維持と骨折予防",
    color: systemColors.orange,
  },
  {
    icon: Heart,
    name: "心血管の健康",
    description: "心臓と血管の機能維持",
    color: systemColors.red,
  },
  {
    icon: Brain,
    name: "認知機能",
    description: "脳の健康と記憶力維持",
    color: systemColors.purple,
  },
  {
    icon: Activity,
    name: "エネルギー",
    description: "活力と疲労回復",
    color: systemColors.green,
  },
];

export default function SeniorsPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
      {/* Breadcrumb */}
      <div
        className={`border-b sticky top-0 z-10 ${liquidGlassClasses.light}`}
        style={{
          borderColor: appleWebColors.borderSubtle,
        }}
      >
        <div className="mx-auto max-w-7xl px-6 py-3">
          <div className="flex items-center gap-2 text-[14px]">
            <Link
              href="/"
              className="hover:opacity-70 transition-opacity"
              style={{ color: systemColors.blue }}
            >
              ホーム
            </Link>
            <ChevronRight
              size={14}
              style={{ color: appleWebColors.textTertiary }}
            />
            <Link
              href="/guide/audiences"
              className="hover:opacity-70 transition-opacity"
              style={{ color: systemColors.blue }}
            >
              対象者別ガイド
            </Link>
            <ChevronRight
              size={14}
              style={{ color: appleWebColors.textTertiary }}
            />
            <span style={{ color: appleWebColors.textPrimary }}>
              高齢者向け
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section
        className="py-16 sm:py-20 border-b"
        style={{
          background: `linear-gradient(135deg, ${systemColors.orange}08 0%, rgba(255, 255, 255, 0.9) 50%, ${systemColors.yellow}08 100%)`,
          borderColor: appleWebColors.borderSubtle,
        }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-[20px] mb-6"
              style={{
                background: `linear-gradient(135deg, ${systemColors.orange} 0%, ${systemColors.yellow} 100%)`,
              }}
            >
              <Heart size={32} className="text-white" />
            </div>
            <h1
              className="text-[34px] sm:text-[40px] lg:text-[48px] font-bold leading-tight tracking-[-0.015em] mb-4"
              style={{ color: appleWebColors.textPrimary }}
            >
              高齢者向け
              <br className="sm:hidden" />
              サプリメントガイド
            </h1>
            <p
              className="text-[17px] sm:text-[20px] mb-4"
              style={{ color: appleWebColors.textSecondary }}
            >
              健康寿命を延ばすための栄養サポート
            </p>
            <p
              className="text-[15px] max-w-2xl mx-auto leading-relaxed mb-10"
              style={{ color: appleWebColors.textSecondary }}
            >
              加齢に伴う栄養吸収の低下や慢性疾患のリスクに対応した、
              科学的根拠に基づくサプリメントをご紹介します。
            </p>

            {/* Health Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {healthCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <div
                    key={index}
                    className={`rounded-[16px] p-4 border ${liquidGlassClasses.light}`}
                    style={{
                      borderColor: appleWebColors.borderSubtle,
                    }}
                  >
                    <div
                      className="inline-flex items-center justify-center w-10 h-10 rounded-[12px] mb-2"
                      style={{ backgroundColor: `${category.color}15` }}
                    >
                      <Icon size={20} style={{ color: category.color }} />
                    </div>
                    <div
                      className="text-[14px] font-bold"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      {category.name}
                    </div>
                    <div
                      className="text-[12px]"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      {category.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 px-6 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div
            className="rounded-[20px] p-6 border"
            style={{
              backgroundColor: `${systemColors.orange}08`,
              borderColor: `${systemColors.orange}30`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="p-3 rounded-[12px] flex-shrink-0"
                style={{ backgroundColor: `${systemColors.orange}15` }}
              >
                <AlertTriangle
                  size={24}
                  style={{ color: systemColors.orange }}
                />
              </div>
              <div>
                <h3
                  className="text-[17px] font-bold mb-2"
                  style={{ color: systemColors.orange }}
                >
                  重要な注意事項
                </h3>
                <p
                  className="text-[15px] leading-relaxed mb-2"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  既に処方薬を服用している場合、サプリメントとの相互作用が懸念されます。必ず医師または薬剤師に相談してから使用してください。
                </p>
                <p
                  className="text-[14px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  特に、抗凝固薬、降圧薬、糖尿病治療薬を服用中の方は注意が必要です。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Ingredients */}
      <section className="py-12 px-6 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4"
              style={{
                backgroundColor: `${systemColors.green}15`,
                border: `1px solid ${systemColors.green}30`,
              }}
            >
              <CheckCircle2 size={16} style={{ color: systemColors.green }} />
              <span
                className="text-[13px] font-semibold"
                style={{ color: systemColors.green }}
              >
                科学的根拠のある成分
              </span>
            </div>
            <h2
              className="text-[28px] sm:text-[34px] font-bold tracking-[-0.015em] mb-3"
              style={{ color: appleWebColors.textPrimary }}
            >
              推奨される成分
            </h2>
            <p
              className="text-[17px] max-w-2xl mx-auto"
              style={{ color: appleWebColors.textSecondary }}
            >
              高齢者の健康維持に効果的とされる成分です。医師の指導のもと適切に摂取しましょう。
            </p>
          </div>

          <div className="grid gap-4">
            {recommendedIngredients.map((ingredient) => (
              <Link
                key={ingredient.slug}
                href={`/ingredients/${ingredient.slug}`}
                className="group block"
              >
                <div
                  className={`rounded-[20px] p-6 border transition-all duration-300 hover:-translate-y-1 ${liquidGlassClasses.light}`}
                  style={{
                    borderColor: appleWebColors.borderSubtle,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3
                          className="text-[20px] font-bold"
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          {ingredient.name}
                        </h3>
                        <span
                          className="text-[14px]"
                          style={{ color: appleWebColors.textTertiary }}
                        >
                          ({ingredient.nameEn})
                        </span>
                        <span
                          className="text-[12px] px-2.5 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: `${systemColors.orange}15`,
                            color: systemColors.orange,
                          }}
                        >
                          {ingredient.category}
                        </span>
                      </div>
                      <p
                        className="text-[15px] leading-relaxed mb-4"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        {ingredient.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {ingredient.benefits.map((benefit, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-full text-[13px] font-medium"
                            style={{
                              backgroundColor: `${systemColors.green}15`,
                              color: systemColors.green,
                            }}
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                      <div
                        className="flex items-center text-[14px] font-medium"
                        style={{ color: systemColors.blue }}
                      >
                        詳細を見る
                        <ChevronRight
                          size={16}
                          className="ml-1 group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                    <div
                      className="rounded-[16px] px-5 py-4 md:min-w-[160px] text-center border"
                      style={{
                        backgroundColor: `${systemColors.green}08`,
                        borderColor: `${systemColors.green}30`,
                      }}
                    >
                      <div
                        className="text-[12px] font-medium mb-1"
                        style={{ color: systemColors.green }}
                      >
                        推奨摂取量
                      </div>
                      <div
                        className="text-[17px] font-bold"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {ingredient.dosage}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Caution Ingredients */}
      <section
        className="py-16 px-6 lg:px-12"
        style={{ backgroundColor: appleWebColors.sectionBackground }}
      >
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4"
              style={{
                backgroundColor: `${systemColors.orange}15`,
                border: `1px solid ${systemColors.orange}30`,
              }}
            >
              <XCircle size={16} style={{ color: systemColors.orange }} />
              <span
                className="text-[13px] font-semibold"
                style={{ color: systemColors.orange }}
              >
                注意が必要
              </span>
            </div>
            <h2
              className="text-[28px] sm:text-[34px] font-bold tracking-[-0.015em] mb-3"
              style={{ color: appleWebColors.textPrimary }}
            >
              注意が必要な成分
            </h2>
            <p
              className="text-[17px] max-w-2xl mx-auto"
              style={{ color: appleWebColors.textSecondary }}
            >
              高齢者では特に注意が必要な成分です。使用前に必ず医師に相談してください。
            </p>
          </div>

          <div className="grid gap-3">
            {cautionIngredients.map((ingredient) => (
              <Link
                key={ingredient.slug}
                href={`/ingredients/${ingredient.slug}`}
                className="group block"
              >
                <div
                  className={`rounded-[16px] p-5 border-l-4 transition-all duration-300 hover:-translate-y-0.5 ${liquidGlassClasses.light}`}
                  style={{
                    borderLeftColor: systemColors.orange,
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3
                          className="text-[17px] font-bold"
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          {ingredient.name}
                        </h3>
                        <span
                          className="text-[12px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor:
                              ingredient.riskLevel === "高"
                                ? `${systemColors.red}15`
                                : `${systemColors.orange}15`,
                            color:
                              ingredient.riskLevel === "高"
                                ? systemColors.red
                                : systemColors.orange,
                          }}
                        >
                          リスク: {ingredient.riskLevel}
                        </span>
                      </div>
                      <p
                        className="text-[14px]"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        <span
                          className="font-medium"
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          理由:
                        </span>{" "}
                        {ingredient.reason}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div
                        className="rounded-[12px] px-4 py-2 text-center border"
                        style={{
                          backgroundColor: `${systemColors.orange}08`,
                          borderColor: `${systemColors.orange}30`,
                        }}
                      >
                        <div
                          className="text-[11px] font-medium"
                          style={{ color: systemColors.orange }}
                        >
                          推奨
                        </div>
                        <div
                          className="text-[14px] font-bold"
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          {ingredient.maxDosage}
                        </div>
                      </div>
                      <ChevronRight
                        size={20}
                        className="group-hover:translate-x-1 transition-all"
                        style={{ color: appleWebColors.textTertiary }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2
              className="text-[28px] sm:text-[34px] font-bold tracking-[-0.015em] mb-3"
              style={{ color: appleWebColors.textPrimary }}
            >
              高齢者のサプリメント
              <br className="sm:hidden" />
              使用のポイント
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {tips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <div
                  key={index}
                  className={`rounded-[20px] p-6 border transition-all duration-300 hover:-translate-y-1 ${liquidGlassClasses.light}`}
                  style={{
                    borderColor: appleWebColors.borderSubtle,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] mb-4"
                    style={{ backgroundColor: `${tip.color}15` }}
                  >
                    <Icon size={24} style={{ color: tip.color }} />
                  </div>
                  <h3
                    className="text-[17px] font-bold mb-2"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    {tip.title}
                  </h3>
                  <p
                    className="text-[15px] leading-relaxed"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    {tip.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Related Guides */}
      <section className="py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <div
            className="rounded-[24px] p-8 sm:p-12 border"
            style={{
              background: `linear-gradient(135deg, ${systemColors.orange}10 0%, ${systemColors.yellow}10 100%)`,
              borderColor: appleWebColors.borderSubtle,
            }}
          >
            <h2
              className="text-[24px] sm:text-[28px] font-bold mb-4"
              style={{ color: appleWebColors.textPrimary }}
            >
              さらに詳しい成分情報を確認
            </h2>
            <p
              className="text-[17px] mb-8 leading-relaxed"
              style={{ color: appleWebColors.textSecondary }}
            >
              各成分の詳細ページで、効果、摂取方法、副作用、相互作用などの詳しい情報をご覧いただけます。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ingredients"
                className="group flex items-center justify-center gap-2 rounded-full px-8 py-4 font-semibold text-white transition-all hover:scale-[1.02] min-h-[48px]"
                style={{
                  background: `linear-gradient(135deg, ${systemColors.orange} 0%, ${systemColors.yellow} 100%)`,
                  boxShadow: `0 4px 16px ${systemColors.orange}40`,
                }}
              >
                成分一覧を見る
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/guide/audiences"
                className={`group flex items-center justify-center gap-2 rounded-full px-8 py-4 font-semibold transition-all hover:scale-[1.02] min-h-[48px] border ${liquidGlassClasses.light}`}
                style={{
                  borderColor: appleWebColors.borderSubtle,
                  color: appleWebColors.textPrimary,
                }}
              >
                他の対象者ガイドを見る
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
