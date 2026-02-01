import { Suspense } from "react";
import { ProductComparisonTable } from "@/components/ProductComparisonTable";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ShareButtons } from "@/components/diagnosis/ShareButtons";
import { DiagnosisConditionEditor } from "@/components/diagnosis/DiagnosisConditionEditor";
import { RecommendedIngredients } from "@/components/diagnosis/RecommendedIngredients";
import { DiagnosisHistorySaver } from "@/components/diagnosis/DiagnosisHistorySaver";
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
import { ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { fetchProductsForDiagnosis } from "../actions";
import { generateBreadcrumbStructuredData } from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/runtimeConfig";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // URLパラメータから診断情報を取得
  const params = await searchParams;
  const diagnosisType = params.type as string | undefined; // "simple" or "detailed"
  const goalsParam = params.goals as string | undefined;
  const conditionsParam = params.conditions as string | undefined;
  const budgetStr = params.budget as string | undefined;
  const priorityParam = params.priority as string | undefined;

  // 詳細診断の追加パラメータ
  const secondaryGoalsParam = params.secondaryGoals as string | undefined;
  const ageGroup = params.ageGroup as string | undefined;
  const lifestyle = params.lifestyle as string | undefined;
  const exerciseFrequency = params.exerciseFrequency as string | undefined;
  const stressLevel = params.stressLevel as string | undefined;
  const sleepQuality = params.sleepQuality as string | undefined;
  const dietQuality = params.dietQuality as string | undefined;
  const alcoholConsumption = params.alcoholConsumption as string | undefined;
  const mainConcern = params.mainConcern as string | undefined;
  const supplementExperience = params.supplementExperience as
    | string
    | undefined;
  const currentSupplementsParam = params.currentSupplements as
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

  // 診断履歴保存用のデータを準備
  const topRecommendationsForHistory = topThree.map((rec) => ({
    productId: rec.product.id,
    productName: rec.product.name,
    rank: rec.rank,
  }));

  return (
    <>
      {/* 診断履歴の自動保存（ログインユーザーのみ） */}
      <Suspense fallback={null}>
        <DiagnosisHistorySaver
          topRecommendations={topRecommendationsForHistory}
        />
      </Suspense>

      {/* JSON-LD構造化データ: Breadcrumb */}
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      <div
        className="min-h-screen pb-20"
        style={{
          backgroundColor: appleWebColors.pageBackground,
          fontFamily: fontStack,
        }}
      >
        {/* ヘッダー */}
        <div
          className={`border-b ${liquidGlassClasses.light}`}
          style={{
            borderColor: appleWebColors.borderSubtle,
          }}
        >
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
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
                }}
              >
                <CheckCircle2 className="text-white" size={22} />
              </div>
              <h1
                className="text-[22px] sm:text-[28px] font-bold tracking-tight"
                style={{ color: appleWebColors.textPrimary }}
              >
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
            <div className={`p-12 text-center ${liquidGlassClasses.light}`}>
              <p
                className="text-[15px] mb-5"
                style={{ color: appleWebColors.textSecondary }}
              >
                条件に合う商品が見つかりませんでした。
              </p>
              <Link
                href="/diagnosis"
                className="inline-flex items-center gap-2 text-[15px] font-medium min-h-[44px]"
                style={{ color: systemColors.blue }}
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
                <h2
                  className="text-[17px] sm:text-[20px] font-bold mb-2"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  トップ3推薦商品
                </h2>
                <p
                  className="text-[13px] sm:text-[15px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
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
                <div className="mt-10 sm:mt-14">
                  <h2
                    className="text-[17px] sm:text-[20px] font-bold mb-5"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    他のおすすめ商品
                  </h2>

                  <div
                    className={`p-4 sm:p-6 ${liquidGlassClasses.light} transition-all duration-300 hover:-translate-y-1`}
                  >
                    <div className="space-y-3">
                      {otherRecommendations.map((rec) => (
                        <Link
                          key={rec.product.id}
                          href={`/products/${rec.product.slug || rec.product.id}`}
                          className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 rounded-[12px] transition-colors cursor-pointer group min-h-[60px]"
                          style={{
                            backgroundColor: appleWebColors.sectionBackground,
                          }}
                        >
                          {/* 上段: 順位・画像・商品名 */}
                          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                            {/* ランキング順位 */}
                            <div className="flex-shrink-0">
                              <div
                                className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-[13px] font-bold text-white"
                                style={{ backgroundColor: systemColors.blue }}
                              >
                                {rec.rank}
                              </div>
                            </div>

                            {/* 商品画像 */}
                            {rec.product.imageUrl && (
                              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 relative rounded-lg overflow-hidden">
                                <Image
                                  src={rec.product.imageUrl}
                                  alt={rec.product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}

                            {/* 商品名・ブランド */}
                            <div className="flex-1 min-w-0">
                              <h3
                                className="font-semibold text-[13px] sm:text-[15px] line-clamp-2 transition-colors"
                                style={{ color: appleWebColors.textPrimary }}
                              >
                                {rec.product.name}
                              </h3>
                              {rec.product.brand && (
                                <div
                                  className="text-[11px] sm:text-[12px] mt-0.5 truncate"
                                  style={{
                                    color: appleWebColors.textSecondary,
                                  }}
                                >
                                  {rec.product.brand}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 下段（モバイル）/ 右側（PC）: 価格情報 */}
                          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-11 sm:pl-0">
                            <div className="text-left sm:text-right space-y-0.5">
                              {/* 1日あたりの価格 */}
                              <div
                                className="text-[15px] sm:text-[17px] font-bold"
                                style={{ color: appleWebColors.textPrimary }}
                              >
                                ¥
                                {Math.round(
                                  rec.scores.costDetails.costPerDayJPY,
                                )}
                                <span
                                  className="text-[11px] sm:text-[12px] ml-0.5 font-normal"
                                  style={{
                                    color: appleWebColors.textSecondary,
                                  }}
                                >
                                  /日
                                </span>
                              </div>
                              {/* 商品価格 */}
                              <div
                                className="text-[11px]"
                                style={{ color: appleWebColors.textTertiary }}
                              >
                                ¥{rec.product.priceJPY?.toLocaleString() || "—"}
                              </div>
                            </div>

                            {/* 詳細を見るアイコン */}
                            <div className="flex-shrink-0 transition-colors">
                              <ChevronRight
                                size={18}
                                style={{ color: appleWebColors.textTertiary }}
                              />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* アクション */}
              <div className="mt-10 flex justify-center gap-4">
                <Link
                  href="/diagnosis"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all min-h-[48px] hover:-translate-y-1 ${liquidGlassClasses.light}`}
                  style={{
                    color: appleWebColors.textPrimary,
                  }}
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
