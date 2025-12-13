import Link from "next/link";
import { Metadata } from "next";
import {
  Briefcase,
  AlertTriangle,
  ChevronRight,
  Zap,
  Shield,
  Clock,
  Moon,
  Utensils,
  Stethoscope,
} from "lucide-react";
import {
  systemColors,
  appleWebColors,
  fontStack,
  tierColors,
  liquidGlassClasses,
} from "@/lib/design-system";

export const metadata: Metadata = {
  title: "ビジネスパーソン向けサプリメントガイド | Suptia",
  description:
    "仕事のパフォーマンス向上に効果的なサプリメントを科学的根拠に基づいて解説。ストレス対策、集中力、エネルギーをサポートする成分をご紹介します。",
};

const performanceIngredients = [
  {
    name: "ロディオラ",
    nameEn: "Rhodiola",
    slug: "rhodiola",
    description:
      "ストレス適応ハーブ。慢性的なストレスと疲労に対処し、仕事のパフォーマンスを維持します。",
    dosage: "200〜600mg/日",
    benefits: ["ストレス軽減", "疲労回復", "集中力向上"],
    evidenceLevel: "A",
  },
  {
    name: "カフェイン + L-テアニン",
    nameEn: "Caffeine + L-Theanine",
    slug: "caffeine",
    description:
      "カフェインの覚醒効果とL-テアニンのリラックス効果を組み合わせた、理想的な集中力ブースター。",
    dosage: "カフェイン100mg + L-テアニン200mg",
    benefits: ["集中力向上", "覚醒効果", "不安軽減"],
    evidenceLevel: "A",
  },
  {
    name: "ビタミンB群",
    nameEn: "B-Complex Vitamins",
    slug: "vitamin-b-complex",
    description:
      "エネルギー代謝と神経系の機能に不可欠。ストレス下で消費が増加します。",
    dosage: "B1〜B12の総合タイプ",
    benefits: ["エネルギー産生", "ストレス対策", "集中力"],
    evidenceLevel: "A",
  },
  {
    name: "オメガ3（EPA/DHA）",
    nameEn: "Omega-3 (EPA/DHA)",
    slug: "omega-3",
    description:
      "脳機能と心血管の健康をサポート。抗炎症作用によりストレス対策にも有効。",
    dosage: "1000〜2000mg/日",
    benefits: ["認知機能", "心血管保護", "抗炎症"],
    evidenceLevel: "A",
  },
  {
    name: "マグネシウム",
    nameEn: "Magnesium",
    slug: "magnesium",
    description:
      "ストレス軽減と睡眠の質改善に重要。デスクワークで不足しやすい。",
    dosage: "300〜400mg/日",
    benefits: ["ストレス軽減", "睡眠の質", "筋肉の緊張緩和"],
    evidenceLevel: "A",
  },
];

const healthIngredients = [
  {
    name: "ビタミンD",
    nameEn: "Vitamin D",
    slug: "vitamin-d",
    description: "免疫機能と気分の調整に重要。オフィスワーカーは不足しやすい。",
    dosage: "1000〜2000IU/日",
    benefits: ["免疫機能", "気分改善", "骨の健康"],
    evidenceLevel: "A",
  },
  {
    name: "CoQ10",
    nameEn: "Coenzyme Q10",
    slug: "coq10",
    description:
      "エネルギー産生と心血管の健康に重要。40歳以降は体内生成が減少します。",
    dosage: "100〜200mg/日",
    benefits: ["エネルギー産生", "心血管保護", "抗酸化"],
    evidenceLevel: "A",
  },
  {
    name: "プロバイオティクス",
    nameEn: "Probiotics",
    slug: "probiotics",
    description: "腸内環境の改善により、免疫機能と気分の調整をサポート。",
    dosage: "10億〜100億CFU/日",
    benefits: ["腸内環境", "免疫機能", "気分改善"],
    evidenceLevel: "A",
  },
];

const tips = [
  {
    icon: Clock,
    title: "朝のルーティン化",
    description:
      "ビタミンB群、ビタミンD、オメガ3は朝食と一緒に摂取。ロディオラやカフェイン+L-テアニンは仕事開始前に摂ることで、1日のパフォーマンスが向上します。",
    color: systemColors.blue,
  },
  {
    icon: Moon,
    title: "睡眠を犠牲にしない",
    description:
      "どんなサプリメントも睡眠不足の代わりにはなりません。マグネシウムは夕食後に摂取し、質の高い睡眠を確保することが最も重要です。",
    color: systemColors.indigo,
  },
  {
    icon: Utensils,
    title: "ランチを見直す",
    description:
      "外食やコンビニ弁当が多い方は、魚（オメガ3）、野菜、全粒穀物を意識的に選びましょう。午後のパフォーマンス低下を防げます。",
    color: systemColors.green,
  },
  {
    icon: Stethoscope,
    title: "定期的な健康診断",
    description:
      "ビタミンD、ビタミンB12、鉄などの血中濃度を定期的に検査し、不足している栄養素を特定することで、効果的にサプリメントを活用できます。",
    color: systemColors.orange,
  },
];

const getTierColor = (level: string) => {
  if (level in tierColors) {
    return tierColors[level as keyof typeof tierColors];
  }
  return tierColors.B;
};

export default function BusinessProfessionalsPage() {
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
        <div className="container mx-auto px-4 py-3">
          <div
            className="flex items-center gap-2 text-[13px]"
            style={{ color: appleWebColors.textSecondary }}
          >
            <Link
              href="/"
              className="transition-colors"
              style={{ color: systemColors.blue }}
            >
              ホーム
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href="/guide/audiences"
              className="transition-colors"
              style={{ color: systemColors.blue }}
            >
              対象者別ガイド
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span style={{ color: appleWebColors.textPrimary }}>
              ビジネスパーソン向け
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section
        className="py-16 sm:py-20 lg:py-24 border-b"
        style={{
          background: `linear-gradient(135deg, ${systemColors.blue}08 0%, rgba(255, 255, 255, 0.9) 50%, ${systemColors.indigo}08 100%)`,
          borderColor: appleWebColors.borderSubtle,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-[24px] mb-6"
              style={{
                backgroundColor: `${systemColors.blue}10`,
                color: systemColors.blue,
              }}
            >
              <Briefcase className="w-10 h-10" />
            </div>
            <h1
              className="text-[34px] sm:text-[40px] lg:text-[48px] font-bold mb-4 leading-tight tracking-tight"
              style={{ color: appleWebColors.textPrimary }}
            >
              ビジネスパーソン向け
              <br className="sm:hidden" />
              サプリメントガイド
            </h1>
            <p
              className="text-[17px] sm:text-[19px] mb-4"
              style={{ color: appleWebColors.textSecondary }}
            >
              仕事のパフォーマンスを最大化し、健康を維持する
            </p>
            <p
              className="text-[15px] max-w-2xl mx-auto leading-relaxed"
              style={{ color: appleWebColors.textSecondary }}
            >
              長時間労働、ストレス、不規則な食事に対応した、
              科学的根拠に基づくサプリメントをご紹介します。
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <div
                className={`rounded-[16px] px-6 py-4 border ${liquidGlassClasses.light}`}
                style={{
                  borderColor: appleWebColors.borderSubtle,
                }}
              >
                <div
                  className="text-[28px] font-bold"
                  style={{ color: systemColors.blue }}
                >
                  {performanceIngredients.length}
                </div>
                <div
                  className="text-[13px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  パフォーマンス成分
                </div>
              </div>
              <div
                className={`rounded-[16px] px-6 py-4 border ${liquidGlassClasses.light}`}
                style={{
                  borderColor: appleWebColors.borderSubtle,
                }}
              >
                <div
                  className="text-[28px] font-bold"
                  style={{ color: systemColors.indigo }}
                >
                  {healthIngredients.length}
                </div>
                <div
                  className="text-[13px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  健康維持成分
                </div>
              </div>
              <div
                className={`rounded-[16px] px-6 py-4 border ${liquidGlassClasses.light}`}
                style={{
                  borderColor: appleWebColors.borderSubtle,
                }}
              >
                <div
                  className="text-[28px] font-bold"
                  style={{ color: systemColors.green }}
                >
                  4
                </div>
                <div
                  className="text-[13px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  実践ポイント
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div
            className="max-w-4xl mx-auto rounded-[16px] p-6 border"
            style={{
              backgroundColor: `${systemColors.orange}08`,
              borderColor: `${systemColors.orange}20`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-[12px] flex items-center justify-center"
                style={{
                  backgroundColor: `${systemColors.orange}15`,
                  color: systemColors.orange,
                }}
              >
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3
                  className="font-semibold text-[17px] mb-2"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  重要な注意事項
                </h3>
                <p
                  className="text-[15px] mb-2 leading-relaxed"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  サプリメントは補助的なものです。十分な睡眠、バランスの取れた食事、適度な運動、ストレス管理が仕事のパフォーマンスと健康の基本です。
                </p>
                <p
                  className="text-[13px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  慢性的な疲労やストレスが続く場合は、サプリメントに頼るのではなく、医師に相談し、生活習慣の見直しを優先してください。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Ingredients */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium mb-4"
                style={{
                  backgroundColor: `${systemColors.blue}10`,
                  color: systemColors.blue,
                }}
              >
                <Zap className="w-4 h-4" />
                パフォーマンス向上
              </div>
              <h2
                className="text-[28px] sm:text-[34px] font-bold mb-3"
                style={{ color: appleWebColors.textPrimary }}
              >
                パフォーマンス向上成分
              </h2>
              <p
                className="text-[15px] max-w-2xl mx-auto"
                style={{ color: appleWebColors.textSecondary }}
              >
                集中力、エネルギー、ストレス対策に効果的な成分です。
              </p>
            </div>

            <div className="space-y-4">
              {performanceIngredients.map((ingredient) => {
                const tierColor = getTierColor(ingredient.evidenceLevel);
                return (
                  <Link
                    key={ingredient.slug}
                    href={`/ingredients/${ingredient.slug}`}
                    className={`group block rounded-[16px] border transition-all duration-300 hover:-translate-y-1 overflow-hidden ${liquidGlassClasses.light}`}
                    style={{
                      borderColor: appleWebColors.borderSubtle,
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                    }}
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3
                              className="text-[17px] font-semibold group-hover:opacity-80 transition-opacity"
                              style={{ color: appleWebColors.textPrimary }}
                            >
                              {ingredient.name}
                            </h3>
                            <span
                              className="text-[13px]"
                              style={{ color: appleWebColors.textSecondary }}
                            >
                              ({ingredient.nameEn})
                            </span>
                            <span
                              className="text-[11px] px-2 py-1 rounded-full font-semibold"
                              style={{
                                backgroundColor: tierColor.bg,
                                color: tierColor.text,
                              }}
                            >
                              {ingredient.evidenceLevel}ランク
                            </span>
                          </div>
                          <p
                            className="text-[15px] mb-4 leading-relaxed"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            {ingredient.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {ingredient.benefits.map((benefit, idx) => (
                              <span
                                key={idx}
                                className="text-[13px] px-3 py-1.5 rounded-full"
                                style={{
                                  backgroundColor: `${systemColors.blue}10`,
                                  color: systemColors.blue,
                                }}
                              >
                                {benefit}
                              </span>
                            ))}
                          </div>
                          <div
                            className="flex items-center text-[15px] font-medium"
                            style={{ color: systemColors.blue }}
                          >
                            詳細を見る
                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                        <div
                          className="rounded-[12px] px-5 py-4 md:min-w-[180px] text-center border"
                          style={{
                            backgroundColor: appleWebColors.sectionBackground,
                            borderColor: appleWebColors.borderSubtle,
                          }}
                        >
                          <div
                            className="text-[11px] font-medium mb-1"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            推奨摂取量
                          </div>
                          <div
                            className="text-[15px] font-semibold"
                            style={{ color: appleWebColors.textPrimary }}
                          >
                            {ingredient.dosage}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Health Ingredients */}
      <section
        className="py-12 sm:py-16 border-y"
        style={{
          backgroundColor: appleWebColors.sectionBackground,
          borderColor: appleWebColors.borderSubtle,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium mb-4"
                style={{
                  backgroundColor: `${systemColors.green}10`,
                  color: systemColors.green,
                }}
              >
                <Shield className="w-4 h-4" />
                健康維持
              </div>
              <h2
                className="text-[28px] sm:text-[34px] font-bold mb-3"
                style={{ color: appleWebColors.textPrimary }}
              >
                健康維持成分
              </h2>
              <p
                className="text-[15px] max-w-2xl mx-auto"
                style={{ color: appleWebColors.textSecondary }}
              >
                免疫機能と長期的な健康をサポートする成分です。
              </p>
            </div>

            <div className="space-y-4">
              {healthIngredients.map((ingredient) => {
                const tierColor = getTierColor(ingredient.evidenceLevel);
                return (
                  <Link
                    key={ingredient.slug}
                    href={`/ingredients/${ingredient.slug}`}
                    className={`group block rounded-[16px] border transition-all duration-300 hover:-translate-y-1 overflow-hidden ${liquidGlassClasses.light}`}
                    style={{
                      borderColor: appleWebColors.borderSubtle,
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                    }}
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3
                              className="text-[17px] font-semibold group-hover:opacity-80 transition-opacity"
                              style={{ color: appleWebColors.textPrimary }}
                            >
                              {ingredient.name}
                            </h3>
                            <span
                              className="text-[13px]"
                              style={{ color: appleWebColors.textSecondary }}
                            >
                              ({ingredient.nameEn})
                            </span>
                            <span
                              className="text-[11px] px-2 py-1 rounded-full font-semibold"
                              style={{
                                backgroundColor: tierColor.bg,
                                color: tierColor.text,
                              }}
                            >
                              {ingredient.evidenceLevel}ランク
                            </span>
                          </div>
                          <p
                            className="text-[15px] mb-4 leading-relaxed"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            {ingredient.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {ingredient.benefits.map((benefit, idx) => (
                              <span
                                key={idx}
                                className="text-[13px] px-3 py-1.5 rounded-full"
                                style={{
                                  backgroundColor: `${systemColors.green}10`,
                                  color: systemColors.green,
                                }}
                              >
                                {benefit}
                              </span>
                            ))}
                          </div>
                          <div
                            className="flex items-center text-[15px] font-medium"
                            style={{ color: systemColors.blue }}
                          >
                            詳細を見る
                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                        <div
                          className="rounded-[12px] px-5 py-4 md:min-w-[160px] text-center border"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            borderColor: appleWebColors.borderSubtle,
                          }}
                        >
                          <div
                            className="text-[11px] font-medium mb-1"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            推奨摂取量
                          </div>
                          <div
                            className="text-[15px] font-semibold"
                            style={{ color: appleWebColors.textPrimary }}
                          >
                            {ingredient.dosage}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2
                className="text-[28px] sm:text-[34px] font-bold mb-3"
                style={{ color: appleWebColors.textPrimary }}
              >
                ビジネスパーソンの
                <br className="sm:hidden" />
                サプリメント使用のポイント
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className={`rounded-[16px] p-6 border transition-all duration-300 hover:-translate-y-1 ${liquidGlassClasses.light}`}
                  style={{
                    borderColor: appleWebColors.borderSubtle,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-[12px] mb-4"
                    style={{
                      backgroundColor: `${tip.color}10`,
                      color: tip.color,
                    }}
                  >
                    <tip.icon className="w-6 h-6" />
                  </div>
                  <h3
                    className="text-[17px] font-semibold mb-2"
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
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-12 sm:py-16 border-t"
        style={{
          backgroundColor: appleWebColors.sectionBackground,
          borderColor: appleWebColors.borderSubtle,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className="text-[28px] font-bold mb-4"
              style={{ color: appleWebColors.textPrimary }}
            >
              さらに詳しい成分情報を確認
            </h2>
            <p
              className="text-[15px] mb-8 max-w-xl mx-auto"
              style={{ color: appleWebColors.textSecondary }}
            >
              各成分の詳細ページで、効果、摂取方法、副作用、相互作用などの詳しい情報をご覧いただけます。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ingredients"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-[17px] min-h-[48px] transition-all hover:opacity-90"
                style={{
                  backgroundColor: systemColors.blue,
                  color: "#FFFFFF",
                }}
              >
                成分一覧を見る
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/guide/audiences"
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-[17px] min-h-[48px] border transition-all hover:-translate-y-0.5 ${liquidGlassClasses.light}`}
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
