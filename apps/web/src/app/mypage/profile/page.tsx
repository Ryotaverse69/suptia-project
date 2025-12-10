"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useUserProfile,
  ProfileUpdateData,
} from "@/contexts/UserProfileContext";
import { LoginModal } from "@/components/auth/LoginModal";

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
    cardBg: "bg-white/15",
    cardBorder: "border-white/30",
    textPrimary: "text-white",
    textSecondary: "text-slate-300",
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
    cardBg: "bg-white/10",
    cardBorder: "border-white/20",
    textPrimary: "text-white",
    textSecondary: "text-slate-400",
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
    cardBg: "bg-white/8",
    cardBorder: "border-white/15",
    textPrimary: "text-white",
    textSecondary: "text-slate-400",
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

  // プランに応じた背景設定
  const bgConfig = PLAN_BACKGROUNDS[profile?.plan || "free"];

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
      className={`min-h-screen bg-gradient-to-br ${bgConfig.main} py-8 sm:py-12 md:py-16 relative overflow-hidden transition-colors duration-700`}
    >
      {/* Premium Background - Plan-based colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated aurora beams */}
        <div
          className={`absolute -top-1/3 -right-1/4 w-[700px] h-[700px] bg-gradient-conic ${bgConfig.aurora1} rounded-full blur-3xl animate-spin`}
          style={{ animationDuration: "50s" }}
        />
        <div
          className={`absolute top-1/3 -left-1/4 w-[550px] h-[550px] bg-gradient-conic ${bgConfig.aurora2} rounded-full blur-3xl animate-spin`}
          style={{ animationDuration: "40s", animationDirection: "reverse" }}
        />
        <div
          className={`absolute -bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-conic ${bgConfig.aurora3} rounded-full blur-3xl animate-spin`}
          style={{ animationDuration: "55s" }}
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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Settings size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  プロフィール編集
                </h1>
                <p className="text-slate-400">基本情報と健康目標の設定</p>
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
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-500/40 to-fuchsia-500/40 flex items-center justify-center ring-2 ring-violet-300/40">
                <LogIn size={36} className="text-violet-300" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                ログインが必要です
              </h2>
              <p className="text-slate-400 mb-8">
                プロフィールを編集するにはログインしてください。
              </p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 text-white rounded-xl hover:shadow-lg hover:shadow-violet-500/30 transition-all font-semibold ring-1 ring-white/20"
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
              {/* 基本情報カード */}
              <motion.div
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden ring-1 ring-violet-400/20"
              >
                <div className="p-5 border-b border-white/10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <User size={20} className="text-blue-400" />
                    基本情報
                  </h2>
                </div>

                <div className="p-6 space-y-5">
                  {/* 表示名 */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      表示名
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="ニックネームを入力"
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-white/20 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all outline-none bg-white/10 text-white placeholder-slate-400"
                    />
                    <p className="mt-2 text-xs text-slate-400">
                      マイページに表示される名前です
                    </p>
                  </div>

                  {/* 年齢層 */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <Calendar size={16} className="text-slate-400" />
                      年齢層
                    </label>
                    <select
                      value={ageRange}
                      onChange={(e) => setAgeRange(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-white/20 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all outline-none bg-white/10 text-white appearance-none cursor-pointer"
                    >
                      {AGE_RANGES.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className="bg-slate-800 text-white"
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 性別 */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      性別
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-white/20 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all outline-none bg-white/10 text-white appearance-none cursor-pointer"
                    >
                      {GENDERS.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className="bg-slate-800 text-white"
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* 健康目標カード */}
              <motion.div
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden ring-1 ring-violet-400/20"
              >
                <div className="p-5 border-b border-white/10 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Target size={20} className="text-purple-400" />
                    健康目標
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    関心のある目標を選択してください（複数選択可）
                  </p>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {HEALTH_GOALS.map((goal) => {
                      const isSelected = healthGoals.includes(goal.value);
                      return (
                        <motion.button
                          key={goal.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleHealthGoal(goal.value)}
                          className={`relative p-4 rounded-2xl text-left transition-all duration-300 ${
                            isSelected
                              ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25"
                              : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                          }`}
                        >
                          <span className="text-xl mb-2 block">
                            {goal.icon}
                          </span>
                          <span className="text-sm font-medium block">
                            {goal.label}
                          </span>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center"
                            >
                              <Check size={12} className="text-purple-500" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
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
                    : "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 hover:shadow-xl shadow-violet-500/25"
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
