"use client";

import { useDiagnosisHistory } from "@/contexts/DiagnosisHistoryContext";
import {
  History,
  LogIn,
  Trash2,
  ChevronRight,
  Calendar,
  Target,
  DollarSign,
  Shield,
  ClipboardCheck,
  Trophy,
  Medal,
  Award,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LoginModal } from "@/components/auth/LoginModal";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlassClasses,
} from "@/lib/design-system";

// 健康目標のラベル（DiagnosisFormのHEALTH_GOALSと同期）
const HEALTH_GOAL_LABELS: Record<string, string> = {
  "immune-boost": "免疫力強化",
  "energy-recovery": "疲労回復",
  "skin-health": "美肌・肌の健康",
  "bone-health": "骨の健康",
  "heart-health": "心臓の健康",
  "brain-function": "脳機能・集中力",
};

// 健康状態のラベル
const HEALTH_CONDITION_LABELS: Record<string, string> = {
  pregnant: "妊娠中",
  breastfeeding: "授乳中",
  "allergy-prone": "アレルギー体質",
  "liver-disease": "肝臓疾患",
  "kidney-disease": "腎臓疾患",
  diabetes: "糖尿病",
  "heart-disease": "心臓疾患",
  hypertension: "高血圧",
  hypotension: "低血圧",
  "thyroid-disorder": "甲状腺疾患",
  "autoimmune-disease": "自己免疫疾患",
  "digestive-disorder": "消化器疾患",
  "mental-disorder": "精神疾患",
  none: "該当なし",
};

// 優先事項のラベル
const PRIORITY_LABELS: Record<string, string> = {
  balanced: "バランス重視",
  cost: "コスト重視",
  safety: "安全性重視",
  evidence: "エビデンス重視",
  effectiveness: "効果重視",
};

export default function DiagnosisHistoryPage() {
  const { history, isLoading, isLoggedIn, isAuthLoading, deleteDiagnosis } =
    useDiagnosisHistory();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("この診断履歴を削除しますか？")) {
      setDeletingId(id);
      await deleteDiagnosis(id);
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const buildResultsUrl = (item: any) => {
    // AIコンシェルジュの場合はコンシェルジュページへ
    if (item.diagnosisType === "concierge" && item.sessionId) {
      return `/concierge?session=${item.sessionId}`;
    }

    const params = new URLSearchParams();
    if (item.diagnosisType) params.set("type", item.diagnosisType);
    if (item.goals?.length) params.set("goals", item.goals.join(","));
    if (item.conditions?.length)
      params.set("conditions", item.conditions.join(","));
    if (item.budget) params.set("budget", item.budget.toString());
    if (item.priority) params.set("priority", item.priority);
    if (item.secondaryGoals?.length)
      params.set("secondaryGoals", item.secondaryGoals.join(","));
    if (item.ageGroup) params.set("ageGroup", item.ageGroup);
    if (item.lifestyle) params.set("lifestyle", item.lifestyle);
    if (item.exerciseFrequency)
      params.set("exerciseFrequency", item.exerciseFrequency);
    if (item.stressLevel) params.set("stressLevel", item.stressLevel);
    if (item.sleepQuality) params.set("sleepQuality", item.sleepQuality);
    if (item.dietQuality) params.set("dietQuality", item.dietQuality);
    if (item.alcoholConsumption)
      params.set("alcoholConsumption", item.alcoholConsumption);
    if (item.mainConcern) params.set("mainConcern", item.mainConcern);
    if (item.supplementExperience)
      params.set("supplementExperience", item.supplementExperience);
    if (item.currentSupplements?.length)
      params.set("currentSupplements", item.currentSupplements.join(","));
    return `/diagnosis/results?${params.toString()}`;
  };

  // 診断タイプに応じたスタイルを取得
  const getDiagnosisTypeStyle = (type: string) => {
    switch (type) {
      case "concierge":
        return {
          label: "AIコンシェルジュ",
          background: `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
          icon: Sparkles,
        };
      case "detailed":
        return {
          label: "詳細診断",
          background: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
          icon: ClipboardCheck,
        };
      default:
        return {
          label: "かんたん診断",
          background: `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.teal} 100%)`,
          icon: ClipboardCheck,
        };
    }
  };

  return (
    <div
      className="min-h-screen py-10 sm:py-14 md:py-20"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-14">
            <div
              className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mb-5"
              style={{
                background: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
              }}
            >
              <History size={32} className="text-white" />
            </div>
            <h1
              className="text-[28px] sm:text-[34px] md:text-[40px] font-bold mb-3 tracking-tight"
              style={{ color: appleWebColors.textPrimary }}
            >
              診断履歴
            </h1>
            <p
              className="text-[15px] sm:text-[17px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              過去の診断結果を確認できます
            </p>
          </div>

          {/* Loading State (Auth) */}
          {isAuthLoading && (
            <div className="text-center py-20">
              <div
                className="inline-block animate-spin rounded-full h-10 w-10 border-3"
                style={{
                  borderColor: `${systemColors.blue}20`,
                  borderTopColor: systemColors.blue,
                }}
              />
              <p
                className="mt-4 text-[15px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                読み込み中...
              </p>
            </div>
          )}

          {/* Not Logged In State */}
          {!isAuthLoading && !isLoggedIn && (
            <div className={`text-center py-16 ${liquidGlassClasses.light}`}>
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: appleWebColors.sectionBackground }}
              >
                <LogIn
                  size={28}
                  style={{ color: appleWebColors.textTertiary }}
                />
              </div>
              <h2
                className="text-[20px] font-bold mb-3"
                style={{ color: appleWebColors.textPrimary }}
              >
                ログインが必要です
              </h2>
              <p
                className="text-[15px] mb-8 max-w-sm mx-auto leading-relaxed"
                style={{ color: appleWebColors.textSecondary }}
              >
                診断履歴を見るにはログインしてください。
                <br />
                ログインすると、過去の診断結果を確認できます。
              </p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[15px] font-semibold text-white transition-all duration-300 hover:opacity-90 min-h-[48px]"
                style={{
                  background: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
                }}
              >
                <LogIn size={18} />
                ログイン / 新規登録
              </button>
            </div>
          )}

          {/* Loading State (History) */}
          {!isAuthLoading && isLoggedIn && isLoading && (
            <div className="text-center py-20">
              <div
                className="inline-block animate-spin rounded-full h-10 w-10 border-3"
                style={{
                  borderColor: `${systemColors.blue}20`,
                  borderTopColor: systemColors.blue,
                }}
              />
              <p
                className="mt-4 text-[15px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                読み込み中...
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isAuthLoading &&
            isLoggedIn &&
            !isLoading &&
            history.length === 0 && (
              <div className={`text-center py-16 ${liquidGlassClasses.light}`}>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: appleWebColors.sectionBackground }}
                >
                  <History
                    size={28}
                    style={{ color: appleWebColors.textTertiary }}
                  />
                </div>
                <h2
                  className="text-[20px] font-bold mb-3"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  診断履歴がありません
                </h2>
                <p
                  className="text-[15px] mb-8 max-w-sm mx-auto"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  診断を行うと、結果がここに保存されます
                </p>
                <Link
                  href="/diagnosis"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[15px] font-semibold text-white transition-all duration-300 hover:opacity-90 min-h-[48px]"
                  style={{
                    background: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
                  }}
                >
                  診断を始める
                </Link>
              </div>
            )}

          {/* History List */}
          {!isAuthLoading && isLoggedIn && !isLoading && history.length > 0 && (
            <div className="space-y-5">
              <p
                className="text-[13px] font-medium"
                style={{ color: appleWebColors.textSecondary }}
              >
                {history.length}件の診断履歴
              </p>

              {history.map((item) => {
                const typeStyle = getDiagnosisTypeStyle(item.diagnosisType);
                const TypeIcon = typeStyle.icon;
                const isConcierge = item.diagnosisType === "concierge";

                return (
                  <div
                    key={item.id}
                    className={`group relative overflow-hidden ${liquidGlassClasses.light} transition-all duration-300 hover:-translate-y-1`}
                  >
                    {/* Gradient accent bar */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1"
                      style={{
                        background: isConcierge
                          ? `linear-gradient(180deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`
                          : `linear-gradient(180deg, ${systemColors.purple} 0%, ${systemColors.pink} 50%, ${systemColors.orange} 100%)`,
                      }}
                    />

                    <div className="p-5 pl-6">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center"
                            style={{
                              background: typeStyle.background,
                            }}
                          >
                            <TypeIcon className="text-white" size={20} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white"
                                style={{
                                  background: typeStyle.background,
                                }}
                              >
                                {typeStyle.label}
                              </span>
                              {isConcierge && item.characterName && (
                                <span
                                  className="px-2 py-0.5 rounded-md text-[11px] font-medium"
                                  style={{
                                    backgroundColor: `${systemColors.green}15`,
                                    color: systemColors.green,
                                  }}
                                >
                                  {item.characterName}
                                </span>
                              )}
                            </div>
                            <div
                              className="flex items-center gap-1.5 text-[13px]"
                              style={{ color: appleWebColors.textTertiary }}
                            >
                              <Calendar size={12} />
                              <span>{formatDate(item.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="p-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
                            style={{ color: appleWebColors.textTertiary }}
                            title="削除"
                          >
                            <Trash2 size={18} />
                          </button>
                          <Link
                            href={buildResultsUrl(item)}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all duration-200 min-h-[44px]"
                            style={{
                              background: isConcierge
                                ? `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`
                                : `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
                            }}
                          >
                            {isConcierge ? "会話を見る" : "結果を見る"}
                            {isConcierge ? (
                              <ArrowUpRight size={14} />
                            ) : (
                              <ChevronRight size={14} />
                            )}
                          </Link>
                        </div>
                      </div>

                      {/* AIコンシェルジュ: 質問と回答要約 */}
                      {isConcierge && (item.query || item.responseSummary) && (
                        <div
                          className="mb-4 p-4 rounded-xl"
                          style={{ backgroundColor: `${systemColors.green}08` }}
                        >
                          {item.query && (
                            <div className="mb-3">
                              <div className="flex items-center gap-2 mb-1.5">
                                <MessageSquare
                                  size={12}
                                  style={{ color: systemColors.green }}
                                />
                                <span
                                  className="text-[11px] font-semibold"
                                  style={{ color: systemColors.green }}
                                >
                                  質問
                                </span>
                              </div>
                              <p
                                className="text-[13px] leading-relaxed"
                                style={{ color: appleWebColors.textPrimary }}
                              >
                                {item.query}
                              </p>
                            </div>
                          )}
                          {item.responseSummary && (
                            <div>
                              <div className="flex items-center gap-2 mb-1.5">
                                <Sparkles
                                  size={12}
                                  style={{ color: systemColors.teal }}
                                />
                                <span
                                  className="text-[11px] font-semibold"
                                  style={{ color: systemColors.teal }}
                                >
                                  回答要約
                                </span>
                              </div>
                              <p
                                className="text-[13px] leading-relaxed"
                                style={{ color: appleWebColors.textSecondary }}
                              >
                                {item.responseSummary}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Goals - 通常診断とAIコンシェルジュで表示を分ける */}
                      {!isConcierge && item.goals && item.goals.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Target
                              size={12}
                              style={{ color: systemColors.blue }}
                            />
                            <span
                              className="text-[11px] font-semibold uppercase tracking-wider"
                              style={{ color: appleWebColors.textTertiary }}
                            >
                              健康目標
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {item.goals.map((goal) => (
                              <span
                                key={goal}
                                className="px-2.5 py-1.5 rounded-lg text-[12px] font-medium"
                                style={{
                                  backgroundColor: `${systemColors.blue}10`,
                                  color: systemColors.blue,
                                }}
                              >
                                {HEALTH_GOAL_LABELS[goal] || goal}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* AIコンシェルジュ: キーワードタグ */}
                      {isConcierge && item.goals && item.goals.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Target
                              size={12}
                              style={{ color: systemColors.green }}
                            />
                            <span
                              className="text-[11px] font-semibold uppercase tracking-wider"
                              style={{ color: appleWebColors.textTertiary }}
                            >
                              関連キーワード
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {item.goals.map((goal) => (
                              <span
                                key={goal}
                                className="px-2.5 py-1.5 rounded-lg text-[12px] font-medium"
                                style={{
                                  backgroundColor: `${systemColors.green}10`,
                                  color: systemColors.green,
                                }}
                              >
                                {goal}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Budget & Priority Cards - 通常診断のみ */}
                      {!isConcierge && (item.budget || item.priority) && (
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {item.budget && (
                            <div
                              className="flex items-center gap-3 p-3 rounded-xl"
                              style={{
                                backgroundColor: `${systemColors.green}10`,
                              }}
                            >
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: systemColors.green }}
                              >
                                <DollarSign size={16} className="text-white" />
                              </div>
                              <div>
                                <p
                                  className="text-[11px] font-medium"
                                  style={{ color: systemColors.green }}
                                >
                                  1日の予算
                                </p>
                                <p
                                  className="text-[15px] font-bold"
                                  style={{ color: appleWebColors.textPrimary }}
                                >
                                  ¥{item.budget.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          )}
                          {item.priority && (
                            <div
                              className="flex items-center gap-3 p-3 rounded-xl"
                              style={{
                                backgroundColor: `${systemColors.purple}10`,
                              }}
                            >
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: systemColors.purple }}
                              >
                                <Shield size={16} className="text-white" />
                              </div>
                              <div>
                                <p
                                  className="text-[11px] font-medium"
                                  style={{ color: systemColors.purple }}
                                >
                                  優先事項
                                </p>
                                <p
                                  className="text-[13px] font-bold"
                                  style={{ color: appleWebColors.textPrimary }}
                                >
                                  {PRIORITY_LABELS[item.priority] ||
                                    item.priority}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Conditions - 通常診断のみ */}
                      {!isConcierge &&
                        item.conditions &&
                        item.conditions.length > 0 &&
                        item.conditions[0] !== "none" && (
                          <div
                            className="mb-4 p-3 rounded-xl"
                            style={{
                              backgroundColor: `${systemColors.orange}10`,
                            }}
                          >
                            <p
                              className="text-[11px] font-semibold mb-2"
                              style={{ color: systemColors.orange }}
                            >
                              考慮した健康状態
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {item.conditions.map((condition) => (
                                <span
                                  key={condition}
                                  className="px-2 py-1 rounded-lg text-[11px] font-medium"
                                  style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                                    color: systemColors.orange,
                                  }}
                                >
                                  {HEALTH_CONDITION_LABELS[condition] ||
                                    condition}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Top Recommendations */}
                      {item.topRecommendations &&
                        item.topRecommendations.length > 0 && (
                          <div
                            className="p-4 rounded-xl"
                            style={{
                              backgroundColor: appleWebColors.sectionBackground,
                            }}
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <Trophy
                                size={14}
                                style={{ color: systemColors.yellow }}
                              />
                              <span
                                className="text-[12px] font-bold"
                                style={{ color: appleWebColors.textSecondary }}
                              >
                                おすすめTOP3
                              </span>
                            </div>
                            <div className="space-y-2">
                              {item.topRecommendations
                                .slice(0, 3)
                                .map((rec, idx) => {
                                  const RankIcon =
                                    idx === 0
                                      ? Trophy
                                      : idx === 1
                                        ? Medal
                                        : Award;
                                  const rankBg =
                                    idx === 0
                                      ? `linear-gradient(135deg, ${systemColors.yellow} 0%, ${systemColors.orange} 100%)`
                                      : idx === 1
                                        ? `linear-gradient(135deg, ${systemColors.gray[2]} 0%, ${systemColors.gray[3]} 100%)`
                                        : `linear-gradient(135deg, ${systemColors.orange} 0%, ${systemColors.red} 100%)`;
                                  return (
                                    <div
                                      key={rec.productId}
                                      className="flex items-center gap-2.5 p-2 rounded-lg"
                                      style={{
                                        backgroundColor:
                                          "rgba(255, 255, 255, 0.8)",
                                      }}
                                    >
                                      <div
                                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                                        style={{ background: rankBg }}
                                      >
                                        <RankIcon
                                          size={14}
                                          className="text-white"
                                        />
                                      </div>
                                      <span
                                        className="text-[13px] font-medium flex-1"
                                        style={{
                                          color: appleWebColors.textPrimary,
                                        }}
                                      >
                                        {rec.productName}
                                      </span>
                                      <span
                                        className="text-[11px]"
                                        style={{
                                          color: appleWebColors.textTertiary,
                                        }}
                                      >
                                        #{idx + 1}
                                      </span>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Back to Diagnosis */}
          {!isAuthLoading && isLoggedIn && !isLoading && (
            <div className="mt-12 text-center">
              <Link
                href="/diagnosis"
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl text-[15px] font-semibold text-white transition-all duration-300 hover:opacity-90 min-h-[52px]"
                style={{
                  background: `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.purple} 50%, ${systemColors.pink} 100%)`,
                }}
              >
                <ClipboardCheck size={20} />
                新しい診断を始める
                <ChevronRight size={18} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
