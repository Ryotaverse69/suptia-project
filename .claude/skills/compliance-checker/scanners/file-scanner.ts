/**
 * ファイルスキャナー
 * 指定されたファイル/ディレクトリからコンテンツを抽出
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

export interface ScanResult {
  filePath: string;
  fileType: string;
  content: string;
  lines: string[];
}

export interface ScanOptions {
  target: string | string[];
  fileTypes: string[];
  excludePatterns?: string[];
}

/**
 * ファイルタイプを判定
 */
export const getFileType = (filePath: string): string => {
  const ext = path.extname(filePath).toLowerCase();
  return ext.substring(1); // .tsxを'tsx'に変換
};

/**
 * ファイルをスキャン
 */
export const scanFile = (filePath: string): ScanResult | null => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileType = getFileType(filePath);
    const lines = content.split('\n');

    return {
      filePath,
      fileType,
      content,
      lines,
    };
  } catch (error) {
    console.error(`Failed to read file: ${filePath}`, error);
    return null;
  }
};

/**
 * 複数ファイルをスキャン（glob対応）
 */
export const scanFiles = async (options: ScanOptions): Promise<ScanResult[]> => {
  const { target, fileTypes, excludePatterns = [] } = options;
  const targets = Array.isArray(target) ? target : [target];

  const results: ScanResult[] = [];

  for (const pattern of targets) {
    try {
      // glob検索
      const files = await glob(pattern, {
        ignore: [
          '**/node_modules/**',
          '**/.next/**',
          '**/dist/**',
          '**/.git/**',
          ...excludePatterns,
        ],
        absolute: true,
      });

      for (const file of files) {
        const fileType = getFileType(file);

        // ファイルタイプフィルタリング
        if (fileTypes.length > 0 && !fileTypes.includes(fileType)) {
          continue;
        }

        const scanResult = scanFile(file);
        if (scanResult) {
          results.push(scanResult);
        }
      }
    } catch (error) {
      console.error(`Failed to scan pattern: ${pattern}`, error);
    }
  }

  return results;
};

/**
 * TSX/JSXファイルから文字列リテラルを抽出
 */
export const extractStringsFromTSX = (content: string): string[] => {
  const strings: string[] = [];

  // シングルクォート文字列
  const singleQuoteMatches = content.match(/'([^'\\]|\\.)*'/g) || [];
  strings.push(...singleQuoteMatches.map(s => s.slice(1, -1)));

  // ダブルクォート文字列
  const doubleQuoteMatches = content.match(/"([^"\\]|\\.)*"/g) || [];
  strings.push(...doubleQuoteMatches.map(s => s.slice(1, -1)));

  // バッククォート（テンプレートリテラル）
  const templateMatches = content.match(/`([^`\\]|\\.)*`/g) || [];
  strings.push(...templateMatches.map(s => s.slice(1, -1)));

  // JSXテキストノード（タグ間のテキスト）
  const jsxTextMatches = content.match(/>([^<>{}]+)</g) || [];
  strings.push(
    ...jsxTextMatches
      .map(s => s.slice(1, -1).trim())
      .filter(s => s.length > 0 && !/^\s*$/.test(s))
  );

  return strings;
};

/**
 * JSONファイルから文字列値を抽出
 */
export const extractStringsFromJSON = (content: string): string[] => {
  try {
    const data = JSON.parse(content);
    const strings: string[] = [];

    const extractRecursive = (obj: any) => {
      if (typeof obj === 'string') {
        strings.push(obj);
      } else if (Array.isArray(obj)) {
        obj.forEach(extractRecursive);
      } else if (typeof obj === 'object' && obj !== null) {
        Object.values(obj).forEach(extractRecursive);
      }
    };

    extractRecursive(data);
    return strings;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return [];
  }
};

/**
 * Markdownファイルからテキストを抽出（コードブロックを除外）
 */
export const extractStringsFromMarkdown = (content: string): string[] => {
  // コードブロックを削除
  const withoutCodeBlocks = content.replace(/```[\s\S]*?```/g, '');
  const withoutInlineCode = withoutCodeBlocks.replace(/`[^`]+`/g, '');

  // 行ごとに分割
  return withoutInlineCode.split('\n').filter(line => line.trim().length > 0);
};
