/**
 * 薬機法準拠マークバッジ
 *
 * AI検索との差別化ポイント：
 * - AIは法的責任を取れないが、Suptiaは薬機法に準拠したコンテンツを提供
 * - ユーザーに安心感を与え、信頼性を高める
 */

"use client";

import { useState } from "react";
import { ShieldCheck, Info, X } from "lucide-react";

interface ComplianceBadgeProps {
  variant?: "default" | "compact" | "inline";
  className?: string;
  showTooltip?: boolean;
}

export function ComplianceBadge({
  variant = "default",
  className = "",
  showTooltip = true,
}: ComplianceBadgeProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  // コンパクト版（商品カード用）
  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <ShieldCheck size={14} className="text-green-600" />
        <span className="text-xs text-green-700 font-medium">薬機法準拠</span>
      </div>
    );
  }

  // インライン版（テキスト内用）
  if (variant === "inline") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium ${className}`}
      >
        <ShieldCheck size={12} />
        薬機法準拠
      </span>
    );
  }

  // デフォルト版（詳細ページ用）
  return (
    <div className={`relative ${className}`}>
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
        <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg">
          <ShieldCheck size={18} className="text-green-600" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-green-800">
            薬機法準拠コンテンツ
          </span>
          <span className="text-xs text-green-600">
            Pharmaceutical Law Compliant
          </span>
        </div>
        {showTooltip && (
          <button
            onClick={() => setIsTooltipOpen(!isTooltipOpen)}
            className="ml-2 p-1 hover:bg-green-100 rounded-full transition-colors"
            aria-label="詳細を表示"
          >
            <Info size={16} className="text-green-500" />
          </button>
        )}
      </div>

      {/* ツールチップ/モーダル */}
      {isTooltipOpen && (
        <>
          {/* オーバーレイ */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsTooltipOpen(false)}
          />
          {/* モーダル */}
          <div className="absolute left-0 top-full mt-2 z-50 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-green-50 px-4 py-3 flex items-center justify-between border-b border-green-100">
              <h3 className="font-semibold text-green-800 flex items-center gap-2">
                <ShieldCheck size={18} />
                薬機法準拠について
              </h3>
              <button
                onClick={() => setIsTooltipOpen(false)}
                className="p-1 hover:bg-green-100 rounded-full transition-colors"
              >
                <X size={18} className="text-green-600" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                サプティアのすべてのコンテンツは、日本の
                <strong>
                  薬機法（医薬品、医療機器等の品質、有効性及び安全性の確保等に関する法律）
                </strong>
                に準拠して作成されています。
              </p>

              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  AI検索との違い
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">✗</span>
                    <span>
                      AI検索は法的責任を取れず、薬機法違反表現をそのまま出力するリスクがあります
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>
                      サプティアは150以上のルールで自動チェックし、法令遵守を徹底しています
                    </span>
                  </li>
                </ul>
              </div>

              <div className="text-xs text-gray-500 border-t border-gray-100 pt-3">
                <p>
                  ※
                  本サイトの情報は医療アドバイスではありません。健康上の懸念がある場合は、医師または薬剤師にご相談ください。
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * フッター用の薬機法準拠バナー
 */
export function ComplianceBanner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-100 ${className}`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-green-600" />
            <span className="font-semibold text-green-800">
              薬機法準拠コンテンツ
            </span>
          </div>
          <span className="text-sm text-green-700">
            すべての情報は日本の法令に準拠して作成されています
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * ヘッダー/ナビ用の小さな信頼マーク
 */
export function TrustMark({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full ${className}`}
    >
      <ShieldCheck size={14} className="text-green-600" />
      <span className="text-xs font-medium text-green-700">信頼性認証済み</span>
    </div>
  );
}
