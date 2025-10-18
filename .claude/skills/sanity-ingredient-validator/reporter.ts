/**
 * レポート生成: 検証結果を整形して出力
 */

import type { StructureCheckResult } from './checkers/structure';
import type { ComplianceCheckResult } from './checkers/compliance';
import type { WordCountCheckResult } from './checkers/wordCount';
import type { ReferencesCheckResult } from './checkers/references';
import type { EvidenceCheckResult } from './checkers/evidence';
import type { LanguageCheckResult } from './checkers/language';
import { calculateTotalScore, calculateGrade, generateRecommendations } from './scoring';

export interface ValidationReport {
  status: 'success' | 'warning' | 'error';
  totalScore: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  gradeDescription: string;
  file: string;
  timestamp: string;
  checks: {
    structure: StructureCheckResult;
    compliance: ComplianceCheckResult;
    wordCount: WordCountCheckResult;
    references: ReferencesCheckResult;
    evidence: EvidenceCheckResult;
    language: LanguageCheckResult;
  };
  recommendations: string[];
}

/**
 * 検証レポートを生成
 */
export const generateReport = (
  file: string,
  checks: {
    structure: StructureCheckResult;
    compliance: ComplianceCheckResult;
    wordCount: WordCountCheckResult;
    references: ReferencesCheckResult;
    evidence: EvidenceCheckResult;
    language: LanguageCheckResult;
  }
): ValidationReport => {
  // 総合スコア計算
  const totalScore = calculateTotalScore({
    structure: checks.structure.score,
    compliance: checks.compliance.score,
    wordCount: checks.wordCount.score,
    references: checks.references.score,
    evidence: checks.evidence.score,
    language: checks.language.score,
  });

  // グレード判定
  const { grade, description } = calculateGrade(totalScore);

  // ステータス判定
  let status: 'success' | 'warning' | 'error';
  if (totalScore >= 80) {
    status = 'success';
  } else if (totalScore >= 60) {
    status = 'warning';
  } else {
    status = 'error';
  }

  // 推奨事項生成
  const recommendations = generateRecommendations(
    checks.structure.missingFields.length + checks.structure.arrayFieldIssues.length,
    checks.compliance.violations.length,
    checks.wordCount.issues.length,
    checks.references.count < 5 ? 1 : 0,
    !checks.evidence.passed,
    checks.language.issues.length
  );

  return {
    status,
    totalScore,
    grade,
    gradeDescription: description,
    file,
    timestamp: new Date().toISOString(),
    checks,
    recommendations,
  };
};

/**
 * レポートをコンソール出力用に整形
 */
export const formatReportForConsole = (report: ValidationReport): string => {
  const lines: string[] = [];

  // ヘッダー
  lines.push('┌─────────────────────────────────────────────────────────┐');
  lines.push('│         Sanity Ingredient Validator Report              │');
  lines.push('├─────────────────────────────────────────────────────────┤');
  lines.push(`│ File: ${report.file.padEnd(50)} │`);
  lines.push(`│ Score: ${report.totalScore}/100 (Grade: ${report.grade})`.padEnd(59) + '│');
  lines.push(`│ Status: ${report.gradeDescription}`.padEnd(59) + '│');
  lines.push('└─────────────────────────────────────────────────────────┘');
  lines.push('');

  // 詳細スコア
  lines.push('📊 Detailed Scores:');
  lines.push(`  Structure:   ${report.checks.structure.score}/25 ${report.checks.structure.passed ? '✅' : '❌'}`);
  lines.push(`  Compliance:  ${report.checks.compliance.score}/30 ${report.checks.compliance.passed ? '✅' : '❌'}`);
  lines.push(`  Word Count:  ${report.checks.wordCount.score}/20 ${report.checks.wordCount.passed ? '✅' : '❌'}`);
  lines.push(`  References:  ${report.checks.references.score}/15 ${report.checks.references.passed ? '✅' : '❌'}`);
  lines.push(`  Evidence:    ${report.checks.evidence.score}/5 ${report.checks.evidence.passed ? '✅' : '❌'}`);
  lines.push(`  Language:    ${report.checks.language.score}/5 ${report.checks.language.passed ? '✅' : '❌'}`);
  lines.push('');

  // エラー詳細（エラーがある場合のみ）
  if (report.status !== 'success') {
    lines.push('⚠️  Issues Found:');

    if (!report.checks.structure.passed) {
      if (report.checks.structure.missingFields.length > 0) {
        lines.push(`  Missing fields: ${report.checks.structure.missingFields.join(', ')}`);
      }
      report.checks.structure.arrayFieldIssues.forEach((issue) => {
        lines.push(`  ${issue.field}: expected ${issue.expected}+, got ${issue.actual}`);
      });
    }

    if (!report.checks.compliance.passed) {
      lines.push(`  Compliance violations: ${report.checks.compliance.violations.length}`);
      report.checks.compliance.violations.slice(0, 3).forEach((v) => {
        lines.push(`    - ${v.field}: "${v.word}" (${v.severity})`);
      });
      if (report.checks.compliance.violations.length > 3) {
        lines.push(`    ... and ${report.checks.compliance.violations.length - 3} more`);
      }
    }

    if (!report.checks.wordCount.passed) {
      const errors = report.checks.wordCount.issues.filter((i) => i.severity === 'error');
      errors.slice(0, 3).forEach((issue) => {
        lines.push(`    - ${issue.field}: expected ${issue.expected}, got ${issue.actual}`);
      });
    }

    lines.push('');
  }

  // 推奨事項
  lines.push('💡 Recommendations:');
  report.recommendations.forEach((rec, idx) => {
    lines.push(`  ${idx + 1}. ${rec}`);
  });

  return lines.join('\n');
};

/**
 * バッチモード用のサマリーを生成
 */
export interface BatchSummary {
  timestamp: string;
  totalFiles: number;
  summary: {
    S: number;
    A: number;
    B: number;
    C: number;
    D: number;
  };
  passRate: string;
  criticalIssues: number;
  files: Array<{
    file: string;
    score: number;
    grade: string;
    status: string;
    topIssues?: string[];
  }>;
}

export const generateBatchSummary = (reports: ValidationReport[]): BatchSummary => {
  const summary = { S: 0, A: 0, B: 0, C: 0, D: 0 };
  let criticalIssues = 0;

  const files = reports.map((report) => {
    summary[report.grade]++;

    const topIssues: string[] = [];
    if (report.checks.compliance.violations.length > 0) {
      topIssues.push(`薬機法違反の可能性: ${report.checks.compliance.violations.length}件`);
      criticalIssues += report.checks.compliance.violations.filter((v) => v.severity === 'critical').length;
    }
    if (!report.checks.wordCount.passed) {
      topIssues.push('文字数不足');
    }
    if (!report.checks.structure.passed) {
      topIssues.push('構造エラー');
    }

    return {
      file: report.file,
      score: report.totalScore,
      grade: report.grade,
      status: report.status,
      topIssues: topIssues.length > 0 ? topIssues : undefined,
    };
  });

  const passCount = summary.S + summary.A + summary.B;
  const passRate = ((passCount / reports.length) * 100).toFixed(1);

  return {
    timestamp: new Date().toISOString(),
    totalFiles: reports.length,
    summary,
    passRate: `${passRate}%`,
    criticalIssues,
    files,
  };
};
