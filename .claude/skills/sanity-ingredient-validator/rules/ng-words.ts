/**
 * 薬機法NGワード・表現リスト
 */

export interface ComplianceRule {
  word: string;
  severity: 'critical' | 'warning';
  score: number;
  category: string;
}

export const COMPLIANCE_RULES: {
  critical: ComplianceRule[];
  warning: ComplianceRule[];
  ok: string[];
} = {
  critical: [
    // 治療・治癒表現（最も重要）
    { word: '治る', severity: 'critical', score: -10, category: '治療表現' },
    { word: '治す', severity: 'critical', score: -10, category: '治療表現' },
    { word: '治療', severity: 'critical', score: -10, category: '治療表現' },
    { word: '治癒', severity: 'critical', score: -10, category: '治療表現' },

    // 予防表現
    { word: '予防する', severity: 'critical', score: -8, category: '予防表現' },
    { word: '防ぐ', severity: 'critical', score: -8, category: '予防表現' },
    { word: '防止', severity: 'critical', score: -8, category: '予防表現' },

    // 疾病名との直接関連
    { word: 'がんに効く', severity: 'critical', score: -15, category: '疾病治療' },
    { word: '癌に効く', severity: 'critical', score: -15, category: '疾病治療' },
    { word: '糖尿病を治す', severity: 'critical', score: -15, category: '疾病治療' },
    { word: '高血圧を下げる', severity: 'critical', score: -10, category: '疾病治療' },
    { word: '病気が治る', severity: 'critical', score: -15, category: '疾病治療' },
    { word: '症状が消える', severity: 'critical', score: -12, category: '疾病治療' },
  ],

  warning: [
    // 効果の断定
    { word: '効く', severity: 'warning', score: -5, category: '効果断定' },
    { word: '効果がある', severity: 'warning', score: -5, category: '効果断定' },
    { word: '改善する', severity: 'warning', score: -3, category: '効果断定' },

    // 身体機能の増強
    { word: '若返る', severity: 'warning', score: -5, category: '身体増強' },
    { word: '回復する', severity: 'warning', score: -3, category: '身体増強' },
    { word: '再生する', severity: 'warning', score: -5, category: '身体増強' },
  ],

  ok: [
    '〜をサポート',
    '〜に役立つ可能性',
    '一般的に',
    '研究では',
    '〜と言われています',
    '健康維持に',
    '栄養補給として',
    '〜の維持をサポート',
    '〜に寄与する可能性',
  ]
};

/**
 * NGワードの候補文を生成
 */
export const generateSuggestion = (sentence: string, ngWord: string): string => {
  const suggestions: Record<string, string> = {
    '治る': '健康維持をサポートすると言われています',
    '治す': 'サポートに役立つ可能性があります',
    '治療': '健康維持',
    '治癒': '健康サポート',
    '予防する': '健康維持に役立つ可能性があります',
    '防ぐ': 'サポートに寄与する可能性があります',
    '効く': '役立つ可能性があります',
    '効果がある': '研究で報告されています',
    '改善する': 'サポートすると言われています',
    '若返る': '健康的な状態の維持をサポート',
    '回復する': '維持をサポート',
  };

  return suggestions[ngWord] || '表現を修正してください';
};
