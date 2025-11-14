# マルチビタミン対応コスト比較ロジック

**実装日**: 2025-11-14
**バージョン**: 1.0.0
**担当**: Ryota

---

## 📋 概要

Suptiaのマルチビタミン商品に対して、公平で直感的なコストパフォーマンス比較を実現するための改善実装。

**背景：**

- 単一成分のcost/mgは正確に機能していた
- しかしマルチビタミンは10〜30成分を混在させており、単純なmg比較では不公平な結果になる
- 微量成分（ビオチン0.05mgなど）が全体コストを歪める問題があった

**解決策：**
「**主要成分トップ5**」を使ったcost/mg計算を採用

---

## 🎯 採用理由

### なぜ「主要成分トップ5」方式なのか？

1. **実質的な価値を反映**
   - 重量の90%以上は主要成分で構成されている
   - 微量成分（ビオチンなど）は比較に不向き

2. **ユーザーの直感と一致**
   - 「マルチビタミンのコスパ」と聞いて、ユーザーが期待するのは主要成分の価値
   - 微量成分の「水増し」誇大表示を防止

3. **実装が安定・拡張しやすい**
   - 単一成分と同じロジックを応用できる
   - 将来的に「栄養価スコア × 推奨量」方式も追加可能

4. **公平性が高い**
   - 成分数の違いによる不公平を解消
   - 実質的な栄養価を正確に評価

5. **Suptiaの理念に完全合致**
   - 透明性 ✅
   - 説明可能性 ✅
   - 公平性 ✅

---

## 🔧 実装内容

### 1. 判定基準

```typescript
// 成分数 ≤ 3: 単一成分系
// 成分数 > 3: マルチビタミン
function isMultiVitamin(ingredients: Array<Ingredient>): boolean {
  return ingredients.length > 3;
}
```

### 2. 主要成分トップ5の抽出

```typescript
function getTop5MajorIngredients(
  ingredients: Array<{ amountMgPerServing: number }>,
): Array<{ amountMgPerServing: number }> {
  // mg量でソート（降順）
  const sorted = [...ingredients].sort(
    (a, b) => b.amountMgPerServing - a.amountMgPerServing,
  );

  // トップ5を返す（5件未満の場合は全件）
  return sorted.slice(0, 5);
}
```

### 3. コスト計算

```typescript
function calculateCostPerMgForMultiVitamin(
  price: number,
  ingredients: Array<{ amountMgPerServing: number }>,
  servingsPerContainer: number,
): number {
  // 主要成分トップ5を取得
  const top5Ingredients = getTop5MajorIngredients(ingredients);

  // トップ5の合計mg（1回分）
  const top5MgPerServing = top5Ingredients.reduce(
    (sum, ingredient) => sum + ingredient.amountMgPerServing,
    0,
  );

  // 全容器の主要成分合計mg
  const totalTop5Mg = top5MgPerServing * servingsPerContainer;

  if (totalTop5Mg === 0) return 0;

  return price / totalTop5Mg;
}
```

### 4. 自動判定による統一ロジック

```typescript
function calculateCostPerMg(product: ProductCostData): number {
  // マルチビタミン判定
  if (isMultiVitaminProduct(product)) {
    return calculateCostPerMgForMultiVitamin(product);
  }

  // 単一成分系：従来のロジック
  const totalMg =
    calculateTotalMgPerServing(product) * product.servingsPerContainer;
  if (totalMg === 0) return 0;
  return product.priceJPY / totalMg;
}
```

---

## 📊 計算例

### 例1: マルチビタミン（22成分）

```
商品: ファンケル マルチビタミン&ミネラル Base POWER 30日分
価格: ¥1,500
容器: 30回分

成分（22種類）:
  1. ビタミンE: 80mg
  2. ビタミンC: 100mg
  3. カルシウム: 100mg
  4. マグネシウム: 50mg
  5. ビタミンB1: 12mg
  ─── トップ5合計: 342mg ───
  6. ビタミンB2: 14mg
  7. ビタミンB6: 13mg
  8. ナイアシン: 13mg
  9. パントテン酸: 4.8mg
  10. ビタミンP: 25mg
  11. 亜鉛: 8.8mg
  12. コエンザイムQ10: 5mg
  ... (以下微量成分)
  22. ビオチン: 0.05mg

計算:
- トップ5合計: 342mg × 30回分 = 10,260mg
- cost/mg = ¥1,500 / 10,260mg = ¥0.146/mg

従来方式（全成分）:
- 全成分合計: 約400mg × 30回分 = 12,000mg
- cost/mg = ¥1,500 / 12,000mg = ¥0.125/mg
→ 微量成分で水増しされて、不当に有利な評価になる
```

### 例2: 単一成分（1成分）

```
商品: DHC ビタミンC 60日分
価格: ¥398
容器: 120粒（60日分、1日2粒）

成分（1種類）:
  1. ビタミンC: 500mg

計算:
- 従来方式を適用: 500mg × 120粒 = 60,000mg
- cost/mg = ¥398 / 60,000mg = ¥0.0066/mg

判定:
- 成分数 ≤ 3 のため、従来方式を適用
```

### 例3: 複合サプリ（2-3成分）

```
商品: ビタミンC + 亜鉛
価格: ¥1,200
容器: 30回分

成分（2種類）:
  1. ビタミンC: 1000mg
  2. 亜鉛: 15mg

計算:
- 全成分を使用: (1000 + 15) × 30 = 30,450mg
- cost/mg = ¥1,200 / 30,450mg = ¥0.039/mg

判定:
- 成分数 ≤ 3 のため、全成分を使用
```

---

## 🏆 Tierランク判定

マルチビタミンも単一成分と同じTierランクロジックを使用：

```typescript
// パーセンタイル → ランク変換
S: 上位10%
A: 上位20%
B: 上位30%
C: 上位40%
D: 下位40%
```

**重要**: マルチビタミン商品は、**同じカテゴリーのマルチビタミン商品とのみ比較**されます。

---

## 🎨 UI表示

### 1. コスパランク説明セクション

```tsx
<div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
  <h3 className="text-sm font-semibold text-blue-900 mb-1">
    コスパランクとは？
  </h3>
  <p className="text-xs text-blue-800 leading-relaxed">
    成分量（mg）あたりの価格効率を、同じ成分を含む他商品と相対比較した評価です。
    価格が安くても成分量が少なければコスパは低くなります。
  </p>
</div>
```

### 2. マルチビタミン用の追加説明

```tsx
{
  isMultiIngredient && (
    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-sm font-semibold text-yellow-900 mb-1">
        🔬 マルチビタミンの比較方法
      </h3>
      <p className="text-xs text-yellow-800 leading-relaxed">
        この商品は{currentProduct.ingredients?.length || 0}
        種類の成分を含むマルチビタミンです。 コスパ評価は
        <span className="font-semibold">主要成分トップ5</span>
        （mg量が多い順）の合計を基準に計算しています。
        微量成分は除外することで、実質的な価値を正確に反映しています。
      </p>
    </div>
  );
}
```

### 3. 複合サプリ詳細表示

```tsx
<div className="grid grid-cols-2 gap-3">
  <div className="p-3 bg-white border border-purple-300 rounded">
    <p className="text-[10px] text-purple-700 mb-1">主成分あたりのコスト</p>
    <p className="text-lg font-bold text-purple-900">
      ¥{currentCostPerMg.toFixed(2)}/mg
    </p>
    <p className="text-[10px] text-purple-600 mt-0.5">
      {primaryIngredient?.name}のコスト
    </p>
  </div>

  <div className="p-3 bg-white border border-pink-300 rounded">
    <p className="text-[10px] text-pink-700 mb-1">全成分合計あたりのコスト</p>
    <p className="text-lg font-bold text-pink-900">
      ¥{currentCostPerMgAllIngredients.toFixed(2)}/mg
    </p>
    <p className="text-[10px] text-pink-600 mt-0.5">
      {currentProduct.ingredients.length}成分の合計コスト
    </p>
  </div>
</div>
```

---

## 📂 実装ファイル

### 変更ファイル

1. **`apps/web/src/lib/cost-calculator.ts`**
   - `isMultiVitaminProduct()` - マルチビタミン判定
   - `getTop5MajorIngredients()` - トップ5抽出
   - `calculateCostPerMgForMultiVitamin()` - マルチビタミン用cost/mg計算
   - `calculateCostPerMg()` - 自動判定ロジック追加

2. **`scripts/auto-calculate-tier-ranks.mjs`**
   - `isMultiVitamin()` - マルチビタミン判定
   - `getTop5MajorIngredients()` - トップ5抽出
   - `calculateCostPerMgForMultiVitamin()` - マルチビタミン用cost/mg計算
   - costPerMg計算ロジックをマルチビタミン対応に更新

3. **`apps/web/src/components/CostEffectivenessDetail.tsx`**
   - マルチビタミン用の説明セクション追加
   - 既存の複合サプリ表示機能を活用

---

## ✅ テスト

### TypeScript型チェック

```bash
cd apps/web && npx tsc --noEmit
```

### Lintチェック

```bash
npm run lint
```

### ユニットテスト

```bash
npm run test
```

---

## 🚀 今後の拡張予定

### フェーズ2: 高度な分析

- **栄養価スコア導入**
  - 成分ごとの推奨摂取量（RDA）に対する充足率を考慮
  - 「質 × 量」の総合評価

- **ターゲット別最適化**
  - 年齢・性別・目的別の推奨量を参照
  - パーソナライズド推薦

### フェーズ3: AIによる最適化

- GPT連携でユーザーの健康目標に応じた推薦
- 成分の相互作用を考慮した組み合わせ提案

---

## 📝 備考

### 後方互換性

- 単一成分商品は従来のロジックを維持
- 既存のコスパランク計算結果に影響なし
- 成分数 ≤ 3 の商品は従来通りの計算

### パフォーマンス

- トップ5抽出はO(n log n)の計算量
- 成分数が最大30程度のため、パフォーマンス影響は無視できる

### 透明性

- ユーザーに対して計算方法を明示
- UI上で「主要成分トップ5方式」を説明
- ツールチップで詳細な理由を提供

---

## 🧠 設計思想

### Suptiaの理念との整合性

1. **透明性**
   - 計算方法をUIで明示
   - ツールチップで詳細説明
   - ドキュメントで完全公開

2. **説明可能性**
   - なぜその評価になったか説明できる
   - ユーザーが納得できる根拠を提示
   - ブラックボックス化を避ける

3. **公平性**
   - 微量成分の水増しを防止
   - 実質的な価値を正確に反映
   - 商品間の比較を公平に

4. **直感性**
   - ユーザーの期待と一致
   - 「マルチビタミンのコスパ」の意味を正しく理解
   - 誤解を生まない表現

---

## 📚 参考資料

- [コスパ比較ロジック改善実装ドキュメント](./COST_PERFORMANCE_IMPROVEMENTS.md)
- [Suptia プロジェクト - Claude Code ガイド](../CLAUDE.md)

---

**最終更新日**: 2025-11-14
**ドキュメント作成者**: Ryota
