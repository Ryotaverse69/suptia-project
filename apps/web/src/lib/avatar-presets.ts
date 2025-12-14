/**
 * アバタープリセット定義
 * lucide-reactアイコンを使用した人間・動物・ロボット系アイコン
 */

export type AvatarType = "initial" | "preset" | "custom";

export interface AvatarPreset {
  id: string;
  icon: string; // lucide-react icon name
  label: string;
  gradient: [string, string];
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: "user",
    icon: "User",
    label: "人物",
    gradient: ["#007AFF", "#5AC8FA"],
  },
  {
    id: "smile",
    icon: "Smile",
    label: "スマイル",
    gradient: ["#FF9500", "#FFCC00"],
  },
  {
    id: "cat",
    icon: "Cat",
    label: "ネコ",
    gradient: ["#FF9F0A", "#FFD60A"],
  },
  {
    id: "dog",
    icon: "Dog",
    label: "イヌ",
    gradient: ["#8B4513", "#D2691E"],
  },
  {
    id: "bird",
    icon: "Bird",
    label: "鳥",
    gradient: ["#5AC8FA", "#64D2FF"],
  },
  {
    id: "fish",
    icon: "Fish",
    label: "魚",
    gradient: ["#007AFF", "#34C759"],
  },
  {
    id: "rabbit",
    icon: "Rabbit",
    label: "ウサギ",
    gradient: ["#FF6482", "#FF2D55"],
  },
  {
    id: "bot",
    icon: "Bot",
    label: "ロボット",
    gradient: ["#5856D6", "#AF52DE"],
  },
  {
    id: "ghost",
    icon: "Ghost",
    label: "ゴースト",
    gradient: ["#8E8E93", "#636366"],
  },
  {
    id: "baby",
    icon: "Baby",
    label: "赤ちゃん",
    gradient: ["#FF2D55", "#FF6482"],
  },
];

/**
 * プリセットIDからプリセット情報を取得
 */
export function getPresetById(id: string): AvatarPreset | undefined {
  return AVATAR_PRESETS.find((preset) => preset.id === id);
}

/**
 * デフォルトのグラデーション（イニシャル表示用）
 */
export const DEFAULT_AVATAR_GRADIENT: [string, string] = ["#5856D6", "#AF52DE"];
