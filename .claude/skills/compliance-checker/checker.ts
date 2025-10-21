/**
 * コンプライアンスチェッカー（メインロジック）
 */

import { COMPLIANCE_RULES, ComplianceRule, generateSuggestion, generateDetailedExplanation } from './rules/ng-words';
import {
  scanFiles,
  ScanResult,
  extractStringsFromTSX,
  extractStringsFromJSON,
  extractStringsFromMarkdown,
} from './scanners/file-scanner';

export interface Violation {
  filePath: string;
  line: number;
  column: number;
  text: string;
  rule: ComplianceRule;
  suggestion: string;
  context: string; // 前後の文脈
}

export interface CheckOptions {
  target: string | string[];
  fileTypes: string[];
  severityThreshold: 'critical' | 'warning' | 'all';
  excludePatterns?: string[];
}

export interface CheckResult {
  violations: Violation[];
  scannedFiles: number;
  criticalCount: number;
  warningCount: number;
  passThreshold: boolean;
}

/**
 * 文字列内のNGワードをチェック
 */
export const checkString = (
  text: string,
  filePath: string,
  lineNumber: number,
  severityThreshold: 'critical' | 'warning' | 'all'
): Violation[] => {
  const violations: Violation[] = [];

  // Critical チェック
  for (const rule of COMPLIANCE_RULES.critical) {
    const regex = new RegExp(rule.word, 'g');
    let match;

    while ((match = regex.exec(text)) !== null) {
      violations.push({
        filePath,
        line: lineNumber,
        column: match.index,
        text: match[0],
        rule,
        suggestion: generateSuggestion(text, rule.word),
        context: getContext(text, match.index),
      });
    }
  }

  // Warning チェック（severityThresholdがallまたはwarningの場合のみ）
  if (severityThreshold === 'all' || severityThreshold === 'warning') {
    for (const rule of COMPLIANCE_RULES.warning) {
      const regex = new RegExp(rule.word, 'g');
      let match;

      while ((match = regex.exec(text)) !== null) {
        violations.push({
          filePath,
          line: lineNumber,
          column: match.index,
          text: match[0],
          rule,
          suggestion: generateSuggestion(text, rule.word),
          context: getContext(text, match.index),
        });
      }
    }
  }

  return violations;
};

/**
 * 前後の文脈を取得（40文字程度）
 */
const getContext = (text: string, index: number): string => {
  const start = Math.max(0, index - 20);
  const end = Math.min(text.length, index + 20);
  return text.substring(start, end);
};

/**
 * ファイルをチェック
 */
export const checkFile = (
  scanResult: ScanResult,
  severityThreshold: 'critical' | 'warning' | 'all'
): Violation[] => {
  const { filePath, fileType, content, lines } = scanResult;
  const violations: Violation[] = [];

  if (fileType === 'tsx' || fileType === 'jsx' || fileType === 'ts' || fileType === 'js') {
    // TSX/JSX: 文字列リテラルを抽出してチェック
    const strings = extractStringsFromTSX(content);
    strings.forEach((str, index) => {
      const lineViolations = checkString(str, filePath, index + 1, severityThreshold);
      violations.push(...lineViolations);
    });

    // 全行もチェック（コメントなども含む）
    lines.forEach((line, index) => {
      const lineViolations = checkString(line, filePath, index + 1, severityThreshold);
      violations.push(...lineViolations);
    });
  } else if (fileType === 'json') {
    // JSON: 文字列値を抽出してチェック
    const strings = extractStringsFromJSON(content);
    strings.forEach((str, index) => {
      const lineViolations = checkString(str, filePath, index + 1, severityThreshold);
      violations.push(...lineViolations);
    });
  } else if (fileType === 'md') {
    // Markdown: テキストを抽出してチェック
    const strings = extractStringsFromMarkdown(content);
    strings.forEach((str, index) => {
      const lineViolations = checkString(str, filePath, index + 1, severityThreshold);
      violations.push(...lineViolations);
    });
  }

  return violations;
};

/**
 * 複数ファイルをチェック
 */
export const checkCompliance = async (options: CheckOptions): Promise<CheckResult> => {
  const { target, fileTypes, severityThreshold, excludePatterns } = options;

  // ファイルスキャン
  const scanResults = await scanFiles({
    target,
    fileTypes,
    excludePatterns,
  });

  const violations: Violation[] = [];

  // 各ファイルをチェック
  for (const scanResult of scanResults) {
    const fileViolations = checkFile(scanResult, severityThreshold);
    violations.push(...fileViolations);
  }

  // 重複を除去
  const uniqueViolations = violations.filter(
    (v, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.filePath === v.filePath &&
          t.line === v.line &&
          t.column === v.column &&
          t.text === v.text
      )
  );

  // 統計
  const criticalCount = uniqueViolations.filter((v) => v.rule.severity === 'critical').length;
  const warningCount = uniqueViolations.filter((v) => v.rule.severity === 'warning').length;

  // 合格判定（criticalが0件、warningが3件以下）
  const passThreshold = criticalCount === 0 && warningCount <= 3;

  return {
    violations: uniqueViolations,
    scannedFiles: scanResults.length,
    criticalCount,
    warningCount,
    passThreshold,
  };
};
