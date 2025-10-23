/**
 * Sanity用薬機法コンプライアンスチェッカー（軽量版）
 *
 * ブラウザ環境（Sanity Studio）で動作するシンプル版
 */

export interface ComplianceValidationResult {
  isValid: boolean;
  message?: string;
  violations?: Array<{
    text: string;
    category: string;
    severity: "critical" | "high" | "medium";
  }>;
}

/**
 * 重要なNG表現のみ（Sanityバリデーション用）
 */
const CRITICAL_PATTERNS = [
  {
    pattern: /治[るりますまれすいた]|治療|治癒|完治/g,
    category: "疾病治療",
    severity: "critical" as const,
    message: "「治る」「治療」などの表現は薬機法違反です",
  },
  {
    pattern: /糖尿病[にをがで]|高血圧[にをがで]|がん[にをがで]|癌[にをがで]/g,
    category: "疾病名",
    severity: "critical" as const,
    message: "具体的な疾病名を使った効能表現は薬機法違反です",
  },
  {
    pattern: /予防[するされしますした]|防[ぐぎぐますぐまぐれた]/g,
    category: "予防効果",
    severity: "critical" as const,
    message: "「予防する」「防ぐ」などの表現は薬機法違反です",
  },
  {
    pattern: /必ず|絶対|100%|完全/g,
    category: "保証表現",
    severity: "critical" as const,
    message: "「必ず」「絶対」などの保証表現は薬機法違反です",
  },
  {
    pattern: /副作用なし|副作用ゼロ|安全100%|絶対安全/g,
    category: "安全性保証",
    severity: "critical" as const,
    message: "安全性を保証する表現は薬機法違反です",
  },
  {
    pattern: /即効|速攻|すぐに効く|即座に/g,
    category: "速効性",
    severity: "high" as const,
    message: "速効性を標榜する表現は避けるべきです",
  },
  {
    pattern: /改善[するされしますした]/g,
    category: "改善効果",
    severity: "high" as const,
    message: "断定的な改善効果の表現は避けるべきです",
  },
  {
    pattern: /シミ[がを]消|シワ[がを]消|若返[るりますまれた]/g,
    category: "美容効果",
    severity: "critical" as const,
    message: "美容効果を断定する表現は薬機法違反です",
  },
];

/**
 * テキストのコンプライアンスチェック（Sanityバリデーション用）
 */
export function validateCompliance(
  text: string | null | undefined,
): ComplianceValidationResult {
  // 空文字列はOK
  if (!text || text.trim().length === 0) {
    return { isValid: true };
  }

  const violations: ComplianceValidationResult["violations"] = [];

  // 各パターンをチェック
  for (const rule of CRITICAL_PATTERNS) {
    const matches = text.match(rule.pattern);
    if (matches) {
      for (const match of matches) {
        violations.push({
          text: match,
          category: rule.category,
          severity: rule.severity,
        });
      }
    }
  }

  // 重大違反（critical）がある場合はバリデーションエラー
  const criticalViolations = violations.filter(
    (v) => v.severity === "critical",
  );

  if (criticalViolations.length > 0) {
    return {
      isValid: false,
      message: `薬機法違反の可能性: ${criticalViolations.map((v) => `「${v.text}」(${v.category})`).join(", ")}`,
      violations,
    };
  }

  // 高リスク違反は警告のみ（バリデーションは通す）
  if (violations.length > 0) {
    return {
      isValid: true, // 保存は可能
      message: `要注意: ${violations.map((v) => `「${v.text}」(${v.category})`).join(", ")}`,
      violations,
    };
  }

  return { isValid: true };
}

/**
 * OK表現の例（参考用）
 */
export const APPROVED_EXPRESSIONS = [
  "健康維持をサポート",
  "栄養補給に",
  "〜に役立つ可能性",
  "一般的に〜と言われています",
  "研究では〜が報告されています",
  "バランスの取れた食生活の一部として",
  "継続的な摂取により",
  "適切な食事と運動と併せて",
];
