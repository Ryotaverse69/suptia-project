---
name: apple-intelligence-glow
description: Apple Intelligence風の虹色グローエフェクト（linear-gradient + CSSアニメーション）をWeb/React/Tailwind CSSで実装。このスキルは以下の場合に使用: (1) 入力フィールドのフォーカス時グロー、(2) ボタンホバー時のレインボーボーダー、(3) カードの装飾ボーダー、(4) AIチャットUIの境界線エフェクト。globals.cssでの実装をサポート。
---

# Apple Intelligence Glow Effect

Apple Intelligence / Siri風の虹色グローエフェクトをCSS linear-gradientとキーフレームアニメーションで実装するガイド。

## 技術概要

**重要**: 疑似要素（::before）ではなく、実際のdiv要素（.glow-layer）を使用してz-index問題を回避する。

### コアコンセプト

1. **実際のdiv要素** - glow-layerを使用（::beforeは避ける）
2. **常時表示のglow-layer** - 通常時は青、ホバー時は虹色
3. **linear-gradient** - 水平方向のグラデーション（90deg）
4. **background-size: 300% 100%** - グラデーションを3倍幅にして移動の余地を確保
5. **rainbow-shift** - background-positionをアニメーションしてスライド効果
6. **レイアウトシフト防止** - margin/padding補正で総サイズを一定に保つ

## カラーパレット

```typescript
const GLOW_COLORS = [
  "#BC82F3", // purple
  "#F5B9EA", // pink
  "#8D9FFF", // blue
  "#FF6778", // coral
  "#FFBA71", // orange
  "#C686FF", // violet
];

// 通常時の青
const DEFAULT_BLUE = "#007AFF";

// RGB値（box-shadow用）
const GLOW_COLORS_RGB = {
  purple: "188, 130, 243",
  blue: "141, 159, 255",
};
```

## HTML構造（重要）

```html
<!-- glow-wrapperの中にglow-layerとglow-button-innerを配置 -->
<div class="glow-wrapper glow-active">
  <div class="glow-layer"></div>
  <div class="glow-button-inner">
    <!-- ボタンコンテンツ -->
  </div>
</div>
```

**ポイント**:

- `glow-layer`は実際のdiv要素（z-index: 0）
- `glow-button-inner`はその上に配置（z-index: 1）
- `glow-active`クラスでホバー状態を制御

## 基本実装（globals.css）

### ボタン用グローエフェクト

```css
/* ========================================
   Apple Intelligence風 虹色グローエフェクト
   実際のdiv要素を使用してz-index問題を回避
   ======================================== */

.glow-wrapper {
  position: relative;
  padding: 2px;
  margin: 1px;
  border-radius: 9999px;
  transition:
    padding 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    margin 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glow-wrapper.glow-active {
  padding: 3px;
  margin: 0;
}

/* グローレイヤー（実際のdiv要素） */
.glow-layer {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: #007aff;
  z-index: 0;
  pointer-events: none;
  transition:
    background 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.glow-wrapper.glow-active .glow-layer {
  background: linear-gradient(
    90deg,
    #bc82f3,
    #f5b9ea,
    #8d9fff,
    #ff6778,
    #ffba71,
    #c686ff,
    #bc82f3
  );
  background-size: 300% 100%;
  animation: rainbow-shift 4s ease infinite;
  box-shadow:
    0 0 8px rgba(188, 130, 243, 0.5),
    0 0 16px rgba(141, 159, 255, 0.3);
}

@keyframes rainbow-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* ボタン用内側コンテナ */
.glow-button-inner {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 28px;
  border-radius: 9999px;
  font-weight: 600;
  min-height: 52px;
  font-size: 16px;
  background-color: #ffffff;
  border: none;
  color: #007aff;
  z-index: 1;
  transition: color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.glow-wrapper.glow-active .glow-button-inner {
  color: #1d1d1f;
}

/* 小さいボタン用 */
.glow-button-inner-sm {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 9999px;
  min-height: 44px;
  background-color: #ffffff;
  border: none;
  color: #007aff;
  z-index: 1;
  transition: color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (min-width: 640px) {
  .glow-button-inner-sm {
    padding: 12px 24px;
  }
}

.glow-wrapper.glow-active .glow-button-inner-sm {
  color: #1d1d1f;
}
```

## React実装例

```tsx
"use client";
import { useState } from "react";

export function GlowButton({ children }: { children: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`glow-wrapper ${isHovered ? "glow-active" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* グローレイヤー（実際のdiv要素） */}
      <div className="glow-layer" />
      {/* ボタン本体 */}
      <div className="glow-button-inner">{children}</div>
    </div>
  );
}
```

## 入力フィールド用（styled-jsx）

入力フィールドには従来の::before疑似要素アプローチも使用可能（内部要素が単純なため）。

```tsx
// ChatInput.tsxを参照
```

## アニメーション設定値

| プロパティ             | 通常時  | ホバー時        | 説明                       |
| ---------------------- | ------- | --------------- | -------------------------- |
| padding                | 2px     | 3px             | ボーダー幅                 |
| margin                 | 1px     | 0               | レイアウトシフト補正       |
| glow-layer background  | #007AFF | linear-gradient | 青→虹色                    |
| box-shadow             | none    | 8px/16px blur   | グロー効果                 |
| rainbow-shift duration | -       | 4s              | グラデーションスライド周期 |

## box-shadow設定

```css
box-shadow:
  0 0 8px rgba(188, 130, 243, 0.5),
  /* purple - 近距離 */ 0 0 16px rgba(141, 159, 255, 0.3); /* blue - 遠距離 */
```

## 重要なポイント

### 1. z-index問題の回避

**NG**: ::before疑似要素（z-index: -1が親要素に隠れる）

```css
/* 避けるべき */
.wrapper::before {
  z-index: -1; /* 親のstacking contextに隠れる */
}
```

**OK**: 実際のdiv要素

```css
/* 推奨 */
.glow-layer {
  z-index: 0;
}
.glow-button-inner {
  z-index: 1;
}
```

### 2. レイアウトシフト防止

padding変化による要素サイズ変化をmarginで補正:

- 通常: padding 2px + margin 1px = 3px
- ホバー: padding 3px + margin 0 = 3px

### 3. styled-jsx非対応の回避

styled-jsxは`motion.div`などのカスタムコンポーネントには適用されない。
globals.cssでグローバルクラスを定義して使用する。

## 詳細ガイド

| トピック           | ファイル                                                   |
| ------------------ | ---------------------------------------------------------- |
| グローパターン集   | [references/glow-patterns.md](references/glow-patterns.md) |
| アニメーション実装 | [references/animations.md](references/animations.md)       |

## チェックリスト

- [x] 実際のdiv要素（.glow-layer）を使用
- [x] glow-layerは常時表示（通常時は青、ホバー時は虹色）
- [x] z-index: glow-layer=0, button-inner=1
- [x] padding/margin補正でレイアウトシフト防止
- [x] border: noneで内側ボタンのボーダーを削除
- [x] rainbow-shiftでbackground-positionをアニメーション
- [x] box-shadowでホバー時のグロー効果
- [x] cubic-bezier(0.4, 0, 0.2, 1)でApple風イージング
