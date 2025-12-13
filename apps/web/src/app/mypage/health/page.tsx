"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  ChevronLeft,
  Save,
  LogIn,
  Check,
  AlertCircle,
  Plus,
  X,
  Info,
  Heart,
  Pill,
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

// 既往歴オプション
const CONDITIONS = [
  { value: "hypertension", label: "高血圧", icon: "💉" },
  { value: "hypotension", label: "低血圧", icon: "📉" },
  { value: "diabetes", label: "糖尿病", icon: "🩸" },
  { value: "heart-disease", label: "心臓疾患", icon: "❤️" },
  { value: "liver-disease", label: "肝臓疾患", icon: "🫀" },
  { value: "kidney-disease", label: "腎臓疾患", icon: "🫘" },
  { value: "thyroid-disorder", label: "甲状腺疾患", icon: "🦋" },
  { value: "autoimmune-disease", label: "自己免疫疾患", icon: "🛡️" },
  { value: "digestive-disorder", label: "消化器疾患", icon: "🌿" },
  { value: "mental-disorder", label: "精神疾患", icon: "🧠" },
  { value: "pregnant", label: "妊娠中", icon: "🤰" },
  { value: "breastfeeding", label: "授乳中", icon: "👶" },
];

// アレルギーオプション
const ALLERGIES = [
  { value: "soy", label: "大豆", icon: "🫘" },
  { value: "dairy", label: "乳製品", icon: "🥛" },
  { value: "gluten", label: "グルテン", icon: "🌾" },
  { value: "egg", label: "卵", icon: "🥚" },
  { value: "shellfish", label: "甲殻類", icon: "🦐" },
  { value: "fish", label: "魚", icon: "🐟" },
  { value: "peanut", label: "ピーナッツ", icon: "🥜" },
  { value: "tree-nuts", label: "ナッツ類", icon: "🌰" },
  { value: "sesame", label: "ごま", icon: "⚫" },
  { value: "wheat", label: "小麦", icon: "🌿" },
];

export default function HealthInfoPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // フォーム状態
  const [conditions, setConditions] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [newMedication, setNewMedication] = useState("");

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
      setConditions(profile.conditions || []);
      setAllergies(profile.allergies || []);
      setMedications(profile.medications || []);
    }
  }, [profile]);

  // 既往歴のトグル
  const toggleCondition = (condition: string) => {
    setConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition],
    );
  };

  // アレルギーのトグル
  const toggleAllergy = (allergy: string) => {
    setAllergies((prev) =>
      prev.includes(allergy)
        ? prev.filter((a) => a !== allergy)
        : [...prev, allergy],
    );
  };

  // 服用中の薬を追加
  const addMedication = () => {
    if (newMedication.trim() && !medications.includes(newMedication.trim())) {
      setMedications((prev) => [...prev, newMedication.trim()]);
      setNewMedication("");
    }
  };

  // 服用中の薬を削除
  const removeMedication = (medication: string) => {
    setMedications((prev) => prev.filter((m) => m !== medication));
  };

  // 保存処理
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    const data: ProfileUpdateData = {
      conditions,
      allergies,
      medications,
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
                  background: `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
                  boxShadow: "0 8px 24px rgba(52, 199, 89, 0.25)",
                }}
              >
                <Shield size={32} className="text-white" />
              </div>
              <div>
                <h1
                  className="text-[22px] sm:text-[24px] font-bold"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  健康情報管理
                </h1>
                <p
                  className="text-[15px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  既往歴・服薬・アレルギーの登録
                </p>
              </div>
            </div>
          </div>

          {/* Safety Feature Notice */}
          <div
            className="mb-6 p-5 rounded-[16px] border"
            style={{
              background: `linear-gradient(135deg, ${systemColors.green}10 0%, ${systemColors.teal}10 100%)`,
              borderColor: `${systemColors.green}30`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
                }}
              >
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <h3
                  className="font-bold text-[15px] mb-1"
                  style={{ color: systemColors.green }}
                >
                  Safety Guardian 機能の準備
                </h3>
                <p
                  className="text-[13px] leading-relaxed"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  この情報は将来のAIコンシェルジュ「Safety Guardian」機能で、
                  あなたに適した商品のみを推薦するために使用されます。
                  入力は任意です。
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
                  borderColor: `${systemColors.green}30`,
                  borderTopColor: systemColors.green,
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
                  background: `linear-gradient(135deg, ${systemColors.green}20 0%, ${systemColors.teal}20 100%)`,
                }}
              >
                <LogIn size={36} style={{ color: systemColors.green }} />
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
                健康情報を管理するにはログインしてください。
              </p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[15px] font-semibold text-white transition-all min-h-[48px]"
                style={{
                  background: `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
                  boxShadow: "0 4px 12px rgba(52, 199, 89, 0.3)",
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
              {/* 既往歴カード */}
              <div
                className={`overflow-hidden ${liquidGlassClasses.light} transition-all duration-300 hover:-translate-y-1`}
              >
                <div
                  className="p-5 border-b"
                  style={{
                    borderColor: appleWebColors.borderSubtle,
                    background: `linear-gradient(135deg, ${systemColors.orange}10 0%, ${systemColors.red}10 100%)`,
                  }}
                >
                  <h2
                    className="text-[17px] font-bold flex items-center gap-2"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    <Heart size={20} style={{ color: systemColors.orange }} />
                    既往歴・現在の状態
                  </h2>
                  <p
                    className="text-[13px] mt-1"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    該当するものを選択してください（複数選択可）
                  </p>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {CONDITIONS.map((condition) => {
                      const isSelected = conditions.includes(condition.value);
                      return (
                        <button
                          key={condition.value}
                          onClick={() => toggleCondition(condition.value)}
                          className="relative p-4 rounded-[16px] text-left transition-all duration-200 min-h-[80px]"
                          style={{
                            background: isSelected
                              ? `linear-gradient(135deg, ${systemColors.orange} 0%, ${systemColors.red} 100%)`
                              : appleWebColors.sectionBackground,
                            color: isSelected
                              ? "white"
                              : appleWebColors.textPrimary,
                            border: isSelected
                              ? "none"
                              : `1px solid ${appleWebColors.borderSubtle}`,
                            boxShadow: isSelected
                              ? "0 4px 12px rgba(255, 149, 0, 0.25)"
                              : "none",
                          }}
                        >
                          <span className="text-xl mb-2 block">
                            {condition.icon}
                          </span>
                          <span className="text-[13px] font-medium block">
                            {condition.label}
                          </span>
                          {isSelected && (
                            <div
                              className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: "white" }}
                            >
                              <Check
                                size={12}
                                style={{ color: systemColors.orange }}
                              />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 服用中の薬カード */}
              <div
                className={`overflow-hidden ${liquidGlassClasses.light} transition-all duration-300 hover:-translate-y-1`}
              >
                <div
                  className="p-5 border-b"
                  style={{
                    borderColor: appleWebColors.borderSubtle,
                    background: `linear-gradient(135deg, ${systemColors.blue}10 0%, ${systemColors.indigo}10 100%)`,
                  }}
                >
                  <h2
                    className="text-[17px] font-bold flex items-center gap-2"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    <Pill size={20} style={{ color: systemColors.blue }} />
                    服用中の薬
                  </h2>
                  <p
                    className="text-[13px] mt-1"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    現在服用中の薬を入力してください
                  </p>
                </div>

                <div className="p-6">
                  {/* 入力フィールド */}
                  <div className="flex gap-3 mb-5">
                    <input
                      type="text"
                      value={newMedication}
                      onChange={(e) => setNewMedication(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addMedication()}
                      placeholder="薬の名前を入力"
                      className="flex-1 px-4 py-3.5 rounded-xl text-[15px] transition-all outline-none min-h-[48px]"
                      style={{
                        backgroundColor: appleWebColors.sectionBackground,
                        border: `1px solid ${appleWebColors.borderSubtle}`,
                        color: appleWebColors.textPrimary,
                      }}
                    />
                    <button
                      onClick={addMedication}
                      className="px-5 py-3.5 rounded-xl text-white transition-all min-h-[48px]"
                      style={{
                        background: `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.indigo} 100%)`,
                        boxShadow: "0 4px 12px rgba(0, 122, 255, 0.25)",
                      }}
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  {/* 登録済みの薬リスト */}
                  {medications.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {medications.map((medication) => (
                        <span
                          key={medication}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium border"
                          style={{
                            backgroundColor: `${systemColors.blue}10`,
                            borderColor: `${systemColors.blue}30`,
                            color: systemColors.blue,
                          }}
                        >
                          <Pill size={14} />
                          {medication}
                          <button
                            onClick={() => removeMedication(medication)}
                            className="ml-1 transition-colors"
                            style={{ color: systemColors.red }}
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p
                      className="text-[13px] text-center py-4"
                      style={{ color: appleWebColors.textTertiary }}
                    >
                      登録された薬はありません
                    </p>
                  )}
                </div>
              </div>

              {/* アレルギーカード */}
              <div
                className={`overflow-hidden ${liquidGlassClasses.light} transition-all duration-300 hover:-translate-y-1`}
              >
                <div
                  className="p-5 border-b"
                  style={{
                    borderColor: appleWebColors.borderSubtle,
                    background: `linear-gradient(135deg, ${systemColors.yellow}10 0%, ${systemColors.orange}10 100%)`,
                  }}
                >
                  <h2
                    className="text-[17px] font-bold flex items-center gap-2"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    <AlertCircle
                      size={20}
                      style={{ color: systemColors.yellow }}
                    />
                    アレルギー
                  </h2>
                  <p
                    className="text-[13px] mt-1"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    該当するものを選択してください（複数選択可）
                  </p>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ALLERGIES.map((allergy) => {
                      const isSelected = allergies.includes(allergy.value);
                      return (
                        <button
                          key={allergy.value}
                          onClick={() => toggleAllergy(allergy.value)}
                          className="relative p-4 rounded-[16px] text-left transition-all duration-200 min-h-[80px]"
                          style={{
                            background: isSelected
                              ? `linear-gradient(135deg, ${systemColors.yellow} 0%, ${systemColors.orange} 100%)`
                              : appleWebColors.sectionBackground,
                            color: isSelected
                              ? "white"
                              : appleWebColors.textPrimary,
                            border: isSelected
                              ? "none"
                              : `1px solid ${appleWebColors.borderSubtle}`,
                            boxShadow: isSelected
                              ? "0 4px 12px rgba(255, 204, 0, 0.25)"
                              : "none",
                          }}
                        >
                          <span className="text-xl mb-2 block">
                            {allergy.icon}
                          </span>
                          <span className="text-[13px] font-medium block">
                            {allergy.label}
                          </span>
                          {isSelected && (
                            <div
                              className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: "white" }}
                            >
                              <Check
                                size={12}
                                style={{ color: systemColors.yellow }}
                              />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 注意事項 */}
              <div
                className="p-5 rounded-[16px] border"
                style={{
                  backgroundColor: appleWebColors.sectionBackground,
                  borderColor: appleWebColors.borderSubtle,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${systemColors.blue}15` }}
                  >
                    <Info size={20} style={{ color: systemColors.blue }} />
                  </div>
                  <div>
                    <p
                      className="font-semibold text-[14px] mb-1"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      ご注意
                    </p>
                    <p
                      className="text-[13px] leading-relaxed"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      この情報は参考目的であり、医療アドバイスの代替ではありません。
                      サプリメントの服用については、必ず医師・薬剤師にご相談ください。
                    </p>
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
                    ? `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.cyan} 100%)`
                    : `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
                  boxShadow: saveSuccess
                    ? "0 4px 12px rgba(0, 122, 255, 0.3)"
                    : "0 4px 12px rgba(52, 199, 89, 0.3)",
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
