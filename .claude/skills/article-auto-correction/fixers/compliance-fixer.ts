/**
 * 薬機法NGワード自動置換ツール
 * 記事内のNGワードを適切な表現に自動変換
 */

export interface ReplacementRule {
  pattern: RegExp;
  replacement: string;
  severity: 'critical' | 'warning';
  category: string;
}

/**
 * 薬機法NGワード置換ルール
 */
export const REPLACEMENT_RULES: ReplacementRule[] = [
  // Critical: 治療・治癒表現
  {
    pattern: /([^\s]+(?:を|が))治す/g,
    replacement: '$1サポートする',
    severity: 'critical',
    category: '治療表現',
  },
  {
    pattern: /治る/g,
    replacement: '健康維持に役立つ可能性があります',
    severity: 'critical',
    category: '治療表現',
  },
  {
    pattern: /([^\s]+(?:を|が))治療(する|します)/g,
    replacement: '$1のケアをサポート$2',
    severity: 'critical',
    category: '治療表現',
  },
  {
    pattern: /治療(中|を受けて|を行って)/g,
    replacement: '医療ケア$1',
    severity: 'critical',
    category: '治療表現',
  },
  {
    pattern: /治療(効果|に役立つ|に有効)/g,
    replacement: '健康維持$1',
    severity: 'critical',
    category: '治療表現',
  },
  {
    pattern: /([a-zァ-ヶーぁ-ん一-龥]+)治療薬/gi,
    replacement: '$1医薬品',
    severity: 'critical',
    category: '治療表現',
  },
  {
    pattern: /不妊治療/g,
    replacement: '不妊ケア',
    severity: 'critical',
    category: '治療表現',
  },
  {
    pattern: /([ァ-ヶーぁ-ん一-龥]{2,})治療/g,
    replacement: '$1の医療ケア',
    severity: 'critical',
    category: '治療表現',
  },
  {
    pattern: /治療(に|で|の|から)/g,
    replacement: '医療ケア$1',
    severity: 'critical',
    category: '治療表現',
  },
  {
    pattern: /治療:/g,
    replacement: '医療ケア：',
    severity: 'critical',
    category: '治療表現',
  },
  {
    pattern: /治療用量/g,
    replacement: '推奨用量',
    severity: 'critical',
    category: '治療表現',
  },
  {
    pattern: /治療的/g,
    replacement: '健康維持のための',
    severity: 'critical',
    category: '治療表現',
  },
  {
    pattern: /治療目標/g,
    replacement: '健康維持目標',
    severity: 'critical',
    category: '治療表現',
  },
  {
    pattern: /治療意図/g,
    replacement: '医療目的',
    severity: 'critical',
    category: '治療表現',
  },
  {
    pattern: /治療期間/g,
    replacement: '摂取期間',
    severity: 'critical',
    category: '治療表現',
  },
  {
    pattern: /治療特性/g,
    replacement: '健康サポート特性',
    severity: 'critical',
    category: '治療表現',
  },
  {
    pattern: /治療範囲/g,
    replacement: '推奨範囲',
    severity: 'critical',
    category: '治療表現',
  },
  {
    pattern: /予防・治療/g,
    replacement: '予防・ケア',
    severity: 'critical',
    category: '治療表現',
  },
  {
    pattern: /治療目的/g,
    replacement: '健康サポート目的',
    severity: 'critical',
    category: '治療表現',
  },
  {
    pattern: /治療域/g,
    replacement: '目標範囲',
    severity: 'critical',
    category: '治療表現',
  },
  {
    pattern: /治療抵抗性/g,
    replacement: '改善が難しい',
    severity: 'critical',
    category: '治療表現',
  },
  {
    pattern: /治癒/g,
    replacement: '健康的な状態の維持',
    severity: 'critical',
    category: '治療表現',
  },

  // Critical: 予防表現
  {
    pattern: /予防する/g,
    replacement: '健康維持に役立つ可能性があります',
    severity: 'critical',
    category: '予防表現',
  },
  {
    pattern: /予防(効果|に|の|を)/g,
    replacement: '健康維持$1',
    severity: 'critical',
    category: '予防表現',
  },
  {
    pattern: /([^\s]+(?:を|が))防ぐ/g,
    replacement: '$1のリスク低減をサポートする可能性',
    severity: 'critical',
    category: '予防表現',
  },
  {
    pattern: /防止(する|します|に|の|を)/g,
    replacement: 'サポート$1',
    severity: 'critical',
    category: '予防表現',
  },
  {
    pattern: /防止/g,
    replacement: 'リスク低減',
    severity: 'critical',
    category: '予防表現',
  },
  {
    pattern: /([^をが]+)を防ぐ$/gm,
    replacement: '$1のリスク低減をサポート',
    severity: 'critical',
    category: '予防表現',
  },

  // Critical: 疾病治療
  {
    pattern: /がんに効く/g,
    replacement: '研究で健康維持に役立つ可能性が報告されています',
    severity: 'critical',
    category: '疾病治療',
  },
  {
    pattern: /癌に効く/g,
    replacement: '研究で健康維持に役立つ可能性が報告されています',
    severity: 'critical',
    category: '疾病治療',
  },
  {
    pattern: /糖尿病を治す/g,
    replacement: '健康的な血糖値の維持をサポートする可能性',
    severity: 'critical',
    category: '疾病治療',
  },
  {
    pattern: /高血圧を下げる/g,
    replacement: '健康的な血圧の維持をサポートする可能性',
    severity: 'critical',
    category: '疾病治療',
  },
  {
    pattern: /病気が治る/g,
    replacement: '健康維持に役立つ可能性があります',
    severity: 'critical',
    category: '疾病治療',
  },
  {
    pattern: /症状が消える/g,
    replacement: '症状の緩和をサポートする可能性',
    severity: 'critical',
    category: '疾病治療',
  },

  // Warning: 効果の断定
  {
    pattern: /効く/g,
    replacement: '役立つ可能性があります',
    severity: 'warning',
    category: '効果断定',
  },
  {
    pattern: /効果がある/g,
    replacement: '研究で報告されています',
    severity: 'warning',
    category: '効果断定',
  },
  {
    pattern: /改善する/g,
    replacement: 'サポートすると言われています',
    severity: 'warning',
    category: '効果断定',
  },

  // Warning: 身体機能の増強
  {
    pattern: /若返る/g,
    replacement: '健康的な状態の維持をサポート',
    severity: 'warning',
    category: '身体増強',
  },
  {
    pattern: /回復する/g,
    replacement: '維持をサポートする',
    severity: 'warning',
    category: '身体増強',
  },
  {
    pattern: /再生する/g,
    replacement: '健康維持をサポートする',
    severity: 'warning',
    category: '身体増強',
  },
];

/**
 * テキスト内のNGワードを置換
 */
export const fixComplianceIssues = (text: string): { fixed: string; changes: number } => {
  let fixed = text;
  let changes = 0;

  for (const rule of REPLACEMENT_RULES) {
    const matches = fixed.match(rule.pattern);
    if (matches) {
      changes += matches.length;
      fixed = fixed.replace(rule.pattern, rule.replacement);
    }
  }

  return { fixed, changes };
};

/**
 * オブジェクトを再帰的に走査してNGワードを修正
 */
export const fixArticleCompliance = (data: any): { fixed: any; totalChanges: number } => {
  const excludeFields = ['nameEn', 'slug', 'references'];
  let totalChanges = 0;

  const traverse = (obj: any): any => {
    if (typeof obj === 'string') {
      const { fixed, changes } = fixComplianceIssues(obj);
      totalChanges += changes;
      return fixed;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => traverse(item));
    }

    if (typeof obj === 'object' && obj !== null) {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (excludeFields.includes(key)) {
          result[key] = value;
        } else {
          result[key] = traverse(value);
        }
      }
      return result;
    }

    return obj;
  };

  const fixed = traverse(data);

  return { fixed, totalChanges };
};
