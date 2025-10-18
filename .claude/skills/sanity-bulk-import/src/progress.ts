/**
 * 進捗表示ユーティリティ
 * CLI用の進捗バー・スピナー・ログ出力
 */

import ora, { type Ora } from 'ora';
import chalk from 'chalk';

export class ProgressReporter {
  private spinner: Ora | null = null;
  private startTime: number = 0;
  private totalItems: number = 0;
  private processedItems: number = 0;

  constructor(private verbose: boolean = false) {}

  /**
   * 処理開始
   */
  start(message: string, total: number = 0): void {
    this.startTime = Date.now();
    this.totalItems = total;
    this.processedItems = 0;

    if (this.verbose) {
      console.log(chalk.blue(`🚀 ${message}`));
    } else {
      this.spinner = ora(message).start();
    }
  }

  /**
   * 進捗更新
   */
  update(message: string): void {
    this.processedItems++;

    const progress =
      this.totalItems > 0
        ? ` [${this.processedItems}/${this.totalItems}]`
        : ` [${this.processedItems}]`;

    if (this.verbose) {
      console.log(chalk.gray(`  ${message}${progress}`));
    } else if (this.spinner) {
      this.spinner.text = `${message}${progress}`;
    }
  }

  /**
   * 成功
   */
  succeed(message?: string): void {
    const elapsed = this.getElapsed();
    const finalMessage = message
      ? `${message} (${elapsed})`
      : `完了 (${elapsed})`;

    if (this.verbose) {
      console.log(chalk.green(`✅ ${finalMessage}`));
    } else if (this.spinner) {
      this.spinner.succeed(finalMessage);
    }
  }

  /**
   * 失敗
   */
  fail(message?: string): void {
    const elapsed = this.getElapsed();
    const finalMessage = message
      ? `${message} (${elapsed})`
      : `失敗 (${elapsed})`;

    if (this.verbose) {
      console.log(chalk.red(`❌ ${finalMessage}`));
    } else if (this.spinner) {
      this.spinner.fail(finalMessage);
    }
  }

  /**
   * 警告
   */
  warn(message: string): void {
    if (this.verbose) {
      console.log(chalk.yellow(`⚠️  ${message}`));
    } else if (this.spinner) {
      this.spinner.warn(message);
    } else {
      console.warn(chalk.yellow(`⚠️  ${message}`));
    }
  }

  /**
   * 情報
   */
  info(message: string): void {
    if (this.verbose) {
      console.log(chalk.cyan(`ℹ️  ${message}`));
    } else {
      console.log(chalk.cyan(`ℹ️  ${message}`));
    }
  }

  /**
   * デバッグ
   */
  debug(message: string): void {
    if (this.verbose) {
      console.log(chalk.gray(`🐛 ${message}`));
    }
  }

  /**
   * 停止
   */
  stop(): void {
    if (this.spinner) {
      this.spinner.stop();
    }
  }

  /**
   * 経過時間を取得
   */
  private getElapsed(): string {
    const elapsed = Date.now() - this.startTime;
    if (elapsed < 1000) {
      return `${elapsed}ms`;
    }
    return `${(elapsed / 1000).toFixed(2)}s`;
  }

  /**
   * 統計サマリーを表示
   */
  showStats(stats: {
    total: number;
    success: number;
    failed: number;
    skipped: number;
    created?: number;
    updated?: number;
  }): void {
    console.log('\n' + chalk.bold('📊 実行結果サマリー'));
    console.log(chalk.gray('─'.repeat(50)));

    console.log(
      `${chalk.blue('総ファイル数:')} ${stats.total}`
    );
    console.log(
      `${chalk.green('成功:')} ${stats.success} (${((stats.success / stats.total) * 100).toFixed(1)}%)`
    );

    if (stats.failed > 0) {
      console.log(
        `${chalk.red('失敗:')} ${stats.failed} (${((stats.failed / stats.total) * 100).toFixed(1)}%)`
      );
    }

    if (stats.skipped > 0) {
      console.log(
        `${chalk.yellow('スキップ:')} ${stats.skipped}`
      );
    }

    if (stats.created !== undefined) {
      console.log(
        `${chalk.cyan('作成:')} ${stats.created}`
      );
    }

    if (stats.updated !== undefined) {
      console.log(
        `${chalk.magenta('更新:')} ${stats.updated}`
      );
    }

    console.log(chalk.gray('─'.repeat(50)));
  }

  /**
   * テーブル形式で結果を表示
   */
  showTable(results: Array<{ file: string; status: string; action: string; error?: string }>): void {
    console.log('\n' + chalk.bold('📋 詳細結果'));
    console.log(chalk.gray('─'.repeat(80)));

    for (const result of results) {
      const statusIcon =
        result.status === 'success' ? chalk.green('✓') :
        result.status === 'failed' ? chalk.red('✗') :
        chalk.yellow('○');

      const actionText =
        result.action === 'created' ? chalk.cyan('作成') :
        result.action === 'updated' ? chalk.magenta('更新') :
        chalk.gray('スキップ');

      const fileName = result.file.split('/').pop() || result.file;

      console.log(
        `${statusIcon} ${fileName.padEnd(30)} ${actionText.padEnd(15)} ${result.error ? chalk.red(result.error) : ''}`
      );
    }

    console.log(chalk.gray('─'.repeat(80)));
  }
}

/**
 * エラーメッセージを整形
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * バイト数を人間が読みやすい形式に変換
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)}GB`;
}

/**
 * 時間を人間が読みやすい形式に変換
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60 * 1000) return `${(ms / 1000).toFixed(2)}s`;
  if (ms < 60 * 60 * 1000) return `${(ms / (60 * 1000)).toFixed(2)}分`;
  return `${(ms / (60 * 60 * 1000)).toFixed(2)}時間`;
}
