import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/runtimeConfig";

/**
 * robots.txt生成
 *
 * このファイルは /robots.txt エンドポイントを自動生成します
 * クローラーに対するアクセス制御とサイトマップの場所を指定
 */

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
          "/studio/",
          "*.json$",
          "*?*", // クエリパラメータ付きURL（重複コンテンツ回避）
        ],
      },
      {
        // Googleボット専用ルール
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/studio/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
