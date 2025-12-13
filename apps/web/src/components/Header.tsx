"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Heart,
  User,
  LogOut,
  Home,
  History,
  Search,
  BookOpen,
  Shield,
  Target,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { LoginModal } from "@/components/auth/LoginModal";
import {
  appleWebColors,
  systemColors,
  typography,
  appleEase,
  subtleSpring,
  componentSizes,
  fontStack,
  liquidGlass,
  liquidGlassClasses,
} from "@/lib/design-system";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, isLoading: authLoading, signOut } = useAuth();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDesktopMenuOpen(false);
    setUserMenuOpen(false);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Liquid Glass hover effect for menu items (WWDC 2025)
  const menuItemClasses = `
    flex items-center gap-3 px-4 py-3 text-[15px] font-medium
    rounded-[12px] min-h-[44px]
    transition-all duration-200
    hover:bg-white/50 hover:backdrop-blur-[12px] hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <>
      {/* Apple-style Navigation Bar (44pt height) */}
      <header
        className="sticky top-0 z-50 w-full border-b"
        style={{
          ...liquidGlass.light,
          borderRadius: 0,
          borderColor: appleWebColors.borderSubtle,
          fontFamily: fontStack,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px]">
          <div
            className="flex items-center justify-between"
            style={{ height: componentSizes.navBar + 20 }} // 64px for web
          >
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 transition-opacity hover:opacity-80"
            >
              <Image
                src="/logo.png"
                alt="サプティア Logo"
                width={48}
                height={60}
                priority
              />
              <div className="flex flex-col">
                <span
                  className="font-bold text-[17px] leading-tight"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  サプティア
                </span>
                <span
                  className="text-[11px] leading-tight"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  Suptia
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {/* Menu Dropdown */}
              <div className="relative">
                <motion.button
                  onClick={() => setDesktopMenuOpen(!desktopMenuOpen)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full
                    ${typography.subhead} font-medium
                    transition-all duration-200 min-h-[44px]
                    hover:bg-white/50 hover:backdrop-blur-[12px] hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]
                  `}
                  style={{
                    color: appleWebColors.textPrimary,
                    backgroundColor: desktopMenuOpen
                      ? "rgba(255, 255, 255, 0.5)"
                      : "transparent",
                    backdropFilter: desktopMenuOpen ? "blur(12px)" : "none",
                    boxShadow: desktopMenuOpen
                      ? "0 2px 12px rgba(0, 0, 0, 0.06)"
                      : "none",
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={subtleSpring}
                >
                  <Menu size={18} aria-hidden="true" />
                  <span>メニュー</span>
                  <motion.div
                    animate={{ rotate: desktopMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: appleEase }}
                  >
                    <ChevronDown size={14} aria-hidden="true" />
                  </motion.div>
                </motion.button>

                {/* Desktop Dropdown */}
                <AnimatePresence>
                  {desktopMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: appleEase }}
                      className="absolute right-0 top-full mt-2 w-72 py-2 z-[100] overflow-hidden"
                      style={{
                        ...liquidGlass.light,
                        boxShadow:
                          "0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                      }}
                      onMouseLeave={() => setDesktopMenuOpen(false)}
                    >
                      {/* Main Actions */}
                      <Link
                        href="/"
                        onClick={() => setDesktopMenuOpen(false)}
                        className={menuItemClasses}
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        <Home
                          size={18}
                          style={{ color: systemColors.blue }}
                          aria-hidden="true"
                        />
                        ホーム
                      </Link>

                      {/* Diagnosis CTA */}
                      <div className="px-2 py-1">
                        <Link
                          href="/diagnosis"
                          onClick={() => setDesktopMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-[10px] text-white font-semibold min-h-[48px]"
                          style={{
                            background: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
                          }}
                        >
                          <Search size={18} aria-hidden="true" />
                          診断する
                        </Link>
                      </div>

                      <Link
                        href="/favorites"
                        onClick={() => setDesktopMenuOpen(false)}
                        className={menuItemClasses}
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        <Heart
                          size={18}
                          style={{ color: systemColors.pink }}
                          aria-hidden="true"
                        />
                        お気に入り
                      </Link>

                      <Link
                        href="/diagnosis/history"
                        onClick={() => setDesktopMenuOpen(false)}
                        className={menuItemClasses}
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        <History
                          size={18}
                          style={{ color: systemColors.cyan }}
                          aria-hidden="true"
                        />
                        診断履歴
                      </Link>

                      {/* Divider */}
                      <div
                        className="mx-4 my-2 h-px"
                        style={{ backgroundColor: appleWebColors.borderSubtle }}
                      />

                      {/* Section: Guide */}
                      <p
                        className={`${typography.caption2} uppercase tracking-wider px-4 py-2`}
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        ガイド
                      </p>

                      <Link
                        href="/about"
                        onClick={() => setDesktopMenuOpen(false)}
                        className={menuItemClasses}
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        サプティアとは
                      </Link>
                      <Link
                        href="/why-suptia"
                        onClick={() => setDesktopMenuOpen(false)}
                        className={menuItemClasses}
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        AI検索との違い
                      </Link>
                      <Link
                        href="/how-to-use"
                        onClick={() => setDesktopMenuOpen(false)}
                        className={menuItemClasses}
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        サプティアの使い方
                      </Link>

                      {/* Divider */}
                      <div
                        className="mx-4 my-2 h-px"
                        style={{ backgroundColor: appleWebColors.borderSubtle }}
                      />

                      {/* Section: Content */}
                      <p
                        className={`${typography.caption2} uppercase tracking-wider px-4 py-2`}
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        コンテンツ
                      </p>

                      <Link
                        href="/ingredients"
                        onClick={() => setDesktopMenuOpen(false)}
                        className={menuItemClasses}
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        <BookOpen
                          size={18}
                          style={{ color: systemColors.green }}
                          aria-hidden="true"
                        />
                        成分ガイド
                      </Link>
                      <Link
                        href="/guide/dangerous-ingredients"
                        onClick={() => setDesktopMenuOpen(false)}
                        className={menuItemClasses}
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        <Shield
                          size={18}
                          style={{ color: systemColors.red }}
                          aria-hidden="true"
                        />
                        危険成分ガイド
                      </Link>
                      <Link
                        href="/guide/purposes"
                        onClick={() => setDesktopMenuOpen(false)}
                        className={menuItemClasses}
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        <Target
                          size={18}
                          style={{ color: systemColors.orange }}
                          aria-hidden="true"
                        />
                        目的別ガイド
                      </Link>
                      <Link
                        href="/guide/audiences"
                        onClick={() => setDesktopMenuOpen(false)}
                        className={menuItemClasses}
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        <Users
                          size={18}
                          style={{ color: systemColors.indigo }}
                          aria-hidden="true"
                        />
                        対象者別ガイド
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Menu / Login Button */}
              {authLoading ? (
                <div
                  className="w-8 h-8 rounded-full animate-pulse"
                  style={{ backgroundColor: systemColors.gray[5] }}
                />
              ) : user ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-2 py-2 rounded-full min-h-[44px] transition-all duration-200 hover:bg-white/50 hover:backdrop-blur-[12px] hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
                    whileTap={{ scale: 0.97 }}
                    transition={subtleSpring}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{
                        background: `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.indigo} 100%)`,
                      }}
                    >
                      {user.email?.[0].toUpperCase() || <User size={16} />}
                    </div>
                    <ChevronDown
                      size={14}
                      style={{
                        color: appleWebColors.textSecondary,
                        transform: userMenuOpen
                          ? "rotate(180deg)"
                          : "rotate(0)",
                        transition: "transform 0.2s ease",
                      }}
                      aria-hidden="true"
                    />
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: appleEase }}
                        className="absolute right-0 top-full mt-2 w-56 py-2 z-[100] overflow-hidden"
                        style={{
                          ...liquidGlass.light,
                          boxShadow:
                            "0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                        }}
                        onMouseLeave={() => setUserMenuOpen(false)}
                      >
                        <div
                          className="px-4 py-3 border-b"
                          style={{ borderColor: appleWebColors.borderSubtle }}
                        >
                          <p
                            className={`${typography.subhead} font-medium truncate`}
                            style={{ color: appleWebColors.textPrimary }}
                          >
                            {user.email}
                          </p>
                        </div>
                        <Link
                          href="/mypage"
                          onClick={() => setUserMenuOpen(false)}
                          className={menuItemClasses}
                          style={{ color: appleWebColors.textPrimary }}
                        >
                          <User
                            size={18}
                            style={{ color: systemColors.blue }}
                            aria-hidden="true"
                          />
                          マイページ
                        </Link>
                        <button
                          onClick={() => {
                            signOut();
                            setUserMenuOpen(false);
                          }}
                          className={`w-full ${menuItemClasses}`}
                          style={{ color: systemColors.red }}
                        >
                          <LogOut size={18} aria-hidden="true" />
                          ログアウト
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  onClick={() => setLoginModalOpen(true)}
                  className={`
                    flex items-center gap-2 px-5 py-2 rounded-full
                    ${typography.subhead} font-semibold
                    text-white min-h-[44px]
                    transition-all duration-200
                    hover:shadow-[0_4px_16px_rgba(0,122,255,0.4)]
                  `}
                  style={{ backgroundColor: appleWebColors.blue }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={subtleSpring}
                >
                  <User size={18} aria-hidden="true" />
                  <span>ログイン</span>
                </motion.button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-[12px] min-w-[44px] min-h-[44px] flex items-center justify-center transition-all duration-200 hover:bg-white/50 hover:backdrop-blur-[12px] hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
              style={{
                backgroundColor: mobileMenuOpen
                  ? "rgba(255, 255, 255, 0.5)"
                  : "transparent",
                backdropFilter: mobileMenuOpen ? "blur(12px)" : "none",
                boxShadow: mobileMenuOpen
                  ? "0 2px 12px rgba(0, 0, 0, 0.06)"
                  : "none",
              }}
              whileTap={{ scale: 0.95 }}
              aria-expanded={mobileMenuOpen}
              aria-label="メニューを開く"
            >
              {mobileMenuOpen ? (
                <X size={24} style={{ color: appleWebColors.textPrimary }} />
              ) : (
                <Menu size={24} style={{ color: appleWebColors.textPrimary }} />
              )}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Desktop Menu Overlay */}
      <AnimatePresence>
        {(desktopMenuOpen || userMenuOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="hidden md:block fixed inset-0 z-[45]"
            onClick={() => {
              setDesktopMenuOpen(false);
              setUserMenuOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden fixed inset-0 z-[45]"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: appleEase }}
              className="md:hidden fixed top-16 left-0 right-0 z-[48] border-b overflow-hidden"
              style={{
                ...liquidGlass.light,
                borderRadius: 0,
                borderColor: appleWebColors.borderSubtle,
                maxHeight: "calc(100vh - 64px)",
              }}
            >
              <div className="px-4 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-80px)]">
                {/* Home */}
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={menuItemClasses}
                  style={{ color: appleWebColors.textPrimary }}
                >
                  <Home
                    size={20}
                    style={{ color: systemColors.blue }}
                    aria-hidden="true"
                  />
                  ホーム
                </Link>

                {/* Diagnosis CTA */}
                <Link
                  href="/diagnosis"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-4 rounded-[12px] text-white font-semibold"
                  style={{
                    background: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.pink} 100%)`,
                  }}
                >
                  <Search size={20} aria-hidden="true" />
                  診断する
                </Link>

                {/* Divider */}
                <div
                  className="mx-2 my-3 h-px"
                  style={{ backgroundColor: appleWebColors.borderSubtle }}
                />

                <Link
                  href="/favorites"
                  onClick={() => setMobileMenuOpen(false)}
                  className={menuItemClasses}
                  style={{ color: appleWebColors.textPrimary }}
                >
                  <Heart
                    size={20}
                    style={{ color: systemColors.pink }}
                    aria-hidden="true"
                  />
                  お気に入り
                </Link>

                <Link
                  href="/diagnosis/history"
                  onClick={() => setMobileMenuOpen(false)}
                  className={menuItemClasses}
                  style={{ color: appleWebColors.textPrimary }}
                >
                  <History
                    size={20}
                    style={{ color: systemColors.cyan }}
                    aria-hidden="true"
                  />
                  診断履歴
                </Link>

                {/* Section: Guide */}
                <p
                  className={`${typography.caption1} uppercase tracking-wider px-4 pt-4 pb-2`}
                  style={{ color: appleWebColors.textSecondary }}
                >
                  ガイド
                </p>

                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={menuItemClasses}
                  style={{ color: appleWebColors.textPrimary }}
                >
                  サプティアとは
                </Link>
                <Link
                  href="/why-suptia"
                  onClick={() => setMobileMenuOpen(false)}
                  className={menuItemClasses}
                  style={{ color: appleWebColors.textPrimary }}
                >
                  AI検索との違い
                </Link>
                <Link
                  href="/how-to-use"
                  onClick={() => setMobileMenuOpen(false)}
                  className={menuItemClasses}
                  style={{ color: appleWebColors.textPrimary }}
                >
                  サプティアの使い方
                </Link>

                {/* Section: Content */}
                <p
                  className={`${typography.caption1} uppercase tracking-wider px-4 pt-4 pb-2`}
                  style={{ color: appleWebColors.textSecondary }}
                >
                  コンテンツ
                </p>

                <Link
                  href="/ingredients"
                  onClick={() => setMobileMenuOpen(false)}
                  className={menuItemClasses}
                  style={{ color: appleWebColors.textPrimary }}
                >
                  <BookOpen
                    size={20}
                    style={{ color: systemColors.green }}
                    aria-hidden="true"
                  />
                  成分ガイド
                </Link>
                <Link
                  href="/guide/dangerous-ingredients"
                  onClick={() => setMobileMenuOpen(false)}
                  className={menuItemClasses}
                  style={{ color: appleWebColors.textPrimary }}
                >
                  <Shield
                    size={20}
                    style={{ color: systemColors.red }}
                    aria-hidden="true"
                  />
                  危険成分ガイド
                </Link>
                <Link
                  href="/guide/purposes"
                  onClick={() => setMobileMenuOpen(false)}
                  className={menuItemClasses}
                  style={{ color: appleWebColors.textPrimary }}
                >
                  <Target
                    size={20}
                    style={{ color: systemColors.orange }}
                    aria-hidden="true"
                  />
                  目的別ガイド
                </Link>
                <Link
                  href="/guide/audiences"
                  onClick={() => setMobileMenuOpen(false)}
                  className={menuItemClasses}
                  style={{ color: appleWebColors.textPrimary }}
                >
                  <Users
                    size={20}
                    style={{ color: systemColors.indigo }}
                    aria-hidden="true"
                  />
                  対象者別ガイド
                </Link>

                {/* Section: Account */}
                <div
                  className="mx-2 my-3 h-px"
                  style={{ backgroundColor: appleWebColors.borderSubtle }}
                />
                <p
                  className={`${typography.caption1} uppercase tracking-wider px-4 pt-2 pb-2`}
                  style={{ color: appleWebColors.textSecondary }}
                >
                  アカウント
                </p>

                {authLoading ? (
                  <div className="px-4 py-3">
                    <div
                      className="w-full h-12 rounded-[12px] animate-pulse"
                      style={{ backgroundColor: systemColors.gray[5] }}
                    />
                  </div>
                ) : user ? (
                  <>
                    <div className="px-4 py-3 flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                        style={{
                          background: `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.indigo} 100%)`,
                        }}
                      >
                        {user.email?.[0].toUpperCase() || <User size={18} />}
                      </div>
                      <p
                        className={`${typography.subhead} font-medium truncate flex-1`}
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/mypage"
                      onClick={() => setMobileMenuOpen(false)}
                      className={menuItemClasses}
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      <User
                        size={20}
                        style={{ color: systemColors.blue }}
                        aria-hidden="true"
                      />
                      マイページ
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full ${menuItemClasses}`}
                      style={{ color: systemColors.red }}
                    >
                      <LogOut size={20} aria-hidden="true" />
                      ログアウト
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setLoginModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 mx-4 px-4 py-3 rounded-full text-white font-semibold"
                    style={{
                      backgroundColor: appleWebColors.blue,
                      width: "calc(100% - 32px)",
                    }}
                  >
                    <User size={20} aria-hidden="true" />
                    ログイン / 新規登録
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </>
  );
}
