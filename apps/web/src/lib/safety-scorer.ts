/**
 * 安全性スコア計算ロジック（透明性重視版）
 *
 * 商品の安全性を0-100点でスコアリングする
 * 各要素の影響が明確にわかるよう設計
 */

import type { ContraindicationTag } from "./safety-checker";

/**
 * 安全性スコア計算の入力データ
 */
export interface SafetyScoreInput {
  // 禁忌情報
  contraindicationTags?: ContraindicationTag[];
  contraindicationCount?: number;

  // 警告情報
  warnings?: string[];
  sideEffects?: string[];

  // 品質保証
  thirdPartyTested?: boolean;
  gmpCertified?: boolean;
  organicCertified?: boolean;

  // 成分の相互作用リスク
  interactionRisks?: Array<{
    ingredient1: string;
    ingredient2: string;
    riskLevel: "low" | "medium" | "high";
    description: string;
  }>;

  // 製造情報
  manufacturingCountry?: string;
  manufacturingYear?: number;
}

/**
 * スコア計算の詳細結果
 */
export interface SafetyScoreResult {
  totalScore: number;
  breakdown: {
    baseScore: number;
    contraindicationDeduction: number;
    warningDeduction: number;
    sideEffectDeduction: number;
    qualityBonus: number;
    interactionDeduction: number;
    manufacturingBonus: number;
  };
  details: string[];
  recommendations: string[];
  confidence: number;
}

/**
 * 禁忌タグの重要度マッピング
 */
const CONTRAINDICATION_SEVERITY: Record<string, number> = {
  // Critical（重大: -40点/件）
  pregnant: 40,
  breastfeeding: 40,
  infants: 40,
  children: 40,
  surgery: 40,
  "blood-clotting-disorder": 40,
  "bleeding-risk": 40,
  "kidney-disease": 40,
  "liver-disease": 40,
  "heart-disease": 40,
  chemotherapy: 40,
  "anticoagulant-use": 40,
  "antiplatelet-use": 40,

  // Warning（警告: -20点/件）
  diabetes: 20,
  hypertension: 20,
  hypotension: 20,
  "thyroid-disorder": 20,
  "autoimmune-disease": 20,
  epilepsy: 20,
  "mental-disorder": 20,
  "antidepressant-use": 20,
  "immunosuppressant-use": 20,
  "hormone-therapy": 20,

  // Info（情報: -5点/件）
  elderly: 5,
  "digestive-disorder": 5,
  "allergy-prone": 5,
  "shellfish-allergy": 5,
  "soy-allergy": 5,
  "nut-allergy": 5,
};

/**
 * 製造国の信頼度スコア
 */
const MANUFACTURING_COUNTRY_SCORES: Record<string, number> = {
  // 高品質管理国（+10点）
  日本: 10,
  Japan: 10,
  ドイツ: 10,
  Germany: 10,
  スイス: 10,
  Switzerland: 10,
  アメリカ: 8,
  USA: 8,
  カナダ: 8,
  Canada: 8,

  // 中品質管理国（+5点）
  韓国: 5,
  Korea: 5,
  オーストラリア: 5,
  Australia: 5,
  ニュージーランド: 5,
  "New Zealand": 5,

  // その他（0点）
  default: 0,
};

/**
 * 安全性スコアを計算
 */
export function calculateSafetyScore(
  input: SafetyScoreInput,
): SafetyScoreResult {
  const breakdown = {
    baseScore: 100,
    contraindicationDeduction: 0,
    warningDeduction: 0,
    sideEffectDeduction: 0,
    qualityBonus: 0,
    interactionDeduction: 0,
    manufacturingBonus: 0,
  };

  const details: string[] = [];
  const recommendations: string[] = [];
  let confidence = 1.0;

  // 1. 禁忌タグによる減点
  if (input.contraindicationTags && input.contraindicationTags.length > 0) {
    let totalDeduction = 0;
    const criticalCount = input.contraindicationTags.filter(
      (tag) => (CONTRAINDICATION_SEVERITY[tag] || 0) >= 40,
    ).length;
    const warningCount = input.contraindicationTags.filter(
      (tag) =>
        (CONTRAINDICATION_SEVERITY[tag] || 0) >= 20 &&
        (CONTRAINDICATION_SEVERITY[tag] || 0) < 40,
    ).length;
    const infoCount =
      input.contraindicationTags.length - criticalCount - warningCount;

    // 各カテゴリごとに減点（上限設定あり）
    totalDeduction += Math.min(criticalCount * 40, 60); // 最大60点減点
    totalDeduction += Math.min(warningCount * 20, 30); // 最大30点減点
    totalDeduction += Math.min(infoCount * 5, 10); // 最大10点減点

    breakdown.contraindicationDeduction = totalDeduction;
    details.push(
      `禁忌タグ${input.contraindicationTags.length}件: -${totalDeduction}点` +
        `（重大${criticalCount}件、警告${warningCount}件、情報${infoCount}件）`,
    );

    if (criticalCount > 0) {
      recommendations.push(
        "重大な禁忌事項があります。医師に相談してください。",
      );
    }
  } else if (input.contraindicationCount) {
    // タグ詳細がない場合は件数から推定
    const deduction = Math.min(input.contraindicationCount * 20, 60);
    breakdown.contraindicationDeduction = deduction;
    details.push(`禁忌${input.contraindicationCount}件: -${deduction}点`);
    confidence *= 0.8; // 詳細不明のため信頼度を下げる
  }

  // 2. 警告事項による減点
  if (input.warnings && input.warnings.length > 0) {
    const deduction = Math.min(input.warnings.length * 10, 30);
    breakdown.warningDeduction = deduction;
    details.push(`警告事項${input.warnings.length}件: -${deduction}点`);
  }

  // 3. 副作用による減点
  if (input.sideEffects && input.sideEffects.length > 0) {
    const deduction = Math.min(input.sideEffects.length * 8, 20);
    breakdown.sideEffectDeduction = deduction;
    details.push(`副作用報告${input.sideEffects.length}件: -${deduction}点`);
  }

  // 4. 品質保証による加点
  let qualityBonus = 0;
  const qualityDetails: string[] = [];

  if (input.thirdPartyTested) {
    qualityBonus += 10;
    qualityDetails.push("第三者機関検査済み(+10)");
  }
  if (input.gmpCertified) {
    qualityBonus += 5;
    qualityDetails.push("GMP認証(+5)");
  }
  if (input.organicCertified) {
    qualityBonus += 5;
    qualityDetails.push("オーガニック認証(+5)");
  }

  if (qualityBonus > 0) {
    breakdown.qualityBonus = qualityBonus;
    details.push(
      `品質保証: +${qualityBonus}点（${qualityDetails.join("、")}）`,
    );
    recommendations.push("品質保証が充実しています。");
  }

  // 5. 成分相互作用による減点
  if (input.interactionRisks && input.interactionRisks.length > 0) {
    let interactionDeduction = 0;
    const highRiskCount = input.interactionRisks.filter(
      (r) => r.riskLevel === "high",
    ).length;
    const mediumRiskCount = input.interactionRisks.filter(
      (r) => r.riskLevel === "medium",
    ).length;

    interactionDeduction += highRiskCount * 25;
    interactionDeduction += mediumRiskCount * 10;
    interactionDeduction = Math.min(interactionDeduction, 40); // 最大40点減点

    if (interactionDeduction > 0) {
      breakdown.interactionDeduction = interactionDeduction;
      details.push(
        `成分相互作用リスク: -${interactionDeduction}点` +
          `（高リスク${highRiskCount}件、中リスク${mediumRiskCount}件）`,
      );

      if (highRiskCount > 0) {
        recommendations.push(
          "危険な成分の組み合わせが検出されました。使用を避けるか医師に相談してください。",
        );
      }
    }
  }

  // 6. 製造国による加点
  if (input.manufacturingCountry) {
    const bonus =
      MANUFACTURING_COUNTRY_SCORES[input.manufacturingCountry] ||
      MANUFACTURING_COUNTRY_SCORES.default;
    if (bonus > 0) {
      breakdown.manufacturingBonus = bonus;
      details.push(`製造国（${input.manufacturingCountry}）: +${bonus}点`);
    }
  }

  // 7. 製造年による減点（古い場合）
  if (input.manufacturingYear) {
    const currentYear = new Date().getFullYear();
    const age = currentYear - input.manufacturingYear;
    if (age > 3) {
      const ageDeduction = Math.min(age * 2, 10);
      breakdown.manufacturingBonus -= ageDeduction;
      details.push(`製造から${age}年経過: -${ageDeduction}点`);
      recommendations.push(
        "製造から時間が経過しています。新しい商品の検討をお勧めします。",
      );
    }
  }

  // 総合スコアの計算
  const totalScore = Math.max(
    0,
    Math.min(
      100,
      breakdown.baseScore -
        breakdown.contraindicationDeduction -
        breakdown.warningDeduction -
        breakdown.sideEffectDeduction -
        breakdown.interactionDeduction +
        breakdown.qualityBonus +
        breakdown.manufacturingBonus,
    ),
  );

  // 推奨事項の追加
  if (totalScore >= 90) {
    recommendations.push("非常に安全性の高い商品です。");
  } else if (totalScore >= 70) {
    recommendations.push("一般的に安全な商品ですが、個人差があります。");
  } else if (totalScore >= 50) {
    recommendations.push("使用前に注意事項をよく確認してください。");
  } else {
    recommendations.push(
      "安全性に懸念があります。専門家に相談することをお勧めします。",
    );
  }

  return {
    totalScore,
    breakdown,
    details,
    recommendations,
    confidence,
  };
}

/**
 * 成分の相互作用をチェック
 */
export function checkIngredientInteractions(
  ingredients: Array<{ name: string; id: string }>,
): Array<{
  ingredient1: string;
  ingredient2: string;
  riskLevel: "low" | "medium" | "high";
  description: string;
}> {
  const interactions: Array<{
    ingredient1: string;
    ingredient2: string;
    riskLevel: "low" | "medium" | "high";
    description: string;
  }> = [];

  // 既知の危険な組み合わせ
  const dangerousCombinations: Record<
    string,
    {
      pair: string[];
      risk: "low" | "medium" | "high";
      description: string;
    }
  > = {
    "calcium-iron": {
      pair: ["カルシウム", "鉄"],
      risk: "medium",
      description: "カルシウムと鉄の同時摂取は吸収を妨げる可能性があります",
    },
    "stjohns-ssri": {
      pair: ["セントジョーンズワート", "SSRI"],
      risk: "high",
      description: "セントジョーンズワートとSSRIの併用は危険です",
    },
    "vitamin-k-warfarin": {
      pair: ["ビタミンK", "ワーファリン"],
      risk: "high",
      description: "ビタミンKは抗凝固薬の効果を減弱させます",
    },
    "ginkgo-aspirin": {
      pair: ["イチョウ葉", "アスピリン"],
      risk: "high",
      description: "出血リスクが増加する可能性があります",
    },
  };

  // 成分ペアをチェック
  for (let i = 0; i < ingredients.length; i++) {
    for (let j = i + 1; j < ingredients.length; j++) {
      const ingredient1 = ingredients[i].name;
      const ingredient2 = ingredients[j].name;

      // 既知の組み合わせをチェック
      for (const [key, combo] of Object.entries(dangerousCombinations)) {
        if (
          (combo.pair.includes(ingredient1) &&
            combo.pair.includes(ingredient2)) ||
          (ingredient1.includes(combo.pair[0]) &&
            ingredient2.includes(combo.pair[1])) ||
          (ingredient2.includes(combo.pair[0]) &&
            ingredient1.includes(combo.pair[1]))
        ) {
          interactions.push({
            ingredient1,
            ingredient2,
            riskLevel: combo.risk,
            description: combo.description,
          });
        }
      }
    }
  }

  return interactions;
}

/**
 * 安全性グレードを取得
 */
export function getSafetyGrade(score: number): {
  grade: "S" | "A" | "B" | "C" | "D";
  label: string;
  color: string;
} {
  if (score >= 90) {
    return { grade: "S", label: "最高の安全性", color: "text-green-700" };
  } else if (score >= 80) {
    return { grade: "A", label: "高い安全性", color: "text-blue-700" };
  } else if (score >= 70) {
    return { grade: "B", label: "標準的な安全性", color: "text-yellow-700" };
  } else if (score >= 60) {
    return { grade: "C", label: "注意が必要", color: "text-orange-700" };
  } else {
    return { grade: "D", label: "要検討", color: "text-red-700" };
  }
}
