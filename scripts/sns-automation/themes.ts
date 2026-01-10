// テーマ設定（重み付きランダム方式）
export type ThemeType =
  | 'ingredient' // 成分紹介
  | 'product' // 商品紹介
  | 'cospa' // コスパ比較
  | 'versus' // 成分 vs 成分
  | 'ranking' // ランキング
  | 'caution'; // 飲み合わせ注意

export interface ThemeConfig {
  type: ThemeType;
  label: string;
  emoji: string;
  description: string;
  weight: number; // 出現確率（合計100）
}

// テーマ定義（重み付き）
export const THEMES: ThemeConfig[] = [
  { type: 'ingredient', label: '成分紹介', emoji: '💊', description: '成分の基礎知識', weight: 25 },
  { type: 'product', label: '商品紹介', emoji: '🛒', description: '注目商品を紹介', weight: 20 },
  { type: 'cospa', label: 'コスパ比較', emoji: '💰', description: 'お得な商品を紹介', weight: 15 },
  { type: 'ranking', label: 'ランキング', emoji: '🏆', description: 'TOP3を発表', weight: 20 },
  { type: 'versus', label: '成分バトル', emoji: '🆚', description: '2つの成分を比較', weight: 15 },
  { type: 'caution', label: '注意喚起', emoji: '⚠️', description: '飲み合わせ・副作用', weight: 5 },
];

// 重み付きランダムでテーマを選択
export function selectRandomTheme(): ThemeConfig {
  const totalWeight = THEMES.reduce((sum, t) => sum + t.weight, 0);
  let random = Math.random() * totalWeight;

  for (const theme of THEMES) {
    random -= theme.weight;
    if (random <= 0) {
      return theme;
    }
  }

  // フォールバック
  return THEMES[0];
}

// テーマ一覧を表示用に取得
export function getThemeList(): string {
  return THEMES.map((t) => `${t.emoji} ${t.label}: ${t.weight}%`).join('\n');
}

// 特定のテーマを取得（テスト用）
export function getThemeByType(type: ThemeType): ThemeConfig {
  return THEMES.find((t) => t.type === type) || THEMES[0];
}
