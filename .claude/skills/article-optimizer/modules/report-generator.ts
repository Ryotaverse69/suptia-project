import type { OptimizationResult, BatchReport } from '../types';
import chalk from 'chalk';

export class ReportGenerator {
  async generateBatchReport(results: OptimizationResult[]): Promise<BatchReport> {
    const successful = results.filter(r => r.errors.length === 0);
    const failed = results.filter(r => r.errors.length > 0);

    const totalChanges = results.reduce((sum, r) => sum + r.changes.length, 0);
    const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

    const avgScoreImprovement = results.reduce((sum, r) => {
      return sum + (r.optimizedScore - r.originalScore);
    }, 0) / results.length;

    const summary = {
      total: results.length,
      success: successful.length,
      failed: failed.length,
      averageScoreImprovement: Math.round(avgScoreImprovement),
      totalChanges,
      totalWarnings,
      totalErrors,
      duration: totalDuration
    };

    // レポート表示
    const summaryText = this.formatSummary(summary, results);

    const recommendations: string[] = [];

    if (totalErrors > 0) {
      recommendations.push('エラーが発生したファイルを確認してください');
    }

    if (avgScoreImprovement < 10) {
      recommendations.push('記事の品質向上の余地があります。コンテンツの拡充を検討してください');
    }

    if (totalWarnings > 10) {
      recommendations.push('薬機法準拠の警告が多数あります。表現の見直しを推奨します');
    }

    return {
      summary: {
        ...summary,
        summaryText
      },
      details: results,
      recommendations
    };
  }

  private formatSummary(summary: any, results: OptimizationResult[]): string {
    const lines: string[] = [];

    lines.push(chalk.bold('📊 最適化バッチ処理サマリー'));
    lines.push(chalk.gray('='.repeat(50)));
    lines.push(`処理ファイル数: ${summary.total}`);
    lines.push(`成功: ${chalk.green(summary.success)}`);
    lines.push(`失敗: ${chalk.red(summary.failed)}`);
    lines.push(`平均スコア改善: ${summary.averageScoreImprovement}点`);
    lines.push(`総変更数: ${summary.totalChanges}`);
    lines.push(`警告: ${chalk.yellow(summary.totalWarnings)}`);
    lines.push(`エラー: ${chalk.red(summary.totalErrors)}`);
    lines.push(`処理時間: ${(summary.duration / 1000).toFixed(2)}秒`);

    lines.push('\n詳細:');
    results.forEach(result => {
      const status = result.errors.length === 0 ? '✅' : '❌';
      const improvement = result.optimizedScore - result.originalScore;
      lines.push(`  ${status} ${result.file}`);
      lines.push(`     スコア: ${result.originalScore} → ${result.optimizedScore} (+${improvement})`);
      lines.push(`     変更: ${result.changes.length}, 警告: ${result.warnings.length}`);
    });

    return lines.join('\n');
  }
}