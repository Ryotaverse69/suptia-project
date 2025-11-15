/**
 * Safety Warning Badge Component
 *
 * Phase 2.7-B: 安全性統合（ULチェック）
 * - UL超過時の警告バッジ表示
 * - 過剰摂取・不足の警告表示
 * - 安全性レベルに応じた色分け
 */

import React from "react";
import type { BadgeDecision } from "@/lib/safety-integrated-badges";

interface SafetyWarningBadgeProps {
  /** バッジ判定結果 */
  decision: BadgeDecision;
  /** コンパクト表示（アイコンのみ） */
  compact?: boolean;
  /** カスタムクラス名 */
  className?: string;
}

export function SafetyWarningBadge({
  decision,
  compact = false,
  className = "",
}: SafetyWarningBadgeProps) {
  if (!decision.hasWarning) {
    // 警告なしの場合は通常のバッジ表示
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColorClass(decision.badge)} ${className}`}
      >
        {decision.badge !== "none" && decision.badge}
      </span>
    );
  }

  const warningColor = getWarningColorClass(
    decision.warningDetails?.severity || "low",
  );
  const icon = getWarningIcon(decision.warningDetails?.type || "excessive");

  if (compact) {
    return (
      <span
        className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${warningColor} ${className}`}
        title={decision.warningDetails?.recommendation}
      >
        <span className="text-sm">{icon}</span>
      </span>
    );
  }

  return (
    <div className={`rounded-lg border p-3 ${warningColor} ${className}`}>
      <div className="flex items-start gap-2">
        <span className="text-lg flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {getWarningTitle(decision.warningDetails?.type || "excessive")}
          </p>
          {decision.warningDetails?.recommendation && (
            <p className="mt-1 text-xs text-gray-700">
              {decision.warningDetails.recommendation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function getBadgeColorClass(badge: BadgeDecision["badge"]): string {
  const colors: Record<BadgeDecision["badge"], string> = {
    S: "bg-purple-100 text-purple-800",
    A: "bg-blue-100 text-blue-800",
    B: "bg-green-100 text-green-800",
    C: "bg-yellow-100 text-yellow-800",
    warning: "bg-red-100 text-red-800",
    none: "bg-gray-100 text-gray-800",
  };
  return colors[badge];
}

function getWarningColorClass(severity: "high" | "medium" | "low"): string {
  const colors = {
    high: "bg-red-50 border-red-200",
    medium: "bg-orange-50 border-orange-200",
    low: "bg-yellow-50 border-yellow-200",
  };
  return colors[severity];
}

function getWarningIcon(
  type: "ul_exceeded" | "excessive" | "deficiency",
): string {
  const icons = {
    ul_exceeded: "⚠️",
    excessive: "⚡",
    deficiency: "📉",
  };
  return icons[type];
}

function getWarningTitle(
  type: "ul_exceeded" | "excessive" | "deficiency",
): string {
  const titles = {
    ul_exceeded: "安全上限超過",
    excessive: "過剰摂取注意",
    deficiency: "不足の可能性",
  };
  return titles[type];
}
