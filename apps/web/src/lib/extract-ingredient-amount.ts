/**
 * 商品名から成分量（mg）を自動抽出するユーティリティ
 *
 * 対応パターン:
 * - "マグネシウム 300mg 60粒" → 300mg
 * - "ビタミンC 1000 タブレット" → 1000mg
 * - "亜鉛サプリ 30mg配合" → 30mg
 * - "DHA EPA 500mg×90日分" → 500mg
 * - "葉酸 400μg" → 0.4mg
 * - "セレン 50mcg" → 0.05mg
 *
 * @module extract-ingredient-amount
 */

import ingredientAliases from "@/data/ingredient-aliases.json";

/**
 * エイリアス辞書の型定義
 */
interface IngredientAliasEntry {
  aliases: string[];
  category: string;
}

type IngredientAliasesMap = Record<string, IngredientAliasEntry>;

const INGREDIENT_ALIASES: IngredientAliasesMap =
  ingredientAliases as IngredientAliasesMap;

/**
 * 成分名のマッチスコアを計算（誤抽出を防ぐため）
 *
 * @param searchTerm - 検索対象の成分名（例: "ビタミンC"）
 * @param context - 検索対象文字列（商品名など）
 * @returns マッチスコア（0-100）、高いほど信頼性が高い
 *
 * スコアリング基準:
 * - 完全一致: +100点
 * - 単語境界での一致: +50点
 * - 部分一致: +30点
 * - 周辺に数値+単位: +20点
 * - 一般的な接尾語（サプリメント、タブレットなど）: +20点
 * - 誘導体・派生語を含む: -50点（ペナルティ）
 *
 * 信頼できるマッチ閾値: 50点以上
 */
function calculateMatchScore(searchTerm: string, context: string): number {
  let score = 0;
  const lowerContext = context.toLowerCase();
  const lowerSearch = searchTerm.toLowerCase();

  // 完全一致: +100点
  if (lowerContext === lowerSearch) {
    score += 100;
    return score; // 完全一致なら他の判定不要
  }

  // 単語境界での一致: +50点（前後にスペース、括弧、記号がある）
  const wordBoundaryPattern = new RegExp(
    `(^|[\\s　\\(（\\[【])${escapeRegExp(lowerSearch)}($|[\\s　\\)）\\]】])`,
    "i",
  );
  if (wordBoundaryPattern.test(lowerContext)) {
    score += 50;
  } else if (lowerContext.includes(lowerSearch)) {
    // 部分一致: +30点
    score += 30;
  } else {
    // マッチしない場合は0点
    return 0;
  }

  // 周辺に数値+単位があるか: +20点
  const nearbyNumberPattern = new RegExp(
    `${escapeRegExp(lowerSearch)}.{0,20}\\d+\\s*(mg|g|μg|mcg|ug|IU|%DV)`,
    "i",
  );
  if (nearbyNumberPattern.test(lowerContext)) {
    score += 20;
  }

  // 一般的な接尾語が付いている場合: +20点（サプリメント関連の一般的な単語）
  const commonSuffixPattern = new RegExp(
    `${escapeRegExp(lowerSearch)}(サプリメント|サプリ|タブレット|カプセル|錠|粒|supplement|tablet|capsule)`,
    "i",
  );
  if (commonSuffixPattern.test(lowerContext)) {
    score += 20;
  }

  // 誘導体・派生語を含む場合: -50点（ペナルティ）
  const derivativeKeywords = [
    "誘導体",
    "前駆体",
    "類似",
    "由来",
    "配糖体",
    "エステル",
    "derivative",
    "precursor",
    "analog",
  ];
  for (const keyword of derivativeKeywords) {
    if (lowerContext.includes(keyword)) {
      score -= 50;
      break;
    }
  }

  return Math.max(0, score); // 負の値にならないように
}

/**
 * 成分名を正規化（エイリアスを標準名に変換）- スコアリング方式
 *
 * @param ingredientName - 正規化する成分名（例: "Vitamin C", "アスコルビン酸"）
 * @returns 標準化された成分名（例: "ビタミンC"）、見つからない場合は元の名前
 *
 * @example
 * normalizeIngredientName("Vitamin C") // → "ビタミンC"
 * normalizeIngredientName("アスコルビン酸") // → "ビタミンC"
 * normalizeIngredientName("ビタミンC") // → "ビタミンC"
 * normalizeIngredientName("ビタミンC誘導体") // → "ビタミンC誘導体" (誤認識を防止)
 */
export function normalizeIngredientName(ingredientName: string): string {
  if (!ingredientName) return ingredientName;

  const normalized = ingredientName.trim();

  // 完全一致チェック（標準名）
  if (INGREDIENT_ALIASES[normalized]) {
    return normalized;
  }

  // エイリアス検索（大文字小文字を区別しない）
  const lowerSearch = normalized.toLowerCase();
  for (const [standardName, entry] of Object.entries(INGREDIENT_ALIASES)) {
    // 標準名との一致（大文字小文字無視）
    if (standardName.toLowerCase() === lowerSearch) {
      return standardName;
    }

    // エイリアスとの一致（大文字小文字無視）
    if (entry.aliases.some((alias) => alias.toLowerCase() === lowerSearch)) {
      return standardName;
    }
  }

  // スコアリングベースの部分一致検索
  const matchCandidates: Array<{
    standardName: string;
    alias: string;
    score: number;
  }> = [];

  for (const [standardName, entry] of Object.entries(INGREDIENT_ALIASES)) {
    // 標準名でのマッチング
    const standardScore = calculateMatchScore(standardName, normalized);
    if (standardScore > 0) {
      matchCandidates.push({
        standardName,
        alias: standardName,
        score: standardScore,
      });
    }

    // エイリアスでのマッチング（長い順に検索）
    const sortedAliases = [...entry.aliases].sort(
      (a, b) => b.length - a.length,
    );
    for (const alias of sortedAliases) {
      const aliasScore = calculateMatchScore(alias, normalized);
      if (aliasScore > 0) {
        matchCandidates.push({
          standardName,
          alias,
          score: aliasScore,
        });
      }
    }
  }

  // スコアが高い順にソート
  matchCandidates.sort((a, b) => b.score - a.score);

  // 信頼できるマッチ（スコア50以上）があれば採用
  const bestMatch = matchCandidates[0];
  if (bestMatch && bestMatch.score >= 50) {
    return bestMatch.standardName;
  }

  // 見つからない場合は元の名前を返す
  return normalized;
}

/**
 * 成分名と対応する一般的な配合量（mg）のマッピング
 * フォールバック用: 商品名から数値を抽出できない場合のデフォルト値
 */
const INGREDIENT_DEFAULT_AMOUNTS: Record<string, number> = {
  // ビタミン
  ビタミンA: 0.77, // 770μg = 0.77mg
  ビタミンD: 0.025, // 25μg = 0.025mg
  ビタミンE: 6.3,
  ビタミンK: 0.15, // 150μg = 0.15mg
  ビタミンB1: 1.2,
  ビタミンB2: 1.4,
  ビタミンB6: 1.4,
  ビタミンB12: 0.0024, // 2.4μg = 0.0024mg
  ビタミンC: 1000,
  葉酸: 0.4, // 400μg = 0.4mg
  ナイアシン: 13,
  パントテン酸: 4.8,
  ビオチン: 0.05, // 50μg = 0.05mg

  // ミネラル
  カルシウム: 650,
  マグネシウム: 320,
  鉄: 6.5,
  亜鉛: 10,
  銅: 0.9,
  セレン: 0.03, // 30μg = 0.03mg
  クロム: 0.01, // 10μg = 0.01mg
  モリブデン: 0.025, // 25μg = 0.025mg
  ヨウ素: 0.13, // 130μg = 0.13mg

  // オメガ3脂肪酸
  EPA: 500,
  DHA: 500,
  オメガ3: 1000,
  "α-リノレン酸": 1000,

  // アミノ酸
  グルタミン: 5000,
  アルギニン: 3000,
  BCAA: 5000,
  ロイシン: 2000,

  // その他
  コエンザイムQ10: 100,
  ルテイン: 20,
  アスタキサンチン: 12,
  リコピン: 15,
  クルクミン: 100,
  レスベラトロール: 100,
};

/**
 * 単位変換係数（すべてmgに正規化）
 */
const UNIT_CONVERSIONS: Record<string, number> = {
  g: 1000, // 1g = 1000mg
  mg: 1, // 基準単位
  mcg: 0.001, // 1mcg = 0.001mg
  μg: 0.001, // 1μg = 0.001mg
  ug: 0.001, // 1ug = 0.001mg（μの代替表記）
};

/**
 * IU（国際単位）からmgへの変換係数（成分ごとに異なる）
 * 参考: https://www.ncbi.nlm.nih.gov/books/NBK222310/
 */
const IU_TO_MG_CONVERSIONS: Record<string, number> = {
  // ビタミンA: 1 IU = 0.0003 mg (レチノールとして)
  ビタミンA: 0.0003,
  "Vitamin A": 0.0003,
  レチノール: 0.0003,
  Retinol: 0.0003,

  // ビタミンD: 1 IU = 0.000025 mg (0.025 μg)
  ビタミンD: 0.000025,
  "Vitamin D": 0.000025,
  ビタミンD3: 0.000025,
  "Vitamin D3": 0.000025,

  // ビタミンE: 1 IU = 0.67 mg (天然α-トコフェロール)
  //            1 IU = 0.45 mg (合成dl-α-トコフェロール)
  // ※ 保守的に合成型の係数を使用
  ビタミンE: 0.45,
  "Vitamin E": 0.45,
  トコフェロール: 0.45,
  Tocopherol: 0.45,
};

/**
 * 成分ごとの1日推奨摂取量（RDA）- %DV換算用
 * 参考: 厚生労働省「日本人の食事摂取基準（2020年版）」
 */
const RDA_AMOUNTS_MG: Record<string, number> = {
  // ビタミン
  ビタミンA: 0.77, // 770μg RAE
  ビタミンD: 0.0085, // 8.5μg
  ビタミンE: 6.5, // 6.5mg α-トコフェロール
  ビタミンK: 0.15, // 150μg
  ビタミンB1: 1.2,
  ビタミンB2: 1.4,
  ビタミンB6: 1.4,
  ビタミンB12: 0.0024, // 2.4μg
  ビタミンC: 100,
  葉酸: 0.24, // 240μg
  ナイアシン: 13,
  パントテン酸: 4.8,
  ビオチン: 0.05, // 50μg

  // ミネラル
  カルシウム: 650,
  マグネシウム: 320,
  鉄: 6.5,
  亜鉛: 10,
  銅: 0.9,
  セレン: 0.03, // 30μg
  クロム: 0.01, // 10μg
  モリブデン: 0.025, // 25μg
  ヨウ素: 0.13, // 130μg
};

/**
 * 抽出候補（優先度スコアリング方式）
 */
interface ExtractionCandidate {
  value: number; // mg単位の数値
  priority: number; // 優先度（数値が大きいほど優先）
  source: string; // 抽出元（デバッグ用）
  position: number; // 文字列内の位置（同点時の判定用）
}

/**
 * 商品名から成分量（mg単位）を抽出（優先度スコアリング方式）
 *
 * 優先順位：
 * 1. 成分名直後 + 単位付き（例: "ビタミンC 1000mg"） - スコア100
 * 2. 成分名直後（単位なし）（例: "ビタミンC 1000"） - スコア90
 * 3. 「1日分」「1日あたり」の数値 - スコア80
 * 4. 「配合量」「含有量」の数値 - スコア70
 * 5. その他の単位付き数値 - スコア50
 *
 * @param productName - 商品名
 * @param ingredientName - 成分名（オプション、より精度の高い抽出のため）
 * @returns 抽出された成分量（mg）、抽出できない場合は0
 */
export function extractIngredientAmount(
  productName: string,
  ingredientName?: string,
): number {
  if (!productName) return 0;

  // 商品名を正規化（全角→半角、スペース統一）
  const normalizedName = productName
    .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0)) // 全角数字→半角
    .replace(/[　]/g, " ") // 全角スペース→半角
    .toLowerCase();

  // 成分名を正規化し、エイリアスも含めた検索候補を生成
  const searchTerms: string[] = [];
  if (ingredientName) {
    const normalized = normalizeIngredientName(ingredientName);
    searchTerms.push(normalized);

    // エイリアスも検索対象に追加
    const aliasEntry = INGREDIENT_ALIASES[normalized];
    if (aliasEntry) {
      searchTerms.push(...aliasEntry.aliases);
    }
  }

  const candidates: ExtractionCandidate[] = [];

  // 優先度1: 成分名直後 + 単位付き（例: "ビタミンC 1000mg"） - スコア100
  // すべての検索候補（標準名+エイリアス）でマッチングを試みる
  for (const searchTerm of searchTerms) {
    const pattern = new RegExp(
      `${escapeRegExp(searchTerm)}[\\s　]*[\\(（]?([\\d,]+(?:\\.\\d+)?)[\\)）]?\\s*(mg|g|mcg|μg|ug)`,
      "gi",
    );
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(normalizedName)) !== null) {
      const value = parseFloat(match[1].replace(/,/g, ""));
      const unit = match[2].toLowerCase();
      const conversionFactor = UNIT_CONVERSIONS[unit] || 1;
      const amountInMg = value * conversionFactor;

      if (!isNaN(amountInMg) && amountInMg > 0 && amountInMg <= 100000) {
        candidates.push({
          value: amountInMg,
          priority: 100,
          source: `成分名直後+単位: ${match[0]}`,
          position: match.index,
        });
      }
    }
  }

  // 優先度2: 成分名直後（単位なし）（例: "ビタミンC 1000"） - スコア90
  // すべての検索候補（標準名+エイリアス）でマッチングを試みる
  for (const searchTerm of searchTerms) {
    const pattern = new RegExp(
      `${escapeRegExp(searchTerm)}[\\s　]*[\\(（]?([\\d,]+(?:\\.\\d+)?)[\\)）]?(?!\\s*(mg|g|mcg|μg|ug))`,
      "i",
    );
    const match = normalizedName.match(pattern);
    if (match) {
      const value = parseFloat(match[1].replace(/,/g, ""));
      if (!isNaN(value) && value > 0 && value < 100000) {
        candidates.push({
          value,
          priority: 90,
          source: `成分名直後: ${match[0]}`,
          position: normalizedName.indexOf(match[0]),
        });
      }
    }
  }

  // 優先度3: 「1日分」「1日あたり」の数値 - スコア80
  const dailyKeywords = [
    "1日分",
    "1日あたり",
    "一日分",
    "一日あたり",
    "1日摂取量",
    "1粒",
    "1カプセル",
    "1錠",
  ];
  for (const keyword of dailyKeywords) {
    const pattern = new RegExp(
      `${keyword}[\\s　]*[:\\:：]?[\\s　]*([\\d,]+(?:\\.\\d+)?)\\s*(mg|g|mcg|μg|ug)?`,
      "i",
    );
    const match = normalizedName.match(pattern);
    if (match) {
      const value = parseFloat(match[1].replace(/,/g, ""));
      const unit = match[2]?.toLowerCase() || "mg";
      const conversionFactor = UNIT_CONVERSIONS[unit] || 1;
      const amountInMg = value * conversionFactor;

      if (!isNaN(amountInMg) && amountInMg > 0 && amountInMg <= 100000) {
        candidates.push({
          value: amountInMg,
          priority: 80,
          source: `1日分: ${match[0]}`,
          position: normalizedName.indexOf(match[0]),
        });
      }
    }
  }

  // 優先度4: 「配合量」「含有量」の数値 - スコア70
  const amountKeywords = [
    "配合量",
    "含有量",
    "成分量",
    "配合",
    "含有",
    "配合成分",
  ];
  for (const keyword of amountKeywords) {
    const pattern = new RegExp(
      `${keyword}[\\s　]*[:\\:：]?[\\s　]*([\\d,]+(?:\\.\\d+)?)\\s*(mg|g|mcg|μg|ug)?`,
      "i",
    );
    const match = normalizedName.match(pattern);
    if (match) {
      const value = parseFloat(match[1].replace(/,/g, ""));
      const unit = match[2]?.toLowerCase() || "mg";
      const conversionFactor = UNIT_CONVERSIONS[unit] || 1;
      const amountInMg = value * conversionFactor;

      if (!isNaN(amountInMg) && amountInMg > 0 && amountInMg <= 100000) {
        candidates.push({
          value: amountInMg,
          priority: 70,
          source: `配合量: ${match[0]}`,
          position: normalizedName.indexOf(match[0]),
        });
      }
    }
  }

  // 優先度5: IU（国際単位）からmg換算 - スコア60
  if (ingredientName) {
    const normalized = normalizeIngredientName(ingredientName);

    // IU変換係数を取得
    const iuConversionFactor =
      IU_TO_MG_CONVERSIONS[normalized] ||
      (Object.keys(IU_TO_MG_CONVERSIONS).some((key) => normalized.includes(key))
        ? IU_TO_MG_CONVERSIONS[
            Object.keys(IU_TO_MG_CONVERSIONS).find((key) =>
              normalized.includes(key),
            )!
          ]
        : null);

    if (iuConversionFactor) {
      const iuPattern = /(\d+(?:,\d+)?(?:\.\d+)?)\s*IU/gi;
      let match: RegExpExecArray | null;
      while ((match = iuPattern.exec(normalizedName)) !== null) {
        const value = parseFloat(match[1].replace(/,/g, ""));
        const amountInMg = value * iuConversionFactor;

        if (!isNaN(amountInMg) && amountInMg > 0 && amountInMg <= 100000) {
          candidates.push({
            value: amountInMg,
            priority: 60,
            source: `IU変換: ${match[0]}`,
            position: match.index,
          });
        }
      }
    }
  }

  // 優先度6: %DV（Daily Value）からmg換算 - スコア55
  if (ingredientName) {
    const normalized = normalizeIngredientName(ingredientName);
    const rdaAmount = RDA_AMOUNTS_MG[normalized];

    if (rdaAmount) {
      const dvPattern = /(\d+(?:\.\d+)?)\s*%\s*(?:DV|dv|daily\s*value)/gi;
      let match: RegExpExecArray | null;
      while ((match = dvPattern.exec(normalizedName)) !== null) {
        const percentage = parseFloat(match[1]);
        const amountInMg = (rdaAmount * percentage) / 100;

        if (!isNaN(amountInMg) && amountInMg > 0 && amountInMg <= 100000) {
          candidates.push({
            value: amountInMg,
            priority: 55,
            source: `%DV変換: ${match[0]}`,
            position: match.index,
          });
        }
      }
    }
  }

  // 優先度7: その他の単位付き数値 - スコア50
  const unitPatterns = [
    /(\d+(?:\.\d+)?)\s*(mg|g|mcg|μg|ug)/gi,
    /(\d+(?:\.\d+)?)\s*ミリグラム/gi,
    /(\d+(?:\.\d+)?)\s*マイクログラム/gi,
  ];

  for (const pattern of unitPatterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(normalizedName)) !== null) {
      const value = parseFloat(match[1]);
      const unit = match[2]?.toLowerCase() || "mg";
      const conversionFactor = UNIT_CONVERSIONS[unit] || 1;
      const amountInMg = value * conversionFactor;
      const matchIndex = match.index;
      const matchText = match[0];

      if (!isNaN(amountInMg) && amountInMg > 0 && amountInMg <= 100000) {
        // 既に同じ位置で高優先度の候補がある場合はスキップ
        const existingHighPriority = candidates.find(
          (c) => Math.abs(c.position - matchIndex) < 10 && c.priority > 50,
        );

        if (!existingHighPriority) {
          candidates.push({
            value: amountInMg,
            priority: 50,
            source: `単位付き: ${matchText}`,
            position: matchIndex,
          });
        }
      }
    }
  }

  // 候補を優先度順にソート（優先度が高い順、同点の場合は文字列の前方優先）
  candidates.sort((a, b) => {
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }
    return a.position - b.position;
  });

  // デバッグ用（開発環境のみ）
  if (process.env.NODE_ENV === "development" && candidates.length > 1) {
    console.log(`[成分量抽出] 商品名: ${productName.substring(0, 60)}...`);
    console.log(`  成分名: ${ingredientName || "指定なし"}`);
    console.log(`  候補数: ${candidates.length}`);
    candidates.slice(0, 3).forEach((c, i) => {
      console.log(
        `  候補${i + 1}: ${c.value}mg (優先度: ${c.priority}, ${c.source})`,
      );
    });
    console.log(`  採用: ${candidates[0].value}mg`);
  }

  // 最高優先度の候補を返す
  return candidates.length > 0 ? candidates[0].value : 0;
}

/**
 * 商品説明（allIngredients）から成分量を抽出
 *
 * 栄養成分表示形式の解析に対応:
 * - 「【栄養成分表示】... ビタミンC：1000mg ...」
 * - 「ビタミンC ... 1000mg」（テーブル形式）
 * - 「配合成分：ビタミンC 1000mg、EPA 500mg」（リスト形式）
 *
 * @param description - 商品説明文（allIngredientsフィールド）
 * @param ingredientName - 抽出したい成分名
 * @returns 抽出された成分量（mg）、抽出できない場合は0
 */
export function extractFromDescription(
  description: string,
  ingredientName?: string,
): number {
  if (!description || !ingredientName) return 0;

  // 成分名を正規化し、エイリアスも含めた検索候補を生成
  const normalized = normalizeIngredientName(ingredientName);
  const searchTerms: string[] = [normalized];

  const aliasEntry = INGREDIENT_ALIASES[normalized];
  if (aliasEntry) {
    searchTerms.push(...aliasEntry.aliases);
  }

  const candidates: ExtractionCandidate[] = [];

  // パターン1: 栄養成分表示形式（例: "ビタミンC：1000mg"、"ビタミンC:1000mg"）
  for (const searchTerm of searchTerms) {
    const pattern = new RegExp(
      `${escapeRegExp(searchTerm)}[\\s　]*[：:][\\s　]*([\\d,]+(?:\\.\\d+)?)\\s*(mg|g|mcg|μg|ug)`,
      "gi",
    );
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(description)) !== null) {
      const value = parseFloat(match[1].replace(/,/g, ""));
      const unit = match[2].toLowerCase();
      const conversionFactor = UNIT_CONVERSIONS[unit] || 1;
      const amountInMg = value * conversionFactor;

      if (!isNaN(amountInMg) && amountInMg > 0 && amountInMg <= 100000) {
        candidates.push({
          value: amountInMg,
          priority: 95, // 栄養成分表示は高優先度
          source: `栄養成分表示: ${match[0]}`,
          position: match.index,
        });
      }
    }
  }

  // パターン2: スペース区切り形式（例: "ビタミンC 1000mg"）
  for (const searchTerm of searchTerms) {
    const pattern = new RegExp(
      `${escapeRegExp(searchTerm)}[\\s　]+([\\d,]+(?:\\.\\d+)?)\\s*(mg|g|mcg|μg|ug)`,
      "gi",
    );
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(description)) !== null) {
      const value = parseFloat(match[1].replace(/,/g, ""));
      const unit = match[2].toLowerCase();
      const conversionFactor = UNIT_CONVERSIONS[unit] || 1;
      const amountInMg = value * conversionFactor;

      if (!isNaN(amountInMg) && amountInMg > 0 && amountInMg <= 100000) {
        candidates.push({
          value: amountInMg,
          priority: 85, // スペース区切りは中優先度
          source: `スペース区切り: ${match[0]}`,
          position: match.index,
        });
      }
    }
  }

  // パターン3: カッコ付き形式（例: "ビタミンC(1000mg)"）
  for (const searchTerm of searchTerms) {
    const pattern = new RegExp(
      `${escapeRegExp(searchTerm)}[\\s　]*[\\(（]([\\d,]+(?:\\.\\d+)?)\\s*(mg|g|mcg|μg|ug)[\\)）]`,
      "gi",
    );
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(description)) !== null) {
      const value = parseFloat(match[1].replace(/,/g, ""));
      const unit = match[2].toLowerCase();
      const conversionFactor = UNIT_CONVERSIONS[unit] || 1;
      const amountInMg = value * conversionFactor;

      if (!isNaN(amountInMg) && amountInMg > 0 && amountInMg <= 100000) {
        candidates.push({
          value: amountInMg,
          priority: 90, // カッコ付きは高優先度
          source: `カッコ付き: ${match[0]}`,
          position: match.index,
        });
      }
    }
  }

  // 候補を優先度順にソート
  candidates.sort((a, b) => {
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }
    return a.position - b.position;
  });

  return candidates.length > 0 ? candidates[0].value : 0;
}

/**
 * 成分名からデフォルト配合量を取得
 *
 * @param ingredientName - 成分名
 * @returns デフォルト配合量（mg）、該当する成分がない場合は0
 */
export function getDefaultIngredientAmount(ingredientName: string): number {
  if (!ingredientName) return 0;

  // 部分一致で検索（例: "ビタミンC（アスコルビン酸）" → "ビタミンC"）
  for (const [key, value] of Object.entries(INGREDIENT_DEFAULT_AMOUNTS)) {
    if (ingredientName.includes(key)) {
      return value;
    }
  }

  return 0;
}

/**
 * 正規表現の特殊文字をエスケープ
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 抽出結果の詳細情報を含む型
 */
export interface IngredientAmountExtractionResult {
  /** 抽出された成分量（mg） */
  amount: number;
  /** 抽出方法（フォールバック階層） */
  method:
    | "regex_name" // レベル1: 商品名から正規表現で抽出
    | "regex_description" // レベル2: 商品説明から正規表現で抽出
    | "ai" // レベル3: AI抽出（将来実装）
    | "manual" // レベル4: 手動入力
    | "none"; // 抽出失敗
  /** 信頼度（0-1） */
  confidence: number;
  /** 抽出元の文字列（デバッグ用） */
  source?: string;
  /** 抽出に使用した具体的なパターン（デバッグ用） */
  pattern?: string;
}

/**
 * 商品名から成分量を抽出（詳細情報付き）
 *
 * @param productName - 商品名
 * @param ingredientName - 成分名（オプション）
 * @returns 抽出結果の詳細情報
 * @deprecated extractIngredientAmountWithFallback() の使用を推奨
 */
export function extractIngredientAmountDetailed(
  productName: string,
  ingredientName?: string,
): IngredientAmountExtractionResult {
  const extractedAmount = extractIngredientAmount(productName, ingredientName);

  if (extractedAmount > 0) {
    return {
      amount: extractedAmount,
      method: "regex_name", // 商品名から抽出
      confidence: 0.85, // 正規表現による抽出の信頼度
      source: productName.substring(0, 100),
      pattern: "商品名パターン抽出",
    };
  }

  return {
    amount: 0,
    method: "none",
    confidence: 0,
    source: productName.substring(0, 100),
  };
}

/**
 * 成分量を抽出（フォールバック階層統一版）
 *
 * フォールバック階層:
 * 1. 商品名から正規表現で抽出（信頼度: 0.90）
 * 2. 商品説明（allIngredients）から抽出（信頼度: 0.85）
 * 3. AI抽出（将来実装）（信頼度: 0.70）
 * 4. 手動入力データ（将来実装）（信頼度: 1.00）
 *
 * @param productName - 商品名
 * @param description - 商品説明（allIngredientsフィールド）、オプション
 * @param ingredientName - 成分名
 * @returns 抽出結果の詳細情報
 *
 * @example
 * const result = extractIngredientAmountWithFallback(
 *   "ビタミンC 1000mg 60粒",
 *   "栄養成分表示：ビタミンC 1000mg、ビタミンE 10mg",
 *   "ビタミンC"
 * );
 * // result.amount: 1000
 * // result.method: "regex_name"
 * // result.confidence: 0.90
 */
export function extractIngredientAmountWithFallback(
  productName: string,
  description: string | null | undefined,
  ingredientName: string,
): IngredientAmountExtractionResult {
  // レベル1: 商品名から正規表現で抽出（優先度付きスコアリング）
  const fromName = extractIngredientAmount(productName, ingredientName);
  if (fromName > 0) {
    return {
      amount: fromName,
      method: "regex_name",
      confidence: 0.9, // 商品名からの抽出は高信頼度
      source: productName.substring(0, 100),
      pattern: "優先順位付き正規表現（商品名）",
    };
  }

  // レベル2: 商品説明（allIngredients）から抽出
  if (description) {
    const fromDescription = extractFromDescription(description, ingredientName);
    if (fromDescription > 0) {
      return {
        amount: fromDescription,
        method: "regex_description",
        confidence: 0.85, // 商品説明からの抽出もかなり信頼できる
        source: description.substring(0, 100),
        pattern: "栄養成分表示パターン（商品説明）",
      };
    }
  }

  // レベル3: AI抽出（将来実装）
  // 環境変数 ENABLE_AI_EXTRACTION が true の場合のみ実行
  // if (process.env.ENABLE_AI_EXTRACTION === "true") {
  //   const fromAI = await extractUsingAI(productName, description, ingredientName);
  //   if (fromAI > 0) {
  //     return {
  //       amount: fromAI,
  //       method: "ai",
  //       confidence: 0.70,
  //       source: "AI extraction",
  //       pattern: "GPT-4/Claude API",
  //     };
  //   }
  // }

  // レベル4: 手動入力データ（将来実装）
  // const manual = await getManualIngredientAmount(productId, ingredientName);
  // if (manual) {
  //   return {
  //     amount: manual.amount,
  //     method: "manual",
  //     confidence: 1.0,
  //     source: "Manual entry",
  //     pattern: "手動入力",
  //   };
  // }

  // 抽出失敗
  return {
    amount: 0,
    method: "none",
    confidence: 0,
    source: productName.substring(0, 100),
    pattern: "抽出失敗",
  };
}
