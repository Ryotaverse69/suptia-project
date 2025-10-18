/**
 * エビデンスレベルチェック
 */

import { validateEvidenceLevel, EVIDENCE_LEVELS } from '../rules/evidence-levels';

export interface EvidenceCheckResult {
  passed: boolean;
  score: number;
  level: string;
  description: string;
  suggestion: string | null;
}

/**
 * エビデンスレベルチェックを実行
 */
export const checkEvidence = (data: any): EvidenceCheckResult => {
  // evidenceLevelフィールドの存在確認
  if (!('evidenceLevel' in data)) {
    return {
      passed: false,
      score: 0,
      level: '',
      description: '',
      suggestion: 'evidenceLevelフィールドが存在しません',
    };
  }

  const level = data.evidenceLevel;
  const result = validateEvidenceLevel(level);

  return {
    passed: result.valid,
    score: result.score,
    level,
    description: result.description,
    suggestion: result.suggestion,
  };
};
