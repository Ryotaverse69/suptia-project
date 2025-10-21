/**
 * レポート生成
 */

import { MatchReport, Match, UnmatchedProduct } from '../types';
import * as fs from 'fs';

export type OutputFormat = 'console' | 'json' | 'markdown';

/**
 * コンソール出力
 */
export const generateConsoleReport = (report: MatchReport): string => {
  const RESET = '\x1b[0m';
  const RED = '\x1b[31m';
  const YELLOW = '\x1b[33m';
  const GREEN = '\x1b[32m';
  const BLUE = '\x1b[34m';
  const CYAN = '\x1b[36m';
  const BOLD = '\x1b[1m';

  let output = '';

  // ヘッダー
  output += `\n${BOLD}┌─────────────────────────────────────────────────────────┐${RESET}\n`;
  output += `${BOLD}│         Product Matcher Report                          │${RESET}\n`;
  output += `${BOLD}├─────────────────────────────────────────────────────────┤${RESET}\n`;
  output += `${BOLD}│ Source: ${report.source}                                │${RESET}\n`;
  output += `${BOLD}│ Target: ${report.target}                                │${RESET}\n`;
  output += `${BOLD}│ Strategy: ${CYAN}${report.strategy.toUpperCase()}${RESET}${BOLD}                                  │${RESET}\n`;
  output += `${BOLD}│ Threshold: ${report.threshold}                                    │${RESET}\n`;
  output += `${BOLD}│ Status: ${getStatusColor(report.overallStatus)}${report.overallStatus.toUpperCase()}${RESET}${BOLD}                              │${RESET}\n`;
  output += `${BOLD}└─────────────────────────────────────────────────────────┘${RESET}\n\n`;

  const stats = report.statistics;

  // 統計
  output += `${BOLD}📊 Statistics${RESET}\n`;
  output += `  Source Products: ${stats.totalSourceProducts}\n`;
  output += `  Target Products: ${stats.totalTargetProducts}\n`;
  output += `  Matched: ${GREEN}${stats.matchedCount}${RESET} (${(stats.matchRate * 100).toFixed(1)}%)\n`;
  output += `  Unmatched: ${RED}${stats.unmatchedCount}${RESET}\n`;
  output += `  Average Confidence: ${getConfidenceColor(stats.averageConfidence)}${(stats.averageConfidence * 100).toFixed(1)}%${RESET}\n\n`;

  // マッチタイプ別
  output += `${BOLD}🔍 Match Type Breakdown${RESET}\n`;
  output += `  JAN Matches: ${CYAN}${stats.matchTypeBreakdown.janMatches}${RESET}\n`;
  output += `  ASIN Matches: ${CYAN}${stats.matchTypeBreakdown.asinMatches}${RESET}\n`;
  output += `  Title Matches: ${CYAN}${stats.matchTypeBreakdown.titleMatches}${RESET}\n\n`;

  // 信頼度レベル別
  output += `${BOLD}📈 Confidence Level Breakdown${RESET}\n`;
  output += `  High (≥0.92): ${GREEN}${stats.confidenceLevelBreakdown.high}${RESET}\n`;
  output += `  Medium (0.85-0.91): ${YELLOW}${stats.confidenceLevelBreakdown.medium}${RESET}\n`;
  output += `  Low (0.75-0.84): ${RED}${stats.confidenceLevelBreakdown.low}${RESET}\n\n`;

  // マッチング結果（上位10件）
  if (report.matches.length > 0) {
    output += `${BOLD}✅ Top Matches (showing ${Math.min(10, report.matches.length)} of ${report.matches.length})${RESET}\n\n`;
    report.matches.slice(0, 10).forEach((match, index) => {
      output += `${BOLD}[${index + 1}] ${match.matchType.toUpperCase()} Match (Confidence: ${getConfidenceColor(match.confidence)}${(match.confidence * 100).toFixed(1)}%${RESET}${BOLD})${RESET}\n`;
      output += `    Source: ${match.sourceProduct.title}\n`;
      output += `    Target: ${match.targetProduct.title}\n`;
      if (match.similarity) {
        output += `    Common Tokens: ${match.similarity.commonTokens.slice(0, 5).join(', ')}\n`;
      }
      output += '\n';
    });
  }

  // 未マッチ商品（上位5件）
  if (report.unmatched.length > 0) {
    output += `${BOLD}❌ Unmatched Products (showing ${Math.min(5, report.unmatched.length)} of ${report.unmatched.length})${RESET}\n\n`;
    report.unmatched.slice(0, 5).forEach((unmatched, index) => {
      output += `${BOLD}[${index + 1}] ${unmatched.product.title}${RESET}\n`;
      output += `    Reason: ${RED}${unmatched.reason}${RESET}\n`;
      if (unmatched.candidates && unmatched.candidates.length > 0) {
        output += `    ${YELLOW}Candidates:${RESET}\n`;
        unmatched.candidates.slice(0, 2).forEach((candidate, i) => {
          output += `      ${i + 1}. ${candidate.product.title} (${(candidate.confidence * 100).toFixed(1)}%)\n`;
        });
      }
      output += '\n';
    });
  }

  // フッター
  output += `${BOLD}───────────────────────────────────────────────────────${RESET}\n`;
  if (report.overallStatus === 'excellent') {
    output += `${GREEN}${BOLD}🎉 素晴らしいマッチング精度です！${RESET}\n\n`;
  } else if (report.overallStatus === 'good') {
    output += `${YELLOW}${BOLD}✅ 良好なマッチング精度です。${RESET}\n\n`;
  } else {
    output += `${RED}${BOLD}⚠️  未マッチ商品のレビューが必要です。${RESET}\n\n`;
  }

  return output;
};

/**
 * ステータス色を取得
 */
const getStatusColor = (status: string): string => {
  const GREEN = '\x1b[32m';
  const YELLOW = '\x1b[33m';
  const RED = '\x1b[31m';

  if (status === 'excellent') return GREEN;
  if (status === 'good') return YELLOW;
  return RED;
};

/**
 * 信頼度色を取得
 */
const getConfidenceColor = (confidence: number): string => {
  const GREEN = '\x1b[32m';
  const YELLOW = '\x1b[33m';
  const RED = '\x1b[31m';

  if (confidence >= 0.92) return GREEN;
  if (confidence >= 0.85) return YELLOW;
  return RED;
};

/**
 * JSON形式で出力
 */
export const generateJSONReport = (report: MatchReport): string => {
  return JSON.stringify(report, null, 2);
};

/**
 * Markdown形式で出力
 */
export const generateMarkdownReport = (report: MatchReport): string => {
  let output = '';

  output += `# Product Matcher Report\n\n`;
  output += `**Source:** ${report.source}\n`;
  output += `**Target:** ${report.target}\n`;
  output += `**Strategy:** ${report.strategy.toUpperCase()}\n`;
  output += `**Threshold:** ${report.threshold}\n`;
  output += `**Status:** ${report.overallStatus === 'excellent' ? '🎉 Excellent' : report.overallStatus === 'good' ? '✅ Good' : '⚠️ Needs Review'}\n\n`;

  const stats = report.statistics;

  output += `## 📊 Statistics\n\n`;
  output += `- **Source Products:** ${stats.totalSourceProducts}\n`;
  output += `- **Target Products:** ${stats.totalTargetProducts}\n`;
  output += `- **Matched:** ${stats.matchedCount} (${(stats.matchRate * 100).toFixed(1)}%)\n`;
  output += `- **Unmatched:** ${stats.unmatchedCount}\n`;
  output += `- **Average Confidence:** ${(stats.averageConfidence * 100).toFixed(1)}%\n\n`;

  output += `## 🔍 Match Type Breakdown\n\n`;
  output += `| Type | Count |\n`;
  output += `|------|-------|\n`;
  output += `| JAN Matches | ${stats.matchTypeBreakdown.janMatches} |\n`;
  output += `| ASIN Matches | ${stats.matchTypeBreakdown.asinMatches} |\n`;
  output += `| Title Matches | ${stats.matchTypeBreakdown.titleMatches} |\n\n`;

  output += `## 📈 Confidence Level Breakdown\n\n`;
  output += `| Level | Count |\n`;
  output += `|-------|-------|\n`;
  output += `| High (≥0.92) | ${stats.confidenceLevelBreakdown.high} |\n`;
  output += `| Medium (0.85-0.91) | ${stats.confidenceLevelBreakdown.medium} |\n`;
  output += `| Low (0.75-0.84) | ${stats.confidenceLevelBreakdown.low} |\n\n`;

  // マッチング結果
  if (report.matches.length > 0) {
    output += `## ✅ Matches\n\n`;
    report.matches.slice(0, 10).forEach((match, index) => {
      output += `### ${index + 1}. ${match.matchType.toUpperCase()} Match (${(match.confidence * 100).toFixed(1)}%)\n\n`;
      output += `- **Source:** ${match.sourceProduct.title}\n`;
      output += `- **Target:** ${match.targetProduct.title}\n`;
      if (match.similarity) {
        output += `- **Common Tokens:** ${match.similarity.commonTokens.slice(0, 5).join(', ')}\n`;
      }
      output += '\n';
    });
  }

  // 未マッチ商品
  if (report.unmatched.length > 0) {
    output += `## ❌ Unmatched Products\n\n`;
    report.unmatched.slice(0, 10).forEach((unmatched, index) => {
      output += `### ${index + 1}. ${unmatched.product.title}\n\n`;
      output += `- **Reason:** ${unmatched.reason}\n`;
      if (unmatched.candidates && unmatched.candidates.length > 0) {
        output += `- **Candidates:**\n`;
        unmatched.candidates.forEach((candidate, i) => {
          output += `  ${i + 1}. ${candidate.product.title} (${(candidate.confidence * 100).toFixed(1)}%)\n`;
        });
      }
      output += '\n';
    });
  }

  return output;
};

/**
 * レポートを出力
 */
export const outputReport = (
  report: MatchReport,
  format: OutputFormat,
  saveReport?: string | null
): void => {
  let reportContent: string;

  switch (format) {
    case 'json':
      reportContent = generateJSONReport(report);
      break;
    case 'markdown':
      reportContent = generateMarkdownReport(report);
      break;
    case 'console':
    default:
      reportContent = generateConsoleReport(report);
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
