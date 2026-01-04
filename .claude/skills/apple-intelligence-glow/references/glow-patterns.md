# グローパターン集

Apple Intelligence風グローエフェクトのバリエーション。

## 重要: 2つのアプローチ

### 1. div要素アプローチ（ボタン向け・推奨）

motion.divなどのカスタムコンポーネントに対応。z-index問題を回避。

```html
<div class="glow-wrapper glow-active">
  <div class="glow-layer"></div>
  <div class="glow-button-inner">コンテンツ</div>
</div>
```

### 2. ::before疑似要素アプローチ（入力フィールド向け）

シンプルな構造に有効。styled-jsxで実装。

```html
<div class="rainbow-wrapper rainbow-active">
  <div class="inner-container">コンテンツ</div>
</div>
```

---

## パターン1: ボタングロー（div要素方式）

CTAボタン向け。globals.cssクラスを使用。

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
      <div className="glow-layer" />
      <div className="glow-button-inner">{children}</div>
    </div>
  );
}
```

### CSS（globals.css）

```css
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

---

## パターン2: 入力フィールドグロー（::before方式）

フォーカス時にレインボーボーダーが出現。styled-jsx使用。

```tsx
"use client";
import { useState } from "react";

export function GlowInput() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <div className={`rainbow-wrapper ${isFocused ? "rainbow-active" : ""}`}>
        <div className={`inner-container ${isFocused ? "inner-focused" : ""}`}>
          <input
            type="text"
            className="w-full bg-transparent px-4 py-3 focus:outline-none text-[15px]"
            placeholder="メッセージを入力..."
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
      </div>

      <style jsx>{`
        .inner-container {
          background-color: #f5f5f7;
          border: 1px solid #d2d2d7;
          border-radius: 16px;
          transition:
            background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
            border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
            border-radius 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .inner-container.inner-focused {
          background-color: rgba(255, 255, 255, 0.98);
          border-color: transparent;
          border-radius: 14px;
        }

        .rainbow-wrapper {
          position: relative;
          padding: 0;
          transition: padding 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .rainbow-wrapper::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 16px;
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
          opacity: 0;
          transform: scale(0.98);
          transition:
            opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
            transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: -1;
        }

        .rainbow-wrapper.rainbow-active {
          padding: 3px;
        }

        .rainbow-wrapper.rainbow-active::before {
          opacity: 1;
          transform: scale(1);
          animation:
            rainbow-shift 4s ease infinite,
            glow-pulse 2s ease-in-out infinite;
          box-shadow:
            0 0 15px rgba(188, 130, 243, 0.4),
            0 0 30px rgba(141, 159, 255, 0.3),
            0 0 45px rgba(198, 134, 255, 0.2);
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

        @keyframes glow-pulse {
          0%,
          100% {
            box-shadow:
              0 0 15px rgba(188, 130, 243, 0.4),
              0 0 30px rgba(141, 159, 255, 0.3),
              0 0 45px rgba(198, 134, 255, 0.2);
          }
          50% {
            box-shadow:
              0 0 20px rgba(245, 185, 234, 0.5),
              0 0 40px rgba(255, 103, 120, 0.4),
              0 0 60px rgba(255, 186, 113, 0.3);
          }
        }
      `}</style>
    </div>
  );
}
```

---

## パターン3: 小さいボタン

StickyCTAなど狭いスペース向け。

```tsx
<div
  className={`glow-wrapper ${isHovered ? "glow-active" : ""}`}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
  <div className="glow-layer" />
  <div className="glow-button-inner-sm">
    <span className="flex items-center gap-2">
      <MessageCircle className="w-4 h-4" />
      相談する
    </span>
  </div>
</div>
```

### CSS

```css
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

---

## カラーバリエーション

### デフォルト（Apple Intelligence）

```css
/* 通常時 */
background: #007aff;

/* ホバー時 */
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

box-shadow:
  0 0 8px rgba(188, 130, 243, 0.5),
  0 0 16px rgba(141, 159, 255, 0.3);
```

### ブルー系

```css
background: #0066cc;

/* ホバー時 */
background: linear-gradient(
  90deg,
  #00c6ff,
  #0072ff,
  #7b68ee,
  #00bfff,
  #1e90ff,
  #87ceeb,
  #00c6ff
);

box-shadow:
  0 0 8px rgba(0, 198, 255, 0.5),
  0 0 16px rgba(0, 114, 255, 0.3);
```

### サンセット系

```css
background: #ff6347;

/* ホバー時 */
background: linear-gradient(
  90deg,
  #ff6b6b,
  #ffe66d,
  #ff8e53,
  #ffa07a,
  #ff7f50,
  #ff6347,
  #ff6b6b
);

box-shadow:
  0 0 8px rgba(255, 107, 107, 0.5),
  0 0 16px rgba(255, 142, 83, 0.3);
```

### オーロラ系

```css
background: #00d9ff;

/* ホバー時 */
background: linear-gradient(
  90deg,
  #00ff87,
  #60efff,
  #00d9ff,
  #b721ff,
  #21d4fd,
  #7effca,
  #00ff87
);

box-shadow:
  0 0 8px rgba(0, 255, 135, 0.5),
  0 0 16px rgba(96, 239, 255, 0.3);
```

---

## 使い分けガイド

| ユースケース   | アプローチ | クラス                              |
| -------------- | ---------- | ----------------------------------- |
| CTAボタン      | div要素    | glow-wrapper + glow-button-inner    |
| 小さいボタン   | div要素    | glow-wrapper + glow-button-inner-sm |
| 入力フィールド | ::before   | rainbow-wrapper (styled-jsx)        |
| テキストエリア | ::before   | rainbow-wrapper (styled-jsx)        |
| motion.div使用 | div要素    | globals.cssクラス必須               |
