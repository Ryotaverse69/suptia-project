# Layout & Spacing（レイアウト・スペーシング）

## Safe Area

デバイスのセンサー・角丸・ホームインジケータを避けた安全領域。

### iPhone Safe Area Insets

| デバイス          | Top  | Bottom | Left/Right |
| ----------------- | ---- | ------ | ---------- |
| iPhone 15 Pro     | 59pt | 34pt   | 0pt        |
| iPhone 15         | 59pt | 34pt   | 0pt        |
| iPhone SE         | 20pt | 0pt    | 0pt        |
| iPhone 14 Pro Max | 59pt | 34pt   | 0pt        |

### CSS実装

```css
/* Safe Area対応 */
.container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Tailwind */
<div className="pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
```

## マージン・パディング

### 標準マージン

| コンテキスト                 | 値   |
| ---------------------------- | ---- |
| 画面端マージン（iPhone）     | 16px |
| 画面端マージン（iPhone Max） | 20px |
| 画面端マージン（iPad）       | 20px |
| 画面端マージン（Mac）        | 20px |

### 内部スペーシング

| 要素間               | 値   |
| -------------------- | ---- |
| セクション間         | 35px |
| グループ内要素間     | 16px |
| リスト項目間         | 11px |
| 密接な要素間         | 8px  |
| アイコンとテキスト間 | 8px  |

## グリッドシステム

### 8pt グリッド

Appleは8ptグリッドを基本単位として使用：

```
4px  - 極小スペース
8px  - 小スペース
16px - 標準スペース
24px - 中スペース
32px - 大スペース
48px - 特大スペース
```

### Tailwind設定

```js
// tailwind.config.js
module.exports = {
  theme: {
    spacing: {
      0: "0px",
      1: "4px",
      2: "8px",
      3: "12px",
      4: "16px",
      5: "20px",
      6: "24px",
      8: "32px",
      10: "40px",
      12: "48px",
      16: "64px",
    },
  },
};
```

## コンテンツ幅

### 可読性のための最大幅

```css
/* 本文の最適な行長: 45-75文字 */
.prose {
  max-width: 65ch;
}

/* iPhoneでは全幅 */
@media (max-width: 428px) {
  .prose {
    max-width: 100%;
  }
}
```

### デバイス別幅

| デバイス          | 論理幅 |
| ----------------- | ------ |
| iPhone SE         | 375pt  |
| iPhone 15         | 393pt  |
| iPhone 15 Pro Max | 430pt  |
| iPad Mini         | 744pt  |
| iPad Pro 11"      | 834pt  |
| iPad Pro 12.9"    | 1024pt |

## レイアウトパターン

### Full Bleed

```jsx
<div className="w-full -mx-4 px-4">{/* 画面端まで広がるコンテンツ */}</div>
```

### Card Layout

```jsx
<div className="mx-4 p-4 bg-white rounded-2xl shadow-sm">
  {/* カード内コンテンツ */}
</div>
```

### List Group

```jsx
<ul
  className="mx-4 divide-y divide-black/5
               bg-white rounded-xl overflow-hidden"
>
  <li className="px-4 py-[11px]">Item 1</li>
  <li className="px-4 py-[11px]">Item 2</li>
</ul>
```

## Flexbox/Grid Tips

### 中央配置

```jsx
/* Flexbox中央配置 */
<div className="flex items-center justify-center min-h-screen">

/* Grid中央配置 */
<div className="grid place-items-center min-h-screen">
```

### 均等配置

```jsx
<div className="flex justify-between items-center px-4 h-[44px]">
  <button>Left</button>
  <h1>Title</h1>
  <button>Right</button>
</div>
```
