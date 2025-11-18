/**
 * 改善されたバッジ表示コンポーネント
 *
 * 理由の説明可能性を持つバッジ表示
 */

import React from "react";
import type {
  ComprehensiveBadgeResult,
  BadgeEvaluationResult,
} from "@/lib/badges-v2";
import { BADGE_DEFINITIONS } from "@/lib/badges-v2";

interface BadgeDisplayV2Props {
  result: ComprehensiveBadgeResult;
  showDetails?: boolean;
}

export function BadgeDisplayV2({
  result,
  showDetails = false,
}: BadgeDisplayV2Props) {
  // 5冠達成の特別表示
  if (result.isPerfectSupplement && result.badges && result.badges.length > 0) {
    return (
      <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-400 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🌟</span>
          <h3 className="text-lg font-bold text-yellow-900">
            完璧なサプリメント！
          </h3>
          <span className="text-2xl">🌟</span>
        </div>

        <div className="grid grid-cols-5 gap-2 mb-3">
          {result.badges.map((badge) => {
            const badgeInfo = BADGE_DEFINITIONS[badge];
            return (
              <div
                key={badge}
                className="bg-white rounded-lg p-2 text-center shadow-md"
              >
                <div className="text-2xl mb-1">{badgeInfo.icon}</div>
                <div className="text-xs font-medium">{badgeInfo.label}</div>
              </div>
            );
          })}
        </div>

        <div className="text-sm text-yellow-800">
          <p>バランス指数: {(result.harmonyIndex * 100).toFixed(0)}%</p>
          <p className="text-xs mt-1">
            全ての評価軸で最高レベルを達成し、バランスも優れています
          </p>
        </div>
      </div>
    );
  }

  // 通常のバッジ表示
  return (
    <div className="space-y-3">
      {/* 獲得バッジの表示 */}
      <div className="flex flex-wrap gap-2">
        {(result.badges || []).map((badge) => {
          const badgeInfo = BADGE_DEFINITIONS[badge];
          const evaluation = result.evaluations.find((e) => e.badge === badge);

          return (
            <div
              key={badge}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${badgeInfo.color} relative group cursor-help`}
              title={evaluation?.reason}
            >
              <span className="text-lg">{badgeInfo.icon}</span>
              <span className="text-sm font-medium">{badgeInfo.label}</span>

              {/* 信頼度が低い場合の警告 */}
              {evaluation && evaluation.confidence < 0.7 && (
                <span className="text-xs text-orange-500">⚠️</span>
              )}

              {/* ホバー時の詳細表示 */}
              {showDetails && (
                <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 min-w-[200px]">
                  <div className="font-semibold mb-1">
                    {badgeInfo.description}
                  </div>
                  <div>{evaluation?.reason}</div>
                  {evaluation?.score !== undefined && (
                    <div className="mt-1">
                      スコア:{" "}
                      {typeof evaluation.score === "number"
                        ? evaluation.score < 1
                          ? `${evaluation.score.toFixed(4)}`
                          : evaluation.score.toFixed(1)
                        : evaluation.score}
                    </div>
                  )}
                  <div className="mt-1">
                    信頼度: {((evaluation?.confidence || 0) * 100).toFixed(0)}%
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 詳細情報の表示 */}
      {showDetails && (
        <div className="space-y-2 text-sm">
          {/* 未獲得バッジの理由 */}
          {result.evaluations
            .filter((e) => !e.awarded)
            .map((evaluation) => (
              <BadgeEvaluationDetail
                key={evaluation.badge}
                evaluation={evaluation}
                isAwarded={false}
              />
            ))}

          {/* 警告メッセージ */}
          {result.warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h4 className="font-medium text-yellow-900 mb-1">注意事項</h4>
              <ul className="space-y-1">
                {result.warnings.map((warning, index) => (
                  <li
                    key={index}
                    className="text-yellow-800 text-xs flex items-start"
                  >
                    <span className="mr-1">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 総合信頼度 */}
          <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t">
            <span>総合信頼度</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    result.overallConfidence >= 0.8
                      ? "bg-green-500"
                      : result.overallConfidence >= 0.6
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${result.overallConfidence * 100}%` }}
                />
              </div>
              <span>{(result.overallConfidence * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 個別の評価詳細表示
 */
function BadgeEvaluationDetail({
  evaluation,
  isAwarded,
}: {
  evaluation: BadgeEvaluationResult;
  isAwarded: boolean;
}) {
  const badgeInfo = BADGE_DEFINITIONS[evaluation.badge];

  return (
    <div
      className={`rounded-lg p-3 ${isAwarded ? "bg-gray-50" : "bg-gray-100"}`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-lg opacity-50">{badgeInfo.icon}</span>
          <span
            className={`text-sm font-medium ${isAwarded ? "" : "text-gray-500"}`}
          >
            {badgeInfo.label}
          </span>
          {!isAwarded && (
            <span className="text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
              未獲得
            </span>
          )}
        </div>
        {evaluation.confidence < 1 && (
          <span className="text-xs text-gray-500">
            信頼度: {(evaluation.confidence * 100).toFixed(0)}%
          </span>
        )}
      </div>

      <p className="text-xs text-gray-600 mb-1">{evaluation.reason}</p>

      {evaluation.details && Object.keys(evaluation.details).length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            {Object.entries(evaluation.details).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-500">
                  {key.replace(/([A-Z])/g, " $1").toLowerCase()}:
                </span>
                <span className="font-medium">
                  {typeof value === "boolean"
                    ? value
                      ? "✓"
                      : "✗"
                    : typeof value === "number"
                      ? value.toFixed(2)
                      : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BadgeDisplayV2;
