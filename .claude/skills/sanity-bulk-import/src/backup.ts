/**
 * バックアップモジュール
 * Sanityデータセットのエクスポートとバックアップ保存
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { createHash } from 'crypto';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';
import type { BackupResult, Config } from './types.js';

const execAsync = promisify(exec);

/**
 * Sanityデータセットのバックアップを作成
 */
export async function createBackup(
  dataset: string,
  config: Config
): Promise<BackupResult> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = config.logging.dir || 'logs';
  const backupFileName = `backup-${dataset}-${timestamp}.ndjson`;
  const backupFilePath = join(backupDir, backupFileName);

  try {
    // Sanity dataset exportコマンドを実行
    const exportCommand = `npx sanity dataset export ${dataset} ${backupFilePath}`;

    await execAsync(exportCommand, {
      timeout: 300000, // 5分
      maxBuffer: 50 * 1024 * 1024, // 50MB
    });

    // ファイルの存在とサイズを確認
    const fileStats = await stat(backupFilePath);

    // SHA-256ハッシュを計算
    const fileContent = await readFile(backupFilePath);
    const sha256 = createHash('sha256').update(fileContent).digest('hex');

    const result: BackupResult = {
      backupFilePath,
      sha256,
      timestamp,
      size: fileStats.size,
    };

    // S3へのアップロード（オプション）
    if (config.backup.enabled && config.backup.s3Bucket) {
      try {
        const s3Url = await uploadToS3(
          backupFilePath,
          config.backup.s3Bucket,
          config.backup.s3Region || 'ap-northeast-1',
          config.security.encryptBackups
        );
        result.s3Url = s3Url;
      } catch (s3Error) {
        console.warn('⚠️  S3アップロード失敗（ローカルバックアップは保存済み）:', s3Error);
      }
    }

    return result;
  } catch (error) {
    throw new Error(`バックアップ作成失敗: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * S3にバックアップをアップロード
 * MVP版では実装をスタブ化（将来実装）
 */
async function uploadToS3(
  filePath: string,
  bucket: string,
  region: string,
  encrypt: boolean
): Promise<string> {
  // TODO: AWS SDK v3を使用してS3にアップロード
  // 現在はスタブ実装

  const fileName = filePath.split('/').pop() || 'backup.ndjson';
  const s3Url = `s3://${bucket}/${fileName}`;

  // MVP版では実際のアップロードを行わない
  console.warn('⚠️  S3アップロードはMVP版では未実装です。ローカルバックアップを使用してください。');

  return s3Url;
}

/**
 * バックアップからリストア（将来実装）
 * 安全のため、MVP版では手動リストアのみ推奨
 */
export async function restoreFromBackup(
  backupFilePath: string,
  dataset: string
): Promise<void> {
  // MVP版では自動リストアを提供しない
  throw new Error(
    'MVP版では自動リストアは提供されません。手動で以下のコマンドを実行してください:\n' +
    `npx sanity dataset import ${backupFilePath} ${dataset} --replace`
  );
}

/**
 * バックアップファイルの検証
 */
export async function verifyBackup(
  backupFilePath: string,
  expectedSha256?: string
): Promise<boolean> {
  try {
    const fileContent = await readFile(backupFilePath);
    const actualSha256 = createHash('sha256').update(fileContent).digest('hex');

    if (expectedSha256) {
      return actualSha256 === expectedSha256;
    }

    // SHA-256のみを検証（ファイルが読めればOK）
    return actualSha256.length === 64;
  } catch (error) {
    return false;
  }
}

/**
 * 古いバックアップファイルをクリーンアップ
 */
export async function cleanupOldBackups(
  backupDir: string,
  retentionDays: number
): Promise<number> {
  // TODO: retentionDaysより古いバックアップを削除
  // MVP版ではスタブ実装
  console.warn(`⚠️  バックアップクリーンアップは未実装です。${backupDir} を手動で管理してください。`);
  return 0;
}
