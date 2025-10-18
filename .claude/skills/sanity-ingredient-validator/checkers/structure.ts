/**
 * 構造チェック: 必須フィールドと配列要素数の検証
 */

export interface StructureCheckResult {
  passed: boolean;
  score: number;
  missingFields: string[];
  arrayFieldIssues: Array<{
    field: string;
    expected: number;
    actual: number;
  }>;
}

const REQUIRED_FIELDS = [
  'name',
  'nameEn',
  'slug',
  'category',
  'description',
  'benefits',
  'recommendedDosage',
  'sideEffects',
  'interactions',
  'faqs',
  'references',
  'evidenceLevel',
];

const ARRAY_FIELD_MINIMUMS: Record<string, number> = {
  benefits: 10,
  interactions: 5,
  faqs: 5,
  references: 5,
};

/**
 * 構造チェックを実行
 */
export const checkStructure = (data: any): StructureCheckResult => {
  const missingFields: string[] = [];
  const arrayFieldIssues: Array<{ field: string; expected: number; actual: number }> = [];

  // 必須フィールドチェック
  for (const field of REQUIRED_FIELDS) {
    if (!(field in data) || data[field] === null || data[field] === undefined) {
      missingFields.push(field);
    }
  }

  // 配列フィールドの要素数チェック
  for (const [field, minCount] of Object.entries(ARRAY_FIELD_MINIMUMS)) {
    if (field in data && Array.isArray(data[field])) {
      const actualCount = data[field].length;
      if (actualCount < minCount) {
        arrayFieldIssues.push({
          field,
          expected: minCount,
          actual: actualCount,
        });
      }
    }
  }

  // スコア計算（25点満点）
  const totalIssues = missingFields.length + arrayFieldIssues.length;
  const maxScore = 25;
  const deductionPerIssue = 5; // 1問題につき5点減点

  const score = Math.max(0, maxScore - totalIssues * deductionPerIssue);
  const passed = missingFields.length === 0 && arrayFieldIssues.length === 0;

  return {
    passed,
    score,
    missingFields,
    arrayFieldIssues,
  };
};
