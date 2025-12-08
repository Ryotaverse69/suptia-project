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
  Sparkles,
  Trophy,
  Medal,
  Award,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LoginModal } from "@/components/auth/LoginModal";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-4 sm:mb-6">
              <History size={32} className="text-white sm:w-10 sm:h-10" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-900 mb-3 sm:mb-4">
              診断履歴
            </h1>
            <p className="text-base sm:text-lg text-primary-700">
              過去の診断結果を確認できます
            </p>
          </div>

          {/* Loading State (Auth) */}
          {isAuthLoading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-primary-700">読み込み中...</p>
            </div>
          )}

          {/* Not Logged In State */}
          {!isAuthLoading && !isLoggedIn && (
            <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
              <div className="text-primary-300 mb-6">
                <LogIn size={64} className="mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-primary-900 mb-4">
                ログインが必要です
              </h2>
              <p className="text-primary-700 mb-8 max-w-md mx-auto">
                診断履歴を見るにはログインしてください。
                <br />
                ログインすると、過去の診断結果を確認できます。
              </p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all hover:shadow-lg font-semibold"
              >
                <LogIn size={20} />
                ログイン / 新規登録
              </button>
            </div>
          )}

          {/* Loading State (History) */}
          {!isAuthLoading && isLoggedIn && isLoading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-primary-700">読み込み中...</p>
            </div>
          )}

          {/* Empty State */}
          {!isAuthLoading &&
            isLoggedIn &&
            !isLoading &&
            history.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
                <div className="text-primary-300 mb-6">
                  <History size={64} className="mx-auto" />
                </div>
                <h2 className="text-2xl font-bold text-primary-900 mb-4">
                  診断履歴がありません
                </h2>
                <p className="text-primary-700 mb-8 max-w-md mx-auto">
                  診断を行うと、結果がここに保存されます
                </p>
                <Link
                  href="/diagnosis"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all hover:shadow-lg font-semibold"
                >
                  診断を始める
                </Link>
              </div>
            )}

          {/* History List */}
          {!isAuthLoading && isLoggedIn && !isLoading && history.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-primary-600 font-medium">
                  {history.length}件の診断履歴
                </p>
              </div>

              {history.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200"
                >
                  {/* Gradient accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-purple-500 via-pink-500 to-orange-400" />

                  <div className="p-5 sm:p-6 pl-6 sm:pl-8">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                          <Sparkles className="text-white" size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                item.diagnosisType === "detailed"
                                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                  : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                              }`}
                            >
                              {item.diagnosisType === "detailed"
                                ? "詳細診断"
                                : "シンプル診断"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <Calendar size={14} />
                            <span>{formatDate(item.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 disabled:opacity-50"
                          title="削除"
                        >
                          <Trash2 size={18} />
                        </button>
                        <Link
                          href={buildResultsUrl(item)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg"
                        >
                          結果を見る
                          <ChevronRight size={16} />
                        </Link>
                      </div>
                    </div>

                    {/* Goals */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target size={14} className="text-blue-500" />
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          健康目標
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.goals.map((goal) => (
                          <span
                            key={goal}
                            className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100"
                          >
                            {HEALTH_GOAL_LABELS[goal] || goal}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Budget & Priority Cards */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {item.budget && (
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                          <div className="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center">
                            <DollarSign size={18} className="text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-green-600 font-medium">
                              1日の予算
                            </p>
                            <p className="text-lg font-bold text-green-700">
                              ¥{item.budget.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                      {item.priority && (
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                          <div className="w-9 h-9 rounded-lg bg-purple-500 flex items-center justify-center">
                            <Shield size={18} className="text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-purple-600 font-medium">
                              優先事項
                            </p>
                            <p className="text-base font-bold text-purple-700">
                              {PRIORITY_LABELS[item.priority] || item.priority}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Conditions */}
                    {item.conditions &&
                      item.conditions.length > 0 &&
                      item.conditions[0] !== "none" && (
                        <div className="mb-4 p-3 bg-orange-50/50 rounded-xl border border-orange-100">
                          <p className="text-xs font-semibold text-orange-600 mb-2">
                            考慮した健康状態
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {item.conditions.map((condition) => (
                              <span
                                key={condition}
                                className="px-2.5 py-1 bg-white text-orange-700 rounded-lg text-xs font-medium border border-orange-200"
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
                        <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-2 mb-3">
                            <Trophy size={16} className="text-yellow-500" />
                            <span className="text-sm font-bold text-gray-700">
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
                                const rankColors =
                                  idx === 0
                                    ? "from-yellow-400 to-amber-500 text-white"
                                    : idx === 1
                                      ? "from-gray-300 to-gray-400 text-white"
                                      : "from-orange-300 to-orange-400 text-white";
                                return (
                                  <div
                                    key={rec.productId}
                                    className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100"
                                  >
                                    <div
                                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${rankColors} flex items-center justify-center shadow-sm`}
                                    >
                                      <RankIcon size={16} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 flex-1">
                                      {rec.productName}
                                    </span>
                                    <span className="text-xs text-gray-400">
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
              ))}
            </div>
          )}

          {/* Back to Diagnosis */}
          {!isAuthLoading && isLoggedIn && !isLoading && (
            <div className="mt-10 text-center">
              <Link
                href="/diagnosis"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <Sparkles size={24} />
                新しい診断を始める
                <ChevronRight size={20} />
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
