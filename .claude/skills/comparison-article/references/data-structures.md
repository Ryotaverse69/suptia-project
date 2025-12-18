# 比較記事データ構造

## 目次

1. [ARTICLE_DATA](#article_data)
2. [INGREDIENT_TYPES](#ingredient_types)
3. [PURPOSE_RECOMMENDATIONS](#purpose_recommendations)
4. [SELECTION_CHECKLIST](#selection_checklist)
5. [DOSAGE_GUIDE](#dosage_guide)
6. [CAUTIONS](#cautions)
7. [FAQS](#faqs)
8. [Sanityクエリ](#sanityクエリ)

---

## ARTICLE_DATA

記事の基本情報。

```tsx
const ARTICLE_DATA = {
  title: "【2025年最新】〇〇サプリおすすめ比較｜コスパ・品質で徹底分析",
  description:
    "〇〇サプリメントを価格・成分量・コスパ・安全性で徹底比較。mg単価から見た本当のコスパランキングと、目的別おすすめ商品を紹介。",
  publishedAt: "2025-01-15",
  updatedAt: new Date().toISOString().split("T")[0],
  ingredientName: "〇〇",
  ingredientSlug: "ingredient-slug",
};
```

---

## INGREDIENT_TYPES

成分の種類と特徴。5種類程度を定義。

```tsx
const INGREDIENT_TYPES = [
  {
    name: "タイプ名",
    nameEn: "Type Name",
    description: "特徴の説明文",
    absorption: "高", // 吸収率: 高/中/低
    price: "安価", // 価格帯: 安価/中程度/高価
    stomach: "やさしい", // 胃への負担: やさしい/普通/負担あり
    best: "〇〇な人向け", // おすすめ対象
    color: systemColors.green,
    icon: Zap, // lucide-react アイコン
  },
  // ... 他のタイプ
];
```

### ビタミンC例

- アスコルビン酸（純粋型）
- 緩衝型（バッファード）
- リポソーム型
- タイムリリース型
- 天然由来型

---

## PURPOSE_RECOMMENDATIONS

目的別おすすめ。5パターン程度。

```tsx
const PURPOSE_RECOMMENDATIONS = [
  {
    purpose: "コスパ重視",
    icon: DollarSign,
    color: systemColors.green,
    recommendation: "アスコルビン酸タイプ",
    reason: "効果は同じで最安。1日10円以下も可能。",
    products: ["商品A", "商品B"],
  },
  // ... 他の目的
];
```

### 一般的な目的パターン

- コスパ重視
- 胃にやさしい
- 最高の吸収率
- 忙しい人向け
- 初めての方

---

## SELECTION_CHECKLIST

購入前チェックリスト。5項目程度。

```tsx
const SELECTION_CHECKLIST = [
  {
    title: "1日の摂取量は適切か",
    description: "厚労省推奨は成人100mg。目的に応じて500-2000mgが一般的。",
    important: true, // 重要項目はtrueでハイライト
  },
  // ... 他の項目
];
```

### 共通チェック項目

- 摂取量の確認
- 原材料表示の確認
- 添加物の確認
- 返金保証の有無
- 継続コストの計算

---

## DOSAGE_GUIDE

目的別摂取量ガイド。

```tsx
const DOSAGE_GUIDE = [
  {
    purpose: "健康維持",
    amount: "100-200mg",
    timing: "朝食後",
    note: "厚労省推奨量を満たす基本量",
  },
  // ... 他の目的
];
```

### ビタミンC摂取量例

| 目的     | 摂取量      | タイミング   |
| -------- | ----------- | ------------ |
| 健康維持 | 100-200mg   | 朝食後       |
| 風邪予防 | 500-1000mg  | 朝・夕に分割 |
| 美肌     | 1000-2000mg | 食後に分割   |
| 喫煙者   | +35mg追加   | 通常量に加算 |

---

## CAUTIONS

注意点・副作用。5項目程度。

```tsx
const CAUTIONS = [
  {
    title: "過剰摂取時の消化器症状",
    description: "2000mg以上で下痢、腹痛が起こる可能性。体調に合わせて調整を。",
    severity: "warning", // warning | info
  },
  // ... 他の注意点
];
```

---

## FAQS

よくある質問。Schema.org FAQPage対応。7問程度。

```tsx
const FAQS = [
  {
    question: "〇〇サプリはいつ飲むのが効果的？",
    answer:
      "食後の服用がおすすめです。空腹時は胃への負担が大きくなる場合があります。",
  },
  // ... 他のQ&A
];
```

### FAQ作成のポイント

- 検索されやすい質問形式
- 具体的で実用的な回答
- 200-300文字程度の回答
- Schema.org構造化データに対応

---

## Sanityクエリ

商品データ取得クエリ。

```tsx
async function getProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && references(*[_type == "ingredient" && slug.current == $slug]._id)] | order(effectiveCostPerDay asc) {
    _id,
    name,
    slug,
    price,
    servingSize,
    dailyServings,
    ecSite,
    affiliateUrl,
    imageUrl,
    "ingredients": ingredients[]->{
      name,
      slug,
      amountPerServing,
      unit
    }
  }`;

  return sanity.fetch(query, { slug: "ingredient-slug" });
}
```

### Product型定義

```tsx
interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  servingSize: number;
  dailyServings: number;
  ecSite: string;
  affiliateUrl: string;
  imageUrl?: string;
  ingredients: {
    name: string;
    slug: { current: string };
    amountPerServing: number;
    unit: string;
  }[];
}
```
