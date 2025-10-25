/**
 * 価格履歴グラフコンポーネント
 * 複数ECサイトの価格推移を時系列で可視化
 */

"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PriceHistory {
  source: string;
  amount: number;
  recordedAt: string;
}

interface PriceHistoryChartProps {
  priceHistory?: PriceHistory[];
  className?: string;
}

type TimePeriod = "7d" | "30d" | "90d" | "all";

export function PriceHistoryChart({
  priceHistory,
  className = "",
}: PriceHistoryChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("30d");

  // ソース名を日本語に変換
  const getSourceName = (source: string) => {
    const sourceNames: Record<string, string> = {
      rakuten: "楽天市場",
      yahoo: "Yahoo!ショッピング",
      amazon: "Amazon",
      iherb: "iHerb",
    };
    return sourceNames[source] || source;
  };

  // ソースごとの色設定
  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      rakuten: "#bf0000", // 楽天レッド
      yahoo: "#8b00ff", // Yahoo紫
      amazon: "#ff9900", // Amazonオレンジ
      iherb: "#00a650", // iHerbグリーン
    };
    return colors[source] || "#6b7280";
  };

  // 期間フィルター処理
  const filteredData = useMemo(() => {
    if (!priceHistory) return [];

    const now = new Date();
    let cutoffDate = new Date();

    switch (selectedPeriod) {
      case "7d":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case "all":
        cutoffDate = new Date(0); // すべて
        break;
    }

    return priceHistory.filter(
      (item) => new Date(item.recordedAt) >= cutoffDate,
    );
  }, [priceHistory, selectedPeriod]);

  // チャート用データに変換
  const chartData = useMemo(() => {
    // 日付ごとにグループ化（ISO日付文字列をキーとして使用）
    const grouped = new Map<
      string,
      { date: string; timestamp: number; [key: string]: string | number }
    >();

    filteredData.forEach((item) => {
      const timestamp = new Date(item.recordedAt).getTime();
      const dateKey = new Date(item.recordedAt).toISOString().split("T")[0]; // YYYY-MM-DD
      const displayDate = new Date(item.recordedAt).toLocaleDateString(
        "ja-JP",
        {
          month: "short",
          day: "numeric",
        },
      );

      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, { date: displayDate, timestamp });
      }

      const entry = grouped.get(dateKey)!;
      entry[item.source] = item.amount;
    });

    return Array.from(grouped.values()).sort(
      (a, b) => a.timestamp - b.timestamp,
    );
  }, [filteredData]);

  // 表示するソース一覧を取得
  const sources = useMemo(() => {
    const uniqueSources = new Set(filteredData.map((item) => item.source));
    return Array.from(uniqueSources);
  }, [filteredData]);

  // 価格の範囲を計算
  const priceRange = useMemo(() => {
    const prices = filteredData.map((item) => item.amount);
    if (prices.length === 0) return { min: 0, max: 10000 };

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.1;

    return {
      min: Math.floor(min - padding),
      max: Math.ceil(max + padding),
    };
  }, [filteredData]);

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
        <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any) => (
          <p
            key={entry.dataKey}
            className="text-sm"
            style={{ color: entry.color }}
          >
            {getSourceName(entry.dataKey)}: ¥{entry.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  };

  // 価格履歴データがない場合は表示しない
  if (!priceHistory || priceHistory.length === 0) {
    return null;
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">📈 価格推移</h2>

        {/* 期間選択ボタン */}
        <div className="flex gap-2">
          {(["7d", "30d", "90d", "all"] as TimePeriod[]).map((period) => {
            const labels: Record<TimePeriod, string> = {
              "7d": "7日",
              "30d": "30日",
              "90d": "90日",
              all: "全期間",
            };

            return (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`
                  px-3 py-1 text-sm font-medium rounded-md transition-colors
                  ${
                    selectedPeriod === period
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                {labels[period]}
              </button>
            );
          })}
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>選択した期間のデータがありません</p>
        </div>
      ) : (
        <>
          {/* グラフ */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis
                domain={[priceRange.min, priceRange.max]}
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                tickFormatter={(value) => `¥${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => getSourceName(value)}
                wrapperStyle={{ fontSize: "14px" }}
              />

              {sources.map((source) => (
                <Line
                  key={source}
                  type="monotone"
                  dataKey={source}
                  stroke={getSourceColor(source)}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name={source}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>

          {/* 統計情報 */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">最安値</p>
                <p className="text-lg font-bold text-green-600">
                  ¥
                  {Math.min(
                    ...filteredData.map((d) => d.amount),
                  ).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">最高値</p>
                <p className="text-lg font-bold text-red-600">
                  ¥
                  {Math.max(
                    ...filteredData.map((d) => d.amount),
                  ).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">平均価格</p>
                <p className="text-lg font-bold text-blue-600">
                  ¥
                  {Math.round(
                    filteredData.reduce((sum, d) => sum + d.amount, 0) /
                      filteredData.length,
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              💡
              価格は定期的に更新されています。購入前に最新の価格を確認してください。
            </p>
          </div>
        </>
      )}
    </div>
  );
}
