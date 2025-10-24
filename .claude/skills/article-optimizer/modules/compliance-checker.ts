import { ComplianceChecker as BaseChecker, ComplianceLevel } from '../../common/compliance-rules';
import type { Article, Change, Warning } from '../types';

export class ComplianceChecker {
  private baseChecker: BaseChecker;

  constructor() {
    this.baseChecker = new BaseChecker();
  }

  async check(article: Article, level: string): Promise<any> {
    const complianceLevel = this.mapLevel(level);
    const errors: string[] = [];
    const warnings: Warning[] = [];

    // 各フィールドをチェック
    const fieldsToCheck = [
      { field: 'description', content: article.description },
      { field: 'recommendedDosage', content: article.recommendedDosage },
      { field: 'sideEffects', content: article.sideEffects }
    ];

    for (const { field, content } of fieldsToCheck) {
      if (content) {
        const result = this.baseChecker.check(content, complianceLevel);
        if (!result.isCompliant) {
          result.violations.forEach(v => {
            if (v.level === ComplianceLevel.CRITICAL || v.level === ComplianceLevel.HIGH) {
              errors.push(`${field}: ${v.word} - ${v.reason}`);
            } else {
              warnings.push({
                type: 'compliance',
                field,
                message: `${v.word} - ${v.reason}`,
                severity: v.level === ComplianceLevel.MEDIUM ? 'medium' : 'low',
                suggestion: v.replacement
              });
            }
          });
        }
      }
    }

    // benefitsとinteractionsの配列もチェック
    if (article.benefits) {
      article.benefits.forEach((benefit, index) => {
        if (benefit.description) {
          const result = this.baseChecker.check(benefit.description, complianceLevel);
          if (!result.isCompliant) {
            result.violations.forEach(v => {
              warnings.push({
                type: 'compliance',
                field: `benefits[${index}]`,
                message: `${v.word} - ${v.reason}`,
                severity: 'medium',
                suggestion: v.replacement
              });
            });
          }
        }
      });
    }

    return { errors, warnings };
  }

  async fixCompliance(article: Article, level: string): Promise<any> {
    const complianceLevel = this.mapLevel(level);
    const changes: Change[] = [];
    const warnings: Warning[] = [];
    const fixedArticle = { ...article };

    // 各フィールドを修正
    if (fixedArticle.description) {
      const result = this.baseChecker.autoFix(fixedArticle.description, complianceLevel);
      if (result.changeCount > 0) {
        changes.push({
          type: 'compliance',
          field: 'description',
          before: fixedArticle.description,
          after: result.fixed,
          description: `${result.changeCount}件の薬機法違反を修正`
        });
        fixedArticle.description = result.fixed;
      }
    }

    if (fixedArticle.recommendedDosage) {
      const result = this.baseChecker.autoFix(fixedArticle.recommendedDosage, complianceLevel);
      if (result.changeCount > 0) {
        changes.push({
          type: 'compliance',
          field: 'recommendedDosage',
          before: fixedArticle.recommendedDosage,
          after: result.fixed,
          description: `${result.changeCount}件の薬機法違反を修正`
        });
        fixedArticle.recommendedDosage = result.fixed;
      }
    }

    // benefitsの修正
    if (fixedArticle.benefits) {
      fixedArticle.benefits = fixedArticle.benefits.map((benefit, index) => {
        if (benefit.description) {
          const result = this.baseChecker.autoFix(benefit.description, complianceLevel);
          if (result.changeCount > 0) {
            changes.push({
              type: 'compliance',
              field: `benefits[${index}]`,
              before: benefit.description,
              after: result.fixed,
              description: `効果説明の薬機法違反を修正`
            });
            return { ...benefit, description: result.fixed };
          }
        }
        return benefit;
      });
    }

    return {
      article: fixedArticle,
      changes,
      warnings
    };
  }

  private mapLevel(level: string): ComplianceLevel {
    switch (level) {
      case 'strict':
        return ComplianceLevel.LOW;
      case 'standard':
        return ComplianceLevel.MEDIUM;
      case 'lenient':
        return ComplianceLevel.HIGH;
      default:
        return ComplianceLevel.MEDIUM;
    }
  }
}