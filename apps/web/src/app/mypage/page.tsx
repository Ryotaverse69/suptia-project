"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
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
  TrendingUp,
  Star,
  Zap,
  Check,
  X,
  Camera,
  ShieldCheck,
  Eye,
  Image as ImageIcon,
  MessageCircle,
  Sparkles,
  FileText,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useDiagnosisHistory } from "@/contexts/DiagnosisHistoryContext";
import { usePriceAlerts } from "@/contexts/PriceAlertsContext";
import { LoginModal } from "@/components/auth/LoginModal";
import { Avatar } from "@/components/Avatar";
import {
  systemColors,
  appleWebColors,
  fontStack,
  liquidGlass,
  liquidGlassClasses,
} from "@/lib/design-system";
import {
  UpgradeButton,
  ManageSubscriptionButton,
} from "@/components/subscription";
import UpgradeSuccessModal from "@/components/subscription/UpgradeSuccessModal";
import type { SubscriptionPlan } from "@/lib/stripe";

// プランバッジの設定
const PLAN_BADGES = {
  free: {
    label: "Free",
    bg: appleWebColors.sectionBackground,
    text: appleWebColors.textSecondary,
    border: appleWebColors.borderSubtle,
    gradient: `linear-gradient(135deg, ${systemColors.gray[2]} 0%, ${systemColors.gray[3]} 100%)`,
    icon: null,
  },
  pro: {
    label: "Pro",
    bg: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
    text: "white",
    border: "transparent",
    gradient: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
    icon: Crown,
  },
  pro_safety: {
    label: "Pro + Safety",
    bg: `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
    text: "white",
    border: "transparent",
    gradient: `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
    icon: Shield,
  },
  admin: {
    label: "Admin",
    bg: `linear-gradient(135deg, ${systemColors.red} 0%, ${systemColors.orange} 100%)`,
    text: "white",
    border: "transparent",
    gradient: `linear-gradient(135deg, ${systemColors.red} 0%, ${systemColors.orange} 100%)`,
    icon: ShieldCheck,
  },
};

// プレビュー用プランオプション
const PREVIEW_PLANS = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "pro_safety", label: "Pro + Safety" },
] as const;

export default function MyPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [previewPlan, setPreviewPlan] = useState<string | null>(null);
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false);
  const [upgradedPlan, setUpgradedPlan] = useState<SubscriptionPlan | null>(
    null,
  );

  const searchParams = useSearchParams();
  const router = useRouter();

  // アップグレード成功時のモーダル表示
  useEffect(() => {
    const upgraded = searchParams.get("upgraded");
    const downgradeScheduled = searchParams.get("downgrade_scheduled");

    if (upgraded === "pro" || upgraded === "pro_safety") {
      setUpgradedPlan(upgraded);
      setShowUpgradeSuccess(true);
      // URLからクエリパラメータを削除
      router.replace("/mypage", { scroll: false });
    } else if (
      downgradeScheduled === "pro" ||
      downgradeScheduled === "pro_safety"
    ) {
      // ダウングレード予約完了 - URLパラメータのみ削除（メッセージはalertで表示済み）
      router.replace("/mypage", { scroll: false });
    }
  }, [searchParams, router]);

  const { user, isLoading: authLoading } = useAuth();
  const {
    profile,
    isLoading: profileLoading,
    error: profileError,
  } = useUserProfile();
  const { favorites, isLoading: favoritesLoading } = useFavorites();
  const { history, isLoading: historyLoading } = useDiagnosisHistory();
  const { alerts, isLoading: alertsLoading } = usePriceAlerts();

  const isLoggedIn = !!user;
  const isLoading = authLoading || profileLoading;

  // プレビューモードの場合はプレビュープランを使用、それ以外は実際のプラン
  const displayPlan = previewPlan || profile?.plan || "free";

  // 統計データ
  const stats = [
    {
      label: "お気に入り",
      value: favoritesLoading ? "-" : favorites.length,
      icon: Heart,
      gradient: `linear-gradient(135deg, ${systemColors.pink} 0%, ${systemColors.red} 100%)`,
      href: "/favorites",
      description: "保存した商品",
    },
    {
      label: "診断回数",
      value: historyLoading ? "-" : history.length,
      icon: History,
      gradient: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.indigo} 100%)`,
      href: "/diagnosis/history",
      description: "実施した診断",
    },
    {
      label: "価格アラート",
      value: alertsLoading ? "-" : alerts.length,
      icon: Bell,
      gradient: `linear-gradient(135deg, ${systemColors.orange} 0%, ${systemColors.yellow} 100%)`,
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
      gradient: `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.cyan} 100%)`,
    },
    {
      label: "健康情報管理",
      description: "既往歴・服薬・アレルギーの登録",
      icon: Shield,
      href: "/mypage/health",
      gradient: `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
      badge: "Safety準備",
    },
    {
      label: "お気に入り商品",
      description: "保存した商品を確認・比較",
      icon: Heart,
      href: "/favorites",
      gradient: `linear-gradient(135deg, ${systemColors.pink} 0%, ${systemColors.red} 100%)`,
    },
    {
      label: "診断履歴",
      description: "過去の診断結果を確認",
      icon: History,
      href: "/diagnosis/history",
      gradient: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.indigo} 100%)`,
    },
  ];

  const planConfig =
    PLAN_BADGES[displayPlan as keyof typeof PLAN_BADGES] || PLAN_BADGES.free;
  const PlanIcon = planConfig?.icon;

  return (
    <div
      className="min-h-screen py-8 sm:py-12 md:py-16"
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div
              className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-[24px] mb-4 sm:mb-6"
              style={{
                background: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
                boxShadow: "0 8px 32px rgba(175, 82, 222, 0.3)",
              }}
            >
              <User size={40} className="text-white sm:w-12 sm:h-12" />
            </div>
            <h1
              className="text-[28px] sm:text-[34px] md:text-[40px] font-bold mb-3 sm:mb-4"
              style={{ color: appleWebColors.textPrimary }}
            >
              マイページ
            </h1>
            <p
              className="text-[15px] sm:text-[17px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              あなたのサプリメント管理ダッシュボード
            </p>
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
            <div
              className={`text-center py-16 sm:py-20 ${liquidGlassClasses.light}`}
            >
              <div
                className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${systemColors.purple}20 0%, ${systemColors.pink}20 100%)`,
                }}
              >
                <LogIn size={40} style={{ color: systemColors.purple }} />
              </div>
              <h2
                className="text-[22px] sm:text-[24px] font-bold mb-4"
                style={{ color: appleWebColors.textPrimary }}
              >
                ログインが必要です
              </h2>
              <p
                className="text-[15px] mb-8 max-w-md mx-auto px-4"
                style={{ color: appleWebColors.textSecondary }}
              >
                マイページを利用するにはログインしてください。
                <br />
                お気に入りや診断履歴を管理できます。
              </p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-[15px] font-semibold text-white transition-all duration-200 min-h-[48px]"
                style={{
                  background: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
                  boxShadow: "0 4px 12px rgba(175, 82, 222, 0.3)",
                }}
              >
                <LogIn size={20} />
                ログイン / 新規登録
              </button>
            </div>
          )}

          {/* Logged In Content */}
          {!isLoading && isLoggedIn && (
            <div className="space-y-6">
              {/* Profile Error Display */}
              {profileError && (
                <div
                  className="p-4 rounded-[16px] border text-[14px]"
                  style={{
                    backgroundColor: `${systemColors.red}10`,
                    borderColor: `${systemColors.red}30`,
                    color: systemColors.red,
                  }}
                >
                  <p className="font-medium">プロフィールの読み込みエラー</p>
                  <p className="mt-1 opacity-80">{profileError}</p>
                </div>
              )}

              {/* User Info Card */}
              <div
                className={`relative overflow-hidden ${liquidGlassClasses.light} transition-all duration-300 hover:-translate-y-1`}
              >
                {/* Gradient Accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: planConfig.gradient }}
                />

                <div className="relative p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    {/* Avatar with Ring and Edit Button */}
                    <div className="relative group">
                      <div
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1"
                        style={{
                          background: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
                        }}
                      >
                        <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                          <Avatar
                            type={profile?.avatarType}
                            presetId={profile?.avatarIcon}
                            customUrl={profile?.avatarUrl}
                            fallback={
                              profile?.displayName || user?.email || "U"
                            }
                            size="xl"
                          />
                        </div>
                      </div>
                      {/* Edit Button (appears on hover) */}
                      <Link
                        href="/mypage/profile"
                        className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{
                          background: "rgba(0, 0, 0, 0.5)",
                        }}
                      >
                        <Camera size={24} className="text-white" />
                      </Link>
                      {/* Status indicator */}
                      <div
                        className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-4 flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
                          borderColor: "white",
                        }}
                      >
                        <Zap size={14} className="text-white" />
                      </div>
                    </div>

                    {/* User Details */}
                    <div className="flex-1 text-center sm:text-left">
                      <h2
                        className="text-[22px] sm:text-[24px] font-bold mb-1"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {profile?.displayName || "ユーザー"}
                      </h2>
                      <p
                        className="text-[15px] mb-4"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        {user?.email}
                      </p>

                      {/* Plan Badge */}
                      <div className="inline-flex items-center gap-2">
                        <span
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold"
                          style={{
                            background: planConfig.bg,
                            color: planConfig.text,
                            border:
                              planConfig.border !== "transparent"
                                ? `1px solid ${planConfig.border}`
                                : "none",
                          }}
                        >
                          {PlanIcon && <PlanIcon size={16} />}
                          {planConfig.label} プラン
                        </span>
                        {displayPlan === "free" && (
                          <Link
                            href="#plans"
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium rounded-full transition-colors min-h-[32px]"
                            style={{
                              color: systemColors.purple,
                              backgroundColor: `${systemColors.purple}10`,
                            }}
                          >
                            <TrendingUp size={12} />
                            アップグレード
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-3 sm:gap-5">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <Link
                      key={stat.label}
                      href={stat.href}
                      className="group relative"
                    >
                      <div
                        className={`relative overflow-hidden p-4 sm:p-6 ${liquidGlassClasses.light} transition-all duration-300 hover:-translate-y-1`}
                      >
                        {/* Icon */}
                        <div
                          className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-105"
                          style={{ background: stat.gradient }}
                        >
                          <Icon
                            size={20}
                            className="text-white sm:w-7 sm:h-7"
                          />
                        </div>

                        {/* Value */}
                        <p
                          className="text-[22px] sm:text-[34px] font-bold mb-1"
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          {stat.value}
                        </p>

                        {/* Label */}
                        <p
                          className="text-[12px] sm:text-[13px] font-medium"
                          style={{ color: appleWebColors.textSecondary }}
                        >
                          {stat.label}
                        </p>

                        {/* Description - Hidden on mobile */}
                        <p
                          className="hidden sm:block text-[11px] mt-1"
                          style={{ color: appleWebColors.textTertiary }}
                        >
                          {stat.description}
                        </p>

                        {/* Arrow indicator */}
                        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight
                            size={16}
                            style={{ color: appleWebColors.textTertiary }}
                          />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Menu Links */}
              <div className={`overflow-hidden ${liquidGlassClasses.light}`}>
                <div
                  className="p-5 sm:p-6 border-b"
                  style={{
                    borderColor: appleWebColors.borderSubtle,
                    backgroundColor: appleWebColors.sectionBackground,
                  }}
                >
                  <h3
                    className="font-bold text-[17px] flex items-center gap-2"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    <Star size={18} style={{ color: systemColors.yellow }} />
                    クイックアクセス
                  </h3>
                </div>
                <div>
                  {menuLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <Link key={link.href} href={link.href}>
                        <div
                          className="flex items-center gap-4 p-5 sm:p-6 transition-all duration-200 group min-h-[72px] hover:bg-white/50 hover:backdrop-blur-[12px]"
                          style={{
                            borderBottom:
                              index < menuLinks.length - 1
                                ? `1px solid ${appleWebColors.borderSubtle}`
                                : "none",
                          }}
                        >
                          {/* Icon with gradient */}
                          <div
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                            style={{ background: link.gradient }}
                          >
                            <Icon
                              size={24}
                              className="text-white sm:w-7 sm:h-7"
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4
                                className="font-semibold text-[15px] transition-colors group-hover:opacity-70"
                                style={{ color: appleWebColors.textPrimary }}
                              >
                                {link.label}
                              </h4>
                              {link.badge && (
                                <span
                                  className="px-2 py-0.5 text-[11px] font-semibold rounded-full"
                                  style={{
                                    backgroundColor: `${systemColors.green}15`,
                                    color: systemColors.green,
                                  }}
                                >
                                  {link.badge}
                                </span>
                              )}
                            </div>
                            <p
                              className="text-[13px]"
                              style={{ color: appleWebColors.textSecondary }}
                            >
                              {link.description}
                            </p>
                          </div>

                          {/* Arrow */}
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundColor: appleWebColors.sectionBackground,
                            }}
                          >
                            <ChevronRight
                              size={18}
                              style={{ color: appleWebColors.textTertiary }}
                            />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Admin Section - Only visible to admins */}
              {profile?.is_admin && (
                <div className={`overflow-hidden ${liquidGlassClasses.light}`}>
                  <div
                    className="p-5 sm:p-6 border-b"
                    style={{
                      borderColor: appleWebColors.borderSubtle,
                      background: `linear-gradient(135deg, ${systemColors.red}10 0%, ${systemColors.orange}10 100%)`,
                    }}
                  >
                    <h3
                      className="font-bold text-[17px] flex items-center gap-2"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      <ShieldCheck
                        size={18}
                        style={{ color: systemColors.red }}
                      />
                      管理者メニュー
                    </h3>
                  </div>
                  <div>
                    <Link href="/admin/instagram">
                      <div
                        className="flex items-center gap-4 p-5 sm:p-6 transition-all duration-200 group min-h-[72px] hover:bg-white/50 hover:backdrop-blur-[12px]"
                        style={{
                          borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
                        }}
                      >
                        {/* Icon with gradient */}
                        <div
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                          style={{
                            background: `linear-gradient(135deg, ${systemColors.red} 0%, ${systemColors.orange} 100%)`,
                          }}
                        >
                          <Camera
                            size={24}
                            className="text-white sm:w-7 sm:h-7"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4
                              className="font-semibold text-[15px] transition-colors group-hover:opacity-70"
                              style={{ color: appleWebColors.textPrimary }}
                            >
                              Instagram投稿管理
                            </h4>
                            <span
                              className="px-2 py-0.5 text-[11px] font-semibold rounded-full"
                              style={{
                                backgroundColor: `${systemColors.red}15`,
                                color: systemColors.red,
                              }}
                            >
                              Admin
                            </span>
                          </div>
                          <p
                            className="text-[13px]"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            AI画像生成・キャプション作成
                          </p>
                        </div>

                        {/* Arrow */}
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor: appleWebColors.sectionBackground,
                          }}
                        >
                          <ChevronRight
                            size={18}
                            style={{ color: appleWebColors.textTertiary }}
                          />
                        </div>
                      </div>
                    </Link>

                    <Link href="/admin/og-images">
                      <div
                        className="flex items-center gap-4 p-5 sm:p-6 transition-all duration-200 group min-h-[72px] hover:bg-white/50 hover:backdrop-blur-[12px]"
                        style={{
                          borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
                        }}
                      >
                        {/* Icon with gradient */}
                        <div
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                          style={{
                            background: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
                          }}
                        >
                          <ImageIcon
                            size={24}
                            className="text-white sm:w-7 sm:h-7"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4
                              className="font-semibold text-[15px] transition-colors group-hover:opacity-70"
                              style={{ color: appleWebColors.textPrimary }}
                            >
                              OGP画像管理
                            </h4>
                            <span
                              className="px-2 py-0.5 text-[11px] font-semibold rounded-full"
                              style={{
                                backgroundColor: `${systemColors.purple}15`,
                                color: systemColors.purple,
                              }}
                            >
                              Admin
                            </span>
                          </div>
                          <p
                            className="text-[13px]"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            成分・記事のOGP画像を一括生成
                          </p>
                        </div>

                        {/* Arrow */}
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor: appleWebColors.sectionBackground,
                          }}
                        >
                          <ChevronRight
                            size={18}
                            style={{ color: appleWebColors.textTertiary }}
                          />
                        </div>
                      </div>
                    </Link>

                    <Link href="/admin/concierge/avatars">
                      <div
                        className="flex items-center gap-4 p-5 sm:p-6 transition-all duration-200 group min-h-[72px] hover:bg-white/50 hover:backdrop-blur-[12px]"
                        style={{
                          borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
                        }}
                      >
                        {/* Icon with gradient */}
                        <div
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                          style={{
                            background: `linear-gradient(135deg, ${systemColors.cyan} 0%, ${systemColors.blue} 100%)`,
                          }}
                        >
                          <Sparkles
                            size={24}
                            className="text-white sm:w-7 sm:h-7"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4
                              className="font-semibold text-[15px] transition-colors group-hover:opacity-70"
                              style={{ color: appleWebColors.textPrimary }}
                            >
                              キャラクターアバター管理
                            </h4>
                            <span
                              className="px-2 py-0.5 text-[11px] font-semibold rounded-full"
                              style={{
                                backgroundColor: `${systemColors.cyan}15`,
                                color: systemColors.cyan,
                              }}
                            >
                              Admin
                            </span>
                          </div>
                          <p
                            className="text-[13px]"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            AIコンシェルジュのアバター画像を生成
                          </p>
                        </div>

                        {/* Arrow */}
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor: appleWebColors.sectionBackground,
                          }}
                        >
                          <ChevronRight
                            size={18}
                            style={{ color: appleWebColors.textTertiary }}
                          />
                        </div>
                      </div>
                    </Link>

                    <Link href="/concierge">
                      <div
                        className="flex items-center gap-4 p-5 sm:p-6 transition-all duration-200 group min-h-[72px] hover:bg-white/50 hover:backdrop-blur-[12px]"
                        style={{
                          borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
                        }}
                      >
                        {/* Icon with gradient */}
                        <div
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                          style={{
                            background: `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
                          }}
                        >
                          <MessageCircle
                            size={24}
                            className="text-white sm:w-7 sm:h-7"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4
                              className="font-semibold text-[15px] transition-colors group-hover:opacity-70"
                              style={{ color: appleWebColors.textPrimary }}
                            >
                              AIコンシェルジュ
                            </h4>
                            <span
                              className="px-2 py-0.5 text-[11px] font-semibold rounded-full"
                              style={{
                                backgroundColor: `${systemColors.green}15`,
                                color: systemColors.green,
                              }}
                            >
                              Admin
                            </span>
                          </div>
                          <p
                            className="text-[13px]"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            チャットAI・利用状況確認
                          </p>
                        </div>

                        {/* Arrow */}
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor: appleWebColors.sectionBackground,
                          }}
                        >
                          <ChevronRight
                            size={18}
                            style={{ color: appleWebColors.textTertiary }}
                          />
                        </div>
                      </div>
                    </Link>

                    <Link href="/admin/note-images">
                      <div
                        className="flex items-center gap-4 p-5 sm:p-6 transition-all duration-200 group min-h-[72px] hover:bg-white/50 hover:backdrop-blur-[12px]"
                        style={{
                          borderBottom: `1px solid ${appleWebColors.borderSubtle}`,
                        }}
                      >
                        {/* Icon with gradient */}
                        <div
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                          style={{
                            background: `linear-gradient(135deg, #10B981 0%, #34D399 100%)`,
                          }}
                        >
                          <FileText
                            size={24}
                            className="text-white sm:w-7 sm:h-7"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4
                              className="font-semibold text-[15px] transition-colors group-hover:opacity-70"
                              style={{ color: appleWebColors.textPrimary }}
                            >
                              note画像生成
                            </h4>
                            <span
                              className="px-2 py-0.5 text-[11px] font-semibold rounded-full"
                              style={{
                                backgroundColor: "#10B98115",
                                color: "#10B981",
                              }}
                            >
                              Admin
                            </span>
                          </div>
                          <p
                            className="text-[13px]"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            note記事用の画像プロンプト生成
                          </p>
                        </div>

                        {/* Arrow */}
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor: appleWebColors.sectionBackground,
                          }}
                        >
                          <ChevronRight
                            size={18}
                            style={{ color: appleWebColors.textTertiary }}
                          />
                        </div>
                      </div>
                    </Link>

                    {/* Plan Preview */}
                    <div className="flex items-center gap-4 p-5 sm:p-6">
                      {/* Icon */}
                      <div
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.cyan} 100%)`,
                        }}
                      >
                        <Eye size={24} className="text-white sm:w-7 sm:h-7" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4
                            className="font-semibold text-[15px]"
                            style={{ color: appleWebColors.textPrimary }}
                          >
                            プランプレビュー
                          </h4>
                          <span
                            className="px-2 py-0.5 text-[11px] font-semibold rounded-full"
                            style={{
                              backgroundColor: `${systemColors.blue}15`,
                              color: systemColors.blue,
                            }}
                          >
                            テスト用
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setPreviewPlan(null)}
                            className="px-3 py-1.5 text-[12px] font-medium rounded-full transition-all min-h-[32px]"
                            style={{
                              backgroundColor:
                                previewPlan === null
                                  ? systemColors.red
                                  : `${systemColors.gray[2]}`,
                              color:
                                previewPlan === null
                                  ? "white"
                                  : appleWebColors.textSecondary,
                            }}
                          >
                            Admin（実際）
                          </button>
                          {PREVIEW_PLANS.map((plan) => (
                            <button
                              key={plan.value}
                              onClick={() => setPreviewPlan(plan.value)}
                              className="px-3 py-1.5 text-[12px] font-medium rounded-full transition-all min-h-[32px]"
                              style={{
                                backgroundColor:
                                  previewPlan === plan.value
                                    ? systemColors.blue
                                    : `${systemColors.gray[2]}`,
                                color:
                                  previewPlan === plan.value
                                    ? "white"
                                    : appleWebColors.textSecondary,
                              }}
                            >
                              {plan.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Plan Comparison Section */}
              <div
                id="plans"
                className={`overflow-hidden ${liquidGlassClasses.light}`}
              >
                {/* Header */}
                <div
                  className="p-5 sm:p-6 border-b"
                  style={{
                    borderColor: appleWebColors.borderSubtle,
                    background: `linear-gradient(135deg, ${systemColors.purple}10 0%, ${systemColors.pink}10 100%)`,
                  }}
                >
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <h3
                      className="font-bold text-[17px] flex items-center gap-2"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      <Crown size={20} style={{ color: systemColors.yellow }} />
                      プラン比較
                    </h3>
                    {(displayPlan === "pro" ||
                      displayPlan === "pro_safety") && (
                      <ManageSubscriptionButton variant="link" size="sm">
                        サブスクリプション管理
                      </ManageSubscriptionButton>
                    )}
                  </div>
                </div>

                {/* Plan Cards */}
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Free Plan */}
                    <div
                      className="relative rounded-[16px] p-5 transition-all border"
                      style={{
                        backgroundColor:
                          displayPlan === "free"
                            ? appleWebColors.sectionBackground
                            : "transparent",
                        borderColor:
                          displayPlan === "free"
                            ? systemColors.blue
                            : appleWebColors.borderSubtle,
                        borderWidth: displayPlan === "free" ? "2px" : "1px",
                      }}
                    >
                      {displayPlan === "free" && (
                        <div
                          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[11px] font-bold rounded-full"
                          style={{
                            backgroundColor: systemColors.blue,
                            color: "white",
                          }}
                        >
                          現在のプラン
                        </div>
                      )}
                      <div className="text-center mb-4 pt-2">
                        <h4
                          className="text-[17px] font-bold mb-1"
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          Free
                        </h4>
                        <p
                          className="text-[28px] font-bold"
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          ¥0
                          <span
                            className="text-[13px] font-normal ml-1"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            /月
                          </span>
                        </p>
                      </div>

                      {/* AIコンシェルジュ */}
                      <div className="mb-3">
                        <p
                          className="text-[11px] font-semibold mb-1.5 uppercase tracking-wide"
                          style={{ color: appleWebColors.textTertiary }}
                        >
                          AIコンシェルジュ
                        </p>
                        <ul className="space-y-1.5 text-[13px]">
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <Check
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: systemColors.green }}
                            />
                            <span>新規質問 週5回</span>
                          </li>
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textTertiary }}
                          >
                            <X size={14} className="flex-shrink-0" />
                            <span>追加質問（深掘り）</span>
                          </li>
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <Check
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: systemColors.green }}
                            />
                            <span>4キャラクター選択可</span>
                          </li>
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <Check
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: systemColors.green }}
                            />
                            <span>高速応答モデル (Haiku)</span>
                          </li>
                        </ul>
                      </div>

                      {/* 価格・履歴 */}
                      <div className="mb-3">
                        <p
                          className="text-[11px] font-semibold mb-1.5 uppercase tracking-wide"
                          style={{ color: appleWebColors.textTertiary }}
                        >
                          価格・履歴
                        </p>
                        <ul className="space-y-1.5 text-[13px]">
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <Check
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: systemColors.green }}
                            />
                            <span>価格履歴 30日間</span>
                          </li>
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <Check
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: systemColors.green }}
                            />
                            <span>会話履歴 3日間保存</span>
                          </li>
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textTertiary }}
                          >
                            <X size={14} className="flex-shrink-0" />
                            <span>推薦理由の重み付け表示</span>
                          </li>
                        </ul>
                      </div>

                      {/* Safety */}
                      <div>
                        <p
                          className="text-[11px] font-semibold mb-1.5 uppercase tracking-wide"
                          style={{ color: appleWebColors.textTertiary }}
                        >
                          Safety機能
                        </p>
                        <ul className="space-y-1.5 text-[13px]">
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textTertiary }}
                          >
                            <X size={14} className="flex-shrink-0" />
                            <span>相互作用チェック</span>
                          </li>
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textTertiary }}
                          >
                            <X size={14} className="flex-shrink-0" />
                            <span>危険成分オートブロック</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Pro Plan */}
                    <div
                      className="relative rounded-[16px] p-5 transition-all"
                      style={{
                        background:
                          displayPlan === "pro"
                            ? `linear-gradient(135deg, ${systemColors.purple}20 0%, ${systemColors.pink}20 100%)`
                            : `linear-gradient(135deg, ${systemColors.purple}10 0%, ${systemColors.pink}10 100%)`,
                        border:
                          displayPlan === "pro"
                            ? `2px solid ${systemColors.purple}`
                            : `1px solid ${appleWebColors.borderSubtle}`,
                      }}
                    >
                      <div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[11px] font-bold rounded-full text-white"
                        style={{
                          background: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
                        }}
                      >
                        {displayPlan === "pro" ? "現在のプラン" : "おすすめ"}
                      </div>
                      <div className="text-center mb-4 pt-2">
                        <h4
                          className="text-[17px] font-bold mb-1 flex items-center justify-center gap-1"
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          <Crown
                            size={16}
                            style={{ color: systemColors.yellow }}
                          />
                          Pro
                        </h4>
                        <p
                          className="text-[28px] font-bold"
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          ¥590
                          <span
                            className="text-[13px] font-normal ml-1"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            /月
                          </span>
                        </p>
                      </div>

                      {/* AIコンシェルジュ */}
                      <div className="mb-3">
                        <p
                          className="text-[11px] font-semibold mb-1.5 uppercase tracking-wide"
                          style={{ color: appleWebColors.textTertiary }}
                        >
                          AIコンシェルジュ
                        </p>
                        <ul className="space-y-1.5 text-[13px]">
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <Check
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: systemColors.green }}
                            />
                            <span>
                              新規質問 <strong>週25回</strong>
                            </span>
                          </li>
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <Check
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: systemColors.green }}
                            />
                            <span>追加質問（深掘り） 1会話3回</span>
                          </li>
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <Check
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: systemColors.green }}
                            />
                            <span>4キャラクター選択可</span>
                          </li>
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <Check
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: systemColors.green }}
                            />
                            <span>
                              高精度モデル (<strong>Sonnet</strong>)
                            </span>
                          </li>
                        </ul>
                      </div>

                      {/* 価格・履歴 */}
                      <div className="mb-3">
                        <p
                          className="text-[11px] font-semibold mb-1.5 uppercase tracking-wide"
                          style={{ color: appleWebColors.textTertiary }}
                        >
                          価格・履歴
                        </p>
                        <ul className="space-y-1.5 text-[13px]">
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <Check
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: systemColors.green }}
                            />
                            <span>
                              価格履歴 <strong>1年間</strong>
                            </span>
                          </li>
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <Check
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: systemColors.green }}
                            />
                            <span>会話履歴 30日間保存</span>
                          </li>
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <Check
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: systemColors.green }}
                            />
                            <span>推薦理由の重み付け表示</span>
                          </li>
                        </ul>
                      </div>

                      {/* Safety */}
                      <div>
                        <p
                          className="text-[11px] font-semibold mb-1.5 uppercase tracking-wide"
                          style={{ color: appleWebColors.textTertiary }}
                        >
                          Safety機能
                        </p>
                        <ul className="space-y-1.5 text-[13px]">
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textTertiary }}
                          >
                            <X size={14} className="flex-shrink-0" />
                            <span>相互作用チェック</span>
                          </li>
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textTertiary }}
                          >
                            <X size={14} className="flex-shrink-0" />
                            <span>危険成分オートブロック</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Pro + Safety Plan */}
                    <div
                      className="relative rounded-[16px] p-5 transition-all"
                      style={{
                        background:
                          displayPlan === "pro_safety"
                            ? `linear-gradient(135deg, ${systemColors.green}20 0%, ${systemColors.teal}20 100%)`
                            : `linear-gradient(135deg, ${systemColors.green}10 0%, ${systemColors.teal}10 100%)`,
                        border:
                          displayPlan === "pro_safety"
                            ? `2px solid ${systemColors.green}`
                            : `1px solid ${appleWebColors.borderSubtle}`,
                      }}
                    >
                      {displayPlan === "pro_safety" && (
                        <div
                          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[11px] font-bold rounded-full text-white"
                          style={{
                            background: `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
                          }}
                        >
                          現在のプラン
                        </div>
                      )}
                      <div className="text-center mb-4 pt-2">
                        <h4
                          className="text-[17px] font-bold mb-1 flex items-center justify-center gap-1"
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          <Shield
                            size={16}
                            style={{ color: systemColors.green }}
                          />
                          Pro + Safety
                        </h4>
                        <p
                          className="text-[28px] font-bold"
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          ¥1,280
                          <span
                            className="text-[13px] font-normal ml-1"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            /月
                          </span>
                        </p>
                      </div>

                      {/* AIコンシェルジュ */}
                      <div className="mb-3">
                        <p
                          className="text-[11px] font-semibold mb-1.5 uppercase tracking-wide"
                          style={{ color: appleWebColors.textTertiary }}
                        >
                          AIコンシェルジュ
                        </p>
                        <ul className="space-y-1.5 text-[13px]">
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <Check
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: systemColors.green }}
                            />
                            <span>
                              新規質問 <strong>無制限</strong>
                            </span>
                          </li>
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <Check
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: systemColors.green }}
                            />
                            <span>
                              追加質問（深掘り） <strong>無制限</strong>
                            </span>
                          </li>
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <Check
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: systemColors.green }}
                            />
                            <span>4キャラ + カスタム名</span>
                          </li>
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <Check
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: systemColors.green }}
                            />
                            <span>
                              最高精度モデル (<strong>Sonnet+Opus</strong>)
                            </span>
                          </li>
                        </ul>
                      </div>

                      {/* 価格・履歴 */}
                      <div className="mb-3">
                        <p
                          className="text-[11px] font-semibold mb-1.5 uppercase tracking-wide"
                          style={{ color: appleWebColors.textTertiary }}
                        >
                          価格・履歴
                        </p>
                        <ul className="space-y-1.5 text-[13px]">
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <Check
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: systemColors.green }}
                            />
                            <span>
                              価格履歴 <strong>全期間</strong>
                            </span>
                          </li>
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <Check
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: systemColors.green }}
                            />
                            <span>
                              会話履歴 <strong>無制限</strong>
                            </span>
                          </li>
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <Check
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: systemColors.green }}
                            />
                            <span>推薦理由の重み付け表示</span>
                          </li>
                        </ul>
                      </div>

                      {/* Safety */}
                      <div>
                        <p
                          className="text-[11px] font-semibold mb-1.5 uppercase tracking-wide"
                          style={{ color: systemColors.green }}
                        >
                          Safety Guardian
                        </p>
                        <ul className="space-y-1.5 text-[13px]">
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <Check
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: systemColors.green }}
                            />
                            <span>
                              <strong>相互作用チェック</strong>
                            </span>
                          </li>
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <Check
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: systemColors.green }}
                            />
                            <span>
                              <strong>危険成分オートブロック</strong>
                            </span>
                          </li>
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <Check
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: systemColors.green }}
                            />
                            <span>既往歴・服薬情報考慮</span>
                          </li>
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <Check
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: systemColors.green }}
                            />
                            <span>アレルギー警告</span>
                          </li>
                          <li
                            className="flex items-center gap-2"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            <Check
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: systemColors.green }}
                            />
                            <span>複雑ケースはOpus 4.5昇格</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Feature Comparison Table */}
                  <div
                    className="mt-6 rounded-[12px] overflow-hidden border"
                    style={{ borderColor: appleWebColors.borderSubtle }}
                  >
                    <table className="w-full text-[12px]">
                      <thead>
                        <tr
                          style={{
                            backgroundColor: appleWebColors.sectionBackground,
                          }}
                        >
                          <th
                            className="text-left p-3 font-semibold"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            機能詳細
                          </th>
                          <th
                            className="text-center p-3 font-semibold"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            Free
                          </th>
                          <th
                            className="text-center p-3 font-semibold"
                            style={{ color: systemColors.purple }}
                          >
                            Pro
                          </th>
                          <th
                            className="text-center p-3 font-semibold"
                            style={{ color: systemColors.green }}
                          >
                            Pro+Safety
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          style={{
                            borderTop: `1px solid ${appleWebColors.borderSubtle}`,
                          }}
                        >
                          <td
                            className="p-3"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            週間AI質問回数
                          </td>
                          <td
                            className="text-center p-3"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            5回
                          </td>
                          <td
                            className="text-center p-3 font-medium"
                            style={{ color: systemColors.purple }}
                          >
                            25回
                          </td>
                          <td
                            className="text-center p-3 font-bold"
                            style={{ color: systemColors.green }}
                          >
                            無制限
                          </td>
                        </tr>
                        <tr
                          style={{
                            borderTop: `1px solid ${appleWebColors.borderSubtle}`,
                          }}
                        >
                          <td
                            className="p-3"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            フォローアップ質問
                          </td>
                          <td
                            className="text-center p-3"
                            style={{ color: appleWebColors.textTertiary }}
                          >
                            -
                          </td>
                          <td
                            className="text-center p-3"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            3回/会話
                          </td>
                          <td
                            className="text-center p-3 font-bold"
                            style={{ color: systemColors.green }}
                          >
                            無制限
                          </td>
                        </tr>
                        <tr
                          style={{
                            borderTop: `1px solid ${appleWebColors.borderSubtle}`,
                          }}
                        >
                          <td
                            className="p-3"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            価格履歴期間
                          </td>
                          <td
                            className="text-center p-3"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            30日
                          </td>
                          <td
                            className="text-center p-3"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            1年
                          </td>
                          <td
                            className="text-center p-3 font-bold"
                            style={{ color: systemColors.green }}
                          >
                            全期間
                          </td>
                        </tr>
                        <tr
                          style={{
                            borderTop: `1px solid ${appleWebColors.borderSubtle}`,
                          }}
                        >
                          <td
                            className="p-3"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            会話コンテキスト数
                          </td>
                          <td
                            className="text-center p-3"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            4件
                          </td>
                          <td
                            className="text-center p-3"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            10件
                          </td>
                          <td
                            className="text-center p-3 font-bold"
                            style={{ color: systemColors.green }}
                          >
                            20件
                          </td>
                        </tr>
                        <tr
                          style={{
                            borderTop: `1px solid ${appleWebColors.borderSubtle}`,
                          }}
                        >
                          <td
                            className="p-3"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            AIモデル
                          </td>
                          <td
                            className="text-center p-3 text-[12px]"
                            style={{ color: appleWebColors.textSecondary }}
                          >
                            高速応答
                            <br />
                            <span className="text-[10px] opacity-70">
                              (Haiku)
                            </span>
                          </td>
                          <td
                            className="text-center p-3 font-medium text-[12px]"
                            style={{ color: systemColors.purple }}
                          >
                            高精度
                            <br />
                            <span className="text-[10px] opacity-70">
                              (Sonnet)
                            </span>
                          </td>
                          <td
                            className="text-center p-3 font-bold text-[12px]"
                            style={{ color: systemColors.green }}
                          >
                            最高精度
                            <br />
                            <span className="text-[10px] opacity-70">
                              (Sonnet+Opus)
                            </span>
                          </td>
                        </tr>
                        <tr
                          style={{
                            borderTop: `1px solid ${appleWebColors.borderSubtle}`,
                            backgroundColor: `${systemColors.green}08`,
                          }}
                        >
                          <td
                            className="p-3 font-medium"
                            style={{ color: systemColors.green }}
                          >
                            Safety Guardian
                          </td>
                          <td
                            className="text-center p-3"
                            style={{ color: appleWebColors.textTertiary }}
                          >
                            -
                          </td>
                          <td
                            className="text-center p-3"
                            style={{ color: appleWebColors.textTertiary }}
                          >
                            -
                          </td>
                          <td className="text-center p-3">
                            <Check
                              size={16}
                              className="inline"
                              style={{ color: systemColors.green }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Upgrade/Downgrade Buttons */}
                  {displayPlan === "free" && (
                    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                      <UpgradeButton
                        plan="pro"
                        currentPlan="free"
                        variant="primary"
                        size="lg"
                        className="w-full sm:w-auto"
                        style={{
                          background: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
                        }}
                      >
                        <Crown size={18} />
                        Proにアップグレード - ¥590/月
                      </UpgradeButton>
                      <UpgradeButton
                        plan="pro_safety"
                        currentPlan="free"
                        variant="primary"
                        size="lg"
                        className="w-full sm:w-auto"
                        style={{
                          background: `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
                        }}
                      >
                        <Shield size={18} />
                        Pro+Safetyにアップグレード - ¥1,280/月
                      </UpgradeButton>
                    </div>
                  )}
                  {displayPlan === "pro" && (
                    <div className="mt-6 flex justify-center">
                      <UpgradeButton
                        plan="pro_safety"
                        currentPlan="pro"
                        variant="primary"
                        size="lg"
                        style={{
                          background: `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
                        }}
                      >
                        <Shield size={18} />
                        Pro+Safetyにアップグレード - ¥1,280/月
                      </UpgradeButton>
                    </div>
                  )}
                  {displayPlan === "pro_safety" && (
                    <div className="mt-6 flex justify-center">
                      <UpgradeButton
                        plan="pro"
                        currentPlan="pro_safety"
                        variant="outline"
                        size="md"
                        className="text-gray-600"
                      >
                        Proにダウングレード（次回更新時から適用）
                      </UpgradeButton>
                    </div>
                  )}
                  <p
                    className="text-center text-[11px] mt-4"
                    style={{ color: appleWebColors.textTertiary }}
                  >
                    いつでもキャンセル可能 ・ 月額自動更新
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* Upgrade Success Modal */}
      {upgradedPlan && (
        <UpgradeSuccessModal
          isOpen={showUpgradeSuccess}
          onClose={() => setShowUpgradeSuccess(false)}
          plan={upgradedPlan}
        />
      )}
    </div>
  );
}
