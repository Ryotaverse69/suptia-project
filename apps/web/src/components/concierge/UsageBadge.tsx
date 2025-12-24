/**
 * AIコンシェルジュ 利用状況バッジ
 *
 * v2.2.0 - Apple HIG準拠デザイン
 */

"use client";

import { MessageCircle, Sparkles, Crown, Infinity } from "lucide-react";
import { cn } from "@/lib/utils";
import { systemColors, appleWebColors } from "@/lib/design-system";

interface UsageBadgeProps {
  remaining: number | null;
  limit: number | null;
  plan: string;
  className?: string;
}

export function UsageBadge({
  remaining,
  limit,
  plan,
  className,
}: UsageBadgeProps) {
  const isUnlimited = remaining === null || limit === null;
  const isLow = !isUnlimited && remaining <= 3;
  const isEmpty = !isUnlimited && remaining <= 0;

  const getPlanConfig = () => {
    switch (plan) {
      case "admin":
        return {
          icon: Crown,
          label: "Admin",
          color: systemColors.red,
          bgColor: `${systemColors.red}15`,
        };
      case "pro_safety":
        return {
          icon: Crown,
          label: "Pro+",
          color: systemColors.purple,
          bgColor: `${systemColors.purple}15`,
        };
      case "pro":
        return {
          icon: Sparkles,
          label: "Pro",
          color: systemColors.blue,
          bgColor: `${systemColors.blue}15`,
        };
      case "free":
        return {
          icon: MessageCircle,
          label: "Free",
          color: systemColors.green,
          bgColor: `${systemColors.green}15`,
        };
      default:
        return {
          icon: MessageCircle,
          label: "Guest",
          color: systemColors.gray[4],
          bgColor: appleWebColors.sectionBackground,
        };
    }
  };

  const config = getPlanConfig();
  const Icon = config.icon;

  // 残り回数に応じた色
  const getUsageColor = () => {
    if (isEmpty) return systemColors.red;
    if (isLow) return systemColors.orange;
    return appleWebColors.textSecondary;
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px]",
        className,
      )}
      style={{
        backgroundColor: config.bgColor,
      }}
    >
      {/* プランアイコン + ラベル */}
      <Icon size={14} style={{ color: config.color }} />
      <span className="font-semibold" style={{ color: config.color }}>
        {config.label}
      </span>

      {/* セパレーター */}
      <span style={{ color: appleWebColors.borderSubtle }}>·</span>

      {/* 残り回数 */}
      {isUnlimited ? (
        <span
          className="flex items-center gap-0.5"
          style={{ color: appleWebColors.textSecondary }}
        >
          <Infinity size={12} />
        </span>
      ) : (
        <span style={{ color: getUsageColor() }}>
          <span className="font-semibold">{remaining}</span>
          <span className="opacity-70">/{limit}</span>
        </span>
      )}
    </div>
  );
}
