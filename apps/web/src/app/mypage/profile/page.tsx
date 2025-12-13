"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  ChevronLeft,
  Save,
  LogIn,
  Check,
  AlertCircle,
  User,
  Calendar,
  Target,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useUserProfile,
  ProfileUpdateData,
} from "@/contexts/UserProfileContext";
import { LoginModal } from "@/components/auth/LoginModal";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlass,
  liquidGlassClasses,
} from "@/lib/design-system";

// 年齢層オプション
const AGE_RANGES = [
  { value: "", label: "選択してください" },
  { value: "10-19", label: "10代" },
  { value: "20-29", label: "20代" },
  { value: "30-39", label: "30代" },
  { value: "40-49", label: "40代" },
  { value: "50-59", label: "50代" },
  { value: "60-69", label: "60代" },
  { value: "70+", label: "70代以上" },
];

// 性別オプション
const GENDERS = [
  { value: "", label: "選択してください" },
  { value: "male", label: "男性" },
  { value: "female", label: "女性" },
  { value: "other", label: "その他" },
  { value: "prefer_not_to_say", label: "回答しない" },
];

// 健康目標オプション
const HEALTH_GOALS = [
  { value: "immune-boost", label: "免疫力強化", icon: "🛡️" },
  { value: "energy-recovery", label: "疲労回復", icon: "⚡" },
  { value: "skin-health", label: "美肌・肌の健康", icon: "✨" },
  { value: "bone-health", label: "骨の健康", icon: "🦴" },
  { value: "heart-health", label: "心臓の健康", icon: "❤️" },
  { value: "brain-function", label: "脳機能・集中力", icon: "🧠" },
  { value: "sleep-quality", label: "睡眠の質向上", icon: "😴" },
  { value: "stress-relief", label: "ストレス軽減", icon: "🧘" },
  { value: "muscle-building", label: "筋肉増強", icon: "💪" },
  { value: "weight-management", label: "体重管理", icon: "⚖️" },
  { value: "eye-health", label: "目の健康", icon: "👁️" },
  { value: "digestive-health", label: "消化器の健康", icon: "🌿" },
];

export default function ProfileEditPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // フォーム状態
  const [displayName, setDisplayName] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [gender, setGender] = useState("");
  const [healthGoals, setHealthGoals] = useState<string[]>([]);

  const { user, isLoading: authLoading } = useAuth();
  const {
    profile,
    isLoading: profileLoading,
    updateProfile,
  } = useUserProfile();

  const isLoggedIn = !!user;
  const isLoading = authLoading || profileLoading;

  // プロフィールが読み込まれたらフォームを初期化
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setAgeRange(profile.ageRange || "");
      setGender(profile.gender || "");
      setHealthGoals(profile.healthGoals || []);
    }
  }, [profile]);

  // 健康目標のトグル
  const toggleHealthGoal = (goal: string) => {
    setHealthGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal],
    );
  };

  // 保存処理
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    const data: ProfileUpdateData = {
      displayName: displayName || null,
      ageRange: ageRange || null,
      gender: gender || null,
      healthGoals,
    };

    const success = await updateProfile(data);

    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setSaveError("保存に失敗しました。もう一度お試しください。");
    }

    setIsSaving(false);
  };

  return (
    <div
      className="min-h-screen py-8 sm:py-12 md:py-16"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/mypage"
              className="inline-flex items-center gap-2 transition-colors mb-6 group min-h-[44px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{
                  backgroundColor: appleWebColors.sectionBackground,
                  border: `1px solid ${appleWebColors.borderSubtle}`,
                }}
              >
                <ChevronLeft size={18} />
              </div>
              <span className="text-[15px] font-medium">マイページに戻る</span>
            </Link>

            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.cyan} 100%)`,
                  boxShadow: "0 8px 24px rgba(0, 122, 255, 0.25)",
                }}
              >
                <Settings size={32} className="text-white" />
              </div>
              <div>
                <h1
                  className="text-[22px] sm:text-[24px] font-bold"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  プロフィール編集
                </h1>
                <p
                  className="text-[15px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  基本情報と健康目標の設定
                </p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-20">
              <div
                className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mx-auto"
                style={{
                  borderColor: `${systemColors.blue}30`,
                  borderTopColor: systemColors.blue,
                }}
              />
              <p
                className="mt-6 text-[15px] font-medium"
                style={{ color: appleWebColors.textSecondary }}
              >
                読み込み中...
              </p>
            </div>
          )}

          {/* Not Logged In State */}
          {!isLoading && !isLoggedIn && (
            <div className={`text-center py-16 ${liquidGlassClasses.light}`}>
              <div
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${systemColors.blue}20 0%, ${systemColors.cyan}20 100%)`,
                }}
              >
                <LogIn size={36} style={{ color: systemColors.blue }} />
              </div>
              <h2
                className="text-[22px] font-bold mb-4"
                style={{ color: appleWebColors.textPrimary }}
              >
                ログインが必要です
              </h2>
              <p
                className="text-[15px] mb-8"
                style={{ color: appleWebColors.textSecondary }}
              >
                プロフィールを編集するにはログインしてください。
              </p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[15px] font-semibold text-white transition-all min-h-[48px]"
                style={{
                  background: `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.cyan} 100%)`,
                  boxShadow: "0 4px 12px rgba(0, 122, 255, 0.3)",
                }}
              >
                <LogIn size={20} />
                ログイン / 新規登録
              </button>
            </div>
          )}

          {/* Form */}
          {!isLoading && isLoggedIn && (
            <div className="space-y-6">
              {/* 基本情報カード */}
              <div
                className={`overflow-hidden ${liquidGlassClasses.light} transition-all duration-300 hover:-translate-y-1`}
              >
                <div
                  className="p-5 border-b"
                  style={{
                    borderColor: appleWebColors.borderSubtle,
                    background: `linear-gradient(135deg, ${systemColors.blue}10 0%, ${systemColors.cyan}10 100%)`,
                  }}
                >
                  <h2
                    className="text-[17px] font-bold flex items-center gap-2"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    <User size={20} style={{ color: systemColors.blue }} />
                    基本情報
                  </h2>
                </div>

                <div className="p-6 space-y-5">
                  {/* 表示名 */}
                  <div>
                    <label
                      className="block text-[14px] font-semibold mb-2"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      表示名
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="ニックネームを入力"
                      className="w-full px-4 py-3.5 rounded-xl text-[15px] transition-all outline-none min-h-[48px]"
                      style={{
                        backgroundColor: appleWebColors.sectionBackground,
                        border: `1px solid ${appleWebColors.borderSubtle}`,
                        color: appleWebColors.textPrimary,
                      }}
                    />
                    <p
                      className="mt-2 text-[12px]"
                      style={{ color: appleWebColors.textTertiary }}
                    >
                      マイページに表示される名前です
                    </p>
                  </div>

                  {/* 年齢層 */}
                  <div>
                    <label
                      className="block text-[14px] font-semibold mb-2 flex items-center gap-2"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      <Calendar
                        size={16}
                        style={{ color: appleWebColors.textTertiary }}
                      />
                      年齢層
                    </label>
                    <select
                      value={ageRange}
                      onChange={(e) => setAgeRange(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl text-[15px] transition-all outline-none appearance-none cursor-pointer min-h-[48px]"
                      style={{
                        backgroundColor: appleWebColors.sectionBackground,
                        border: `1px solid ${appleWebColors.borderSubtle}`,
                        color: appleWebColors.textPrimary,
                      }}
                    >
                      {AGE_RANGES.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 性別 */}
                  <div>
                    <label
                      className="block text-[14px] font-semibold mb-2"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      性別
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl text-[15px] transition-all outline-none appearance-none cursor-pointer min-h-[48px]"
                      style={{
                        backgroundColor: appleWebColors.sectionBackground,
                        border: `1px solid ${appleWebColors.borderSubtle}`,
                        color: appleWebColors.textPrimary,
                      }}
                    >
                      {GENDERS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 健康目標カード */}
              <div
                className={`overflow-hidden ${liquidGlassClasses.light} transition-all duration-300 hover:-translate-y-1`}
              >
                <div
                  className="p-5 border-b"
                  style={{
                    borderColor: appleWebColors.borderSubtle,
                    background: `linear-gradient(135deg, ${systemColors.purple}10 0%, ${systemColors.pink}10 100%)`,
                  }}
                >
                  <h2
                    className="text-[17px] font-bold flex items-center gap-2"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    <Target size={20} style={{ color: systemColors.purple }} />
                    健康目標
                  </h2>
                  <p
                    className="text-[13px] mt-1"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    関心のある目標を選択してください（複数選択可）
                  </p>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {HEALTH_GOALS.map((goal) => {
                      const isSelected = healthGoals.includes(goal.value);
                      return (
                        <button
                          key={goal.value}
                          onClick={() => toggleHealthGoal(goal.value)}
                          className="relative p-4 rounded-[16px] text-left transition-all duration-200 min-h-[80px]"
                          style={{
                            background: isSelected
                              ? `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`
                              : appleWebColors.sectionBackground,
                            color: isSelected
                              ? "white"
                              : appleWebColors.textPrimary,
                            border: isSelected
                              ? "none"
                              : `1px solid ${appleWebColors.borderSubtle}`,
                            boxShadow: isSelected
                              ? "0 4px 12px rgba(175, 82, 222, 0.25)"
                              : "none",
                          }}
                        >
                          <span className="text-xl mb-2 block">
                            {goal.icon}
                          </span>
                          <span className="text-[13px] font-medium block">
                            {goal.label}
                          </span>
                          {isSelected && (
                            <div
                              className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: "white" }}
                            >
                              <Check
                                size={12}
                                style={{ color: systemColors.purple }}
                              />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* エラーメッセージ */}
              {saveError && (
                <div
                  className="flex items-center gap-3 p-4 rounded-[16px] border text-[14px]"
                  style={{
                    backgroundColor: `${systemColors.red}10`,
                    borderColor: `${systemColors.red}30`,
                    color: systemColors.red,
                  }}
                >
                  <AlertCircle size={20} />
                  <span className="font-medium">{saveError}</span>
                </div>
              )}

              {/* 保存ボタン */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-[17px] font-semibold text-white transition-all min-h-[56px] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: saveSuccess
                    ? `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`
                    : `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.cyan} 100%)`,
                  boxShadow: saveSuccess
                    ? "0 4px 12px rgba(52, 199, 89, 0.3)"
                    : "0 4px 12px rgba(0, 122, 255, 0.3)",
                }}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    保存中...
                  </>
                ) : saveSuccess ? (
                  <>
                    <Check size={22} />
                    保存しました
                  </>
                ) : (
                  <>
                    <Save size={22} />
                    変更を保存
                  </>
                )}
              </button>
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
