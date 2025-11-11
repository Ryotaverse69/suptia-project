/**
 * ランク変更履歴トラッキングシステム
 *
 * ランクの変更を追跡し、不正な変更を検出
 */

import type { TierRank } from "./tier-colors";

/**
 * ランク変更履歴
 */
export interface RankChangeHistory {
  productId: string;
  productName: string;
  timestamp: string;
  changes: RankChange[];
  source: "manual" | "auto-calculation" | "sync" | "fix";
  userId?: string;
  reason?: string;
  confidence: number;
}

export interface RankChange {
  field: string;
  oldValue: TierRank;
  newValue: TierRank;
  delta: number; // ランクの変化量（S=5, A=4, B=3, C=2, D=1）
}

/**
 * ランク異常検出の結果
 */
export interface AnomalyDetectionResult {
  hasAnomaly: boolean;
  anomalies: RankAnomaly[];
  riskScore: number; // 0-100
  recommendation: string;
}

export interface RankAnomaly {
  type:
    | "SUDDEN_JUMP"
    | "FREQUENT_CHANGE"
    | "INCONSISTENT_PATTERN"
    | "MANUAL_OVERRIDE";
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  affectedField: string;
  evidence: any;
}

/**
 * ランクを数値に変換
 */
function rankToNumber(rank: TierRank): number {
  const mapping: Record<TierRank, number> = {
    "S+": 6,
    S: 5,
    A: 4,
    B: 3,
    C: 2,
    D: 1,
  };
  return mapping[rank] || 0;
}

/**
 * 数値をランクに変換
 */
function numberToRank(num: number): TierRank {
  if (num >= 6) return "S+";
  if (num >= 5) return "S";
  if (num >= 4) return "A";
  if (num >= 3) return "B";
  if (num >= 2) return "C";
  return "D";
}

/**
 * ランク変更を記録
 */
export function recordRankChange(
  productId: string,
  productName: string,
  oldRanks: Record<string, TierRank>,
  newRanks: Record<string, TierRank>,
  source: "manual" | "auto-calculation" | "sync" | "fix",
  options?: {
    userId?: string;
    reason?: string;
  },
): RankChangeHistory {
  const changes: RankChange[] = [];
  let totalDelta = 0;

  // 各フィールドの変更を検出
  for (const field of Object.keys(newRanks)) {
    if (oldRanks[field] !== newRanks[field]) {
      const oldNum = rankToNumber(oldRanks[field]);
      const newNum = rankToNumber(newRanks[field]);
      const delta = newNum - oldNum;

      changes.push({
        field,
        oldValue: oldRanks[field],
        newValue: newRanks[field],
        delta,
      });

      totalDelta += Math.abs(delta);
    }
  }

  // 信頼度を計算（変更の大きさに基づく）
  const confidence = calculateChangeConfidence(changes, source);

  return {
    productId,
    productName,
    timestamp: new Date().toISOString(),
    changes,
    source,
    userId: options?.userId,
    reason: options?.reason,
    confidence,
  };
}

/**
 * 変更の信頼度を計算
 */
function calculateChangeConfidence(
  changes: RankChange[],
  source: "manual" | "auto-calculation" | "sync" | "fix",
): number {
  let confidence = 1.0;

  // ソースによる基本信頼度
  const sourceConfidence: Record<string, number> = {
    "auto-calculation": 0.95,
    sync: 0.9,
    fix: 0.85,
    manual: 0.7,
  };
  confidence *= sourceConfidence[source] || 0.5;

  // 変更の大きさによる調整
  const totalDelta = changes.reduce((sum, c) => sum + Math.abs(c.delta), 0);
  if (totalDelta > 10) {
    confidence *= 0.7; // 大きな変更は信頼度を下げる
  } else if (totalDelta > 5) {
    confidence *= 0.85;
  }

  // 一度に多くのフィールドが変更される場合
  if (changes.length > 4) {
    confidence *= 0.9;
  }

  return Math.max(0.1, Math.min(1.0, confidence));
}

/**
 * ランク変更の異常を検出
 */
export function detectRankAnomalies(
  history: RankChangeHistory[],
  productId: string,
): AnomalyDetectionResult {
  const anomalies: RankAnomaly[] = [];
  const productHistory = history.filter((h) => h.productId === productId);

  if (productHistory.length < 2) {
    return {
      hasAnomaly: false,
      anomalies: [],
      riskScore: 0,
      recommendation: "履歴が不足しているため、異常検出できません",
    };
  }

  // 1. 急激な変化の検出（2ランク以上のジャンプ）
  for (const entry of productHistory) {
    for (const change of entry.changes) {
      if (Math.abs(change.delta) >= 2) {
        anomalies.push({
          type: "SUDDEN_JUMP",
          description: `${change.field}が${change.oldValue}から${change.newValue}へ急激に変化`,
          severity: Math.abs(change.delta) >= 3 ? "high" : "medium",
          affectedField: change.field,
          evidence: change,
        });
      }
    }
  }

  // 2. 頻繁な変更の検出（30日で3回以上）
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentChanges = productHistory.filter(
    (h) => new Date(h.timestamp) > thirtyDaysAgo,
  );

  if (recentChanges.length >= 3) {
    const fieldChangeCounts = new Map<string, number>();

    for (const entry of recentChanges) {
      for (const change of entry.changes) {
        fieldChangeCounts.set(
          change.field,
          (fieldChangeCounts.get(change.field) || 0) + 1,
        );
      }
    }

    fieldChangeCounts.forEach((count, field) => {
      if (count >= 3) {
        anomalies.push({
          type: "FREQUENT_CHANGE",
          description: `${field}が30日間で${count}回変更されています`,
          severity: count >= 5 ? "high" : "medium",
          affectedField: field,
          evidence: { changeCount: count, period: "30days" },
        });
      }
    });
  }

  // 3. 矛盾パターンの検出（例：価格Dでコスパ）
  const latestEntry = productHistory[productHistory.length - 1];
  if (latestEntry && latestEntry.changes.length > 0) {
    const currentRanks = latestEntry.changes.reduce(
      (acc, c) => {
        acc[c.field] = c.newValue;
        return acc;
      },
      {} as Record<string, TierRank>,
    );

    // 価格とコスパの矛盾
    if (
      currentRanks["priceRank"] === "D" &&
      currentRanks["costEffectivenessRank"] === "S"
    ) {
      anomalies.push({
        type: "INCONSISTENT_PATTERN",
        description: "価格Dランクでコスパランクは矛盾しています",
        severity: "high",
        affectedField: "tierRatings",
        evidence: { priceRank: "D", costEffectivenessRank: "S" },
      });
    }
  }

  // 4. 手動変更の検出
  const manualChanges = productHistory.filter((h) => h.source === "manual");
  if (manualChanges.length > 0) {
    for (const manual of manualChanges) {
      if (manual.confidence < 0.8) {
        anomalies.push({
          type: "MANUAL_OVERRIDE",
          description: `手動変更が検出されました（信頼度: ${(manual.confidence * 100).toFixed(0)}%）`,
          severity: manual.confidence < 0.5 ? "high" : "low",
          affectedField: "all",
          evidence: {
            timestamp: manual.timestamp,
            userId: manual.userId,
            reason: manual.reason,
          },
        });
      }
    }
  }

  // リスクスコアの計算
  let riskScore = 0;
  const severityScores = {
    critical: 40,
    high: 25,
    medium: 15,
    low: 5,
  };

  anomalies.forEach((anomaly) => {
    riskScore += severityScores[anomaly.severity] || 0;
  });

  riskScore = Math.min(100, riskScore);

  // 推奨アクション
  let recommendation = "";
  if (riskScore >= 80) {
    recommendation = "緊急：データの完全な再検証と手動確認が必要です";
  } else if (riskScore >= 60) {
    recommendation = "警告：ランクの再計算と整合性チェックを実行してください";
  } else if (riskScore >= 40) {
    recommendation = "注意：定期的な監視を継続してください";
  } else if (riskScore >= 20) {
    recommendation =
      "軽微な問題があります。次回の定期メンテナンスで対応してください";
  } else {
    recommendation = "正常：特に対応は不要です";
  }

  return {
    hasAnomaly: anomalies.length > 0,
    anomalies,
    riskScore,
    recommendation,
  };
}

/**
 * 変更履歴から統計を生成
 */
export function generateHistoryStatistics(history: RankChangeHistory[]): {
  totalChanges: number;
  changesBySource: Record<string, number>;
  mostChangedProducts: Array<{
    productId: string;
    productName: string;
    changeCount: number;
  }>;
  averageConfidence: number;
  anomalyRate: number;
} {
  const stats = {
    totalChanges: history.length,
    changesBySource: {} as Record<string, number>,
    productChangeCounts: new Map<string, { name: string; count: number }>(),
    totalConfidence: 0,
    anomalyCount: 0,
  };

  // ソース別の集計
  history.forEach((entry) => {
    stats.changesBySource[entry.source] =
      (stats.changesBySource[entry.source] || 0) + 1;

    // 商品別の集計
    const current = stats.productChangeCounts.get(entry.productId) || {
      name: entry.productName,
      count: 0,
    };
    current.count += entry.changes.length;
    stats.productChangeCounts.set(entry.productId, current);

    // 信頼度の合計
    stats.totalConfidence += entry.confidence;

    // 異常の可能性があるケース
    if (
      entry.confidence < 0.7 ||
      entry.changes.some((c) => Math.abs(c.delta) >= 2)
    ) {
      stats.anomalyCount++;
    }
  });

  // 最も変更が多い商品
  const mostChangedProducts = Array.from(stats.productChangeCounts.entries())
    .map(([productId, data]) => ({
      productId,
      productName: data.name,
      changeCount: data.count,
    }))
    .sort((a, b) => b.changeCount - a.changeCount)
    .slice(0, 10);

  return {
    totalChanges: stats.totalChanges,
    changesBySource: stats.changesBySource,
    mostChangedProducts,
    averageConfidence:
      stats.totalChanges > 0 ? stats.totalConfidence / stats.totalChanges : 0,
    anomalyRate:
      stats.totalChanges > 0 ? stats.anomalyCount / stats.totalChanges : 0,
  };
}

/**
 * 変更履歴をCSV形式でエクスポート
 */
export function exportHistoryToCSV(history: RankChangeHistory[]): string {
  const headers = [
    "Product ID",
    "Product Name",
    "Timestamp",
    "Field",
    "Old Value",
    "New Value",
    "Delta",
    "Source",
    "User ID",
    "Reason",
    "Confidence",
  ];

  const rows = [];

  for (const entry of history) {
    for (const change of entry.changes) {
      rows.push([
        entry.productId,
        entry.productName,
        entry.timestamp,
        change.field,
        change.oldValue,
        change.newValue,
        change.delta.toString(),
        entry.source,
        entry.userId || "",
        entry.reason || "",
        entry.confidence.toFixed(2),
      ]);
    }
  }

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((cell) =>
          typeof cell === "string" && cell.includes(",") ? `"${cell}"` : cell,
        )
        .join(","),
    ),
  ].join("\n");

  return csv;
}
