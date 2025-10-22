"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { CookieSettingsButton } from "./CookieSettingsButton";

export function Footer() {
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
    <footer className="border-t bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* 法的義務・コンプライアンス */}
          <div>
            <h3 className="font-bold text-lg mb-4">法的情報</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/legal/terms"
                  className="hover:text-foreground transition-colors"
                >
                  利用規約
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/disclosure"
                  className="hover:text-foreground transition-colors"
                >
                  特定商取引法に基づく表記
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/disclaimer"
                  className="hover:text-foreground transition-colors"
                >
                  免責事項
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookies"
                  className="hover:text-foreground transition-colors"
                >
                  Cookieポリシー
                </Link>
              </li>
            </ul>
          </div>

          {/* 会社情報・信頼性 */}
          <div>
            <h3 className="font-bold text-lg mb-4">運営情報</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/about"
                  className="hover:text-foreground transition-colors"
                >
                  サプティアとは
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-foreground transition-colors"
                >
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link
                  href="/partners"
                  className="hover:text-foreground transition-colors"
                >
                  提携パートナー
                </Link>
              </li>
            </ul>
          </div>

          {/* サイト情報 */}
          <div>
            <h3 className="font-bold text-lg mb-4">サイト情報</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/ingredients"
                  className="hover:text-foreground transition-colors"
                >
                  成分ガイド
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap"
                  className="hover:text-foreground transition-colors"
                >
                  サイトマップ
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-foreground transition-colors"
                >
                  よくある質問
                </Link>
              </li>
              <li>
                <Link
                  href="/how-to-use"
                  className="hover:text-foreground transition-colors"
                >
                  サプティアの使い方
                </Link>
              </li>
            </ul>
          </div>

          {/* ブランド・説明 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.png"
                alt="サプティア Logo"
                width={32}
                height={40}
              />
              <h3 className="font-bold text-lg">サプティア</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              科学的根拠に基づくサプリメント比較メタサーチ。
              あなたに最適なサプリメントを見つけるお手伝いをします。
            </p>
            <p className="text-xs text-muted-foreground">
              ※ 本サイトは医療・診断を目的としたものではありません
            </p>
          </div>
        </div>

        {/* アフィリエイト開示 */}
        <div className="border-t pt-6 mb-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">
              アフィリエイトプログラムについて
            </h4>
            <p className="text-xs text-muted-foreground">
              当サイトは、Amazon.co.jp、楽天市場、Yahoo!ショッピング、Qoo10、iHerb、その他提携企業のアフィリエイトプログラムに参加しています。
              商品リンクを経由して購入された場合、当サイトは紹介料を受け取ることがあります。
              これにより商品価格が変わることはありません。
              また、レビューや評価は紹介料の有無に関わらず、科学的根拠と中立性を保持して提供しています。
            </p>
          </div>
        </div>

        {/* 言語と通貨の選択 */}
        <div className="border-t pt-6 mb-6">
          <div className="flex items-center justify-center gap-4">
            <span className="text-sm text-muted-foreground">言語と通貨:</span>
            <div className="relative">
              <button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary-100 transition-colors text-sm border border-primary-200"
              >
                <Globe size={18} className="text-primary-600" />
                <span className="text-primary-800">
                  {currentLanguage} · {currentCurrency}
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    "text-primary-500 transition-transform",
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
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white rounded-lg shadow-lg border border-primary-200 py-2 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang)}
                        className={cn(
                          "w-full px-4 py-2 text-left hover:bg-primary-50 transition-colors text-sm",
                          currentLanguage === lang.name &&
                            "bg-primary-100 text-primary font-medium",
                        )}
                      >
                        {lang.name} · {lang.currency}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Cookie同意設定リンク */}
        <div className="border-t pt-6 mb-6">
          <CookieSettingsButton />
        </div>

        {/* Copyright */}
        <div className="border-t pt-6 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} サプティア. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
