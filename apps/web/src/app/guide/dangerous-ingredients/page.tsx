import { Metadata } from "next";
import { sanity } from "@/lib/sanity.client";
import Link from "next/link";
import type { Ingredient } from "@/data/ingredients";
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
    color: "bg-red-100 border-red-500 text-red-900",
    icon: "🚨",
    description: "使用前に必ず医師に相談してください",
  },
  high: {
    label: "高リスク",
    color: "bg-orange-100 border-orange-500 text-orange-900",
    icon: "⚠️",
    description: "広範囲で注意が必要です",
  },
  medium: {
    label: "中リスク",
    color: "bg-yellow-100 border-yellow-500 text-yellow-900",
    icon: "⚡",
    description: "特定の条件下で注意してください",
  },
  low: {
    label: "低リスク",
    color: "bg-blue-100 border-blue-500 text-blue-900",
    icon: "ℹ️",
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
  "immunosuppressant-use": "免疫抑制薬服用中",
  "hormone-therapy": "ホルモン剤服用中",
  chemotherapy: "化学療法中",
  "allergy-prone": "アレルギー体質",
  "shellfish-allergy": "貝アレルギー",
  "soy-allergy": "大豆アレルギー",
  "nut-allergy": "ナッツアレルギー",
};

export default async function DangerousIngredientsPage() {
  const riskyIngredients = await getIngredientsWithRisks();
  const allIngredients = await getAllIngredients();

  // リスクレベル別に分類
  const groupedByRisk = {
    critical: riskyIngredients.filter((i) => i.riskLevel === "critical"),
    high: riskyIngredients.filter((i) => i.riskLevel === "high"),
    medium: riskyIngredients.filter((i) => i.riskLevel === "medium"),
    low: riskyIngredients.filter((i) => i.riskLevel === "low"),
  };

  // 禁忌タグ別の成分マップ
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚨 危険成分ガイド
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            サプリメント成分の危険性・注意事項を科学的根拠に基づいて解説します。
            <br />
            妊娠中・授乳中の方、持病のある方、薬を服用中の方は必ずチェックしてください。
          </p>
        </div>

        {/* 重要な注意事項 */}
        <div className="bg-red-50 border-2 border-red-500 rounded-xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <span className="text-4xl">⚠️</span>
            <div>
              <h2 className="text-xl font-bold text-red-900 mb-2">免責事項</h2>
              <ul className="text-red-800 space-y-2">
                <li>
                  •
                  このガイドは一般的な情報提供を目的としており、医学的アドバイスではありません
                </li>
                <li>
                  •
                  サプリメントを開始する前に、必ず医師または薬剤師に相談してください
                </li>
                <li>
                  •
                  妊娠中・授乳中、持病がある場合、薬を服用中の場合は特に注意が必要です
                </li>
                <li>
                  • 異常を感じたらすぐに使用を中止し、医療機関を受診してください
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* リスクレベル別リスト */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            リスクレベル別一覧
          </h2>

          <div className="space-y-8">
            {Object.entries(groupedByRisk).map(([level, ingredients]) => {
              const config =
                riskLevelConfig[level as keyof typeof riskLevelConfig];
              if (ingredients.length === 0) return null;

              return (
                <div key={level} className="space-y-4">
                  <div
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 ${config.color}`}
                  >
                    <span className="text-3xl">{config.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold">{config.label}</h3>
                      <p className="text-sm">{config.description}</p>
                    </div>
                    <span className="ml-auto text-2xl font-bold">
                      {ingredients.length}件
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {ingredients.map((ingredient) => (
                      <Link
                        key={ingredient._id}
                        href={`/ingredients/${ingredient.slug.current}`}
                        className={`block p-4 rounded-lg border-2 hover:shadow-lg transition-shadow ${config.color}`}
                      >
                        <h4 className="font-bold text-lg mb-2">
                          {ingredient.name}
                        </h4>
                        <p className="text-sm mb-3 line-clamp-2">
                          {ingredient.description}
                        </p>
                        {ingredient.contraindications &&
                          ingredient.contraindications.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {ingredient.contraindications
                                .slice(0, 3)
                                .map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-xs px-2 py-1 bg-white rounded-full"
                                  >
                                    {contraindicationLabels[tag] || tag}
                                  </span>
                                ))}
                              {ingredient.contraindications.length > 3 && (
                                <span className="text-xs px-2 py-1 bg-white rounded-full">
                                  +{ingredient.contraindications.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        <div className="text-sm font-semibold text-right">
                          詳細を見る →
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 状況別チェックリスト */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            あなたの状況に当てはまるものをチェック
          </h2>

          <ContraindicationChecklist
            contraindicationMap={contraindicationMap}
            contraindicationLabels={contraindicationLabels}
          />
        </div>

        {/* 成分検索へのリンク */}
        <div className="text-center">
          <Link
            href="/ingredients"
            className="inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            全成分ガイドを見る
          </Link>
        </div>
      </div>
    </div>
  );
}
