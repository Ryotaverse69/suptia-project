"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useUserProfile,
  ProfileUpdateData,
} from "@/contexts/UserProfileContext";
import { LoginModal } from "@/components/auth/LoginModal";

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

// プラン別背景設定（Free→Pro→Pro+Safetyで段階的に濃くなる）
const PLAN_BACKGROUNDS = {
  free: {
    main: "from-violet-800 via-purple-700 to-indigo-800",
    aurora1:
      "from-violet-400/55 via-fuchsia-300/45 via-pink-300/50 via-rose-200/40 to-violet-400/55",
    aurora2:
      "from-cyan-300/50 via-blue-300/40 via-indigo-300/45 via-violet-300/35 to-cyan-300/50",
    aurora3:
      "from-amber-300/40 via-orange-200/35 via-rose-300/40 via-pink-200/35 to-amber-300/40",
    orb1: "bg-violet-300/35",
    orb2: "bg-fuchsia-300/30",
    starOpacity: "opacity-50",
    topLine: "via-violet-200",
    shimmer: "from-white/10 via-transparent to-white/5",
  },
  pro: {
    main: "from-indigo-950 via-purple-900 to-violet-950",
    aurora1:
      "from-violet-500/50 via-fuchsia-400/40 via-pink-400/45 via-rose-300/35 to-violet-500/50",
    aurora2:
      "from-cyan-400/45 via-blue-400/35 via-indigo-400/40 via-violet-400/30 to-cyan-400/45",
    aurora3:
      "from-amber-400/35 via-orange-300/30 via-rose-400/35 via-pink-300/30 to-amber-400/35",
    orb1: "bg-violet-400/30",
    orb2: "bg-fuchsia-400/25",
    starOpacity: "opacity-40",
    topLine: "via-violet-300",
    shimmer: "from-white/5 via-transparent to-white/3",
  },
  pro_safety: {
    main: "from-slate-950 via-gray-950 to-zinc-950",
    aurora1:
      "from-emerald-600/40 via-teal-500/30 via-cyan-500/35 via-blue-400/25 to-emerald-600/40",
    aurora2:
      "from-indigo-500/35 via-violet-400/25 via-purple-400/30 via-blue-400/20 to-indigo-500/35",
    aurora3:
      "from-teal-500/30 via-cyan-400/25 via-emerald-400/30 via-green-300/20 to-teal-500/30",
    orb1: "bg-emerald-500/25",
    orb2: "bg-teal-500/20",
    starOpacity: "opacity-30",
    topLine: "via-emerald-400",
    shimmer: "from-white/3 via-transparent to-white/2",
  },
};

// アニメーション設定
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

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

  // プランに応じた背景設定
  const bgConfig = PLAN_BACKGROUNDS[profile?.plan || "free"];

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
      className={`min-h-screen bg-gradient-to-br ${bgConfig.main} py-8 sm:py-12 md:py-16 relative overflow-hidden transition-colors duration-700`}
    >
      {/* Premium Background - Plan-based colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated aurora beams */}
        <div
          className={`absolute -top-1/3 -right-1/4 w-[700px] h-[700px] bg-gradient-conic ${bgConfig.aurora1} rounded-full blur-3xl animate-spin`}
          style={{ animationDuration: "55s" }}
        />
        <div
          className={`absolute top-1/3 -left-1/4 w-[550px] h-[550px] bg-gradient-conic ${bgConfig.aurora2} rounded-full blur-3xl animate-spin`}
          style={{ animationDuration: "45s", animationDirection: "reverse" }}
        />
        <div
          className={`absolute -bottom-1/4 right-1/3 w-[600px] h-[600px] bg-gradient-conic ${bgConfig.aurora3} rounded-full blur-3xl animate-spin`}
          style={{ animationDuration: "50s" }}
        />

        {/* Floating accent orbs */}
        <div
          className={`absolute top-1/4 right-1/3 w-56 h-56 ${bgConfig.orb1} rounded-full blur-2xl`}
        />
        <div
          className={`absolute bottom-1/4 left-1/3 w-64 h-64 ${bgConfig.orb2} rounded-full blur-2xl`}
        />

        {/* Star field effect */}
        <div
          className={`absolute inset-0 ${bgConfig.starOpacity}`}
          style={{
            backgroundImage: `radial-gradient(1.5px 1.5px at 20px 30px, white, transparent),
                           radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.9), transparent),
                           radial-gradient(1.5px 1.5px at 50px 160px, rgba(255,255,255,0.7), transparent),
                           radial-gradient(1px 1px at 90px 40px, white, transparent),
                           radial-gradient(1.5px 1.5px at 130px 80px, rgba(255,255,255,0.8), transparent),
                           radial-gradient(1px 1px at 160px 120px, white, transparent)`,
            backgroundSize: "200px 200px",
          }}
        />

        {/* Shimmer overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-b ${bgConfig.shimmer}`}
        />

        {/* Top premium line */}
        <div
          className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent ${bgConfig.topLine} to-transparent`}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              href="/mypage"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-6 group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm group-hover:bg-white/20 flex items-center justify-center transition-all border border-white/20">
                <ChevronLeft size={18} />
              </div>
              <span className="font-medium">マイページに戻る</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <Shield size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  健康情報管理
                </h1>
                <p className="text-slate-400">既往歴・服薬・アレルギーの登録</p>
              </div>
            </div>
          </motion.div>

          {/* Safety Feature Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 p-5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-xl border border-emerald-400/30 rounded-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-300 mb-1">
                  Safety Guardian 機能の準備
                </h3>
                <p className="text-sm text-emerald-200/80 leading-relaxed">
                  この情報は将来のAIコンシェルジュ「Safety Guardian」機能で、
                  あなたに適した商品のみを推薦するために使用されます。
                  入力は任意です。
                </p>
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-20">
              <div className="relative inline-block">
                <div className="w-16 h-16 rounded-full border-4 border-violet-400/30 border-t-violet-300 animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-r-fuchsia-300 animate-spin animation-delay-150"></div>
              </div>
              <p className="mt-6 text-violet-200 font-medium">読み込み中...</p>
            </div>
          )}

          {/* Not Logged In State */}
          {!isLoading && !isLoggedIn && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 ring-1 ring-violet-400/20"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500/40 to-teal-500/40 flex items-center justify-center ring-2 ring-emerald-300/40">
                <LogIn size={36} className="text-emerald-300" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                ログインが必要です
              </h2>
              <p className="text-slate-400 mb-8">
                健康情報を管理するにはログインしてください。
              </p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all font-semibold ring-1 ring-white/20"
              >
                <LogIn size={20} />
                ログイン / 新規登録
              </button>
            </motion.div>
          )}

          {/* Form */}
          {!isLoading && isLoggedIn && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* 既往歴カード */}
              <motion.div
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden ring-1 ring-violet-400/20"
              >
                <div className="p-5 border-b border-white/10 bg-gradient-to-r from-orange-500/20 to-red-500/20">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Heart size={20} className="text-orange-400" />
                    既往歴・現在の状態
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    該当するものを選択してください（複数選択可）
                  </p>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {CONDITIONS.map((condition) => {
                      const isSelected = conditions.includes(condition.value);
                      return (
                        <motion.button
                          key={condition.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleCondition(condition.value)}
                          className={`relative p-4 rounded-2xl text-left transition-all duration-300 ${
                            isSelected
                              ? "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25"
                              : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                          }`}
                        >
                          <span className="text-xl mb-2 block">
                            {condition.icon}
                          </span>
                          <span className="text-sm font-medium block">
                            {condition.label}
                          </span>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center"
                            >
                              <Check size={12} className="text-orange-500" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* 服用中の薬カード */}
              <motion.div
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden ring-1 ring-violet-400/20"
              >
                <div className="p-5 border-b border-white/10 bg-gradient-to-r from-blue-500/20 to-indigo-500/20">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Pill size={20} className="text-blue-400" />
                    服用中の薬
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
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
                      className="flex-1 px-4 py-3.5 rounded-xl border-2 border-white/20 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all outline-none bg-white/10 text-white placeholder-slate-400"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addMedication}
                      className="px-5 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all shadow-md"
                    >
                      <Plus size={20} />
                    </motion.button>
                  </div>

                  {/* 登録済みの薬リスト */}
                  {medications.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {medications.map((medication) => (
                        <motion.span
                          key={medication}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 rounded-xl text-sm font-medium border border-blue-400/30"
                        >
                          <Pill size={14} />
                          {medication}
                          <button
                            onClick={() => removeMedication(medication)}
                            className="hover:text-red-400 transition-colors ml-1"
                          >
                            <X size={14} />
                          </button>
                        </motion.span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-4">
                      登録された薬はありません
                    </p>
                  )}
                </div>
              </motion.div>

              {/* アレルギーカード */}
              <motion.div
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden ring-1 ring-violet-400/20"
              >
                <div className="p-5 border-b border-white/10 bg-gradient-to-r from-amber-500/20 to-orange-500/20">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <AlertCircle size={20} className="text-amber-400" />
                    アレルギー
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    該当するものを選択してください（複数選択可）
                  </p>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ALLERGIES.map((allergy) => {
                      const isSelected = allergies.includes(allergy.value);
                      return (
                        <motion.button
                          key={allergy.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleAllergy(allergy.value)}
                          className={`relative p-4 rounded-2xl text-left transition-all duration-300 ${
                            isSelected
                              ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25"
                              : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                          }`}
                        >
                          <span className="text-xl mb-2 block">
                            {allergy.icon}
                          </span>
                          <span className="text-sm font-medium block">
                            {allergy.label}
                          </span>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center"
                            >
                              <Check size={12} className="text-amber-500" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* 注意事項 */}
              <motion.div
                variants={itemVariants}
                className="p-5 bg-white/5 backdrop-blur border border-white/10 rounded-2xl"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Info size={20} className="text-slate-400" />
                  </div>
                  <div className="text-sm text-slate-400">
                    <p className="font-semibold text-slate-300 mb-1">ご注意</p>
                    <p className="leading-relaxed">
                      この情報は参考目的であり、医療アドバイスの代替ではありません。
                      サプリメントの服用については、必ず医師・薬剤師にご相談ください。
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* エラーメッセージ */}
              {saveError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-400/30 rounded-2xl text-red-300"
                >
                  <AlertCircle size={20} />
                  <span className="font-medium">{saveError}</span>
                </motion.div>
              )}

              {/* 保存ボタン */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSave}
                disabled={isSaving}
                className={`w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl font-bold text-lg text-white transition-all shadow-lg ring-1 ring-white/20 ${
                  saveSuccess
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/25"
                    : "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:shadow-xl shadow-emerald-500/25"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
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
              </motion.button>
            </motion.div>
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
