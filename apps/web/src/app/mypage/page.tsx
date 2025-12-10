"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Heart,
  History,
  Bell,
  Settings,
  Shield,
  ChevronRight,
  LogIn,
  Crown,
  Sparkles,
  TrendingUp,
  Star,
  Zap,
  Check,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useDiagnosisHistory } from "@/contexts/DiagnosisHistoryContext";
import { usePriceAlerts } from "@/contexts/PriceAlertsContext";
import { LoginModal } from "@/components/auth/LoginModal";

// プランバッジの設定
const PLAN_BADGES = {
  free: {
    label: "Free",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    gradient: "from-gray-400 to-gray-500",
    icon: null,
  },
  pro: {
    label: "Pro",
    color: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
    gradient: "from-purple-500 to-pink-500",
    icon: Crown,
  },
  pro_safety: {
    label: "Pro + Safety",
    color: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white",
    gradient: "from-emerald-500 to-teal-600",
    icon: Shield,
  },
};

// プラン別背景設定（Free→Pro→Pro+Safetyで段階的に濃くなる）
const PLAN_BACKGROUNDS = {
  free: {
    // 明るめの紫系
    main: "from-violet-800 via-purple-700 to-indigo-800",
    mesh: "bg-[radial-gradient(at_top_left,_rgba(196,181,253,0.45)_0%,_transparent_50%),radial-gradient(at_top_right,_rgba(251,146,195,0.4)_0%,_transparent_50%),radial-gradient(at_bottom_left,_rgba(103,232,249,0.35)_0%,_transparent_50%),radial-gradient(at_bottom_right,_rgba(253,224,71,0.3)_0%,_transparent_50%)]",
    aurora1:
      "from-violet-400/55 via-fuchsia-300/45 via-pink-300/50 via-rose-200/40 to-violet-400/55",
    aurora2:
      "from-cyan-300/50 via-blue-300/40 via-indigo-300/45 via-violet-300/35 to-cyan-300/50",
    aurora3:
      "from-amber-300/40 via-orange-200/35 via-rose-300/40 via-pink-200/35 to-amber-300/40",
    orb1: "bg-violet-300/35",
    orb2: "bg-fuchsia-300/30",
    orbCenter: "from-violet-400/25 via-transparent to-cyan-300/25",
    starOpacity: "opacity-50",
    topLine: "via-violet-200",
    topGlow: "from-violet-300/35",
  },
  pro: {
    // 中間の深い紫系
    main: "from-indigo-950 via-purple-900 to-violet-950",
    mesh: "bg-[radial-gradient(at_top_left,_rgba(167,139,250,0.4)_0%,_transparent_50%),radial-gradient(at_top_right,_rgba(244,114,182,0.35)_0%,_transparent_50%),radial-gradient(at_bottom_left,_rgba(34,211,238,0.3)_0%,_transparent_50%),radial-gradient(at_bottom_right,_rgba(251,191,36,0.25)_0%,_transparent_50%)]",
    aurora1:
      "from-violet-500/50 via-fuchsia-400/40 via-pink-400/45 via-rose-300/35 to-violet-500/50",
    aurora2:
      "from-cyan-400/45 via-blue-400/35 via-indigo-400/40 via-violet-400/30 to-cyan-400/45",
    aurora3:
      "from-amber-400/35 via-orange-300/30 via-rose-400/35 via-pink-300/30 to-amber-400/35",
    orb1: "bg-violet-400/30",
    orb2: "bg-fuchsia-400/25",
    orbCenter: "from-violet-500/20 via-transparent to-cyan-400/20",
    starOpacity: "opacity-40",
    topLine: "via-violet-300",
    topGlow: "from-violet-400/30",
  },
  pro_safety: {
    // 最も濃いダーク系
    main: "from-slate-950 via-gray-950 to-zinc-950",
    mesh: "bg-[radial-gradient(at_top_left,_rgba(99,102,241,0.3)_0%,_transparent_50%),radial-gradient(at_top_right,_rgba(16,185,129,0.25)_0%,_transparent_50%),radial-gradient(at_bottom_left,_rgba(20,184,166,0.2)_0%,_transparent_50%),radial-gradient(at_bottom_right,_rgba(34,211,238,0.15)_0%,_transparent_50%)]",
    aurora1:
      "from-emerald-600/40 via-teal-500/30 via-cyan-500/35 via-blue-400/25 to-emerald-600/40",
    aurora2:
      "from-indigo-500/35 via-violet-400/25 via-purple-400/30 via-blue-400/20 to-indigo-500/35",
    aurora3:
      "from-teal-500/30 via-cyan-400/25 via-emerald-400/30 via-green-300/20 to-teal-500/30",
    orb1: "bg-emerald-500/25",
    orb2: "bg-teal-500/20",
    orbCenter: "from-emerald-600/15 via-transparent to-cyan-500/15",
    starOpacity: "opacity-30",
    topLine: "via-emerald-400",
    topGlow: "from-emerald-500/25",
  },
};

// アニメーション設定
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function MyPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { user, isLoading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading, error: profileError } = useUserProfile();
  const { favorites, isLoading: favoritesLoading } = useFavorites();
  const { history, isLoading: historyLoading } = useDiagnosisHistory();
  const { alerts, isLoading: alertsLoading } = usePriceAlerts();

  const isLoggedIn = !!user;
  const isLoading = authLoading || profileLoading;

  // 統計データ
  const stats = [
    {
      label: "お気に入り",
      value: favoritesLoading ? "-" : favorites.length,
      icon: Heart,
      gradient: "from-pink-500 via-rose-500 to-red-500",
      bgGradient: "from-pink-50 to-rose-50",
      href: "/favorites",
      description: "保存した商品",
    },
    {
      label: "診断回数",
      value: historyLoading ? "-" : history.length,
      icon: Sparkles,
      gradient: "from-purple-500 via-violet-500 to-indigo-500",
      bgGradient: "from-purple-50 to-indigo-50",
      href: "/diagnosis/history",
      description: "実施した診断",
    },
    {
      label: "価格アラート",
      value: alertsLoading ? "-" : alerts.length,
      icon: Bell,
      gradient: "from-amber-500 via-orange-500 to-red-500",
      bgGradient: "from-amber-50 to-orange-50",
      href: "/mypage",
      description: "監視中の商品",
    },
  ];

  // メニューリンク
  const menuLinks = [
    {
      label: "プロフィール編集",
      description: "基本情報・健康目標の設定",
      icon: Settings,
      href: "/mypage/profile",
      gradient: "from-blue-500 to-cyan-500",
      iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
    },
    {
      label: "健康情報管理",
      description: "既往歴・服薬・アレルギーの登録",
      icon: Shield,
      href: "/mypage/health",
      gradient: "from-emerald-500 to-teal-500",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
      badge: "Safety準備",
      badgeColor: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "お気に入り商品",
      description: "保存した商品を確認・比較",
      icon: Heart,
      href: "/favorites",
      gradient: "from-pink-500 to-rose-500",
      iconBg: "bg-gradient-to-br from-pink-500 to-rose-500",
    },
    {
      label: "診断履歴",
      description: "過去の診断結果を確認",
      icon: History,
      href: "/diagnosis/history",
      gradient: "from-purple-500 to-indigo-500",
      iconBg: "bg-gradient-to-br from-purple-500 to-indigo-500",
    },
  ];

  const planConfig = PLAN_BADGES[profile?.plan || "free"];
  const PlanIcon = planConfig.icon;
  const bgConfig = PLAN_BACKGROUNDS[profile?.plan || "free"];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${bgConfig.main} py-8 sm:py-12 md:py-16 relative overflow-hidden transition-colors duration-700`}
    >
      {/* Ultra Premium Background - Plan-based colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Radiant mesh gradient base */}
        <div className={`absolute inset-0 ${bgConfig.mesh}`} />

        {/* Animated aurora beams */}
        <div
          className={`absolute -top-1/2 left-1/4 w-[1000px] h-[1000px] bg-gradient-conic ${bgConfig.aurora1} rounded-full blur-[100px] animate-spin`}
          style={{ animationDuration: "80s" }}
        />
        <div
          className={`absolute top-1/3 -right-1/4 w-[800px] h-[800px] bg-gradient-conic ${bgConfig.aurora2} rounded-full blur-[80px] animate-spin`}
          style={{ animationDuration: "60s", animationDirection: "reverse" }}
        />
        <div
          className={`absolute -bottom-1/3 left-1/3 w-[900px] h-[900px] bg-gradient-conic ${bgConfig.aurora3} rounded-full blur-[90px] animate-spin`}
          style={{ animationDuration: "70s" }}
        />

        {/* Glowing orbs */}
        <div
          className={`absolute top-1/4 left-1/4 w-96 h-96 ${bgConfig.orb1} rounded-full blur-[60px] animate-pulse`}
          style={{ animationDuration: "4s" }}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 w-80 h-80 ${bgConfig.orb2} rounded-full blur-[50px] animate-pulse`}
          style={{ animationDuration: "5s" }}
        />
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br ${bgConfig.orbCenter} rounded-full blur-[80px]`}
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

        {/* Soft light overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/5" />

        {/* Top premium glow line */}
        <div
          className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent ${bgConfig.topLine} to-transparent`}
        />
        <div
          className={`absolute top-0 left-0 right-0 h-12 bg-gradient-to-b ${bgConfig.topGlow} to-transparent`}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 rounded-3xl mb-4 sm:mb-6 shadow-2xl shadow-violet-500/40 ring-2 ring-white/20">
              <User size={40} className="text-white sm:w-12 sm:h-12" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-violet-200 to-white bg-clip-text text-transparent mb-3 sm:mb-4">
              マイページ
            </h1>
            <p className="text-base sm:text-lg text-slate-400">
              あなたのサプリメント管理ダッシュボード
            </p>
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
              transition={{ duration: 0.5 }}
              className="text-center py-16 sm:py-20 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 ring-1 ring-violet-400/20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-500/40 to-fuchsia-500/40 flex items-center justify-center ring-2 ring-violet-300/40">
                <LogIn size={40} className="text-violet-300" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                ログインが必要です
              </h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto px-4">
                マイページを利用するにはログインしてください。
                <br />
                お気に入りや診断履歴を管理できます。
              </p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-2xl transition-all duration-500 font-bold shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 hover:scale-105 ring-1 ring-white/20"
              >
                <LogIn size={20} />
                ログイン / 新規登録
              </button>
            </motion.div>
          )}

          {/* Logged In Content */}
          {!isLoading && isLoggedIn && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Profile Error Display */}
              {profileError && (
                <motion.div
                  variants={itemVariants}
                  className="p-4 bg-red-500/20 border border-red-400/30 rounded-2xl text-red-300 text-sm"
                >
                  <p className="font-medium">⚠️ プロフィールの読み込みエラー</p>
                  <p className="text-red-400/80 mt-1">{profileError}</p>
                </motion.div>
              )}

              {/* User Info Card - Premium Dark Design */}
              <motion.div
                variants={itemVariants}
                className="relative overflow-hidden bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 ring-1 ring-violet-400/20"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-15">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23A78BFA' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  />
                </div>

                {/* Gradient Accent */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${planConfig.gradient}`}
                />

                <div className="relative p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    {/* Avatar with Ring */}
                    <div className="relative">
                      <div
                        className={`absolute -inset-1 bg-gradient-to-r ${planConfig.gradient} rounded-full blur opacity-40`}
                      />
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-1">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-pink-600">
                          {profile?.displayName?.[0]?.toUpperCase() ||
                            user?.email?.[0]?.toUpperCase() ||
                            "U"}
                        </div>
                      </div>
                      {/* Status indicator */}
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full border-4 border-purple-900 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <Zap size={14} className="text-white" />
                      </div>
                    </div>

                    {/* User Details */}
                    <div className="flex-1 text-center sm:text-left">
                      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                        {profile?.displayName || "ユーザー"}
                      </h2>
                      <p className="text-slate-400 mb-4">{user?.email}</p>

                      {/* Plan Badge - Fancy */}
                      <div className="inline-flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${planConfig.color} shadow-sm`}
                        >
                          {PlanIcon && <PlanIcon size={16} />}
                          {planConfig.label} プラン
                        </span>
                        {profile?.plan === "free" && (
                          <Link
                            href="#upgrade"
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-violet-400 hover:text-violet-300 bg-violet-500/20 hover:bg-violet-500/30 rounded-full transition-colors"
                          >
                            <TrendingUp size={12} />
                            アップグレード
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Stats Cards - Dark Glass Design */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-3 gap-3 sm:gap-5"
              >
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Link
                      key={stat.label}
                      href={stat.href}
                      className="group relative"
                    >
                      <motion.div
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative overflow-hidden bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 ring-1 ring-white/10"
                      >
                        {/* Glow effect on hover */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-300`}
                        />

                        {/* Icon */}
                        <div
                          className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon
                            size={20}
                            className="text-white sm:w-7 sm:h-7"
                          />
                        </div>

                        {/* Value */}
                        <p className="text-2xl sm:text-4xl font-bold text-white mb-1">
                          {stat.value}
                        </p>

                        {/* Label */}
                        <p className="text-xs sm:text-sm font-medium text-slate-300">
                          {stat.label}
                        </p>

                        {/* Description - Hidden on mobile */}
                        <p className="hidden sm:block text-xs text-slate-500 mt-1">
                          {stat.description}
                        </p>

                        {/* Arrow indicator */}
                        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={16} className="text-slate-500" />
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </motion.div>

              {/* Menu Links - Premium Glass Card Design */}
              <motion.div
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden ring-1 ring-violet-400/20"
              >
                <div className="p-5 sm:p-6 border-b border-white/10 bg-white/5">
                  <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <Star size={18} className="text-amber-400" />
                    クイックアクセス
                  </h3>
                </div>
                <div className="divide-y divide-white/10">
                  {menuLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <Link key={link.href} href={link.href}>
                        <motion.div
                          whileHover={{ x: 8 }}
                          className="flex items-center gap-4 p-5 sm:p-6 hover:bg-white/10 transition-all duration-300 group"
                        >
                          {/* Icon with gradient */}
                          <div
                            className={`w-14 h-14 rounded-2xl ${link.iconBg} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300`}
                          >
                            <Icon size={26} className="text-white" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-white group-hover:text-violet-400 transition-colors">
                                {link.label}
                              </h4>
                              {link.badge && (
                                <span
                                  className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${link.badgeColor}`}
                                >
                                  {link.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-400">
                              {link.description}
                            </p>
                          </div>

                          {/* Arrow */}
                          <div className="w-10 h-10 rounded-xl bg-white/10 group-hover:bg-gradient-to-br group-hover:from-violet-500 group-hover:to-fuchsia-500 flex items-center justify-center transition-all duration-300">
                            <ChevronRight
                              size={20}
                              className="text-white/50 group-hover:text-white transition-colors"
                            />
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>

              {/* Plan Comparison Section */}
              <motion.div
                variants={itemVariants}
                id="plans"
                className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden ring-1 ring-violet-400/20"
              >
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                      <Crown size={20} className="text-yellow-400" />
                      プラン比較
                    </h3>
                    <span className="px-3 py-1 bg-yellow-400/20 text-yellow-300 text-xs font-bold rounded-full">
                      2026年1月リリース予定
                    </span>
                  </div>
                </div>

                {/* Plan Cards */}
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Free Plan */}
                    <div
                      className={`relative rounded-2xl p-5 transition-all ${
                        !profile?.plan || profile?.plan === "free"
                          ? "bg-gradient-to-br from-gray-500/30 to-gray-600/30 ring-2 ring-white/50"
                          : "bg-white/5"
                      }`}
                    >
                      {(!profile?.plan || profile?.plan === "free") && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-gray-800 text-xs font-bold rounded-full shadow-lg">
                          現在のプラン
                        </div>
                      )}
                      <div className="text-center mb-4 pt-2">
                        <h4 className="text-lg font-bold text-white mb-1">
                          Free
                        </h4>
                        <p className="text-3xl font-bold text-white">
                          ¥0
                          <span className="text-sm font-normal text-white/70">
                            /月
                          </span>
                        </p>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2 text-white/80">
                          <Check
                            size={16}
                            className="text-emerald-400 flex-shrink-0"
                          />
                          <span>AI質問 5回/月</span>
                        </li>
                        <li className="flex items-center gap-2 text-white/80">
                          <Check
                            size={16}
                            className="text-emerald-400 flex-shrink-0"
                          />
                          <span>基本的な商品比較</span>
                        </li>
                        <li className="flex items-center gap-2 text-white/80">
                          <Check
                            size={16}
                            className="text-emerald-400 flex-shrink-0"
                          />
                          <span>お気に入り保存</span>
                        </li>
                        <li className="flex items-center gap-2 text-white/40">
                          <X size={16} className="flex-shrink-0" />
                          <span>価格履歴</span>
                        </li>
                        <li className="flex items-center gap-2 text-white/40">
                          <X size={16} className="flex-shrink-0" />
                          <span>詳細分析</span>
                        </li>
                      </ul>
                    </div>

                    {/* Pro Plan */}
                    <div
                      className={`relative rounded-2xl p-5 transition-all ${
                        profile?.plan === "pro"
                          ? "bg-gradient-to-br from-purple-500/40 to-pink-500/40 ring-2 ring-purple-400/70"
                          : "bg-gradient-to-br from-purple-500/20 to-pink-500/20"
                      }`}
                    >
                      {profile?.plan === "pro" && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                          現在のプラン
                        </div>
                      )}
                      {profile?.plan !== "pro" && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                          おすすめ
                        </div>
                      )}
                      <div className="text-center mb-4 pt-2">
                        <h4 className="text-lg font-bold text-white mb-1 flex items-center justify-center gap-1">
                          <Crown size={16} className="text-yellow-400" />
                          Pro
                        </h4>
                        <p className="text-3xl font-bold text-white">
                          ¥490
                          <span className="text-sm font-normal text-white/70">
                            /月
                          </span>
                        </p>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2 text-white/90">
                          <Check
                            size={16}
                            className="text-emerald-400 flex-shrink-0"
                          />
                          <span>
                            AI質問 <strong>無制限</strong>
                          </span>
                        </li>
                        <li className="flex items-center gap-2 text-white/90">
                          <Check
                            size={16}
                            className="text-emerald-400 flex-shrink-0"
                          />
                          <span>価格履歴グラフ</span>
                        </li>
                        <li className="flex items-center gap-2 text-white/90">
                          <Check
                            size={16}
                            className="text-emerald-400 flex-shrink-0"
                          />
                          <span>詳細な推薦理由</span>
                        </li>
                        <li className="flex items-center gap-2 text-white/90">
                          <Check
                            size={16}
                            className="text-emerald-400 flex-shrink-0"
                          />
                          <span>優先サポート</span>
                        </li>
                        <li className="flex items-center gap-2 text-white/40">
                          <X size={16} className="flex-shrink-0" />
                          <span>Safety Guardian</span>
                        </li>
                      </ul>
                    </div>

                    {/* Pro + Safety Plan */}
                    <div
                      className={`relative rounded-2xl p-5 transition-all ${
                        profile?.plan === "pro_safety"
                          ? "bg-gradient-to-br from-emerald-500/40 to-teal-500/40 ring-2 ring-emerald-400/70"
                          : "bg-gradient-to-br from-emerald-500/20 to-teal-500/20"
                      }`}
                    >
                      {profile?.plan === "pro_safety" && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full shadow-lg">
                          現在のプラン
                        </div>
                      )}
                      <div className="text-center mb-4 pt-2">
                        <h4 className="text-lg font-bold text-white mb-1 flex items-center justify-center gap-1">
                          <Shield size={16} className="text-emerald-400" />
                          Pro + Safety
                        </h4>
                        <p className="text-3xl font-bold text-white">
                          ¥980
                          <span className="text-sm font-normal text-white/70">
                            /月
                          </span>
                        </p>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2 text-white/90">
                          <Check
                            size={16}
                            className="text-emerald-400 flex-shrink-0"
                          />
                          <span>Proの全機能</span>
                        </li>
                        <li className="flex items-center gap-2 text-white/90">
                          <Check
                            size={16}
                            className="text-emerald-400 flex-shrink-0"
                          />
                          <span>
                            <strong>相互作用チェック</strong>
                          </span>
                        </li>
                        <li className="flex items-center gap-2 text-white/90">
                          <Check
                            size={16}
                            className="text-emerald-400 flex-shrink-0"
                          />
                          <span>
                            <strong>Safety Guardian</strong>
                          </span>
                        </li>
                        <li className="flex items-center gap-2 text-white/90">
                          <Check
                            size={16}
                            className="text-emerald-400 flex-shrink-0"
                          />
                          <span>服薬・既往歴考慮</span>
                        </li>
                        <li className="flex items-center gap-2 text-white/90">
                          <Check
                            size={16}
                            className="text-emerald-400 flex-shrink-0"
                          />
                          <span>アレルギー警告</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Note */}
                  <p className="text-center text-white/50 text-xs mt-6">
                    ※
                    有料プランは2026年1月リリース予定です。現在は無料でご利用いただけます。
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* Custom styles for animations */}
      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .bg-size-200 {
          background-size: 200% 200%;
        }
        .bg-pos-0 {
          background-position: 0% 50%;
        }
        .bg-pos-100 {
          background-position: 100% 50%;
        }
      `}</style>
    </div>
  );
}
