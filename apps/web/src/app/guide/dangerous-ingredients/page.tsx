import { Metadata } from "next";
import { sanity } from "@/lib/sanity.client";
import Link from "next/link";
import {
  AlertTriangle,
  Shield,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronRight,
} from "lucide-react";
import { ContraindicationChecklist } from "@/components/ContraindicationChecklist";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

export const metadata: Metadata = {
  title: "危険成分ガイド | サプティア（Suptia）",
  description:
    "サプリメント成分の危険性・注意事項を科学的根拠に基づいて解説。妊娠中・授乳中の方、持病のある方、薬を服用中の方は必ずチェックしてください。",
  openGraph: {
    title: "危険成分ガイド | サプティア",
    description: "サプリメント成分の危険性・注意事項を科学的根拠に基づいて解説",
    type: "website",
  },
};

interface IngredientWithRisk {
  _id: string;
  name: string;
  nameEn: string;
  slug: { current: string };
  category: string;
  description?: string;
  riskLevel?: "low" | "medium" | "high" | "critical";
  contraindications?: string[];
  specialWarnings?: Array<{
    severity: "critical" | "warning" | "info";
    message: string;
    affectedGroups?: string[];
  }>;
  overdoseRisks?: string[];
  sideEffects?: string[];
  interactions?: string[];
}

async function getIngredientsWithRisks(): Promise<IngredientWithRisk[]> {
  const query = `*[_type == "ingredient" && defined(riskLevel)] | order(riskLevel desc, name asc) {
    _id,
    name,
    nameEn,
    slug,
    category,
    description,
    riskLevel,
    contraindications,
    specialWarnings,
    overdoseRisks,
    sideEffects,
    interactions
  }`;

  return sanity.fetch(query);
}

async function getAllIngredients(): Promise<IngredientWithRisk[]> {
  const query = `*[_type == "ingredient"] | order(name asc) {
    _id,
    name,
    nameEn,
    slug,
    category,
    riskLevel,
    contraindications
  }`;

  return sanity.fetch(query);
}

const riskLevelConfig = {
  critical: {
    label: "最高リスク",
    color: systemColors.red,
    bgColor: `${systemColors.red}10`,
    borderColor: `${systemColors.red}30`,
    icon: AlertTriangle,
    description: "使用前に必ず医師に相談してください",
  },
  high: {
    label: "高リスク",
    color: systemColors.orange,
    bgColor: `${systemColors.orange}10`,
    borderColor: `${systemColors.orange}30`,
    icon: AlertCircle,
    description: "広範囲で注意が必要です",
  },
  medium: {
    label: "中リスク",
    color: systemColors.yellow,
    bgColor: `${systemColors.yellow}10`,
    borderColor: `${systemColors.yellow}30`,
    icon: Info,
    description: "特定の条件下で注意してください",
  },
  low: {
    label: "低リスク",
    color: systemColors.blue,
    bgColor: `${systemColors.blue}10`,
    borderColor: `${systemColors.blue}30`,
    icon: CheckCircle2,
    description: "一般的に安全ですが、過剰摂取には注意",
  },
};

const contraindicationLabels: Record<string, string> = {
  pregnant: "妊娠中",
  breastfeeding: "授乳中",
  infants: "乳幼児",
  children: "小児",
  elderly: "高齢者",
  "blood-clotting-disorder": "血液凝固障害",
  "bleeding-risk": "出血リスク",
  surgery: "手術前後",
  diabetes: "糖尿病",
  hypertension: "高血圧",
  hypotension: "低血圧",
  "kidney-disease": "腎臓病",
  "liver-disease": "肝臓病",
  "heart-disease": "心疾患",
  "thyroid-disorder": "甲状腺疾患",
  "autoimmune-disease": "自己免疫疾患",
  "digestive-disorder": "消化器疾患",
  epilepsy: "てんかん",
  "mental-disorder": "精神疾患",
  "anticoagulant-use": "抗凝固薬服用中",
  "antiplatelet-use": "抗血小板薬服用中",
  "antidepressant-use": "抗うつ薬服用中",
  "anticonvulsant-use": "抗てんかん薬服用中",
  "immunosuppressant-use": "免疫抑制薬服用中",
  "hormone-therapy": "ホルモン剤服用中",
  chemotherapy: "化学療法中",
  "allergy-prone": "アレルギー体質",
  "shellfish-allergy": "貝アレルギー",
  "soy-allergy": "大豆アレルギー",
  "nut-allergy": "ナッツアレルギー",
  hypercalcemia: "高カルシウム血症",
  hemochromatosis: "鉄過剰症",
  "stomach-ulcer": "胃潰瘍",
  smoking: "喫煙者",
  asthma: "喘息",
};

export default async function DangerousIngredientsPage() {
  const riskyIngredients = await getIngredientsWithRisks();
  const allIngredients = await getAllIngredients();

  const groupedByRisk = {
    critical: riskyIngredients.filter((i) => i.riskLevel === "critical"),
    high: riskyIngredients.filter((i) => i.riskLevel === "high"),
    medium: riskyIngredients.filter((i) => i.riskLevel === "medium"),
    low: riskyIngredients.filter((i) => i.riskLevel === "low"),
  };

  const contraindicationMap = new Map<string, IngredientWithRisk[]>();
  allIngredients.forEach((ingredient) => {
    if (ingredient.contraindications) {
      ingredient.contraindications.forEach((tag) => {
        if (!contraindicationMap.has(tag)) {
          contraindicationMap.set(tag, []);
        }
        contraindicationMap.get(tag)!.push(ingredient);
      });
    }
  });

  const totalRiskyIngredients = riskyIngredients.length;
  const criticalCount = groupedByRisk.critical.length;
  const highCount = groupedByRisk.high.length;

  return (
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
          background: `linear-gradient(135deg, ${systemColors.red}08 0%, rgba(255, 255, 255, 0.9) 50%, ${systemColors.orange}08 100%)`,
          borderColor: appleWebColors.borderSubtle,
        }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="text-center">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6"
              style={{
                backgroundColor: `${systemColors.red}15`,
                border: `1px solid ${systemColors.red}30`,
              }}
            >
              <AlertTriangle size={16} style={{ color: systemColors.red }} />
              <span
                className="text-[13px] font-semibold"
                style={{ color: systemColors.red }}
              >
                安全性チェック
              </span>
            </div>

            <h1
              className="text-[34px] sm:text-[40px] lg:text-[48px] font-bold leading-tight tracking-[-0.015em] mb-4"
              style={{ color: appleWebColors.textPrimary }}
            >
              危険成分ガイド
            </h1>

            <p
              className="text-[17px] sm:text-[20px] max-w-3xl mx-auto leading-relaxed mb-10"
              style={{ color: appleWebColors.textSecondary }}
            >
              サプリメント成分の危険性・注意事項を科学的根拠に基づいて解説。
              <br className="hidden sm:block" />
              あなたの安全を守るための重要な情報をご確認ください。
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4">
              <div
                className={`rounded-[16px] px-6 py-4 border ${liquidGlassClasses.light}`}
                style={{
                  borderColor: appleWebColors.borderSubtle,
                }}
              >
                <div
                  className="text-[28px] font-bold"
                  style={{ color: systemColors.red }}
                >
                  {totalRiskyIngredients}
                </div>
                <div
                  className="text-[13px] font-medium"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  注意成分を収録
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
                  style={{ color: systemColors.orange }}
                >
                  {criticalCount + highCount}
                </div>
                <div
                  className="text-[13px] font-medium"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  要注意成分
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
                  {Object.keys(contraindicationLabels).length}
                </div>
                <div
                  className="text-[13px] font-medium"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  禁忌カテゴリ
                </div>
              </div>
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
              backgroundColor: `${systemColors.red}08`,
              borderColor: `${systemColors.red}30`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="p-3 rounded-[12px] flex-shrink-0"
                style={{ backgroundColor: `${systemColors.red}15` }}
              >
                <AlertTriangle size={24} style={{ color: systemColors.red }} />
              </div>
              <div>
                <h2
                  className="text-[17px] font-bold mb-3"
                  style={{ color: systemColors.red }}
                >
                  重要な免責事項
                </h2>
                <ul className="space-y-2">
                  {[
                    "このガイドは一般的な情報提供を目的としており、医学的アドバイスではありません",
                    "サプリメントを開始する前に、必ず医師または薬剤師に相談してください",
                    "妊娠中・授乳中、持病がある場合、薬を服用中の場合は特に注意が必要です",
                    "異常を感じたらすぐに使用を中止し、医療機関を受診してください",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ChevronRight
                        size={16}
                        className="mt-0.5 flex-shrink-0"
                        style={{ color: systemColors.red }}
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

      {/* Risk Level Sections */}
      <section className="py-12 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2
              className="text-[28px] sm:text-[34px] font-bold tracking-[-0.015em] mb-4"
              style={{ color: appleWebColors.textPrimary }}
            >
              リスクレベル別一覧
            </h2>
            <p
              className="text-[17px] max-w-2xl mx-auto"
              style={{ color: appleWebColors.textSecondary }}
            >
              成分のリスクレベルに応じて、適切な注意を払いましょう。
            </p>
          </div>

          <div className="space-y-10">
            {Object.entries(groupedByRisk).map(([level, ingredients]) => {
              const config =
                riskLevelConfig[level as keyof typeof riskLevelConfig];
              if (ingredients.length === 0) return null;

              const IconComponent = config.icon;

              return (
                <div key={level} className="space-y-4">
                  {/* Risk Level Header */}
                  <div
                    className="rounded-[16px] p-5 border"
                    style={{
                      backgroundColor: config.bgColor,
                      borderColor: config.borderColor,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="p-3 rounded-[12px]"
                          style={{ backgroundColor: `${config.color}20` }}
                        >
                          <IconComponent
                            size={24}
                            style={{ color: config.color }}
                          />
                        </div>
                        <div>
                          <h3
                            className="text-[20px] font-bold"
                            style={{ color: config.color }}
                          >
                            {config.label}
                          </h3>
                          <p
                            className="text-[14px]"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            {config.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className="text-[28px] font-bold"
                          style={{ color: config.color }}
                        >
                          {ingredients.length}
                        </div>
                        <div
                          className="text-[13px]"
                          style={{ color: appleWebColors.textSecondary }}
                        >
                          件
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ingredients Grid */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {ingredients.map((ingredient) => (
                      <Link
                        key={ingredient._id}
                        href={`/ingredients/${ingredient.slug.current}`}
                        className="group"
                      >
                        <div
                          className={`h-full rounded-[16px] p-5 border transition-all duration-300 hover:-translate-y-1 ${liquidGlassClasses.light}`}
                          style={{
                            borderColor: appleWebColors.borderSubtle,
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                          }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <IconComponent
                                size={18}
                                style={{ color: config.color }}
                              />
                              <h4
                                className="font-bold text-[17px]"
                                style={{ color: appleWebColors.textPrimary }}
                              >
                                {ingredient.name}
                              </h4>
                            </div>
                            <ArrowRight
                              size={16}
                              className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                              style={{ color: systemColors.blue }}
                            />
                          </div>

                          {ingredient.category && (
                            <span
                              className="inline-block px-3 py-1 rounded-full text-[12px] font-medium mb-3"
                              style={{
                                backgroundColor: config.bgColor,
                                color: config.color,
                                border: `1px solid ${config.borderColor}`,
                              }}
                            >
                              {ingredient.category}
                            </span>
                          )}

                          {ingredient.description && (
                            <p
                              className="text-[14px] leading-relaxed line-clamp-2 mb-4"
                              style={{ color: appleWebColors.textSecondary }}
                            >
                              {ingredient.description}
                            </p>
                          )}

                          {ingredient.contraindications &&
                            ingredient.contraindications.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {ingredient.contraindications
                                  .slice(0, 3)
                                  .map((tag) => (
                                    <span
                                      key={tag}
                                      className="text-[11px] px-2 py-1 rounded-full font-medium"
                                      style={{
                                        backgroundColor:
                                          appleWebColors.sectionBackground,
                                        color: appleWebColors.textSecondary,
                                      }}
                                    >
                                      {contraindicationLabels[tag] || tag}
                                    </span>
                                  ))}
                                {ingredient.contraindications.length > 3 && (
                                  <span
                                    className="text-[11px] px-2 py-1 rounded-full font-medium"
                                    style={{
                                      backgroundColor:
                                        appleWebColors.sectionBackground,
                                      color: appleWebColors.textTertiary,
                                    }}
                                  >
                                    +{ingredient.contraindications.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contraindication Checklist Section */}
      <section
        className="py-16 sm:py-20 px-6 lg:px-12"
        style={{ backgroundColor: appleWebColors.sectionBackground }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6"
              style={{
                backgroundColor: `${systemColors.orange}15`,
                border: `1px solid ${systemColors.orange}30`,
              }}
            >
              <Shield size={16} style={{ color: systemColors.orange }} />
              <span
                className="text-[13px] font-semibold"
                style={{ color: systemColors.orange }}
              >
                パーソナライズドチェック
              </span>
            </div>
            <h2
              className="text-[28px] sm:text-[34px] font-bold tracking-[-0.015em] mb-4"
              style={{ color: appleWebColors.textPrimary }}
            >
              あなたの状況をチェック
            </h2>
            <p
              className="text-[17px] max-w-2xl mx-auto"
              style={{ color: appleWebColors.textSecondary }}
            >
              該当する項目をクリックして、注意が必要な成分を確認しましょう。
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <ContraindicationChecklist
              contraindicationMap={contraindicationMap}
              contraindicationLabels={contraindicationLabels}
            />
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
              成分について詳しく知る
            </h2>
            <p
              className="text-[17px] mb-8 max-w-2xl mx-auto leading-relaxed"
              style={{ color: appleWebColors.textSecondary }}
            >
              各成分の詳細ページで、効果、副作用、相互作用などの
              詳しい情報を確認できます。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/ingredients"
                className="group flex items-center gap-2 rounded-full px-8 py-4 font-semibold text-white transition-all hover:scale-[1.02] min-h-[48px]"
                style={{
                  background: `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.purple} 100%)`,
                  boxShadow: `0 4px 16px ${systemColors.blue}40`,
                }}
              >
                全成分ガイドを見る
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/guide/purposes"
                className={`group flex items-center gap-2 rounded-full px-8 py-4 font-semibold transition-all hover:scale-[1.02] min-h-[48px] border ${liquidGlassClasses.light}`}
                style={{
                  borderColor: appleWebColors.borderSubtle,
                  color: appleWebColors.textPrimary,
                }}
              >
                目的別ガイドを見る
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
  );
}
