/**
 * 安全性チェッカー
 * 商品に含まれる成分の禁忌タグとユーザーの健康プロファイルを照合し、
 * 危険性がある場合にアラートを生成します。
 */

/**
 * 禁忌タグの型定義（Sanityスキーマと一致）
 */
export type ContraindicationTag =
  | "pregnant"
  | "breastfeeding"
  | "infants"
  | "children"
  | "elderly"
  | "blood-clotting-disorder"
  | "bleeding-risk"
  | "surgery"
  | "diabetes"
  | "hypertension"
  | "hypotension"
  | "kidney-disease"
  | "liver-disease"
  | "heart-disease"
  | "thyroid-disorder"
  | "autoimmune-disease"
  | "digestive-disorder"
  | "epilepsy"
  | "mental-disorder"
  | "anticoagulant-use"
  | "antiplatelet-use"
  | "antidepressant-use"
  | "immunosuppressant-use"
  | "hormone-therapy"
  | "chemotherapy"
  | "allergy-prone"
  | "shellfish-allergy"
  | "soy-allergy"
  | "nut-allergy";

/**
 * 日本語ラベルのマッピング
 */
export const CONTRAINDICATION_LABELS: Record<ContraindicationTag, string> = {
  pregnant: "妊娠中",
  breastfeeding: "授乳中",
  infants: "乳幼児",
  children: "小児",
  elderly: "高齢者",
  "blood-clotting-disorder": "血液凝固障害",
  "bleeding-risk": "出血リスク",
  surgery: "手術前後",
  diabetes: "糖尿病",
  hypertension: "高血圧",
  hypotension: "低血圧",
  "kidney-disease": "腎臓病",
  "liver-disease": "肝臓病",
  "heart-disease": "心疾患",
  "thyroid-disorder": "甲状腺疾患",
  "autoimmune-disease": "自己免疫疾患",
  "digestive-disorder": "消化器疾患",
  epilepsy: "てんかん",
  "mental-disorder": "精神疾患",
  "anticoagulant-use": "抗凝固薬服用中",
  "antiplatelet-use": "抗血小板薬服用中",
  "antidepressant-use": "抗うつ薬服用中",
  "immunosuppressant-use": "免疫抑制薬服用中",
  "hormone-therapy": "ホルモン剤服用中",
  chemotherapy: "化学療法中",
  "allergy-prone": "アレルギー体質",
  "shellfish-allergy": "貝アレルギー",
  "soy-allergy": "大豆アレルギー",
  "nut-allergy": "ナッツアレルギー",
};

/**
 * アラート重要度
 */
export type AlertSeverity = "critical" | "warning" | "info";

/**
 * 成分情報（最小限の情報）
 */
export interface IngredientInfo {
  name: string;
  slug: string;
  contraindications?: ContraindicationTag[];
}

/**
 * 安全性アラート
 */
export interface SafetyAlert {
  severity: AlertSeverity;
  ingredient: string; // 成分名
  ingredientSlug: string;
  userCondition: string; // ユーザーの健康状態（日本語ラベル）
  userConditionTag: ContraindicationTag;
  message: string;
}

/**
 * ユーザーの健康プロファイル
 */
export interface UserHealthProfile {
  conditions: ContraindicationTag[];
}

/**
 * 安全性チェック結果
 */
export interface SafetyCheckResult {
  isOverallSafe: boolean;
  alerts: SafetyAlert[];
  riskLevel: "safe" | "low-risk" | "medium-risk" | "high-risk";
  summary: string;
}

/**
 * 重要度レベルの判定
 *
 * critical（重大）: 生命に関わる可能性がある
 * warning（警告）: 注意が必要
 * info（情報）: 念のため確認推奨
 */
const SEVERITY_MAP: Record<ContraindicationTag, AlertSeverity> = {
  // Critical（生命に関わる可能性）
  pregnant: "critical",
  breastfeeding: "critical",
  infants: "critical",
  children: "critical",
  surgery: "critical",
  "blood-clotting-disorder": "critical",
  "bleeding-risk": "critical",
  "kidney-disease": "critical",
  "liver-disease": "critical",
  "heart-disease": "critical",
  chemotherapy: "critical",
  "anticoagulant-use": "critical",
  "antiplatelet-use": "critical",

  // Warning（注意が必要）
  diabetes: "warning",
  hypertension: "warning",
  hypotension: "warning",
  "thyroid-disorder": "warning",
  "autoimmune-disease": "warning",
  epilepsy: "warning",
  "mental-disorder": "warning",
  "antidepressant-use": "warning",
  "immunosuppressant-use": "warning",
  "hormone-therapy": "warning",

  // Info（念のため確認推奨）
  elderly: "info",
  "digestive-disorder": "info",
  "allergy-prone": "info",
  "shellfish-allergy": "info",
  "soy-allergy": "info",
  "nut-allergy": "info",
};

/**
 * 安全性メッセージの生成
 */
function generateAlertMessage(
  ingredientName: string,
  condition: ContraindicationTag,
  severity: AlertSeverity,
): string {
  const conditionLabel = CONTRAINDICATION_LABELS[condition];

  switch (severity) {
    case "critical":
      return `【重要】${ingredientName}は${conditionLabel}の方には推奨されません。医師に相談してください。`;
    case "warning":
      return `${ingredientName}は${conditionLabel}の方は注意が必要です。使用前に医師に相談することをお勧めします。`;
    case "info":
      return `${ingredientName}は${conditionLabel}の方は念のため注意してください。`;
    default:
      return `${ingredientName}について確認してください。`;
  }
}

/**
 * 商品の安全性チェックを実行
 *
 * @param ingredients - 商品に含まれる成分のリスト
 * @param userProfile - ユーザーの健康プロファイル
 * @returns 安全性チェック結果
 */
export function checkProductSafety(
  ingredients: IngredientInfo[],
  userProfile: UserHealthProfile,
): SafetyCheckResult {
  const alerts: SafetyAlert[] = [];

  // ユーザーが選択した各健康状態に対して、成分の禁忌タグをチェック
  for (const ingredient of ingredients) {
    if (
      !ingredient.contraindications ||
      ingredient.contraindications.length === 0
    ) {
      continue;
    }

    for (const userCondition of userProfile.conditions) {
      if (ingredient.contraindications.includes(userCondition)) {
        const severity = SEVERITY_MAP[userCondition];
        const message = generateAlertMessage(
          ingredient.name,
          userCondition,
          severity,
        );

        alerts.push({
          severity,
          ingredient: ingredient.name,
          ingredientSlug: ingredient.slug,
          userCondition: CONTRAINDICATION_LABELS[userCondition],
          userConditionTag: userCondition,
          message,
        });
      }
    }
  }

  // 全体的なリスクレベルを判定
  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const warningCount = alerts.filter((a) => a.severity === "warning").length;

  let riskLevel: "safe" | "low-risk" | "medium-risk" | "high-risk";
  let summary: string;

  if (criticalCount > 0) {
    riskLevel = "high-risk";
    summary = `重大な注意事項が${criticalCount}件見つかりました。この商品の使用は推奨されません。`;
  } else if (warningCount >= 2) {
    riskLevel = "medium-risk";
    summary = `注意事項が${warningCount}件見つかりました。使用前に医師に相談してください。`;
  } else if (warningCount === 1) {
    riskLevel = "low-risk";
    summary = `注意事項が1件見つかりました。念のため確認してください。`;
  } else if (alerts.length > 0) {
    riskLevel = "low-risk";
    summary = `軽微な注意事項が${alerts.length}件見つかりました。`;
  } else {
    riskLevel = "safe";
    summary = "選択された健康状態に関する禁忌はありません。";
  }

  return {
    isOverallSafe: alerts.length === 0,
    alerts,
    riskLevel,
    summary,
  };
}

/**
 * 複数商品の安全性を一括チェック
 *
 * @param products - 商品リスト（各商品に含まれる成分情報を含む）
 * @param userProfile - ユーザーの健康プロファイル
 * @returns 商品ごとの安全性チェック結果
 */
export function checkMultipleProductsSafety(
  products: Array<{ id: string; name: string; ingredients: IngredientInfo[] }>,
  userProfile: UserHealthProfile,
): Array<{
  productId: string;
  productName: string;
  result: SafetyCheckResult;
}> {
  return products.map((product) => ({
    productId: product.id,
    productName: product.name,
    result: checkProductSafety(product.ingredients, userProfile),
  }));
}

/**
 * アラートを重要度順にソート
 */
export function sortAlertsBySeverity(alerts: SafetyAlert[]): SafetyAlert[] {
  const severityOrder: Record<AlertSeverity, number> = {
    critical: 0,
    warning: 1,
    info: 2,
  };

  return [...alerts].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
  );
}

/**
 * 特定の成分に対する禁忌タグを取得
 * （デバッグ・管理画面用）
 */
export function getContraindicationsForIngredient(
  ingredientName: string,
  ingredients: IngredientInfo[],
): ContraindicationTag[] {
  const ingredient = ingredients.find((i) => i.name === ingredientName);
  return ingredient?.contraindications || [];
}

/**
 * 禁忌タグの日本語ラベルを取得
 */
export function getContraindicationLabel(tag: ContraindicationTag): string {
  return CONTRAINDICATION_LABELS[tag] || tag;
}
