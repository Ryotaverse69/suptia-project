# コスパ比較ロジック改善実装ドキュメント

**実装日**: 2025-11-14
**バージョン**: 1.0.0
**担当**: Ryota

---

## 📋 改善概要

Suptiaのコストパフォーマンス比較機能において、ユーザーの理解を深めるためのUI改善を実施しました。
コアロジックは変更せず、説明の追加とツールチップによる情報提供を強化しました。

---

## 🎯 実装した3つの改善

### 1️⃣ 価格ランク vs コスパランクの明確化

**問題点**:

- ユーザーが「価格ランク（💰）」と「コスパランク（💡）」の違いを理解しにくい
- 両方とも「安さ」に関連するため混同される可能性

**実装内容**:

#### `CostEffectivenessDetail.tsx`に説明セクション追加

```tsx
<div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
  <div className="flex items-start gap-2">
    <Tooltip
      content={
        <div className="text-xs leading-relaxed">
          <p className="font-semibold mb-1">💰 価格ランク vs 💡 コスパランク</p>
          <p className="mb-2">
            <span className="font-semibold">価格ランク:</span>{" "}
            支払う金額の安さを評価
          </p>
          <p>
            <span className="font-semibold">コスパランク:</span>{" "}
            1mgあたりの価格で成分効率を評価
          </p>
        </div>
      }
      icon
    />
    <div className="flex-1">
      <h3 className="text-sm font-semibold text-blue-900 mb-1">
        コスパランクとは？
      </h3>
      <p className="text-xs text-blue-800 leading-relaxed">
        成分量（mg）あたりの価格効率を、同じ成分を含む他商品と相対比較した評価です。
        価格が安くても成分量が少なければコスパは低くなります。
      </p>
    </div>
  </div>
</div>
```

#### `TierBadge.tsx`の各バッジにツールチップ追加

```tsx
const badges = [
  {
    icon: "💰",
    label: "価格",
    rank: ratings.priceRank,
    description: "他商品との価格比較",
    tooltip:
      "支払う金額の安さを、同じ成分を含む他商品と相対比較した評価です。商品価格そのものの安さを示します。",
  },
  {
    icon: "💡",
    label: "コスパ",
    rank: ratings.costEffectivenessRank,
    description: "成分量あたりの価格効率",
    tooltip:
      "1mgあたりの価格で、成分効率を評価します。価格が安くても成分量が少なければコスパは低くなります。",
  },
  // ...
];
```

**効果**:

- ユーザーが各ランクの意味を正確に理解できる
- 商品選択時の判断材料が明確になる

---

### 2️⃣ 複合サプリのコスパ表示改善

**問題点**:

- 複数成分を含む商品で、どの成分のコストを見ているか不明確
- 総成分量で計算すると、主成分のコスパが見えにくい

**実装内容**:

#### `CostEffectivenessDetail.tsx`のpropsに`ingredients`配列を追加

```tsx
interface Ingredient {
  name: string;
  amountMgPerServing: number;
  isPrimary?: boolean; // 主成分フラグ
}

interface CostEffectivenessDetailProps {
  currentProduct: {
    // ...
    ingredients?: Ingredient[]; // 全成分情報（複合サプリ対応）
  };
  // ...
}
```

#### 主成分コスト + 全成分コストの両方を表示

```tsx
{
  /* 複合サプリの場合の追加情報 */
}
{
  isMultiIngredient && currentProduct.ingredients && (
    <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
      <h3 className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-1">
        複合サプリメントの詳細
        <Tooltip
          content={
            <div className="text-xs leading-relaxed">
              <p>
                この商品は複数の成分を含んでいます。
                主成分と全成分でコストを分けて表示しています。
              </p>
            </div>
          }
          icon
        />
      </h3>

      {/* 成分リスト */}
      <div className="mb-3 space-y-1">
        {currentProduct.ingredients.map((ing, index) => (
          <div
            key={index}
            className="text-xs text-purple-800 flex justify-between"
          >
            <span>
              {ing.name}
              {ing.isPrimary && (
                <span className="ml-1 px-1.5 py-0.5 bg-purple-200 text-purple-900 rounded text-[10px] font-semibold">
                  主成分
                </span>
              )}
            </span>
            <span className="font-mono">{ing.amountMgPerServing}mg / 回</span>
          </div>
        ))}
      </div>

      {/* コスト比較 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-white border border-purple-300 rounded">
          <p className="text-[10px] text-purple-700 mb-1">
            主成分あたりのコスト
          </p>
          <p className="text-lg font-bold text-purple-900">
            ¥{currentCostPerMg.toFixed(2)}/mg
          </p>
          <p className="text-[10px] text-purple-600 mt-0.5">
            {primaryIngredient?.name}のコスト
          </p>
        </div>

        <div className="p-3 bg-white border border-pink-300 rounded">
          <p className="text-[10px] text-pink-700 mb-1">
            全成分合計あたりのコスト
          </p>
          <p className="text-lg font-bold text-pink-900">
            ¥{currentCostPerMgAllIngredients.toFixed(2)}/mg
          </p>
          <p className="text-[10px] text-pink-600 mt-0.5">
            {currentProduct.ingredients.length}成分の合計コスト
          </p>
        </div>
      </div>
    </div>
  );
}
```

**効果**:

- 複合サプリでも主成分のコスパが一目で分かる
- 全成分の価値を総合的に判断できる
- ユーザーが自分のニーズに応じて比較できる

**使用例**:

```
例: ビタミンC 1000mg + 亜鉛 15mg の複合サプリ（¥1,980）

┌─────────────────────────────────────────────┐
│ 複合サプリメントの詳細                          │
├─────────────────────────────────────────────┤
│ 成分リスト:                                    │
│ ・ビタミンC [主成分] ............. 1000mg / 回 │
│ ・亜鉛 ........................... 15mg / 回   │
│ ・合計 .........................  1015mg / 回  │
│                                               │
│ 主成分あたりのコスト   全成分合計あたりのコスト   │
│ ¥7.92/mg              ¥7.85/mg                │
│ ビタミンCのコスト      2成分の合計コスト          │
└─────────────────────────────────────────────┘
```

---

### 3️⃣ ランク変動理由の説明

**問題点**:

- 新商品追加で既存商品のランクが変わることがあるが、理由が不明
- パーセンタイル方式による相対評価のため、商品数の変化で順位が変動

**実装内容**:

#### ランクバッジにツールチップ追加

```tsx
<Tooltip
  content={
    <div className="text-xs leading-relaxed">
      <p className="font-semibold mb-1">ランク判定について</p>
      {totalProductsInCategory > 0 ? (
        <p>
          同じ成分を含む{totalProductsInCategory}商品中の相対評価です。
          新商品の追加でランクが変動することがあります。
        </p>
      ) : (
        <p>
          同じ成分を含む商品の中での相対評価です。
          商品数の変化でランクが変動することがあります。
        </p>
      )}
    </div>
  }
  icon
/>
```

#### `totalProductsInCategory`プロップを追加

```tsx
interface CostEffectivenessDetailProps {
  // ...
  totalProductsInCategory?: number; // 同一成分カテゴリの商品総数
  // ...
}
```

**効果**:

- ランク変動の理由をユーザーが理解できる
- 相対評価であることを明示し、混乱を防ぐ
- 商品数の増加に伴うランク変動への不信感を軽減

---

## 🛠️ 実装ファイル

### 新規作成

- `/apps/web/src/components/ui/Tooltip.tsx`
  - 汎用ツールチップコンポーネント
  - 4方向（top/bottom/left/right）対応
  - アイコンのみ表示モード対応

### 変更ファイル

1. `/apps/web/src/components/CostEffectivenessDetail.tsx`
   - 説明セクション追加
   - 複合サプリ対応（主成分 + 全成分コスト表示）
   - ランク変動理由のツールチップ追加

2. `/apps/web/src/components/ui/TierBadge.tsx`
   - 各バッジにツールチップ追加
   - 価格ランク vs コスパランクの説明強化

---

## 🧪 テスト結果

```bash
✅ TypeScript型チェック: パス
✅ ESLint: No warnings or errors
✅ テスト: 224/224 パス
```

---

## 📊 実装前後の比較

| 項目               | 実装前                           | 実装後                                   |
| ------------------ | -------------------------------- | ---------------------------------------- |
| 価格ランクの説明   | "他商品との価格比較"のみ         | 詳細なツールチップ + 説明セクション      |
| コスパランクの説明 | "成分量あたりの価格効率"のみ     | 詳細なツールチップ + 説明セクション      |
| 複合サプリ対応     | 総成分量のみ表示                 | 主成分 + 全成分の両方を表示              |
| ランク変動の説明   | なし                             | 相対評価であることを明示、商品数を表示   |
| ツールチップ       | なし                             | 全評価軸にツールチップ実装               |
| ユーザーの理解度   | 中程度（混乱の可能性あり）       | 高い（明確な説明により混乱を防止）       |
| 複合サプリの透明性 | 低い（どの成分のコストか不明確） | 高い（主成分と全成分を明確に分離）       |
| 相対評価の透明性   | 低い（理由が不明）               | 高い（商品数と相対評価であることを明示） |

---

## 🚀 今後の拡張予定

### フェーズ2: データ連携

- Sanityスキーマに`ingredients`配列を追加
- 商品同期スクリプトで複数成分を自動抽出
- `totalProductsInCategory`を動的に計算

### フェーズ3: 高度な分析

- 成分別コストのグラフ表示
- 時系列でのランク変動グラフ
- 他ユーザーの選択傾向を表示

---

## 📝 備考

### 後方互換性

- `ingredientAmount`プロップは後方互換性のため保持
- `ingredients`配列が存在しない場合は従来通りの動作

### パフォーマンス

- ツールチップは`useState`によるクライアントサイドレンダリング
- 計算ロジックは変更なし（既存の最適化を維持）

### アクセシビリティ

- ツールチップに`cursor-help`を適用
- ホバーで詳細情報を提供

---

**最終更新日**: 2025-11-14
**ドキュメント作成者**: Ryota
