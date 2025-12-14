"use client";

import Link from "next/link";
import Image from "next/image";
import {
  appleWebColors,
  typography,
  fontStack,
  liquidGlass,
  liquidGlassClasses,
} from "@/lib/design-system";

const footerSections = [
  {
    title: "コンテンツ",
    links: [
      { href: "/ingredients", label: "成分ガイド" },
      { href: "/guide/dangerous-ingredients", label: "危険成分ガイド" },
      { href: "/guide/purposes", label: "目的別ガイド" },
      { href: "/guide/audiences", label: "対象者別ガイド" },
    ],
  },
  {
    title: "法的情報",
    links: [
      { href: "/legal/terms", label: "利用規約" },
      { href: "/legal/privacy", label: "プライバシーポリシー" },
      { href: "/legal/disclosure", label: "特定商取引法に基づく表記" },
      { href: "/legal/disclaimer", label: "免責事項" },
      { href: "/legal/cookies", label: "Cookieポリシー" },
      { href: "/legal/affiliate", label: "アフィリエイト開示" },
    ],
  },
  {
    title: "運営情報",
    links: [
      { href: "/about", label: "サプティアとは" },
      { href: "/why-suptia", label: "AI検索との違い" },
      { href: "/about/methodology", label: "比較方法論" },
      { href: "/advisory", label: "情報ソースと方針" },
      { href: "/contact", label: "お問い合わせ" },
      { href: "/partners", label: "提携パートナー" },
    ],
  },
  {
    title: "サイト情報",
    links: [
      { href: "/sitemap", label: "サイトマップ" },
      { href: "/faq", label: "よくある質問" },
      { href: "/how-to-use", label: "サプティアの使い方" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      className="border-t relative z-10"
      style={{
        backgroundColor: appleWebColors.sectionBackground,
        borderColor: appleWebColors.borderSubtle,
        fontFamily: fontStack,
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px] py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Navigation Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3
                className={`${typography.headline} mb-6`}
                style={{ color: appleWebColors.textPrimary }}
              >
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`${typography.subhead} transition-colors hover:opacity-70`}
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="p-2 rounded-[24px] border border-white/80"
                style={liquidGlass.light}
              >
                <Image
                  src="/logo.png"
                  alt="サプティア Logo"
                  width={32}
                  height={40}
                  className="w-8 h-auto"
                />
              </div>
              <h3
                className="font-bold text-[20px] tracking-tight"
                style={{ color: appleWebColors.textPrimary }}
              >
                サプティア
              </h3>
            </div>
            <p
              className={`${typography.subhead} mb-6 leading-relaxed`}
              style={{ color: appleWebColors.textSecondary }}
            >
              科学的根拠に基づくサプリメント比較メタサーチ。
              <br />
              あなたに最適なサプリメントを見つけるお手伝いをします。
            </p>
            <p
              className={`${typography.caption1} mb-6 p-3 rounded-[24px] border border-white/80`}
              style={{
                color: appleWebColors.textSecondary,
                ...liquidGlass.light,
              }}
            >
              ※ 本サイトは医療・診断を目的としたものではありません
            </p>

            {/* Social Media Links */}
            <div>
              <h4
                className={`${typography.footnote} font-semibold mb-4`}
                style={{ color: appleWebColors.textPrimary }}
              >
                フォローする
              </h4>
              <div className="flex gap-3">
                {/* X (Twitter) - Official X logo */}
                <Link
                  href="https://x.com/suptia_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-white/80 transition-all hover:scale-105 group"
                  style={liquidGlass.light}
                  aria-label="XでSuptiaをフォロー"
                >
                  <svg
                    className="w-5 h-5 transition-colors"
                    style={{ color: appleWebColors.textSecondary }}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                </Link>

                {/* Instagram - Official Instagram logo */}
                <Link
                  href="https://instagram.com/suptia_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-white/80 transition-all hover:scale-105 group"
                  style={liquidGlass.light}
                  aria-label="InstagramでSuptiaをフォロー"
                >
                  <svg
                    className="w-5 h-5 transition-colors group-hover:text-pink-500"
                    style={{ color: appleWebColors.textSecondary }}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </Link>

                {/* Threads - Official Threads logo */}
                <Link
                  href="https://www.threads.net/@suptia_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-white/80 transition-all hover:scale-105 group"
                  style={liquidGlass.light}
                  aria-label="ThreadsでSuptiaをフォロー"
                >
                  <svg
                    className="w-5 h-5 transition-colors"
                    style={{ color: appleWebColors.textSecondary }}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.17.408-2.243 1.33-3.023.88-.744 2.12-1.201 3.596-1.324 1.2-.1 2.318-.034 3.348.166-.036-.6-.175-1.076-.416-1.426-.326-.474-.873-.715-1.624-.715h-.063c-.603.009-1.102.183-1.485.518-.322.282-.54.664-.63 1.104l-2.016-.44c.148-.723.477-1.37.975-1.918.762-.84 1.83-1.29 3.093-1.31h.094c1.478.017 2.633.56 3.436 1.612.706.925 1.074 2.19 1.097 3.762v.142c.016.137.024.34.024.62 0 .122-.003.244-.01.365l-.021.318-.007.095c.6.455 1.122 1.013 1.545 1.66.81 1.24 1.094 2.688.824 4.192-.42 2.34-1.712 4.235-3.74 5.487-1.678 1.036-3.723 1.57-6.084 1.587zm-.373-9.345c-1.085.088-1.9.377-2.425.858-.47.43-.672.95-.635 1.562.044.788.406 1.358 1.077 1.793.585.38 1.349.56 2.148.512 1.088-.059 1.934-.46 2.517-1.186.467-.582.78-1.37.93-2.342-.856-.265-1.808-.395-2.84-.327l-.772.13z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="border-t pt-8 text-center"
          style={{ borderColor: appleWebColors.borderSubtle }}
        >
          <p
            className={`${typography.footnote}`}
            style={{ color: appleWebColors.textSecondary }}
          >
            &copy; {new Date().getFullYear()} サプティア. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
