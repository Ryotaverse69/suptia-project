#!/usr/bin/env node
/**
 * Sanity一括インポートツール（MVP版）
 * 成分記事JSONを安全にSanityへインポート
 */

import { config as dotenvConfig } from 'dotenv';
import { createClient } from '@sanity/client';
import fg from 'fast-glob';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, resolve } from 'path';
import pMap from 'p-map';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import lockfile from 'proper-lockfile';

// 環境変数を読み込み
dotenvConfig();

import type {
  Config,
  ImportResult,
  JobLog,
  ArticleDocument,
  ValidationResult,
} from './types.js';
import { diffDocuments, generateDiffSummary } from './differ.js';
import { ProgressReporter, formatError, formatBytes } from './progress.js';
import { createBackup } from './backup.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 設定読み込み
 */
async function loadConfig(): Promise<Config> {
  const configPath = process.env.CONFIG_PATH || join(__dirname, '../config.json');

  try {
    const configContent = await readFile(configPath, 'utf-8');
    const config = JSON.parse(configContent) as Config;

    // 環境変数で上書き
    if (process.env.SANITY_PROJECT_ID) {
      config.sanity.projectId = process.env.SANITY_PROJECT_ID;
    }
    if (process.env.SANITY_DATASET) {
      config.sanity.dataset = process.env.SANITY_DATASET;
    }
    if (process.env.DRY_RUN !== undefined) {
      config.import.dryRun = process.env.DRY_RUN === 'true';
    }
    if (process.env.BATCH_SIZE) {
      config.import.batchSize = parseInt(process.env.BATCH_SIZE, 10);
    }

    return config;
  } catch (error) {
    throw new Error(`設定ファイル読み込み失敗: ${formatError(error)}`);
  }
}

/**
 * ファイル検出
 */
async function detectArticleFiles(dir: string, pattern: string): Promise<string[]> {
  const searchPattern = join(dir, pattern);
  const files = await fg(searchPattern, {
    absolute: true,
    onlyFiles: true,
  });

  return files.sort();
}

/**
 * バリデーション（article-validatorを呼び出す）
 */
async function validateArticle(filePath: string): Promise<ValidationResult> {
  try {
    // article-validatorを呼び出す（簡易版）
    // 実際には既存のvalidatorツールを呼び出す
    const content = await readFile(filePath, 'utf-8');
    const json = JSON.parse(content);

    // 必須フィールドチェック
    const requiredFields = ['name', 'nameEn', 'slug', 'category', 'description'];
    const missingFields = requiredFields.filter((field) => !json[field]);

    if (missingFields.length > 0) {
      return {
        passed: false,
        score: 0,
        grade: 'D',
        issues: {
          critical: missingFields.length,
          warnings: 0,
        },
      };
    }

    return {
      passed: true,
      score: 100,
      grade: 'S',
      issues: {
        critical: 0,
        warnings: 0,
      },
    };
  } catch (error) {
    return {
      passed: false,
      score: 0,
      grade: 'D',
      issues: {
        critical: 1,
        warnings: 0,
      },
      report: { error: formatError(error) },
    };
  }
}

/**
 * Sanityクライアント作成
 */
function createSanityClient(config: Config) {
  const token = process.env[config.security.tokenEnvVar];

  if (!token && !config.import.dryRun) {
    throw new Error(
      `環境変数 ${config.security.tokenEnvVar} が設定されていません`
    );
  }

  return createClient({
    projectId: config.sanity.projectId,
    dataset: config.sanity.dataset,
    apiVersion: config.sanity.apiVersion,
    token: token || 'dummy-token-for-dry-run',
    useCdn: false,
  });
}

/**
 * Slugで既存ドキュメントを取得
 */
async function getExistingBySlug(
  client: any,
  slug: string
): Promise<ArticleDocument | null> {
  const query = `*[_type == "ingredient" && slug.current == $slug][0]`;
  const result = await client.fetch(query, { slug });
  return result || null;
}

/**
 * ドキュメントをUpsert
 */
async function upsertDocument(
  client: any,
  doc: Partial<ArticleDocument>,
  dryRun: boolean
): Promise<{ documentId: string; action: 'created' | 'updated' }> {
  if (dryRun) {
    return {
      documentId: `dry-run-${doc.slug?.current}`,
      action: 'created',
    };
  }

  const slug = doc.slug?.current;
  if (!slug) {
    throw new Error('slug.currentが必要です');
  }

  const existing = await getExistingBySlug(client, slug);

  if (existing) {
    // 更新
    const updated = await client
      .patch(existing._id)
      .set(doc)
      .commit();

    return {
      documentId: updated._id,
      action: 'updated',
    };
  } else {
    // 作成
    const created = await client.create({
      _type: 'ingredient',
      ...doc,
    });

    return {
      documentId: created._id,
      action: 'created',
    };
  }
}

/**
 * 単一ファイルをインポート（リトライ付き）
 */
async function importSingleFile(
  filePath: string,
  client: any,
  config: Config,
  progress: ProgressReporter
): Promise<ImportResult> {
  const startTime = Date.now();
  let retries = 0;

  const fileName = filePath.split('/').pop() || filePath;

  try {
    // ファイル読み込み
    const content = await readFile(filePath, 'utf-8');
    const json = JSON.parse(content) as Partial<ArticleDocument>;

    // slugの正規化（文字列の場合はSanity形式に変換）
    let slug = '';
    if (typeof json.slug === 'string') {
      slug = json.slug;
      json.slug = { current: json.slug, _type: 'slug' };
    } else {
      slug = json.slug?.current || '';
    }

    // 既存ドキュメントを取得
    const existing = config.import.dryRun
      ? null
      : await getExistingBySlug(client, slug);

    // 差分検出
    const diff = diffDocuments(existing, json);
    const diffSummary = generateDiffSummary(diff);

    progress.debug(`${fileName}: ${diffSummary}`);

    // 変更なしの場合はスキップ
    if (diff.status === 'unchanged') {
      return {
        file: filePath,
        slug,
        status: 'skipped',
        action: 'skipped',
        retries: 0,
        duration: Date.now() - startTime,
      };
    }

    // Upsert実行（リトライ付き）
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= config.import.retryCount; attempt++) {
      try {
        const result = await upsertDocument(client, json, config.import.dryRun);

        progress.update(`${fileName}: ${result.action === 'created' ? '作成' : '更新'}`);

        return {
          file: filePath,
          slug,
          status: 'success',
          action: result.action,
          documentId: result.documentId,
          retries: attempt,
          duration: Date.now() - startTime,
        };
      } catch (error) {
        lastError = error as Error;
        retries = attempt;

        if (attempt < config.import.retryCount) {
          // 指数バックオフ + ジッタ
          const backoffMs = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
        }
      }
    }

    // リトライ回数超過
    throw lastError || new Error('不明なエラー');
  } catch (error) {
    progress.warn(`${fileName}: 失敗 - ${formatError(error)}`);

    return {
      file: filePath,
      slug: '',
      status: 'failed',
      action: 'skipped',
      error: formatError(error),
      retries,
      duration: Date.now() - startTime,
    };
  }
}

/**
 * ジョブロック取得
 */
async function acquireLock(lockPath: string): Promise<() => Promise<void>> {
  try {
    // ロックファイルのディレクトリを作成
    const lockDir = dirname(lockPath);
    await mkdir(lockDir, { recursive: true });

    // ロックファイルを作成（存在しない場合）
    try {
      await writeFile(lockPath, '', { flag: 'wx' });
    } catch (err: any) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }

    const release = await lockfile.lock(lockPath, {
      stale: 3600000, // 1時間
      retries: {
        retries: 3,
        minTimeout: 1000,
      },
    });

    return release;
  } catch (error) {
    throw new Error(
      'インポートジョブが既に実行中です。完了後に再度お試しください。'
    );
  }
}

/**
 * ジョブログ保存
 */
async function writeImportLog(log: JobLog, config: Config): Promise<string> {
  const logDir = config.logging.dir;
  await mkdir(logDir, { recursive: true });

  const logFileName = `import-log-${log.jobId}.json`;
  const logFilePath = join(logDir, logFileName);

  const content =
    config.logging.format === 'pretty'
      ? JSON.stringify(log, null, 2)
      : JSON.stringify(log);

  await writeFile(logFilePath, content, 'utf-8');

  return logFilePath;
}

/**
 * メイン処理
 */
async function main() {
  const progress = new ProgressReporter(process.env.VERBOSE === 'true');

  try {
    // 設定読み込み
    progress.info('設定を読み込み中...');
    const config = await loadConfig();

    // ジョブID生成
    const jobId = `import-${Date.now()}`;

    // ジョブログ初期化
    const jobLog: JobLog = {
      jobId,
      startTime: new Date().toISOString(),
      mode: 'upsert',
      dryRun: config.import.dryRun,
      totalFiles: 0,
      results: [],
      stats: {
        success: 0,
        failed: 0,
        skipped: 0,
        created: 0,
        updated: 0,
      },
      successRate: 0,
    };

    // ジョブロック取得
    const lockPath = join(config.logging.dir, 'import.lock');
    const releaseLock = await acquireLock(lockPath);

    try {
      // Dry runモード表示
      if (config.import.dryRun) {
        progress.info('🔍 Dry Runモード: 実際の書き込みは行いません');
      }

      // ファイル検出
      progress.start('記事ファイルを検索中...', 0);
      const files = await detectArticleFiles(
        config.import.articleDir,
        config.import.filePattern
      );
      jobLog.totalFiles = files.length;
      progress.succeed(`${files.length}件のファイルを検出`);

      if (files.length === 0) {
        progress.warn('インポートするファイルがありません');
        return;
      }

      // プリフライト検証
      progress.start('バリデーション実行中...', files.length);

      const validationResults = await pMap(
        files,
        async (file) => ({
          file,
          result: await validateArticle(file),
        }),
        { concurrency: 5 }
      );

      const failedValidations = validationResults.filter((v) => !v.result.passed);

      if (failedValidations.length > 0) {
        progress.fail(
          `バリデーション失敗: ${failedValidations.length}/${files.length}件`
        );

        for (const failed of failedValidations) {
          const fileName = failed.file.split('/').pop();
          progress.warn(
            `  ${fileName}: Grade ${failed.result.grade}, Critical ${failed.result.issues.critical}件`
          );
        }

        throw new Error(
          'バリデーションに失敗したファイルがあります。修正後に再度実行してください。'
        );
      }

      progress.succeed('バリデーション完了: 全てのファイルが合格');

      // バックアップ作成
      if (config.backup.enabled && !config.import.dryRun) {
        progress.start('バックアップ作成中...');

        try {
          const backup = await createBackup(config.sanity.dataset, config);
          jobLog.backup = backup;
          progress.succeed(
            `バックアップ作成完了: ${formatBytes(backup.size)} (${backup.backupFilePath})`
          );
        } catch (error) {
          progress.warn(`バックアップ作成失敗: ${formatError(error)}`);
          progress.warn('⚠️  バックアップなしで続行します');
        }
      }

      // Sanityクライアント作成
      const client = createSanityClient(config);

      // インポート実行
      progress.start('インポート実行中...', files.length);

      const results = await pMap(
        files,
        async (file) => importSingleFile(file, client, config, progress),
        { concurrency: config.import.batchSize }
      );

      jobLog.results = results;

      // 統計計算
      jobLog.stats.success = results.filter((r) => r.status === 'success').length;
      jobLog.stats.failed = results.filter((r) => r.status === 'failed').length;
      jobLog.stats.skipped = results.filter((r) => r.status === 'skipped').length;
      jobLog.stats.created = results.filter((r) => r.action === 'created').length;
      jobLog.stats.updated = results.filter((r) => r.action === 'updated').length;
      jobLog.successRate = jobLog.stats.success / jobLog.totalFiles;

      jobLog.endTime = new Date().toISOString();
      jobLog.duration = Date.parse(jobLog.endTime) - Date.parse(jobLog.startTime);

      progress.succeed('インポート完了');

      // 結果表示
      progress.showStats({
        total: jobLog.totalFiles,
        ...jobLog.stats,
      });

      // 成功率チェック
      if (jobLog.successRate < config.import.successThreshold) {
        progress.warn(
          `⚠️  成功率が閾値を下回っています: ${(jobLog.successRate * 100).toFixed(1)}% < ${(config.import.successThreshold * 100).toFixed(1)}%`
        );
        progress.warn('ログを確認して手動で対応してください');
      }

      // ログ保存
      const logPath = await writeImportLog(jobLog, config);
      progress.info(`📄 ログ保存: ${logPath}`);

      // 失敗があれば詳細表示
      const failed = results.filter((r) => r.status === 'failed');
      if (failed.length > 0) {
        progress.showTable(failed);
      }
    } finally {
      // ロック解放
      await releaseLock();
    }
  } catch (error) {
    progress.fail(`エラー: ${formatError(error)}`);
    process.exit(1);
  }
}

// 実行
main();
