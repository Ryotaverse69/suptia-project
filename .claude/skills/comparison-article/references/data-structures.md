# 比較記事データ構造

## 目次

1. [ARTICLE_DATA](#article_data)
2. [LEARNING_POINTS](#learning_points)
3. [QUICK_RECOMMENDATIONS](#quick_recommendations)
4. [INGREDIENT_TYPES](#ingredient_types)
5. [PURPOSE_RECOMMENDATIONS](#purpose_recommendations)
6. [SELECTION_CHECKLIST](#selection_checklist)
7. [DOSAGE_GUIDE](#dosage_guide)
8. [CAUTIONS](#cautions)
9. [FAQS](#faqs)
10. [RELATED_INGREDIENTS](#related_ingredients)
11. [Sanityクエリ](#sanityクエリ)

---

## ARTICLE_DATA

記事の基本情報。メタデータ・OGPに使用。

```tsx
const ARTICLE_DATA = {
  title: "【2025年最新】〇〇サプリおすすめ比較｜コスパ・品質で徹底分析",
  description:
    "〇〇サプリメントを価格・成分量・コスパ・安全性で徹底比較。mg単価から見た本当のコスパランキングと、目的別おすすめ商品を紹介。",
  publishedAt: "2025-01-15",
  updatedAt: new Date().toISOString().split("T")[0],
  ingredientName: "〇〇",
  ingredientSlug: "ingredient-slug",
  category: "ミネラル", // ビタミン / ミネラル / アミノ酸 / その他
  readingTime: "6分",
};
```

### タイトルパターン

```
【2025年最新】〇〇サプリおすすめ比較｜コスパ・品質で徹底分析
【2025年最新】〇〇サプリおすすめ比較｜形態別の吸収率で徹底分析
【2025年最新】〇〇サプリおすすめ比較｜種類・効果・選び方を解説
```

---

## LEARNING_POINTS

「この記事でわかること」セクション用。5項目程度。

```tsx
const LEARNING_POINTS = [
  "〇〇サプリの形態と吸収率の違い（ピコリン酸・グルコン酸・クエン酸など）",
  "目的別（免疫・男性機能・美肌・味覚）の最適な選び方",
  "コスパランキングTOP3と本当のmg単価",
  "効果的な摂取タイミングと注意すべき相互作用",
  "〇〇欠乏症を防ぐための正しい摂取法",
];
```

### UI実装

```tsx
<section
  className={`${liquidGlassClasses.light} rounded-[20px] p-6 mb-12 border`}
  style={{ borderColor: systemColors.cyan + "30" }}
>
  <h2 className={`${typography.title3} mb-4`}>この記事でわかること</h2>
  <ul className="space-y-3">
    {LEARNING_POINTS.map((item, i) => (
      <li key={i} className="flex items-start gap-3">
        <CheckCircle2
          size={20}
          className="shrink-0 mt-0.5"
          style={{ color: systemColors.cyan }}
        />
        <span style={{ color: appleWebColors.textPrimary }}>{item}</span>
      </li>
    ))}
  </ul>
</section>
```

---

## QUICK_RECOMMENDATIONS

「結論ファースト」セクション用。3-5項目。忙しいユーザーへの即答。

```tsx
const QUICK_RECOMMENDATIONS = [
  {
    condition: "吸収率重視なら",
    recommendation: "ピコリン酸亜鉛",
    reason: "研究で最も吸収率が高い。",
  },
  {
    condition: "コスパ重視なら",
    recommendation: "グルコン酸亜鉛",
    reason: "安価で効果は十分。",
  },
  {
    condition: "風邪対策なら",
    recommendation: "酢酸亜鉛トローチ",
    reason: "局所作用も期待。",
  },
  {
    condition: "胃が弱いなら",
    recommendation: "クエン酸亜鉛",
    reason: "胃への刺激が少ない。",
  },
];
```

### UI実装

```tsx
<section
  className="mb-12 rounded-[20px] p-6 md:p-8"
  style={{
    background: `linear-gradient(135deg, ${systemColors.cyan}15, ${systemColors.blue}15)`,
  }}
>
  <div className="flex items-start gap-4">
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: systemColors.cyan }}
    >
      <Lightbulb size={24} className="text-white" />
    </div>
    <div>
      <h2 className={`${typography.title3} mb-3`}>結論：迷ったらこれを選べ</h2>
      <ul className="space-y-2 text-[15px]">
        {QUICK_RECOMMENDATIONS.map((rec, i) => (
          <li key={i} style={{ color: appleWebColors.textPrimary }}>
            <strong>{rec.condition}</strong> → {rec.recommendation}。
            {rec.reason}
          </li>
        ))}
      </ul>
    </div>
  </div>
</section>
```

---

## INGREDIENT_TYPES

成分の種類と特徴。5-6種類程度を定義。

```tsx
interface IngredientType {
  name: string; // 日本語名
  nameEn: string; // 英語名
  absorption: string; // 吸収率: "◎ 高い" | "○ 普通" | "△ 低い"
  price: string; // 価格: "◎ 安い" | "○ 中程度" | "△ 高い"
  sideEffect: string; // 副作用: "◎ 少ない" | "○ 中程度" | "△ やや多い"
  best: string; // おすすめユースケース
  description: string; // 説明文
  color: string; // アクセントカラー（systemColors.xxxから選択）
}

const INGREDIENT_TYPES: IngredientType[] = [
  {
    name: "ピコリン酸亜鉛",
    nameEn: "Zinc Picolinate",
    absorption: "◎ 最高",
    price: "△ やや高い",
    sideEffect: "◎ 少ない",
    best: "吸収率を最重視する方",
    description: "ピコリン酸と結合した形態。研究で最も吸収率が高いとされる。",
    color: systemColors.purple,
  },
  // ... 他の形態
];
```

### UI実装

```tsx
<div
  className={`${liquidGlassClasses.light} rounded-[16px] p-5 border-l-4`}
  style={{ borderLeftColor: type.color }}
>
  <div className="flex flex-col md:flex-row md:items-center gap-4">
    <div className="flex-1">
      <h3
        className="font-bold text-[17px] mb-1"
        style={{ color: appleWebColors.textPrimary }}
      >
        {type.name}
      </h3>
      <p
        className="text-[13px] mb-2"
        style={{ color: appleWebColors.textTertiary }}
      >
        {type.nameEn}
      </p>
      <p
        className="text-[14px]"
        style={{ color: appleWebColors.textSecondary }}
      >
        {type.description}
      </p>
    </div>
    <div className="flex flex-wrap gap-2">
      <span
        className="text-[13px] px-2 py-1 rounded-full"
        style={{ backgroundColor: appleWebColors.sectionBackground }}
      >
        吸収: {type.absorption}
      </span>
      <span
        className="text-[13px] px-2 py-1 rounded-full"
        style={{ backgroundColor: appleWebColors.sectionBackground }}
      >
        価格: {type.price}
      </span>
      <span
        className="text-[13px] px-2 py-1 rounded-full"
        style={{ backgroundColor: appleWebColors.sectionBackground }}
      >
        副作用: {type.sideEffect}
      </span>
    </div>
  </div>
  <div
    className="mt-3 pt-3 border-t text-[13px]"
    style={{ borderColor: appleWebColors.borderSubtle }}
  >
    <span style={{ color: type.color }}>
      <Target size={14} className="inline mr-1" />
      おすすめ: {type.best}
    </span>
  </div>
</div>
```

---

## PURPOSE_RECOMMENDATIONS

目的別おすすめ。4-5パターン。

```tsx
interface PurposeRecommendation {
  purpose: string; // 目的
  icon: LucideIcon; // lucide-reactアイコン
  emoji: string; // 絵文字（控えめに1つ）
  description: string; // 説明
  recommendation: string; // おすすめ形態
  reason: string; // 理由
  timing: string; // 摂取タイミング
  dosage: string; // 摂取量目安
  tips: string; // ワンポイントアドバイス
}

const PURPOSE_RECOMMENDATIONS: PurposeRecommendation[] = [
  {
    purpose: "免疫力を高めたい",
    icon: Shield,
    emoji: "🛡️",
    description: "風邪をひきにくくしたい、体調を崩しやすい",
    recommendation: "グルコン酸亜鉛 or 酢酸亜鉛",
    reason: "風邪の予防・期間短縮に関する研究が最も多い形態。",
    timing: "毎日、食後に",
    dosage: "15〜25mg/日",
    tips: "ビタミンCとの併用で相乗効果。風邪のひき始めに増量も効果的。",
  },
  // ... 他の目的
];
```

### 一般的な目的パターン

- 免疫力強化
- 男性機能・ホルモンバランス
- 肌・髪・爪の健康（美容）
- 味覚障害の改善
- スポーツ・筋トレ
- コスパ重視

---

## SELECTION_CHECKLIST

選び方チェックリスト。4カテゴリ×3項目程度。

```tsx
interface SelectionChecklist {
  category: string;
  items: Array<{
    text: string;
    important?: boolean; // 重要項目はハイライト
  }>;
}

const SELECTION_CHECKLIST: SelectionChecklist[] = [
  {
    category: "形態（吸収率）",
    items: [
      { text: "目的に合った形態を選ぶ（上記参照）", important: true },
      { text: "吸収率重視ならピコリン酸・クエン酸" },
      { text: "コスパ重視なら酸化物（吸収率は低い）" },
    ],
  },
  {
    category: "含有量",
    items: [
      { text: "「元素量」を確認（化合物全体量ではない）", important: true },
      { text: "1日15-30mgが一般的な目安" },
      { text: "上限40mg/日を超えないこと" },
    ],
  },
  {
    category: "品質・添加物",
    items: [
      { text: "第三者機関の品質テスト" },
      { text: "不要な添加物・着色料の有無" },
      { text: "GMP認証施設での製造" },
    ],
  },
  {
    category: "続けやすさ",
    items: [
      { text: "形状（錠剤・カプセル・グミ）" },
      { text: "1日あたりのコスト" },
      { text: "銅を含む製品か確認（長期摂取の場合）" },
    ],
  },
];
```

### UI実装

```tsx
<div className="grid md:grid-cols-2 gap-4">
  {SELECTION_CHECKLIST.map((section) => (
    <div
      key={section.category}
      className={`${liquidGlassClasses.light} rounded-[16px] p-5 border`}
      style={{ borderColor: appleWebColors.borderSubtle }}
    >
      <h3 className="text-[15px] font-semibold mb-3">{section.category}</h3>
      <ul className="space-y-2">
        {section.items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <CheckCircle2
              size={16}
              className="flex-shrink-0 mt-0.5"
              style={{ color: systemColors.green }}
            />
            <span className="text-[14px]">
              {item.text}
              {item.important && (
                <span
                  className="ml-1 text-[11px] px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: systemColors.cyan + "20",
                    color: systemColors.cyan,
                  }}
                >
                  重要
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  ))}
</div>
```

---

## DOSAGE_GUIDE

目的別摂取量ガイド。テーブル形式で表示。

```tsx
interface DosageGuide {
  purpose: string; // 目的
  amount: string; // 摂取量
  frequency: string; // 摂取頻度
  timing: string; // タイミング
  note: string; // 備考
}

const DOSAGE_GUIDE: DosageGuide[] = [
  {
    purpose: "一般的な健康維持",
    amount: "10〜15mg/日",
    frequency: "1日1回",
    timing: "食後",
    note: "空腹時は避ける",
  },
  {
    purpose: "免疫強化・風邪予防",
    amount: "15〜25mg/日",
    frequency: "1日1〜2回",
    timing: "食後",
    note: "風邪のひき始めに増量も",
  },
  {
    purpose: "男性機能・筋力増強",
    amount: "25〜30mg/日",
    frequency: "1日1〜2回",
    timing: "食後",
    note: "マグネシウム・D3と併用で効果的",
  },
  // ... 他の目的
];
```

### UI実装（テーブル）

```tsx
<div className="overflow-x-auto">
  <table className="w-full text-[14px]">
    <thead>
      <tr
        className="border-b"
        style={{ borderColor: appleWebColors.borderSubtle }}
      >
        <th className="text-left py-3 px-4 font-bold">目的</th>
        <th className="text-left py-3 px-4 font-bold">1日の目安</th>
        <th className="text-left py-3 px-4 font-bold">回数</th>
        <th className="text-left py-3 px-4 font-bold">備考</th>
      </tr>
    </thead>
    <tbody>
      {DOSAGE_GUIDE.map((guide, index) => (
        <tr
          key={index}
          className="border-b"
          style={{ borderColor: appleWebColors.borderSubtle }}
        >
          <td className="py-3 px-4">{guide.purpose}</td>
          <td
            className="py-3 px-4 font-bold"
            style={{ color: systemColors.cyan }}
          >
            {guide.amount}
          </td>
          <td className="py-3 px-4">{guide.frequency}</td>
          <td
            className="py-3 px-4 text-[13px]"
            style={{ color: appleWebColors.textTertiary }}
          >
            {guide.note}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

---

## CAUTIONS

注意点・副作用。4-5項目。

```tsx
interface Caution {
  title: string;
  description: string;
  severity: "high" | "medium" | "low"; // high=赤, medium=オレンジ, low=黄
}

const CAUTIONS: Caution[] = [
  {
    title: "銅欠乏症に注意",
    description:
      "1日50mg以上を長期摂取すると銅の吸収を阻害。銅を含む製品を選ぶか、銅を別途摂取を。",
    severity: "high",
  },
  {
    title: "空腹時の摂取は避ける",
    description:
      "胃腸障害（吐き気、腹痛）の原因に。必ず食事と一緒に摂取することを推奨。",
    severity: "medium",
  },
  // ... 他の注意点
];
```

### UI実装

```tsx
<div
  className={`rounded-[16px] p-5 border-l-4`}
  style={{
    borderLeftColor:
      caution.severity === "high" ? systemColors.red : systemColors.orange,
    backgroundColor:
      caution.severity === "high"
        ? systemColors.red + "08"
        : systemColors.orange + "08",
  }}
>
  <div className="flex items-start gap-3">
    <AlertTriangle
      size={20}
      className="shrink-0 mt-0.5"
      style={{
        color:
          caution.severity === "high" ? systemColors.red : systemColors.orange,
      }}
    />
    <div>
      <h3 className="font-bold text-[15px] mb-1">{caution.title}</h3>
      <p
        className="text-[14px]"
        style={{ color: appleWebColors.textSecondary }}
      >
        {caution.description}
      </p>
    </div>
  </div>
</div>
```

---

## FAQS

よくある質問。5-7問。Schema.org FAQPage対応。

```tsx
interface FAQ {
  question: string;
  answer: string; // 200-400文字程度
}

const FAQS: FAQ[] = [
  {
    question: "〇〇は1日どのくらい摂取すればいいですか？",
    answer:
      "厚生労働省の推奨量は成人男性で11mg、成人女性で8mgです。サプリメントでは一般的に15〜30mgが使用されます。上限摂取量は40mg/日で、これを超えると副作用のリスクが高まります。",
  },
  {
    question: "〇〇サプリを飲むタイミングは？",
    answer:
      "食事と一緒に摂取するのがベストです。空腹時に摂取すると胃腸障害（吐き気、腹痛）を起こすことがあります。朝食後または夕食後が一般的なタイミングです。",
  },
  // ... 他のQ&A
];
```

### FAQ作成のポイント

- 検索されやすい質問形式（「〇〇は」「〇〇で」から始める）
- 具体的で実用的な回答
- 数値・根拠を含める
- 200-400文字程度の回答
- Schema.org構造化データに対応

---

## RELATED_INGREDIENTS

関連成分。サイト内回遊促進用。4種類程度。

```tsx
interface RelatedIngredient {
  name: string;
  slug: string;
  emoji: string;
  reason: string; // 一緒に摂るメリット
}

const RELATED_INGREDIENTS: RelatedIngredient[] = [
  {
    name: "マグネシウム",
    slug: "magnesium",
    emoji: "💫",
    reason: "ZMA配合で筋肉・睡眠をサポート",
  },
  {
    name: "ビタミンD",
    slug: "vitamin-d",
    emoji: "☀️",
    reason: "男性ホルモン生成に相乗効果",
  },
  {
    name: "ビタミンC",
    slug: "vitamin-c",
    emoji: "🍊",
    reason: "免疫機能をダブルでサポート",
  },
  {
    name: "銅",
    slug: "copper",
    emoji: "🔶",
    reason: "長期亜鉛摂取時のバランスに必須",
  },
];
```

### UI実装

```tsx
<div className="grid md:grid-cols-2 gap-4">
  {RELATED_INGREDIENTS.map((ingredient) => (
    <Link
      key={ingredient.slug}
      href={`/ingredients/${ingredient.slug}`}
      className={`${liquidGlassClasses.light} rounded-[16px] p-4 flex items-center gap-4 border transition-all hover:shadow-md`}
      style={{ borderColor: appleWebColors.borderSubtle }}
    >
      <span className="text-2xl">{ingredient.emoji}</span>
      <div className="flex-1">
        <h3 className="font-bold text-[15px]">{ingredient.name}</h3>
        <p
          className="text-[13px]"
          style={{ color: appleWebColors.textSecondary }}
        >
          {ingredient.reason}
        </p>
      </div>
      <ArrowRight size={16} style={{ color: appleWebColors.textSecondary }} />
    </Link>
  ))}
</div>
```

---

## Sanityクエリ

商品データ取得クエリ。

```tsx
interface Product {
  _id: string;
  name: string;
  priceJPY: number;
  servingsPerContainer: number;
  servingsPerDay: number;
  externalImageUrl?: string;
  slug: { current: string };
  source?: string;
  tierRatings?: {
    priceRank?: string;
    costEffectivenessRank?: string;
    overallRank?: string;
  };
  badges?: string[];
  ingredients?: Array<{
    amountMgPerServing: number;
    ingredient?: { name: string };
  }>;
}

async function getProducts(ingredientSlug: string): Promise<Product[]> {
  const query = `*[_type == "product" && availability == "in-stock" && references(*[_type == "ingredient" && slug.current == $slug]._id)] | order(priceJPY asc)[0...20]{
    _id,
    name,
    priceJPY,
    servingsPerContainer,
    servingsPerDay,
    externalImageUrl,
    slug,
    source,
    tierRatings,
    badges,
    ingredients[]{
      amountMgPerServing,
      ingredient->{ name }
    }
  }`;

  try {
    const products = await sanity.fetch(query, { slug: ingredientSlug });
    return products || [];
  } catch (error) {
    console.error(`Failed to fetch ${ingredientSlug} products:`, error);
    return [];
  }
}
```

### コスト計算

```tsx
import { calculateEffectiveCostPerDay } from "@/lib/cost";

const productsWithCost = products
  .filter(
    (p) => p.priceJPY > 0 && p.servingsPerContainer > 0 && p.servingsPerDay > 0,
  )
  .map((product) => ({
    ...product,
    effectiveCostPerDay: calculateEffectiveCostPerDay({
      priceJPY: product.priceJPY,
      servingsPerContainer: product.servingsPerContainer,
      servingsPerDay: product.servingsPerDay,
    }),
  }))
  .sort((a, b) => a.effectiveCostPerDay - b.effectiveCostPerDay);
```
