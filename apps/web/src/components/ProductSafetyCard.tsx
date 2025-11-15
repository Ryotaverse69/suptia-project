/**
 * Product Safety Card Component
 *
 * Phase 2.7-B: 安全性統合（ULチェック）
 * - 商品全体の安全性スコア表示
 * - 警告のリスト表示
 * - 安全性グレード（S/A/B/C/D）表示
 */

import React from "react";
import type { BadgeDecision } from "@/lib/safety-integrated-badges";

interface ProductSafetyCardProps {
  /** 安全性スコア（0-100） */
  overallScore: number;
  /** 安全性グレード */
  grade: "S" | "A" | "B" | "C" | "D";
  /** 警告リスト */
  warnings: Array<{
    name: string;
    amount: number;
    warningType: "ul_exceeded" | "excessive" | "deficiency";
    severity: "high" | "medium" | "low";
    message: string;
  }>;
  /** 推奨事項 */
  recommendation: string;
  /** カスタムクラス名 */
  className?: string;
}

export function ProductSafetyCard({
  overallScore,
  grade,
  warnings,
  recommendation,
  className = "",
}: ProductSafetyCardProps) {
  const hasHighSeverityWarnings = warnings.some((w) => w.severity === "high");

  return (
    <div className={`bg-white rounded-lg border shadow-sm p-6 ${className}`}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">安全性評価</h3>
        <div className="flex items-center gap-3">
          <SafetyGradeBadge grade={grade} />
          <SafetyScoreDisplay score={overallScore} />
        </div>
      </div>

      {/* 推奨事項 */}
      <div
        className={`rounded-lg p-4 mb-4 ${hasHighSeverityWarnings ? "bg-red-50 border border-red-200" : "bg-blue-50 border border-blue-200"}`}
      >
        <p className="text-sm text-gray-900">{recommendation}</p>
      </div>

      {/* 警告リスト */}
      {warnings.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            注意が必要な成分 ({warnings.length}件)
          </h4>
          <div className="space-y-2">
            {warnings.map((warning, index) => (
              <WarningItem key={index} warning={warning} />
            ))}
          </div>
        </div>
      )}

      {warnings.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            すべての成分が安全範囲内です ✅
          </p>
        </div>
      )}
    </div>
  );
}

function SafetyGradeBadge({ grade }: { grade: "S" | "A" | "B" | "C" | "D" }) {
  const colors: Record<typeof grade, string> = {
    S: "bg-purple-100 text-purple-800 border-purple-300",
    A: "bg-blue-100 text-blue-800 border-blue-300",
    B: "bg-green-100 text-green-800 border-green-300",
    C: "bg-yellow-100 text-yellow-800 border-yellow-300",
    D: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${colors[grade]}`}
    >
      {grade}
    </span>
  );
}

function SafetyScoreDisplay({ score }: { score: number }) {
  const getColorClass = (score: number): string => {
    if (score >= 95) return "text-purple-600";
    if (score >= 85) return "text-blue-600";
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="text-right">
      <div className={`text-2xl font-bold ${getColorClass(score)}`}>
        {score.toFixed(0)}
        <span className="text-sm text-gray-500">/100</span>
      </div>
      <p className="text-xs text-gray-500">安全性スコア</p>
    </div>
  );
}

function WarningItem({
  warning,
}: {
  warning: {
    name: string;
    amount: number;
    warningType: "ul_exceeded" | "excessive" | "deficiency";
    severity: "high" | "medium" | "low";
    message: string;
  };
}) {
  const severityColors = {
    high: "border-red-300 bg-red-50",
    medium: "border-orange-300 bg-orange-50",
    low: "border-yellow-300 bg-yellow-50",
  };

  const severityLabels = {
    high: "重要",
    medium: "注意",
    low: "軽微",
  };

  const icons = {
    ul_exceeded: "⚠️",
    excessive: "⚡",
    deficiency: "📉",
  };

  return (
    <div
      className={`rounded-lg border p-3 ${severityColors[warning.severity]}`}
    >
      <div className="flex items-start gap-2">
        <span className="text-lg flex-shrink-0">
          {icons[warning.warningType]}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900">
              {warning.name}
            </span>
            <span className="text-xs text-gray-600">({warning.amount}mg)</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${getSeverityBadgeClass(warning.severity)}`}
            >
              {severityLabels[warning.severity]}
            </span>
          </div>
          <p className="text-xs text-gray-700">{warning.message}</p>
        </div>
      </div>
    </div>
  );
}

function getSeverityBadgeClass(severity: "high" | "medium" | "low"): string {
  const classes = {
    high: "bg-red-200 text-red-900",
    medium: "bg-orange-200 text-orange-900",
    low: "bg-yellow-200 text-yellow-900",
  };
  return classes[severity];
}

/**
 * Safety Progress Bar Component
 * 安全性スコアの視覚的表示
 */
export function SafetyProgressBar({
  score,
  className = "",
}: {
  score: number;
  className?: string;
}) {
  const getBarColor = (score: number): string => {
    if (score >= 95) return "bg-purple-500";
    if (score >= 85) return "bg-blue-500";
    if (score >= 70) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-700">安全性スコア</span>
        <span className="text-xs font-bold text-gray-900">
          {score.toFixed(0)}/100
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getBarColor(score)}`}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </div>
  );
}
