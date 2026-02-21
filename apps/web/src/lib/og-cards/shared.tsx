/**
 * OGPカード生成 - 共通パーツ
 *
 * Satori (ImageResponse) はCSSサブセットのみ対応。
 * flexbox, テキスト, 背景色, border, borderRadius, shadow のみ使用。
 */

// ブランドカラー
export const ogColors = {
  mint: "#00C7BE",
  mintLight: "#E0FAF8",
  blue: "#007AFF",
  blueLight: "#E3F2FF",
  cream: "#FFF8F0",
  purple: "#AF52DE",
  pink: "#FF2D55",
  green: "#34C759",
  orange: "#FF9500",
  red: "#FF3B30",
  yellow: "#FFCC00",
  gray: "#8E8E93",
  textPrimary: "#1d1d1f",
  textSecondary: "#86868b",
  background: "#fbfbfd",
  cardBackground: "#ffffff",
  border: "#e5e5ea",
} as const;

// フォーマット別サイズ
export const ogFormats = {
  ogp: { width: 1200, height: 630 },
  story: { width: 1080, height: 1920 },
  square: { width: 1080, height: 1080 },
} as const;

export type OgFormat = keyof typeof ogFormats;

// Tierランクの色マッピング
export function tierColor(rank: string): string {
  switch (rank) {
    case "S+":
      return "#FFD700";
    case "S":
      return "#FF6B35";
    case "A":
      return "#007AFF";
    case "B":
      return "#34C759";
    case "C":
      return "#8E8E93";
    case "D":
      return "#C7C7CC";
    default:
      return "#8E8E93";
  }
}

// 5柱ラベル
export const pillarLabels = {
  price: "価格",
  content: "成分量",
  costEffectiveness: "コスパ",
  evidence: "エビデンス",
  safety: "安全性",
} as const;

// Tierランクを数値スコア(0-100)に変換（バーチャート用）
export function tierToScore(rank: string): number {
  switch (rank) {
    case "S+":
      return 100;
    case "S":
      return 90;
    case "A":
      return 75;
    case "B":
      return 55;
    case "C":
      return 35;
    case "D":
      return 15;
    default:
      return 0;
  }
}
