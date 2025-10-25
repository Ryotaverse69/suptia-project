#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { getLogger } from '../common/logger';

const logger = getLogger('price-calculator');

// 商品データの型定義
interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  currency: string;
  quantity: number; // パッケージ内の数量（カプセル数など）
  servingSize: number; // 1回の摂取量
  ingredients: Ingredient[];
  source?: string; // Amazon, 楽天など
  url?: string;
  lastUpdated?: string;
}

interface Ingredient {
  name: string;
  nameEn?: string;
  amount: number;
  unit: string;
  perServing?: boolean; // 1回分あたりの量か、1カプセルあたりか
}

interface PriceAnalysis {
  product: Product;
  metrics: {
    pricePerServing: number; // 1回分の価格
    pricePerDay: number; // 1日あたりの価格
    pricePerMonth: number; // 1ヶ月あたりの価格
    daysSupply: number; // 何日分か
    costPerMg: Map<string, number>; // 成分ごとのmg単価
    normalizedCost: number; // 正規化コスト（主要成分ベース）
    valueScore: number; // コストパフォーマンススコア（0-100）
  };
  insights: string[];
}

interface ComparisonResult {
  ingredient: string;
  products: Array<{
    product: Product;
    costPerMg: number;
    dailyCost: number;
    amount: number;
    unit: string;
  }>;
  bestValue: {
    product: Product;
    savings: number; // 最安値との差額
    savingsPercent: number;
  };
}

interface CostReport {
  summary: {
    totalProducts: number;
    averageDailyCost: number;
    medianDailyCost: number;
    priceRange: {
      min: number;
      max: number;
    };
    topValue: Product[];
    insights: string[];
  };
  byIngredient: Map<string, ComparisonResult>;
  byBrand: Map<string, BrandAnalysis>;
  recommendations: string[];
}

interface BrandAnalysis {
  brand: string;
  productCount: number;
  averagePrice: number;
  averageValueScore: number;
  pricePositioning: 'premium' | 'mid-range' | 'budget';
}

// 推奨摂取量データ（ハードコード、実際はDBから取得）
const RECOMMENDED_DAILY_AMOUNTS: Map<string, { min: number; max: number; unit: string }> = new Map([
  ['vitamin-c', { min: 100, max: 2000, unit: 'mg' }],
  ['vitamin-d', { min: 15, max: 100, unit: 'μg' }],
  ['vitamin-e', { min: 15, max: 1000, unit: 'mg' }],
  ['vitamin-b12', { min: 2.4, max: 2500, unit: 'μg' }],
  ['omega-3', { min: 250, max: 3000, unit: 'mg' }],
  ['magnesium', { min: 320, max: 420, unit: 'mg' }],
  ['zinc', { min: 8, max: 40, unit: 'mg' }],
  ['iron', { min: 8, max: 45, unit: 'mg' }],
  ['calcium', { min: 1000, max: 2500, unit: 'mg' }],
  ['probiotics', { min: 1, max: 100, unit: 'billion CFU' }]
]);

class PriceCalculator {
  private spinner: ora.Ora;
  private exchangeRates: Map<string, number>;

  constructor() {
    this.spinner = ora();
    // 為替レート（実際はAPIから取得）
    this.exchangeRates = new Map([
      ['USD', 150],
      ['EUR', 160],
      ['GBP', 185],
      ['JPY', 1]
    ]);
  }

  /**
   * 商品の価格分析
   */
  async analyze(product: Product): Promise<PriceAnalysis> {
    logger.info(`商品分析開始: ${product.name}`);

    // 基本メトリクス計算
    const priceInJPY = this.convertToJPY(product.price, product.currency);
    const servingsPerPackage = product.quantity / product.servingSize;
    const pricePerServing = priceInJPY / servingsPerPackage;

    // 1日あたりの摂取回数（仮定: 1日1回）
    const servingsPerDay = 1;
    const pricePerDay = pricePerServing * servingsPerDay;
    const pricePerMonth = pricePerDay * 30;
    const daysSupply = servingsPerPackage / servingsPerDay;

    // mg単価計算
    const costPerMg = new Map<string, number>();
    for (const ingredient of product.ingredients) {
      const totalAmount = this.normalizeToMg(ingredient.amount, ingredient.unit);
      const totalIngredientAmount = totalAmount * servingsPerPackage;
      const costPerMgValue = priceInJPY / totalIngredientAmount;
      costPerMg.set(ingredient.name, costPerMgValue);
    }

    // 正規化コスト（主要成分ベース）
    const normalizedCost = this.calculateNormalizedCost(product, pricePerDay);

    // バリュースコア計算
    const valueScore = this.calculateValueScore(product, costPerMg, normalizedCost);

    // インサイト生成
    const insights = this.generateInsights(product, {
      pricePerServing,
      pricePerDay,
      pricePerMonth,
      daysSupply,
      costPerMg,
      normalizedCost,
      valueScore
    });

    return {
      product,
      metrics: {
        pricePerServing,
        pricePerDay,
        pricePerMonth,
        daysSupply,
        costPerMg,
        normalizedCost,
        valueScore
      },
      insights
    };
  }

  /**
   * 複数商品の比較
   */
  async compare(
    products: Product[],
    targetIngredient: string
  ): Promise<ComparisonResult> {
    logger.info(`成分比較: ${targetIngredient}`);

    const comparison: ComparisonResult = {
      ingredient: targetIngredient,
      products: [],
      bestValue: null as any
    };

    for (const product of products) {
      const ingredient = product.ingredients.find(
        i => i.name === targetIngredient || i.nameEn === targetIngredient
      );

      if (ingredient) {
        const analysis = await this.analyze(product);
        const costPerMg = analysis.metrics.costPerMg.get(ingredient.name) || 0;

        comparison.products.push({
          product,
          costPerMg,
          dailyCost: analysis.metrics.pricePerDay,
          amount: ingredient.amount,
          unit: ingredient.unit
        });
      }
    }

    // 最安値を特定
    if (comparison.products.length > 0) {
      comparison.products.sort((a, b) => a.costPerMg - b.costPerMg);
      const bestProduct = comparison.products[0];
      const worstProduct = comparison.products[comparison.products.length - 1];

      comparison.bestValue = {
        product: bestProduct.product,
        savings: worstProduct.dailyCost - bestProduct.dailyCost,
        savingsPercent: ((worstProduct.dailyCost - bestProduct.dailyCost) / worstProduct.dailyCost) * 100
      };
    }

    return comparison;
  }

  /**
   * 完全なコストレポート生成
   */
  async generateReport(products: Product[]): Promise<CostReport> {
    logger.info(`レポート生成: ${products.length}商品`);

    const analyses: PriceAnalysis[] = [];
    const byIngredient = new Map<string, ComparisonResult>();
    const byBrand = new Map<string, BrandAnalysis>();

    // 全商品を分析
    for (const product of products) {
      const analysis = await this.analyze(product);
      analyses.push(analysis);
    }

    // 成分ごとの比較
    const allIngredients = new Set<string>();
    products.forEach(p => p.ingredients.forEach(i => allIngredients.add(i.name)));

    for (const ingredient of allIngredients) {
      const comparison = await this.compare(products, ingredient);
      if (comparison.products.length > 0) {
        byIngredient.set(ingredient, comparison);
      }
    }

    // ブランドごとの分析
    const brandGroups = this.groupByBrand(products);
    for (const [brand, brandProducts] of brandGroups) {
      const brandAnalyses = await Promise.all(
        brandProducts.map(p => this.analyze(p))
      );

      const averagePrice = brandAnalyses.reduce((sum, a) => sum + a.metrics.pricePerDay, 0) / brandAnalyses.length;
      const averageValueScore = brandAnalyses.reduce((sum, a) => sum + a.metrics.valueScore, 0) / brandAnalyses.length;

      byBrand.set(brand, {
        brand,
        productCount: brandProducts.length,
        averagePrice,
        averageValueScore,
        pricePositioning: this.determinePricePositioning(averagePrice)
      });
    }

    // サマリー計算
    const dailyCosts = analyses.map(a => a.metrics.pricePerDay);
    const summary = {
      totalProducts: products.length,
      averageDailyCost: dailyCosts.reduce((a, b) => a + b, 0) / dailyCosts.length,
      medianDailyCost: this.median(dailyCosts),
      priceRange: {
        min: Math.min(...dailyCosts),
        max: Math.max(...dailyCosts)
      },
      topValue: analyses
        .sort((a, b) => b.metrics.valueScore - a.metrics.valueScore)
        .slice(0, 5)
        .map(a => a.product),
      insights: this.generateReportInsights(analyses, byIngredient, byBrand)
    };

    // 推奨事項の生成
    const recommendations = this.generateRecommendations(summary, byIngredient, byBrand);

    return {
      summary,
      byIngredient,
      byBrand,
      recommendations
    };
  }

  /**
   * 通貨を日本円に変換
   */
  private convertToJPY(amount: number, currency: string): number {
    const rate = this.exchangeRates.get(currency) || 1;
    return amount * rate;
  }

  /**
   * 単位をmgに正規化
   */
  private normalizeToMg(amount: number, unit: string): number {
    const conversions: Record<string, number> = {
      'g': 1000,
      'mg': 1,
      'μg': 0.001,
      'mcg': 0.001,
      'IU': 0.025, // ビタミンDの場合
      'billion CFU': 1000 // プロバイオティクス（仮定）
    };

    return amount * (conversions[unit] || 1);
  }

  /**
   * 正規化コスト計算（推奨摂取量ベース）
   */
  private calculateNormalizedCost(product: Product, dailyCost: number): number {
    let totalNormalizedValue = 0;
    let ingredientCount = 0;

    for (const ingredient of product.ingredients) {
      const recommended = RECOMMENDED_DAILY_AMOUNTS.get(
        ingredient.name.toLowerCase().replace(/\s+/g, '-')
      );

      if (recommended) {
        const normalizedAmount = this.normalizeToMg(ingredient.amount, ingredient.unit);
        const recommendedAmount = this.normalizeToMg(recommended.min, recommended.unit);
        const ratio = Math.min(normalizedAmount / recommendedAmount, 1); // 最大100%
        totalNormalizedValue += ratio;
        ingredientCount++;
      }
    }

    if (ingredientCount === 0) return dailyCost;

    // 正規化価値で割ることで、実効コストを算出
    const averageValue = totalNormalizedValue / ingredientCount;
    return dailyCost / averageValue;
  }

  /**
   * バリュースコア計算（0-100）
   */
  private calculateValueScore(
    product: Product,
    costPerMg: Map<string, number>,
    normalizedCost: number
  ): number {
    let score = 50; // ベーススコア

    // 1. 成分数ボーナス（最大+20）
    const ingredientBonus = Math.min(product.ingredients.length * 2, 20);
    score += ingredientBonus;

    // 2. コスト効率（最大+30）
    // 正規化コストが低いほど高スコア
    if (normalizedCost < 100) score += 30;
    else if (normalizedCost < 200) score += 20;
    else if (normalizedCost < 300) score += 10;

    // 3. 成分濃度ボーナス（最大+20）
    let concentrationBonus = 0;
    for (const ingredient of product.ingredients) {
      const recommended = RECOMMENDED_DAILY_AMOUNTS.get(
        ingredient.name.toLowerCase().replace(/\s+/g, '-')
      );

      if (recommended) {
        const normalizedAmount = this.normalizeToMg(ingredient.amount, ingredient.unit);
        const recommendedAmount = this.normalizeToMg(recommended.min, recommended.unit);

        if (normalizedAmount >= recommendedAmount) {
          concentrationBonus += 5;
        }
      }
    }
    score += Math.min(concentrationBonus, 20);

    // 4. mg単価ペナルティ（最大-20）
    // 平均mg単価が高すぎる場合
    const avgCostPerMg = Array.from(costPerMg.values()).reduce((a, b) => a + b, 0) / costPerMg.size;
    if (avgCostPerMg > 10) score -= 20;
    else if (avgCostPerMg > 5) score -= 10;

    return Math.min(Math.max(score, 0), 100);
  }

  /**
   * インサイト生成
   */
  private generateInsights(product: Product, metrics: any): string[] {
    const insights: string[] = [];

    // 1日コストの評価
    if (metrics.pricePerDay < 50) {
      insights.push('💰 非常にリーズナブルな価格設定（1日50円未満）');
    } else if (metrics.pricePerDay < 100) {
      insights.push('✅ 手頃な価格設定（1日100円未満）');
    } else if (metrics.pricePerDay > 300) {
      insights.push('⚠️ 高価格帯の商品（1日300円以上）');
    }

    // 供給日数
    if (metrics.daysSupply > 60) {
      insights.push(`📦 大容量パッケージ（${Math.round(metrics.daysSupply)}日分）`);
    } else if (metrics.daysSupply < 30) {
      insights.push(`📦 小容量パッケージ（${Math.round(metrics.daysSupply)}日分）`);
    }

    // バリュースコア
    if (metrics.valueScore >= 80) {
      insights.push('🌟 優れたコストパフォーマンス');
    } else if (metrics.valueScore >= 60) {
      insights.push('👍 良好なコストパフォーマンス');
    } else if (metrics.valueScore < 40) {
      insights.push('💡 コストパフォーマンスに改善の余地あり');
    }

    // 成分濃度
    const highConcentration = product.ingredients.filter(i => {
      const recommended = RECOMMENDED_DAILY_AMOUNTS.get(
        i.name.toLowerCase().replace(/\s+/g, '-')
      );
      if (!recommended) return false;
      const normalizedAmount = this.normalizeToMg(i.amount, i.unit);
      const recommendedAmount = this.normalizeToMg(recommended.min, recommended.unit);
      return normalizedAmount >= recommendedAmount;
    });

    if (highConcentration.length > 0) {
      insights.push(`💊 推奨摂取量を満たす成分: ${highConcentration.map(i => i.name).join(', ')}`);
    }

    return insights;
  }

  /**
   * レポートインサイト生成
   */
  private generateReportInsights(
    analyses: PriceAnalysis[],
    byIngredient: Map<string, ComparisonResult>,
    byBrand: Map<string, BrandAnalysis>
  ): string[] {
    const insights: string[] = [];

    // 価格帯の分析
    const avgDailyCost = analyses.reduce((sum, a) => sum + a.metrics.pricePerDay, 0) / analyses.length;
    insights.push(`平均1日コスト: ${Math.round(avgDailyCost)}円`);

    // 最もコスパの良い成分
    let bestIngredientValue = { name: '', savings: 0 };
    byIngredient.forEach((comparison, ingredient) => {
      if (comparison.bestValue && comparison.bestValue.savings > bestIngredientValue.savings) {
        bestIngredientValue = {
          name: ingredient,
          savings: comparison.bestValue.savings
        };
      }
    });

    if (bestIngredientValue.name) {
      insights.push(
        `${bestIngredientValue.name}で最大${Math.round(bestIngredientValue.savings)}円/日の節約可能`
      );
    }

    // ブランド分析
    const premiumBrands = Array.from(byBrand.values())
      .filter(b => b.pricePositioning === 'premium')
      .map(b => b.brand);

    if (premiumBrands.length > 0) {
      insights.push(`プレミアムブランド: ${premiumBrands.join(', ')}`);
    }

    return insights;
  }

  /**
   * 推奨事項の生成
   */
  private generateRecommendations(
    summary: any,
    byIngredient: Map<string, ComparisonResult>,
    byBrand: Map<string, BrandAnalysis>
  ): string[] {
    const recommendations: string[] = [];

    // 価格に基づく推奨
    if (summary.averageDailyCost > 200) {
      recommendations.push('💡 よりコスパの良い商品への切り替えで、月間コストを大幅削減できる可能性があります');
    }

    // トップバリュー商品
    if (summary.topValue.length > 0) {
      recommendations.push(
        `🏆 最もコスパが良い商品: ${summary.topValue[0].name} (${summary.topValue[0].brand})`
      );
    }

    // 成分別の推奨
    byIngredient.forEach((comparison, ingredient) => {
      if (comparison.bestValue && comparison.bestValue.savingsPercent > 50) {
        recommendations.push(
          `💰 ${ingredient}: ${comparison.bestValue.product.name}への切り替えで${Math.round(comparison.bestValue.savingsPercent)}%節約可能`
        );
      }
    });

    // まとめ買いの推奨
    const bulkProducts = summary.topValue.filter((p: Product) => p.quantity > 90);
    if (bulkProducts.length > 0) {
      recommendations.push('📦 大容量パッケージの購入で、単価を抑えることができます');
    }

    return recommendations;
  }

  /**
   * ブランドごとにグループ化
   */
  private groupByBrand(products: Product[]): Map<string, Product[]> {
    const groups = new Map<string, Product[]>();

    for (const product of products) {
      if (!groups.has(product.brand)) {
        groups.set(product.brand, []);
      }
      groups.get(product.brand)!.push(product);
    }

    return groups;
  }

  /**
   * 価格ポジショニングの判定
   */
  private determinePricePositioning(avgPrice: number): 'premium' | 'mid-range' | 'budget' {
    if (avgPrice > 300) return 'premium';
    if (avgPrice > 100) return 'mid-range';
    return 'budget';
  }

  /**
   * 中央値計算
   */
  private median(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      return (sorted[mid - 1] + sorted[mid]) / 2;
    }

    return sorted[mid];
  }
}

// CLI実行
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
${chalk.bold('Price Calculator - サプリメント価格分析ツール')}

使用法:
  price-calculator <file> [options]

オプション:
  --mode <mode>       動作モード (analyze|compare|report) [default: analyze]
  --ingredient <name> 比較対象の成分名 (compareモード時)
  --currency <code>   通貨コード [default: JPY]
  --output <path>     レポート出力先

例:
  price-calculator products.json --mode analyze
  price-calculator products.json --mode compare --ingredient "vitamin-c"
  price-calculator products.json --mode report --output report.json
`);
    process.exit(0);
  }

  try {
    const calculator = new PriceCalculator();
    const filePath = args[0];

    // ファイル読み込み
    const content = await fs.readFile(filePath, 'utf-8');
    const products: Product[] = JSON.parse(content);

    // モード取得
    const modeIndex = args.indexOf('--mode');
    const mode = modeIndex !== -1 ? args[modeIndex + 1] : 'analyze';

    if (mode === 'analyze') {
      // 単一商品分析
      for (const product of products) {
        const analysis = await calculator.analyze(product);

        console.log(chalk.blue.bold(`\n📊 ${product.name} (${product.brand})`));
        console.log(chalk.gray('─'.repeat(50)));

        console.log(`💰 価格情報:`);
        console.log(`  1回分: ${Math.round(analysis.metrics.pricePerServing)}円`);
        console.log(`  1日: ${Math.round(analysis.metrics.pricePerDay)}円`);
        console.log(`  1ヶ月: ${Math.round(analysis.metrics.pricePerMonth)}円`);
        console.log(`  供給日数: ${Math.round(analysis.metrics.daysSupply)}日`);

        console.log(`\n⚡ バリュースコア: ${analysis.metrics.valueScore}/100`);
        console.log(`📈 正規化コスト: ${Math.round(analysis.metrics.normalizedCost)}円/日`);

        if (analysis.insights.length > 0) {
          console.log(`\n💡 インサイト:`);
          analysis.insights.forEach(insight => console.log(`  ${insight}`));
        }
      }

    } else if (mode === 'compare') {
      // 成分比較
      const ingredientIndex = args.indexOf('--ingredient');
      if (ingredientIndex === -1) {
        console.error(chalk.red('エラー: --ingredient オプションが必要です'));
        process.exit(1);
      }

      const ingredient = args[ingredientIndex + 1];
      const comparison = await calculator.compare(products, ingredient);

      console.log(chalk.blue.bold(`\n🔍 ${ingredient} の価格比較`));
      console.log(chalk.gray('─'.repeat(50)));

      comparison.products.forEach((p, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
        console.log(`${medal} ${p.product.name}`);
        console.log(`    mg単価: ${p.costPerMg.toFixed(4)}円`);
        console.log(`    含有量: ${p.amount}${p.unit}`);
        console.log(`    1日コスト: ${Math.round(p.dailyCost)}円`);
      });

      if (comparison.bestValue) {
        console.log(chalk.green(`\n✨ 最良の選択: ${comparison.bestValue.product.name}`));
        console.log(chalk.green(`   節約額: ${Math.round(comparison.bestValue.savings)}円/日`));
        console.log(chalk.green(`   節約率: ${Math.round(comparison.bestValue.savingsPercent)}%`));
      }

    } else if (mode === 'report') {
      // 完全レポート
      const report = await calculator.generateReport(products);

      console.log(chalk.blue.bold('\n📋 価格分析レポート'));
      console.log(chalk.gray('='.repeat(50)));

      console.log(`\n📊 サマリー:`);
      console.log(`  商品数: ${report.summary.totalProducts}`);
      console.log(`  平均1日コスト: ${Math.round(report.summary.averageDailyCost)}円`);
      console.log(`  中央値: ${Math.round(report.summary.medianDailyCost)}円`);
      console.log(`  価格帯: ${Math.round(report.summary.priceRange.min)}円 〜 ${Math.round(report.summary.priceRange.max)}円`);

      console.log(`\n🏆 トップバリュー商品:`);
      report.summary.topValue.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name} (${product.brand})`);
      });

      console.log(`\n💡 推奨事項:`);
      report.recommendations.forEach(rec => console.log(`  • ${rec}`));

      // ファイル出力
      const outputIndex = args.indexOf('--output');
      if (outputIndex !== -1) {
        const outputPath = args[outputIndex + 1];
        await fs.writeFile(outputPath, JSON.stringify(report, null, 2));
        console.log(chalk.green(`\n✅ レポート保存: ${outputPath}`));
      }
    }

  } catch (error) {
    console.error(chalk.red(`エラー: ${error.message}`));
    logger.error('実行エラー', error as Error);
    process.exit(1);
  }
}

// ESモジュール用のメインチェック
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { PriceCalculator };