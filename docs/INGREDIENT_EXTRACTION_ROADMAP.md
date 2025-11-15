# 成分量データ抽出ロジック 改善ロードマップ

**最終更新**: 2025-11-15
**現状データカバー率**: 80.4% (270/336件) ← 76.2%から**+4.2%改善** ✅
**目標**: 98-100%

---

## ✅ 完了した改善項目（2025-11-15実装）

### フェーズ1-4: 高優先度項目完了

1. ✅ **優先順位スコアリング方式** - Priority Item 1
   - ExtractionCandidate インターフェース導入
   - 7段階の優先度（100, 90, 80, 70, 60, 55, 50）
   - コミット: 2fef38e3

2. ✅ **エイリアス辞書外部管理** - Priority Item 2
   - `ingredient-aliases.json` 作成（26成分、200+エイリアス）
   - normalizeIngredientName() 関数実装
   - コミット: 9369999e

3. ✅ **商品説明解析強化** - Priority Item 3
   - extractFromDescription() 関数実装
   - allIngredients フィールドからの抽出対応
   - コミット: 4d88a0a8

4. ✅ **IU/%DV単位国際化** - Priority Item 4
   - IU→mg 変換テーブル（ビタミンA/D/E）
   - %DV→mg 変換（RDA基準）
   - コミット: 657aa4fc

5. ✅ **EC同期スクリプトallIngredients自動設定** - 追加実装
   - 楽天・Yahoo同期スクリプト改善
   - 220件の既存商品一括更新
   - コミット: 4d9abb96

6. ✅ **成分名スコアリング機能** - Priority Item 6
   - calculateMatchScore() 関数実装（誤抽出防止）
   - スコアリング基準: 完全一致(+100), 単語境界(+50), 部分一致(+30), 数値単位(+20), 接尾語(+20), 誘導体(-50)
   - 信頼できるマッチ閾値: 50点以上
   - テスト: 13件全てパス（誘導体検出含む）
   - コミット: c407df4d

7. ✅ **フォールバック階層の統一** - Priority Item 7
   - extractIngredientAmountWithFallback() 関数実装
   - 抽出階層の明確化: 商品名(0.90) → 商品説明(0.85) → AI(0.70) → 手動(1.00)
   - IngredientAmountExtractionResult型拡張（method, pattern フィールド追加）
   - テスト: 5件全てパス（階層テスト含む）
   - コミット: bd418857

**成果**: データカバレッジ 76.2% → 80.4% (+4.2%, +14商品) ＋ 誤抽出防止 ＋ メンテナンス性向上（抽出ロジックの明確化）

---

## 📊 現状分析

### 残存するデータ欠損の原因（66件）

- **商品説明に成分量が記載されていない**: 最多（推定60%）
- **複雑な表記形式**: 「1粒あたり」「目安量」などの間接表記
- **成分名のエイリアス未登録**: 一部のマイナー成分
- **画像のみの栄養成分表示**: OCR未対応

---

## 🎯 改善項目（優先順位付き）

### 優先度: 高（短期実装、1-2週間）

#### 1. 正規表現抽出の優先順位固定化

**現状の問題**:

- 複数の抽出パターンが並列実行され、優先順位が不明確
- 中央値採用により、誤った値が選ばれるケースがある

**改善内容**:

```typescript
// 優先順位付き抽出（スコアリング方式）
interface ExtractionCandidate {
  value: number;
  priority: number; // 1が最高優先
  source: string; // "成分名直後", "1日分", "配合量" など
}

const extractionResults: ExtractionCandidate[] = [];

// 優先度1: 成分名直後の数値（最も信頼性が高い）
if (ingredientName) {
  const pattern = new RegExp(
    `${ingredientName}[\\s　]*([\\d,]+(?:\\.\\d+)?)\\s*(mg|g|μg)`,
    "i",
  );
  const match = normalizedName.match(pattern);
  if (match) {
    extractionResults.push({
      value: convertToMg(parseFloat(match[1]), match[2]),
      priority: 1,
      source: "成分名直後",
    });
  }
}

// 優先度2: 「1日分」「1日あたり」の数値
// 優先度3: 「配合量」「含有量」の数値
// 優先度4: その他の数値

// 最高優先度の結果を採用
extractionResults.sort((a, b) => a.priority - b.priority);
return extractionResults[0]?.value || 0;
```

**実装ファイル**: `lib/extract-ingredient-amount.ts`
**工数**: 2-3時間
**期待効果**: +3-5%（誤抽出の削減）

---

#### 2. エイリアス辞書（INGREDIENT_ALIASES）の外部管理

**現状の問題**:

- ハードコードされたエイリアス辞書は更新が困難
- 運用担当者が成分を追加できない

**改善内容**:

```typescript
// data/ingredient-aliases.json（新規作成）
{
  "ビタミンA": {
    "aliases": [
      "ビタミンA",
      "レチノール",
      "ビタミンA（レチノール）",
      "VitaminA",
      "Vitamin A",
      "retinol"
    ],
    "units": ["mg", "μg", "IU"],
    "defaultAmount": 0.77
  },
  "ビタミンC": {
    "aliases": [
      "ビタミンC",
      "アスコルビン酸",
      "ビタミンC（アスコルビン酸）",
      "VitaminC",
      "Vitamin C",
      "ascorbic acid"
    ],
    "units": ["mg", "g"],
    "defaultAmount": 1000
  }
  // ... 主要50成分
}
```

```typescript
// lib/extract-ingredient-amount.ts
import ingredientAliases from "@/data/ingredient-aliases.json";

export function normalizeIngredientName(ingredientName: string): string[] {
  const baseName = ingredientName.replace(/[（(].*?[)）]/g, "").trim();

  for (const [key, config] of Object.entries(ingredientAliases)) {
    if (
      config.aliases.some(
        (alias) =>
          baseName.toLowerCase().includes(alias.toLowerCase()) ||
          alias.toLowerCase().includes(baseName.toLowerCase()),
      )
    ) {
      return config.aliases;
    }
  }

  return [ingredientName, baseName];
}
```

**実装ファイル**:

- `apps/web/src/data/ingredient-aliases.json`（新規）
- `apps/web/src/lib/extract-ingredient-amount.ts`（修正）

**工数**: 4-6時間
**期待効果**: +5-8%（表記ゆれ対応）

---

#### 3. 商品説明（allIngredients）解析の強化

**現状の問題**:

- 商品名だけを対象にしており、詳細な商品説明を活用していない
- HTMLタグが混在したまま解析している

**改善内容**:

```typescript
// lib/description-parser.ts（新規）

/**
 * HTMLタグを除去してプレーンテキスト化
 */
function cleanHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(p|div|span|table|tr|td|th)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/**
 * 商品説明から成分量を抽出
 */
export function extractFromDescription(
  description: string,
  ingredientName: string,
): number {
  if (!description) return 0;

  // 1. HTMLタグ除去
  const cleanText = cleanHtml(description);

  // 2. 行分割
  const lines = cleanText.split(/[\r\n]+/).map((line) => line.trim());

  // 3. 成分名を含む行を抽出
  const relevantLines = lines.filter((line) =>
    line.toLowerCase().includes(ingredientName.toLowerCase()),
  );

  // 4. 各行から数値を抽出
  const candidates: number[] = [];

  for (const line of relevantLines) {
    // パターン1: "ビタミンC: 1000mg"
    const pattern1 = new RegExp(
      `${escapeRegExp(ingredientName)}[\\s　]*[:：]?[\\s　]*([\\d,]+(?:\\.\\d+)?)\\s*(mg|g|μg|mcg)`,
      "i",
    );
    const match1 = line.match(pattern1);
    if (match1) {
      candidates.push(convertToMg(parseFloat(match1[1]), match1[2]));
    }

    // パターン2: "1000mg ビタミンC"
    const pattern2 = new RegExp(
      `([\\d,]+(?:\\.\\d+)?)\\s*(mg|g|μg|mcg)[\\s　]*(?:の)?${escapeRegExp(ingredientName)}`,
      "i",
    );
    const match2 = line.match(pattern2);
    if (match2) {
      candidates.push(convertToMg(parseFloat(match2[1]), match2[2]));
    }
  }

  // 5. 最も信頼性の高い値を返す
  if (candidates.length > 0) {
    candidates.sort((a, b) => a - b);
    return candidates[Math.floor(candidates.length / 2)]; // 中央値
  }

  return 0;
}
```

**実装ファイル**:

- `apps/web/src/lib/description-parser.ts`（新規）
- `scripts/update-missing-ingredient-amounts.mjs`（修正）

**工数**: 4-6時間
**期待効果**: +5-10%（商品説明活用）

---

#### 4. 単位の国際化（mg/g/μg/IU/%DV）

**現状の問題**:

- 海外商品で使われる「IU」「%DV」に未対応
- 単位変換ロジックが不完全

**改善内容**:

```typescript
// lib/unit-converter.ts（新規）

/**
 * 各成分ごとのIU→mg変換係数
 * 参考: https://www.fda.gov/food/nutrition-facts-label/daily-value-nutrition-and-supplement-facts-labels
 */
const IU_TO_MG_CONVERSION: Record<string, number> = {
  ビタミンA: 0.0003, // 1 IU = 0.3μg = 0.0003mg
  ビタミンD: 0.000025, // 1 IU = 0.025μg = 0.000025mg
  ビタミンE: 0.67, // 1 IU = 0.67mg (d-alpha-tocopherol)
};

/**
 * %DV（米国推奨摂取量）→mg変換
 */
const DV_TO_MG: Record<string, number> = {
  ビタミンA: 0.9, // 900μg = 0.9mg
  ビタミンC: 90,
  ビタミンD: 0.02, // 20μg = 0.02mg
  カルシウム: 1300,
  鉄: 18,
  // ... FDA基準値
};

export function convertToMg(
  value: number,
  unit: string,
  ingredientName?: string,
): number {
  const unitLower = unit.toLowerCase();

  switch (unitLower) {
    case "g":
      return value * 1000;
    case "mg":
      return value;
    case "μg":
    case "mcg":
    case "ug":
      return value * 0.001;
    case "iu":
      if (ingredientName && IU_TO_MG_CONVERSION[ingredientName]) {
        return value * IU_TO_MG_CONVERSION[ingredientName];
      }
      console.warn(`IU conversion not defined for ${ingredientName}`);
      return 0;
    case "%dv":
    case "% dv":
      if (ingredientName && DV_TO_MG[ingredientName]) {
        return (value / 100) * DV_TO_MG[ingredientName];
      }
      console.warn(`%DV conversion not defined for ${ingredientName}`);
      return 0;
    default:
      console.warn(`Unknown unit: ${unit}`);
      return value; // デフォルトはmg想定
  }
}
```

**実装ファイル**:

- `apps/web/src/lib/unit-converter.ts`（新規）
- `apps/web/src/lib/extract-ingredient-amount.ts`（修正）

**工数**: 3-4時間
**期待効果**: +2-3%（海外商品対応）

---

### 優先度: 中（中期実装、1-2ヶ月）

#### 5. AI抽出プロンプトの安全性強化

**現状の問題**:

- AIが推測で数値を返す可能性がある
- 誤抽出のリスクが高い

**改善内容**:

```typescript
const prompt = `
あなたは商品説明から成分量を抽出する専門家です。以下のルールを厳守してください：

【重要なルール】
1. 商品名または商品説明に明示的に記載されている数値のみを抽出してください
2. 推測や計算は絶対に行わないでください
3. 抽出できない場合は必ず「0」を返してください
4. 単位はmgに統一してください（g→mg、μg→mgに変換）

【商品情報】
商品名: ${productName}
商品説明: ${description}
対象成分: ${ingredientName}

【回答形式】
- 数値のみを返してください（例: 1000）
- 抽出できない場合は「0」を返してください
- 説明や補足は不要です

回答:
`.trim();
```

**実装ファイル**: `apps/web/src/lib/ai-extractor.ts`
**工数**: 2-3時間
**期待効果**: 誤抽出の削減

---

#### 6. 成分名のスコアリング機能

**現状の問題**:

- エイリアスの部分一致で誤検出が発生
- 「ビタミンC」で検索して「ビタミンC誘導体」が該当

**改善内容**:

```typescript
/**
 * 成分名の一致度をスコアリング
 */
function calculateMatchScore(
  ingredientName: string,
  alias: string,
  context: string,
): number {
  let score = 0;

  // 完全一致: +100点
  if (ingredientName.toLowerCase() === alias.toLowerCase()) {
    score += 100;
  }

  // 部分一致: +50点
  else if (ingredientName.toLowerCase().includes(alias.toLowerCase())) {
    score += 50;
  }

  // 前後の文脈チェック（誘導体、複合体などの除外）
  const negativeKeywords = ["誘導体", "複合体", "含有", "配合"];
  const contextLower = context.toLowerCase();

  for (const keyword of negativeKeywords) {
    if (contextLower.includes(keyword)) {
      score -= 30;
    }
  }

  // 単位が直後にある: +20点
  if (/\d+\s*(mg|g|μg)/.test(context)) {
    score += 20;
  }

  return score;
}

// エイリアスマッチング時にスコアリングを適用
const matches = aliases.map((alias) => ({
  alias,
  score: calculateMatchScore(ingredientName, alias, productName),
}));

matches.sort((a, b) => b.score - a.score);
const bestMatch = matches[0];

if (bestMatch.score >= 50) {
  // 信頼できるマッチ
  return extractAmount(productName, bestMatch.alias);
}
```

**実装ファイル**: `apps/web/src/lib/extract-ingredient-amount.ts`
**工数**: 4-5時間
**期待効果**: 誤抽出の削減

---

#### 7. フォールバック階層の統一

**現状の問題**:

- 抽出失敗時のフォールバック処理が不明確

**改善内容**:

```typescript
export function extractIngredientAmountWithFallback(
  productName: string,
  description: string | null,
  ingredientName: string,
): IngredientAmountExtractionResult {
  let result: IngredientAmountExtractionResult;

  // レベル1: 商品名から正規表現で抽出（優先度付き）
  const fromName = extractWithPriority(productName, ingredientName);
  if (fromName > 0) {
    return {
      amount: fromName,
      method: "regex_name",
      confidence: 0.9,
      source: productName,
    };
  }

  // レベル2: 商品説明から抽出
  if (description) {
    const fromDesc = extractFromDescription(description, ingredientName);
    if (fromDesc > 0) {
      return {
        amount: fromDesc,
        method: "regex_description",
        confidence: 0.8,
        source: description.substring(0, 100),
      };
    }
  }

  // レベル3: AI抽出（コスト管理のため制限付き）
  if (process.env.ENABLE_AI_EXTRACTION === "true") {
    const fromAI = await extractUsingAI(
      productName,
      description,
      ingredientName,
    );
    if (fromAI > 0) {
      return {
        amount: fromAI,
        method: "ai",
        confidence: 0.7,
        source: "AI extraction",
      };
    }
  }

  // レベル4: 手動補完データから取得
  const manual = await getManualIngredientAmount(productId, ingredientName);
  if (manual) {
    return {
      amount: manual.amount,
      method: "manual",
      confidence: 1.0,
      source: "Manual entry",
    };
  }

  // 抽出失敗
  return {
    amount: 0,
    method: "none",
    confidence: 0,
    source: null,
  };
}
```

**実装ファイル**: `apps/web/src/lib/extract-ingredient-amount.ts`
**工数**: 3-4時間
**期待効果**: システムの明確化、メンテナンス性向上

---

### 優先度: 低（長期実装、3ヶ月以上）

#### 8. OCRのテーブル解析強化

**改善内容**:

- Google Vision APIの`documentTextDetection`を使用
- 栄養成分表示の表構造を解析
- 成分名と数値の対応付け

**工数**: 12-16時間
**期待効果**: 画像からの自動抽出

---

#### 9. 手動補完UIの改善

**改善内容**:

- 単位自動変換（入力時に「1000μg」→「1mg」に変換）
- 補填サジェスト（類似商品の平均値を提案）
- 変更履歴の保存（誰が、いつ、何を変更したか）

**工数**: 8-12時間
**期待効果**: 運用効率向上

---

#### 10. 品質監査の自動化

**改善内容**:

```javascript
// scripts/quality-audit.mjs

/**
 * 毎日自動実行する品質監査スクリプト
 */
async function runQualityAudit() {
  const products = await getAllProducts();

  const issues = [];

  for (const product of products) {
    // 成分量が0のまま公開されている商品
    if (
      product.availability === "in-stock" &&
      product.mainIngredientAmount === 0
    ) {
      issues.push({
        type: "missing_amount",
        productId: product._id,
        productName: product.name,
        severity: "high",
      });
    }

    // 異常値（1日摂取量の100倍以上）
    if (product.mainIngredientAmount > 100000) {
      issues.push({
        type: "abnormal_amount",
        productId: product._id,
        productName: product.name,
        amount: product.mainIngredientAmount,
        severity: "critical",
      });
    }
  }

  // Slackに通知
  if (issues.length > 0) {
    await sendSlackNotification({
      channel: "#suptia-alerts",
      text: `⚠️ 品質監査で${issues.length}件の問題を検出しました`,
      attachments: issues.slice(0, 10).map((issue) => ({
        color: issue.severity === "critical" ? "danger" : "warning",
        text: `${issue.type}: ${issue.productName}`,
      })),
    });
  }
}
```

**工数**: 4-6時間
**期待効果**: データ品質の維持

---

## 📅 実装スケジュール

| 週           | 優先度 | 項目                  | 工数    | 期待改善率             | ステータス  |
| ------------ | ------ | --------------------- | ------- | ---------------------- | ----------- |
| 1週目        | 高     | 1. 優先順位固定化     | 3h      | +3-5%                  | ✅ 完了     |
| 1-2週目      | 高     | 2. エイリアス外部管理 | 6h      | +5-8%                  | ✅ 完了     |
| 2週目        | 高     | 3. 商品説明解析       | 6h      | +5-10%                 | ✅ 完了     |
| 2週目        | 高     | 4. 単位国際化         | 4h      | +2-3%                  | ✅ 完了     |
| **短期合計** | -      | -                     | **19h** | **+15-26%**            | ✅ 完了     |
| -            | 中     | 5. AI抽出             | -       | +10-15%                | ⏸️ 実装延期 |
| 4週目        | 中     | 6. スコアリング       | 5h      | 誤抽出削減             | ✅ 完了     |
| 4週目        | 中     | 7. フォールバック統一 | 4h      | メンテナンス性向上     | ✅ 完了     |
| **中期合計** | -      | -                     | **9h**  | **メンテナンス性向上** | ✅ 完了     |

**実績データカバー率**: 76.2% → **80.4% (+4.2%)** ✅
**現時点の目標達成**: regex改善により80.4%を達成（AI不使用）
**次期目標**: 手動補完UI改善（項目9）による運用カバー、またはAI抽出のROI検証後に実装判断

---

## 📌 次期実装優先順位（推奨）

### ✅ 完了済み（2025-11-15）

1. ~~第1週: 項目1（優先順位固定化） + 項目2（エイリアス外部管理）~~ ✅
2. ~~第2週: 項目3（商品説明解析） + 項目4（単位国際化）~~ ✅
3. ~~第4週: 項目6（成分名スコアリング機能） + 項目7（フォールバック階層統一）~~ ✅

### 🎯 次のステップ

#### ⏸️ 将来実装予定（時期未定）

**項目5: AI抽出（GPT-4/Claude API）** - 残り66件対応 🔮

**ステータス**: 実装延期（予算・優先度の再検討）

- 商品説明の自然言語解析
- コスト管理必須（$0.01-0.03/商品、66件 × $0.02 = 約$1.32〜）
- 期待効果: +10-15%（残存66件の60-90%を抽出）
- **実装判断**: regex改善で80.4%達成済み。残り19.6%をAIでカバーするコストに対するROIを検証してから実装

**代替案**:

- 手動補完UI改善（項目9）を優先し、運用で対応
- 主要商品のみAI抽出を適用（20-30件程度）
- ユーザーフィードバック機能で成分量データを収集

---

**更新履歴**:

- 2025-11-15 18:00: 初版作成
- 2025-11-15 21:00: フェーズ1-4完了、実績データカバー率80.4%達成を記録
- 2025-11-15 22:00: Priority Item 6（成分名スコアリング機能）完了、誤抽出防止機能実装
- 2025-11-15 22:30: Priority Item 7（フォールバック階層統一）完了、メンテナンス性向上
- 2025-11-15 23:00: Priority Item 5（AI抽出）を将来実装予定に変更、コスト対効果の検証優先
