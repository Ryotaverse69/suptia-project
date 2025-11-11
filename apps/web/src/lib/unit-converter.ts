/**
 * 単位換算ユーティリティ
 *
 * サプリメント成分の様々な単位を統一的に扱うための換算関数
 * すべてmg（ミリグラム）に統一して比較可能にする
 */

/**
 * サポートする単位の型定義
 */
export type SupportedUnit = "mg" | "g" | "mcg" | "μg" | "IU" | "iu";

/**
 * 成分ごとのIU→mg換算係数
 * 参考: https://www.mayoclinic.org/drugs-supplements
 */
const IU_TO_MG_CONVERSION: Record<string, number> = {
  // ビタミンA: 1 IU = 0.3 mcg retinol = 0.0003 mg
  "vitamin-a": 0.0003,
  ビタミンA: 0.0003,

  // ビタミンD: 1 IU = 0.025 mcg = 0.000025 mg
  "vitamin-d": 0.000025,
  ビタミンD: 0.000025,
  "vitamin-d3": 0.000025,
  ビタミンD3: 0.000025,

  // ビタミンE: 1 IU = 0.67 mg (天然型α-トコフェロール)
  "vitamin-e": 0.67,
  ビタミンE: 0.67,

  // デフォルト値（IUの場合、成分不明なら警告を出す）
  default: 0.001,
};

/**
 * 単位をmgに換算
 *
 * @param value 値
 * @param unit 単位
 * @param ingredientName 成分名（IU換算時に必要）
 * @returns mg換算値
 */
export function convertToMg(
  value: number,
  unit: SupportedUnit,
  ingredientName?: string,
): { value: number; confidence: number; warning?: string } {
  // 値の検証
  if (!value || value < 0) {
    return { value: 0, confidence: 0, warning: "無効な値です" };
  }

  // 異常値チェック（サプリメントとして現実的でない値）
  if (value > 1000000) {
    return {
      value: 0,
      confidence: 0,
      warning: `異常な値が検出されました: ${value} ${unit}`,
    };
  }

  // 単位を正規化（大文字小文字、μgとmcgの統一）
  const normalizedUnit = unit
    .toLowerCase()
    .replace("μg", "mcg") as SupportedUnit;

  switch (normalizedUnit) {
    case "mg":
      return { value, confidence: 1.0 };

    case "g":
      return { value: value * 1000, confidence: 1.0 };

    case "mcg":
      return { value: value * 0.001, confidence: 1.0 };

    case "iu":
      if (!ingredientName) {
        return {
          value: value * IU_TO_MG_CONVERSION.default,
          confidence: 0.5,
          warning:
            "IU換算には成分名が必要です。デフォルト換算率を使用しました。",
        };
      }

      const conversionRate =
        IU_TO_MG_CONVERSION[ingredientName.toLowerCase()] ||
        IU_TO_MG_CONVERSION.default;

      const isDefaultRate = conversionRate === IU_TO_MG_CONVERSION.default;

      return {
        value: value * conversionRate,
        confidence: isDefaultRate ? 0.7 : 0.95,
        warning: isDefaultRate
          ? `${ingredientName}のIU換算率が不明なため、デフォルト値を使用しました`
          : undefined,
      };

    default:
      return {
        value: 0,
        confidence: 0,
        warning: `未対応の単位: ${unit}`,
      };
  }
}

/**
 * 複数の成分量を合計（同一成分の場合）
 *
 * @param amounts 成分量の配列
 * @returns 合計値とその信頼度
 */
export function sumIngredientAmounts(
  amounts: Array<{
    value: number;
    unit: SupportedUnit;
    ingredientName?: string;
  }>,
): { totalMg: number; confidence: number; warnings: string[] } {
  const warnings: string[] = [];
  let totalMg = 0;
  let minConfidence = 1.0;

  for (const amount of amounts) {
    const converted = convertToMg(
      amount.value,
      amount.unit,
      amount.ingredientName,
    );

    totalMg += converted.value;
    minConfidence = Math.min(minConfidence, converted.confidence);

    if (converted.warning) {
      warnings.push(converted.warning);
    }
  }

  return { totalMg, confidence: minConfidence, warnings };
}

/**
 * servingsPerDayの異常値チェック
 *
 * @param servingsPerDay 1日あたりの摂取回数
 * @returns 検証結果
 */
export function validateServingsPerDay(servingsPerDay: number): {
  isValid: boolean;
  warning?: string;
} {
  if (!servingsPerDay || servingsPerDay <= 0) {
    return { isValid: false, warning: "摂取回数は1以上である必要があります" };
  }

  if (servingsPerDay > 10) {
    return {
      isValid: false,
      warning: `異常な摂取回数が検出されました: 1日${servingsPerDay}回`,
    };
  }

  return { isValid: true };
}

/**
 * ingredientAmountの異常値チェック
 *
 * @param amount 成分量
 * @param unit 単位
 * @param ingredientName 成分名
 * @returns 検証結果
 */
export function validateIngredientAmount(
  amount: number,
  unit: SupportedUnit,
  ingredientName?: string,
): { isValid: boolean; warning?: string } {
  const converted = convertToMg(amount, unit, ingredientName);

  if (converted.warning) {
    return { isValid: false, warning: converted.warning };
  }

  // 成分別の現実的な上限値（mg）
  const maxAmounts: Record<string, number> = {
    "vitamin-c": 10000, // ビタミンC: 最大10g
    ビタミンC: 10000,
    "vitamin-d": 0.25, // ビタミンD: 最大10000IU = 0.25mg
    ビタミンD: 0.25,
    "omega-3": 5000, // オメガ3: 最大5g
    オメガ3: 5000,
    default: 50000, // デフォルト: 50g
  };

  const maxAmount =
    maxAmounts[ingredientName?.toLowerCase() || "default"] ||
    maxAmounts.default;

  if (converted.value > maxAmount) {
    return {
      isValid: false,
      warning: `${ingredientName}の量が異常に多いです: ${converted.value}mg（上限: ${maxAmount}mg）`,
    };
  }

  return { isValid: true };
}

/**
 * 単位表示のフォーマット
 *
 * @param value mg単位の値
 * @param preferredUnit 優先表示単位
 * @returns フォーマットされた文字列
 */
export function formatWithUnit(
  value: number,
  preferredUnit: "auto" | "mg" | "g" | "mcg" = "auto",
): string {
  if (preferredUnit === "auto") {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}g`;
    } else if (value < 1) {
      return `${(value * 1000).toFixed(0)}mcg`;
    } else {
      return `${value.toFixed(1)}mg`;
    }
  }

  switch (preferredUnit) {
    case "g":
      return `${(value / 1000).toFixed(2)}g`;
    case "mcg":
      return `${(value * 1000).toFixed(0)}mcg`;
    case "mg":
    default:
      return `${value.toFixed(1)}mg`;
  }
}
