# Icons（アイコン・SF Symbols）

## SF Symbols 概要

SF Symbolsは6,900以上のシンボルを提供するApple公式アイコンライブラリ。San Franciscoフォントとシームレスに統合。

### 特徴

- **9つのウェイト** - Ultralight から Black まで
- **3つのスケール** - Small, Medium, Large
- **4つのレンダリングモード** - Monochrome, Hierarchical, Palette, Multicolor
- **テキストと自動整列** - ベースラインが揃う

## アイコンサイズ

### コンテキスト別推奨サイズ

| コンテキスト   | サイズ  | 用途                 |
| -------------- | ------- | -------------------- |
| Tab Bar        | 25×25pt | ナビゲーションタブ   |
| Navigation Bar | 22×22pt | バーボタン           |
| Toolbar        | 22×22pt | ツールバーアクション |
| List Cell      | 20×20pt | リスト内アイコン     |
| Badge          | 16×16pt | 小さな装飾           |

### Web実装（Lucide Icons / Heroicons）

```jsx
// Tab Bar アイコン
<Icon className="w-[25px] h-[25px]" />

// Navigation アイコン
<Icon className="w-[22px] h-[22px]" />

// リスト内アイコン
<Icon className="w-5 h-5" />  // 20px

// インライン（テキスト横）
<Icon className="w-4 h-4" />  // 16px
```

## レンダリングモード

### 1. Monochrome（単色）

最もシンプル。全てのパスが同一色。

```jsx
<Icon className="text-[#007AFF]" />
```

### 2. Hierarchical（階層的）

1色で、レイヤーごとに不透明度を変化。

```jsx
// CSSで再現
<div className="relative">
  <Icon className="text-[#007AFF]" /> {/* Primary: 100% */}
  <Icon className="text-[#007AFF]/60" /> {/* Secondary: 60% */}
  <Icon className="text-[#007AFF]/30" /> {/* Tertiary: 30% */}
</div>
```

### 3. Palette（パレット）

レイヤーごとに異なる色を指定。

```jsx
// 複数色アイコン
<svg>
  <path fill="#007AFF" /> {/* Primary layer */}
  <path fill="#34C759" /> {/* Secondary layer */}
</svg>
```

### 4. Multicolor（マルチカラー）

アイコン固有の意味を持つ色。葉は緑、ゴミ箱の削除は赤など。

```jsx
// 意味のある色
<TrashIcon className="text-[#FF3B30]" />  // 赤 = 削除
<LeafIcon className="text-[#34C759]" />   // 緑 = 自然
```

## アイコンとテキストの組み合わせ

### 水平配置

```jsx
<button className="flex items-center gap-2">
  <Icon className="w-5 h-5" />
  <span className="text-[17px]">Label</span>
</button>
```

### ボタン内（右端）

```jsx
<button className="flex items-center justify-between w-full px-4 py-3">
  <span className="text-[17px]">次へ</span>
  <ChevronRight className="w-5 h-5 text-[#C7C7CC]" />
</button>
```

### リスト項目

```jsx
<li className="flex items-center gap-4 px-4 py-3">
  <div className="w-8 h-8 rounded-lg bg-[#007AFF] flex items-center justify-center">
    <Icon className="w-5 h-5 text-white" />
  </div>
  <span className="text-[17px] text-[#1d1d1f]">設定項目</span>
  <ChevronRight className="ml-auto w-5 h-5 text-[#C7C7CC]" />
</li>
```

## カスタムアイコン作成

### ガイドライン

1. **シンプルに** - 詳細すぎると視認性が低下
2. **一貫性** - 線の太さ、角丸、パースを統一
3. **光学的補正** - 数学的な中央ではなく、視覚的な中央に配置
4. **ベクター形式** - PDF または SVG で作成

### グリッドテンプレート

```
サイズ: 24×24pt（基本）
ストローク: 1.5pt〜2pt
角丸: 1pt〜2pt
パディング: 2pt（四辺）
```

### SVG実装例

```jsx
// カスタムアイコン
<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="1.5"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M12 2L2 7l10 5 10-5-10-5z" />
</svg>
```

## アプリアイコン

### サイズ要件

| プラットフォーム | サイズ                   |
| ---------------- | ------------------------ |
| iPhone           | 60×60pt（180×180px @3x） |
| iPad             | 76×76pt（152×152px @2x） |
| App Store        | 1024×1024px              |

### デザインルール

- **角丸なしで作成** - システムが自動適用
- **透明領域禁止** - 背景色で塗りつぶす
- **シンプルな形状** - 遠くからでも認識可能

## 推奨アイコンライブラリ（Web）

### Lucide Icons

SF Symbolsに近いスタイル。React/Vue/Svelte対応。

```bash
npm install lucide-react
```

```jsx
import { Home, Search, Settings } from "lucide-react";

<Home className="w-6 h-6" />;
```

### Heroicons

Tailwind公式。Solid/Outlineの2スタイル。

```bash
npm install @heroicons/react
```

```jsx
import { HomeIcon } from "@heroicons/react/24/outline";

<HomeIcon className="w-6 h-6" />;
```

## アイコン使用の禁止事項

1. **SF Symbolsの商標利用禁止** - アプリアイコン・ロゴには使用不可
2. **Apple製品シンボルのカスタマイズ禁止** - Apple Watch等のアイコンは改変不可
3. **紛らわしいデザイン禁止** - SF Symbolsに酷似したカスタムアイコン

## アクセシビリティ

### aria-label必須

```jsx
// アイコンのみボタン
<button aria-label="検索">
  <SearchIcon className="w-6 h-6" aria-hidden="true" />
</button>

// テキスト付きボタン（aria-label不要）
<button>
  <SearchIcon className="w-5 h-5" aria-hidden="true" />
  <span>検索</span>
</button>
```

### role属性

```jsx
// 装飾的アイコン
<Icon aria-hidden="true" role="presentation" />

// 情報を持つアイコン
<Icon role="img" aria-label="成功" />
```

## チェックリスト

- [ ] アイコンサイズはコンテキストに適切か
- [ ] テキストとの整列が取れているか
- [ ] タッチターゲット（44pt）を確保しているか
- [ ] aria-label/aria-hidden が設定されているか
- [ ] 色のみで意味を伝えていないか
- [ ] 高コントラストモードで視認可能か
