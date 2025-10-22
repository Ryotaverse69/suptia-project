// 薬機法NGワードと置換ルール

export const NGWords = {
  critical: [
    '治る', '治す', '治療', '治癒', '完治', '根治',
    '予防する', '防ぐ', '防止',
    'がんに効く', '糖尿病を治す', '高血圧を下げる'
  ],
  warning: [
    '効く', '効果がある', '改善する',
    '回復する', '若返る', '再生する',
    '解消', '解決', '克服'
  ]
};

export const ComplianceReplacements = {
  '治療': 'サポート',
  '治る': '健康維持をサポート',
  '治す': '健康な状態の維持に貢献',
  '完治': '健康状態の改善をサポート',
  '根治': '根本的な健康サポート',
  '治癒': '健康回復をサポート',
  '予防する': '健康な状態の維持に役立つ可能性',
  '防ぐ': 'リスク低減をサポート',
  '防止': 'リスク管理をサポート',
  '改善する': 'サポートする可能性',
  '改善': 'サポート',
  '効く': '役立つ可能性',
  '効果がある': 'サポートする可能性',
  '回復': '健康維持',
  '若返る': '健康的な状態を維持',
  '再生': '健康的な状態の維持',
  '解消': '緩和をサポート',
  '解決': 'サポート',
  '克服': '管理をサポート',
  'がんに効く': 'がん予防の研究が進行中',
  '糖尿病を治す': '血糖値管理をサポート',
  '高血圧を下げる': '血圧の健康維持をサポート'
};

export function checkCompliance(text: string): {
  isCompliant: boolean;
  violations: string[];
} {
  const violations: string[] = [];

  for (const word of NGWords.critical) {
    if (text.includes(word)) {
      violations.push(`Critical: "${word}"`);
    }
  }

  for (const word of NGWords.warning) {
    if (text.includes(word)) {
      violations.push(`Warning: "${word}"`);
    }
  }

  return {
    isCompliant: violations.length === 0,
    violations
  };
}