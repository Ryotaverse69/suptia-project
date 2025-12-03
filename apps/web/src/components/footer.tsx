"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";
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
    <footer className="border-t border-slate-200 bg-slate-100 relative z-10">
      <div className="container mx-auto px-6 lg:px-12 xl:px-16 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* コンテンツ */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-slate-800">
              コンテンツ
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link
                  href="/ingredients"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors"></span>
                  成分ガイド
                </Link>
              </li>
              <li>
                <Link
                  href="/guide/dangerous-ingredients"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors"></span>
                  危険成分ガイド
                </Link>
              </li>
              <li>
                <Link
                  href="/guide/purposes"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors"></span>
                  目的別ガイド
                </Link>
              </li>
              <li>
                <Link
                  href="/guide/audiences"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors"></span>
                  対象者別ガイド
                </Link>
              </li>
            </ul>
          </div>

          {/* 法的義務・コンプライアンス */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-slate-800">法的情報</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link
                  href="/legal/terms"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors"></span>
                  利用規約
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors"></span>
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/disclosure"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors"></span>
                  特定商取引法に基づく表記
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/disclaimer"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors"></span>
                  免責事項
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookies"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors"></span>
                  Cookieポリシー
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/affiliate"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors"></span>
                  アフィリエイト開示
                </Link>
              </li>
            </ul>
          </div>

          {/* 会社情報・信頼性 */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-slate-800">運営情報</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link
                  href="/about"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors"></span>
                  サプティアとは
                </Link>
              </li>
              <li>
                <Link
                  href="/advisory"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors"></span>
                  情報ソースと方針
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors"></span>
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link
                  href="/partners"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors"></span>
                  提携パートナー
                </Link>
              </li>
            </ul>
          </div>

          {/* サイト情報 */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-slate-800">
              サイト情報
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link
                  href="/sitemap"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors"></span>
                  サイトマップ
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors"></span>
                  よくある質問
                </Link>
              </li>
              <li>
                <Link
                  href="/how-to-use"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors"></span>
                  サプティアの使い方
                </Link>
              </li>
            </ul>
          </div>

          {/* ブランド・説明 */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                <Image
                  src="/logo.png"
                  alt="サプティア Logo"
                  width={32}
                  height={40}
                  className="w-8 h-auto"
                />
              </div>
              <h3 className="font-black text-xl text-slate-800 tracking-tight">
                サプティア
              </h3>
            </div>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              科学的根拠に基づくサプリメント比較メタサーチ。
              <br />
              あなたに最適なサプリメントを見つけるお手伝いをします。
            </p>
            <p className="text-xs text-slate-400 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100">
              ※ 本サイトは医療・診断を目的としたものではありません
            </p>

            {/* Social Media Links */}
            <div>
              <h4 className="font-bold text-sm mb-4 text-slate-700">
                フォローする
              </h4>
              <div className="flex gap-3">
                {/* X (Twitter) */}
                <Link
                  href="https://x.com/suptia_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-white hover:bg-slate-900 border border-slate-200 hover:border-slate-900 transition-all group shadow-sm hover:shadow-md"
                  aria-label="XでSuptiaをフォロー"
                >
                  <svg
                    className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </Link>

                {/* Instagram */}
                <Link
                  href="https://instagram.com/suptia_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-white border border-slate-200 group hover:border-pink-500 transition-all shadow-sm hover:shadow-md"
                  aria-label="InstagramでSuptiaをフォロー"
                >
                  <Instagram className="w-5 h-5 text-slate-600 group-hover:text-pink-500 transition-colors" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-200/60 pt-8 text-center text-sm text-slate-400 font-medium">
          <p>
            &copy; {new Date().getFullYear()} サプティア. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
