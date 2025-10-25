"use client";

import { useCookieConsent } from "@/contexts/CookieConsentContext";
import Link from "next/link";
import { X } from "lucide-react";

export function CookieConsentBanner() {
  const { showBanner, acceptAll, rejectAll, openSettings, closeBanner } =
    useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* メッセージ */}
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">Cookieの使用について</h3>
            <p className="text-sm text-muted-foreground">
              当サイトでは、サービスの改善とユーザー体験の向上のためにCookieを使用しています。
              <Link
                href="/legal/cookies"
                className="text-primary hover:underline ml-1"
              >
                詳細はこちら
              </Link>
            </p>
          </div>

          {/* アクション */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={openSettings}
              className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
            >
              設定をカスタマイズ
            </button>
            <button
              onClick={rejectAll}
              className="px-4 py-2 text-sm border rounded-lg hover:bg-muted transition-colors"
            >
              必須のみ許可
            </button>
            <button
              onClick={acceptAll}
              className="px-6 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              すべて許可
            </button>
          </div>

          {/* 閉じるボタン */}
          <button
            onClick={closeBanner}
            className="absolute top-4 right-4 md:relative md:top-0 md:right-0 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="バナーを閉じる"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
