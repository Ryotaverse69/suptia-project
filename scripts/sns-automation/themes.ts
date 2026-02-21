// テーマ設定（フォロワー増加×ブランディング特化）
export type ThemeType =
  | 'ingredient' // ホットテイク（成分データで業界を斬る）
  | 'product' // 商品紹介（レガシー、自動では使わない）
  | 'cospa' // データで暴く（コスパの衝撃事実）
  | 'versus' // どっち派？（参加型エンゲージメント）
  | 'ranking' // サプティアの裏側（AI×データの舞台裏）
  | 'caution'; // 知らないとヤバい（業界が言わない真実）

export interface ThemeConfig {
  type: ThemeType;
  label: string;
  emoji: string;
  description: string;
  weight: number; // 出現確率（合計100）
}

// テーマ定義（フォロワー増加・ブランド構築に最適化）
// 「商品紹介」は宣伝臭が強くフォロワー増加に逆効果のため除外
export const THEMES: ThemeConfig[] = [
  { type: 'ingredient', label: 'ホットテイク', emoji: '🔥', description: '業界の常識をぶった斬る', weight: 30 },
  { type: 'versus', label: 'どっち派？', emoji: '💬', description: 'フォロワー参加型の比較', weight: 25 },
  { type: 'cospa', label: 'データで暴く', emoji: '📊', description: '476商品分析の衝撃事実', weight: 20 },
  { type: 'caution', label: '知らないとヤバい', emoji: '⚠️', description: '業界が言わない不都合な真実', weight: 15 },
  { type: 'ranking', label: 'サプティアの裏側', emoji: '🔬', description: 'AI×データ分析の舞台裏', weight: 10 },
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
