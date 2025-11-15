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

### 現行ロジックの評価

現在の実装は以下の点で非常に優秀：

- ✅ **透明性** - 計算方法が明確で説明可能
- ✅ **説明可能性** - なぜその評価になったか説明できる
- ✅ **水増し対策** - 微量成分での不当な評価を防止
- ✅ **ユーザーの直感と一致** - 期待される比較結果を提供

改善ポイントは「**将来拡張の余地**」であり、現行ロジックの価値は完全に維持されます。

---

### フェーズ2.7-A: 栄養価スコア導入（2026年1月〜2月）

#### 目的

含有量の「量」だけでなく「生理学的価値」を評価に反映する。

#### 実装内容

**1. 含有量ランク境界の改善**

現状: パーセンタイルのみで決定
問題: 成分ごとの適正量の違いが反映されていない

例：

- ビタミンC：500〜2000mgが一般的
- ビタミンD：10µg前後が一般的（過剰摂取に注意）

改善案:

```typescript
// RDA（推奨摂取量）充足率ベースの補正
interface NutritionScore {
  ingredient: string;
  amountMg: number;
  rdaMg: number; // 推奨摂取量
  fulfillmentRate: number; // 充足率 = amountMg / rdaMg
  evidenceScore: number; // エビデンスレベルスコア
  safetyFactor: number; // 安全性係数（UL超過で減点）
}

function calculateNutritionValue(score: NutritionScore): number {
  // 栄養価 = (成分mg / RDA) × エビデンススコア × 安全性係数
  return (
    (score.amountMg / score.rdaMg) * score.evidenceScore * score.safetyFactor
  );
}
```

**2. マルチビタミンのトップ5集計方式の補正**

現状: 含有量の多い成分トップ5の合計を使用
問題: カルシウムやマグネシウムのような大量成分が優位になりやすい

改善案:

```typescript
// RDA比重み付けによるトップ5抽出
function getTop5ByNutritionalValue(
  ingredients: Array<IngredientWithRDA>,
): Array<IngredientWithRDA> {
  // RDA充足率でソート
  const sorted = [...ingredients].sort((a, b) => {
    const scoreA = (a.amountMg / a.rdaMg) * a.evidenceScore;
    const scoreB = (b.amountMg / b.rdaMg) * b.evidenceScore;
    return scoreB - scoreA;
  });

  return sorted.slice(0, 5);
}
```

**3. データソース**

- 厚生労働省「日本人の食事摂取基準（2020年版）」
- `data/rda-standards.json` にデータを格納
- 年齢・性別・目的別のRDAバリエーションを管理

**期待効果**:

- より科学的根拠に基づいた評価
- 成分の生理学的価値を正確に反映
- 過剰摂取リスクの自動検出

---

### フェーズ2.7-B: 安全性統合（2026年2月〜3月）

#### 目的

含有量Sバッジに安全上限（UL: Tolerable Upper Intake Level）判定を追加。

#### 実装内容

**1. UL（安全上限値）チェック**

現状: 「同成分グループ内で1日摂取量が最大」でS判定
問題: 安全性ULは参照していない

例：

- ビタミンD 4000IU（上限ぎりぎり）
- ビタミンA レチノール過多の商品

改善案:

```typescript
interface SafetyCheck {
  ingredient: string;
  amountMg: number;
  ulMg: number; // 安全上限値
  exceedsUL: boolean; // UL超過フラグ
}

function checkSafetyForSBadge(check: SafetyCheck): BadgeDecision {
  if (check.exceedsUL) {
    return {
      badge: "warning", // Sバッジではなく警告表示
      message: `${check.ingredient}の摂取量が安全上限（${check.ulMg}mg）を超えています`,
    };
  }

  return {
    badge: "S",
    message: "最高含有量",
  };
}
```

**2. 安全性スコアとの連動**

- 既存の安全性スコア（0-100点）と統合
- UL超過商品は安全性スコアを自動減点
- 商品詳細ページで警告表示

**期待効果**:

- 過剰摂取リスクの防止
- 安全性を最優先する姿勢を明確化
- 薬機法コンプライアンス強化

---

### フェーズ2.7-C: UI/UX改善（2026年3月〜4月）

#### 目的

ユーザーが直感的に理解できる可視化を提供。

#### 実装内容

**1. RDA充足率ヒートマップ**

```tsx
<div className="grid grid-cols-5 gap-2">
  {ingredients.map((ing) => {
    const fulfillmentRate = (ing.amountMg / ing.rdaMg) * 100;
    const color =
      fulfillmentRate <= 100
        ? "bg-green-500"
        : fulfillmentRate <= 300
          ? "bg-orange-500"
          : "bg-red-500";

    return (
      <div key={ing.name} className={`p-2 rounded ${color}`}>
        <p className="text-xs text-white">{ing.name}</p>
        <p className="text-sm font-bold text-white">{fulfillmentRate}%</p>
      </div>
    );
  })}
</div>
```

色分け:

- 緑（100%以下）: 適正範囲
- オレンジ（100-300%）: やや過剰
- 赤（300%以上）: 過剰注意

**2. グループ内中央値表示**

```tsx
<div className="p-3 bg-gray-50 border rounded">
  <p className="text-xs text-gray-600">ビタミンCの中央値</p>
  <p className="text-lg font-bold text-gray-900">600mg/日</p>
  <p className="text-xs text-gray-500">
    この商品は中央値より
    <span className="font-semibold text-green-600">1.5倍多い</span>
  </p>
</div>
```

**3. 成分別コストグラフ**

Chart.jsまたはRechartsを使用:

```tsx
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={ingredientCostData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="costPerMg" fill="#8884d8" />
  </BarChart>
</ResponsiveContainer>
```

**期待効果**:

- 直感的な理解の向上
- 専門知識がなくても判断可能
- エンゲージメント向上

---

### フェーズ2.7-D: 高度な分析指標（2026年4月〜）

#### 目的

マルチビタミンの含有量比較精度をさらに向上。

#### 実装内容

**1. 生理学的重要度係数**

```typescript
interface NutritionalValueIndex {
  ingredient: string;
  amountMg: number;
  rdaMg: number;
  evidenceScore: number; // S=5, A=4, B=3, C=2, D=1
  safetyFactor: number; // UL超過で減点
  physiologicalImportance: number; // 成分の生理学的重要度
}

function calculateOverallValue(index: NutritionalValueIndex): number {
  // 総合価値 = (成分mg / RDA) × エビデンススコア × 安全性係数 × 重要度
  return (
    (index.amountMg / index.rdaMg) *
    index.evidenceScore *
    index.safetyFactor *
    index.physiologicalImportance
  );
}
```

**2. 時系列ランク変動分析**

- 価格履歴とランクの相関を分析
- 「買い時」のタイミングを提案
- ユーザーアラート機能との連携

**3. 他ユーザーの選択傾向**

- 同じ成分を探しているユーザーが選んだ商品
- レビュー分析（将来的）
- コミュニティ推薦

**期待効果**:

- 最も科学的で包括的な評価
- Suptia独自の差別化要因
- ユーザー満足度の最大化

---

### フェーズ3: AIによる最適化（2026年後半〜）

- GPT連携でユーザーの健康目標に応じた推薦
- 成分の相互作用を考慮した組み合わせ提案
- パーソナライズドランク表示

---

### 技術的補足

#### tolerance（許容誤差）の妥当性

現状: `tolerance = 0.001mg`

妥当性: ✅ 非常に適切

ただし将来:

- µg（マイクログラム）成分の比較精度を上げる際には調整の可能性あり
- ビタミンD（µg単位）、ビタミンB12（µg単位）など
- 必要に応じて `tolerance = 0.0001mg` に変更検討

---

### 実装優先順位

| フェーズ | 機能                     | 工数    | 優先度 | 開始予定   |
| -------- | ------------------------ | ------- | ------ | ---------- |
| 2.7-A    | 栄養価スコア導入         | 2-3週間 | 高     | 2026年1月  |
| 2.7-B    | 安全性統合（ULチェック） | 1-2週間 | 高     | 2026年2月  |
| 2.7-C    | UI/UX改善                | 2-3週間 | 中     | 2026年3月  |
| 2.7-D    | 高度な分析指標           | 3-4週間 | 低     | 2026年4月  |
| 3        | AI最適化                 | 未定    | 低     | 2026年後半 |

---

### まとめ

**現在の実装（v1.0.0）**:

- 透明性・説明可能性・公平性を完全に満たしている
- 微量成分の水増し対策が効果的
- ユーザーの直感と一致する評価

**将来の拡張**:

- RDA充足率ベースの栄養価評価
- 安全性（UL）との統合
- より直感的なUI/UX
- 科学的根拠に基づく総合評価

最終的な方向性は、**栄養価スコア（RDA × エビデンス × 安全性）への統合**に自然につながります。

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

**最終更新日**: 2025-11-15
**バージョン**: 1.1.0
**ドキュメント作成者**: Ryota

**更新履歴**:

- 2025-11-14: v1.0.0 - 初版作成（マルチビタミン対応コスパ計算実装）
- 2025-11-15: v1.1.0 - 今後の拡張予定を詳細化（フェーズ2.7-A/B/C/D追加）
