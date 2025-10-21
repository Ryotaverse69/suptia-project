/**
 * 薬機法・景品表示法NGワード・表現リスト
 * compliance-checker専用（拡張版）
 */

export interface ComplianceRule {
  word: string;
  severity: 'critical' | 'warning';
  score: number;
  category: string;
  law: '薬機法' | '景品表示法' | '両方';
  context?: string; // どのような文脈で違反になるか
}

export const COMPLIANCE_RULES: {
  critical: ComplianceRule[];
  warning: ComplianceRule[];
  ok: string[];
} = {
  critical: [
    // 【薬機法】治療・治癒表現（最も重要）
    {
      word: '治る',
      severity: 'critical',
      score: -15,
      category: '治療表現',
      law: '薬機法',
      context: '疾病の治療効果を標榜'
    },
    {
      word: '治す',
      severity: 'critical',
      score: -15,
      category: '治療表現',
      law: '薬機法',
      context: '治療行為を示唆'
    },
    {
      word: '治療',
      severity: 'critical',
      score: -15,
      category: '治療表現',
      law: '薬機法',
      context: '医療行為を示唆'
    },
    {
      word: '治癒',
      severity: 'critical',
      score: -15,
      category: '治療表現',
      law: '薬機法',
      context: '治癒効果を標榜'
    },

    // 【薬機法】予防表現
    {
      word: '予防する',
      severity: 'critical',
      score: -12,
      category: '予防表現',
      law: '薬機法',
      context: '疾病予防効果を標榜'
    },
    {
      word: '防ぐ',
      severity: 'critical',
      score: -12,
      category: '予防表現',
      law: '薬機法',
      context: '疾病予防を示唆'
    },
    {
      word: '防止する',
      severity: 'critical',
      score: -12,
      category: '予防表現',
      law: '薬機法',
      context: '疾病予防を示唆'
    },

    // 【薬機法】疾病名との直接関連
    {
      word: 'がんに効く',
      severity: 'critical',
      score: -20,
      category: '疾病治療',
      law: '薬機法',
      context: '重大疾病への効果を断定'
    },
    {
      word: '癌に効く',
      severity: 'critical',
      score: -20,
      category: '疾病治療',
      law: '薬機法',
      context: '重大疾病への効果を断定'
    },
    {
      word: '糖尿病を治す',
      severity: 'critical',
      score: -20,
      category: '疾病治療',
      law: '薬機法',
      context: '疾病治療効果を断定'
    },
    {
      word: '高血圧を下げる',
      severity: 'critical',
      score: -15,
      category: '疾病治療',
      law: '薬機法',
      context: '医薬品的効能を標榜'
    },
    {
      word: '病気が治る',
      severity: 'critical',
      score: -20,
      category: '疾病治療',
      law: '薬機法',
      context: '疾病治療効果を断定'
    },
    {
      word: '症状が消える',
      severity: 'critical',
      score: -15,
      category: '疾病治療',
      law: '薬機法',
      context: '症状改善効果を断定'
    },
    {
      word: '完治',
      severity: 'critical',
      score: -20,
      category: '治療表現',
      law: '薬機法',
      context: '治癒を断定'
    },

    // 【景品表示法】最上級表現（根拠なし）
    {
      word: '最高級',
      severity: 'critical',
      score: -10,
      category: '最上級表現',
      law: '景品表示法',
      context: '根拠のない最上級表現'
    },
    {
      word: '業界No.1',
      severity: 'critical',
      score: -12,
      category: '最上級表現',
      law: '景品表示法',
      context: '根拠なき順位表示'
    },
    {
      word: '日本一',
      severity: 'critical',
      score: -12,
      category: '最上級表現',
      law: '景品表示法',
      context: '根拠なき順位表示'
    },
    {
      word: '世界一',
      severity: 'critical',
      score: -12,
      category: '最上級表現',
      law: '景品表示法',
      context: '根拠なき順位表示'
    },
    {
      word: '絶対に',
      severity: 'critical',
      score: -10,
      category: '断定表現',
      law: '景品表示法',
      context: '効果を絶対視'
    },
    {
      word: '100%効果',
      severity: 'critical',
      score: -15,
      category: '断定表現',
      law: '景品表示法',
      context: '効果を保証'
    },
    {
      word: '必ず効く',
      severity: 'critical',
      score: -15,
      category: '断定表現',
      law: '景品表示法',
      context: '効果を保証'
    },
  ],

  warning: [
    // 【薬機法】効果の断定
    {
      word: '効く',
      severity: 'warning',
      score: -5,
      category: '効果断定',
      law: '薬機法',
      context: '効果を断定'
    },
    {
      word: '効果がある',
      severity: 'warning',
      score: -5,
      category: '効果断定',
      law: '薬機法',
      context: '効果を断定'
    },
    {
      word: '改善する',
      severity: 'warning',
      score: -3,
      category: '効果断定',
      law: '薬機法',
      context: '改善効果を断定'
    },
    {
      word: '解消する',
      severity: 'warning',
      score: -3,
      category: '効果断定',
      law: '薬機法',
      context: '症状解消を示唆'
    },

    // 【薬機法】身体機能の増強
    {
      word: '若返る',
      severity: 'warning',
      score: -6,
      category: '身体増強',
      law: '薬機法',
      context: 'アンチエイジング効果を断定'
    },
    {
      word: '回復する',
      severity: 'warning',
      score: -3,
      category: '身体増強',
      law: '薬機法',
      context: '機能回復を示唆'
    },
    {
      word: '再生する',
      severity: 'warning',
      score: -6,
      category: '身体増強',
      law: '薬機法',
      context: '組織再生を示唆'
    },
    {
      word: '強化される',
      severity: 'warning',
      score: -4,
      category: '身体増強',
      law: '薬機法',
      context: '身体機能の増強を断定'
    },

    // 【景品表示法】誇大広告
    {
      word: '驚異的な',
      severity: 'warning',
      score: -5,
      category: '誇大表現',
      law: '景品表示法',
      context: '効果を誇張'
    },
    {
      word: '圧倒的な',
      severity: 'warning',
      score: -4,
      category: '誇大表現',
      law: '景品表示法',
      context: '他社比較の根拠不明'
    },
    {
      word: '奇跡の',
      severity: 'warning',
      score: -6,
      category: '誇大表現',
      law: '景品表示法',
      context: '非科学的な誇張'
    },
    {
      word: '即効性',
      severity: 'warning',
      score: -5,
      category: '誇大表現',
      law: '薬機法',
      context: '速効性を断定'
    },
    {
      word: '確実に',
      severity: 'warning',
      score: -4,
      category: '断定表現',
      law: '景品表示法',
      context: '効果を確約'
    },
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
    '〜が報告されています',
    '〜に関する研究があります',
    '〜の一助となる可能性',
    '健康的な',
    '〜をサポートすることが期待',
  ]
};

/**
 * NGワードの���正提案を生成
 */
export const generateSuggestion = (sentence: string, ngWord: string): string => {
  const suggestions: Record<string, string> = {
    // 治療表現
    '治る': '健康維持をサポートすると言われています',
    '治す': 'サポートに役立つ可能性があります',
    '治療': '健康維持',
    '治癒': '健康サポート',
    '完治': '健康維持のサポート',

    // 予防表現
    '予防する': '健康維持に役立つ可能性があります',
    '防ぐ': 'サポートに寄与する可能性があります',
    '防止する': '維持をサポート',

    // 疾病治療
    'がんに効く': 'がん研究で検討されている成分を含む',
    '癌に効く': '癌研究で検討されている成分を含む',
    '糖尿病を治す': '血糖値の健康維持をサポート',
    '高血圧を下げる': '血圧の健康維持に役立つ可能性',
    '病気が治る': '健康維持をサポート',
    '症状が消える': '健康的な状態の維持に寄与する可能性',

    // 効果断定
    '効く': '役立つ可能性があります',
    '効果がある': '研究で報告されています',
    '改善する': 'サポートすると言われています',
    '解消する': '維持に役立つ可能性',

    // 身体増強
    '若返る': '健康的な状態の維持をサポート',
    '回復する': '維持をサポート',
    '再生する': '健康維持に寄与する可能性',
    '強化される': 'サポートに役立つ可能性',

    // 景品表示法
    '最高級': '高品質な',
    '業界No.1': '多くの方に選ばれている',
    '日本一': '国内で人気の',
    '世界一': '世界中で愛用されている',
    '絶対に': '多くの場合',
    '100%効果': '個人差がありますが、研究では',
    '必ず効く': '役立つ可能性があります',
    '驚異的な': '注目されている',
    '圧倒的な': '多くの',
    '奇跡の': '注目の',
    '即効性': '継続的な使用により',
    '確実に': '多くの場合',
  };

  return suggestions[ngWord] || '表現を修正してください（研究で報告されています、など）';
};

/**
 * 文脈に応じた詳細な説明を生成
 */
export const generateDetailedExplanation = (rule: ComplianceRule): string => {
  const lawName = rule.law === '薬機法' ? '医薬品医療機器等法（薬機法）' :
                  rule.law === '景品表示法' ? '不当景品類及び不当表示防止法（景品表示法）' :
                  '薬機法・景品表示法';

  return `【${lawName}違反の可能性】

表現: "${rule.word}"
カテゴリ: ${rule.category}
重要度: ${rule.severity === 'critical' ? '重大' : '警告'}
スコア影響: ${rule.score}点

問題点: ${rule.context}

${lawName}では、健康食品（サプリメント）が医薬品的な効能効果を標榜することを禁止しています。
「${rule.word}」という表現は、${rule.context}とみなされる可能性が高く、修正が必要です。

推奨される代替表現:
${generateSuggestion('', rule.word)}`;
};
