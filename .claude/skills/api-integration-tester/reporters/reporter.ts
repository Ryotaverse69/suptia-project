/**
 * レポート生成
 */

import { TestReport, QualityScore, RateLimitStatus } from '../types';
import * as fs from 'fs';

export type OutputFormat = 'console' | 'json' | 'markdown';

/**
 * コンソール出力
 */
export const generateConsoleReport = (report: TestReport): string => {
  const RESET = '\x1b[0m';
  const RED = '\x1b[31m';
  const YELLOW = '\x1b[33m';
  const GREEN = '\x1b[32m';
  const BLUE = '\x1b[34m';
  const BOLD = '\x1b[1m';
  const CYAN = '\x1b[36m';

  let output = '';

  // ヘッダー
  output += `\n${BOLD}┌─────────────────────────────────────────────────────────┐${RESET}\n`;
  output += `${BOLD}│         API Integration Tester Report                   │${RESET}\n`;
  output += `${BOLD}├─────────────────────────────────────────────────────────┤${RESET}\n`;
  output += `${BOLD}│ Provider: ${CYAN}${report.provider.toUpperCase()}${RESET}${BOLD}                                        │${RESET}\n`;
  output += `${BOLD}│ Timestamp: ${report.timestamp}                 │${RESET}\n`;
  output += `${BOLD}│ Status: ${report.overallStatus === 'pass' ? `${GREEN}PASS ✅${RESET}${BOLD}` : report.overallStatus === 'warning' ? `${YELLOW}WARNING ⚠️${RESET}${BOLD}` : `${RED}FAIL ❌${RESET}${BOLD}`}                                   │${RESET}\n`;
  output += `${BOLD}└─────────────────────────────────────────────────────────┘${RESET}\n\n`;

  // 認証テスト結果
  if (report.results.auth) {
    output += `${BOLD}🔐 Authentication Test${RESET}\n`;
    output += `  Status: ${report.results.auth.success ? `${GREEN}✅ Success${RESET}` : `${RED}❌ Failed${RESET}`}\n`;
    output += `  Message: ${report.results.auth.message}\n`;
    if (report.results.auth.error) {
      output += `  ${RED}Error: ${report.results.auth.error}${RESET}\n`;
    }
    output += '\n';
  }

  // データ取得テスト結果
  if (report.results.fetch) {
    output += `${BOLD}📦 Data Fetch Test${RESET}\n`;
    output += `  Product ID: ${report.results.fetch.productId}\n`;
    output += `  Status: ${report.results.fetch.success ? `${GREEN}✅ Success${RESET}` : `${RED}❌ Failed${RESET}`}\n`;
    output += `  Response Time: ${report.results.fetch.responseTime}ms\n`;

    if (report.results.fetch.data) {
      const data = report.results.fetch.data;
      output += `\n  ${BOLD}Product Data:${RESET}\n`;
      output += `    Title: ${data.title}\n`;
      output += `    Price: ${data.price ? `¥${data.price.amount}` : 'N/A'}\n`;
      output += `    Stock: ${data.stock?.available ? `${GREEN}Available${RESET}` : `${RED}Out of Stock${RESET}`}\n`;
      output += `    Images: ${data.images?.length || 0} images\n`;
      output += `    Description: ${data.description ? `${data.description.substring(0, 50)}...` : 'N/A'}\n`;
      output += `    Reviews: ${data.reviews ? `⭐ ${data.reviews.averageRating} (${data.reviews.totalReviews} reviews)` : 'N/A'}\n`;
    }

    if (report.results.fetch.error) {
      output += `  ${RED}Error: ${report.results.fetch.error}${RESET}\n`;
    }
    output += '\n';
  }

  // 品質スコア
  if (report.results.quality) {
    const quality = report.results.quality;
    output += `${BOLD}📊 Data Quality Score${RESET}\n`;
    output += `  Total Score: ${getScoreColor(quality.totalScore)}${quality.totalScore}/100${RESET}\n\n`;
    output += `  ${BOLD}Breakdown:${RESET}\n`;
    output += `    Price Accuracy:       ${getScoreColor(quality.breakdown.priceAccuracy, 30)}${quality.breakdown.priceAccuracy}/30${RESET}\n`;
    output += `    Stock Availability:   ${getScoreColor(quality.breakdown.stockAvailability, 25)}${quality.breakdown.stockAvailability}/25${RESET}\n`;
    output += `    Image Quality:        ${getScoreColor(quality.breakdown.imageQuality, 15)}${quality.breakdown.imageQuality}/15${RESET}\n`;
    output += `    Description:          ${getScoreColor(quality.breakdown.descriptionCompleteness, 15)}${quality.breakdown.descriptionCompleteness}/15${RESET}\n`;
    output += `    Review Data:          ${getScoreColor(quality.breakdown.reviewData, 10)}${quality.breakdown.reviewData}/10${RESET}\n`;
    output += `    Response Time:        ${getScoreColor(quality.breakdown.responseTime, 5)}${quality.breakdown.responseTime}/5${RESET}\n`;

    if (quality.issues.length > 0) {
      output += `\n  ${RED}${BOLD}Issues:${RESET}\n`;
      quality.issues.forEach((issue) => {
        output += `    ${RED}• ${issue}${RESET}\n`;
      });
    }

    if (quality.recommendations.length > 0) {
      output += `\n  ${BLUE}${BOLD}Recommendations:${RESET}\n`;
      quality.recommendations.forEach((rec) => {
        output += `    ${BLUE}💡 ${rec}${RESET}\n`;
      });
    }
    output += '\n';
  }

  // レート制限
  if (report.results.rateLimit) {
    const rateLimit = report.results.rateLimit;
    output += `${BOLD}⏱️  Rate Limit Status${RESET}\n`;
    output += `  Max Requests/Second: ${rateLimit.maxRequestsPerSecond}\n`;
    output += `  Max Requests/Day: ${rateLimit.maxRequestsPerDay.toLocaleString()}\n`;
    output += `  Requests Today: ${rateLimit.currentUsage.requestsToday.toLocaleString()}\n`;
    output += `  Remaining Today: ${rateLimit.currentUsage.remainingToday.toLocaleString()}\n`;
    output += `  Next Reset: ${new Date(rateLimit.estimatedNextReset).toLocaleString('ja-JP')}\n`;

    if (rateLimit.warning) {
      output += `  ${YELLOW}⚠️  Warning: ${rateLimit.warning}${RESET}\n`;
    }
    output += '\n';
  }

  // サマリー
  output += `${BOLD}───────────────────────────────────────────────────────${RESET}\n`;
  output += `${BOLD}Summary:${RESET} ${report.summary}\n\n`;

  return output;
};

/**
 * スコアに応じた色を返す
 */
const getScoreColor = (score: number, max?: number): string => {
  const RESET = '\x1b[0m';
  const RED = '\x1b[31m';
  const YELLOW = '\x1b[33m';
  const GREEN = '\x1b[32m';

  const percentage = max ? (score / max) * 100 : score;

  if (percentage >= 80) return GREEN;
  if (percentage >= 60) return YELLOW;
  return RED;
};

/**
 * JSON形式で出力
 */
export const generateJSONReport = (report: TestReport): string => {
  return JSON.stringify(report, null, 2);
};

/**
 * Markdown形式で出力
 */
export const generateMarkdownReport = (report: TestReport): string => {
  let output = '';

  output += `# API Integration Tester Report\n\n`;
  output += `**Provider:** ${report.provider.toUpperCase()}\n`;
  output += `**Timestamp:** ${report.timestamp}\n`;
  output += `**Status:** ${report.overallStatus === 'pass' ? '✅ PASS' : report.overallStatus === 'warning' ? '⚠️ WARNING' : '❌ FAIL'}\n\n`;

  output += `---\n\n`;

  // 認証テスト
  if (report.results.auth) {
    output += `## 🔐 Authentication Test\n\n`;
    output += `- **Status:** ${report.results.auth.success ? '✅ Success' : '❌ Failed'}\n`;
    output += `- **Message:** ${report.results.auth.message}\n`;
    if (report.results.auth.error) {
      output += `- **Error:** ${report.results.auth.error}\n`;
    }
    output += '\n';
  }

  // データ取得テスト
  if (report.results.fetch) {
    output += `## 📦 Data Fetch Test\n\n`;
    output += `- **Product ID:** ${report.results.fetch.productId}\n`;
    output += `- **Status:** ${report.results.fetch.success ? '✅ Success' : '❌ Failed'}\n`;
    output += `- **Response Time:** ${report.results.fetch.responseTime}ms\n\n`;

    if (report.results.fetch.data) {
      const data = report.results.fetch.data;
      output += `### Product Data\n\n`;
      output += `- **Title:** ${data.title}\n`;
      output += `- **Price:** ${data.price ? `¥${data.price.amount}` : 'N/A'}\n`;
      output += `- **Stock:** ${data.stock?.available ? '✅ Available' : '❌ Out of Stock'}\n`;
      output += `- **Images:** ${data.images?.length || 0} images\n`;
      output += `- **Description:** ${data.description || 'N/A'}\n`;
      output += `- **Reviews:** ${data.reviews ? `⭐ ${data.reviews.averageRating} (${data.reviews.totalReviews} reviews)` : 'N/A'}\n\n`;
    }
  }

  // 品質スコア
  if (report.results.quality) {
    const quality = report.results.quality;
    output += `## 📊 Data Quality Score\n\n`;
    output += `**Total Score:** ${quality.totalScore}/100\n\n`;
    output += `### Breakdown\n\n`;
    output += `| Category | Score |\n`;
    output += `|----------|-------|\n`;
    output += `| Price Accuracy | ${quality.breakdown.priceAccuracy}/30 |\n`;
    output += `| Stock Availability | ${quality.breakdown.stockAvailability}/25 |\n`;
    output += `| Image Quality | ${quality.breakdown.imageQuality}/15 |\n`;
    output += `| Description Completeness | ${quality.breakdown.descriptionCompleteness}/15 |\n`;
    output += `| Review Data | ${quality.breakdown.reviewData}/10 |\n`;
    output += `| Response Time | ${quality.breakdown.responseTime}/5 |\n\n`;

    if (quality.issues.length > 0) {
      output += `### Issues\n\n`;
      quality.issues.forEach((issue) => {
        output += `- ❌ ${issue}\n`;
      });
      output += '\n';
    }

    if (quality.recommendations.length > 0) {
      output += `### Recommendations\n\n`;
      quality.recommendations.forEach((rec) => {
        output += `- 💡 ${rec}\n`;
      });
      output += '\n';
    }
  }

  // レート制限
  if (report.results.rateLimit) {
    const rateLimit = report.results.rateLimit;
    output += `## ⏱️ Rate Limit Status\n\n`;
    output += `- **Max Requests/Second:** ${rateLimit.maxRequestsPerSecond}\n`;
    output += `- **Max Requests/Day:** ${rateLimit.maxRequestsPerDay.toLocaleString()}\n`;
    output += `- **Requests Today:** ${rateLimit.currentUsage.requestsToday.toLocaleString()}\n`;
    output += `- **Remaining Today:** ${rateLimit.currentUsage.remainingToday.toLocaleString()}\n`;
    output += `- **Next Reset:** ${new Date(rateLimit.estimatedNextReset).toLocaleString('ja-JP')}\n`;

    if (rateLimit.warning) {
      output += `- ⚠️ **Warning:** ${rateLimit.warning}\n`;
    }
    output += '\n';
  }

  output += `---\n\n`;
  output += `**Summary:** ${report.summary}\n`;

  return output;
};

/**
 * レポートを出力
 */
export const outputReport = (
  report: TestReport,
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
