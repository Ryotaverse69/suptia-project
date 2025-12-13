import Link from "next/link";
import { Metadata } from "next";
import {
  BookOpen,
  AlertTriangle,
  ChevronRight,
  Brain,
  Shield,
  Coffee,
  Moon,
  Apple,
  Coins,
  GraduationCap,
} from "lucide-react";
import {
  systemColors,
  appleWebColors,
  fontStack,
  tierColors,
  liquidGlassClasses,
} from "@/lib/design-system";

export const metadata: Metadata = {
  title: "学生向けサプリメントガイド | Suptia",
  description:
    "学業のパフォーマンス向上に効果的なサプリメントを科学的根拠に基づいて解説。集中力、記憶力、ストレス対策をサポートする成分をご紹介します。",
};

const cognitiveIngredients = [
  {
    name: "オメガ3（DHA/EPA）",
    nameEn: "Omega-3 (DHA/EPA)",
    slug: "omega-3",
    description:
      "脳の構成成分として重要。学習能力と記憶力のサポートに役立ちます。",
    dosage: "DHA 500〜1000mg/日",
    benefits: ["記憶力向上", "集中力向上", "脳の健康"],
    evidenceLevel: "A",
  },
  {
    name: "カフェイン + L-テアニン",
    nameEn: "Caffeine + L-Theanine",
    slug: "caffeine",
    description:
      "カフェインの覚醒効果とL-テアニンのリラックス効果の組み合わせで、穏やかな集中力が得られます。",
    dosage: "カフェイン100mg + L-テアニン200mg",
    benefits: ["集中力向上", "覚醒効果", "不安軽減"],
    evidenceLevel: "A",
  },
  {
    name: "ビタミンB群",
    nameEn: "B-Complex Vitamins",
    slug: "vitamin-b-complex",
    description:
      "神経伝達物質の合成とエネルギー代謝に不可欠。ストレス対策にも有効。",
    dosage: "B1〜B12の総合タイプ",
    benefits: ["エネルギー産生", "集中力", "ストレス対策"],
    evidenceLevel: "A",
  },
  {
    name: "マグネシウム",
    nameEn: "Magnesium",
    slug: "magnesium",
    description:
      "神経系の機能とストレス対策に重要。睡眠の質改善にも役立ちます。",
    dosage: "300〜400mg/日",
    benefits: ["ストレス軽減", "睡眠の質", "集中力"],
    evidenceLevel: "A",
  },
  {
    name: "ロディオラ",
    nameEn: "Rhodiola",
    slug: "rhodiola",
    description: "適応促進ハーブ。試験期間中のストレスと疲労を軽減します。",
    dosage: "200〜600mg/日",
    benefits: ["ストレス対策", "疲労軽減", "集中力向上"],
    evidenceLevel: "B",
  },
];

const lifestyleIngredients = [
  {
    name: "ビタミンD",
    nameEn: "Vitamin D",
    slug: "vitamin-d",
    description:
      "免疫機能と気分の調整に重要。屋内で過ごす時間が長い学生は不足しがち。",
    dosage: "1000〜2000IU/日",
    benefits: ["免疫機能", "気分改善", "骨の健康"],
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
  {
    name: "亜鉛",
    nameEn: "Zinc",
    slug: "zinc",
    description:
      "免疫機能と認知機能の維持に重要。食生活が不規則だと不足しやすい。",
    dosage: "8〜11mg/日",
    benefits: ["免疫機能", "認知機能", "皮膚の健康"],
    evidenceLevel: "A",
  },
];

const tips = [
  {
    icon: Coffee,
    title: "カフェインは適量で",
    description:
      "1日400mg（コーヒー約4杯分）を超えないようにしましょう。夕方以降の摂取は睡眠の質を低下させる可能性があります。L-テアニンとの併用がおすすめ。",
    color: systemColors.orange,
  },
  {
    icon: Moon,
    title: "睡眠を最優先に",
    description:
      "どんなサプリメントも睡眠不足の代わりにはなりません。試験前でも7〜8時間の睡眠を確保することで、記憶の定着と集中力が大幅に向上します。",
    color: systemColors.indigo,
  },
  {
    icon: Apple,
    title: "食事が基本",
    description:
      "朝食を抜かず、魚、野菜、果物、全粒穀物をバランスよく摂取しましょう。特に朝食は学業パフォーマンスに大きく影響します。",
    color: systemColors.green,
  },
  {
    icon: Coins,
    title: "コスパ重視",
    description:
      "学生は予算に限りがあります。マルチビタミン、オメガ3、マグネシウムなど、コスパが良く効果が実証されている成分から始めましょう。",
    color: systemColors.blue,
  },
];

const getTierColor = (level: string) => {
  if (level in tierColors) {
    return tierColors[level as keyof typeof tierColors];
  }
  return tierColors.B;
};

export default function StudentsPage() {
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
            <span style={{ color: appleWebColors.textPrimary }}>学生向け</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section
        className="py-16 sm:py-20 lg:py-24 border-b"
        style={{
          background: `linear-gradient(135deg, ${systemColors.indigo}08 0%, rgba(255, 255, 255, 0.9) 50%, ${systemColors.purple}08 100%)`,
          borderColor: appleWebColors.borderSubtle,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-[24px] mb-6"
              style={{
                backgroundColor: `${systemColors.indigo}10`,
                color: systemColors.indigo,
              }}
            >
              <GraduationCap className="w-10 h-10" />
            </div>
            <h1
              className="text-[34px] sm:text-[40px] lg:text-[48px] font-bold mb-4 leading-tight tracking-tight"
              style={{ color: appleWebColors.textPrimary }}
            >
              学生向け
              <br className="sm:hidden" />
              サプリメントガイド
            </h1>
            <p
              className="text-[17px] sm:text-[19px] mb-4"
              style={{ color: appleWebColors.textSecondary }}
            >
              学業のパフォーマンスを最大化する栄養サポート
            </p>
            <p
              className="text-[15px] max-w-2xl mx-auto leading-relaxed"
              style={{ color: appleWebColors.textSecondary }}
            >
              集中力、記憶力、ストレス対策に効果的な成分を
              科学的根拠に基づいてご紹介します。試験期間を乗り切るために。
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
                  style={{ color: systemColors.indigo }}
                >
                  {cognitiveIngredients.length}
                </div>
                <div
                  className="text-[13px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  認知機能成分
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
                  style={{ color: systemColors.purple }}
                >
                  {lifestyleIngredients.length}
                </div>
                <div
                  className="text-[13px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  生活サポート成分
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
                  サプリメントは補助的なものです。十分な睡眠、バランスの取れた食事、適度な運動が学業パフォーマンスの基本です。
                </p>
                <p
                  className="text-[13px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  カフェインの過剰摂取（1日400mg以上）は不安や不眠を引き起こす可能性があります。適量を守りましょう。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cognitive Ingredients */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium mb-4"
                style={{
                  backgroundColor: `${systemColors.indigo}10`,
                  color: systemColors.indigo,
                }}
              >
                <Brain className="w-4 h-4" />
                認知機能サポート
              </div>
              <h2
                className="text-[28px] sm:text-[34px] font-bold mb-3"
                style={{ color: appleWebColors.textPrimary }}
              >
                認知機能サポート成分
              </h2>
              <p
                className="text-[15px] max-w-2xl mx-auto"
                style={{ color: appleWebColors.textSecondary }}
              >
                集中力、記憶力、学習能力をサポートする成分です。
              </p>
            </div>

            <div className="space-y-4">
              {cognitiveIngredients.map((ingredient) => {
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
                                  backgroundColor: `${systemColors.indigo}10`,
                                  color: systemColors.indigo,
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

      {/* Lifestyle Ingredients */}
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
                  backgroundColor: `${systemColors.purple}10`,
                  color: systemColors.purple,
                }}
              >
                <Shield className="w-4 h-4" />
                生活サポート
              </div>
              <h2
                className="text-[28px] sm:text-[34px] font-bold mb-3"
                style={{ color: appleWebColors.textPrimary }}
              >
                生活サポート成分
              </h2>
              <p
                className="text-[15px] max-w-2xl mx-auto"
                style={{ color: appleWebColors.textSecondary }}
              >
                免疫機能と全体的な健康をサポートする成分です。
              </p>
            </div>

            <div className="space-y-4">
              {lifestyleIngredients.map((ingredient) => {
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
                                  backgroundColor: `${systemColors.purple}10`,
                                  color: systemColors.purple,
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
                学生のサプリメント
                <br className="sm:hidden" />
                使用のポイント
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
                  backgroundColor: systemColors.indigo,
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
