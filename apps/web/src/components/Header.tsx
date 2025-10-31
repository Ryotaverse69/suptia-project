"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { User, Menu, X, ChevronDown } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);

  return (
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
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
              >
                <Menu size={18} />
                <span>メニュー</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${desktopMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {desktopMenuOpen && (
                <>
                  {/* Overlay to close menu when clicking outside */}
                  <div
                    className="fixed inset-0 z-[60]"
                    onClick={() => setDesktopMenuOpen(false)}
                  />
                  {/* Dropdown Content */}
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-primary-200 py-2 z-[70]">
                    <Link
                      href="/"
                      onClick={() => setDesktopMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-primary-800 hover:bg-primary-50 hover:text-primary transition-colors font-medium"
                    >
                      ホーム
                    </Link>
                    <div className="border-t border-primary-100 my-2"></div>
                    <div className="px-3 py-2 text-xs font-semibold text-primary-600 uppercase tracking-wide">
                      コンテンツ
                    </div>
                    <Link
                      href="/ingredients"
                      onClick={() => setDesktopMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-primary-800 hover:bg-primary-50 hover:text-primary transition-colors"
                    >
                      成分ガイド
                    </Link>
                    <Link
                      href="/guide/dangerous-ingredients"
                      onClick={() => setDesktopMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-primary-800 hover:bg-primary-50 hover:text-primary transition-colors"
                    >
                      危険成分ガイド
                    </Link>
                    <Link
                      href="/guide/purposes"
                      onClick={() => setDesktopMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-primary-800 hover:bg-primary-50 hover:text-primary transition-colors"
                    >
                      目的別ガイド
                    </Link>
                    <Link
                      href="/guide/audiences"
                      onClick={() => setDesktopMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-primary-800 hover:bg-primary-50 hover:text-primary transition-colors"
                    >
                      対象者別ガイド
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Login Button - Hidden for now */}
            {/* <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
            >
              <User size={18} />
              <span>ログイン</span>
            </Link> */}
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <>
            {/* Overlay to close menu when clicking outside */}
            <div
              className="fixed inset-0 z-[60] md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="md:hidden border-t border-primary-200 py-4 space-y-4 relative z-[70] bg-white">
              {/* Home - Mobile */}
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-2 py-2 text-primary-800 hover:text-primary transition-colors font-medium"
              >
                ホーム
              </Link>

              {/* About - Mobile */}
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-2 py-2 text-primary-800 hover:text-primary transition-colors font-medium"
              >
                サプティアとは
              </Link>

              {/* How to Use - Mobile */}
              <Link
                href="/how-to-use"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-2 py-2 text-primary-800 hover:text-primary transition-colors font-medium"
              >
                サプティアの使い方
              </Link>

              {/* Divider */}
              <div className="border-t border-primary-200 my-2"></div>

              {/* Content Section Header */}
              <div className="px-2 py-1 text-xs font-semibold text-primary-600 uppercase tracking-wide">
                コンテンツ
              </div>

              {/* Ingredient Guide - Mobile */}
              <Link
                href="/ingredients"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-2 py-2 text-primary-800 hover:text-primary transition-colors font-medium"
              >
                成分ガイド
              </Link>

              {/* Dangerous Ingredients Guide - Mobile */}
              <Link
                href="/guide/dangerous-ingredients"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-2 py-2 text-primary-800 hover:text-primary transition-colors font-medium"
              >
                危険成分ガイド
              </Link>

              {/* Purpose Guide - Mobile */}
              <Link
                href="/guide/purposes"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-2 py-2 text-primary-800 hover:text-primary transition-colors font-medium"
              >
                目的別ガイド
              </Link>

              {/* Audience Guide - Mobile */}
              <Link
                href="/guide/audiences"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-2 py-2 text-primary-800 hover:text-primary transition-colors font-medium"
              >
                対象者別ガイド
              </Link>

              {/* Login - Mobile - Hidden for now */}
              {/* <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 mx-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                <User size={18} />
                <span>ログイン</span>
              </Link> */}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
