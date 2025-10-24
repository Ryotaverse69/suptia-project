/**
 * ロギングユーティリティ
 * 全Skillsで統一されたログ出力を提供
 */

import chalk from 'chalk';
import { promises as fs } from 'fs';
import path from 'path';

// ログレベル
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  SUCCESS = 2,
  WARNING = 3,
  ERROR = 4,
  CRITICAL = 5
}

// ログエントリの型
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  skill: string;
  message: string;
  data?: any;
  error?: Error;
  duration?: number;
}

// ログ設定
export interface LoggerConfig {
  level: LogLevel;
  colorize: boolean;
  writeToFile: boolean;
  logDir: string;
  maxFileSize: number;
  dateFormat: 'ISO' | 'locale';
  includeStack: boolean;
  skillName: string;
}

// デフォルト設定
const DEFAULT_CONFIG: LoggerConfig = {
  level: LogLevel.INFO,
  colorize: true,
  writeToFile: true,
  logDir: path.join(process.cwd(), '.claude/skills/logs'),
  maxFileSize: 10 * 1024 * 1024, // 10MB
  dateFormat: 'ISO',
  includeStack: process.env.NODE_ENV !== 'production',
  skillName: 'unknown'
};

/**
 * ロガークラス
 */
export class Logger {
  private config: LoggerConfig;
  private logBuffer: LogEntry[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  constructor(skillName: string, config?: Partial<LoggerConfig>) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      skillName
    };

    // ログディレクトリの作成
    this.ensureLogDir();

    // 定期的なフラッシュ
    if (this.config.writeToFile) {
      this.flushInterval = setInterval(() => this.flush(), 5000);
    }
  }

  /**
   * デバッグログ
   */
  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * 情報ログ
   */
  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * 成功ログ
   */
  success(message: string, data?: any): void {
    this.log(LogLevel.SUCCESS, message, data);
  }

  /**
   * 警告ログ
   */
  warn(message: string, data?: any): void {
    this.log(LogLevel.WARNING, message, data);
  }

  /**
   * エラーログ
   */
  error(message: string, error?: Error | string, data?: any): void {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    this.log(LogLevel.ERROR, message, data, errorObj);
  }

  /**
   * クリティカルエラー
   */
  critical(message: string, error?: Error, data?: any): void {
    this.log(LogLevel.CRITICAL, message, data, error);
    // クリティカルエラーは即座にフラッシュ
    this.flush();
  }

  /**
   * グループログの開始
   */
  group(title: string): void {
    if (this.config.colorize) {
      console.group(chalk.cyan.bold(`▶ ${title}`));
    } else {
      console.group(`▶ ${title}`);
    }
  }

  /**
   * グループログの終了
   */
  groupEnd(): void {
    console.groupEnd();
  }

  /**
   * プログレス表示
   */
  progress(current: number, total: number, message?: string): void {
    const percentage = Math.round((current / total) * 100);
    const progressBar = this.createProgressBar(percentage);
    const status = message || `処理中... ${current}/${total}`;

    if (this.config.colorize) {
      process.stdout.write(`\r${progressBar} ${chalk.gray(status)}`);
    } else {
      process.stdout.write(`\r${progressBar} ${status}`);
    }

    if (current >= total) {
      process.stdout.write('\n');
    }
  }

  /**
   * テーブル表示
   */
  table(data: any[], columns?: string[]): void {
    if (columns) {
      const filtered = data.map(row => {
        const newRow: any = {};
        columns.forEach(col => {
          if (col in row) {
            newRow[col] = row[col];
          }
        });
        return newRow;
      });
      console.table(filtered);
    } else {
      console.table(data);
    }
  }

  /**
   * 実行時間の計測
   */
  async measure<T>(
    label: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const start = Date.now();
    this.debug(`${label} 開始`);

    try {
      const result = await fn();
      const duration = Date.now() - start;
      this.success(`${label} 完了`, { duration: `${duration}ms` });
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.error(`${label} 失敗`, error as Error, { duration: `${duration}ms` });
      throw error;
    }
  }

  /**
   * ログの出力
   */
  private log(
    level: LogLevel,
    message: string,
    data?: any,
    error?: Error
  ): void {
    if (level < this.config.level) return;

    const entry: LogEntry = {
      timestamp: this.getTimestamp(),
      level,
      skill: this.config.skillName,
      message,
      data,
      error
    };

    // コンソール出力
    this.printToConsole(entry);

    // ファイル出力用バッファ
    if (this.config.writeToFile) {
      this.logBuffer.push(entry);
    }
  }

  /**
   * コンソールへの出力
   */
  private printToConsole(entry: LogEntry): void {
    const levelColors = {
      [LogLevel.DEBUG]: chalk.gray,
      [LogLevel.INFO]: chalk.blue,
      [LogLevel.SUCCESS]: chalk.green,
      [LogLevel.WARNING]: chalk.yellow,
      [LogLevel.ERROR]: chalk.red,
      [LogLevel.CRITICAL]: chalk.bgRed.white
    };

    const levelLabels = {
      [LogLevel.DEBUG]: 'DEBUG',
      [LogLevel.INFO]: 'INFO',
      [LogLevel.SUCCESS]: 'SUCCESS',
      [LogLevel.WARNING]: 'WARN',
      [LogLevel.ERROR]: 'ERROR',
      [LogLevel.CRITICAL]: 'CRITICAL'
    };

    const timestamp = chalk.gray(entry.timestamp);
    const skill = chalk.cyan(`[${entry.skill}]`);
    const level = levelColors[entry.level](levelLabels[entry.level].padEnd(8));
    const message = entry.message;

    if (this.config.colorize) {
      console.log(`${timestamp} ${skill} ${level} ${message}`);
    } else {
      console.log(`${entry.timestamp} [${entry.skill}] ${levelLabels[entry.level].padEnd(8)} ${message}`);
    }

    // データがある場合
    if (entry.data) {
      console.log(chalk.gray('  Data:'), entry.data);
    }

    // エラーがある場合
    if (entry.error) {
      console.log(chalk.red('  Error:'), entry.error.message);
      if (this.config.includeStack && entry.error.stack) {
        console.log(chalk.gray('  Stack:'));
        console.log(chalk.gray(entry.error.stack.split('\n').map(l => '    ' + l).join('\n')));
      }
    }
  }

  /**
   * プログレスバーの作成
   */
  private createProgressBar(percentage: number): string {
    const width = 30;
    const filled = Math.round((width * percentage) / 100);
    const empty = width - filled;

    const bar = '█'.repeat(filled) + '░'.repeat(empty);

    if (this.config.colorize) {
      const color = percentage < 30 ? chalk.red :
                   percentage < 70 ? chalk.yellow :
                   chalk.green;
      return `${color(bar)} ${percentage}%`;
    }

    return `${bar} ${percentage}%`;
  }

  /**
   * タイムスタンプの取得
   */
  private getTimestamp(): string {
    const now = new Date();
    return this.config.dateFormat === 'ISO'
      ? now.toISOString()
      : now.toLocaleString('ja-JP');
  }

  /**
   * ログディレクトリの確保
   */
  private async ensureLogDir(): Promise<void> {
    try {
      await fs.mkdir(this.config.logDir, { recursive: true });
    } catch (error) {
      console.error('ログディレクトリの作成に失敗:', error);
    }
  }

  /**
   * ログのフラッシュ
   */
  async flush(): Promise<void> {
    if (this.logBuffer.length === 0) return;

    const logFile = path.join(
      this.config.logDir,
      `${this.config.skillName}-${new Date().toISOString().split('T')[0]}.log`
    );

    try {
      // 既存ログの読み込み
      let existingLogs = '';
      try {
        existingLogs = await fs.readFile(logFile, 'utf-8');
      } catch {
        // ファイルが存在しない場合は無視
      }

      // 新しいログを追加
      const newLogs = this.logBuffer
        .map(entry => JSON.stringify(entry))
        .join('\n') + '\n';

      await fs.writeFile(logFile, existingLogs + newLogs);

      // バッファをクリア
      this.logBuffer = [];

      // ファイルサイズチェック
      const stats = await fs.stat(logFile);
      if (stats.size > this.config.maxFileSize) {
        await this.rotateLogFile(logFile);
      }

    } catch (error) {
      console.error('ログファイルへの書き込みに失敗:', error);
    }
  }

  /**
   * ログファイルのローテーション
   */
  private async rotateLogFile(logFile: string): Promise<void> {
    const timestamp = Date.now();
    const rotatedFile = logFile.replace('.log', `.${timestamp}.log`);

    await fs.rename(logFile, rotatedFile);

    // 古いログファイルを削除（30日以上前）
    const files = await fs.readdir(this.config.logDir);
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

    for (const file of files) {
      if (file.includes(this.config.skillName) && file.endsWith('.log')) {
        const filePath = path.join(this.config.logDir, file);
        const stats = await fs.stat(filePath);
        if (stats.mtime.getTime() < thirtyDaysAgo) {
          await fs.unlink(filePath);
        }
      }
    }
  }

  /**
   * クリーンアップ
   */
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flush();
    }
  }
}

// シングルトンインスタンス管理
const loggers = new Map<string, Logger>();

/**
 * ロガーインスタンスを取得
 */
export function getLogger(skillName: string, config?: Partial<LoggerConfig>): Logger {
  if (!loggers.has(skillName)) {
    loggers.set(skillName, new Logger(skillName, config));
  }
  return loggers.get(skillName)!;
}

// デフォルトエクスポート
export default { getLogger, LogLevel, Logger };