"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Heart, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [guideMenuOpen, setGuideMenuOpen] = useState(false);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDesktopMenuOpen(false);
    setGuideMenuOpen(false);
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

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/3 backdrop-blur-xl shadow-lg supports-[backdrop-filter]:bg-white/2">
        <div className="mx-auto px-6 lg:px-12 xl:px-16 max-w-[1440px]">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/logo.png"
                alt="サプティア Logo"
                width={56}
                height={70}
                priority
              />
              <div className="flex flex-col">
                <span className="font-bold text-lg text-primary-900 leading-none">
                  サプティア
                </span>
                <span className="text-xs text-primary-600 leading-none">
                  Suptia
                </span>
              </div>
            </Link>

            {/* Right: Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              {/* Favorites Link */}
              <Link
                href="/favorites"
                className="flex items-center gap-2 px-4 py-2 text-sm text-primary-800 hover:text-primary transition-colors font-medium rounded-lg hover:bg-primary-50"
              >
                <Heart size={18} />
                <span>お気に入り</span>
              </Link>

              {/* Guide Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setGuideMenuOpen(!guideMenuOpen)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm text-primary-800 hover:text-primary transition-colors font-medium rounded-lg hover:bg-primary-50"
                >
                  <BookOpen size={18} />
                  <span>ガイド</span>
                  <motion.div
                    animate={{ rotate: guideMenuOpen ? 180 : 0 }}
                    transition={{
                      duration: 0.25,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </button>

                {/* Guide Dropdown Menu */}
                <AnimatePresence>
                  {guideMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.9 }}
                      transition={{
                        duration: 0.25,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="absolute left-0 top-full mt-2 w-56 bg-white/70 backdrop-blur-xl rounded-xl shadow-2xl border border-white/50 py-2 z-[100]"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.75) 100%)",
                        boxShadow:
                          "0 8px 32px 0 rgba(0, 102, 204, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
                      }}
                      onMouseLeave={() => setGuideMenuOpen(false)}
                    >
                      <Link
                        href="/about"
                        onClick={() => setGuideMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-primary-900 hover:bg-white/60 hover:text-primary transition-all duration-150 font-medium hover:translate-x-1 rounded-lg mx-2"
                      >
                        サプティアとは
                      </Link>
                      <Link
                        href="/why-suptia"
                        onClick={() => setGuideMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-primary-900 hover:bg-white/60 hover:text-primary transition-all duration-150 font-medium hover:translate-x-1 rounded-lg mx-2"
                      >
                        AI検索との違い
                      </Link>
                      <Link
                        href="/how-to-use"
                        onClick={() => setGuideMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-primary-900 hover:bg-white/60 hover:text-primary transition-all duration-150 font-medium hover:translate-x-1 rounded-lg mx-2"
                      >
                        サプティアの使い方
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Diagnosis Link - Highlighted */}
              <Link
                href="/diagnosis"
                className="group relative px-5 py-2.5 text-white rounded-xl transition-all duration-300 text-sm font-bold flex items-center gap-2 overflow-visible hover:scale-105"
                style={{
                  boxShadow:
                    "0 4px 20px rgba(147, 51, 234, 0.4), 0 2px 10px rgba(219, 39, 119, 0.25)",
                }}
              >
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-60 blur-sm group-hover:opacity-80 group-hover:blur-md transition-all duration-300" />

                {/* Button background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_100%] rounded-xl group-hover:bg-right transition-all duration-500" />

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300"
                >
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                <span className="relative z-10">診断する</span>
              </Link>

              {/* Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDesktopMenuOpen(!desktopMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-all hover:shadow-lg text-sm font-medium"
                >
                  <Menu size={18} />
                  <span>メニュー</span>
                  <motion.div
                    animate={{ rotate: desktopMenuOpen ? 180 : 0 }}
                    transition={{
                      duration: 0.25,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </button>

                {/* Dropdown Menu with AnimatePresence */}
                <AnimatePresence>
                  {desktopMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.9 }}
                      transition={{
                        duration: 0.25,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white/70 backdrop-blur-xl rounded-xl shadow-2xl border border-white/50 py-2 z-[100]"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.75) 100%)",
                        boxShadow:
                          "0 8px 32px 0 rgba(0, 102, 204, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
                      }}
                      onMouseLeave={() => setDesktopMenuOpen(false)}
                    >
                      <Link
                        href="/"
                        onClick={() => setDesktopMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-primary-900 hover:bg-white/60 hover:text-primary transition-all duration-150 font-medium hover:translate-x-1 rounded-lg mx-2"
                      >
                        ホーム
                      </Link>
                      <div className="border-t border-white/40 my-2"></div>
                      <div className="px-3 py-2 text-xs font-semibold text-primary-600 uppercase tracking-wide">
                        コンテンツ
                      </div>
                      <Link
                        href="/ingredients"
                        onClick={() => setDesktopMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-primary-900 hover:bg-white/60 hover:text-primary transition-all duration-150 hover:translate-x-1 rounded-lg mx-2"
                      >
                        成分ガイド
                      </Link>
                      <Link
                        href="/guide/dangerous-ingredients"
                        onClick={() => setDesktopMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-primary-900 hover:bg-white/60 hover:text-primary transition-all duration-150 hover:translate-x-1 rounded-lg mx-2"
                      >
                        危険成分ガイド
                      </Link>
                      <Link
                        href="/guide/purposes"
                        onClick={() => setDesktopMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-primary-900 hover:bg-white/60 hover:text-primary transition-all duration-150 hover:translate-x-1 rounded-lg mx-2"
                      >
                        目的別ガイド
                      </Link>
                      <Link
                        href="/guide/audiences"
                        onClick={() => setDesktopMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-primary-900 hover:bg-white/60 hover:text-primary transition-all duration-150 hover:translate-x-1 rounded-lg mx-2"
                      >
                        対象者別ガイド
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-primary-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-primary-600" />
              ) : (
                <Menu size={24} className="text-primary-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Menu Overlays with AnimatePresence */}
      <AnimatePresence>
        {desktopMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="hidden md:block fixed inset-0 z-[45] bg-gradient-to-br from-primary-900/20 via-primary-500/10 to-transparent backdrop-blur-sm"
            onClick={() => setDesktopMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {guideMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="hidden md:block fixed inset-0 z-[45] bg-gradient-to-br from-primary-900/20 via-primary-500/10 to-transparent backdrop-blur-sm"
            onClick={() => setGuideMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden fixed inset-0 z-[45] bg-gradient-to-br from-primary-900/30 via-primary-600/20 to-transparent backdrop-blur-md"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="md:hidden fixed top-16 left-0 right-0 z-[48] backdrop-blur-2xl border-b border-white/30 shadow-2xl"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.85) 100%)",
                boxShadow:
                  "0 8px 32px 0 rgba(0, 102, 204, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.9)",
              }}
            >
              <div className="px-6 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
                {/* Home - Mobile */}
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-primary-900 hover:bg-white/70 hover:text-primary transition-all duration-150 font-medium rounded-xl backdrop-blur-sm"
                >
                  ホーム
                </Link>

                {/* Diagnosis - Mobile (Highlighted) */}
                <Link
                  href="/diagnosis"
                  onClick={() => setMobileMenuOpen(false)}
                  className="group relative block px-4 py-3 text-white transition-all duration-300 font-bold rounded-xl overflow-visible flex items-center gap-2 active:scale-95"
                  style={{
                    boxShadow:
                      "0 4px 20px rgba(147, 51, 234, 0.4), 0 2px 10px rgba(219, 39, 119, 0.25)",
                  }}
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-60 blur-sm" />

                  {/* Button background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-xl" />

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="relative z-10"
                  >
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                  <span className="relative z-10">診断する</span>
                </Link>

                {/* Divider */}
                <div className="border-t border-white/40 my-3"></div>

                {/* Favorites - Mobile */}
                <Link
                  href="/favorites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-primary-900 hover:bg-white/70 hover:text-primary transition-all duration-150 font-medium rounded-xl backdrop-blur-sm flex items-center gap-2"
                >
                  <Heart size={18} />
                  お気に入り
                </Link>

                {/* Guide Section Header */}
                <div className="px-4 py-2 text-xs font-semibold text-primary-600 uppercase tracking-wide">
                  ガイド
                </div>

                {/* About - Mobile */}
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-primary-900 hover:bg-white/70 hover:text-primary transition-all duration-150 font-medium rounded-xl backdrop-blur-sm"
                >
                  サプティアとは
                </Link>

                {/* Why Suptia - Mobile */}
                <Link
                  href="/why-suptia"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-primary-900 hover:bg-white/70 hover:text-primary transition-all duration-150 font-medium rounded-xl backdrop-blur-sm"
                >
                  AI検索との違い
                </Link>

                {/* How to Use - Mobile */}
                <Link
                  href="/how-to-use"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-primary-900 hover:bg-white/70 hover:text-primary transition-all duration-150 font-medium rounded-xl backdrop-blur-sm"
                >
                  サプティアの使い方
                </Link>

                {/* Divider */}
                <div className="border-t border-white/40 my-3"></div>

                {/* Content Section Header */}
                <div className="px-4 py-2 text-xs font-semibold text-primary-600 uppercase tracking-wide">
                  コンテンツ
                </div>

                {/* Ingredient Guide - Mobile */}
                <Link
                  href="/ingredients"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-primary-900 hover:bg-white/70 hover:text-primary transition-all duration-150 font-medium rounded-xl backdrop-blur-sm"
                >
                  成分ガイド
                </Link>

                {/* Dangerous Ingredients Guide - Mobile */}
                <Link
                  href="/guide/dangerous-ingredients"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-primary-900 hover:bg-white/70 hover:text-primary transition-all duration-150 font-medium rounded-xl backdrop-blur-sm"
                >
                  危険成分ガイド
                </Link>

                {/* Purpose Guide - Mobile */}
                <Link
                  href="/guide/purposes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-primary-900 hover:bg-white/70 hover:text-primary transition-all duration-150 font-medium rounded-xl backdrop-blur-sm"
                >
                  目的別ガイド
                </Link>

                {/* Audience Guide - Mobile */}
                <Link
                  href="/guide/audiences"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-primary-900 hover:bg-white/70 hover:text-primary transition-all duration-150 font-medium rounded-xl backdrop-blur-sm"
                >
                  対象者別ガイド
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
