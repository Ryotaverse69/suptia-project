# Liquid Glass デザインシステム

WWDC 2025で発表されたAppleの新しいデザイン言語。iOS 26、macOS Tahoe以降で採用。

## 概要

Liquid Glassは、リアルな物理ガラスの特性をシミュレートした半透明のUIマテリアル。背景を屈折・反射し、動きに応じてスペキュラハイライトが動的に変化する。

### 3つの主要レイヤー

1. **Highlight（ハイライト）** - 光の反射、動きに反応
2. **Shadow（シャドウ）** - 深さと分離を表現
3. **Illumination（イルミネーション）** - 柔軟なマテリアル特性

## Web実装（CSS）

### 基本的なLiquid Glass

```css
.liquid-glass {
  /* 背景 - 半透明白 */
  background: rgba(255, 255, 255, 0.15);

  /* ブラー + 彩度ブースト */
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);

  /* ボーダー - 光の反射を表現 */
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 24px;

  /* シャドウ - 深さを追加 */
  box-shadow:
    0 8px 32px rgba(31, 38, 135, 0.15),
    inset 0 2px 16px rgba(255, 255, 255, 0.2);
}
```

### 強化版（Pseudo要素使用）

```css
.liquid-glass-enhanced {
  position: relative;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
}

.liquid-glass-enhanced::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0.1) 100%
  );
  border-radius: inherit;
  pointer-events: none;
}

.liquid-glass-enhanced::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.25) 0%,
    transparent 100%
  );
  border-radius: inherit;
  pointer-events: none;
}
```

## 値の目安

| プロパティ         | 値の範囲    | 推奨値 |
| ------------------ | ----------- | ------ |
| Blur               | 5px - 30px  | 20px   |
| Background Opacity | 0.1 - 0.3   | 0.15   |
| Border Opacity     | 0.3 - 0.8   | 0.5    |
| Saturation         | 150% - 200% | 180%   |
| Border Radius      | 16px - 32px | 24px   |
| Shadow Opacity     | 0.1 - 0.25  | 0.15   |

## バリエーション

### Light（明るい背景用）

```css
.liquid-glass-light {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}
```

### Tinted（色付き）

```css
.liquid-glass-tinted {
  background: rgba(0, 122, 255, 0.1);
  backdrop-filter: blur(20px) saturate(200%);
  border: 1px solid rgba(0, 122, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 122, 255, 0.1);
}
```

### Dark Mode

```css
.liquid-glass-dark {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

## Tailwind CSS実装

```jsx
// 基本的なLiquid Glass
<div className="
  bg-white/15
  backdrop-blur-[20px] backdrop-saturate-[180%]
  border border-white/50
  rounded-[24px]
  shadow-[0_8px_32px_rgba(31,38,135,0.15)]
">

// Light バリエーション
<div className="
  bg-white/60
  backdrop-blur-[20px] backdrop-saturate-[180%]
  border border-white/80
  rounded-[24px]
  shadow-[0_4px_24px_rgba(0,0,0,0.06)]
">

// ホバーエフェクト付き
<div className="
  bg-white/15
  backdrop-blur-[20px] backdrop-saturate-[180%]
  border border-white/50
  rounded-[24px]
  shadow-[0_8px_32px_rgba(31,38,135,0.15)]
  transition-all duration-300
  hover:bg-white/25
  hover:shadow-[0_12px_40px_rgba(31,38,135,0.2)]
  hover:-translate-y-1
">
```

## アクセシビリティ考慮事項

### コントラスト

- テキストは十分なコントラスト比（4.5:1以上）を確保
- 背景が変化してもテキストが読めるようにする
- 必要に応じてテキストに影をつける

### Reduced Transparency対応

```css
@media (prefers-reduced-transparency: reduce) {
  .liquid-glass {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: none;
  }
}
```

### Reduced Motion対応

```css
@media (prefers-reduced-motion: reduce) {
  .liquid-glass {
    transition: none;
  }
}
```

## ブラウザサポート

| ブラウザ | backdrop-filter | SVG Filter |
| -------- | --------------- | ---------- |
| Chrome   | ✅              | ✅         |
| Safari   | ✅（-webkit-）  | ⚠️ 部分的  |
| Firefox  | ✅              | ⚠️ 部分的  |
| Edge     | ✅              | ✅         |

### フォールバック

```css
.liquid-glass {
  /* フォールバック */
  background: rgba(255, 255, 255, 0.9);
}

@supports (backdrop-filter: blur(20px)) {
  .liquid-glass {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px) saturate(180%);
  }
}
```

## 参考リンク

- [Apple Human Interface Guidelines - Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
- [WWDC25 - Get to know the new design system](https://developer.apple.com/videos/play/wwdc2025/356/)
- [CSS-Tricks - Getting Clarity on Apple's Liquid Glass](https://css-tricks.com/getting-clarity-on-apples-liquid-glass/)
