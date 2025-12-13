# Accessibility（アクセシビリティ）

## 基本原則

1. **Perceivable（知覚可能）** - 情報を認識できる
2. **Operable（操作可能）** - インターフェースを操作できる
3. **Understandable（理解可能）** - 内容と操作を理解できる
4. **Robust（堅牢）** - 支援技術と互換性がある

## タッチターゲット

### 最小サイズ

```
必須: 44×44pt（176×176px @4x）
推奨: 48×48pt以上
```

### 実装

```jsx
// Good: 十分なタッチ領域
<button className="min-h-[44px] min-w-[44px] p-3">
  <Icon className="w-6 h-6" />
</button>

// Bad: 小さすぎるタッチ領域
<button className="p-1">
  <Icon className="w-4 h-4" />
</button>
```

### タッチ領域の拡張

```jsx
// 視覚的サイズより大きなタッチ領域
<button className="relative">
  <Icon className="w-5 h-5" />
  {/* 拡張タッチ領域 */}
  <span className="absolute -inset-2" aria-hidden="true" />
</button>
```

## コントラスト

### 要件

| レベル      | 通常テキスト (< 18pt) | 大きなテキスト (≥ 18pt) |
| ----------- | --------------------- | ----------------------- |
| AA（必須）  | 4.5:1                 | 3:1                     |
| AAA（推奨） | 7:1                   | 4.5:1                   |

### チェックツール

- WebAIM Contrast Checker
- Stark (Figma plugin)
- axe DevTools

### 実装例

```jsx
// Good: 高コントラスト（iOSシステムカラー）
<p className="text-[#1d1d1f] bg-white">
  読みやすいテキスト
</p>

// Acceptable: セカンダリテキスト（4.5:1以上を確保）
<p className="text-[#86868b]">
  セカンダリ情報
</p>

// Bad: 低コントラスト
<p className="text-[#C7C7CC] bg-[#E5E5EA]">
  読みにくいテキスト
</p>
```

## Dynamic Type

ユーザーが設定した文字サイズを尊重：

```css
/* 相対サイズを使用 */
html {
  font-size: 100%;
}

body {
  font-size: 1.0625rem; /* 17px base */
}

h1 {
  font-size: 2rem;
} /* 34px = 32/17 */
h2 {
  font-size: 1.647rem;
} /* 28px */
p {
  font-size: 1rem;
} /* 17px */
```

### Tailwind設定

```js
// tailwind.config.js - rem based
fontSize: {
  'body': '1.0625rem',      // 17px
  'title': '2rem',          // 34px
}
```

## VoiceOver / Screen Reader

### 必須属性

```jsx
// 画像
<img src="..." alt="商品の写真：青いTシャツ" />

// アイコンボタン
<button aria-label="検索">
  <SearchIcon aria-hidden="true" />
</button>

// ステータス
<div role="status" aria-live="polite">
  3件の新着メッセージ
</div>

// 読み込み中
<div role="status" aria-busy="true">
  <Spinner aria-hidden="true" />
  <span className="sr-only">読み込み中...</span>
</div>
```

### Screen Reader Only

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## フォーカス管理

### フォーカスリング

```jsx
<button className="
  focus:outline-none
  focus-visible:ring-2
  focus-visible:ring-[#007AFF]
  focus-visible:ring-offset-2
">
  Button
</button>

<input className="
  focus:outline-none
  focus:ring-2
  focus:ring-[#007AFF]
" />
```

### フォーカス順序

```jsx
// tabindexは必要な場合のみ
<div>
  <button>First</button> {/* tabindex不要 */}
  <button>Second</button>
  <div tabIndex={0}>Focusable div</div> {/* フォーカス可能にする */}
  <button tabIndex={-1}>Skip</button> {/* フォーカス順から除外 */}
</div>
```

## 色に頼らない情報伝達

```jsx
// Bad: 色だけでエラーを示す
<input className="border-red-500" />

// Good: 色 + アイコン + テキスト
<div>
  <input className="border-red-500" aria-describedby="error" />
  <p id="error" className="text-red-500 flex items-center gap-1">
    <ErrorIcon className="w-4 h-4" />
    メールアドレスが無効です
  </p>
</div>
```

## モーション

### Reduced Motion対応

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

```jsx
// Tailwind
<div className="
  transition-transform duration-300
  motion-reduce:transition-none
  motion-reduce:transform-none
">
```

## チェックリスト

- [ ] 全てのタッチターゲットは44pt以上
- [ ] テキストコントラスト比 4.5:1以上
- [ ] 全ての画像にalt属性
- [ ] アイコンボタンにaria-label
- [ ] フォーカス順序が論理的
- [ ] フォーカスリングが視認可能
- [ ] 色だけで情報を伝えていない
- [ ] prefers-reduced-motion対応
- [ ] VoiceOverでテスト済み
