"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDesktopMenuOpen(false);
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
                width={40}
                height={50}
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
            <nav className="hidden md:flex items-center gap-6">
              {/* About Link */}
              <Link
                href="/about"
                className="text-sm text-primary-800 hover:text-primary transition-colors font-medium"
              >
                サプティアとは
              </Link>

              {/* How to Use Link */}
              <Link
                href="/how-to-use"
                className="text-sm text-primary-800 hover:text-primary transition-colors font-medium"
              >
                サプティアの使い方
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

      {/* Desktop Menu Overlay with AnimatePresence */}
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

                {/* About - Mobile */}
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-primary-900 hover:bg-white/70 hover:text-primary transition-all duration-150 font-medium rounded-xl backdrop-blur-sm"
                >
                  サプティアとは
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
