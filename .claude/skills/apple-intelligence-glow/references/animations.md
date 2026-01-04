# アニメーション実装ガイド

Apple Intelligence風グローエフェクトのCSSアニメーション実装詳細。

## コアアニメーション

### rainbow-shift（グラデーションスライド）

`background-position`をアニメーションしてグラデーションを左右にスライド。

```css
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
```

**設定値:**

- `duration`: 4s（推奨）
- `timing-function`: ease
- `iteration-count`: infinite
- `background-size`: 300% 100%（必須）

## トランジション設定

### フェードイン・アウト

```css
.glow-layer {
  transition:
    background 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### padding/marginトランジション

レイアウトシフトを防ぎながらボーダー幅を変化させる。

```css
.glow-wrapper {
  padding: 2px;
  margin: 1px;
  transition:
    padding 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    margin 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glow-wrapper.glow-active {
  padding: 3px;
  margin: 0;
}
```

**ポイント**: padding + margin = 3px で一定に保つ

## イージング関数

### Apple標準イージング

```css
/* Material Design準拠のイージング */
cubic-bezier(0.4, 0, 0.2, 1)  /* 標準 */
cubic-bezier(0.4, 0, 0.6, 1)  /* 減速 */
cubic-bezier(0, 0, 0.2, 1)    /* 加速 */
```

### 使い分け

| 用途                   | イージング                   |
| ---------------------- | ---------------------------- |
| 背景色・box-shadow変化 | cubic-bezier(0.4, 0, 0.2, 1) |
| グラデーションスライド | ease                         |
| padding/margin変化     | cubic-bezier(0.4, 0, 0.2, 1) |

## Reactでの実装

### useStateによる状態管理

```tsx
"use client";
import { useState } from "react";

export function GlowComponent() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      className={`glow-wrapper ${isActive ? "glow-active" : ""}`}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <div className="glow-layer" />
      <div className="glow-button-inner">{/* コンテンツ */}</div>
    </div>
  );
}
```

## 完全なCSS

globals.cssに追加する完全なCSS。

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

## Reduced Motion対応

アクセシビリティのため、ユーザー設定を尊重。

### CSS Media Query

```css
@media (prefers-reduced-motion: reduce) {
  .glow-layer {
    animation: none;
    transition:
      background 0.1s ease,
      box-shadow 0.1s ease;
  }

  .glow-wrapper {
    transition: none;
  }
}
```

## パフォーマンス最適化

### GPUアクセラレーション

```css
.glow-layer {
  will-change: background, box-shadow;
  transform: translateZ(0); /* GPU合成を強制 */
}
```

### contain プロパティ

```css
.glow-wrapper {
  contain: layout paint;
}
```

## アニメーション設定一覧

| アニメーション        | duration | timing                       | 用途                   |
| --------------------- | -------- | ---------------------------- | ---------------------- |
| rainbow-shift         | 4s       | ease                         | グラデーションスライド |
| background transition | 0.4s     | cubic-bezier(0.4, 0, 0.2, 1) | 青→虹色変化            |
| box-shadow transition | 0.4s     | cubic-bezier(0.4, 0, 0.2, 1) | グロー出現             |
| padding transition    | 0.3s     | cubic-bezier(0.4, 0, 0.2, 1) | ボーダー幅変化         |
| margin transition     | 0.3s     | cubic-bezier(0.4, 0, 0.2, 1) | レイアウト補正         |
| color transition      | 0.4s     | cubic-bezier(0.4, 0, 0.2, 1) | テキスト色変化         |
