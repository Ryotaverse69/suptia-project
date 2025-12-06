/**
 * Additives Safety Card Component
 *
 * 添加物の安全性チェック結果を表示するカード
 * - 総合評価（safe/caution/avoid）
 * - 検出された添加物のリスト
 * - 警告・推奨事項
 */

"use client";

import React, { useState } from "react";
import type {
  AdditiveCheckResult,
  AdditiveInfo,
  SafetyGrade,
} from "@/lib/additives";
import { ADDITIVE_CATEGORY_LABELS, SAFETY_GRADE_INFO } from "@/lib/additives";
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  ExternalLink,
} from "lucide-react";

interface AdditivesSafetyCardProps {
  /** 添加物チェック結果 */
  result: AdditiveCheckResult;
  /** 全原材料テキスト（展開表示用） */
  allIngredients?: string;
  /** カスタムクラス名 */
  className?: string;
}

export function AdditivesSafetyCard({
  result,
  allIngredients,
  className = "",
}: AdditivesSafetyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllIngredients, setShowAllIngredients] = useState(false);

  const { summary, detected, unknown, warnings, recommendations } = result;

  // グレードに応じたスタイル
  const gradeStyles: Record<
    SafetyGrade | "unknown",
    {
      bg: string;
      border: string;
      icon: React.ReactNode;
      label: string;
    }
  > = {
    safe: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      label: "添加物は安全",
    },
    caution: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
      label: "注意が必要な添加物あり",
    },
    avoid: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      label: "回避推奨の添加物あり",
    },
    unknown: {
      bg: "bg-gray-50",
      border: "border-gray-200",
      icon: <Info className="w-5 h-5 text-gray-600" />,
      label: "添加物情報なし",
    },
  };

  const currentStyle = gradeStyles[summary.overallGrade];

  // 検出数がゼロの場合
  if (detected.length === 0 && unknown.length === 0) {
    return (
      <div
        className={`bg-gray-50 rounded-lg border border-gray-200 p-4 ${className}`}
      >
        <div className="flex items-center gap-2 text-gray-600">
          <Info className="w-5 h-5" />
          <span className="text-sm">原材料データがありません</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border ${currentStyle.border} ${currentStyle.bg} ${className}`}
    >
      {/* ヘッダー */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-opacity-80 transition-colors"
      >
        <div className="flex items-center gap-3">
          {currentStyle.icon}
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">
              {currentStyle.label}
            </h3>
            <p className="text-sm text-gray-600">
              検出: {detected.length}件
              {summary.cautionCount > 0 && ` (注意${summary.cautionCount}件)`}
              {summary.avoidCount > 0 && ` (回避推奨${summary.avoidCount}件)`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {summary.scoreDeduction > 0 && (
            <span className="text-sm font-medium text-red-600">
              -{summary.scoreDeduction}点
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>

      {/* 展開コンテンツ */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-200 pt-4">
          {/* 警告 */}
          {warnings.length > 0 && (
            <div className="space-y-2">
              {warnings.map((warning, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-3 bg-white rounded-lg border border-red-200"
                >
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-800">{warning}</p>
                </div>
              ))}
            </div>
          )}

          {/* 検出された添加物リスト */}
          {detected.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                検出された添加物
              </h4>
              <div className="space-y-2">
                {detected.map(({ additive, matchedTerm }, i) => (
                  <AdditiveItem
                    key={i}
                    additive={additive}
                    matchedTerm={matchedTerm}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 未知の原材料 */}
          {unknown.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                未登録の原材料 ({unknown.length}件)
              </h4>
              <p className="text-xs text-gray-500">
                {unknown.slice(0, 5).join("、")}
                {unknown.length > 5 && ` 他${unknown.length - 5}件`}
              </p>
            </div>
          )}

          {/* 全原材料表示 */}
          {allIngredients && (
            <div>
              <button
                onClick={() => setShowAllIngredients(!showAllIngredients)}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                {showAllIngredients ? "全原材料を隠す" : "全原材料を表示"}
                {showAllIngredients ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {showAllIngredients && (
                <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 whitespace-pre-wrap">
                    {allIngredients}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 推奨事項 */}
          {recommendations.length > 0 && (
            <div className="pt-2 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                推奨事項
              </h4>
              <ul className="space-y-1">
                {recommendations.map((rec, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-600 flex items-start gap-2"
                  >
                    <span className="text-blue-500">💡</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 個別の添加物アイテム
 */
function AdditiveItem({
  additive,
  matchedTerm,
}: {
  additive: AdditiveInfo;
  matchedTerm: string;
}) {
  const [showDetails, setShowDetails] = useState(false);

  const gradeColors: Record<SafetyGrade, string> = {
    safe: "bg-green-100 text-green-800 border-green-300",
    caution: "bg-yellow-100 text-yellow-800 border-yellow-300",
    avoid: "bg-red-100 text-red-800 border-red-300",
  };

  const gradeLabels: Record<SafetyGrade, string> = {
    safe: "安全",
    caution: "注意",
    avoid: "回避推奨",
  };

  const gradeIcons: Record<SafetyGrade, string> = {
    safe: "✅",
    caution: "⚠️",
    avoid: "❌",
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{gradeIcons[additive.safetyGrade]}</span>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{additive.name}</span>
              {matchedTerm !== additive.name && (
                <span className="text-xs text-gray-500">({matchedTerm})</span>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {ADDITIVE_CATEGORY_LABELS[additive.category]}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full border ${gradeColors[additive.safetyGrade]}`}
          >
            {gradeLabels[additive.safetyGrade]}
          </span>
          {showDetails ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {showDetails && (
        <div className="px-3 pb-3 pt-0 space-y-2 border-t border-gray-100">
          {/* 用途 */}
          <div className="text-xs text-gray-600">
            <span className="font-medium">用途:</span>{" "}
            {additive.supplementPurpose}
          </div>

          {/* 懸念事項 */}
          {additive.concerns.length > 0 && (
            <div className="text-xs">
              <span className="font-medium text-gray-700">懸念事項:</span>
              <ul className="mt-1 space-y-1">
                {additive.concerns.map((concern, i) => (
                  <li
                    key={i}
                    className="text-yellow-700 flex items-start gap-1"
                  >
                    <span>•</span>
                    <span>{concern}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 禁忌 */}
          {additive.contraindications.length > 0 && (
            <div className="text-xs">
              <span className="font-medium text-gray-700">禁忌:</span>
              <ul className="mt-1 space-y-1">
                {additive.contraindications.map((contra, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-1 ${
                      contra.severity === "critical"
                        ? "text-red-700"
                        : contra.severity === "warning"
                          ? "text-orange-700"
                          : "text-gray-600"
                    }`}
                  >
                    <span>•</span>
                    <span>
                      <strong>{contra.condition}:</strong> {contra.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 判定理由 */}
          <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span className="font-medium">判定理由:</span>{" "}
            {additive.rationale.summary}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * コンパクト版（一覧表示用）
 */
export function AdditivesSafetyBadge({
  result,
  className = "",
}: {
  result: AdditiveCheckResult;
  className?: string;
}) {
  const { summary } = result;

  if (summary.overallGrade === "unknown") {
    return null;
  }

  const badgeConfig: Record<
    SafetyGrade,
    {
      bg: string;
      icon: React.ReactNode;
      label: string;
    }
  > = {
    safe: {
      bg: "bg-green-100 text-green-700 border-green-300",
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      label: "添加物",
    },
    caution: {
      bg: "bg-yellow-100 text-yellow-700 border-yellow-300",
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
      label: "添加物",
    },
    avoid: {
      bg: "bg-red-100 text-red-700 border-red-300",
      icon: <XCircle className="w-3.5 h-3.5" />,
      label: "添加物",
    },
  };

  const config = badgeConfig[summary.overallGrade];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${className}`}
      title={`検出${result.detected.length}件, 注意${summary.cautionCount}件, 回避推奨${summary.avoidCount}件`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}
