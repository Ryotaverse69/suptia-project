# Typography（タイポグラフィ）

## San Francisco フォントファミリー

### フォントバリエーション

| フォント       | 用途                            | 特徴                           |
| -------------- | ------------------------------- | ------------------------------ |
| SF Pro Display | 見出し・大きなテキスト（≥20pt） | 字間が狭め、装飾的             |
| SF Pro Text    | 本文・小さなテキスト（≤19pt）   | 字間が広め、可読性重視         |
| SF Pro Rounded | 親しみやすいUI                  | 角が丸い、柔らかい印象         |
| SF Mono        | コード・等幅テキスト            | 全文字同幅                     |
| SF Compact     | watchOS・狭いスペース           | 横幅がコンパクト               |
| New York       | セリフ体・読み物                | クラシック、編集コンテンツ向け |

### Web実装（システムフォントスタック）

```css
/* SF Pro互換（Apple以外のOSでも適切なフォントにフォールバック） */
font-family:
  -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text",
  "Helvetica Neue", "Segoe UI", Roboto, sans-serif;

/* SF Pro Rounded風 */
font-family:
  -apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif;

/* 等幅フォント */
font-family:
  "SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, "Cascadia Mono",
  "Segoe UI Mono", monospace;

/* セリフ体（New York風） */
font-family:
  "New York", "Iowan Old Style", "Apple Garamond", Baskerville,
  "Times New Roman", serif;
```

## iOS Text Styles

### 完全仕様表

| Style       | Size | Weight   | Tracking | Line Height | 用途                         |
| ----------- | ---- | -------- | -------- | ----------- | ---------------------------- |
| Large Title | 34pt | Bold     | 0.37px   | 41pt        | 画面タイトル（スクロール前） |
| Title 1     | 28pt | Bold     | 0.36px   | 34pt        | セクションタイトル           |
| Title 2     | 22pt | Bold     | 0.35px   | 28pt        | サブセクション               |
| Title 3     | 20pt | Semibold | 0.38px   | 25pt        | 小見出し                     |
| Headline    | 17pt | Semibold | -0.41px  | 22pt        | 強調テキスト                 |
| Body        | 17pt | Regular  | -0.43px  | 22pt        | 本文（基準）                 |
| Callout     | 16pt | Regular  | -0.32px  | 21pt        | 補足情報                     |
| Subhead     | 15pt | Regular  | -0.24px  | 20pt        | セカンダリ情報               |
| Footnote    | 13pt | Regular  | -0.08px  | 18pt        | 注釈・タイムスタンプ         |
| Caption 1   | 12pt | Regular  | 0px      | 16pt        | 画像キャプション             |
| Caption 2   | 11pt | Regular  | 0.07px   | 13pt        | 最小テキスト                 |

### iPad差分

| 要素           | iPhone | iPad           |
| -------------- | ------ | -------------- |
| Tab Bar ラベル | 10pt   | 13pt（横配置） |
| Navigation Bar | 17pt   | 17pt（同じ）   |

### macOS Text Styles

| Style       | Size | Weight   |
| ----------- | ---- | -------- |
| Large Title | 26pt | Bold     |
| Title 1     | 22pt | Bold     |
| Title 2     | 17pt | Bold     |
| Title 3     | 15pt | Semibold |
| Headline    | 13pt | Bold     |
| Body        | 13pt | Regular  |
| Callout     | 12pt | Regular  |
| Subhead     | 11pt | Regular  |
| Footnote    | 10pt | Regular  |

## Tailwind CSS設定

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        "sf-pro": [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Helvetica Neue",
          "sans-serif",
        ],
        "sf-mono": [
          "SF Mono",
          "SFMono-Regular",
          "ui-monospace",
          "Menlo",
          "Monaco",
          "monospace",
        ],
        "new-york": [
          "New York",
          "Iowan Old Style",
          "Apple Garamond",
          "Baskerville",
          "serif",
        ],
      },
      fontSize: {
        "large-title": [
          "34px",
          { lineHeight: "41px", letterSpacing: "0.37px", fontWeight: "700" },
        ],
        "title-1": [
          "28px",
          { lineHeight: "34px", letterSpacing: "0.36px", fontWeight: "700" },
        ],
        "title-2": [
          "22px",
          { lineHeight: "28px", letterSpacing: "0.35px", fontWeight: "700" },
        ],
        "title-3": [
          "20px",
          { lineHeight: "25px", letterSpacing: "0.38px", fontWeight: "600" },
        ],
        headline: [
          "17px",
          { lineHeight: "22px", letterSpacing: "-0.41px", fontWeight: "600" },
        ],
        body: [
          "17px",
          { lineHeight: "22px", letterSpacing: "-0.43px", fontWeight: "400" },
        ],
        callout: [
          "16px",
          { lineHeight: "21px", letterSpacing: "-0.32px", fontWeight: "400" },
        ],
        subhead: [
          "15px",
          { lineHeight: "20px", letterSpacing: "-0.24px", fontWeight: "400" },
        ],
        footnote: [
          "13px",
          { lineHeight: "18px", letterSpacing: "-0.08px", fontWeight: "400" },
        ],
        "caption-1": [
          "12px",
          { lineHeight: "16px", letterSpacing: "0px", fontWeight: "400" },
        ],
        "caption-2": [
          "11px",
          { lineHeight: "13px", letterSpacing: "0.07px", fontWeight: "400" },
        ],
      },
    },
  },
};
```

## 光学サイズ（Optical Sizing）

SF Proは自動的に光学サイズを切り替え：

| サイズ範囲 | 使用フォント   | 特徴                       |
| ---------- | -------------- | -------------------------- |
| ≤19pt      | SF Pro Text    | 字間が広い、ストローク太め |
| ≥20pt      | SF Pro Display | 字間が狭い、優雅な見た目   |

### 実装

```css
/* 自動切り替え（ブラウザ対応時） */
font-optical-sizing: auto;

/* 手動切り替え */
.text-small {
  font-family:
    "SF Pro Text",
    -apple-system,
    sans-serif;
  letter-spacing: -0.43px; /* 17pt Body */
}

.text-large {
  font-family:
    "SF Pro Display",
    -apple-system,
    sans-serif;
  letter-spacing: 0.37px; /* 34pt Large Title */
}
```

## Dynamic Type対応

### アクセシビリティのための相対サイズ

```css
/* ユーザー設定を尊重 */
html {
  font-size: 100%;
}

body {
  font-size: 1.0625rem; /* 17px相当 */
  line-height: 1.294; /* 22/17 */
}

/* 相対サイズでスケーリング */
h1 {
  font-size: 2rem;
} /* 34px = 2 × 17 */
h2 {
  font-size: 1.647rem;
} /* 28px */
h3 {
  font-size: 1.294rem;
} /* 22px */
p {
  font-size: 1rem;
} /* 17px */
```

### Tailwind rem設定

```js
// tailwind.config.js - rem based for scaling
fontSize: {
  'body': '1.0625rem',      // 17px
  'large-title': '2.125rem', // 34px
  'title-1': '1.75rem',      // 28px
}
```

## ウェイト階層

視覚的階層をウェイトで表現：

```
Bold (700)      → Large Title, Title 1, Title 2
Semibold (600)  → Title 3, Headline
Regular (400)   → Body, Callout, Subhead, Footnote, Caption
Medium (500)    → フォームコントロール（強調時）
```

### 実装例

```jsx
// ウェイトで階層を表現
<article>
  <h1 className="text-[28px] font-bold">Primary Heading</h1>
  <h2 className="text-[20px] font-semibold">Secondary Heading</h2>
  <p className="text-[17px] font-normal">Body text content...</p>
  <span className="text-[13px] font-normal text-[#86868b]">Footnote</span>
</article>
```

## テキストカラー階層（Suptia標準）

視覚的階層とアクセシビリティを両立するためのテキストカラー設定：

| レベル    | 色コード  | コントラスト比 | 用途                       |
| --------- | --------- | -------------- | -------------------------- |
| Primary   | `#1d1d1f` | 12.6:1         | 見出し、本文、重要テキスト |
| Secondary | `#515154` | 8.5:1          | 説明文、補足情報、副題     |
| Tertiary  | `#86868b` | 4.5:1          | 注釈、ヒント、メタ情報     |

### 実装（design-system.ts）

```typescript
export const appleWebColors = {
  textPrimary: "#1d1d1f", // コントラスト 12.6:1
  textSecondary: "#515154", // コントラスト 8.5:1
  textTertiary: "#86868b", // コントラスト 4.5:1 (WCAG AA)
};
```

### 使い分けガイドライン

- **Primary**: 必ず読んでほしいテキスト（見出し、本文、CTA）
- **Secondary**: 補足説明、サブタイトル、リスト説明文
- **Tertiary**: 注釈、ヒントテキスト、タイムスタンプ、メタ情報

### 注意事項

- Tertiary（4.5:1）はWCAG AA基準ギリギリのため、重要な情報には使用しない
- 背景色が白(#fff)または#fbfbfd以外の場合はコントラスト比を再計算

## ベストプラクティス

1. **最小サイズ**: 本文17pt以上、キャプションでも11pt以上
2. **コントラスト**: Primary 12.6:1、Secondary 8.5:1、Tertiary 4.5:1以上を維持
3. **行間**: 読みやすさのため十分な行間（サイズの約1.3倍）
4. **Tracking**: サイズに応じて調整（小さいテキストほど広く）
5. **Weight階層**: フォントサイズではなく太さで情報の重要度を表現
6. **フォント数**: 1つのフォントファミリーで統一（SF Pro推奨）
7. **ライトウェイト回避**: 可読性のため Thin/Ultralight は避ける

## チェックリスト

- [ ] 本文は17pt以上か
- [ ] 最小テキストは11pt以上か
- [ ] 適切なトラッキング値を使用しているか
- [ ] フォントファミリーは統一されているか
- [ ] ウェイトで視覚階層を表現しているか
- [ ] Dynamic Type（相対サイズ）に対応しているか
