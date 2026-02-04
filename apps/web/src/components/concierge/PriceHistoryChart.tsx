/**
 * 価格履歴チャート
 *
 * プラン別に表示期間を制限した価格推移グラフ
 */

"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { appleWebColors, systemColors } from "@/lib/design-system";
import type { UserPlan } from "@/contexts/UserProfileContext";

interface PriceHistoryEntry {
  source: string;
  amount: number;
  recordedAt: string;
}

interface PriceHistoryChartProps {
  priceHistory: PriceHistoryEntry[];
  currentPrice: number;
  productName: string;
  userPlan: UserPlan | "guest";
  className?: string;
}

export function PriceHistoryChart({
  priceHistory,
  currentPrice,
  productName,
  userPlan,
  className,
}: PriceHistoryChartProps) {
  // プラン別の表示期間制限
  const daysLimit = useMemo(() => {
    switch (userPlan) {
      case "guest":
      case "free":
        return 30; // 30日間
      case "pro":
        return 365; // 1年間
      case "pro_safety":
      case "admin":
        return null; // 無制限
      default:
        return 30;
    }
  }, [userPlan]);

  // データフィルタリング
  const filteredData = useMemo(() => {
    if (!priceHistory || priceHistory.length === 0) return [];

    const now = new Date();
    const cutoffDate = daysLimit
      ? new Date(now.getTime() - daysLimit * 24 * 60 * 60 * 1000)
      : new Date(0);

    return priceHistory
      .filter((entry) => new Date(entry.recordedAt) >= cutoffDate)
      .map((entry) => ({
        date: new Date(entry.recordedAt).toLocaleDateString("ja-JP", {
          month: "short",
          day: "numeric",
        }),
        price: entry.amount,
        fullDate: entry.recordedAt,
      }))
      .sort(
        (a, b) =>
          new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime(),
      );
  }, [priceHistory, daysLimit]);

  // 統計情報
  const stats = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        average: currentPrice,
        min: currentPrice,
        max: currentPrice,
        trend: "stable" as const,
        percentChange: 0,
      };
    }

    const prices = filteredData.map((d) => d.price);
    const average = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    const percentChange = ((currentPrice - average) / average) * 100;
    const trend =
      percentChange <= -10
        ? ("down" as const)
        : percentChange >= 10
          ? ("up" as const)
          : ("stable" as const);

    return { average, min, max, trend, percentChange };
  }, [filteredData, currentPrice]);

  if (filteredData.length < 2) {
    return (
      <div
        className={cn("p-4 rounded-2xl text-center", className)}
        style={{
          backgroundColor: appleWebColors.sectionBackground,
          border: `1px solid ${appleWebColors.borderSubtle}`,
        }}
      >
        <p
          className="text-[12px]"
          style={{ color: appleWebColors.textSecondary }}
        >
          価格履歴データが不足しています
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn("p-4 rounded-2xl", className)}
      style={{
        backgroundColor: appleWebColors.sectionBackground,
        border: `1px solid ${appleWebColors.borderSubtle}`,
      }}
    >
      {/* ヘッダー */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4
              className="text-[14px] font-semibold"
              style={{ color: appleWebColors.textPrimary }}
            >
              価格推移
            </h4>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{
                backgroundColor: `${systemColors.blue}15`,
                color: systemColors.blue,
              }}
            >
              {daysLimit ? `${daysLimit}日間` : "全期間"}
            </span>
          </div>
          <p
            className="text-[11px]"
            style={{ color: appleWebColors.textTertiary }}
          >
            {productName}
          </p>
        </div>

        {/* トレンド表示 */}
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-lg",
            stats.trend === "down" && "bg-green-100 dark:bg-green-900/20",
            stats.trend === "up" && "bg-red-100 dark:bg-red-900/20",
            stats.trend === "stable" && "bg-gray-100 dark:bg-gray-800",
          )}
        >
          {stats.trend === "down" ? (
            <TrendingDown className="w-3.5 h-3.5 text-green-600" />
          ) : stats.trend === "up" ? (
            <TrendingUp className="w-3.5 h-3.5 text-red-600" />
          ) : (
            <Minus className="w-3.5 h-3.5 text-gray-600" />
          )}
          <span
            className={cn(
              "text-[11px] font-medium",
              stats.trend === "down" && "text-green-600",
              stats.trend === "up" && "text-red-600",
              stats.trend === "stable" && "text-gray-600",
            )}
          >
            {stats.percentChange > 0 ? "+" : ""}
            {stats.percentChange.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* チャート */}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={filteredData}
          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={appleWebColors.borderSubtle}
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{
              fill: appleWebColors.textTertiary,
              fontSize: 10,
            }}
            stroke={appleWebColors.borderSubtle}
          />
          <YAxis
            tick={{
              fill: appleWebColors.textTertiary,
              fontSize: 10,
            }}
            stroke={appleWebColors.borderSubtle}
            width={50}
            tickFormatter={(value) => `¥${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: appleWebColors.sectionBackground,
              border: `1px solid ${appleWebColors.borderSubtle}`,
              borderRadius: "12px",
              fontSize: "12px",
            }}
            labelStyle={{
              color: appleWebColors.textPrimary,
              fontWeight: 600,
            }}
            formatter={(value: number) => [
              `¥${value.toLocaleString()}`,
              "価格",
            ]}
          />
          {/* 平均線 */}
          <ReferenceLine
            y={stats.average}
            stroke={systemColors.gray[4]}
            strokeDasharray="5 5"
            label={{
              value: "平均",
              position: "right",
              fill: appleWebColors.textTertiary,
              fontSize: 10,
            }}
          />
          {/* 価格ライン */}
          <Line
            type="monotone"
            dataKey="price"
            stroke={systemColors.blue}
            strokeWidth={2}
            dot={{
              fill: systemColors.blue,
              r: 3,
            }}
            activeDot={{
              r: 5,
              fill: systemColors.blue,
            }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* 統計サマリー */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div
          className="p-2 rounded-lg text-center"
          style={{ backgroundColor: `${systemColors.green}10` }}
        >
          <p
            className="text-[10px] mb-0.5"
            style={{ color: appleWebColors.textSecondary }}
          >
            最安値
          </p>
          <p
            className="text-[13px] font-bold"
            style={{ color: systemColors.green }}
          >
            ¥{stats.min.toLocaleString()}
          </p>
        </div>
        <div
          className="p-2 rounded-lg text-center"
          style={{ backgroundColor: `${systemColors.blue}10` }}
        >
          <p
            className="text-[10px] mb-0.5"
            style={{ color: appleWebColors.textSecondary }}
          >
            平均
          </p>
          <p
            className="text-[13px] font-bold"
            style={{ color: systemColors.blue }}
          >
            ¥{Math.round(stats.average).toLocaleString()}
          </p>
        </div>
        <div
          className="p-2 rounded-lg text-center"
          style={{ backgroundColor: `${systemColors.red}10` }}
        >
          <p
            className="text-[10px] mb-0.5"
            style={{ color: appleWebColors.textSecondary }}
          >
            最高値
          </p>
          <p
            className="text-[13px] font-bold"
            style={{ color: systemColors.red }}
          >
            ¥{stats.max.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 解説 */}
      <div className="mt-3">
        {stats.trend === "down" && (
          <p
            className="text-[11px] flex items-start gap-1.5"
            style={{ color: appleWebColors.textSecondary }}
          >
            <span>💡</span>
            <span>
              現在の価格は平均より約{Math.abs(Math.round(stats.percentChange))}
              %低い水準です。 お買い得のタイミングかもしれません。
            </span>
          </p>
        )}
        {stats.trend === "up" && (
          <p
            className="text-[11px] flex items-start gap-1.5"
            style={{ color: appleWebColors.textSecondary }}
          >
            <span>⚠️</span>
            <span>
              現在の価格は平均より約{Math.round(stats.percentChange)}
              %高い水準です。 値下がりを待つのも選択肢です。
            </span>
          </p>
        )}
        {stats.trend === "stable" && (
          <p
            className="text-[11px] flex items-start gap-1.5"
            style={{ color: appleWebColors.textSecondary }}
          >
            <span>📊</span>
            <span>価格は平均的な水準で安定しています。</span>
          </p>
        )}
      </div>

      {/* プラン別アップグレード促進 */}
      {(userPlan === "guest" || userPlan === "free") && (
        <div
          className="mt-3 p-2 rounded-lg"
          style={{
            backgroundColor: `${systemColors.blue}05`,
            border: `1px dashed ${systemColors.blue}40`,
          }}
        >
          <p
            className="text-[10px] text-center"
            style={{ color: appleWebColors.textSecondary }}
          >
            {userPlan === "guest"
              ? "ログインすると30日間の価格履歴を確認できます"
              : "Proプランなら1年間の価格履歴を確認できます"}
          </p>
        </div>
      )}
    </div>
  );
}
