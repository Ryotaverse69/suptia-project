#!/usr/bin/env node

/**
 * パーセンタイル計算関数のテストスクリプト
 *
 * Bessel補正付きパーセンタイル計算の精度を検証します。
 */

/**
 * パーセンタイルを計算（外れ値に強いTrimmed Percentile + Bessel補正）
 */
function calculatePercentile(value, values, lowerIsBetter = false, trimPercent = 5) {
  if (values.length === 0) return 50;

  const sortedValues = [...values].sort((a, b) => a - b);

  // 外れ値除外（データ数が10件以上の場合のみ）
  let trimmedValues = sortedValues;
  if (sortedValues.length >= 10) {
    const trimCount = Math.floor(sortedValues.length * (trimPercent / 100));
    if (trimCount > 0) {
      trimmedValues = sortedValues.slice(trimCount, sortedValues.length - trimCount);
    }
  }

  const N = trimmedValues.length;

  // 厳密な順位計算（平均順位方式 - Bessel補正）
  const sameValues = trimmedValues.filter(v => v === value);
  const lowerCount = trimmedValues.filter(v => v < value).length;

  // 同じ値がある場合、その範囲の中央順位を使用
  const rank = lowerCount + (sameValues.length + 1) / 2;

  // Bessel補正: (R - 1) / (N - 1) * 100
  const percentile = N === 1 ? 50 : ((rank - 1) / (N - 1)) * 100;

  return lowerIsBetter ? 100 - percentile : percentile;
}

// テストケース定義
const testCases = [
  {
    name: "重複値なし（基本ケース）",
    values: [100, 200, 300, 400, 500],
    testValue: 300,
    lowerIsBetter: false,
    expected: 50, // 中央値なので50%
    description: "5件中3番目（中央）→ 50%"
  },
  {
    name: "重複値あり（3件同じ）",
    values: [100, 200, 200, 200, 300],
    testValue: 200,
    lowerIsBetter: false,
    expected: 50, // 中央値
    description: "同じ値3件の中央順位 → 50%"
  },
  {
    name: "最小値",
    values: [100, 200, 300, 400, 500],
    testValue: 100,
    lowerIsBetter: false,
    expected: 0,
    description: "最小値 → 0%"
  },
  {
    name: "最大値",
    values: [100, 200, 300, 400, 500],
    testValue: 500,
    lowerIsBetter: false,
    expected: 100,
    description: "最大値 → 100%"
  },
  {
    name: "価格比較（低い方が良い）",
    values: [500, 800, 1000, 1200, 1500],
    testValue: 500,
    lowerIsBetter: true,
    expected: 100, // 最安値なので100%
    description: "最安値 → 100%（lowerIsBetter=true）"
  },
  {
    name: "価格比較（高い方が悪い）",
    values: [500, 800, 1000, 1200, 1500],
    testValue: 1500,
    lowerIsBetter: true,
    expected: 0, // 最高値なので0%
    description: "最高値 → 0%（lowerIsBetter=true）"
  },
  {
    name: "外れ値除外テスト（10件以上）",
    values: [100, 200, 300, 400, 500, 600, 700, 800, 900, 10000], // 最後が外れ値
    testValue: 500,
    lowerIsBetter: false,
    expected: null, // 手計算で確認
    description: "10件中5番目、外れ値除外後の位置を確認"
  },
  {
    name: "同じ価格が複数（実際のケース）",
    values: [398, 398, 398, 450, 500],
    testValue: 398,
    lowerIsBetter: true,
    expected: null, // 計算確認
    description: "同じ最安値が3件の場合"
  },
  {
    name: "単一値",
    values: [100],
    testValue: 100,
    lowerIsBetter: false,
    expected: 50,
    description: "1件のみ → 常に50%（中央値）"
  },
  {
    name: "2件（最小）",
    values: [100, 200],
    testValue: 100,
    lowerIsBetter: false,
    expected: 0,
    description: "2件中最小 → 0%"
  },
  {
    name: "2件（最大）",
    values: [100, 200],
    testValue: 200,
    lowerIsBetter: false,
    expected: 100,
    description: "2件中最大 → 100%"
  },
];

// テスト実行
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 パーセンタイル計算テスト');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

let passedTests = 0;
let failedTests = 0;

for (const testCase of testCases) {
  const result = calculatePercentile(
    testCase.testValue,
    testCase.values,
    testCase.lowerIsBetter
  );

  console.log(`【${testCase.name}】`);
  console.log(`  データ: [${testCase.values.join(', ')}]`);
  console.log(`  対象値: ${testCase.testValue}`);
  console.log(`  lowerIsBetter: ${testCase.lowerIsBetter}`);
  console.log(`  結果: ${result.toFixed(2)}%`);

  if (testCase.expected !== null) {
    const tolerance = 0.1; // 許容誤差
    const isPassed = Math.abs(result - testCase.expected) < tolerance;

    if (isPassed) {
      console.log(`  ✅ 期待値: ${testCase.expected}% - PASS`);
      passedTests++;
    } else {
      console.log(`  ❌ 期待値: ${testCase.expected}% - FAIL（差: ${Math.abs(result - testCase.expected).toFixed(2)}%）`);
      failedTests++;
    }
  } else {
    console.log(`  ℹ️ 手動確認: ${testCase.description}`);
  }

  console.log('');
}

// 詳細計算例の表示
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔍 詳細計算例（重複値ケース）');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const exampleValues = [100, 200, 200, 200, 300];
const exampleValue = 200;

console.log(`データ: [${exampleValues.join(', ')}]`);
console.log(`対象値: ${exampleValue}\n`);

const sorted = [...exampleValues].sort((a, b) => a - b);
console.log(`1. ソート後: [${sorted.join(', ')}]`);

const sameValues = sorted.filter(v => v === exampleValue);
console.log(`2. 同じ値の数: ${sameValues.length}件（${exampleValue}）`);

const lowerCount = sorted.filter(v => v < exampleValue).length;
console.log(`3. より小さい値の数: ${lowerCount}件`);

const rank = lowerCount + (sameValues.length + 1) / 2;
console.log(`4. 平均順位: ${lowerCount} + (${sameValues.length} + 1) / 2 = ${rank}`);

const N = sorted.length;
const percentile = ((rank - 1) / (N - 1)) * 100;
console.log(`5. パーセンタイル: (${rank} - 1) / (${N} - 1) × 100 = ${percentile.toFixed(2)}%\n`);

// 実際のビタミンC価格データでのシミュレーション
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('💊 実際の商品データシミュレーション（ビタミンC）');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const vitaminCPrices = [398, 398, 398, 450, 480, 500, 550, 600, 650, 700, 800, 1000, 1200, 1500, 2000];
const dhcPrice = 398;

const dhcPercentile = calculatePercentile(dhcPrice, vitaminCPrices, true);
console.log(`DHC ビタミンC（¥${dhcPrice}）:`);
console.log(`  全${vitaminCPrices.length}商品中のパーセンタイル: ${dhcPercentile.toFixed(2)}%`);
console.log(`  解釈: 上位${(100 - dhcPercentile).toFixed(0)}%の安さ（最安値級）\n`);

const midPrice = 700;
const midPercentile = calculatePercentile(midPrice, vitaminCPrices, true);
console.log(`中価格帯の商品（¥${midPrice}）:`);
console.log(`  全${vitaminCPrices.length}商品中のパーセンタイル: ${midPercentile.toFixed(2)}%`);
console.log(`  解釈: 上位${(100 - midPercentile).toFixed(0)}%の安さ（標準的）\n`);

const highPrice = 2000;
const highPercentile = calculatePercentile(highPrice, vitaminCPrices, true);
console.log(`高価格帯の商品（¥${highPrice}）:`);
console.log(`  全${vitaminCPrices.length}商品中のパーセンタイル: ${highPercentile.toFixed(2)}%`);
console.log(`  解釈: 上位${(100 - highPercentile).toFixed(0)}%の安さ（高価格）\n`);

// ランク変換のシミュレーション
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🏆 ランク変換シミュレーション');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

function scoreToRank(score) {
  if (score >= 90) return 'S';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  return 'D';
}

const rankExamples = [
  { price: 398, percentile: dhcPercentile },
  { price: 700, percentile: midPercentile },
  { price: 2000, percentile: highPercentile },
];

rankExamples.forEach(example => {
  const rank = scoreToRank(example.percentile);
  console.log(`¥${example.price}: パーセンタイル ${example.percentile.toFixed(2)}% → ランク【${rank}】`);
});

console.log('');

// サマリー
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 テスト結果サマリー');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log(`✅ 合格: ${passedTests}件`);
console.log(`❌ 不合格: ${failedTests}件`);
console.log(`合計: ${passedTests + failedTests}件\n`);

if (failedTests === 0) {
  console.log('🎉 すべてのテストに合格しました！');
} else {
  console.log('⚠️ 一部のテストが失敗しました。関数の実装を確認してください。');
  process.exit(1);
}
