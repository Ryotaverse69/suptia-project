import { ProductComparisonTable } from "@/components/ProductComparisonTable";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ShareButtons } from "@/components/diagnosis/ShareButtons";
import { DiagnosisConditionEditor } from "@/components/diagnosis/DiagnosisConditionEditor";
import { RecommendedIngredients } from "@/components/diagnosis/RecommendedIngredients";
import { headers } from "next/headers";
import {
  recommendProducts,
  type UserDiagnosisProfile,
  type HealthGoal,
  type UserPriority,
  HEALTH_GOAL_LABELS,
  USER_PRIORITY_LABELS,
} from "@/lib/recommendation-engine";
import {
  recommendProductsDetailed,
  type DetailedDiagnosisProfile,
} from "@/lib/detailed-recommendation-engine";
import type { ContraindicationTag } from "@/lib/safety-checker";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { fetchProductsForDiagnosis } from "../actions";
import { generateBreadcrumbStructuredData } from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/runtimeConfig";

// 健康状態の日本語ラベル
const CONDITION_LABELS: Record<ContraindicationTag, string> = {
  pregnant: "妊娠中",
  breastfeeding: "授乳中",
  infants: "乳幼児",
  children: "小児",
  elderly: "高齢者",
  "blood-clotting-disorder": "血液凝固障害",
  "bleeding-risk": "出血リスク",
  surgery: "手術予定",
  diabetes: "糖尿病",
  hypertension: "高血圧",
  hypotension: "低血圧",
  "kidney-disease": "腎臓疾患",
  "liver-disease": "肝臓疾患",
  "heart-disease": "心臓疾患",
  "thyroid-disorder": "甲状腺疾患",
  "autoimmune-disease": "自己免疫疾患",
  "digestive-disorder": "消化器疾患",
  epilepsy: "てんかん",
  "mental-disorder": "精神疾患",
  "anticoagulant-use": "抗凝固剤使用中",
  "antiplatelet-use": "抗血小板薬使用中",
  "antidepressant-use": "抗うつ薬使用中",
  "immunosuppressant-use": "免疫抑制剤使用中",
  "hormone-therapy": "ホルモン療法中",
  chemotherapy: "化学療法中",
  "allergy-prone": "アレルギー体質",
  "shellfish-allergy": "貝アレルギー",
  "soy-allergy": "大豆アレルギー",
  "nut-allergy": "ナッツアレルギー",
};

// Sanityから商品データを取得するようになりました

export default async function DiagnosisResultsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // URLパラメータから診断情報を取得
  const diagnosisType = searchParams.type as string | undefined; // "simple" or "detailed"
  const goalsParam = searchParams.goals as string | undefined;
  const conditionsParam = searchParams.conditions as string | undefined;
  const budgetStr = searchParams.budget as string | undefined;
  const priorityParam = searchParams.priority as string | undefined;

  // 詳細診断の追加パラメータ
  const secondaryGoalsParam = searchParams.secondaryGoals as string | undefined;
  const ageGroup = searchParams.ageGroup as string | undefined;
  const lifestyle = searchParams.lifestyle as string | undefined;
  const exerciseFrequency = searchParams.exerciseFrequency as
    | string
    | undefined;
  const stressLevel = searchParams.stressLevel as string | undefined;
  const sleepQuality = searchParams.sleepQuality as string | undefined;
  const dietQuality = searchParams.dietQuality as string | undefined;
  const alcoholConsumption = searchParams.alcoholConsumption as
    | string
    | undefined;
  const mainConcern = searchParams.mainConcern as string | undefined;
  const supplementExperience = searchParams.supplementExperience as
    | string
    | undefined;
  const currentSupplementsParam = searchParams.currentSupplements as
    | string
    | undefined;

  // ユーザープロファイル（サーバーコンポーネントなのでメモ化不要）
  const goals = (goalsParam?.split(",").filter(Boolean) as HealthGoal[]) || [];
  const secondaryGoals =
    (secondaryGoalsParam?.split(",").filter(Boolean) as HealthGoal[]) || [];
  const conditions =
    (conditionsParam?.split(",").filter(Boolean) as ContraindicationTag[]) ||
    [];
  const currentSupplements =
    currentSupplementsParam?.split(",").filter(Boolean) || [];
  const budget = budgetStr ? parseFloat(budgetStr) : undefined;
  const priority = (priorityParam || "balanced") as UserPriority;

  const isDetailedDiagnosis = diagnosisType === "detailed";

  // Sanityから商品データを取得
  const products = await fetchProductsForDiagnosis();

  // デバッグ: 取得した商品数をログ出力
  console.log("🔍 診断結果ページ - デバッグ情報:", {
    診断タイプ: isDetailedDiagnosis ? "詳細診断" : "かんたん診断",
    取得した商品数: products.length,
    ユーザー目標: goals,
    副次的な目標: secondaryGoals,
    ユーザー予算: budget,
    ユーザー優先度: priority,
    健康状態: conditions,
    年齢層: ageGroup,
    ストレスレベル: stressLevel,
  });

  // 推薦結果を計算（診断タイプに応じて使い分け）
  const recommendations = isDetailedDiagnosis
    ? recommendProductsDetailed(products, {
        goals,
        healthConditions: conditions,
        budgetPerDay: budget,
        priority,
        secondaryGoals,
        ageGroup: ageGroup as any,
        lifestyle: lifestyle as any,
        exerciseFrequency: exerciseFrequency as any,
        stressLevel: stressLevel as any,
        sleepQuality: sleepQuality as any,
        dietQuality: dietQuality as any,
        alcoholConsumption: alcoholConsumption as any,
        mainConcern: mainConcern as any,
        supplementExperience: supplementExperience as any,
        currentSupplements,
      } as DetailedDiagnosisProfile)
    : recommendProducts(products, {
        goals,
        healthConditions: conditions,
        budgetPerDay: budget,
        priority,
      });

  // デバッグ: 推薦結果数をログ出力
  console.log("📊 推薦結果:", {
    推薦商品数: recommendations.length,
    トップ3:
      recommendations.length > 0
        ? recommendations.slice(0, 3).map((r) => ({
            商品名: r.product.name,
            総合スコア: r.scores.overallScore,
          }))
        : "なし",
  });

  const topThree = recommendations.slice(0, 3);
  const otherRecommendations = recommendations.slice(3, 10); // トップ3以外の7件（合計10件）

  // 構造化データの生成
  const siteUrl = getSiteUrl();
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "ホーム", url: `${siteUrl}/` },
    { name: "サプリメント診断", url: `${siteUrl}/diagnosis` },
    { name: "診断結果", url: `${siteUrl}/diagnosis/results` },
  ]);

  const headersList = await headers();
  const nonce = headersList.get("x-nonce") || undefined;

  return (
    <>
      {/* JSON-LD構造化データ: Breadcrumb */}
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* ヘッダー */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <Breadcrumbs
              items={[{ name: "診断", href: "/diagnosis" }, { name: "結果" }]}
            />
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="container mx-auto px-4 py-8">
          {/* タイトルセクション */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-3">
                <Sparkles className="text-white" size={24} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                あなたにおすすめのサプリメント
              </h1>
            </div>

            {/* シェアボタン */}
            <div className="mb-6">
              <ShareButtons />
            </div>

            {/* 診断条件エディター */}
            <DiagnosisConditionEditor
              initialGoals={goals}
              initialBudget={budget}
              initialConditions={conditions}
              initialPriority={priority}
              isDetailedDiagnosis={isDetailedDiagnosis}
            />

            {/* 推奨成分セクション */}
            {goals.length > 0 && (
              <div className="mt-6">
                <RecommendedIngredients goals={goals} />
              </div>
            )}
          </div>

          {/* 結果が0件の場合 */}
          {recommendations.length === 0 && (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
              <p className="text-gray-600 mb-4">
                条件に合う商品が見つかりませんでした。
              </p>
              <Link
                href="/diagnosis"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <ArrowLeft size={16} />
                診断をやり直す
              </Link>
            </div>
          )}

          {/* 推薦結果 */}
          {recommendations.length > 0 && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  トップ3推薦商品
                </h2>
                <p className="text-gray-600">
                  あなたの条件に最も適した商品を、科学的根拠に基づいて評価しました。
                </p>
              </div>

              {/* 商品比較テーブル */}
              <ProductComparisonTable
                recommendations={topThree}
                className="mb-8"
              />

              {/* その他の推薦商品 */}
              {otherRecommendations.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    他のおすすめ商品
                  </h2>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="space-y-4">
                      {otherRecommendations.map((rec) => (
                        <Link
                          key={rec.product.id}
                          href={`/products/${rec.product.slug || rec.product.id}`}
                          className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group"
                        >
                          {/* ランキング順位 */}
                          <div className="flex-shrink-0">
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-white bg-blue-500">
                              {rec.rank}
                            </div>
                          </div>

                          {/* 商品画像 */}
                          {rec.product.imageUrl && (
                            <div className="flex-shrink-0 w-16 h-16 relative">
                              <Image
                                src={rec.product.imageUrl}
                                alt={rec.product.name}
                                fill
                                className="object-cover rounded-lg"
                              />
                            </div>
                          )}

                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {rec.product.name}
                            </h3>
                            <div className="text-sm text-gray-600 mt-1">
                              {rec.product.brand && (
                                <span>{rec.product.brand}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            {/* 1日あたりの価格 */}
                            <div className="text-lg font-bold text-gray-900">
                              ¥
                              {Math.round(rec.scores.costDetails.costPerDayJPY)}
                              <span className="text-sm text-gray-500 ml-1">
                                /日
                              </span>
                            </div>
                            {/* 商品価格 */}
                            <div className="text-xs text-gray-500">
                              商品価格: ¥
                              {rec.product.priceJPY?.toLocaleString() || "—"}
                            </div>
                          </div>

                          {/* 詳細を見るアイコン */}
                          <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-600 transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* アクション */}
              <div className="mt-8 flex justify-center gap-4">
                <Link
                  href="/diagnosis"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <ArrowLeft size={16} />
                  条件を変更
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
