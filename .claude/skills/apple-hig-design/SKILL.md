---
name: apple-hig-design
description: Apple Human Interface Guidelines (HIG)に準拠したフロントエンドUIデザイン支援。このスキルは以下の場合に使用: (1) iOS/macOS/visionOS向けUIデザイン、(2) Apple風のクリーンなWebデザイン、(3) SF Proフォントを使ったタイポグラフィ設計、(4) アクセシビリティを考慮したUI実装、(5) レスポンシブレイアウト・スペーシング設計。Tailwind CSS/React/Next.jsでの実装をサポート。
---

# Apple HIG Design Skill

Apple Human Interface Guidelinesに基づくUIデザイン・実装ガイド。

## デザイン原則

### 3つのコア原則

1. **Clarity（明確性）** - 一目で理解できるUI。不要な複雑さを排除
2. **Deference（謙虚さ）** - コンテンツを主役に。UIは控えめに
3. **Depth（深さ）** - 視覚的階層で文脈と理解を提供

### 追加原則

4. **Consistency（一貫性）** - 画面間で視覚要素・動作を統一
5. **Direct Manipulation（直接操作）** - タッチに即座に反応、フィードバックを提供
6. **Feedback（フィードバック）** - ユーザーアクションに視覚・触覚で応答

## ミニマル・クリーンデザイン指針

### 避けるべきもの（AI感・安っぽさの原因）

| ❌ 避ける                          | ✅ 代わりに                            |
| ---------------------------------- | -------------------------------------- |
| パーティクルアニメーション         | スタガードフェードアップ               |
| 浮遊オーブ・メッシュグラデーション | 微細なアクセントグロー                 |
| Sparklesアイコン                   | Shield、ArrowRight等の具体的アイコン   |
| グラデーションテキスト             | ソリッドカラー（黒 + Apple Blue）      |
| 派手な背景色                       | 白/オフホワイト + 微細なグラデーション |
| 過剰なアニメーション               | 統一されたスタガードアニメーション     |

### ヒーローセクション設計

```jsx
// Apple風クリーン背景
<div style={{
  background: `linear-gradient(180deg, #f5f5f7 0%, #ffffff 50%, #fafafa 100%)`,
}} />

// 微細なアクセントグロー（控えめに）
<div style={{
  background: `
    radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,122,255,0.04) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 80% 80%, rgba(88,86,214,0.03) 0%, transparent 50%)
  `,
}} />

// タイトル - ソリッドカラー
<h1 style={{ color: "#1d1d1f" }}>あなたに最適な</h1>
<span style={{ color: "#007AFF" }}>サプリを見つけよう</span>
```

### スタガードアニメーション

```jsx
// Apple風のスタガードフェードアップ
const staggerDelay = 0.12;
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: i * staggerDelay,
      ease: [0.25, 0.1, 0.25, 1], // appleEase
    },
  }),
};

// 使用例
<motion.div custom={0} variants={fadeUpVariants} initial="hidden" animate="visible">
  バッジ
</motion.div>
<motion.h1 custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
  タイトル
</motion.h1>
<motion.p custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
  サブタイトル
</motion.p>
```

## クイックリファレンス

### タッチターゲット

| プラットフォーム | 最小サイズ | 推奨サイズ               |
| ---------------- | ---------- | ------------------------ |
| iOS / iPadOS     | 44×44pt    | 48×48pt以上              |
| macOS            | 指定なし   | クリック可能領域を十分に |
| visionOS         | 60×60pt    | 視線選択のため大きめに   |

### タイポグラフィ（SF Pro）

| スタイル    | サイズ | Weight   | Tracking | Line Height |
| ----------- | ------ | -------- | -------- | ----------- |
| Large Title | 34pt   | Bold     | 0.37px   | 41pt        |
| Title 1     | 28pt   | Bold     | 0.36px   | 34pt        |
| Title 2     | 22pt   | Bold     | 0.35px   | 28pt        |
| Title 3     | 20pt   | Semibold | 0.38px   | 25pt        |
| Headline    | 17pt   | Semibold | -0.41px  | 22pt        |
| Body        | 17pt   | Regular  | -0.43px  | 22pt        |
| Callout     | 16pt   | Regular  | -0.32px  | 21pt        |
| Subhead     | 15pt   | Regular  | -0.24px  | 20pt        |
| Footnote    | 13pt   | Regular  | -0.08px  | 18pt        |
| Caption 1   | 12pt   | Regular  | 0px      | 16pt        |
| Caption 2   | 11pt   | Regular  | 0.07px   | 13pt        |

### スペーシング

```
画面端マージン: 16px（iPhone）、20px（Max/iPad）
セクション間: 35px
グループ内: 16px
リスト項目間: 11px
密接要素間: 8px
```

### カラー

- **プライマリ**: #007AFF（iOS Blue）
- **成功**: #34C759（Green）
- **エラー**: #FF3B30（Red）
- **テキスト**: #1d1d1f（Primary） / #86868b（Secondary）
- **背景**: #f5f5f7（Off-white） / #ffffff（White）
- **コントラスト比**: 最小 **4.5:1**（AAレベル）

## 詳細ガイド

| トピック                   | ファイル                                                   |
| -------------------------- | ---------------------------------------------------------- |
| **Liquid Glass**           | [references/liquid-glass.md](references/liquid-glass.md)   |
| タイポグラフィ             | [references/typography.md](references/typography.md)       |
| レイアウト・スペーシング   | [references/layout.md](references/layout.md)               |
| カラーシステム             | [references/colors.md](references/colors.md)               |
| コンポーネント             | [references/components.md](references/components.md)       |
| アクセシビリティ           | [references/accessibility.md](references/accessibility.md) |
| モーション・アニメーション | [references/motion.md](references/motion.md)               |
| アイコン・SF Symbols       | [references/icons.md](references/icons.md)                 |

## Tailwind CSS実装例

```jsx
// Apple HIG準拠のボタン（44pt最小、スプリングアニメーション）
<motion.button
  className="
    min-h-[44px] min-w-[44px] px-6
    text-[17px] font-semibold leading-[22px] tracking-[-0.41px]
    bg-[#007AFF] hover:bg-[#0066CC] text-white
    rounded-full
    transition-colors
  "
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.97 }}
  transition={{ type: "spring", stiffness: 400, damping: 25 }}
>
  Action
</motion.button>

// Body テキスト
<p className="text-[17px] leading-[22px] tracking-[-0.43px] text-[#1d1d1f]">
  コンテンツ
</p>

// Large Title
<h1 className="text-[34px] font-bold leading-[41px] tracking-[0.37px] text-[#1d1d1f]">
  タイトル
</h1>

// Apple風バッジ（ミニマル）
<span className="
  inline-flex items-center gap-2.5 px-5 py-2.5
  rounded-full text-[13px] font-medium tracking-wide
  bg-[rgba(0,122,255,0.08)] text-[#007AFF]
">
  <Shield className="w-4 h-4" />
  科学的根拠に基づくサプリ比較
</span>

// Apple風検索ボックス
<div className="
  flex items-center rounded-full overflow-hidden
  bg-white border border-black/5
  shadow-[0_4px_20px_rgba(0,0,0,0.08)]
  focus-within:shadow-[0_8px_32px_rgba(0,0,0,0.12),0_0_0_2px_#007AFF]
  transition-shadow duration-200
">
  <Search className="ml-6 mr-3 text-[#86868b]" size={20} />
  <input
    className="flex-1 py-4 px-2 text-[17px] bg-transparent outline-none"
    placeholder="検索..."
  />
  <button className="m-1.5 px-6 py-3 rounded-full bg-[#007AFF] text-white font-semibold">
    検索
  </button>
</div>

// Liquid Glass Card（WWDC 2025）- 暗い背景用
<div className="
  p-6
  bg-white/15
  backdrop-blur-[20px] backdrop-saturate-[180%]
  border border-white/50
  rounded-[24px]
  shadow-[0_8px_32px_rgba(31,38,135,0.15),inset_0_2px_16px_rgba(255,255,255,0.2)]
  transition-all duration-300
  hover:bg-white/25 hover:-translate-y-1
">
  <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Card Title</h3>
  <p className="text-[15px] text-[#86868b]">Description</p>
</div>

// Liquid Glass Light（明るい背景用）
<div className="
  p-6
  bg-white/60
  backdrop-blur-[20px] backdrop-saturate-[180%]
  border border-white/80
  rounded-[24px]
  shadow-[0_4px_24px_rgba(0,0,0,0.06)]
">
  <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Card Title</h3>
  <p className="text-[15px] text-[#86868b]">Description</p>
</div>
```

## デザインレビューチェックリスト

### 必須

- [ ] タッチターゲットは44pt以上か（visionOSは60pt）
- [ ] テキストコントラスト比は4.5:1以上か
- [ ] 本文フォントサイズは17pt以上か
- [ ] Safe Areaを考慮しているか

### 推奨

- [ ] スプリングアニメーションを使用しているか
- [ ] Reduced Motion設定を尊重しているか
- [ ] 視覚的階層が明確か
- [ ] アイコンにaria-labelがあるか
- [ ] 8の倍数でスペーシングしているか

### ミニマル・クリーン

- [ ] パーティクル/オーブ等の過剰エフェクトがないか
- [ ] グラデーションテキストを使用していないか
- [ ] Sparkles等のAI感のあるアイコンを使用していないか
- [ ] 背景は白/オフホワイトベースか
- [ ] スタガードアニメーションで統一されているか
