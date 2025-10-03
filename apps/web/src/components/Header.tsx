"use client";

import Link from "next/link";
import { useState } from "react";
import { Globe, User, ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("日本語");
  const [currentCurrency, setCurrentCurrency] = useState("JPY");

  const languages = [
    { code: "ja", name: "日本語", currency: "JPY" },
    { code: "en", name: "English", currency: "USD" },
    { code: "zh", name: "中文", currency: "CNY" },
  ];

  const handleLanguageChange = (lang: { name: string; currency: string }) => {
    setCurrentLanguage(lang.name);
    setCurrentCurrency(lang.currency);
    setLanguageMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto px-6 lg:px-12 xl:px-16 max-w-[1440px]">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-gray-900 leading-none">
                サプティア
              </span>
              <span className="text-xs text-gray-500 leading-none">Suptia</span>
            </div>
          </Link>

          {/* Right: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Language & Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                <Globe size={18} className="text-gray-600" />
                <span className="text-gray-700">
                  {currentLanguage} · {currentCurrency}
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    "text-gray-500 transition-transform",
                    languageMenuOpen && "rotate-180",
                  )}
                />
              </button>

              {languageMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLanguageMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang)}
                        className={cn(
                          "w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm",
                          currentLanguage === lang.name &&
                            "bg-blue-50 text-blue-600 font-medium",
                        )}
                      >
                        {lang.name} · {lang.currency}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* About Link */}
            <Link
              href="/about"
              className="text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              サプティアとは
            </Link>

            {/* Login Button */}
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <User size={18} />
              <span>ログイン</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-gray-600" />
            ) : (
              <Menu size={24} className="text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-4">
            {/* Language & Currency - Mobile */}
            <div className="px-2">
              <div className="text-xs font-medium text-gray-500 mb-2">
                言語と通貨
              </div>
              <div className="space-y-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      handleLanguageChange(lang);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full px-3 py-2 text-left rounded-lg transition-colors text-sm",
                      currentLanguage === lang.name
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "hover:bg-gray-50",
                    )}
                  >
                    {lang.name} · {lang.currency}
                  </button>
                ))}
              </div>
            </div>

            {/* About - Mobile */}
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-2 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              サプティアとは
            </Link>

            {/* Login - Mobile */}
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 mx-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <User size={18} />
              <span>ログイン</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
