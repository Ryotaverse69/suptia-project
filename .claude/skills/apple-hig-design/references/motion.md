# Motion（モーション・アニメーション）

## 基本原則

Appleのモーションデザインは「自然さ」を重視。iOS 17以降、スプリングアニメーションがデフォルト。

### モーションの目的

1. **フィードバック** - ユーザーアクションへの応答
2. **方向性** - 画面遷移の文脈を提供
3. **継続性** - 状態変化を滑らかに表現
4. **注目誘導** - 重要な変化への注意を引く

## スプリングアニメーション

### なぜスプリングか？

- **物理的な自然さ** - 現実世界の動きを模倣
- **速度の継続性** - 途中で中断しても滑らかに遷移
- **柔軟性** - bounce（跳ね返り）で個性を表現

### スプリングパラメータ

| パラメータ | 説明         | 推奨値  |
| ---------- | ------------ | ------- |
| stiffness  | バネの硬さ   | 100-400 |
| damping    | 減衰（摩擦） | 10-30   |
| mass       | 物体の質量   | 1       |

### SwiftUI / Framer Motion対応

```js
// Framer Motion - Apple風スプリング
const appleSpring = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

// バウンス少なめ（UIコントロール向け）
const subtleSpring = {
  type: "spring",
  stiffness: 300,
  damping: 25,
};

// バウンス多め（楽しいインタラクション）
const bouncySpring = {
  type: "spring",
  stiffness: 200,
  damping: 15,
};
```

## イージングカーブ

### Apple標準イージング

```js
// Apple標準（ease-in-out相当）
const appleEase = [0.25, 0.1, 0.25, 1.0];

// フェードイン（要素出現）
const fadeIn = [0.0, 0.0, 0.2, 1.0];

// フェードアウト（要素消失）
const fadeOut = [0.4, 0.0, 1.0, 1.0];
```

### CSS実装

```css
/* Apple標準トランジション */
.apple-transition {
  transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

/* 高速トランジション */
.apple-fast {
  transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
}

/* スローイン */
.apple-slow-in {
  transition: all 0.5s cubic-bezier(0, 0, 0.2, 1);
}
```

## 推奨デュレーション

| アクション | デュレーション | 用途                                     |
| ---------- | -------------- | ---------------------------------------- |
| 即座       | 100-150ms      | ボタンプレス、タップフィードバック       |
| 高速       | 200-250ms      | メニュー展開、ドロップダウン             |
| 標準       | 300-350ms      | モーダル表示、画面遷移                   |
| 緩やか     | 400-500ms      | フルスクリーン遷移、複雑なアニメーション |

### 注意点

- **長すぎるアニメーションは避ける** - 500ms以上は遅く感じる
- **スプリングでは duration を設定しない** - stiffness/damping で自然に決まる

## 画面遷移

### Push遷移

```jsx
// 右から左へスライドイン
<motion.div
  initial={{ x: "100%", opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  exit={{ x: "-30%", opacity: 0 }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
>
```

### Modal遷移

```jsx
// 下から上へスライド + フェード
<motion.div
  initial={{ y: "100%", opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: "100%", opacity: 0 }}
  transition={{ type: "spring", stiffness: 400, damping: 35 }}
>
```

### Scale遷移（Alert）

```jsx
<motion.div
  initial={{ scale: 1.1, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.95, opacity: 0 }}
  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
>
```

## インタラクションフィードバック

### ボタンプレス

```jsx
<motion.button
  whileTap={{ scale: 0.97 }}
  transition={{ type: "spring", stiffness: 400, damping: 25 }}
>
  Action
</motion.button>
```

### ホバー効果

```jsx
<motion.div
  whileHover={{ y: -4, scale: 1.02 }}
  transition={{ type: "spring", stiffness: 400, damping: 30 }}
>
  Card
</motion.div>
```

### リスト項目

```jsx
// 順次アニメーション
{
  items.map((item, i) => (
    <motion.li
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05, duration: 0.3 }}
    />
  ));
}
```

## Reduced Motion対応

### 必須：アクセシビリティ対応

```jsx
// React Hook
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// 条件分岐
<motion.div
  animate={prefersReducedMotion ? {} : { y: [0, -4, 0] }}
  transition={prefersReducedMotion ? {} : { duration: 3, repeat: Infinity }}
>
```

### CSS対応

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Tailwind対応

```jsx
<div className="
  transition-transform duration-300
  motion-reduce:transition-none
  motion-reduce:transform-none
">
```

## パララックス効果

### スクロール連動

```jsx
const { scrollYProgress } = useScroll();
const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

<motion.div style={{ y }}>Parallax Content</motion.div>;
```

## Glassmorphism アニメーション

### Apple風ガラス効果

```jsx
<motion.div
  className="
    bg-white/80
    backdrop-blur-xl
    backdrop-saturate-150
  "
  initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
  animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
  transition={{ duration: 0.3 }}
>
```

## アニメーション禁止事項

1. **自動再生の無限ループ** - ユーザーの注意を散漫にする
2. **点滅効果** - 光過敏性発作のリスク（3Hz以上は禁止）
3. **予測不能な動き** - ユーザーを混乱させる
4. **長すぎるローディング** - 必要以上に待たせない

## チェックリスト

- [ ] スプリングアニメーションを使用しているか
- [ ] デュレーションは500ms以下か
- [ ] Reduced Motion設定を尊重しているか
- [ ] 点滅効果は3Hz未満か
- [ ] アニメーションに意味があるか（装飾だけではないか）
