/**
 * レポート生成
 */

import { CheckResult, Violation } from './checker';
import { generateDetailedExplanation } from './rules/ng-words';
import * as fs from 'fs';

export type OutputFormat = 'console' | 'json' | 'markdown';

/**
 * コンソール出力（カラフル）
 */
export const generateConsoleReport = (result: CheckResult): string => {
  const { violations, scannedFiles, criticalCount, warningCount, passThreshold } = result;

  // カラーコード
  const RESET = '\x1b[0m';
  const RED = '\x1b[31m';
  const YELLOW = '\x1b[33m';
  const GREEN = '\x1b[32m';
  const BLUE = '\x1b[34m';
  const BOLD = '\x1b[1m';

  let output = '';

  // ヘッダー
  output += `\n${BOLD}┌─────────────────────────────────────────────────────────┐${RESET}\n`;
  output += `${BOLD}│         Compliance Checker Report                       │${RESET}\n`;
  output += `${BOLD}├─────────────────────────────────────────────────────────┤${RESET}\n`;
  output += `${BOLD}│ Scanned Files: ${scannedFiles}                                      │${RESET}\n`;
  output += `${BOLD}│ Total Violations: ${violations.length}                                 │${RESET}\n`;
  output += `${BOLD}│   - Critical: ${RED}${criticalCount}${RESET}${BOLD}                                     │${RESET}\n`;
  output += `${BOLD}│   - Warning: ${YELLOW}${warningCount}${RESET}${BOLD}                                      │${RESET}\n`;
  output += `${BOLD}│ Status: ${passThreshold ? `${GREEN}PASS ✅${RESET}${BOLD}` : `${RED}FAIL ❌${RESET}${BOLD}`}                                  │${RESET}\n`;
  output += `${BOLD}└─────────────────────────────────────────────────────────┘${RESET}\n\n`;

  if (violations.length === 0) {
    output += `${GREEN}${BOLD}✅ コンプライアンスチェックに合格しました！${RESET}\n`;
    output += `すべてのファイルが薬機法・景品表示法に準拠しています。\n\n`;
    return output;
  }

  // 違反詳細
  output += `${BOLD}📋 Violations:${RESET}\n\n`;

  // Criticalから表示
  const criticals = violations.filter((v) => v.rule.severity === 'critical');
  if (criticals.length > 0) {
    output += `${RED}${BOLD}🚨 Critical (${criticals.length}件)${RESET}\n`;
    criticals.forEach((v, index) => {
      output += `\n${RED}[${index + 1}] ${v.filePath}:${v.line}:${v.column}${RESET}\n`;
      output += `   ${RED}❌ "${v.text}"${RESET}\n`;
      output += `   法令: ${v.rule.law} | カテゴリ: ${v.rule.category}\n`;
      output += `   ${BLUE}💡 修正提案: ${v.suggestion}${RESET}\n`;
      output += `   文脈: ...${v.context}...\n`;
    });
    output += '\n';
  }

  // Warning
  const warnings = violations.filter((v) => v.rule.severity === 'warning');
  if (warnings.length > 0) {
    output += `${YELLOW}${BOLD}⚠️  Warning (${warnings.length}件)${RESET}\n`;
    warnings.forEach((v, index) => {
      output += `\n${YELLOW}[${index + 1}] ${v.filePath}:${v.line}:${v.column}${RESET}\n`;
      output += `   ${YELLOW}⚠️  "${v.text}"${RESET}\n`;
      output += `   法令: ${v.rule.law} | カテゴリ: ${v.rule.category}\n`;
      output += `   ${BLUE}💡 修正提案: ${v.suggestion}${RESET}\n`;
      output += `   文脈: ...${v.context}...\n`;
    });
    output += '\n';
  }

  // フッター
  output += `${BOLD}───────────────────────────────────────────────────────${RESET}\n`;
  if (!passThreshold) {
    output += `${RED}${BOLD}❌ コンプライアンスチェックに失敗しました。${RESET}\n`;
    output += `Critical違反を0件、Warning違反を3件以下にしてください。\n\n`;
  } else {
    output += `${GREEN}${BOLD}✅ コンプライアンスチェックに合格しました！${RESET}\n\n`;
  }

  return output;
};

/**
 * JSON形式で出力
 */
export const generateJSONReport = (result: CheckResult): string => {
  return JSON.stringify(result, null, 2);
};

/**
 * Markdown形式で出力
 */
export const generateMarkdownReport = (result: CheckResult): string => {
  const { violations, scannedFiles, criticalCount, warningCount, passThreshold } = result;

  let output = '';

  // ヘッダー
  output += `# Compliance Checker Report\n\n`;
  output += `## Summary\n\n`;
  output += `- **Scanned Files**: ${scannedFiles}\n`;
  output += `- **Total Violations**: ${violations.length}\n`;
  output += `  - Critical: ${criticalCount}\n`;
  output += `  - Warning: ${warningCount}\n`;
  output += `- **Status**: ${passThreshold ? '✅ PASS' : '❌ FAIL'}\n\n`;

  if (violations.length === 0) {
    output += `✅ **すべてのファイルが薬機法・景品表示法に準拠しています。**\n\n`;
    return output;
  }

  // Critical
  const criticals = violations.filter((v) => v.rule.severity === 'critical');
  if (criticals.length > 0) {
    output += `## 🚨 Critical (${criticals.length}件)\n\n`;
    criticals.forEach((v, index) => {
      output += `### ${index + 1}. ${v.filePath}:${v.line}:${v.column}\n\n`;
      output += `- **違反表現**: "${v.text}"\n`;
      output += `- **法令**: ${v.rule.law}\n`;
      output += `- **カテゴリ**: ${v.rule.category}\n`;
      output += `- **修正提案**: ${v.suggestion}\n`;
      output += `- **文脈**: ...${v.context}...\n\n`;
    });
  }

  // Warning
  const warnings = violations.filter((v) => v.rule.severity === 'warning');
  if (warnings.length > 0) {
    output += `## ⚠️ Warning (${warnings.length}件)\n\n`;
    warnings.forEach((v, index) => {
      output += `### ${index + 1}. ${v.filePath}:${v.line}:${v.column}\n\n`;
      output += `- **違反表現**: "${v.text}"\n`;
      output += `- **法令**: ${v.rule.law}\n`;
      output += `- **カテゴリ**: ${v.rule.category}\n`;
      output += `- **修正提案**: ${v.suggestion}\n`;
      output += `- **文脈**: ...${v.context}...\n\n`;
    });
  }

  // フッター
  output += `---\n\n`;
  if (!passThreshold) {
    output += `❌ **コンプライアンスチェックに失敗しました。**\n\n`;
    output += `Critical違反を0件、Warning違反を3件以下にしてください。\n`;
  } else {
    output += `✅ **コンプライアンスチェックに合格しました！**\n`;
  }

  return output;
};

/**
 * レポートを出力
 */
export const outputReport = (
  result: CheckResult,
  format: OutputFormat,
  saveReport?: string | null
): void => {
  let reportContent: string;

  switch (format) {
    case 'json':
      reportContent = generateJSONReport(result);
      break;
    case 'markdown':
      reportContent = generateMarkdownReport(result);
      break;
    case 'console':
    default:
      reportContent = generateConsoleReport(result);
      break;
  }

  // コンソールに出力
  console.log(reportContent);

  // ファイルに保存
  if (saveReport) {
    try {
      fs.writeFileSync(saveReport, reportContent, 'utf-8');
      console.log(`\n📄 Report saved to: ${saveReport}`);
    } catch (error) {
      console.error(`Failed to save report to ${saveReport}:`, error);
    }
  }
};
