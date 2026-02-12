import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/runtimeConfig";

/**
 * robots.txt 動的生成
 *
 * このファイルは /robots.txt エンドポイントを自動生成します
 * 検索エンジンのクロール最適化とインデックス制御を行います
 *
 * 主な機能:
 * - クローラーのアクセス制御
 * - サイトマップの場所を指定
 * - 検索エンジン別の最適化ルール
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/", // APIルートは非公開
          "/_next/", // Next.js内部ファイル
          "/studio/", // Sanity Studio
          "/admin/", // 管理画面
          "/mypage/", // マイページ（認証必要）
          "/auth/", // 認証関連ページ
          "/login", // ログインページ
          "/favorites", // お気に入り（認証必要）
          "/diagnosis/history", // 診断履歴（認証必要）
          "/diagnosis/results", // 診断結果（個別ユーザーデータ）
          "/*.json$", // JSONファイル
          "/private/", // プライベートページ
        ],
      },
      {
        // Googlebot固有のルール（Yahoo!も同じエンジンを使用）
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/studio/",
          "/mypage/",
          "/auth/",
          "/login",
          "/favorites",
          "/diagnosis/history",
          "/diagnosis/results",
        ],
        // フィルター・検索パラメータは許可（重要！）
      },
      {
        // Bingbot固有のルール
        userAgent: "Bingbot",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/studio/",
          "/mypage/",
          "/auth/",
          "/login",
          "/favorites",
          "/diagnosis/history",
          "/diagnosis/results",
        ],
      },
      {
        // Yahoo! Japan（念のため明示的に）
        userAgent: "Slurp",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/studio/",
          "/mypage/",
          "/auth/",
          "/login",
          "/favorites",
          "/diagnosis/history",
          "/diagnosis/results",
        ],
      },
      // AI検索エンジン向けのルール
      // GPTBot (OpenAI), Claude-Web (Anthropic), Google-Extended (Bard)
      {
        userAgent: "GPTBot",
        allow: ["/", "/llms.txt", "/ingredients/", "/products/"],
        disallow: [
          "/api/",
          "/_next/",
          "/studio/",
          "/mypage/",
          "/auth/",
          "/login",
          "/favorites",
          "/diagnosis/history",
          "/diagnosis/results",
        ],
      },
      {
        userAgent: "Claude-Web",
        allow: ["/", "/llms.txt", "/ingredients/", "/products/"],
        disallow: [
          "/api/",
          "/_next/",
          "/studio/",
          "/mypage/",
          "/auth/",
          "/login",
          "/favorites",
          "/diagnosis/history",
          "/diagnosis/results",
        ],
      },
      {
        userAgent: "Google-Extended",
        allow: ["/", "/llms.txt", "/ingredients/", "/products/"],
        disallow: [
          "/api/",
          "/_next/",
          "/studio/",
          "/mypage/",
          "/auth/",
          "/login",
          "/favorites",
          "/diagnosis/history",
          "/diagnosis/results",
        ],
      },
      {
        userAgent: "anthropic-ai",
        allow: ["/", "/llms.txt", "/ingredients/", "/products/"],
        disallow: [
          "/api/",
          "/_next/",
          "/studio/",
          "/mypage/",
          "/auth/",
          "/login",
          "/favorites",
          "/diagnosis/history",
          "/diagnosis/results",
        ],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/", "/llms.txt", "/ingredients/", "/products/"],
        disallow: [
          "/api/",
          "/_next/",
          "/studio/",
          "/mypage/",
          "/auth/",
          "/login",
          "/favorites",
          "/diagnosis/history",
          "/diagnosis/results",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
