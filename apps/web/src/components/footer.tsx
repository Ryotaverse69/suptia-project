"use client";

import Link from "next/link";
import Image from "next/image";
// import { useState } from "react"; // 言語選択機能を実装時に有効化
// import { Globe, ChevronDown } from "lucide-react"; // 言語選択機能を実装時に有効化
// import { cn } from "@/lib/utils/cn"; // 言語選択機能を実装時に有効化

export function Footer() {
  // 言語選択機能 - 将来実装時に有効化
  // const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  // const [currentLanguage, setCurrentLanguage] = useState("日本語");
  // const [currentCurrency, setCurrentCurrency] = useState("JPY");

  // const languages = [
  //   { code: "ja", name: "日本語", currency: "JPY" },
  //   { code: "en", name: "English", currency: "USD" },
  //   { code: "zh", name: "中文", currency: "CNY" },
  // ];

  // const handleLanguageChange = (lang: { name: string; currency: string }) => {
  //   setCurrentLanguage(lang.name);
  //   setCurrentCurrency(lang.currency);
  //   setLanguageMenuOpen(false);
  // };
  return (
    <footer className="border-t bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* コンテンツ */}
          <div>
            <h3 className="font-bold text-lg mb-4">コンテンツ</h3>
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
                  href="/guide/dangerous-ingredients"
                  className="hover:text-foreground transition-colors"
                >
                  危険成分ガイド
                </Link>
              </li>
              <li>
                <Link
                  href="/guide/purposes"
                  className="hover:text-foreground transition-colors"
                >
                  目的別ガイド
                </Link>
              </li>
              <li>
                <Link
                  href="/guide/purposes/beauty"
                  className="hover:text-foreground transition-colors pl-3"
                >
                  ├ 美肌・美容
                </Link>
              </li>
              <li>
                <Link
                  href="/guide/purposes/muscle"
                  className="hover:text-foreground transition-colors pl-3"
                >
                  ├ 筋肉増強
                </Link>
              </li>
              <li>
                <Link
                  href="/guide/purposes/sleep"
                  className="hover:text-foreground transition-colors pl-3"
                >
                  ├ 睡眠改善
                </Link>
              </li>
              <li>
                <Link
                  href="/guide/purposes/immunity"
                  className="hover:text-foreground transition-colors pl-3"
                >
                  ├ 免疫力向上
                </Link>
              </li>
              <li>
                <Link
                  href="/guide/purposes/energy"
                  className="hover:text-foreground transition-colors pl-3"
                >
                  └ 疲労回復
                </Link>
              </li>
            </ul>
          </div>

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
              <li>
                <Link
                  href="/legal/affiliate"
                  className="hover:text-foreground transition-colors"
                >
                  アフィリエイト開示
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
                  href="/advisory"
                  className="hover:text-foreground transition-colors"
                >
                  情報ソースと方針
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

        {/* 言語と通貨の選択 - 一時的に非表示（将来実装予定） */}
        {/* TODO: 多言語・多通貨対応を実装したら有効化する */}
        {/* <div className="border-t pt-6 mb-6">
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
        </div> */}

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
