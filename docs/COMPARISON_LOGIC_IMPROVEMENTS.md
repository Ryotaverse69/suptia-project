# 含有量比較ロジック改善計画

**作成日**: 2025-11-16
**目的**: 現行の比較ロジックをさらに精密化し、Suptia独自アルゴリズムとして絶対的な差別化を実現

---

## 📊 現状評価

### ✅ 現行ロジックの強み

- **統計学的手法**: Trimmed Percentileによる外れ値対策
- **栄養学的根拠**: RDA/UL基準に基づく評価
- **データサイエンス**: 重み付け平均による総合評価
- **透明性**: すべての計算ロジックが説明可能
- **拡張性**: 新規成分・指標の追加が容易

**総合評価**: 市販サービスでもここまで精密なものはほぼない。トップレベルの品質。

---

## 🎯 改善提案（5つの重要ポイント）

### 1. パーセンタイル計算の精度向上 🔬

#### 現状の問題点

**現行実装** (`auto-calculate-tier-ranks.mjs` Line 234-258):

```javascript
const index = trimmedValues.findIndex((v) => v >= value);
const percentile = (index / trimmedValues.length) * 100;
```

**問題**:

- `>=` 演算子により、値の境界がブレる
- `findIndex` は最初の一致のみを拾うため、重複値が多い場合の識別が甘い
- 中央値周辺で分類が粗くなる

**具体例**:

```javascript
// 同じ価格が複数ある場合
prices = [¥500, ¥500, ¥500, ¥1000, ¥1500];
calculatePercentile(¥500, prices, true);
// 現状: index = 0 → 0%
// 期待: 3件あるので中央値 (1/5 = 20%) あたりが適切
```

#### 改善案

**方式A: 中央値への距離を使う順位方式**

```javascript
function calculatePercentileV2(value, values, lowerIsBetter = false) {
  const sorted = [...values].sort((a, b) => a - b);

  // 同じ値の範囲を特定
  const sameValueIndices = sorted
    .map((v, i) => (v === value ? i : -1))
    .filter((i) => i !== -1);

  if (sameValueIndices.length > 0) {
    // 同じ値の中央インデックスを使用
    const midIndex = sameValueIndices[Math.floor(sameValueIndices.length / 2)];
    const percentile = (midIndex / sorted.length) * 100;
    return lowerIsBetter ? 100 - percentile : percentile;
  }

  // 値が存在しない場合は補間
  const index = sorted.findIndex((v) => v > value);
  const percentile = index === -1 ? 100 : (index / sorted.length) * 100;
  return lowerIsBetter ? 100 - percentile : percentile;
}
```

**方式B: Bessel補正付き順位値（R-1 / N-1）**

```javascript
function calculatePercentileBessel(value, values, lowerIsBetter = false) {
  const sorted = [...values].sort((a, b) => a - b);
  const N = sorted.length;

  // 厳密な順位計算（平均順位）
  const sameValues = sorted.filter((v) => v === value);
  const lowerCount = sorted.filter((v) => v < value).length;
  const rank = lowerCount + (sameValues.length + 1) / 2;

  // Bessel補正: (R - 1) / (N - 1) * 100
  const percentile = N === 1 ? 50 : ((rank - 1) / (N - 1)) * 100;

  return lowerIsBetter ? 100 - percentile : percentile;
}
```

**推奨**: 方式B（Bessel補正）

- 統計学的に正確
- 重複値に強い
- 境界ケースでも安定

#### 実装優先度: 🔴 **高（Phase 1）**

**理由**: ランク精度に直接影響するため、最優先で改善すべき

---

### 2. 目的別の重み付け調整 🎯

#### 現状の問題点

**現行実装** (`auto-calculate-tier-ranks.mjs` Line 456-463):

```javascript
const overallScore =
  (rankValues[priceRank] +
    rankValues[costEffectivenessRank] +
    rankValues[contentRank] +
    rankValues[evidenceRank] +
    rankValues[safetyRank]) /
  5; // すべて均等（20%ずつ）
```

**問題**:

- すべての成分で同じ重み付けは最適ではない
- ユーザーの目的（ダイエット、美肌、健康維持など）によって重視する軸が異なる

**具体例**:

| 成分カテゴリ       | 重視すべき軸                 | 理由                       |
| ------------------ | ---------------------------- | -------------------------- |
| ビタミンC          | 含有量 > コスパ > 安全性     | 水溶性で過剰摂取リスク低い |
| ビタミンA          | 安全性 > エビデンス > 含有量 | 脂溶性で過剰摂取リスク高い |
| オメガ3脂肪酸      | エビデンス > 含有量 > コスパ | 効果に個人差、品質が重要   |
| プロバイオティクス | エビデンス > 安全性 > 含有量 | 菌株の科学的根拠が最重要   |
| マルチビタミン     | コスパ > 含有量 > エビデンス | 総合バランス重視           |

#### 改善案

**成分カテゴリ別重み付けマトリクス**:

```javascript
// データベース: data/category-weights.json
{
  "水溶性ビタミン": {
    "priceWeight": 0.15,
    "costEffectivenessWeight": 0.25,
    "contentWeight": 0.30,
    "evidenceWeight": 0.20,
    "safetyWeight": 0.10
  },
  "脂溶性ビタミン": {
    "priceWeight": 0.15,
    "costEffectivenessWeight": 0.20,
    "contentWeight": 0.20,
    "evidenceWeight": 0.20,
    "safetyWeight": 0.25  // 安全性を重視
  },
  "ミネラル": {
    "priceWeight": 0.15,
    "costEffectivenessWeight": 0.25,
    "contentWeight": 0.20,
    "evidenceWeight": 0.20,
    "safetyWeight": 0.20
  },
  "機能性成分": {
    "priceWeight": 0.10,
    "costEffectivenessWeight": 0.20,
    "contentWeight": 0.20,
    "evidenceWeight": 0.35,  // エビデンスを最重視
    "safetyWeight": 0.15
  },
  "マルチビタミン": {
    "priceWeight": 0.15,
    "costEffectivenessWeight": 0.30,
    "contentWeight": 0.25,
    "evidenceWeight": 0.15,
    "safetyWeight": 0.15
  }
}
```

**実装例**:

```javascript
// scripts/auto-calculate-tier-ranks.mjs に追加
import categoryWeights from "../data/category-weights.json";

function calculateWeightedOverallScore(ranks, ingredientCategory) {
  const weights =
    categoryWeights[ingredientCategory] || categoryWeights["ミネラル"]; // デフォルト

  const score =
    rankValues[ranks.priceRank] * weights.priceWeight +
    rankValues[ranks.costEffectivenessRank] * weights.costEffectivenessWeight +
    rankValues[ranks.contentRank] * weights.contentWeight +
    rankValues[ranks.evidenceRank] * weights.evidenceWeight +
    rankValues[ranks.safetyRank] * weights.safetyWeight;

  return score;
}
```

#### さらなる拡張: ユーザー目的別重み付け

**将来的な実装**（Phase 3以降）:

```javascript
// ユーザーが目的を選択
const userGoal = "美肌"; // "ダイエット", "筋力アップ", "免疫強化" など

const goalWeights = {
  美肌: {
    priceWeight: 0.1,
    costEffectivenessWeight: 0.2,
    contentWeight: 0.25,
    evidenceWeight: 0.3, // エビデンス重視
    safetyWeight: 0.15,
  },
  ダイエット: {
    priceWeight: 0.15,
    costEffectivenessWeight: 0.3,
    contentWeight: 0.2,
    evidenceWeight: 0.25,
    safetyWeight: 0.1,
  },
  // ...
};
```

#### 実装優先度: 🟡 **中（Phase 2）**

**理由**: 現状でも十分機能しているが、カテゴリ別最適化で精度が大幅向上

---

### 3. 成分名のゆらぎ対策 📚

#### 現状の問題点

**問題**:

- 同じ成分でも表記が異なる場合、別グループとして扱われる
- 例:
  - `ビタミンB2` vs `リボフラビン`（同一成分）
  - `Vitamin C` vs `ビタミンC`
  - `DHA` vs `ドコサヘキサエン酸`

**影響**:

- グループ化が正しく行われず、比較対象が減る
- ランク計算の精度が低下

#### 改善案

**成分標準化辞書の導入**:

```json
// data/ingredient-aliases.json
{
  "ビタミンC（アスコルビン酸）": {
    "canonical": "ビタミンC（アスコルビン酸）",
    "aliases": [
      "ビタミンC",
      "Vitamin C",
      "アスコルビン酸",
      "Ascorbic Acid",
      "L-アスコルビン酸",
      "VC"
    ]
  },
  "ビタミンB2": {
    "canonical": "ビタミンB2",
    "aliases": ["リボフラビン", "Riboflavin", "Vitamin B2", "VB2"]
  },
  "オメガ3脂肪酸（EPA・DHA）": {
    "canonical": "オメガ3脂肪酸（EPA・DHA）",
    "aliases": [
      "DHA",
      "EPA",
      "ドコサヘキサエン酸",
      "エイコサペンタエン酸",
      "Omega-3",
      "オメガ3",
      "フィッシュオイル",
      "Fish Oil"
    ]
  }
}
```

**実装例**:

```javascript
// lib/ingredient-normalizer.ts
import ingredientAliases from '../data/ingredient-aliases.json';

// エイリアス辞書を逆引き可能に構築
const aliasToCanonical = new Map();
Object.entries(ingredientAliases).forEach(([canonical, data]) => {
  aliasToCanonical.set(canonical, canonical);
  data.aliases.forEach(alias => {
    aliasToCanonical.set(alias.toLowerCase(), canonical);
  });
});

export function normalizeIngredientName(name: string): string {
  const normalized = aliasToCanonical.get(name.toLowerCase());
  return normalized || name; // 見つからない場合は元の名前を返す
}

// 使用例
const groupKey = normalizeIngredientName(ingredient.name);
// "ビタミンC" → "ビタミンC（アスコルビン酸）"
// "Vitamin C" → "ビタミンC（アスコルビン酸）"
// "リボフラビン" → "ビタミンB2"
```

**auto-calculate-tier-ranks.mjs への統合**:

```javascript
import { normalizeIngredientName } from "../lib/ingredient-normalizer";

// グループ化時に標準化
const normalizedName = normalizeIngredientName(ing.ingredient.name);

if (!ingredientGroups[normalizedName]) {
  ingredientGroups[normalizedName] = {
    name: normalizedName,
    products: [],
  };
}
```

#### 実装優先度: 🟡 **中（Phase 2）**

**理由**: データ品質向上に寄与するが、現状でも大きな問題は発生していない

---

### 4. UL判定の明示化 🛡️

#### 現状の問題点

**現行実装** (`IngredientComparison.tsx`):

```tsx
{
  exceedsUL && (
    <div className="bg-red-50 border-l-4 border-red-500 p-4">
      <h3 className="font-semibold text-red-800">
        ⚠️ 耐容上限量（UL）超過の可能性
      </h3>
    </div>
  );
}
```

**問題**:

- ULの種類（1日上限、サプリ上限、毎食上限）が明記されていない
- 「何の上限か」がユーザーに伝わりにくい

#### 改善案

**UIテキストの改善**:

```tsx
{
  exceedsUL && (
    <div className="bg-red-50 border-l-4 border-red-500 p-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        <h3 className="font-semibold text-red-800">
          ⚠️ 耐容上限量（UL: 1日の最大安全摂取量）超過の可能性
        </h3>
      </div>
      <p className="text-sm text-red-700 mt-2">
        この商品の推奨摂取量では、厚生労働省が定める1日の耐容上限量（UL）を超える可能性があります。
        長期的な摂取を検討される場合は、必ず医師または管理栄養士にご相談ください。
      </p>
      <p className="text-xs text-red-600 mt-2">
        ※ UL（Tolerable Upper Intake Level）:
        健康障害のリスクが無いとされる習慣的な摂取量の上限値（厚生労働省「日本人の食事摂取基準」より）
      </p>
    </div>
  );
}
```

**Sanityスキーマ拡張** (`packages/schemas/ingredient.ts`):

```typescript
{
  name: 'upperLimit',
  title: 'UL（耐容上限量）',
  type: 'number',
  description: '1日の耐容上限量（mg）。厚生労働省「日本人の食事摂取基準」に基づく。',
},
{
  name: 'upperLimitType',
  title: 'UL種類',
  type: 'string',
  options: {
    list: [
      { title: '1日上限（通常）', value: 'daily' },
      { title: 'サプリメント上限', value: 'supplement' },
      { title: '毎食上限', value: 'per_meal' },
    ],
  },
  description: 'ULの種類を指定',
},
{
  name: 'upperLimitNote',
  title: 'UL備考',
  type: 'text',
  description: 'ULに関する補足情報（例: "妊婦は0.24mg/日"）',
},
```

#### 実装優先度: 🟢 **低（Phase 3）**

**理由**: 現状でも警告は表示されており、緊急性は低い。UI改善として段階的に対応

---

### 5. Evidence Scoreのマルチビタミン対応 🔬

#### 現状の問題点

**現行実装** (`auto-calculate-tier-ranks.mjs` Line 200-218):

```javascript
// すべての成分のエビデンススコアを重み付け平均
for (const ing of ingredientScores) {
  const weight = ing.dailyAmount / totalDailyAmount;
  weightedEvidenceScore += ing.evidenceScore * weight;
}
```

**問題**:

- マルチビタミンの場合、微量成分（ビオチン、セレンなど）もエビデンススコアに影響
- コスパ計算では「トップ5方式」を採用しているが、エビデンススコアは全成分が対象
- 一貫性に欠ける

#### 改善案

**トップ5成分のみでエビデンススコアを計算**:

```javascript
function calculateProductScores(ingredients, servingsPerDay, isMultiVitamin) {
  let totalDailyAmount = 0;
  const ingredientScores = [];

  for (const ing of ingredients) {
    const dailyAmount = ing.amountMgPerServing * (servingsPerDay || 1);
    totalDailyAmount += dailyAmount;

    const evidenceScore = evidenceLevelToScore(ing.ingredient.evidenceLevel);
    const safetyScore = safetyLevelToScore(ing.ingredient.safetyLevel);

    ingredientScores.push({
      name: ing.ingredient.name,
      dailyAmount,
      evidenceScore,
      safetyScore,
    });
  }

  // マルチビタミンの場合、トップ5成分のみでスコア計算
  const targetScores = isMultiVitamin
    ? ingredientScores.sort((a, b) => b.dailyAmount - a.dailyAmount).slice(0, 5)
    : ingredientScores;

  const totalTargetAmount = targetScores.reduce(
    (sum, ing) => sum + ing.dailyAmount,
    0,
  );

  let weightedEvidenceScore = 0;
  let weightedSafetyScore = 0;

  for (const ing of targetScores) {
    const weight = ing.dailyAmount / totalTargetAmount;
    weightedEvidenceScore += ing.evidenceScore * weight;
    weightedSafetyScore += ing.safetyScore * weight;
  }

  return {
    evidenceScore: Math.round(weightedEvidenceScore * 100) / 100,
    safetyScore: Math.round(weightedSafetyScore * 100) / 100,
    overall: Math.round((weightedEvidenceScore + weightedSafetyScore) / 2),
  };
}
```

**呼び出し側の修正**:

```javascript
const calculatedScores = calculateProductScores(
  product.ingredients,
  product.servingsPerDay,
  isMultiVitamin(product.ingredients), // マルチビタミン判定を渡す
);
```

#### 実装優先度: 🟡 **中（Phase 2）**

**理由**: コスパ計算との一貫性向上。マルチビタミンの評価精度が向上

---

## 🗓️ 実装ロードマップ

### Phase 1: 精度向上（1週間以内）

| タスク                                | 優先度 | 工数    | 担当       |
| ------------------------------------- | ------ | ------- | ---------- |
| 1-1. Bessel補正付きパーセンタイル実装 | 🔴 高  | 1-2日   | 開発チーム |
| 1-2. テストケース作成・検証           | 🔴 高  | 0.5-1日 | QA         |
| 1-3. 既存商品の再計算・差分確認       | 🔴 高  | 0.5日   | 開発チーム |

### Phase 2: カテゴリ最適化（2週間以内）

| タスク                                           | 優先度 | 工数    | 担当       |
| ------------------------------------------------ | ------ | ------- | ---------- |
| 2-1. 成分カテゴリ別重み付けマトリクス設計        | 🟡 中  | 1-2日   | PM         |
| 2-2. category-weights.json 作成                  | 🟡 中  | 1日     | 開発チーム |
| 2-3. 重み付けロジック実装                        | 🟡 中  | 1-2日   | 開発チーム |
| 2-4. 成分名標準化辞書（ingredient-aliases.json） | 🟡 中  | 2-3日   | データ     |
| 2-5. 標準化ロジック実装                          | 🟡 中  | 1日     | 開発チーム |
| 2-6. Evidence Scoreトップ5対応                   | 🟡 中  | 0.5-1日 | 開発チーム |

### Phase 3: UI/UX改善（1ヶ月以内）

| タスク                            | 優先度 | 工数  | 担当       |
| --------------------------------- | ------ | ----- | ---------- |
| 3-1. UL警告テキスト改善           | 🟢 低  | 0.5日 | 開発チーム |
| 3-2. Sanityスキーマ拡張（UL種類） | 🟢 低  | 0.5日 | 開発チーム |
| 3-3. UL詳細情報の追加（70成分分） | 🟢 低  | 2-3日 | データ     |

### Phase 4: パーソナライズ（将来的）

| タスク                             | 優先度 | 工数    | 担当       |
| ---------------------------------- | ------ | ------- | ---------- |
| 4-1. ユーザー目的別重み付け設計    | 将来   | 2-3日   | PM         |
| 4-2. ユーザープロファイル機能      | 将来   | 1-2週間 | 開発チーム |
| 4-3. パーソナライズドランキングAPI | 将来   | 1週間   | 開発チーム |

---

## 📈 期待される効果

### Phase 1実装後

- **ランク精度**: ±5-10%の精度向上（特に中央値周辺）
- **重複値対応**: 同じ価格・含有量の商品でも正確な順位付け
- **ユーザー信頼性**: 統計学的に正確な評価による信頼性向上

### Phase 2実装後

- **カテゴリ最適化**: 成分特性に応じた適切な評価
- **グループ化精度**: 成分名ゆらぎによる取りこぼしを防止
- **一貫性**: コスパ・エビデンスの計算方法が統一

### Phase 3実装後

- **ユーザー理解**: UL警告の意味が明確に伝わる
- **安全性向上**: UL種類別の詳細な警告表示

### Phase 4実装後

- **パーソナライズ**: ユーザー目的に応じた最適な推薦
- **エンゲージメント**: ユーザーごとの価値観に合わせたランキング
- **差別化**: 競合にない独自機能

---

## 🎯 Suptia独自アルゴリズムとしての差別化

これらの改善を実装することで、Suptiaは以下の点で**絶対的な差別化**を実現します:

1. **統計学的正確性**: Bessel補正付きパーセンタイル（一般的な比較サイトは使っていない）
2. **栄養学的最適化**: 成分カテゴリ別の重み付け（科学的根拠に基づく）
3. **透明性**: すべての計算ロジックが説明可能（ブラックボックスではない）
4. **パーソナライズ**: ユーザー目的別の推薦（一般化されたランキングではない）
5. **安全性重視**: 厚生労働省基準に基づくUL警告（法令遵守）

**競合比較**:

| 機能                         | Suptia（改善後） | iHerb | Amazon | 楽天市場 |
| ---------------------------- | ---------------- | ----- | ------ | -------- |
| 統計学的パーセンタイル       | ✅               | ❌    | ❌     | ❌       |
| カテゴリ別重み付け           | ✅               | ❌    | ❌     | ❌       |
| 成分名標準化                 | ✅               | ⚠️    | ❌     | ❌       |
| UL警告（厚労省基準）         | ✅               | ❌    | ❌     | ❌       |
| マルチビタミン対応           | ✅（トップ5）    | ❌    | ❌     | ❌       |
| ユーザー目的別パーソナライズ | ✅（Phase 4）    | ❌    | ❌     | ❌       |

---

## 📝 次のステップ

1. **Phase 1の実装開始**（最優先）:
   - Bessel補正付きパーセンタイル関数の実装
   - ユニットテスト作成
   - 既存商品での動作検証

2. **成分カテゴリ分類の確認**:
   - 現在の70成分を以下にカテゴリ分類
     - 水溶性ビタミン
     - 脂溶性ビタミン
     - ミネラル
     - 機能性成分
     - マルチビタミン

3. **成分名エイリアス辞書の作成**:
   - 主要50成分のエイリアスリストアップ
   - `data/ingredient-aliases.json` 作成

---

**作成者**: Claude Code
**最終更新**: 2025-11-16
**ステータス**: ✅ Phase 1完了、✅ Phase 2完了、Phase 3以降は計画中

## 📋 実装状況

### ✅ Phase 1: 精度向上（完了 - 2025-11-16）

| タスク                           | ステータス | 完了日     | 成果                                    |
| -------------------------------- | ---------- | ---------- | --------------------------------------- |
| Bessel補正付きパーセンタイル実装 | ✅ 完了    | 2025-11-16 | 113商品のランクが更新、重複値の精度向上 |
| テストケース作成・検証           | ✅ 完了    | 2025-11-16 | 9/9テスト合格                           |
| 既存商品の再計算・差分確認       | ✅ 完了    | 2025-11-16 | 336商品再計算完了                       |

**コミット**: c19769cf

### ✅ Phase 2: カテゴリ最適化（完了 - 2025-11-16）

| タスク                               | ステータス | 完了日     | 成果                              |
| ------------------------------------ | ---------- | ---------- | --------------------------------- |
| 成分カテゴリ別重み付けマトリクス設計 | ✅ 完了    | 2025-11-16 | 7カテゴリ定義完了                 |
| category-weights.json作成            | ✅ 完了    | 2025-11-16 | 水溶性/脂溶性ビタミン、ミネラル等 |
| 重み付けロジック実装                 | ✅ 完了    | 2025-11-16 | カテゴリ別最適化実装              |
| 成分名標準化辞書                     | ✅ 完了    | 2025-11-16 | ingredient-normalizer.mjs作成     |
| 標準化ロジック実装                   | ✅ 完了    | 2025-11-16 | 56成分の正規化対応                |
| Evidence Scoreトップ5対応            | ✅ 完了    | 2025-11-16 | マルチビタミン一貫性確保          |

**テスト結果**: 224/224テスト合格、19商品のランク更新
**コミット**: ca1d7561

### ⏳ Phase 3: UI/UX改善（計画中）

優先度: 🟢 低（Phase 1・2で主要な精度向上は完了）
