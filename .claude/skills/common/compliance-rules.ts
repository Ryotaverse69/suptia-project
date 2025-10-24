/**
 * 薬機法コンプライアンスルール共通定義
 * 全Skillsで共有する薬機法NGワード・代替表現・チェックルール
 */

// NGワードレベル定義
export enum ComplianceLevel {
  CRITICAL = 'critical',  // 重大違反（即修正必須）
  HIGH = 'high',         // 高リスク（警告）
  MEDIUM = 'medium',     // 中リスク（注意）
  LOW = 'low'           // 低リスク（推奨修正）
}

// NGワード辞書
export const NG_WORDS_DICTIONARY = {
  // 医療効能系（重大違反）
  [ComplianceLevel.CRITICAL]: [
    // 治療・治癒系
    { word: /治る/g, replacement: '改善をサポート', reason: '疾病の治療効能を標榜' },
    { word: /治す/g, replacement: '健康維持をサポート', reason: '疾病の治療効能を標榜' },
    { word: /治療/g, replacement: 'ケア', reason: '医療行為を想起' },
    { word: /治癒/g, replacement: '回復をサポート', reason: '医療効果を断定' },
    { word: /完治/g, replacement: '改善の可能性', reason: '医療効果を断定' },

    // 予防系
    { word: /予防する/g, replacement: '健康維持に役立つ', reason: '疾病予防を標榜' },
    { word: /防ぐ/g, replacement: '対策をサポート', reason: '疾病予防を標榜' },
    { word: /防止/g, replacement: 'リスク低減をサポート', reason: '疾病予防を標榜' },

    // 疾病名を含む表現
    { word: /がんに効く/g, replacement: '健康をサポート', reason: '重篤疾病への効能を標榜' },
    { word: /糖尿病を改善/g, replacement: '血糖値の健康維持をサポート', reason: '特定疾病への効能を標榜' },
    { word: /高血圧を下げる/g, replacement: '血圧の健康維持をサポート', reason: '特定疾病への効能を標榜' },
    { word: /認知症を予防/g, replacement: '認知機能の維持をサポート', reason: '特定疾病の予防を標榜' },

    // 医薬品的表現
    { word: /医薬品/g, replacement: 'サプリメント', reason: '医薬品と誤認' },
    { word: /薬効/g, replacement: '栄養機能', reason: '医薬品的効能を想起' },
    { word: /薬理作用/g, replacement: '栄養成分の働き', reason: '医薬品的作用を想起' },
    { word: /診断/g, replacement: '確認', reason: '医療行為を想起' },
    { word: /処方/g, replacement: '摂取目安', reason: '医療行為を想起' }
  ],

  // 効果断定系（高リスク）
  [ComplianceLevel.HIGH]: [
    { word: /効く/g, replacement: '役立つ可能性がある', reason: '効果を断定' },
    { word: /効果がある/g, replacement: '〜をサポート', reason: '効果を断定' },
    { word: /改善する/g, replacement: '〜の維持をサポート', reason: '改善を断定' },
    { word: /解消/g, replacement: '緩和をサポート', reason: '症状解消を断定' },
    { word: /根本から/g, replacement: '総合的に', reason: '根本治療を想起' },
    { word: /即効性/g, replacement: '早めの実感', reason: '医薬品的な即効性を想起' },
    { word: /確実に/g, replacement: '期待できる', reason: '効果を保証' },
    { word: /必ず/g, replacement: '〜が期待できる', reason: '効果を保証' }
  ],

  // 身体変化系（中リスク）
  [ComplianceLevel.MEDIUM]: [
    { word: /若返る/g, replacement: 'エイジングケアをサポート', reason: '身体変化を断定' },
    { word: /回復する/g, replacement: '回復をサポート', reason: '回復を断定' },
    { word: /再生する/g, replacement: '健康維持をサポート', reason: '組織再生を想起' },
    { word: /増強/g, replacement: 'サポート', reason: '身体機能の増強を断定' },
    { word: /活性化/g, replacement: '健康維持', reason: '生理機能の活性化を断定' },
    { word: /デトックス/g, replacement: '体内環境の維持', reason: '解毒作用を想起' },
    { word: /浄化/g, replacement: 'クリアな状態を維持', reason: '医療的浄化を想起' }
  ],

  // 誇大表現系（低リスク）
  [ComplianceLevel.LOW]: [
    { word: /最高の/g, replacement: '良質な', reason: '最上級表現は避ける' },
    { word: /最強/g, replacement: '優れた', reason: '最上級表現は避ける' },
    { word: /No\.1/g, replacement: '人気の', reason: '順位付けは根拠が必要' },
    { word: /唯一/g, replacement: '特徴的な', reason: '唯一性の証明が困難' },
    { word: /奇跡の/g, replacement: '注目の', reason: '奇跡的効果を想起' },
    { word: /驚異の/g, replacement: '優れた', reason: '誇大表現' },
    { word: /革命的/g, replacement: '新しいアプローチの', reason: '誇大表現' }
  ]
};

// OK表現の例
export const SAFE_EXPRESSIONS = {
  effect: [
    '〜をサポート',
    '〜に役立つ可能性',
    '〜の維持に',
    '〜に寄与',
    '健康維持のために',
    '栄養補給として'
  ],
  disclaimer: [
    '個人差があります',
    '効果を保証するものではありません',
    '医師にご相談ください',
    'バランスの良い食事と適度な運動が大切です'
  ],
  research: [
    '研究によると',
    '報告されています',
    '示唆されています',
    '可能性が示されています',
    '期待されています'
  ]
};

// チェック関数
export class ComplianceChecker {
  private ngWords: Map<ComplianceLevel, Array<{ word: RegExp; replacement: string; reason: string }>>;

  constructor() {
    this.ngWords = new Map(Object.entries(NG_WORDS_DICTIONARY) as any);
  }

  /**
   * テキストの薬機法準拠チェック
   */
  check(text: string, level: ComplianceLevel = ComplianceLevel.HIGH): ComplianceCheckResult {
    const violations: Violation[] = [];

    // 各レベルのNGワードをチェック
    for (const [checkLevel, words] of this.ngWords.entries()) {
      // 指定レベル以上のみチェック
      if (this.getLevelPriority(checkLevel) >= this.getLevelPriority(level)) {
        for (const { word, replacement, reason } of words) {
          const matches = text.match(word);
          if (matches) {
            violations.push({
              level: checkLevel,
              word: matches[0],
              count: matches.length,
              replacement,
              reason,
              positions: this.findPositions(text, word)
            });
          }
        }
      }
    }

    return {
      isCompliant: violations.length === 0,
      violations,
      score: this.calculateComplianceScore(violations),
      suggestions: this.generateSuggestions(violations)
    };
  }

  /**
   * テキストを自動修正
   */
  autoFix(text: string, level: ComplianceLevel = ComplianceLevel.HIGH): AutoFixResult {
    let fixedText = text;
    const changes: FixChange[] = [];

    for (const [checkLevel, words] of this.ngWords.entries()) {
      if (this.getLevelPriority(checkLevel) >= this.getLevelPriority(level)) {
        for (const { word, replacement, reason } of words) {
          const before = fixedText;
          fixedText = fixedText.replace(word, replacement);

          if (before !== fixedText) {
            changes.push({
              level: checkLevel,
              original: before.match(word)?.[0] || '',
              replacement,
              reason
            });
          }
        }
      }
    }

    return {
      original: text,
      fixed: fixedText,
      changes,
      changeCount: changes.length
    };
  }

  /**
   * 医療従事者向け表現チェック
   */
  checkMedicalProfessionalContent(text: string): boolean {
    const medicalTerms = [
      /薬剤師/,
      /医師/,
      /医療従事者/,
      /処方箋/,
      /診療/,
      /臨床/
    ];

    return medicalTerms.some(term => term.test(text));
  }

  /**
   * エビデンスレベルの適切性チェック
   */
  checkEvidenceExpression(text: string, evidenceLevel: string): boolean {
    const strongClaims = [
      /確実に/,
      /必ず/,
      /100%/,
      /完全に/
    ];

    // エビデンスレベルが低い場合、強い主張は不適切
    if (evidenceLevel === 'C' || evidenceLevel === 'D') {
      return !strongClaims.some(claim => claim.test(text));
    }

    return true;
  }

  private getLevelPriority(level: ComplianceLevel): number {
    const priorities = {
      [ComplianceLevel.CRITICAL]: 4,
      [ComplianceLevel.HIGH]: 3,
      [ComplianceLevel.MEDIUM]: 2,
      [ComplianceLevel.LOW]: 1
    };
    return priorities[level] || 0;
  }

  private findPositions(text: string, pattern: RegExp): number[] {
    const positions: number[] = [];
    let match;
    const regex = new RegExp(pattern.source, 'g');

    while ((match = regex.exec(text)) !== null) {
      positions.push(match.index);
    }

    return positions;
  }

  private calculateComplianceScore(violations: Violation[]): number {
    let score = 100;

    for (const violation of violations) {
      switch (violation.level) {
        case ComplianceLevel.CRITICAL:
          score -= 15 * violation.count;
          break;
        case ComplianceLevel.HIGH:
          score -= 10 * violation.count;
          break;
        case ComplianceLevel.MEDIUM:
          score -= 5 * violation.count;
          break;
        case ComplianceLevel.LOW:
          score -= 2 * violation.count;
          break;
      }
    }

    return Math.max(0, score);
  }

  private generateSuggestions(violations: Violation[]): string[] {
    const suggestions: string[] = [];

    if (violations.some(v => v.level === ComplianceLevel.CRITICAL)) {
      suggestions.push('❗ 重大な薬機法違反が検出されました。即座に修正が必要です。');
    }

    if (violations.some(v => v.level === ComplianceLevel.HIGH)) {
      suggestions.push('⚠️ 高リスクの表現が含まれています。代替表現への変更を推奨します。');
    }

    if (violations.length > 0) {
      suggestions.push('💡 薬機法準拠のため、「効果」より「サポート」、「改善」より「維持」といった表現を使用しましょう。');
      suggestions.push('📝 エビデンスを引用する際は「研究によると」「報告されています」などの表現を使用してください。');
    }

    return suggestions;
  }
}

// 型定義
export interface ComplianceCheckResult {
  isCompliant: boolean;
  violations: Violation[];
  score: number;
  suggestions: string[];
}

export interface Violation {
  level: ComplianceLevel;
  word: string;
  count: number;
  replacement: string;
  reason: string;
  positions: number[];
}

export interface AutoFixResult {
  original: string;
  fixed: string;
  changes: FixChange[];
  changeCount: number;
}

export interface FixChange {
  level: ComplianceLevel;
  original: string;
  replacement: string;
  reason: string;
}

// デフォルトエクスポート
export default new ComplianceChecker();