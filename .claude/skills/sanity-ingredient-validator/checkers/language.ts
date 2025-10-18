/**
 * 言語チェック: 英語文章の混入検出
 */

export interface LanguageIssue {
  field: string;
  englishText: string;
  suggestion: string;
}

export interface LanguageCheckResult {
  passed: boolean;
  score: number;
  issues: LanguageIssue[];
}

/**
 * テキスト内の英語文章（連続する5単語以上）を検出
 */
const detectEnglishSentences = (text: string, fieldPath: string, issues: LanguageIssue[]): void => {
  // 連続する英単語（5単語以上）を検出
  const englishSentencePattern = /[A-Za-z]+(\s+[A-Za-z]+){4,}/g;
  const matches = text.match(englishSentencePattern);

  if (matches) {
    matches.forEach((match) => {
      issues.push({
        field: fieldPath,
        englishText: match.substring(0, 100), // 最初の100文字のみ
        suggestion: '日本語で記述してください',
      });
    });
  }
};

/**
 * オブジェクトを再帰的に走査して言語をチェック
 */
const traverseObject = (obj: any, path: string, issues: LanguageIssue[]): void => {
  const excludeFields = ['nameEn', 'slug', 'references'];

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;

    // 除外フィールドはスキップ
    if (excludeFields.includes(key)) continue;

    if (typeof value === 'string') {
      detectEnglishSentences(value, currentPath, issues);
    } else if (Array.isArray(value)) {
      value.forEach((item, idx) => {
        if (typeof item === 'string') {
          detectEnglishSentences(item, `${currentPath}[${idx}]`, issues);
        } else if (typeof item === 'object' && item !== null) {
          traverseObject(item, `${currentPath}[${idx}]`, issues);
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      traverseObject(value, currentPath, issues);
    }
  }
};

/**
 * 言語チェックを実行
 */
export const checkLanguage = (data: any): LanguageCheckResult => {
  const issues: LanguageIssue[] = [];

  // オブジェクト全体を走査
  traverseObject(data, '', issues);

  // スコア計算（5点満点）
  const maxScore = 5;
  const score = Math.max(0, maxScore - issues.length);

  const passed = issues.length === 0;

  return {
    passed,
    score,
    issues,
  };
};
