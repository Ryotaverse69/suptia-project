/**
 * メインバリデータ: すべてのチェッカーを統合
 */

import { promises as fs } from 'fs';
import path from 'path';
import { checkStructure } from './checkers/structure';
import { checkCompliance } from './checkers/compliance';
import { checkWordCount } from './checkers/wordCount';
import { checkReferences } from './checkers/references';
import { checkEvidence } from './checkers/evidence';
import { checkLanguage } from './checkers/language';
import { generateReport, formatReportForConsole, type ValidationReport } from './reporter';

export interface ValidatorOptions {
  showOnlyErrors?: boolean;
}

/**
 * 単一のJSONファイルを検証
 */
export const validateFile = async (
  filePath: string,
  options: ValidatorOptions = {}
): Promise<ValidationReport> => {
  // ファイル読み込み
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(fileContent);

  // 各チェッカーを実行
  const structureResult = checkStructure(data);
  const complianceResult = checkCompliance(data);
  const wordCountResult = checkWordCount(data);
  const referencesResult = checkReferences(data);
  const evidenceResult = checkEvidence(data);
  const languageResult = checkLanguage(data);

  // レポート生成
  const report = generateReport(path.basename(filePath), {
    structure: structureResult,
    compliance: complianceResult,
    wordCount: wordCountResult,
    references: referencesResult,
    evidence: evidenceResult,
    language: languageResult,
  });

  return report;
};

/**
 * 複数のJSONファイルを検証（バッチモード）
 */
export const validateBatch = async (
  filePaths: string[],
  options: ValidatorOptions = {}
): Promise<ValidationReport[]> => {
  const reports: ValidationReport[] = [];

  for (const filePath of filePaths) {
    try {
      const report = await validateFile(filePath, options);
      reports.push(report);
    } catch (error) {
      console.error(`Error validating ${filePath}:`, error);
    }
  }

  return reports;
};

/**
 * レポートを表示
 */
export const printReport = (report: ValidationReport, showOnlyErrors: boolean = false): void => {
  if (showOnlyErrors && report.status === 'success') {
    return; // エラーがない場合はスキップ
  }

  console.log(formatReportForConsole(report));
  console.log('');
};

/**
 * レポートをJSONファイルに保存
 */
export const saveReport = async (report: ValidationReport, outputPath: string): Promise<void> => {
  await fs.writeFile(outputPath, JSON.stringify(report, null, 2), 'utf-8');
};
