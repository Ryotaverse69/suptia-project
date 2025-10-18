/**
 * 文字数チェック: 日本語文字数を正確にカウント
 */

export interface WordCountIssue {
  field: string;
  expected: string;
  actual: number;
  severity: 'error' | 'warning';
}

export interface WordCountCheckResult {
  passed: boolean;
  score: number;
  total: number;
  issues: WordCountIssue[];
}

/**
 * 日本語文字数を正確にカウント（ひらがな、カタカナ、漢字）
 */
const countJapaneseChars = (text: string): number => {
  if (!text) return 0;
  // Unicode文字プロパティを使用
  const matches = text.match(/\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Han}/gu);
  return matches ? matches.length : 0;
};

/**
 * 全体の文字数をカウント（空白・記号を除く）
 */
const countTotalChars = (text: string): number => {
  if (!text) return 0;
  // 全てのUnicode文字（記号・空白を除く）
  const matches = text.match(/\p{L}/gu);
  return matches ? matches.length : 0;
};

interface WordCountRules {
  min?: number;
  max?: number;
}

// 品質重視の文字数基準（柔軟な範囲設定）
const WORD_COUNT_RULES: Record<string, WordCountRules> = {
  description: { min: 200, max: 800 },
  recommendedDosage: { min: 200, max: 800 },
  sideEffects: { min: 150, max: 500 },
};

const ARRAY_ITEM_RULES: Record<string, WordCountRules> = {
  benefits: { min: 50, max: 300 },  // 簡潔さを優先
  interactions: { min: 50, max: 200 },
};

const FAQ_RULES = {
  question: { max: 80 },  // やや長めの質問も許容
  answer: { min: 200, max: 1000 },  // 簡潔でも詳細でも可
};

const TOTAL_MIN = 2000;  // 読みやすさを考慮して削減

/**
 * 文字数チェックを実行
 */
export const checkWordCount = (data: any): WordCountCheckResult => {
  const issues: WordCountIssue[] = [];
  let totalChars = 0;

  // 単一フィールドのチェック
  for (const [field, rules] of Object.entries(WORD_COUNT_RULES)) {
    if (field in data && typeof data[field] === 'string') {
      const count = countTotalChars(data[field]);
      totalChars += count;

      if (rules.min && count < rules.min) {
        issues.push({
          field,
          expected: `${rules.min}文字以上`,
          actual: count,
          severity: 'error',
        });
      }
      if (rules.max && count > rules.max) {
        issues.push({
          field,
          expected: `${rules.max}文字以下`,
          actual: count,
          severity: 'warning',
        });
      }
    }
  }

  // 配列フィールドのアイテムごとのチェック
  for (const [field, rules] of Object.entries(ARRAY_ITEM_RULES)) {
    if (field in data && Array.isArray(data[field])) {
      data[field].forEach((item: any, idx: number) => {
        const text = typeof item === 'string' ? item : item?.text || '';
        const count = countTotalChars(text);
        totalChars += count;

        if (rules.min && count < rules.min) {
          issues.push({
            field: `${field}[${idx}]`,
            expected: `${rules.min}文字以上`,
            actual: count,
            severity: 'warning',
          });
        }
        if (rules.max && count > rules.max) {
          issues.push({
            field: `${field}[${idx}]`,
            expected: `${rules.max}文字以下`,
            actual: count,
            severity: 'warning',
          });
        }
      });
    }
  }

  // FAQのチェック
  if ('faqs' in data && Array.isArray(data.faqs)) {
    data.faqs.forEach((faq: any, idx: number) => {
      if (faq.question) {
        const qCount = countTotalChars(faq.question);
        totalChars += qCount;

        if (qCount > FAQ_RULES.question.max!) {
          issues.push({
            field: `faqs[${idx}].question`,
            expected: `${FAQ_RULES.question.max}文字以下`,
            actual: qCount,
            severity: 'warning',
          });
        }
      }

      if (faq.answer) {
        const aCount = countTotalChars(faq.answer);
        totalChars += aCount;

        if (aCount < FAQ_RULES.answer.min!) {
          issues.push({
            field: `faqs[${idx}].answer`,
            expected: `${FAQ_RULES.answer.min}文字以上`,
            actual: aCount,
            severity: 'error',
          });
        }
        if (aCount > FAQ_RULES.answer.max!) {
          issues.push({
            field: `faqs[${idx}].answer`,
            expected: `${FAQ_RULES.answer.max}文字以下`,
            actual: aCount,
            severity: 'warning',
          });
        }
      }
    });
  }

  // 合計文字数チェック
  if (totalChars < TOTAL_MIN) {
    issues.push({
      field: 'total',
      expected: `${TOTAL_MIN}文字以上`,
      actual: totalChars,
      severity: 'error',
    });
  }

  // スコア計算（20点満点）
  const maxScore = 20;
  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;

  const score = Math.max(0, maxScore - errorCount * 5 - warningCount * 2);
  const passed = errorCount === 0;

  return {
    passed,
    score,
    total: totalChars,
    issues,
  };
};
