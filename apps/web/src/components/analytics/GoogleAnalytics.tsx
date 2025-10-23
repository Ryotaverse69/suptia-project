"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Google Analytics 4 コンポーネント
 *
 * 機能:
 * - ページビュー自動トラッキング
 * - ルート変更時のイベント送信
 * - プライバシー準拠（IP匿名化、Cookie設定）
 *
 * 使用方法:
 * layout.tsx の <body> 内に配置
 */
export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ページビュートラッキング（ルート変更時）
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const url = pathname + searchParams.toString();

    // gtag が存在する場合のみ実行
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: url,
        anonymize_ip: true, // IP匿名化（プライバシー保護）
        cookie_flags: "SameSite=None;Secure", // Cookie設定
      });
    }
  }, [pathname, searchParams]);

  // GA_MEASUREMENT_IDが設定されていない場合は何も表示しない
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      {/* Google Analytics Global Site Tag (gtag.js) */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure'
            });
          `,
        }}
      />
    </>
  );
}

// TypeScript型定義（gtag用）
declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js" | "set",
      targetId: string,
      config?: Record<string, unknown>,
    ) => void;
    dataLayer: unknown[];
  }
}
