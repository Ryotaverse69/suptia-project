"use client";

import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { CookieConsent } from "@/lib/cookie-consent";

export function CookieSettingsModal() {
  const { showSettings, consent, updateConsent, closeSettings } =
    useCookieConsent();
  const [localConsent, setLocalConsent] = useState<CookieConsent>(consent);

  useEffect(() => {
    setLocalConsent(consent);
  }, [consent, showSettings]);

  if (!showSettings) return null;

  const handleSave = () => {
    updateConsent(localConsent);
  };

  const toggleConsent = (key: keyof CookieConsent) => {
    if (key === "necessary") return; // 必須Cookieは変更不可
    setLocalConsent((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeSettings}
      />

      {/* モーダル */}
      <div className="relative bg-background rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Cookie設定</h2>
          <button
            onClick={closeSettings}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="閉じる"
          >
            <X size={24} />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="px-6 py-6 space-y-6">
          <p className="text-sm text-muted-foreground">
            以下の設定から、許可するCookieの種類を選択できます。必須Cookieは、サイトの基本機能に必要なため常に有効です。
          </p>

          {/* 必須Cookie */}
          <div className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">必須Cookie</h3>
                <p className="text-sm text-muted-foreground">
                  サイトの基本機能に必要不可欠なCookie。無効にできません。
                </p>
              </div>
              <div className="ml-4">
                <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              <strong>用途:</strong>{" "}
              セッション管理、セキュリティ、Cookie同意設定の記憶
            </div>
          </div>

          {/* 分析Cookie */}
          <div className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">分析Cookie</h3>
                <p className="text-sm text-muted-foreground">
                  サイトの使用状況を分析し、サービス改善に役立てるためのCookie。
                </p>
              </div>
              <div className="ml-4">
                <button
                  onClick={() => toggleConsent("analytics")}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                    localConsent.analytics
                      ? "bg-primary justify-end"
                      : "bg-gray-300 justify-start"
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full mx-1" />
                </button>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              <strong>用途:</strong> Google
              Analytics、ページビュー計測、ユーザー行動分析
            </div>
          </div>

          {/* 広告Cookie */}
          <div className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">広告Cookie</h3>
                <p className="text-sm text-muted-foreground">
                  アフィリエイト成果の測定に使用するCookie。
                </p>
              </div>
              <div className="ml-4">
                <button
                  onClick={() => toggleConsent("advertising")}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                    localConsent.advertising
                      ? "bg-primary justify-end"
                      : "bg-gray-300 justify-start"
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full mx-1" />
                </button>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              <strong>用途:</strong>{" "}
              Amazonアソシエイト、楽天アフィリエイト、コンバージョン計測
            </div>
          </div>

          {/* 機能Cookie */}
          <div className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">機能Cookie</h3>
                <p className="text-sm text-muted-foreground">
                  ユーザー体験を向上させるためのCookie。
                </p>
              </div>
              <div className="ml-4">
                <button
                  onClick={() => toggleConsent("functional")}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                    localConsent.functional
                      ? "bg-primary justify-end"
                      : "bg-gray-300 justify-start"
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full mx-1" />
                </button>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              <strong>用途:</strong>{" "}
              表示設定、検索履歴、お気に入り、パーソナライゼーション
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="sticky bottom-0 bg-background border-t px-6 py-4 flex items-center justify-between">
          <button
            onClick={closeSettings}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2"
          >
            <Check size={18} />
            設定を保存
          </button>
        </div>
      </div>
    </div>
  );
}
