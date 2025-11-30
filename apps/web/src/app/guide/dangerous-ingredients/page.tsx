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

export const metadata: Metadata = {
  title: "危険成分ガイド | Suptia（サプティア）",
  description:
    "サプリメント成分の危険性・注意事項を科学的根拠に基づいて解説。妊娠中・授乳中の方、持病のある方、薬を服用中の方は必ずチェックしてください。",
  openGraph: {
    title: "危険成分ガイド | Suptia",
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
    color: "from-red-500 to-rose-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-900",
    icon: AlertTriangle,
    description: "使用前に必ず医師に相談してください",
  },
  high: {
    label: "高リスク",
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-900",
    icon: AlertCircle,
    description: "広範囲で注意が必要です",
  },
  medium: {
    label: "中リスク",
    color: "from-yellow-500 to-amber-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-900",
    icon: Info,
    description: "特定の条件下で注意してください",
  },
  low: {
    label: "低リスク",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-900",
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
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Global Background */}
      <div className="absolute inset-0 bg-slate-50 -z-50" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-rose-600 to-orange-600 py-24 lg:py-32">
        {/* Background Animation */}
        <div
          className="absolute inset-0 animate-gradient-drift bg-gradient-to-r from-red-600 via-rose-500 to-red-600 -z-20 opacity-90"
          style={{ animationDuration: "15s" }}
        />
        <div
          className="absolute inset-0 animate-gradient-drift bg-gradient-to-br from-transparent via-white/10 to-transparent -z-19 mix-blend-overlay"
          style={{
            animationDuration: "20s",
            animationDirection: "reverse",
            backgroundSize: "200% 200%",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 -z-15 pointer-events-none" />

        {/* Mist Layers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div
            className="absolute top-[-30%] left-[-10%] w-[80vw] h-[80vw] bg-white/10 blur-[120px] rounded-full animate-mist-flow"
            style={{ animationDuration: "45s" }}
          />
          <div
            className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-orange-300/20 blur-[100px] rounded-full animate-mist-flow"
            style={{ animationDuration: "35s", animationDirection: "reverse" }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-12 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 backdrop-blur-md border border-white/30 shadow-lg animate-fade-in">
            <AlertTriangle
              size={18}
              className="text-yellow-300 animate-pulse"
            />
            <span className="text-sm font-bold text-white tracking-wide">
              安全性チェック
            </span>
          </div>

          <h1
            className="mb-8 text-4xl font-black leading-tight lg:text-7xl text-white drop-shadow-lg animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            危険成分ガイド
          </h1>

          <p
            className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-white/90 lg:text-2xl font-medium animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            サプリメント成分の危険性・注意事項を科学的根拠に基づいて解説。
            <br className="hidden sm:block" />
            あなたの安全を守るための重要な情報をご確認ください。
          </p>

          {/* Stats */}
          <div
            className="flex flex-wrap justify-center gap-6 mt-12 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/30">
              <div className="text-3xl font-black text-white">
                {totalRiskyIngredients}
              </div>
              <div className="text-sm text-white/80 font-medium">
                注意成分を収録
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/30">
              <div className="text-3xl font-black text-white">
                {criticalCount + highCount}
              </div>
              <div className="text-sm text-white/80 font-medium">
                要注意成分
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/30">
              <div className="text-3xl font-black text-white">
                {Object.keys(contraindicationLabels).length}
              </div>
              <div className="text-sm text-white/80 font-medium">
                禁忌カテゴリ
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="relative z-10 -mt-16 px-6 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div
            className="bg-white rounded-3xl shadow-xl p-8 border border-red-100 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 rounded-2xl">
                <AlertTriangle className="text-red-600" size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-900 mb-3">
                  重要な免責事項
                </h2>
                <ul className="space-y-2 text-red-800">
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      size={16}
                      className="mt-1 flex-shrink-0 text-red-500"
                    />
                    <span>
                      このガイドは一般的な情報提供を目的としており、医学的アドバイスではありません
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      size={16}
                      className="mt-1 flex-shrink-0 text-red-500"
                    />
                    <span>
                      サプリメントを開始する前に、必ず医師または薬剤師に相談してください
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      size={16}
                      className="mt-1 flex-shrink-0 text-red-500"
                    />
                    <span>
                      妊娠中・授乳中、持病がある場合、薬を服用中の場合は特に注意が必要です
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight
                      size={16}
                      className="mt-1 flex-shrink-0 text-red-500"
                    />
                    <span>
                      異常を感じたらすぐに使用を中止し、医療機関を受診してください
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Level Sections */}
      <section className="py-24 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 lg:text-5xl tracking-tight mb-6">
              リスクレベル別一覧
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              成分のリスクレベルに応じて、適切な注意を払いましょう。
            </p>
          </div>

          <div className="space-y-12">
            {Object.entries(groupedByRisk).map(([level, ingredients]) => {
              const config =
                riskLevelConfig[level as keyof typeof riskLevelConfig];
              if (ingredients.length === 0) return null;

              const IconComponent = config.icon;

              return (
                <div key={level} className="space-y-6">
                  {/* Risk Level Header */}
                  <div
                    className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${config.color} p-6 shadow-lg`}
                  >
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                          <IconComponent className="text-white" size={32} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">
                            {config.label}
                          </h3>
                          <p className="text-white/80 font-medium">
                            {config.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-black text-white">
                          {ingredients.length}
                        </div>
                        <div className="text-sm text-white/80 font-medium">
                          件
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ingredients Grid */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {ingredients.map((ingredient, index) => (
                      <Link
                        key={ingredient._id}
                        href={`/ingredients/${ingredient.slug.current}`}
                        className="group animate-fade-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div
                          className={`relative h-full overflow-hidden rounded-2xl ${config.bgColor} p-6 border ${config.borderColor} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <IconComponent
                                size={20}
                                className={config.textColor}
                              />
                              <h4
                                className={`font-bold text-lg ${config.textColor}`}
                              >
                                {ingredient.name}
                              </h4>
                            </div>
                            <ArrowRight
                              size={18}
                              className={`${config.textColor} opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all`}
                            />
                          </div>

                          {ingredient.category && (
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${config.bgColor} border ${config.borderColor} ${config.textColor} mb-3`}
                            >
                              {ingredient.category}
                            </span>
                          )}

                          {ingredient.description && (
                            <p
                              className={`text-sm ${config.textColor} opacity-80 line-clamp-2 mb-4`}
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
                                      className="text-xs px-2 py-1 bg-white/80 rounded-full font-medium text-slate-700"
                                    >
                                      {contraindicationLabels[tag] || tag}
                                    </span>
                                  ))}
                                {ingredient.contraindications.length > 3 && (
                                  <span className="text-xs px-2 py-1 bg-white/80 rounded-full font-medium text-slate-500">
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
      <section className="py-24 px-6 lg:px-12 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-100 px-5 py-2 border border-amber-200">
              <Shield size={18} className="text-amber-600" />
              <span className="text-sm font-bold text-amber-800 tracking-wide">
                パーソナライズドチェック
              </span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 lg:text-5xl tracking-tight mb-6">
              あなたの状況をチェック
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
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
      <section className="relative overflow-hidden py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-12">
          <h2 className="mb-6 text-3xl font-black text-white lg:text-5xl">
            成分について詳しく知る
          </h2>
          <p className="mb-10 text-xl text-slate-300 font-medium">
            各成分の詳細ページで、効果、副作用、相互作用などの
            <br className="hidden sm:block" />
            詳しい情報を確認できます。
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/ingredients"
              className="group flex items-center gap-2 rounded-full bg-white px-10 py-5 font-bold text-slate-900 shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
            >
              全成分ガイドを見る
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/guide/purposes"
              className="group flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-10 py-5 font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white"
            >
              目的別ガイドを見る
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
