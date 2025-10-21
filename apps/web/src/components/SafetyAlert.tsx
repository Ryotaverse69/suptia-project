"use client";

import {
  AlertTriangle,
  ShieldAlert,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import type { SafetyAlert, SafetyCheckResult } from "@/lib/safety-checker";
import { sortAlertsBySeverity } from "@/lib/safety-checker";

/**
 * 個別のアラートアイテム
 */
function AlertItem({ alert }: { alert: SafetyAlert }) {
  const { severity, ingredient, userCondition, message } = alert;

  // 重要度に応じたアイコンとスタイル
  const config = {
    critical: {
      icon: ShieldAlert,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-600",
      textColor: "text-red-900",
      badgeBg: "bg-red-100",
      badgeText: "text-red-700",
      label: "重大",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      iconColor: "text-amber-600",
      textColor: "text-amber-900",
      badgeBg: "bg-amber-100",
      badgeText: "text-amber-700",
      label: "警告",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      textColor: "text-blue-900",
      badgeBg: "bg-blue-100",
      badgeText: "text-blue-700",
      label: "情報",
    },
  };

  const {
    icon: Icon,
    bgColor,
    borderColor,
    iconColor,
    textColor,
    badgeBg,
    badgeText,
    label,
  } = config[severity];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${bgColor} ${borderColor}`}
      role="alert"
    >
      <Icon className={`${iconColor} flex-shrink-0 mt-0.5`} size={20} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded ${badgeBg} ${badgeText}`}
          >
            {label}
          </span>
          <span className={`text-sm font-medium ${textColor}`}>
            {ingredient}
          </span>
          <span className="text-sm text-gray-500">×</span>
          <span className="text-sm text-gray-700">{userCondition}</span>
        </div>
        <p className={`text-sm ${textColor} leading-relaxed`}>{message}</p>
      </div>
    </div>
  );
}

/**
 * 安全性チェック結果全体の表示
 */
interface SafetyAlertProps {
  result: SafetyCheckResult;
  className?: string;
}

export function SafetyAlertPanel({ result, className = "" }: SafetyAlertProps) {
  const [isExpanded, setIsExpanded] = useState(result.riskLevel !== "safe");

  const { isOverallSafe, alerts, riskLevel, summary } = result;

  // 安全な場合は何も表示しない（または簡潔な安全メッセージ）
  if (isOverallSafe) {
    return (
      <div
        className={`p-4 rounded-lg bg-green-50 border border-green-200 ${className}`}
      >
        <div className="flex items-center gap-2">
          <Info className="text-green-600" size={20} />
          <p className="text-sm text-green-900 font-medium">{summary}</p>
        </div>
      </div>
    );
  }

  // リスクレベルに応じた全体カラー
  const riskConfig = {
    "high-risk": {
      bgColor: "bg-red-50",
      borderColor: "border-red-300",
      headerBg: "bg-red-100",
      headerText: "text-red-900",
      icon: ShieldAlert,
      iconColor: "text-red-600",
    },
    "medium-risk": {
      bgColor: "bg-amber-50",
      borderColor: "border-amber-300",
      headerBg: "bg-amber-100",
      headerText: "text-amber-900",
      icon: AlertTriangle,
      iconColor: "text-amber-600",
    },
    "low-risk": {
      bgColor: "bg-blue-50",
      borderColor: "border-blue-300",
      headerBg: "bg-blue-100",
      headerText: "text-blue-900",
      icon: Info,
      iconColor: "text-blue-600",
    },
    safe: {
      bgColor: "bg-green-50",
      borderColor: "border-green-300",
      headerBg: "bg-green-100",
      headerText: "text-green-900",
      icon: Info,
      iconColor: "text-green-600",
    },
  };

  const config = riskConfig[riskLevel];
  const Icon = config.icon;
  const sortedAlerts = sortAlertsBySeverity(alerts);

  return (
    <div
      className={`rounded-xl border-2 ${config.borderColor} ${config.bgColor} overflow-hidden ${className}`}
    >
      {/* ヘッダー */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-5 py-4 flex items-center justify-between ${config.headerBg} hover:opacity-90 transition-opacity`}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <Icon className={config.iconColor} size={24} />
          <div className="text-left">
            <h3 className={`font-semibold ${config.headerText}`}>
              安全性に関する注意事項
            </h3>
            <p className={`text-sm ${config.headerText} opacity-80 mt-0.5`}>
              {summary}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className={config.headerText} size={20} />
        ) : (
          <ChevronDown className={config.headerText} size={20} />
        )}
      </button>

      {/* アラートリスト */}
      {isExpanded && (
        <div className="p-5 space-y-3">
          {sortedAlerts.map((alert, index) => (
            <AlertItem
              key={`${alert.ingredientSlug}-${alert.userConditionTag}-${index}`}
              alert={alert}
            />
          ))}

          {/* フッター：免責事項 */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600 leading-relaxed">
              ※
              この情報は一般的な注意事項であり、医学的なアドバイスではありません。サプリメントの使用を開始する前に、医師または薬剤師にご相談ください。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * コンパクト版（商品カード用）
 */
interface SafetyBadgeProps {
  result: SafetyCheckResult;
  className?: string;
}

export function SafetyBadge({ result, className = "" }: SafetyBadgeProps) {
  const { riskLevel, alerts } = result;

  // 安全な場合は表示しない
  if (riskLevel === "safe") {
    return null;
  }

  const config = {
    "high-risk": {
      bgColor: "bg-red-100",
      textColor: "text-red-700",
      icon: ShieldAlert,
      label: `注意 ${alerts.length}件`,
    },
    "medium-risk": {
      bgColor: "bg-amber-100",
      textColor: "text-amber-700",
      icon: AlertTriangle,
      label: `注意 ${alerts.length}件`,
    },
    "low-risk": {
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      icon: Info,
      label: `確認 ${alerts.length}件`,
    },
    safe: {
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      icon: Info,
      label: "安全",
    },
  };

  const { bgColor, textColor, icon: Icon, label } = config[riskLevel];

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${bgColor} ${textColor} text-sm font-medium ${className}`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </div>
  );
}
