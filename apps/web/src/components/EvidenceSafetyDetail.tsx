/**
 * エビデンスと安全性の詳細表示コンポーネント
 */

import {
  Microscope,
  Shield,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Pill,
} from "lucide-react";
import type { IngredientSafetyDetail } from "@/lib/auto-scoring";
import {
  detectUnsafeAdditives,
  evidenceLevelToScore,
} from "@/lib/auto-scoring";

// 成分別エビデンス詳細
export interface IngredientEvidenceDetail {
  name: string;
  evidenceLevel: "S" | "A" | "B" | "C" | "D";
  evidenceScore: number;
  amountMg: number;
  ratio: number; // 配合率（0-1）
}

interface EvidenceSafetyDetailProps {
  evidenceLevel?: "S" | "A" | "B" | "C" | "D";
  evidenceScore?: number;
  safetyScore?: number;
  thirdPartyTested?: boolean;
  warnings?: string[];
  ingredientName?: string;
  ingredientEvidenceLevel?: "S" | "A" | "B" | "C" | "D";
  safetyDetails?: IngredientSafetyDetail[];
  evidenceDetails?: IngredientEvidenceDetail[]; // 成分別エビデンス詳細
  allIngredients?: string;
  className?: string;
}

export function EvidenceSafetyDetail({
  evidenceLevel,
  evidenceScore = 0,
  safetyScore = 0,
  thirdPartyTested = false,
  warnings = [],
  ingredientName,
  ingredientEvidenceLevel,
  safetyDetails = [],
  evidenceDetails = [],
  allIngredients,
  className = "",
}: EvidenceSafetyDetailProps) {
  // エビデンスレベルの説明
  const evidenceLevelInfo = {
    S: {
      label: "エビデンスS - 最高レベル",
      description:
        "大規模なランダム化比較試験（RCT）やメタ解析により、高い効果が実証されています。",
      color: "from-purple-500 to-purple-700",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-300",
      textColor: "text-purple-900",
    },
    A: {
      label: "エビデンスA - 高い信頼性",
      description:
        "良質な研究により効果が確認されています。複数の研究で一貫した結果が得られています。",
      color: "from-blue-500 to-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-300",
      textColor: "text-blue-900",
    },
    B: {
      label: "エビデンスB - 中程度の信頼性",
      description:
        "限定的な研究または条件付きで効果が確認されています。さらなる研究が期待されます。",
      color: "from-green-500 to-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-300",
      textColor: "text-green-900",
    },
    C: {
      label: "エビデンスC - 限定的",
      description:
        "動物実験や小規模な試験レベルです。人間への効果は十分に実証されていません。",
      color: "from-yellow-500 to-yellow-700",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-300",
      textColor: "text-yellow-900",
    },
    D: {
      label: "エビデンスD - 未検証",
      description: "理論的根拠のみで、科学的研究による実証が不十分です。",
      color: "from-red-500 to-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-300",
      textColor: "text-red-900",
    },
  };

  const currentEvidenceInfo = evidenceLevel
    ? evidenceLevelInfo[evidenceLevel]
    : evidenceLevelInfo.D;

  // 安全性レベルの判定（S/A/B/C/D）
  // ※ エビデンスレベルと色を統一
  const getSafetyLevel = (score: number) => {
    if (score >= 90)
      return {
        grade: "S",
        label: "安全性S - 最高レベル",
        description:
          "非常に高い安全性が確認されています。重大な副作用の報告がなく、長期使用の実績があります。",
        color: "text-purple-700",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-300",
        icon: CheckCircle2,
      };
    if (score >= 80)
      return {
        grade: "A",
        label: "安全性A - 高い安全性",
        description:
          "高い安全性が確認されています。適切な使用下では問題ありません。",
        color: "text-blue-700",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-300",
        icon: CheckCircle2,
      };
    if (score >= 70)
      return {
        grade: "B",
        label: "安全性B - 中程度の安全性",
        description:
          "一般的に安全ですが、一部の方には注意が必要な場合があります。",
        color: "text-green-700",
        bgColor: "bg-green-50",
        borderColor: "border-green-300",
        icon: AlertTriangle,
      };
    if (score >= 60)
      return {
        grade: "C",
        label: "安全性C - 注意が必要",
        description: "使用には注意が必要です。医師への相談を推奨します。",
        color: "text-yellow-700",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-300",
        icon: AlertTriangle,
      };
    return {
      grade: "D",
      label: "安全性D - 要注意",
      description:
        "安全性に懸念があります。使用前に必ず医師に相談してください。",
      color: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-300",
      icon: AlertTriangle,
    };
  };

  const safetyLevel = getSafetyLevel(safetyScore);
  const SafetyIcon = safetyLevel.icon;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* エビデンスレベル */}
      <div className="bg-white border border-primary-200 rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-primary-900 mb-4 flex items-center gap-2">
          <Microscope size={24} />
          科学的エビデンス
        </h2>

        {/* エビデンスレベルバッジ */}
        <div
          className={`p-6 rounded-xl bg-gradient-to-r ${currentEvidenceInfo.color} mb-6`}
        >
          <div className="text-white">
            <p className="text-3xl font-bold mb-2">
              {evidenceLevel || "D"}ランク
            </p>
            <p className="text-lg opacity-90">{currentEvidenceInfo.label}</p>
          </div>
        </div>

        {/* 説明 */}
        <div
          className={`p-4 rounded-lg ${currentEvidenceInfo.bgColor} border ${currentEvidenceInfo.borderColor}`}
        >
          <p className={`text-sm ${currentEvidenceInfo.textColor}`}>
            {currentEvidenceInfo.description}
          </p>
        </div>

        {/* エビデンススコア */}
        {evidenceScore > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">
                エビデンススコア
              </span>
              <span className="text-2xl font-bold text-primary">
                {evidenceScore}点
              </span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary-700 transition-all duration-500"
                style={{ width: `${evidenceScore}%` }}
              />
            </div>
          </div>
        )}

        {/* 成分別エビデンス詳細 */}
        {evidenceDetails.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Microscope size={16} className="text-blue-600" />
              成分別エビデンス評価の詳細（配合率ベース）
            </h3>
            <div className="space-y-3">
              {evidenceDetails.map((detail, index) => {
                const ratioPercent = Math.round(detail.ratio * 1000) / 10;
                const contribution = Math.round(
                  detail.evidenceScore * detail.ratio,
                );
                const levelInfo = evidenceLevelInfo[detail.evidenceLevel];

                return (
                  <div
                    key={index}
                    className="p-3 bg-white border border-blue-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800">
                          {detail.name}
                        </p>
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r ${levelInfo.color} text-white text-xs font-bold`}
                        >
                          {detail.evidenceLevel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          エビデンススコア:
                        </span>
                        <span className="font-bold text-blue-700">
                          {detail.evidenceScore}点
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="w-24">配合量:</span>
                        <span className="font-mono">{detail.amountMg}mg</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-24">配合率:</span>
                        <span className="font-mono font-semibold text-blue-700">
                          {ratioPercent}%
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-green-700 mt-2 pt-2 border-t border-gray-200">
                        <TrendingUp size={14} />
                        <span className="w-24">スコア貢献度:</span>
                        <span className="font-mono font-bold">
                          +{contribution}点
                        </span>
                        <span className="text-xs text-gray-500">
                          （{detail.evidenceScore}点 × {ratioPercent}%）
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※
              総合エビデンススコアは、各成分のエビデンススコアを配合率で重み付けして算出しています。
            </p>
          </div>
        )}

        {/* 成分のエビデンスレベル（単一成分の場合） */}
        {ingredientName &&
          ingredientEvidenceLevel &&
          evidenceDetails.length === 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                主要成分のエビデンス評価
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {ingredientName}:
                  </span>
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r ${evidenceLevelInfo[ingredientEvidenceLevel]?.color} text-white font-bold`}
                  >
                    {ingredientEvidenceLevel}
                  </span>
                </div>
                <span className="text-xs text-gray-600">
                  {evidenceLevelInfo[ingredientEvidenceLevel]?.label}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                この成分自体の科学的根拠は{ingredientEvidenceLevel}
                ランクに評価されています。
              </p>
            </div>
          )}
      </div>

      {/* 安全性 */}
      <div className="bg-white border border-primary-200 rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-primary-900 mb-4 flex items-center gap-2">
          <Shield size={24} />
          安全性評価
        </h2>

        {/* 安全性レベルバッジ */}
        <div
          className={`p-6 ${safetyLevel.bgColor} border ${safetyLevel.borderColor} rounded-lg mb-6`}
        >
          <div className="flex items-center gap-3 mb-3">
            <SafetyIcon size={28} className={safetyLevel.color} />
            <div>
              <p className={`text-3xl font-bold ${safetyLevel.color}`}>
                {safetyLevel.grade}ランク
              </p>
              <p className={`text-sm font-semibold ${safetyLevel.color}`}>
                {safetyLevel.label}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-700">{safetyLevel.description}</p>
        </div>

        {/* 成分別安全性詳細 */}
        {safetyDetails.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Shield size={16} className="text-blue-600" />
              成分別安全性評価の詳細
            </h3>
            <div className="space-y-3">
              {safetyDetails.map((detail, index) => {
                const totalPenalty =
                  detail.evidenceLevelPenalty +
                  detail.sideEffectsPenalty +
                  detail.interactionsPenalty;
                const hasReduction = totalPenalty < 0;

                return (
                  <div
                    key={index}
                    className="p-3 bg-white border border-blue-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-gray-800">
                        {detail.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          安全性スコア:
                        </span>
                        <span className="font-bold text-blue-700">
                          {detail.finalScore}点
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="w-32">ベーススコア:</span>
                        <span className="font-mono">{detail.baseScore}点</span>
                      </div>

                      {detail.categoryBonus !== 0 && (
                        <div className="flex items-center gap-2 text-green-700">
                          <TrendingUp size={14} />
                          <span className="w-32">カテゴリボーナス:</span>
                          <span className="font-mono">
                            +{detail.categoryBonus}点
                          </span>
                          <span className="text-xs text-gray-500">
                            （基本的な栄養素）
                          </span>
                        </div>
                      )}

                      {hasReduction && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="font-semibold text-orange-700 mb-1 flex items-center gap-1">
                            <TrendingDown size={14} />
                            減点要因:
                          </p>

                          {detail.evidenceLevelPenalty < 0 && (
                            <div className="flex items-center gap-2 text-orange-600 ml-4">
                              <span className="w-28">エビデンスレベル:</span>
                              <span className="font-mono">
                                {detail.evidenceLevelPenalty}点
                              </span>
                            </div>
                          )}

                          {detail.sideEffectsPenalty < 0 && (
                            <div className="flex items-center gap-2 text-orange-600 ml-4">
                              <span className="w-28">副作用:</span>
                              <span className="font-mono">
                                {detail.sideEffectsPenalty}点
                              </span>
                              <span className="text-xs text-gray-500">
                                （{detail.sideEffectsCount}件）
                              </span>
                            </div>
                          )}

                          {detail.interactionsPenalty < 0 && (
                            <div className="flex items-center gap-2 text-orange-600 ml-4">
                              <span className="w-28">相互作用:</span>
                              <span className="font-mono">
                                {detail.interactionsPenalty}点
                              </span>
                              <span className="text-xs text-gray-500">
                                （{detail.interactionsCount}件）
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※
              安全性スコアは、ベーススコア（90点）から、エビデンスレベル、副作用の数、相互作用の数に応じて調整されます。
            </p>
          </div>
        )}

        {/* 第三者機関検査 */}
        {thirdPartyTested && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-400 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle2 size={20} />
              <div>
                <p className="font-bold">第三者機関検査済み</p>
                <p className="text-sm">
                  独立した検査機関による品質検査を受けています。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 注意事項 */}
        {warnings.length > 0 && (
          <div className="p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
            <div className="flex items-start gap-2 text-yellow-800">
              <AlertTriangle size={20} className="mt-0.5" />
              <div className="flex-1">
                <p className="font-bold mb-2">注意事項</p>
                <ul className="space-y-1 text-sm">
                  {warnings.map((warning, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-600">•</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 全成分表示 */}
        {allIngredients && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Pill size={20} className="text-blue-600" />
              全成分表示
            </h3>

            {(() => {
              const unsafeAdditives = detectUnsafeAdditives(allIngredients);
              const hasConcerns = unsafeAdditives.length > 0;

              return (
                <>
                  {/* 懸念される添加物の警告 */}
                  {hasConcerns && (
                    <div className="mb-4 p-3 bg-orange-50 border-2 border-orange-400 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle
                          size={18}
                          className="text-orange-700 mt-0.5"
                        />
                        <div className="flex-1">
                          <p className="font-bold text-orange-800 mb-2">
                            懸念される添加物が検出されました
                          </p>
                          <div className="space-y-1">
                            {unsafeAdditives.map((additive, index) => {
                              const severityColors = {
                                critical:
                                  "bg-red-100 text-red-800 border-red-300",
                                warning:
                                  "bg-orange-100 text-orange-800 border-orange-300",
                                info: "bg-yellow-100 text-yellow-800 border-yellow-300",
                              };
                              const colorClass =
                                severityColors[
                                  additive.severity as keyof typeof severityColors
                                ] || severityColors.info;

                              return (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border ${colorClass} font-medium`}
                                  >
                                    {additive.name}
                                    <span className="text-xs font-mono">
                                      ({additive.penalty}点)
                                    </span>
                                  </span>
                                  {additive.severity === "critical" && (
                                    <span className="text-xs text-red-700 font-medium">
                                      要注意
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <p className="text-xs text-orange-700 mt-2">
                            ※
                            これらの添加物は安全性に懸念があるため、安全性スコアに影響しています。
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 全成分リスト */}
                  <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {allIngredients}
                    </p>
                  </div>

                  {!hasConcerns && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-green-700">
                      <CheckCircle2 size={16} />
                      <span>懸念される添加物は検出されませんでした。</span>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* 安全性の詳細説明 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            安全性スコアの評価基準
          </h4>
          <ul className="space-y-1 text-xs text-gray-600">
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>第三者機関による品質検査の有無</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>副作用や相互作用の報告</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>推奨摂取量に対する安全マージン</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>原材料の品質と由来の透明性</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>製造工程の管理体制（GMP認証など）</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
