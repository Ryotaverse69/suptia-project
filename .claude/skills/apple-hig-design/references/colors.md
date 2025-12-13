# Colors（カラーシステム）

## iOS システムカラー

### プライマリカラー

| 名前   | Hex     | RGB            | 用途                         |
| ------ | ------- | -------------- | ---------------------------- |
| Blue   | #007AFF | (0, 122, 255)  | プライマリアクション、リンク |
| Green  | #34C759 | (52, 199, 89)  | 成功、ポジティブ             |
| Red    | #FF3B30 | (255, 59, 48)  | エラー、破壊的アクション     |
| Orange | #FF9500 | (255, 149, 0)  | 警告、注意                   |
| Yellow | #FFCC00 | (255, 204, 0)  | 警告、ハイライト             |
| Pink   | #FF2D55 | (255, 45, 85)  | 愛、ソーシャル               |
| Purple | #AF52DE | (175, 82, 222) | クリエイティブ               |
| Indigo | #5856D6 | (88, 86, 214)  | 特別な要素                   |
| Teal   | #5AC8FA | (90, 200, 250) | 補助的情報                   |
| Cyan   | #32ADE6 | (50, 173, 230) | 情報、リンク（新色）         |
| Mint   | #00C7BE | (0, 199, 190)  | フレッシュ、ヘルス（新色）   |
| Brown  | #A2845E | (162, 132, 94) | アース、ナチュラル（新色）   |

### グレースケール

| 名前        | Hex     | 用途                 |
| ----------- | ------- | -------------------- |
| systemGray  | #8E8E93 | 無効状態、アイコン   |
| systemGray2 | #AEAEB2 | セカンダリアイコン   |
| systemGray3 | #C7C7CC | ディスクロージャ矢印 |
| systemGray4 | #D1D1D6 | プレースホルダー     |
| systemGray5 | #E5E5EA | 入力フィールド背景   |
| systemGray6 | #F2F2F7 | グループ背景         |

## Apple Web カラー

Apple.comで使用されるWebサイト用カラー：

| 名前             | Hex     | 用途           |
| ---------------- | ------- | -------------- |
| Apple Blue       | #0071e3 | CTA ボタン     |
| Apple Blue Hover | #0077ED | ボタンホバー   |
| Page Background  | #fbfbfd | ページ背景     |
| Section Gray     | #f5f5f7 | セクション背景 |
| Text Primary     | #1d1d1f | メインテキスト |
| Text Secondary   | #86868b | サブテキスト   |
| Link Blue        | #06c    | テキストリンク |

### iOS Blue vs Apple Web Blue

| コンテキスト | カラー  | 用途               |
| ------------ | ------- | ------------------ |
| iOS アプリ   | #007AFF | システムアクション |
| Apple Web    | #0071e3 | CTAボタン          |

## セマンティックカラー

### 背景色

| 名前                      | Hex     | 用途                       |
| ------------------------- | ------- | -------------------------- |
| systemBackground          | #FFFFFF | メイン背景                 |
| secondarySystemBackground | #F2F2F7 | グループ背景（設定画面等） |
| tertiarySystemBackground  | #FFFFFF | カード内背景               |
| pageBackground            | #fbfbfd | ページ全体背景（Web）      |
| sectionBackground         | #f5f5f7 | セクション背景（Web）      |

### テキスト色

| 名前            | Hex / RGBA                   | 用途               |
| --------------- | ---------------------------- | ------------------ |
| label           | #1d1d1f                      | プライマリテキスト |
| secondaryLabel  | #86868b / rgba(60,60,67,0.6) | セカンダリテキスト |
| tertiaryLabel   | rgba(60,60,67,0.3)           | プレースホルダー   |
| quaternaryLabel | rgba(60,60,67,0.18)          | 無効テキスト       |

### 区切り線

| 名前            | 値                  |
| --------------- | ------------------- |
| separator       | rgba(60,60,67,0.29) |
| opaqueSeparator | #C6C6C8             |
| subtleBorder    | rgba(0,0,0,0.05)    |

## Tailwind CSS設定

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // iOS System Colors
        ios: {
          blue: "#007AFF",
          green: "#34C759",
          red: "#FF3B30",
          orange: "#FF9500",
          yellow: "#FFCC00",
          pink: "#FF2D55",
          purple: "#AF52DE",
          indigo: "#5856D6",
          teal: "#5AC8FA",
          cyan: "#32ADE6",
          mint: "#00C7BE",
          brown: "#A2845E",
        },

        // Apple Web Colors
        apple: {
          blue: "#0071e3",
          "blue-hover": "#0077ED",
          link: "#06c",
        },

        // Background
        "ios-bg": {
          DEFAULT: "#FFFFFF",
          secondary: "#F2F2F7",
          page: "#fbfbfd",
          section: "#f5f5f7",
        },

        // Text
        "ios-label": "#1d1d1f",
        "ios-secondary": "#86868b",

        // Gray Scale
        "ios-gray": {
          1: "#8E8E93",
          2: "#AEAEB2",
          3: "#C7C7CC",
          4: "#D1D1D6",
          5: "#E5E5EA",
          6: "#F2F2F7",
        },
      },
    },
  },
};
```

## CSS変数実装

```css
:root {
  /* iOS System Colors */
  --color-blue: #007aff;
  --color-green: #34c759;
  --color-red: #ff3b30;
  --color-orange: #ff9500;
  --color-yellow: #ffcc00;
  --color-pink: #ff2d55;
  --color-purple: #af52de;
  --color-indigo: #5856d6;
  --color-teal: #5ac8fa;
  --color-cyan: #32ade6;
  --color-mint: #00c7be;

  /* Apple Web Colors */
  --color-apple-blue: #0071e3;
  --color-apple-blue-hover: #0077ed;

  /* Background */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f2f2f7;
  --color-bg-page: #fbfbfd;
  --color-bg-section: #f5f5f7;

  /* Text */
  --color-text-primary: #1d1d1f;
  --color-text-secondary: #86868b;
  --color-text-tertiary: rgba(60, 60, 67, 0.3);

  /* Separator */
  --color-separator: rgba(60, 60, 67, 0.29);
  --color-border-subtle: rgba(0, 0, 0, 0.05);
}
```

## アクセシビリティ

### コントラスト比要件

| レベル      | 通常テキスト (< 18pt) | 大きなテキスト (≥ 18pt) |
| ----------- | --------------------- | ----------------------- |
| AA（必須）  | 4.5:1                 | 3:1                     |
| AAA（推奨） | 7:1                   | 4.5:1                   |

### 主要な組み合わせのコントラスト比

| 前景    | 背景    | コントラスト比 | 判定          |
| ------- | ------- | -------------- | ------------- |
| #1d1d1f | #FFFFFF | 12.6:1         | AAA ✓         |
| #86868b | #FFFFFF | 4.5:1          | AA ✓          |
| #007AFF | #FFFFFF | 4.5:1          | AA ✓          |
| #FFFFFF | #007AFF | 4.5:1          | AA ✓          |
| #C7C7CC | #FFFFFF | 1.8:1          | ✗（装飾のみ） |

### 注意

- **#86868b**（セカンダリテキスト）は白背景でぎりぎりAA。重要な情報には使用しない
- **#C7C7CC**（Gray3）は低コントラスト。アイコンや装飾にのみ使用

## 実装例

```jsx
// Primary Button（iOS Blue）
<button className="bg-[#007AFF] hover:bg-[#0077ED] text-white">
  iOS Style
</button>

// Primary Button（Apple Web Blue）
<button className="bg-[#0071e3] hover:bg-[#0077ED] text-white">
  Apple.com Style
</button>

// Card with Section Background
<section className="bg-[#f5f5f7]">
  <div className="bg-white border border-black/5 rounded-[20px] p-6">
    <h3 className="text-[#1d1d1f]">Title</h3>
    <p className="text-[#86868b]">Description</p>
  </div>
</section>

// Status Colors
<span className="text-[#34C759]">Success</span>
<span className="text-[#FF9500]">Warning</span>
<span className="text-[#FF3B30]">Error</span>

// Subtle Border
<div className="border border-black/5">
  Subtle bordered container
</div>
```

## チェックリスト

- [ ] プライマリテキストは #1d1d1f か
- [ ] セカンダリテキストは #86868b か
- [ ] コントラスト比 4.5:1 以上か
- [ ] システムカラーを適切に使用しているか
- [ ] 背景色の階層が明確か
