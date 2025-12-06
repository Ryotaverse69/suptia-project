/**
 * 添加物安全性チェッカー
 *
 * 正規化された原材料リストとマスタデータを照合し、
 * 安全性評価を行う
 */

import type {
  AdditiveCheckResult,
  AdditiveInfo,
  NormalizedIngredients,
  SafetyGrade,
} from "./types";
import { SAFETY_GRADE_INFO } from "./types";
import { ADDITIVES_DATA, searchAdditive } from "./data";
import { normalizeIngredients } from "./normalizer";

/**
 * 原材料リストの安全性をチェック
 *
 * @param ingredients - 正規化された原材料リスト、または生テキスト
 * @returns 添加物チェック結果
 */
export function checkAdditives(
  ingredients: NormalizedIngredients | string,
): AdditiveCheckResult {
  // 文字列の場合は正規化
  const normalized: NormalizedIngredients =
    typeof ingredients === "string"
      ? normalizeIngredients(ingredients)
      : ingredients;

  const detected: AdditiveCheckResult["detected"] = [];
  const unknown: string[] = [];

  // 各原材料を添加物マスタと照合
  for (const item of normalized.items) {
    const additive = searchAdditive(item);

    if (additive) {
      detected.push({
        additive,
        matchedTerm: item,
      });
    } else {
      // マスタに存在しない場合はunknownに追加
      // ただし、明らかに有効成分（ビタミン、ミネラル等）は除外
      if (!isLikelyActiveIngredient(item)) {
        unknown.push(item);
      }
    }
  }

  // サマリー計算
  const safeCount = detected.filter(
    (d) => d.additive.safetyGrade === "safe",
  ).length;
  const cautionCount = detected.filter(
    (d) => d.additive.safetyGrade === "caution",
  ).length;
  const avoidCount = detected.filter(
    (d) => d.additive.safetyGrade === "avoid",
  ).length;

  // 全体グレード判定
  let overallGrade: SafetyGrade | "unknown";
  if (detected.length === 0) {
    overallGrade = "unknown";
  } else if (avoidCount > 0) {
    overallGrade = "avoid";
  } else if (cautionCount > 0) {
    overallGrade = "caution";
  } else {
    overallGrade = "safe";
  }

  // スコア減点計算
  const scoreDeduction = detected.reduce((total, d) => {
    return (
      total + Math.abs(SAFETY_GRADE_INFO[d.additive.safetyGrade].scoreImpact)
    );
  }, 0);

  // 警告メッセージ生成
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // avoid グレードの添加物がある場合
  const avoidAdditives = detected.filter(
    (d) => d.additive.safetyGrade === "avoid",
  );
  if (avoidAdditives.length > 0) {
    warnings.push(
      `回避推奨の添加物が${avoidAdditives.length}件検出されました: ${avoidAdditives.map((d) => d.additive.name).join("、")}`,
    );
    recommendations.push(
      "これらの添加物を含まない代替製品を検討することをお勧めします",
    );
  }

  // caution グレードの添加物がある場合
  const cautionAdditives = detected.filter(
    (d) => d.additive.safetyGrade === "caution",
  );
  if (cautionAdditives.length > 0) {
    warnings.push(
      `注意が必要な添加物が${cautionAdditives.length}件検出されました: ${cautionAdditives.map((d) => d.additive.name).join("、")}`,
    );
  }

  // 禁忌情報がある添加物
  const contraindicatedAdditives = detected.filter(
    (d) => d.additive.contraindications.length > 0,
  );
  if (contraindicatedAdditives.length > 0) {
    for (const { additive } of contraindicatedAdditives) {
      for (const contra of additive.contraindications) {
        if (contra.severity === "critical") {
          warnings.push(
            `【重要】${additive.name}は${contra.condition}の方には推奨されません: ${contra.description}`,
          );
        }
      }
    }
  }

  // 未知の原材料が多い場合
  if (unknown.length > 5) {
    recommendations.push(
      `${unknown.length}件の原材料がデータベースに登録されていません。今後の更新で対応予定です`,
    );
  }

  return {
    detected,
    unknown,
    summary: {
      safeCount,
      cautionCount,
      avoidCount,
      unknownCount: unknown.length,
      overallGrade,
      scoreDeduction,
    },
    warnings,
    recommendations,
  };
}

/**
 * 有効成分かどうかを判定（添加物ではない可能性が高い）
 */
function isLikelyActiveIngredient(name: string): boolean {
  const activeIngredientPatterns = [
    // ビタミン
    /ビタミン/i,
    /vitamin/i,
    /V\.[A-Z]/,
    /葉酸/,
    /ナイアシン/,
    /パントテン酸/,
    /ビオチン/,

    // ミネラル
    /カルシウム(?!カプセル)/,
    /マグネシウム(?!ステアリン酸)/,
    /亜鉛/,
    /鉄(?!酸化)/,
    /銅/,
    /セレン/,
    /クロム/,
    /マンガン/,
    /カリウム/,
    /ヨウ素/,

    // アミノ酸
    /アミノ酸/,
    /タンパク質/,
    /プロテイン/,
    /コラーゲン/,
    /グルタミン/,
    /アルギニン/,
    /リジン/,
    /タウリン/,
    /BCAA/,

    // オメガ脂肪酸
    /DHA/,
    /EPA/,
    /オメガ/,
    /omega/i,
    /魚油/,
    /フィッシュオイル/,

    // ハーブ・植物エキス
    /エキス/,
    /抽出物/,
    /extract/i,
    /パウダー/,
    /粉末/,

    // その他有効成分
    /コエンザイム/,
    /CoQ10/i,
    /ルテイン/,
    /アスタキサンチン/,
    /レスベラトロール/,
    /クルクミン/,
    /グルコサミン/,
    /コンドロイチン/,
    /乳酸菌/,
    /ビフィズス菌/,
    /プロバイオティクス/,
  ];

  return activeIngredientPatterns.some((pattern) => pattern.test(name));
}

/**
 * 商品の添加物安全性スコアを計算
 *
 * 既存の安全性スコアに統合するための減点値を返す
 * 注: 未登録原材料はスコアに影響しない（登録済み添加物のみ評価）
 */
export function calculateAdditiveScoreDeduction(
  result: AdditiveCheckResult,
): number {
  // 基本減点（各添加物のグレードに基づく）
  const deduction = result.summary.scoreDeduction;

  // 最大減点は30点
  return Math.min(deduction, 30);
}

/**
 * 添加物チェック結果を人間が読みやすい形式で出力
 */
export function formatCheckResult(result: AdditiveCheckResult): string {
  const lines: string[] = [];

  lines.push("=== 添加物安全性チェック結果 ===");
  lines.push("");

  // サマリー
  lines.push(`【総合評価】${getGradeLabel(result.summary.overallGrade)}`);
  lines.push(`  安全: ${result.summary.safeCount}件`);
  lines.push(`  注意: ${result.summary.cautionCount}件`);
  lines.push(`  回避推奨: ${result.summary.avoidCount}件`);
  lines.push(`  未登録: ${result.summary.unknownCount}件`);
  lines.push(`  スコア減点: -${result.summary.scoreDeduction}点`);
  lines.push("");

  // 警告
  if (result.warnings.length > 0) {
    lines.push("【警告】");
    for (const warning of result.warnings) {
      lines.push(`  ⚠️ ${warning}`);
    }
    lines.push("");
  }

  // 検出された添加物
  if (result.detected.length > 0) {
    lines.push("【検出された添加物】");
    for (const { additive, matchedTerm } of result.detected) {
      const gradeIcon = getGradeIcon(additive.safetyGrade);
      lines.push(`  ${gradeIcon} ${additive.name}`);
      if (matchedTerm !== additive.name) {
        lines.push(`     （原材料表記: ${matchedTerm}）`);
      }
      lines.push(`     カテゴリ: ${additive.category}`);
      if (additive.concerns.length > 0) {
        lines.push(`     懸念: ${additive.concerns.join("; ")}`);
      }
    }
    lines.push("");
  }

  // 推奨事項
  if (result.recommendations.length > 0) {
    lines.push("【推奨事項】");
    for (const rec of result.recommendations) {
      lines.push(`  💡 ${rec}`);
    }
  }

  return lines.join("\n");
}

/**
 * グレードラベル取得
 */
function getGradeLabel(grade: SafetyGrade | "unknown"): string {
  switch (grade) {
    case "safe":
      return "✅ 安全";
    case "caution":
      return "⚠️ 注意";
    case "avoid":
      return "❌ 回避推奨";
    case "unknown":
      return "❓ 評価不可";
  }
}

/**
 * グレードアイコン取得
 */
function getGradeIcon(grade: SafetyGrade): string {
  switch (grade) {
    case "safe":
      return "✅";
    case "caution":
      return "⚠️";
    case "avoid":
      return "❌";
  }
}

/**
 * 特定のユーザー条件に対する禁忌チェック
 */
export function checkContraindications(
  result: AdditiveCheckResult,
  userConditions: string[],
): Array<{
  additive: AdditiveInfo;
  condition: string;
  severity: "critical" | "warning" | "info";
  description: string;
}> {
  const matches: Array<{
    additive: AdditiveInfo;
    condition: string;
    severity: "critical" | "warning" | "info";
    description: string;
  }> = [];

  for (const { additive } of result.detected) {
    for (const contra of additive.contraindications) {
      if (
        userConditions.some(
          (uc) =>
            contra.condition.includes(uc) || uc.includes(contra.condition),
        )
      ) {
        matches.push({
          additive,
          condition: contra.condition,
          severity: contra.severity,
          description: contra.description,
        });
      }
    }
  }

  // 重要度順にソート
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  return matches.sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
  );
}
