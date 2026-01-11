/**
 * Safety チェッカー
 *
 * ユーザーの健康情報に基づいて：
 * 1. 避けるべき成分リストを自動生成
 * 2. 相互作用を検出
 * 3. Opus昇格判定を実行
 *
 * 重要: AIは結論を作らず、情報の翻訳者として機能する
 */

import type {
  SafetyCheckResult,
  BlockedIngredient,
  InteractionSeverity,
} from "./types";
import { getBlockedIngredientsForConditions } from "./condition-warnings";
import { getBlockedIngredientsForMedications } from "./drug-interactions";

// ============================================
// アレルギー警告マッピング
// ============================================

const ALLERGY_INGREDIENT_WARNINGS: Record<
  string,
  Array<{
    ingredientSlug: string;
    ingredientName: string;
    reason: string;
  }>
> = {
  soy: [
    {
      ingredientSlug: "soy-lecithin",
      ingredientName: "大豆レシチン",
      reason: "大豆由来成分を含みます",
    },
    {
      ingredientSlug: "soy-isoflavones",
      ingredientName: "大豆イソフラボン",
      reason: "大豆由来成分を含みます",
    },
  ],
  dairy: [
    {
      ingredientSlug: "whey-protein",
      ingredientName: "ホエイプロテイン",
      reason: "乳製品由来成分を含みます",
    },
    {
      ingredientSlug: "casein",
      ingredientName: "カゼイン",
      reason: "乳製品由来成分を含みます",
    },
    {
      ingredientSlug: "lactose",
      ingredientName: "乳糖",
      reason: "乳製品由来成分を含みます",
    },
  ],
  egg: [
    {
      ingredientSlug: "egg-protein",
      ingredientName: "卵白プロテイン",
      reason: "卵由来成分を含みます",
    },
  ],
  gluten: [
    {
      ingredientSlug: "wheat-germ",
      ingredientName: "小麦胚芽",
      reason: "グルテンを含む可能性があります",
    },
  ],
  shellfish: [
    {
      ingredientSlug: "glucosamine",
      ingredientName: "グルコサミン",
      reason: "甲殻類由来の場合があります（植物由来製品を選択してください）",
    },
    {
      ingredientSlug: "chitosan",
      ingredientName: "キトサン",
      reason: "甲殻類由来成分です",
    },
  ],
  fish: [
    {
      ingredientSlug: "fish-oil",
      ingredientName: "フィッシュオイル",
      reason: "魚由来成分を含みます（藻類由来製品を選択してください）",
    },
    {
      ingredientSlug: "fish-collagen",
      ingredientName: "魚由来コラーゲン",
      reason: "魚由来成分を含みます",
    },
  ],
  "bee-products": [
    {
      ingredientSlug: "propolis",
      ingredientName: "プロポリス",
      reason: "ハチ製品です",
    },
    {
      ingredientSlug: "royal-jelly",
      ingredientName: "ローヤルゼリー",
      reason: "ハチ製品です",
    },
    {
      ingredientSlug: "bee-pollen",
      ingredientName: "ビーポーレン",
      reason: "ハチ製品です",
    },
  ],
  gelatin: [
    {
      ingredientSlug: "gelatin-capsule",
      ingredientName: "ゼラチンカプセル",
      reason:
        "動物由来ゼラチンを含みます（植物性カプセル製品を選択してください）",
    },
  ],
};

// ============================================
// メインチェッカー関数
// ============================================

export interface UserHealthProfile {
  conditions: string[];
  allergies: string[];
  medications: string[];
}

/**
 * ユーザーの健康情報から避けるべき成分リストを生成
 */
export function generateBlockedIngredients(
  healthProfile: UserHealthProfile,
): BlockedIngredient[] {
  const blocked: BlockedIngredient[] = [];

  // 1. 既往歴からの警告
  const conditionBlocked = getBlockedIngredientsForConditions(
    healthProfile.conditions,
  );
  for (const item of conditionBlocked) {
    blocked.push({
      ingredientSlug: item.ingredientSlug,
      ingredientName: item.ingredientName,
      reason: item.reason,
      relatedTo: {
        type: "condition",
        value: item.conditionValue,
        label: item.conditionLabel,
      },
      severity: item.severity,
    });
  }

  // 2. 服用中の薬からの警告
  const medicationBlocked = getBlockedIngredientsForMedications(
    healthProfile.medications,
  );
  for (const item of medicationBlocked) {
    blocked.push({
      ingredientSlug: item.ingredientSlug,
      ingredientName: item.ingredientName,
      reason: `${item.drugName}との相互作用: ${item.mechanism}`,
      relatedTo: {
        type: "medication",
        value: item.drugName,
        label: item.drugName,
      },
      severity: item.severity,
    });
  }

  // 3. アレルギーからの警告
  for (const allergy of healthProfile.allergies) {
    const allergyWarnings = ALLERGY_INGREDIENT_WARNINGS[allergy];
    if (allergyWarnings) {
      for (const warning of allergyWarnings) {
        blocked.push({
          ingredientSlug: warning.ingredientSlug,
          ingredientName: warning.ingredientName,
          reason: warning.reason,
          relatedTo: {
            type: "allergy",
            value: allergy,
            label: getAllergyLabel(allergy),
          },
          severity: "high", // アレルギーは常に高危険度
        });
      }
    }
  }

  // 重複を除去（同じ成分slug、最も高い危険度を保持）
  return deduplicateBlocked(blocked);
}

/**
 * Safetyチェック結果を生成
 */
export function performSafetyCheck(
  healthProfile: UserHealthProfile,
): SafetyCheckResult {
  const blockedIngredients = generateBlockedIngredients(healthProfile);

  // 危険フラグを収集
  const dangerFlags: string[] = [];

  // 高危険度の成分をカウント
  const highSeverityCount = blockedIngredients.filter(
    (b) => b.severity === "high",
  ).length;
  if (highSeverityCount >= 3) {
    dangerFlags.push("multiple_high_severity_ingredients");
  }

  // 特別な条件をチェック
  if (
    healthProfile.conditions.includes("pregnant") ||
    healthProfile.conditions.includes("breastfeeding")
  ) {
    dangerFlags.push("pregnancy_or_breastfeeding");
  }

  if (healthProfile.conditions.includes("cancer-treatment")) {
    dangerFlags.push("cancer_treatment");
  }

  if (healthProfile.conditions.includes("surgery-planned")) {
    dangerFlags.push("surgery_planned");
  }

  // 複数の薬との相互作用
  const medicationInteractionCount = blockedIngredients.filter(
    (b) => b.relatedTo.type === "medication",
  ).length;
  if (medicationInteractionCount >= 3) {
    dangerFlags.push("multiple_drug_interactions");
  }

  // 相互作用の系統数（異なるrelatedToの数）
  const uniqueRelatedTo = new Set(
    blockedIngredients.map((b) => `${b.relatedTo.type}:${b.relatedTo.value}`),
  );
  const interactionCount = uniqueRelatedTo.size;

  // 確信度スコア（危険フラグが多いほど低くなる）
  // これはOpus昇格判定で使用
  const confidenceScore = Math.max(
    0.3,
    1 - dangerFlags.length * 0.15 - highSeverityCount * 0.05,
  );

  return {
    interactions: [], // 個別の相互作用データ（将来拡張用）
    blockedIngredients,
    interactionCount,
    dangerFlags,
    confidenceScore,
  };
}

/**
 * Opus昇格が必要かどうかを判定（仕様書6.2準拠）
 */
export function shouldEscalateToOpus(result: SafetyCheckResult): boolean {
  // 条件1: 相互作用が3系統以上
  if (result.interactionCount >= 3) return true;

  // 条件2: 危険フラグが2つ以上重複
  if (result.dangerFlags.length >= 2) return true;

  // 条件3: 確信度が低い（判断不能ケース）
  if (result.confidenceScore < 0.7) return true;

  return false;
}

/**
 * 商品がブロック対象かどうかをチェック
 */
export function isProductBlocked(
  productIngredientSlugs: string[],
  blockedIngredients: BlockedIngredient[],
): {
  isBlocked: boolean;
  matchedIngredients: BlockedIngredient[];
} {
  const blockedSlugs = new Set(blockedIngredients.map((b) => b.ingredientSlug));
  const matchedIngredients = blockedIngredients.filter((b) =>
    productIngredientSlugs.includes(b.ingredientSlug),
  );

  return {
    isBlocked: matchedIngredients.some((m) => m.severity === "high"),
    matchedIngredients,
  };
}

/**
 * Safety情報をシステムプロンプトに追加するためのテキストを生成
 */
export function generateSafetyPromptSection(
  safetyResult: SafetyCheckResult,
): string {
  if (safetyResult.blockedIngredients.length === 0) {
    return "";
  }

  let section = `

【⚠️ Safety Guardian: ユーザー専用安全情報】
以下の成分については特別な注意が必要です。これらを含む商品を推薦する際は、必ず注意喚起を行ってください。

`;

  // 高危険度
  const highSeverity = safetyResult.blockedIngredients.filter(
    (b) => b.severity === "high",
  );
  if (highSeverity.length > 0) {
    section += `■ 高リスク成分（推薦を避ける）\n`;
    for (const item of highSeverity) {
      section += `  - ${item.ingredientName}（${item.ingredientSlug}）\n`;
      section += `    理由: ${item.reason}\n`;
      section += `    関連: ${item.relatedTo.label}（${item.relatedTo.type}）\n`;
    }
    section += "\n";
  }

  // 中危険度
  const moderateSeverity = safetyResult.blockedIngredients.filter(
    (b) => b.severity === "moderate",
  );
  if (moderateSeverity.length > 0) {
    section += `■ 注意が必要な成分（推薦時に警告を追加）\n`;
    for (const item of moderateSeverity) {
      section += `  - ${item.ingredientName}: ${item.reason}（${item.relatedTo.label}）\n`;
    }
    section += "\n";
  }

  // 低危険度
  const lowSeverity = safetyResult.blockedIngredients.filter(
    (b) => b.severity === "low" || b.severity === "theoretical",
  );
  if (lowSeverity.length > 0) {
    section += `■ 参考情報（必要に応じて言及）\n`;
    for (const item of lowSeverity) {
      section += `  - ${item.ingredientName}: ${item.reason}\n`;
    }
    section += "\n";
  }

  section += `
■ 対応方針
1. 高リスク成分を含む商品は推薦しない
2. 中リスク成分を含む商品には必ず警告を添える
3. 「医師・薬剤師にご相談ください」を必ず追加
4. AIは結論を作らず、情報の翻訳者として対応

■ 必須ディスクレーマー
⚠️ この情報はPMDA・Natural Medicines Database等の信頼性の高いソースに基づく参考情報です。
実際の服用前には必ず医師・薬剤師にご確認ください。
`;

  return section;
}

// ============================================
// ヘルパー関数
// ============================================

function getAllergyLabel(allergyValue: string): string {
  const labels: Record<string, string> = {
    soy: "大豆アレルギー",
    dairy: "乳製品アレルギー",
    egg: "卵アレルギー",
    wheat: "小麦アレルギー",
    gluten: "グルテン不耐症",
    peanut: "ピーナッツアレルギー",
    "tree-nuts": "ナッツアレルギー",
    shellfish: "甲殻類アレルギー",
    fish: "魚アレルギー",
    sesame: "ごまアレルギー",
    corn: "とうもろこしアレルギー",
    "bee-products": "ハチ製品アレルギー",
    gelatin: "ゼラチンアレルギー",
    yeast: "酵母アレルギー",
    "artificial-colors": "人工着色料過敏症",
    preservatives: "保存料過敏症",
    sulfites: "亜硫酸塩過敏症",
    latex: "ラテックスアレルギー",
  };
  return labels[allergyValue] || allergyValue;
}

function deduplicateBlocked(blocked: BlockedIngredient[]): BlockedIngredient[] {
  const severityOrder: Record<InteractionSeverity, number> = {
    high: 3,
    moderate: 2,
    low: 1,
    theoretical: 0,
  };

  return blocked.reduce((acc, current) => {
    const existing = acc.find(
      (item) => item.ingredientSlug === current.ingredientSlug,
    );
    if (!existing) {
      acc.push(current);
    } else if (
      severityOrder[current.severity] > severityOrder[existing.severity]
    ) {
      const index = acc.indexOf(existing);
      acc[index] = current;
    }
    return acc;
  }, [] as BlockedIngredient[]);
}
