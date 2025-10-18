/**
 * スコアリングシステム: 総合スコアとグレード判定
 */

export interface ScoreWeights {
  structure: number;
  compliance: number;
  wordCount: number;
  references: number;
  evidence: number;
  language: number;
}

export interface Grade {
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  description: string;
}

export const SCORE_WEIGHTS: ScoreWeights = {
  structure: 25,
  compliance: 30,
  wordCount: 20,
  references: 15,
  evidence: 5,
  language: 5,
};

export const GRADE_THRESHOLDS = {
  S: 90,
  A: 80,
  B: 70,
  C: 60,
  D: 0,
};

/**
 * 総合スコアを計算
 */
export const calculateTotalScore = (scores: {
  structure: number;
  compliance: number;
  wordCount: number;
  references: number;
  evidence: number;
  language: number;
}): number => {
  const total =
    scores.structure +
    scores.compliance +
    scores.wordCount +
    scores.references +
    scores.evidence +
    scores.language;

  return Math.min(100, Math.max(0, Math.round(total)));
};

/**
 * スコアからグレードを判定
 */
export const calculateGrade = (score: number): Grade => {
  if (score >= GRADE_THRESHOLDS.S) {
    return {
      grade: 'S',
      description: '優秀 - インポート推奨',
    };
  }
  if (score >= GRADE_THRESHOLDS.A) {
    return {
      grade: 'A',
      description: '良好 - 軽微な修正推奨',
    };
  }
  if (score >= GRADE_THRESHOLDS.B) {
    return {
      grade: 'B',
      description: '合格 - 修正後にインポート',
    };
  }
  if (score >= GRADE_THRESHOLDS.C) {
    return {
      grade: 'C',
      description: '要修正 - 複数の問題あり',
    };
  }
  return {
    grade: 'D',
    description: '不合格 - 大幅な修正が必要',
  };
};

/**
 * 推奨事項を生成
 */
export const generateRecommendations = (
  structureIssues: number,
  complianceIssues: number,
  wordCountIssues: number,
  referencesIssues: number,
  evidenceIssues: boolean,
  languageIssues: number
): string[] => {
  const recommendations: string[] = [];

  if (structureIssues > 0) {
    recommendations.push(`構造チェックで${structureIssues}件の問題が見つかりました。必須フィールドを確認してください。`);
  }

  if (complianceIssues > 0) {
    recommendations.push(
      `薬機法違反の可能性がある表現が${complianceIssues}件見つかりました。表現を修正してください。`
    );
  }

  if (wordCountIssues > 0) {
    recommendations.push(`文字数要件を満たしていないフィールドが${wordCountIssues}件あります。`);
  }

  if (referencesIssues > 0) {
    recommendations.push(`参考文献に問題があります。信頼できるソースからの引用を追加してください。`);
  }

  if (evidenceIssues) {
    recommendations.push('エビデンスレベルを S, A, B, C, D の範囲で設定してください。');
  }

  if (languageIssues > 0) {
    recommendations.push(`${languageIssues}箇所で英語の文章が混入しています。日本語で記述してください。`);
  }

  if (recommendations.length === 0) {
    recommendations.push('すべてのチェックをパスしました！Sanityにインポートできます。');
  }

  return recommendations;
};
