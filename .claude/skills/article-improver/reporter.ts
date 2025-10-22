export function generateReport(results: {
  success: any[];
  failed: any[];
  improvements?: any[];
}): string {
  const total = results.success.length + results.failed.length;
  const successRate = ((results.success.length / total) * 100).toFixed(1);

  // グレード分布を計算
  const gradeDistribution = {
    S: 0,
    A: 0,
    B: 0,
    C: 0,
    D: 0
  };

  let totalScore = 0;
  for (const item of results.success) {
    if (item.grade) {
      gradeDistribution[item.grade as keyof typeof gradeDistribution]++;
    }
    totalScore += item.score || 0;
  }

  const avgScore = results.success.length > 0
    ? (totalScore / results.success.length).toFixed(1)
    : '0';

  // 改善点の集計
  const commonImprovements = new Map<string, number>();
  const commonIssues = new Map<string, number>();

  for (const item of results.success) {
    if (item.improvements) {
      for (const imp of item.improvements) {
        commonImprovements.set(imp, (commonImprovements.get(imp) || 0) + 1);
      }
    }
    if (item.issues) {
      for (const issue of item.issues) {
        const category = issue.split(':')[0];
        commonIssues.set(category, (commonIssues.get(category) || 0) + 1);
      }
    }
  }

  // レポート生成
  let report = `
╔══════════════════════════════════════════════════════════╗
║           📊 記事改善レポート                              ║
╚══════════════════════════════════════════════════════════╝

📈 全体統計
──────────────────────────────────────
  処理記事数: ${total}
  成功: ${results.success.length} (${successRate}%)
  失敗: ${results.failed.length}
  平均スコア: ${avgScore}/100

📊 グレード分布
──────────────────────────────────────
  S (90+): ${gradeDistribution.S}件
  A (80+): ${gradeDistribution.A}件
  B (70+): ${gradeDistribution.B}件
  C (60+): ${gradeDistribution.C}件
  D (<60): ${gradeDistribution.D}件

✅ 主な改善点
──────────────────────────────────────`;

  const topImprovements = Array.from(commonImprovements.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  for (const [improvement, count] of topImprovements) {
    report += `\n  • ${improvement} (${count}件)`;
  }

  if (commonIssues.size > 0) {
    report += `\n\n⚠️ 残存課題\n──────────────────────────────────────`;

    const topIssues = Array.from(commonIssues.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    for (const [issue, count] of topIssues) {
      report += `\n  • ${issue} (${count}件)`;
    }
  }

  // 成功した記事の詳細
  report += `\n\n📝 改善済み記事\n──────────────────────────────────────`;

  for (const item of results.success.slice(0, 10)) {
    report += `\n  ${item.file}: ${item.score}/100 (${item.grade})`;
  }

  if (results.success.length > 10) {
    report += `\n  ... 他 ${results.success.length - 10}件`;
  }

  // 失敗した記事
  if (results.failed.length > 0) {
    report += `\n\n❌ 処理失敗\n──────────────────────────────────────`;

    for (const item of results.failed) {
      report += `\n  ${item.file}: ${item.error}`;
    }
  }

  report += `\n\n══════════════════════════════════════════════════════════\n`;

  return report;
}