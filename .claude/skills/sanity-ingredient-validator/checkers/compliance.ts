/**
 * 薬機法コンプライアンスチェック: NGワード検出
 */

import { COMPLIANCE_RULES, generateSuggestion } from '../rules/ng-words';

export interface ComplianceViolation {
  field: string;
  word: string;
  severity: 'critical' | 'warning';
  context: string;
  suggestion: string;
  scoreImpact: number;
}

export interface ComplianceCheckResult {
  passed: boolean;
  score: number;
  violations: ComplianceViolation[];
}

/**
 * テキスト内のNGワードを検出
 */
const detectNGWords = (
  text: string,
  fieldPath: string,
  violations: ComplianceViolation[]
): void => {
  const sentences = text.split(/[。！？]/);

  // Critical NGワードチェック
  for (const rule of COMPLIANCE_RULES.critical) {
    if (text.includes(rule.word)) {
      const matchedSentence = sentences.find((s) => s.includes(rule.word)) || text.substring(0, 100);

      // OK表現が同じ文に含まれているかチェック
      const hasOkExpression = COMPLIANCE_RULES.ok.some((ok) => matchedSentence.includes(ok));

      violations.push({
        field: fieldPath,
        word: rule.word,
        severity: rule.severity,
        context: matchedSentence,
        suggestion: generateSuggestion(matchedSentence, rule.word),
        scoreImpact: hasOkExpression ? rule.score / 2 : rule.score, // OK表現があれば減点を半分に
      });
    }
  }

  // Warning NGワードチェック
  for (const rule of COMPLIANCE_RULES.warning) {
    if (text.includes(rule.word)) {
      const matchedSentence = sentences.find((s) => s.includes(rule.word)) || text.substring(0, 100);
      const hasOkExpression = COMPLIANCE_RULES.ok.some((ok) => matchedSentence.includes(ok));

      violations.push({
        field: fieldPath,
        word: rule.word,
        severity: rule.severity,
        context: matchedSentence,
        suggestion: generateSuggestion(matchedSentence, rule.word),
        scoreImpact: hasOkExpression ? rule.score / 2 : rule.score,
      });
    }
  }
};

/**
 * オブジェクトを再帰的に走査してNGワードをチェック
 */
const traverseObject = (obj: any, path: string, violations: ComplianceViolation[]): void => {
  const excludeFields = ['nameEn', 'slug', 'references'];

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;

    // 除外フィールドはスキップ
    if (excludeFields.includes(key)) continue;

    if (typeof value === 'string') {
      detectNGWords(value, currentPath, violations);
    } else if (Array.isArray(value)) {
      value.forEach((item, idx) => {
        if (typeof item === 'string') {
          detectNGWords(item, `${currentPath}[${idx}]`, violations);
        } else if (typeof item === 'object' && item !== null) {
          traverseObject(item, `${currentPath}[${idx}]`, violations);
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      traverseObject(value, currentPath, violations);
    }
  }
};

/**
 * 薬機法コンプライアンスチェックを実行
 */
export const checkCompliance = (data: any): ComplianceCheckResult => {
  const violations: ComplianceViolation[] = [];

  // オブジェクト全体を走査
  traverseObject(data, '', violations);

  // スコア計算（30点満点）
  const maxScore = 30;
  const totalImpact = violations.reduce((sum, v) => sum + Math.abs(v.scoreImpact), 0);
  const score = Math.max(0, maxScore - totalImpact);

  const passed = violations.length === 0;

  return {
    passed,
    score,
    violations,
  };
};
